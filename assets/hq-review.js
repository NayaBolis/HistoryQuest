/*
 * مغامرة التاريخ — صفحة المراجعة الشاملة (نسخة مستقلة)
 * التبويبات (التواريخ/الشخصيات/المفاهيم)، فلتر الوحدات، والبحث — كلها تعمل من بيانات المنهج.
 */
(function () {
  "use strict";

  var BASE = (typeof window.HQ_BASE === "string" && window.HQ_BASE) ? window.HQ_BASE : "";
  var LESSONS = window.HQ_CURRICULUM || [];
  var UNITS = (window.HQ_DATA && window.HQ_DATA.units) || [];

  var UNIT_TITLE = {};
  UNITS.forEach(function (u) { UNIT_TITLE[u.id] = u.title; });

  function normalize(s) {
    return String(s)
      .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
      .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي").replace(/ة/g, "ه")
      .toLowerCase();
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  var ARROW = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left h-3 w-3"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>';

  function lessonLinkHtml(lesson, cls) {
    return '<a class="' + cls + '" href="' + BASE + 'lessons/' + esc(lesson.id) + '/index.html">' + esc(UNIT_TITLE[lesson.unitId] || "") + " · " + esc(lesson.title) + ARROW + "</a>";
  }

  /* ————— بناء العناصر من بيانات المنهج ————— */
  var dates = [], figures = [], terms = [];
  LESSONS.forEach(function (lesson) {
    (lesson.dates || []).forEach(function (d) { dates.push({ lesson: lesson, date: d.date, event: d.event }); });
    (lesson.figures || []).forEach(function (f) { figures.push({ lesson: lesson, name: f.name, note: f.note }); });
    (lesson.terms || []).forEach(function (t) { terms.push({ lesson: lesson, term: t.term, def: t.def }); });
  });

  function panelFor(suffix) {
    var panels = document.querySelectorAll('[role="tabpanel"]');
    for (var i = 0; i < panels.length; i++) {
      if (/(^|-)content-/.test(panels[i].id) && panels[i].id.indexOf("content-" + suffix) !== -1) return panels[i];
    }
    return null;
  }

  function renderDates() {
    var p = panelFor("dates");
    if (!p) return;
    p.innerHTML = dates.length
      ? '<ol class="space-y-3 border-r-2 border-primary/25 pr-5">' + dates.map(function (d) {
          return '<li class="relative" data-unit="' + esc(d.lesson.unitId) + '"><span class="absolute -right-[27px] top-2 h-3 w-3 rounded-full border-2 border-primary bg-background"></span>' +
            '<div class="ornate-card p-4"><div class="font-display text-sm font-bold text-primary">' + esc(d.date) + "</div>" +
            '<div class="mt-0.5 text-sm leading-relaxed text-foreground/90">' + esc(d.event) + "</div>" +
            '<div class="mt-2">' + lessonLinkHtml(d.lesson, "inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary") + "</div></div></li>";
        }).join("") + "</ol>" +
        '<p data-hq-empty="dates" class="hidden mt-4 text-sm text-muted-foreground">لا توجد تواريخ مطابقة للبحث.</p>'
      : '<p class="mt-4 text-sm text-muted-foreground">لا توجد تواريخ مطابقة للبحث.</p>';
  }

  function renderFigures() {
    var p = panelFor("figures");
    if (!p) return;
    p.innerHTML = '<div class="grid gap-3 sm:grid-cols-2">' + figures.map(function (f) {
      return '<div class="ornate-card p-5" data-unit="' + esc(f.lesson.unitId) + '"><h2 class="font-display text-lg font-bold text-foreground">' + esc(f.name) + "</h2>" +
        '<p class="mt-1 text-sm leading-relaxed text-muted-foreground">' + esc(f.note) + "</p>" +
        lessonLinkHtml(f.lesson, "mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline") + "</div>";
    }).join("") + "</div>" +
    '<p data-hq-empty="figures" class="hidden mt-4 text-sm text-muted-foreground">لا توجد شخصيات مطابقة للبحث.</p>';
  }

  function renderTerms() {
    var p = panelFor("terms");
    if (!p) return;
    p.innerHTML = '<dl class="space-y-3">' + terms.map(function (t) {
      return '<div class="ornate-card p-4" data-unit="' + esc(t.lesson.unitId) + '"><dt class="text-sm font-bold text-foreground">' + esc(t.term) + "</dt>" +
        '<dd class="mt-1 text-sm leading-relaxed text-muted-foreground">' + esc(t.def) + "</dd>" +
        lessonLinkHtml(t.lesson, "mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline") + "</div>";
    }).join("") + "</dl>" +
    '<p data-hq-empty="terms" class="hidden mt-4 text-sm text-muted-foreground">لا توجد مصطلحات مطابقة للبحث.</p>';
  }

  /* ————— الفلاتر والتبويبات ————— */
  var CHIP_UNITS = [null, "unit-1", "unit-2", "unit-3"];
  var unit = null, query = "";
  var chips = [];

  function apply() {
    var nq = normalize(query).trim();
    ["dates", "figures", "terms"].forEach(function (kind) {
      var p = panelFor(kind);
      if (!p) return;
      var items = p.querySelectorAll("[data-unit]");
      var visible = 0;
      items.forEach(function (el) {
        var okUnit = !unit || el.getAttribute("data-unit") === unit;
        var okText = !nq || normalize(el.textContent).indexOf(nq) !== -1;
        var show = okUnit && okText;
        el.style.display = show ? "" : "none";
        if (show) visible++;
      });
      var note = p.querySelector("[data-hq-empty]");
      if (note) note.classList.toggle("hidden", visible !== 0);
    });
  }

  function paintChips() {
    chips.forEach(function (c, i) {
      var active = (CHIP_UNITS[i] || null) === unit;
      c.classList.toggle("border-primary", active);
      c.classList.toggle("bg-primary/12", active);
      c.classList.toggle("text-foreground", active);
      c.classList.toggle("border-border", !active);
      c.classList.toggle("bg-card", !active);
      c.classList.toggle("text-muted-foreground", !active);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!/\/lessons\/review/.test(window.location.pathname)) return;
    renderDates(); renderFigures(); renderTerms();

    /* التبويبات */
    var tabs = [].slice.call(document.querySelectorAll('[role="tablist"] [role="tab"]'));
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          var active = t === tab;
          t.setAttribute("data-state", active ? "active" : "inactive");
          t.setAttribute("aria-selected", active ? "true" : "false");
          t.setAttribute("tabindex", active ? "0" : "-1");
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) {
            panel.setAttribute("data-state", active ? "active" : "inactive");
            if (active) panel.removeAttribute("hidden"); else panel.setAttribute("hidden", "");
          }
        });
      });
    });

    /* فلاتر الوحدات */
    var wrap = null;
    [].slice.call(document.querySelectorAll("main div.flex.flex-wrap.gap-2")).some(function (d) {
      if (d.textContent.indexOf("كل الوحدات") !== -1) { wrap = d; return true; }
      return false;
    });
    if (wrap) {
      chips = [].slice.call(wrap.querySelectorAll("button"));
      chips.forEach(function (c, i) {
        c.addEventListener("click", function () {
          unit = CHIP_UNITS[i] || null;
          paintChips();
          apply();
        });
      });
    }

    /* البحث */
    var search = document.querySelector('input[placeholder*="ابحث"]');
    if (search) {
      search.addEventListener("input", function () {
        query = search.value;
        apply();
      });
    }
  });

  window.HQReview = { apply: apply, renderDates: renderDates, renderFigures: renderFigures, renderTerms: renderTerms };
})();
