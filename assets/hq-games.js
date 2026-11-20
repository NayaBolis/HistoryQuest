/*
 * مغامرة التاريخ — محرك الألعاب (نسخة مستقلة)
 * نفس القواعد والنقاط والواجهات: التحديات، من أنا؟، التحدي الزمني، اللغز التاريخي
 */
(function () {
  "use strict";

  var P = window.HQProgress;
  var D = window.HQ_DATA;

  /* ————— أيقونات (Lucide) ————— */
  function svg(icon, cls) {
    var paths = ICONS[icon] || "";
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' + (cls || "h-4 w-4") + '">' + paths + "</svg>";
  }
  var ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    "arrow-right": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    "rotate-ccw": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    puzzle: '<path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.471-.057-.939-.168-1.395-.333-.455-.166-.908-.33-1.366-.413a2.056 2.056 0 0 0-1.727.29 2.05 2.05 0 0 0-.872 1.5c-.04.466-.03.934.017 1.4.054.56.18 1.114.38 1.66a.97.97 0 0 1-.26 1.04L13.189 21.4c-.46.44-1.05.66-1.64.66-.59 0-1.18-.22-1.64-.66l-1.61-1.61a.98.98 0 0 1-.28-.84c.06-.47.17-.94.34-1.4.16-.45.32-.9.4-1.36a2.056 2.056 0 0 0-.29-1.73 2.05 2.05 0 0 0-1.5-.87c-.47-.04-.93-.03-1.4.02-.56.05-1.11.18-1.66.38a.97.97 0 0 1-1.04-.26L2.6 13.19c-.44-.46-.66-1.05-.66-1.64 0-.59.22-1.18.66-1.64l1.61-1.61a.98.98 0 0 1 .84-.28c.47.06.94.17 1.4.34.45.16.9.32 1.36.4a2.056 2.056 0 0 0 1.73-.29 2.05 2.05 0 0 0 .87-1.5c.04-.47.03-.93-.02-1.4-.05-.56-.18-1.11-.38-1.66a.97.97 0 0 1 .26-1.04l1.61-1.61c.46-.44 1.05-.66 1.64-.66.59 0 1.18.22 1.64.66l1.61 1.61a.98.98 0 0 1 .28.84c-.06.47-.17.94-.34 1.4-.16.45-.32.9-.4 1.36a2.056 2.056 0 0 0 .29 1.73 2.05 2.05 0 0 0 1.5.87z"/>',
    swords: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 10"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>',
    "circle-check": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'
  };

  /* ————— أدوات ————— */
  function shuffle(a) {
    var t = a.slice();
    for (var i = t.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = t[i]; t[i] = t[j]; t[j] = tmp;
    }
    return t;
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function findMain() { return document.querySelector("main"); }

  /* ترويسة اللعبة: رابط العودة + الأيقونة + العنوان */
  function panel(title, subtitle, icon, bodyHtml) {
    return '<div class="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">' +
      '<a href="' + BASE + 'games/index.html" class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">' + svg("arrow-right") + "كل الألعاب</a>" +
      '<div class="mt-4 flex items-start gap-4">' +
        '<span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25">' + svg(icon, "h-7 w-7") + "</span>" +
        "<div><h1 class=\"text-2xl font-bold text-foreground sm:text-3xl\">" + esc(title) + "</h1>" +
        '<p class="mt-1 text-sm text-muted-foreground">' + esc(subtitle) + "</p></div>" +
      "</div>" +
      '<div class="mt-8">' + bodyHtml + "</div></div>";
  }

  function primaryBtn(label, icon) {
    return '<button type="button" data-action="primary" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-7 text-base font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">' + label + (icon ? svg(icon, "mr-2 h-4 w-4") : "") + "</button>";
  }

  /* لوحة النتيجة */
  function resultPanel(opts) {
    var confetti = opts.earned > 0 ? CONFETTI : "";
    return '<div class="ornate-card p-8 text-center">' + confetti +
      '<h2 class="mt-5 text-2xl font-bold text-foreground">انتهت الجولة!</h2>' +
      (opts.message ? '<p class="mt-2 text-sm text-muted-foreground">' + esc(opts.message) + "</p>" : "") +
      '<div class="mt-6 flex items-center justify-center gap-8">' +
        '<div><div class="font-display text-4xl font-bold text-foreground">' + opts.score + '<span class="text-xl text-muted-foreground"> / ' + opts.total + "</span></div>" +
        '<div class="mt-1 text-xs font-medium text-muted-foreground">الإجابات الصحيحة</div></div>' +
        '<div class="h-12 w-px bg-border"></div>' +
        '<div><div class="flex items-center justify-center gap-1.5 font-display text-4xl font-bold text-primary">' + svg("star", "h-6 w-6") + opts.earned + "</div>" +
        '<div class="mt-1 text-xs font-medium text-muted-foreground">نقاط أضيفت لتقدمك</div></div>' +
      "</div>" +
      '<div class="mt-8 flex flex-wrap justify-center gap-3">' +
        '<button type="button" data-action="restart" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90">' + svg("rotate-ccw", "ml-2 h-4 w-4") + "العب مرة أخرى</button>" +
        '<a href="' + BASE + 'games/index.html" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-input bg-transparent px-7 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">لعبة أخرى' + svg("arrow-left", "mr-2 h-4 w-4") + "</a>" +
      "</div></div>";
  }

  /* كونفيتي بسيط عند الفوز */
  var CONFETTI = "";
  function fireConfetti() {
    var colors = ["#d4af37", "#f0d68a", "#1a2a3a", "#c05746"];
    var holder = document.createElement("div");
    holder.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden";
    var html = "";
    for (var i = 0; i < 80; i++) {
      var left = Math.random() * 100;
      var delay = Math.random() * 0.5;
      var dur = 1.4 + Math.random() * 1.2;
      var c = colors[i % colors.length];
      var size = 6 + Math.random() * 6;
      var rot = Math.random() * 360;
      html += '<span style="position:absolute;top:-12px;left:' + left + "%;width:" + size + "px;height:" + (size * 0.5) + "px;background:" + c + ";border-radius:2px;transform:rotate(" + rot + "deg);opacity:.9;animation:hq-fall " + dur + "s ease-in " + delay + 's forwards"></span>';
    }
    holder.innerHTML = html;
    document.body.appendChild(holder);
    var style = document.createElement("style");
    style.textContent = "@keyframes hq-fall{to{transform:translateY(105vh) rotate(560deg);opacity:0}}";
    document.head.appendChild(style);
    setTimeout(function () { holder.remove(); }, 3200);
  }

  /* زر خيار */
  function optionBtn(text, cls) {
    return '<button type="button" class="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-right text-sm font-medium transition-colors ' + cls + '"><span>' + esc(text) + "</span></button>";
  }

  var CORRECT_CLS = "border-emerald-500/60 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-200";
  var WRONG_CLS = "border-destructive/60 bg-destructive/10 text-destructive dark:text-red-300";
  var IDLE_CLS = "border-border bg-card hover:border-primary/50 hover:bg-primary/5 active:bg-primary/10";

  /* خلط مواضع الخيارات حتى لا تكون الإجابة الصحيحة دائمًا في أول موضع */
  function mixOptions(options, answerIdx) {
    var order = shuffle(options.map(function (_, i) { return i; }));
    return { options: order.map(function (i) { return options[i]; }), answer: order.indexOf(answerIdx) };
  }
  function remix(q) {
    var out = {};
    for (var k in q) out[k] = q[k];
    var m = mixOptions(q.options, q.answer);
    out.options = m.options;
    out.answer = m.answer;
    return out;
  }

  /* شاشة البداية */
  function startScreen(icon, title, subtitle, bodyText) {
    return panel(title, subtitle, icon,
      '<div class="ornate-card p-8 text-center"><p class="mx-auto max-w-md text-muted-foreground">' + bodyText + "</p>" +
      '<div class="mt-6">' + primaryBtn("ابدأ", null).replace('data-action="primary"', 'data-action="start"') + "</div></div>");
  }

  var BASE = (typeof window.HQ_BASE === "string" && window.HQ_BASE) ? window.HQ_BASE : (function () {
    var s = document.querySelector('script[src*="hq-games"]');
    return s ? s.src.replace(/assets\/hq-games\.js.*$/, "") : "";
  })();

  function mount(root, html) { root.innerHTML = html; bind(root); }

  /* ربط الأحداث العامة */
  function bind(root) {
    root.querySelectorAll("[data-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var fn = actions[btn.getAttribute("data-action")];
        if (fn) fn(btn);
      });
    });
  }

  var actions = {};
  var current = null;

  function run(engine) {
    current = engine;
    var root = findMain();
    if (!root) return;
    actions.start = function () { P.play("click"); engine.start(root); };
    actions.restart = function () { P.play("click"); engine.start(root); };
    engine.renderStart(root);
  }

  /* ————————————— اللغز التاريخي ————————————— */
  function riddleGame() {
    var root, questions, idx, hints, picked, correct, earned;
    function start(r) {
      root = r;
      questions = shuffle(D.riddles).slice(0, 4).map(remix);
      idx = 0; hints = 0; picked = null; correct = 0; earned = 0;
      renderQ();
    }
    function renderQ() {
      var q = questions[idx];
      var clues = q.clues.slice(0, hints).map(function (c, i) {
        return '<li class="flex items-start gap-2 rounded-xl bg-primary/8 p-3 text-sm text-foreground/85">' + svg("lightbulb", "mt-0.5 h-4 w-4 shrink-0 text-primary") + esc(c) + "</li>";
      }).join("");
      var reveal = hints < q.clues.length && picked === null
        ? '<button type="button" data-action="hint" class="mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-input bg-transparent px-3 text-xs font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground h-8">' + svg("eye", "ml-1.5 h-4 w-4") + "أظهر تلميحًا</button>"
        : "";
      var options = q.options.map(function (o, i) {
        var cls = IDLE_CLS;
        if (picked !== null) {
          if (i === q.answer) { cls = CORRECT_CLS; }
          else if (i === picked) { cls = WRONG_CLS; }
        }
        return optionBtn(o, cls).replace('class="', 'data-option="' + i + '" class="');
      }).join("");
      var next = picked !== null
        ? '<button type="button" data-action="next" class="mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90">' + (idx + 1 >= questions.length ? "شاهد النتيجة" : "اللغز التالي") + svg("arrow-left", "mr-2 h-4 w-4") + "</button>"
        : "";
      var explain = picked !== null
        ? '<div class="mt-6 rounded-2xl border border-primary/25 bg-primary/5 p-4"><div class="flex items-start gap-2">' + svg("lightbulb", "mt-0.5 h-4 w-4 shrink-0 text-primary") + '<p class="text-sm leading-relaxed text-foreground/85">' + esc(q.explanation) + "</p></div>" + next + "</div>"
        : "";
      mount(root, panel("اللغز التاريخي", "حل الألغاز بالاعتماد على أحداث المنهج وتلميحاته.", "puzzle",
        '<div class="mb-4 flex items-center justify-between text-sm font-medium text-muted-foreground"><span>اللغز ' + (idx + 1) + " من " + questions.length + '</span><span class="text-primary">' + earned + ' نقطة</span></div>' +
        '<div class="ornate-card p-6 sm:p-8">' +
          '<p class="text-sm font-semibold text-muted-foreground">الأدلة:</p>' +
          (clues.length ? '<ul class="mt-3 space-y-2.5">' + clues + "</ul>" : "") +
          reveal +
          '<h2 class="mt-5 text-lg font-bold leading-relaxed text-foreground sm:text-xl">' + esc(q.question) + "</h2>" +
          '<div class="mt-6 grid gap-3">' + options + "</div>" +
          explain +
        "</div>"));
      actions.hint = function () { P.play("click"); hints++; renderQ(); };
      actions.next = function () {
        P.play("click");
        if (idx + 1 >= questions.length) { P.recordGame(earned); P.play("win"); fireConfetti(); renderDone(); }
        else { idx++; hints = 0; picked = null; renderQ(); }
      };
      root.querySelectorAll("[data-option]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (picked !== null) return;
          var i = parseInt(btn.getAttribute("data-option"), 10);
          picked = i;
          if (i === questions[idx].answer) {
            var pts = hints === 0 ? 15 : 8;
            earned += pts; correct++;
            P.play("correct");
          } else { P.play("wrong"); }
          renderQ();
        });
      });
    }
    function renderDone() {
      mount(root, panel("اللغز التاريخي", "حل الألغاز بالاعتماد على أحداث المنهج وتلميحاته.", "puzzle",
        resultPanel({ score: correct, total: questions.length, earned: earned, message: "ألغاز بدون تلميحات تمنحك 15 نقطة، ومع تلميح 8 نقاط." })));
    }
    return {
      renderStart: function (r) {
        root = r;
        mount(root, startScreen("puzzle", "اللغز التاريخي", "حل الألغاز بالاعتماد على أحداث المنهج وتلميحاته.",
          "في كل جولة أربعة ألغاز من المنهج. الإجابة الصحيحة بدون تلميحات تمنحك 15 نقطة، ومع تلميح 8 نقاط. يمكنك كشف التلميحات تدريجيًا قبل الإجابة."));
      },
      start: start
    };
  }

  /* ————————————— من أنا؟ ————————————— */
  function whoamiGame() {
    var root, chars, idx, cluesShown, picked, correct, earned;
    var POINTS = { 1: 15, 2: 10, 3: 5 };
    function start(r) {
      root = r;
      chars = shuffle(D.whoAmI).slice(0, 6).map(function (c) {
        var out = {};
        for (var k in c) out[k] = c[k];
        out.options = shuffle(c.options.slice()); // الإجابة نصّ فلا تتأثر بالترتيب
        return out;
      });
      idx = 0; cluesShown = 1; picked = null; correct = 0; earned = 0;
      renderQ();
    }
    function renderQ() {
      var c = chars[idx];
      var clues = c.clues.slice(0, cluesShown).map(function (cl, i) {
        return '<li class="flex items-start gap-3 rounded-2xl border border-border/80 bg-secondary/40 p-4"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary">' + (i + 1) + '</span><p class="text-sm leading-relaxed text-foreground/90">' + esc(cl) + "</p></li>";
      }).join("");
      var reveal = cluesShown < 3 && picked === null
        ? '<button type="button" data-action="hint" class="mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-input bg-transparent px-3 text-xs font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground h-8">' + svg("eye", "ml-1.5 h-4 w-4") + "اكشف دليلًا آخر (نقاط أقل)</button>"
        : "";
      var options = c.options.map(function (o, i) {
        var cls = IDLE_CLS;
        if (picked !== null) {
          if (o === c.answer) { cls = CORRECT_CLS; }
          else if (o === picked) { cls = WRONG_CLS; }
        }
        return optionBtn(o, cls).replace('class="', 'data-option="' + i + '" class="');
      }).join("");
      var note = picked !== null
        ? '<div class="mt-6 rounded-2xl border border-primary/25 bg-primary/5 p-4"><div class="flex items-start gap-2">' + svg("lightbulb", "mt-0.5 h-4 w-4 shrink-0 text-primary") + '<p class="text-sm leading-relaxed text-foreground/85">' + esc(c.note) + "</p></div>" +
          '<button type="button" data-action="next" class="mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90">' + (idx + 1 >= chars.length ? "شاهد النتيجة" : "الشخصية التالية") + "</button></div>"
        : "";
      mount(root, panel("من أنا؟", "اقرأ الأدلة واحدًا بعد الآخر، وكلما عرفت الشخصية بدليل أقل زادت نقاطك.", "puzzle",
        '<div class="mb-4 flex items-center justify-between text-sm font-medium text-muted-foreground"><span>الشخصية ' + (idx + 1) + " من " + chars.length + '</span><span class="text-primary">' + correct + ' صحيحة</span></div>' +
        '<div class="ornate-card p-6 sm:p-8">' +
          '<ul class="space-y-3">' + clues + "</ul>" + reveal +
          '<div class="mt-6 grid gap-3 sm:grid-cols-2">' + options + "</div>" + note +
        "</div>"));
      actions.hint = function () { P.play("click"); cluesShown++; renderQ(); };
      actions.next = function () {
        P.play("click");
        if (idx + 1 >= chars.length) { P.recordGame(earned); P.play("win"); fireConfetti(); renderDone(); }
        else { idx++; cluesShown = 1; picked = null; renderQ(); }
      };
      root.querySelectorAll("[data-option]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (picked !== null) return;
          var i = parseInt(btn.getAttribute("data-option"), 10);
          picked = c.options[i];
          if (picked === c.answer) { earned += POINTS[cluesShown] || 5; correct++; P.play("correct"); }
          else { P.play("wrong"); }
          renderQ();
        });
      });
    }
    function renderDone() {
      mount(root, panel("من أنا؟", "اقرأ الأدلة واحدًا بعد الآخر، وكلما عرفت الشخصية بدليل أقل زادت نقاطك.", "puzzle",
        resultPanel({ score: correct, total: chars.length, earned: earned, message: "أعد اللعب وحاول التعرف على الشخصيات بأقل عدد من الأدلة." })));
    }
    return {
      renderStart: function (r) {
        root = r;
        mount(root, startScreen("puzzle", "من أنا؟", "اقرأ الأدلة واحدًا بعد الآخر، وكلما عرفت الشخصية بدليل أقل زادت نقاطك.",
          "ستظهر لك أدلة عن شخصية من المنهج، ومع كل دليل إضافي تقل نقاط السؤال: دليل واحد 15 نقطة، دليلان 10 نقاط، ثلاثة أدلة 5 نقاط."));
      },
      start: start
    };
  }

  /* ————————————— التحدي الزمني ————————————— */
  function timelineGame() {
    var root, rounds, idx, events, placed, done, errors, earned;
    function start(r) {
      root = r;
      rounds = D.timelineRounds;
      idx = 0; placed = []; done = false; errors = 0; earned = 0;
      events = shuffle(rounds[idx].events);
      renderQ();
    }
    function renderQ() {
      var round = rounds[idx];
      var nextBtn = done
        ? '<div class="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4"><p class="text-sm font-semibold text-emerald-900">' + svg("circle-check", "h-4 w-4") + "أحسنت! اكتمل ترتيب الجولة" + (errors === 0 ? " بدون أخطاء" : "") + "</p>" +
          '<button type="button" data-action="next" class="mt-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90">' + (idx + 1 >= rounds.length ? "شاهد النتيجة" : "الجولة التالية") + svg("arrow-left", "mr-2 h-4 w-4") + "</button></div>"
        : "";
      var ordered = round.events.map(function (e, i) {
        var p = placed[i];
        return '<li class="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ' + (p ? "border-primary/40 bg-primary/10 font-semibold text-foreground" : "border-dashed border-border bg-secondary/30 text-muted-foreground") + '">' +
          '<span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-card font-display text-sm font-bold text-primary ring-1 ring-primary/25">' + (i + 1) + "</span>" +
          (p ? "<span>" + esc(p.label) + ' <span class="text-xs text-muted-foreground">(' + p.year + ")</span></span>" : "<span>—</span>") + "</li>";
      }).join("");
      var remaining = events.filter(function (e) { return !placed.some(function (p) { return p.label === e.label; }); });
      var choices = done ? "" :
        '<p class="mt-6 text-sm font-semibold text-muted-foreground">اختر الحدث التالي في الترتيب:</p><div class="mt-3 grid gap-2.5">' +
        remaining.map(function (e) {
          return '<button type="button" data-event="' + esc(e.label) + '" class="rounded-2xl border border-border bg-card px-4 py-3 text-right text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5">' + esc(e.label) + "</button>";
        }).join("") + "</div>";
      mount(root, panel("التحدي الزمني", "رتّب الأحداث التاريخية بالترتيب الزمني الصحيح وتدرّب على حفظ التواريخ.", "swords",
        '<div class="mb-4 flex items-center justify-between text-sm font-medium text-muted-foreground"><span>الجولة ' + (idx + 1) + " من " + rounds.length + " · " + esc(round.title) + '</span><span class="text-primary">' + earned + ' نقطة</span></div>' +
        '<div class="ornate-card p-6 sm:p-8">' +
          '<p class="text-sm font-semibold text-muted-foreground">الترتيب الصحيح حتى الآن:</p>' +
          '<ol class="mt-3 space-y-2">' + ordered + "</ol>" +
          choices + nextBtn +
        "</div>"));
      actions.next = function () {
        P.play("click");
        if (idx + 1 >= rounds.length) { P.recordGame(earned); P.play("win"); fireConfetti(); renderDone(); }
        else {
          idx++; placed = []; done = false; errors = 0;
          events = shuffle(rounds[idx].events);
          renderQ();
        }
      };
      root.querySelectorAll("[data-event]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (done) return;
          var label = btn.getAttribute("data-event");
          var ev = events.filter(function (e) { return e.label === label; })[0];
          if (!ev) return;
          var remainingSorted = events.filter(function (e) { return !placed.some(function (p) { return p.label === e.label; }); })
            .slice().sort(function (a, b) { return a.year - b.year; });
          if (ev.year === remainingSorted[0].year) {
            placed.push(ev);
            if (placed.length === round.events.length) {
              done = true;
              earned += errors === 0 ? 20 : 10;
              P.play("correct");
            } else { P.play("click"); }
          } else {
            errors++;
            P.play("wrong");
          }
          renderQ();
        });
      });
    }
    function renderDone() {
      mount(root, panel("التحدي الزمني", "رتّب الأحداث التاريخية بالترتيب الزمني الصحيح وتدرّب على حفظ التواريخ.", "swords",
        resultPanel({ score: rounds.length, total: rounds.length, earned: earned, message: "الجولة بدون أخطاء تمنحك 20 نقطة، ومع أخطاء 10 نقاط." })));
    }
    return {
      renderStart: function (r) {
        root = r;
        mount(root, startScreen("swords", "التحدي الزمني", "رتّب الأحداث التاريخية بالترتيب الزمني الصحيح وتدرّب على حفظ التواريخ.",
          "في كل جولة أربعة أحداث من المنهج. اضغط الحدث الأقدم أولًا، ثم الذي يليه. الجولة الكاملة بدون أخطاء تمنحك 20 نقطة، ومع الأخطاء 10 نقاط."));
      },
      start: start
    };
  }

  /* ————————————— التحديات التاريخية ————————————— */
  function challengesGame() {
    var root, questions, idx, picked, correct, earned;
    var PER = 10;
    function start(r) {
      root = r;
      questions = shuffle(D.challenges).slice(0, 10).map(remix);
      idx = 0; picked = null; correct = 0; earned = 0;
      renderQ();
    }
    function renderQ() {
      var q = questions[idx];
      var options = q.options.map(function (o, i) {
        var cls = IDLE_CLS;
        if (picked !== null) {
          if (i === q.answer) { cls = CORRECT_CLS; }
          else if (i === picked) { cls = WRONG_CLS; }
        }
        return optionBtn(o, cls).replace('class="', 'data-option="' + i + '" class="');
      }).join("");
      var next = picked !== null
        ? '<button type="button" data-action="next" class="mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90">' + (idx + 1 >= questions.length ? "شاهد النتيجة" : "السؤال التالي") + svg("arrow-left", "mr-2 h-4 w-4") + "</button>"
        : "";
      var explain = picked !== null
        ? '<div class="mt-6 rounded-2xl border border-primary/25 bg-primary/5 p-4"><div class="flex items-start gap-2">' + svg("lightbulb", "mt-0.5 h-4 w-4 shrink-0 text-primary") + '<p class="text-sm leading-relaxed text-foreground/85">' + esc(q.explanation) + "</p></div>" + next + "</div>"
        : "";
      mount(root, panel("التحديات التاريخية", "عشرة أسئلة من المنهج، مع شرح الإجابة الصحيحة بعد كل سؤال.", "swords",
        '<div class="mb-4 flex items-center justify-between text-sm font-medium text-muted-foreground"><span>السؤال ' + (idx + 1) + " من " + questions.length + '</span><span class="flex items-center gap-1.5 text-primary">' + svg("circle-check") + correct + " صحيحة</span></div>" +
        '<div class="h-2 w-full overflow-hidden rounded-full bg-secondary"><div class="h-full rounded-full bg-primary transition-all duration-500" style="width:' + ((idx + (picked === null ? 0 : 1)) / questions.length * 100) + '%"></div></div>' +
        '<div class="ornate-card mt-6 p-6 sm:p-8">' +
          '<h2 class="text-lg font-bold leading-relaxed text-foreground sm:text-xl">' + esc(q.question) + "</h2>" +
          '<div class="mt-6 grid gap-3">' + options + "</div>" + explain +
        "</div>" +
        '<p class="mt-4 text-center text-xs text-muted-foreground">تريد مراجعة قبل الحل؟ <a href="' + BASE + 'lessons/index.html" class="font-semibold text-primary underline-offset-4 hover:underline">افتح الدروس</a></p>'));
      actions.next = function () {
        P.play("click");
        if (idx + 1 >= questions.length) { P.recordGame(earned); P.play("win"); fireConfetti(); renderDone(); }
        else { idx++; picked = null; renderQ(); }
      };
      root.querySelectorAll("[data-option]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (picked !== null) return;
          var i = parseInt(btn.getAttribute("data-option"), 10);
          picked = i;
          if (i === questions[idx].answer) { correct++; earned += PER; P.play("correct"); }
          else { P.play("wrong"); }
          renderQ();
        });
      });
    }
    function renderDone() {
      mount(root, panel("التحديات التاريخية", "عشرة أسئلة من المنهج، مع شرح الإجابة الصحيحة بعد كل سؤال.", "swords",
        resultPanel({ score: correct, total: questions.length, earned: earned, message: correct === questions.length ? "ممتاز! أجبت عن كل الأسئلة بشكل صحيح." : "راجع شرح الإجابات وحاول مرة أخرى لتحسين نتيجتك." })));
    }
    return {
      renderStart: function (r) {
        root = r;
        mount(root, startScreen("swords", "التحديات التاريخية", "عشرة أسئلة من المنهج، مع شرح الإجابة الصحيحة بعد كل سؤال.",
          "كل إجابة صحيحة تمنحك 10 نقاط. الأسئلة مختارة من دروس المنهج، ويمكنك اللعب أكثر من مرة للحصول على أسئلة مختلفة."));
      },
      start: start
    };
  }

  /* ————— الإقلاع حسب الصفحة ————— */
  window.HQGames = { riddle: riddleGame, whoami: whoamiGame, timeline: timelineGame, challenges: challengesGame, run: run };
  document.addEventListener("DOMContentLoaded", function () {
    var path = window.location.pathname;
    var main = findMain();
    if (!main) return;
    var engine = null;
    if (/\/games\/riddle/.test(path)) engine = riddleGame();
    else if (/\/games\/who-am-i/.test(path)) engine = whoamiGame();
    else if (/\/games\/timeline/.test(path)) engine = timelineGame();
    else if (/\/games\/challenges/.test(path)) engine = challengesGame();
    if (engine) run(engine);
  });
})();
