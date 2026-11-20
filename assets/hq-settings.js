/*
 * مغامرة التاريخ — صفحة الإعدادات (نسخة مستقلة)
 * المظهر (فاتح/ليلي/النظام)، مؤثرات الصوت، وإعادة ضبط التقدم.
 */
(function () {
  "use strict";

  function setTheme(mode) {
    try { window.localStorage.setItem("theme", mode); } catch (e) { /* ignore */ }
    var dark = mode === "dark" || (mode !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!/\/settings\/?/.test(window.location.pathname) && !/\/settings\/index\.html$/.test(window.location.pathname)) return;
    var P = window.HQProgress;
    if (!P) return;

    /* المظهر */
    var themeBtns = Array.prototype.slice.call(document.querySelectorAll('.grid.grid-cols-3 button[type="button"]'));
    var MODES = ["light", "dark", "system"];
    var theme = "system";
    try { theme = window.localStorage.getItem("theme") || "system"; } catch (e) { /* ignore */ }
    paint();

    function paint() {
      themeBtns.forEach(function (b, i) {
        b.setAttribute("aria-pressed", MODES[i] === theme ? "true" : "false");
        b.classList.toggle("border-primary/50", MODES[i] === theme);
        b.classList.toggle("bg-primary/10", MODES[i] === theme);
        b.classList.toggle("text-foreground", MODES[i] === theme);
      });
    }

    themeBtns.forEach(function (b, i) {
      b.addEventListener("click", function () {
        theme = MODES[i] || "system";
        setTheme(theme);
        P.play("click");
        paint();
      });
    });

    /* الصوت */
    var soundSwitch = document.querySelector('button[role="switch"][aria-label*="الصوت"]');
    function paintSound() {
      if (soundSwitch) soundSwitch.setAttribute("aria-checked", P.soundEnabled() ? "true" : "false");
    }
    paintSound();
    if (soundSwitch) {
      soundSwitch.addEventListener("click", function () {
        P.setSoundEnabled(!P.soundEnabled());
        paintSound();
        P.play("click");
      });
    }

    /* اسم الطالب (بدون حساب) */
    var nameInput = document.getElementById("hq-name");
    var nameSave = document.getElementById("hq-name-save");
    var nameNote = document.getElementById("hq-name-note");
    var NAME_KEY = "hq-student-name";
    function storedName() { try { return window.localStorage.getItem(NAME_KEY) || ""; } catch (e) { return ""; } }
    function paintName() {
      var n = storedName();
      if (nameInput) nameInput.value = n;
      if (nameNote) {
        nameNote.textContent = n
          ? "أهلًا، " + n + " 👋 الاسم يظهر في الموقع ويُحفَظ على هذا الجهاز فقط."
          : "بدون حساب ولا تسجيل دخول — الاسم يُحفَظ على هذا الجهاز فقط.";
      }
    }
    paintName();
    if (nameSave && nameInput) {
      nameSave.addEventListener("click", function () {
        var v = nameInput.value.trim().slice(0, 40);
        try { if (v) window.localStorage.setItem(NAME_KEY, v); else window.localStorage.removeItem(NAME_KEY); } catch (e) { /* ignore */ }
        P.play("click");
        paintName();
      });
      nameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); nameSave.click(); }
      });
    }

    /* إعادة ضبط التقدم */
    var resetBtn = null;
    Array.prototype.slice.call(document.querySelectorAll("main button")).forEach(function (b) {
      if (b.textContent.indexOf("إعادة ضبط التقدم") !== -1) resetBtn = b;
    });
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (window.confirm("سيتم حذف النقاط والإنجازات والدروس المكتملة. هل تريد المتابعة؟")) {
          P.reset();
          P.play("click");
          paintSound();
          var note = document.querySelector("main [data-hq-progress-note]");
          if (note) note.dispatchEvent(new CustomEvent("hq-refresh"));
          window.location.reload();
        }
      });
    }
  });
})();
