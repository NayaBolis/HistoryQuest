/*
 * مغامرة التاريخ — صفحات الدروس (نسخة مستقلة)
 * زر "أكملت هذا الدرس" يضيف 10 نقاط ويحفظ التقدم محليًا.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var m = window.location.pathname.match(/\/lessons\/(b\d+|review)\/?/);
    if (!m) return;
    var lessonId = m[1];
    var P = window.HQProgress;
    if (!P) return;

    function refresh(btn) {
      var p = P.get();
      var done = (p.completed_lessons || []).indexOf(lessonId) !== -1;
      if (!done) return;
      btn.disabled = true;
      btn.classList.add("opacity-60", "cursor-default");
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check ml-2 h-4 w-4"><path d="M20 6 9 17l-5-5"/></svg>درس مكتمل';
    }

    var buttons = Array.prototype.slice.call(document.querySelectorAll("main button"));
    var completeBtn = null;
    buttons.forEach(function (b) {
      if (b.textContent.indexOf("أكملت هذا الدرس") !== -1) completeBtn = b;
    });
    if (!completeBtn) return;

    refresh(completeBtn);
    completeBtn.addEventListener("click", function () {
      var p = P.get();
      var already = (p.completed_lessons || []).indexOf(lessonId) !== -1;
      P.completeLesson(lessonId);
      P.play(already ? "click" : "correct");
      refresh(completeBtn);
      if (!already) toast("أُضيفت 10 نقاط — أحسنت!");
    });

    function toast(text) {
      var t = document.createElement("div");
      t.style.cssText = "position:fixed;bottom:5.5rem;right:50%;transform:translateX(50%);z-index:60;background:hsl(var(--primary));color:hsl(var(--primary-foreground));padding:.6rem 1.25rem;border-radius:999px;font-size:.85rem;font-weight:600;box-shadow:0 12px 32px -12px rgba(0,0,0,.4);transition:opacity .3s";
      t.textContent = text;
      document.body.appendChild(t);
      setTimeout(function () { t.style.opacity = "0"; }, 2200);
      setTimeout(function () { t.remove(); }, 2600);
    }
  });
})();
