/* مغامرة التاريخ — تفاعلات الموقع (نسخة مستقلة خفيفة) */
(function () {
  "use strict";

  var base = (typeof window.HQ_BASE === "string" && window.HQ_BASE) ? window.HQ_BASE : (function () {
    var script = document.currentScript;
    return script && script.src ? script.src.replace(/assets\/app\.js.*$/, "") : "";
  })();

  var ROUTES = [
    ["الرئيسية", "index.html"],
    ["الدروس", "lessons/index.html"],
    ["الألعاب", "games/index.html"],
    ["المساعد الذكي", "assistant/index.html"],
    ["تقدمي", "progress/index.html"],
    ["الإعدادات", "settings/index.html"]
  ];

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* لوحة القائمة للهواتف */
  var style = document.createElement("style");
  style.textContent =
    ".mobile-menu-panel{position:fixed;top:4.25rem;right:.75rem;left:.75rem;z-index:50;display:flex;flex-direction:column;overflow:hidden;border-radius:1.25rem;border:1px solid hsl(var(--border));background:hsl(var(--card));box-shadow:0 24px 48px -24px rgba(0,0,0,.35)}" +
    ".mobile-menu-panel a{padding:.9rem 1.25rem;font-size:.9rem;font-weight:600;color:hsl(var(--foreground));text-decoration:none;border-bottom:1px solid hsl(var(--border))}" +
    ".mobile-menu-panel a:last-child{border-bottom:0}" +
    ".mobile-menu-panel a:hover,.mobile-menu-panel a:focus-visible{background:hsl(var(--accent))}";
  document.head.appendChild(style);

  ready(function () {
    /* زر الوضع الليلي/النهاري */
    var THEME_DARK = "التبديل إلى الوضع النهاري";
    var THEME_LIGHT = "التبديل إلى الوضع الليلي";
    Array.prototype.forEach.call(
      document.querySelectorAll('button[aria-label="' + THEME_LIGHT + '"],button[aria-label="' + THEME_DARK + '"]'),
      function (btn) {
        btn.addEventListener("click", function () {
          var dark = document.documentElement.classList.toggle("dark");
          try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) { /* private mode */ }
          btn.setAttribute("aria-label", dark ? THEME_DARK : THEME_LIGHT);
        });
      }
    );

    /* زر الاسم (بدون تسجيل دخول) */
    Array.prototype.forEach.call(
      document.querySelectorAll('button[aria-label="تسجيل الدخول"]'),
      function (btn) {
        var name = "";
        try { name = localStorage.getItem("hq-student-name") || ""; } catch (e) {}
        if (name) {
          btn.setAttribute("aria-label", "أهلًا، " + name);
          btn.setAttribute("title", "أهلًا، " + name + " — تعديل الاسم");
        }
        btn.addEventListener("click", function () {
          window.location.href = base + "login/index.html";
        });
      }
    );

    /* قائمة الهاتف */
    var menuBtn = document.querySelector('button[aria-label="فتح القائمة"],button[aria-label="إغلاق القائمة"]');
    if (menuBtn) {
      var panel = null;
      menuBtn.addEventListener("click", function () {
        if (panel) {
          panel.remove();
          panel = null;
          menuBtn.setAttribute("aria-expanded", "false");
          menuBtn.setAttribute("aria-label", "فتح القائمة");
          return;
        }
        panel = document.createElement("nav");
        panel.className = "mobile-menu-panel";
        var html = "";
        for (var i = 0; i < ROUTES.length; i++) {
          html += '<a href="' + base + ROUTES[i][1] + '">' + ROUTES[i][0] + "</a>";
        }
        panel.innerHTML = html;
        document.body.appendChild(panel);
        menuBtn.setAttribute("aria-expanded", "true");
        menuBtn.setAttribute("aria-label", "إغلاق القائمة");
      });
      document.addEventListener("click", function (e) {
        if (panel && !panel.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
          panel.remove();
          panel = null;
          menuBtn.setAttribute("aria-expanded", "false");
          menuBtn.setAttribute("aria-label", "فتح القائمة");
        }
      });
    }
  });
})();
