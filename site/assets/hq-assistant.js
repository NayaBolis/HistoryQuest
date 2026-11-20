/*
 * مغامرة التاريخ — المساعد الذكي (نسخة مستقلة تعمل دون إنترنت)
 * يبحث في نص المنهج كاملًا (12 درسًا): العناوين، الشرح، الأهداف، التواريخ، الملاحظات.
 * البحث ذكي: يتجاهل همزات الكتابة والتشكيل وال stopwords، ويرتب النتائج حسب القوة.
 */
(function () {
  "use strict";

  var BASE = (typeof window.HQ_BASE === "string" && window.HQ_BASE) ? window.HQ_BASE : "";
  var CURRICULUM = window.HQ_CURRICULUM || [];

  /* ————— تطبيع النص العربي ————— */
  function normalize(s) {
    return String(s)
      .replace(/[\u064B-\u0652\u0670\u0640]/g, "")      // التشكيل والتطويل
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/ة/g, "ه")
      .toLowerCase();
  }

  var STOPWORDS = {};
  ["من","في","على","عن","مع","هو","هي","هما","هم","هذه","هذا","ذلك","تلك","التي","الذي","الذين","و","او","ثم","الى","الى","كما","قد","لقد","لا","ما","لم","لن","ان","إن","كان","كانت","يكون","تكون","حتى","عند","بعد","قبل","كل","بعض","غير","بين","لدى","له","لها","هم","هنا","هناك","كيف","لماذا","متى","اين","ماذا","هل","به","بها","له","لها","with","the","a","an","is","are","was","were","of","in","on","to","for"].forEach(function (w) { STOPWORDS[w] = true; });

  function tokenize(text) {
    return normalize(text).split(/[^\u0600-\u06FFa-z0-9]+/).filter(function (t) {
      return t.length >= 2 && !STOPWORDS[t] && !/^\d{1}$/.test(t);
    });
  }

  function wordBoundary(hay, needle) {
    // مطابقة كلمة كاملة (بدون الاعتماد على \b الذي لا يغطي العربية جيدًا)
    var re = new RegExp("(?:^|[^\\u0600-\\u06FFa-z0-9])" + needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\u0600-\\u06FFa-z0-9])");
    return re.test(hay);
  }

  /* ————— بناء فهرس المنهج ————— */
  var passages = [];
  var lessons = [];

  function walk(obj, lesson, label, weight) {
    if (typeof obj === "string") {
      if (obj.length >= 4) passages.push({ lesson: lesson, label: label, text: obj, weight: weight, norm: normalize(obj) });
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach(function (item) { walk(item, lesson, label, weight); });
      return;
    }
    if (obj && typeof obj === "object") {
      Object.keys(obj).forEach(function (k) {
        var w = weight, l = label;
        if (k === "title") { w = weight + 2; l = "عنوان"; }
        else if (k === "summary" || k === "subtitle") { l = "ملخص"; }
        else if (k === "objectives") { l = "أهداف الدرس"; }
        else if (k === "body") { l = "الشرح"; }
        else if (k === "note" || k === "notes") { l = "ملاحظة"; }
        else if (k === "id" || k === "unitId" || k === "bookNumber" || k === "order" || k === "minutes" || k === "color" || k === "year") { return; }
        walk(obj[k], lesson, l, w);
      });
    }
  }

  CURRICULUM.forEach(function (lesson) {
    lessons.push(lesson);
    walk(lesson, lesson, "الشرح", 1);
  });

  var TOTAL = lessons.length;

  /* ————— أرقام الدروس بالكلمات ————— */
  var NUMBER_WORDS = { "الاول": 1, "الثاني": 2, "الثالث": 3, "الرابع": 4, "الخامس": 5, "السادس": 6, "السابع": 7, "الثامن": 8, "التاسع": 9, "العاشر": 10, "الحادي": 11, "الثاني عشر": 12 };

  function escapeHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function bookWord(n) {
    var words = ["", "الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر", "الحادي عشر", "الثاني عشر"];
    return words[n] || n;
  }

  /* ————— البحث ————— */
  function search(query) {
    var nq = normalize(query);

    // طلب درس محدد بالاسم أو الرقم
    var num = null;
    if (/درس|review|مراجعه/.test(nq)) {
      Object.keys(NUMBER_WORDS).sort(function (a, b) { return b.length - a.length; }).some(function (w) {
        if (nq.indexOf("الدرس " + w) !== -1 || nq.indexOf("درس " + w) !== -1) { num = NUMBER_WORDS[w]; return true; }
        return false;
      });
      if (!num && /مراجعه|review/.test(nq)) return { review: true };
      var m = nq.match(/درس\s*(?:رقم\s*)?(\d{1,2})/);
      if (!num && m) num = parseInt(m[1], 10);
    }
    if (num && num >= 1 && num <= TOTAL) {
      var lesson = lessons[num - 1];
      return { direct: lesson };
    }

    var tokens = tokenize(query);
    if (!tokens.length) return { none: true };

    var nTokens = tokens.length;

    // مجموعة كلمات كل درس (لتفضيل الدرس الأكثر صلة)
    var lessonHits = {};
    lessons.forEach(function (l, li) {
      var ln = normalize(l.title + " " + (l.summary || ""));
      var score = 0;
      tokens.forEach(function (t) {
        if (wordBoundary(ln, t)) score += 4;
        else if (ln.indexOf(t) !== -1) score += 2;
      });
      if (score) lessonHits[l.id] = score;
    });

    var scored = [];
    passages.forEach(function (p, pi) {
      var score = 0, matched = {};
      for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (wordBoundary(p.norm, t)) { score += 6 * p.weight; matched[t] = 1; }
        else if (p.norm.indexOf(t) !== -1) { score += 3 * p.weight; matched[t] = 1; }
        else {
          // مطابقة بادئة للكلمات الطويلة (تقريب صيغ الكلمات)
          var stem = t.length >= 4 ? t.replace(/^ال/, "") : "";
          if (stem.length >= 3 && p.norm.indexOf(stem) !== -1) { score += 2 * p.weight; matched[t] = 1; }
        }
      }
      if (lessonHits[p.lesson.id]) score += lessonHits[p.lesson.id];
      if (score > 0) {
        var coverage = Object.keys(matched).length;
        scored.push({ p: p, score: score, cov: coverage, i: pi });
      }
    });

    if (!scored.length) return { none: true };

    scored.sort(function (a, b) { return b.cov - a.cov || b.score - a.score || a.i - b.i; });

    // أفضل مقطع واحد من كل درس — حتى 3 دروس مختلفة
    var seen = {}, out = [];
    for (var k = 0; k < scored.length && out.length < 3; k++) {
      var s = scored[k];
      var id = s.p.lesson.id;
      if (seen[id]) continue;
      seen[id] = true;
      out.push(s.p);
    }
    return { results: out, count: nTokens };
  }

  /* ————— ردود المساعد ————— */
  function answerHtml(query) {
    var r = search(query);

    if (r.review) {
      return '<p>صفحة المراجعة تجمع أهم الأفكار والتواريخ من كل الدروس.</p>' +
        '<a class="inline-flex mt-3 items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90" href="' + BASE + 'lessons/review/index.html">افتح المراجعة الشاملة</a>';
    }

    if (r.direct) {
      var l = r.direct;
      var secs = (l.sections || []).map(function (s) { return "<li>" + escapeHtml(s.title) + "</li>"; }).join("");
      return '<p>هذا هو <strong>الدرس ' + escapeHtml(bookWord(l.order)) + '</strong>: ' + escapeHtml(l.title) + '</p>' +
        '<p class="mt-2">' + escapeHtml(l.summary || "") + "</p>" +
        (secs ? '<p class="mt-2 font-semibold">فكرة الدرس:</p><ul class="mt-1 list-disc pl-5 space-y-1">' + secs + "</ul>" : "") +
        '<a class="inline-flex mt-3 items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90" href="' + BASE + 'lessons/' + escapeHtml(l.id) + '/index.html">اقرأ الدرس كاملًا</a>';
    }

    if (r.none) {
      return '<p>لم أجد إجابة واضحة في المنهج عن هذه الصياغة. جرّب:</p>' +
        '<ul class="mt-2 list-disc pl-5 space-y-1"><li>كلمات من الدرس نفسه (مثل: أركان الدولة، الفتح الإسلامي، ثورة 1919)</li><li>أو اسأل عن درس بالاسم: «الدرس الخامس»</li></ul>' +
        '<p class="mt-2 text-xs opacity-80">المساعد يجيب من مادة المنهج فقط، ولا يضيف معلومات من خارجه.</p>';
    }

    var cards = r.results.map(function (p) {
      var l = p.lesson;
      return '<div class="mt-3 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-right">' +
        '<p class="text-xs font-semibold text-primary">' + escapeHtml("الدرس " + bookWord(l.order) + " — " + l.title) + "</p>" +
        '<p class="mt-2 text-sm leading-relaxed text-foreground/90">' + escapeHtml(p.text) + "</p>" +
        '<a class="mt-2 inline-block text-xs font-semibold text-primary hover:underline" href="' + BASE + 'lessons/' + escapeHtml(l.id) + '/index.html">اقرأ الدرس كاملًا ←</a>' +
        "</div>";
    }).join("");

    return "<p>وجدت في المنهج:</p>" + cards;
  }

  /* ————— واجهة المحادثة ————— */
  var SUGGESTIONS = ["اشرح لي أركان الدولة", "من قاد مقاومة الهكسوس؟", "ما هي نتائج الفتح الإسلامي لمصر؟", "اشرح لي ثورة 1919", "الاحتلال الفرنسي لمصر ولماذا؟", "ما دور مصر في دعم حركات التحرر؟"];

  function chatHtml() {
    var chips = SUGGESTIONS.map(function (s) {
      return '<button type="button" data-suggest="' + escapeHtml(s) + '" class="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">' + escapeHtml(s) + "</button>";
    }).join("");

    return '<div class="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">' +
      '<a href="' + BASE + 'index.html" class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">الرئيسية</a>' +
      '<div class="mt-4 flex items-start gap-4">' +
        '<span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-7 w-7"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>' +
        "</span>" +
        '<div><h1 class="text-2xl font-bold text-foreground sm:text-3xl">المساعد الذكي</h1>' +
        '<p class="mt-1 text-sm text-muted-foreground">اسأل عن أي فكرة في المنهج — يبحث في شرح الدروس كلها ويجيبك فورًا، دون إنترنت.</p></div>' +
      "</div>" +
      '<div class="ornate-card mt-8 p-4 sm:p-6">' +
        '<div id="hq-chat" class="flex max-h-[55vh] flex-col gap-3 overflow-y-auto pe-1 text-sm"></div>' +
        '<div class="mt-3 flex flex-wrap gap-2" id="hq-chips">' + chips + "</div>" +
        '<div class="mt-4 flex items-center gap-2">' +
          '<input id="hq-q" type="text" dir="rtl" placeholder="اكتب سؤالك هنا…" class="h-11 flex-1 rounded-full border border-input bg-card px-5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" />' +
          '<button id="hq-send" type="button" class="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90">إرسال</button>' +
        "</div>" +
      "</div></div>";
  }

  function bubble(cls, inner) {
    return '<div class="' + cls + '"><div class="rounded-2xl px-4 py-3 leading-relaxed ' + (cls === "me" ? "me-bubble" : "bot-bubble") + '">' + inner + "</div></div>";
  }

  function init() {
    var main = document.querySelector("main");
    if (!main) return;
    main.innerHTML = chatHtml();

    var chat = document.getElementById("hq-chat");
    var input = document.getElementById("hq-q");
    var send = document.getElementById("hq-send");
    if (!chat || !input || !send) return;

    // تنسيق الفقاعات (يستخدم ألوان الموقع)
    var style = document.createElement("style");
    style.textContent =
      ".me-bubble{background:hsl(var(--primary));color:hsl(var(--primary-foreground))}" +
      ".bot-bubble{background:hsl(var(--secondary));color:hsl(var(--foreground))}" +
      ".me{text-align:left}.me .me-bubble{display:inline-block;text-align:right}" +
      ".bot .bot-bubble{display:inline-block;text-align:right}" +
      "#hq-chat::-webkit-scrollbar{width:6px}#hq-chat::-webkit-scrollbar-thumb{background:hsl(var(--border));border-radius:3px}";
    document.head.appendChild(style);

    function add(cls, html) {
      chat.insertAdjacentHTML("beforeend", bubble(cls, html));
      chat.scrollTop = chat.scrollHeight;
    }

    function ask(q) {
      q = (q || "").trim();
      if (!q) return;
      add("me", escapeHtml(q));
      input.value = "";
      if (window.HQProgress) window.HQProgress.play("click");
      setTimeout(function () {
        try { add("bot", answerHtml(q)); }
        catch (e) { add("bot", "<p>حدث خطأ أثناء البحث: " + escapeHtml(e.message) + "</p>"); }
      }, 250);
    }

    send.addEventListener("click", function () { ask(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); ask(input.value); }
    });
    var chips = document.getElementById("hq-chips");
    if (chips) {
      chips.addEventListener("click", function (e) {
        var b = e.target.closest("[data-suggest]");
        if (b) ask(b.getAttribute("data-suggest"));
      });
    }

    add("bot", "<p>أهلًا بك! 👋 اسألني عن أي فكرة أو حدث أو شخصية من المنهج، وسأبحث لك في شرح الدروس كلها.</p><p class=\"mt-2 text-xs opacity-75\">مثال: «اشرح لي أركان الدولة» أو «ما هي نتائج الثورة العرابية؟»</p>");
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!/\/assistant\/?$/.test(window.location.pathname) && !/\/assistant\/index\.html$/.test(window.location.pathname)) return;
    init();
  });

  window.HQAssistant = { search: search, answerHtml: answerHtml };
})();
