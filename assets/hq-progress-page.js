/*
 * مغامرة التاريخ — صفحة "تقدمي" (نسخة مستقلة)
 * تعيد بناء الصفحة من بيانات التقدم المحلية.
 */
(function () {
  "use strict";

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function svg(icon, cls) { return window.HQIcons ? window.HQIcons(icon, cls) : ""; }

  function lessonById(id) {
    var list = window.HQ_DATA ? window.HQ_DATA.lessons : [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function render(root) {
    var p = window.HQProgress.get();
    var lvl = window.HQProgress.level(p.points || 0);
    var have = {};
    (p.achievements || []).forEach(function (a) { have[a] = true; });
    var done = p.completed_lessons || [];
    var totalLessons = window.HQ_DATA ? window.HQ_DATA.lessons.length : 12;
    var last = p.last_lesson_id ? lessonById(p.last_lesson_id) : null;

    var stats =
      '<span class="flex items-center gap-1.5">' + svg("star", "h-4 w-4 text-[#efd489]") + (p.points || 0) + " نقطة</span>" +
      '<span class="flex items-center gap-1.5">' + svg("book-open-check", "h-4 w-4 text-[#efd489]") + done.length + " / " + totalLessons + " درس</span>" +
      '<span class="flex items-center gap-1.5">' + svg("trophy", "h-4 w-4 text-[#efd489]") + (p.games_played || 0) + " لعبة</span>";

    var lastCard = last
      ? '<a href="' + BASE + 'lessons/' + esc(last.id) + '/index.html' + '" class="mt-3 block rounded-2xl border border-border bg-secondary/40 p-4 transition-colors hover:border-primary/50"><div class="text-sm font-bold text-foreground">' + esc(last.title) + '</div><div class="mt-1 text-xs text-muted-foreground">' + esc(last.subtitle) + "</div></a>"
      : '<p class="mt-3 text-sm text-muted-foreground">لم تبدأ بعد. <a href="' + BASE + 'lessons/index.html" class="font-semibold text-primary hover:underline">ابدأ بأول درس</a></p>';

    var completed = done.length === 0
      ? '<p class="mt-2 text-sm text-muted-foreground">لا توجد دروس مكتملة بعد.</p>'
      : '<ul class="mt-2 space-y-1.5">' + done.map(function (id) {
          var l = lessonById(id);
          return l ? '<li><a href="' + BASE + 'lessons/' + esc(id) + '/index.html' + '" class="flex items-center gap-2 text-sm text-foreground/85 hover:text-primary">' + svg("circle-check", "h-4 w-4 text-emerald-600") + esc(l.title) + "</a></li>" : "";
        }).join("") + "</ul>";

    var achievements = window.HQProgress.achievements;
    var unlocked = achievements.filter(function (a) { return have[a.id]; }).length;
    var achCards = achievements.map(function (a) {
      var got = !!have[a.id];
      return '<div class="rounded-2xl border p-5 transition-colors ' + (got ? "border-primary/40 bg-primary/8" : "border-border bg-card opacity-70") + '">' +
        '<span class="grid h-11 w-11 place-items-center rounded-2xl ' + (got ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground") + '">' + svg(got ? "trophy" : "lock", "h-5 w-5") + "</span>" +
        '<h3 class="mt-3 text-base font-bold text-foreground">' + esc(a.title) + "</h3>" +
        '<p class="mt-1 text-sm text-muted-foreground">' + esc(a.description) + "</p></div>";
    }).join("");

    root.innerHTML = '<div class="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">' +
      '<h1 class="text-3xl font-bold text-foreground sm:text-4xl">تقدمي</h1>' +
      '<p class="mt-2 text-muted-foreground">كل درس تقرأه وكل لعبة تلعبها تضيف إلى رصيدك. تقدمك محفوظ على هذا الجهاز.</p>' +
      '<div class="mt-6 grid gap-4 md:grid-cols-[1.2fr_1fr]">' +
        '<div class="bg-lapis rounded-3xl p-6 text-white sm:p-8">' +
          '<div class="flex items-center justify-between">' +
            '<div><p class="text-xs font-semibold text-white/60">المستوى ' + lvl.level + '</p><p class="mt-1 font-display text-3xl font-bold">' + esc(lvl.title) + "</p></div>" +
            '<span class="grid h-14 w-14 place-items-center rounded-2xl bg-white/10">' + svg("trophy", "h-7 w-7 text-[#efd489]") + "</span>" +
          "</div>" +
          '<div class="mt-6"><div class="flex items-center justify-between text-xs text-white/70"><span>' + (p.points || 0) + " نقطة</span><span>" + lvl.nextAt + " نقطة للمستوى التالي</span></div>" +
          '<div class="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/15"><div class="h-full rounded-full bg-[#d4af37] transition-all duration-500" style="width:' + lvl.progress + '%"></div></div></div>' +
          '<div class="mt-6 flex items-center gap-6 text-sm">' + stats + "</div>" +
        "</div>" +
        '<div class="ornate-card p-6">' +
          '<h2 class="text-lg font-bold text-foreground">آخر ما قرأت</h2>' +
          lastCard +
          '<h3 class="mt-6 text-sm font-bold text-foreground">الدروس المكتملة</h3>' +
          completed +
        "</div>" +
      "</div>" +
      '<section class="mt-10">' +
        '<h2 class="text-2xl font-bold text-foreground">الإنجازات</h2>' +
        '<p class="mt-1 text-sm text-muted-foreground">' + unlocked + " من " + achievements.length + " إنجازًا.</p>" +
        '<div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">' + achCards + "</div>" +
      "</section>" +
      '<div class="mt-10 flex flex-wrap gap-3">' +
        '<a href="' + BASE + 'games/index.html" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90">العب الآن</a>' +
        '<a href="' + BASE + 'lessons/index.html" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-input bg-transparent px-7 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">تابع الدروس (' + (totalLessons - done.length) + " درسًا)</a>" +
      "</div></div>";
  }

  var BASE = (typeof window.HQ_BASE === "string" && window.HQ_BASE) ? window.HQ_BASE : (function () {
    var s = document.querySelector('script[src*="hq-progress-page"]');
    return s ? s.src.replace(/assets\/hq-progress-page\.js.*$/, "") : "";
  })();

  document.addEventListener("DOMContentLoaded", function () {
    if (!/\/progress\/?$/.test(window.location.pathname) && !/\/progress\/index\.html$/.test(window.location.pathname)) return;
    var main = document.querySelector("main");
    if (!main) return;
    render(main);
    window.HQProgress.subscribe(function () { render(main); });
  });
})();
