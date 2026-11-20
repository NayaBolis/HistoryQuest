/*
 * مغامرة التاريخ — محرك التقدم (نسخة مستقلة)
 * يخزّن التقدم محليًا على الجهاز (localStorage) بنفس بيانات النسخة الأصلية.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "history-quest-progress-v1";
  var SOUND_KEY = "history-quest-sound";

  var DEFAULTS = { points: 0, completed_lessons: [], achievements: [], games_played: 0, last_lesson_id: "" };

  var TOTAL_LESSONS = (window.HQ_DATA && window.HQ_DATA.lessons ? window.HQ_DATA.lessons.length : 12);

  var ACHIEVEMENTS = [
    { id: "first-step", title: "أول خطوة", description: "أكملت أول لعبة في الموقع", check: function (p) { return p.games_played >= 1; } },
    { id: "first-lesson", title: "بداية الرحلة", description: "أكملت قراءة أول درس", check: function (p) { return p.completed_lessons.length >= 1; } },
    { id: "reader", title: "قارئ نهم", description: "أكملت 5 دروس من المنهج", check: function (p) { return p.completed_lessons.length >= 5; } },
    { id: "scholar", title: "مؤرخ مبتدئ", description: "جمعت 100 نقطة", check: function (p) { return p.points >= 100; } },
    { id: "expert", title: "خبير التاريخ", description: "جمعت 300 نقطة", check: function (p) { return p.points >= 300; } },
    { id: "persistent", title: "مثابر", description: "لعبت 10 ألعاب", check: function (p) { return p.games_played >= 10; } },
    { id: "encyclopedia", title: "موسوعة المنهج", description: "أكملت كل دروس المنهج", check: function (p) { return p.completed_lessons.length >= TOTAL_LESSONS; } }
  ];

  var LEVEL_TITLES = ["مبتدئ", "مستكشف", "باحث", "مؤرخ", "خبير", "حكيم الزمن"];

  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        var out = {}, k;
        for (k in DEFAULTS) out[k] = data[k] !== undefined ? data[k] : DEFAULTS[k];
        return out;
      }
    } catch (e) { /* التخزين غير متاح */ }
    return JSON.parse(JSON.stringify(DEFAULTS));
  }

  var state = load();

  function save() {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function updateAchievements() {
    var have = {};
    (state.achievements || []).forEach(function (a) { have[a] = true; });
    ACHIEVEMENTS.forEach(function (a) { if (!have[a.id] && a.check(state)) have[a.id] = true; });
    state.achievements = Object.keys(have);
  }

  function mutate(fn) {
    var next = JSON.parse(JSON.stringify(state));
    var patch = fn(next) || next;
    for (var k in DEFAULTS) { if (patch[k] === undefined) patch[k] = DEFAULTS[k]; }
    state = patch;
    updateAchievements();
    save();
    notify();
  }

  var listeners = [];
  function notify() { for (var i = 0; i < listeners.length; i++) listeners[i](state); }

  /* ————— الأصوات ————— */
  var audioCtx = null;
  var TONES = { correct: [660, 880], wrong: [220, 180], click: [440], win: [523, 659, 784] };

  function soundEnabled() {
    try { return window.localStorage.getItem(SOUND_KEY) !== "off"; } catch (e) { return true; }
  }
  function setSoundEnabled(on) {
    try { window.localStorage.setItem(SOUND_KEY, on ? "on" : "off"); } catch (e) { /* ignore */ }
  }
  function play(name) {
    if (!soundEnabled()) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      if (audioCtx.state === "suspended") { audioCtx.resume().catch(function () {}); }
    (TONES[name] || TONES.click).forEach(function (freq, i) {
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      var at = audioCtx.currentTime + i * 0.09;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.09, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(at);
      osc.stop(at + 0.24);
      });
    } catch (e) { /* الصوت غير متاح */ }
  }

  function level(points) {
    var lvl = Math.floor((points || 0) / 100) + 1;
    return {
      level: lvl,
      title: LEVEL_TITLES[Math.min(lvl - 1, LEVEL_TITLES.length - 1)],
      progress: (points || 0) % 100,
      nextAt: lvl * 100
    };
  }

  window.HQProgress = {
    get: function () { return JSON.parse(JSON.stringify(state)); },
    subscribe: function (fn) { listeners.push(fn); fn(state); },
    addPoints: function (n) { mutate(function (p) { p.points = (p.points || 0) + n; }); },
    recordGame: function (earned) {
      mutate(function (p) { p.points = (p.points || 0) + earned; p.games_played = (p.games_played || 0) + 1; });
    },
    completeLesson: function (id) {
      mutate(function (p) {
        if (p.completed_lessons.indexOf(id) === -1) {
          p.completed_lessons = p.completed_lessons.concat([id]);
          p.points = (p.points || 0) + 10;
        }
        p.last_lesson_id = id;
      });
    },
    setLastLesson: function (id) { mutate(function (p) { p.last_lesson_id = id; }); },
    reset: function () { state = JSON.parse(JSON.stringify(DEFAULTS)); save(); notify(); },
    level: level,
    achievements: ACHIEVEMENTS,
    soundEnabled: soundEnabled,
    setSoundEnabled: setSoundEnabled,
    play: play
  };
})();
