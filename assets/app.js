/* Mensa Yapı Malzemeleri — assets/app.js
 *
 * Üç iş yapar: mobil menü, başlık gölgesi, gezinme vurgusu.
 * Hepsi ilerlemeli: JS çalışmazsa site tam işlevsel kalır —
 * bağlantılar çapa, menü ise geniş ekranda zaten açık.
 */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var nav = document.getElementById("nav");
  var toggle = document.querySelector(".nav-toggle");
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']")) : [];

  /* ---- mobil menü ------------------------------------------------- */
  var mq = window.matchMedia("(max-width: 900px)");

  function applyMode() {
    if (!nav || !toggle) return;
    if (mq.matches) {
      nav.hidden = toggle.getAttribute("aria-expanded") !== "true";
    } else {
      nav.hidden = false;                       // geniş ekranda hep açık
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  if (toggle && nav) {
    toggle.hidden = false;
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.hidden = open;
    });

    // menüden bir bağlantıya basınca kapansın
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && mq.matches) {
        toggle.setAttribute("aria-expanded", "false");
        nav.hidden = true;
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mq.matches && !nav.hidden) {
        toggle.setAttribute("aria-expanded", "false");
        nav.hidden = true;
        toggle.focus();
      }
    });

    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(applyMode);
    applyMode();
  }

  /* ---- başlık gölgesi --------------------------------------------- */
  /* Sayfanın en üstünde bir işaret öğesi gözlenir; ekrandan çıkınca
     başlık "yapışmış" demektir. Scroll dinleyicisinden ucuzdur. */
  var sentinel = document.getElementById("top-sentinel");
  if (header && sentinel && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-stuck", !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---- gezinmede aktif bölüm --------------------------------------- */
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  function setCurrent(id) {
    links.forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    var visible = new Map();
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
        else visible.delete(e.target.id);
      });
      if (!visible.size) return;
      // en çok görünen bölüm kazanır
      var best = null, top = -1;
      visible.forEach(function (ratio, id) { if (ratio > top) { top = ratio; best = id; } });
      if (best) setCurrent(best);
    }, { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.4, 0.75] });

    sections.forEach(function (s) { spy.observe(s); });
  }

  // bağlantıya basıldığında vurgu anında geçsin
  links.forEach(function (a) {
    a.addEventListener("click", function () {
      setCurrent(a.getAttribute("href").slice(1));
    });
  });

  document.querySelectorAll("a.logo-link, a.footer-up").forEach(function (a) {
    a.addEventListener("click", function () { setCurrent("anasayfa"); });
  });

  /* ---- hareket tercihi --------------------------------------------- */
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- beliriş yedeği ---------------------------------------------- */
  /* Chrome/Edge/yeni Safari bunu saf CSS ile yapar (animation-timeline).
     Firefox'ta o özellik yok; orada IntersectionObserver devreye girer.
     Yalnızca destek yoksa <html>'e .js-reveal eklenir — aksi hâlde
     öğeleri gizleyip görünür kılmaya çalışmak CSS ile çakışırdı. */
  var cssTimeline = CSS.supports && CSS.supports("animation-timeline", "view()");
  if (!cssTimeline && !still && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(".reveal");
    if (targets.length) {
      document.documentElement.classList.add("js-reveal");
      var revealIO = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          obs.unobserve(e.target);          // bir kez göster, bırak
        });
      }, { rootMargin: "0px 0px -12% 0px" });
      targets.forEach(function (el) { revealIO.observe(el); });
    }
  }

  /* ---- hero sayaçları ---------------------------------------------- */
  /* 0'dan hedefe sayar. Biçimlendirme tr-TR yerel ayarıyla yapılır ki
     binlik ayıracı nokta kalsın (6.500), araya virgül girmesin. */
  var fmt = new Intl.NumberFormat("tr-TR");
  var counters = document.querySelectorAll(".count[data-to]");

  function runCount(el) {
    var to = parseInt(el.getAttribute("data-to"), 10);
    if (!isFinite(to)) return;
    var dur = 1100, t0 = null;
    function frame(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);          // ease-out cubic
      el.textContent = fmt.format(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = fmt.format(to);        // tam değere otur
    }
    requestAnimationFrame(frame);
  }

  if (counters.length && !still) {
    // hero sayfanın tepesinde; yükleme animasyonu bitince başlat
    setTimeout(function () {
      counters.forEach(function (el) { runCount(el); });
    }, 520);
  }
})();
