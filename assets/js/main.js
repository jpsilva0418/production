/* Masiello Construction — header state, mobile nav, scroll-spy, form handling. */
(function () {
  "use strict";

  /* ---------------------------------------------------------------
     Client details. Update these two values once the real phone
     number and form endpoint are available.
     --------------------------------------------------------------- */
  var PHONE_E164    = "+10000000000"; // e.g. "+15085551959"
  var PHONE_DISPLAY = "(000) 000-0000";
  var FORM_ENDPOINT = null;           // POST URL; falls back to email when null
  var INBOX         = "estimating@masielloconstruction.com";

  var header   = document.getElementById("siteHeader");
  var nav      = document.getElementById("primaryNav");
  var toggle   = document.getElementById("navToggle");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));

  /* Keep every phone reference in sync from one source of truth. */
  Array.prototype.forEach.call(document.querySelectorAll("[data-phone-link]"), function (el) {
    el.setAttribute("href", "tel:" + PHONE_E164);
    if (el.textContent.trim() === "(000) 000-0000") el.textContent = PHONE_DISPLAY;
  });

  /* Hairline border appears only once the page has scrolled. */
  var onScroll = function () {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- Mobile navigation ---------------- */
  var setNav = function (open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", function () {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });

  /* Close on selection so the target section is visible immediately. */
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setNav(false);
      toggle.focus();
    }
  });

  /* ---------------- Scroll-spy ---------------- */
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var markActive = function (id) {
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    };

    var visible = new Map();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      var best = "";
      var bestRatio = 0;
      visible.forEach(function (ratio, id) {
        if (ratio > bestRatio) { bestRatio = ratio; best = id; }
      });
      if (best) markActive(best);
    }, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.25, 0.5, 1]
    });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------------- Estimate form ---------------- */
  var form   = document.getElementById("estimate");
  var status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.classList.remove("is-error");

      var invalid = null;
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.willValidate) return;
        var ok = el.checkValidity();
        el.setAttribute("aria-invalid", String(!ok));
        if (!ok && !invalid) invalid = el;
      });

      if (invalid) {
        status.textContent = "Please add your name and a valid email address.";
        status.classList.add("is-error");
        invalid.focus();
        return;
      }

      var data = new FormData(form);

      if (FORM_ENDPOINT) {
        status.textContent = "Sending…";
        fetch(FORM_ENDPOINT, { method: "POST", body: data })
          .then(function (res) {
            if (!res.ok) throw new Error(res.status);
            form.reset();
            status.textContent = "Thank you. We will respond within one business day.";
          })
          .catch(function () {
            status.textContent = "Something went wrong. Please call us instead.";
            status.classList.add("is-error");
          });
        return;
      }

      /* No endpoint configured yet — hand off to the visitor's mail client
         so the form still produces a lead. */
      var lines = [];
      data.forEach(function (value, key) {
        if (String(value).trim()) lines.push(key + ": " + value);
      });

      window.location.href =
        "mailto:" + INBOX +
        "?subject=" + encodeURIComponent("Estimate request — " + (data.get("company") || data.get("name"))) +
        "&body=" + encodeURIComponent(lines.join("\n"));

      status.textContent = "Opening your email app to send this request.";
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
