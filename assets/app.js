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

  /* ---- e-katalog sekmesi ------------------------------------------ */
  /* Baglanti target="_blank" ile de calisir; burada window.open ile
     aciliyor cunku bir sekme kendini yalnizca BETIKLE acildiysa
     kapatabilir. Katalog sayfasindaki "Siteye don", opener'i one alip
     kendi sekmesini kapatiyor - kullanici tikladigi sekmeye geri doner.
     Ayrica pencereye ad veriliyor: butona ikinci kez basildiginda yeni
     sekme acilmaz, acik olan one gelir. */
  var katalogBtn = document.querySelector(".katalog-cta a[href$='katalog.html']");
  if (katalogBtn) {
    katalogBtn.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var w = window.open(katalogBtn.href, "mensa-katalog");
      if (!w) return;             // acilir pencere engellendi: normal akis
      e.preventDefault();
      w.focus();
    });
  }

  /* ---- hero tuğla duvarı ------------------------------------------- */
  /* Kaynak burada seçiliyor, HTML'de <source> ile DEĞİL: şeffaf video için
     Safari yalnızca HEVC/.mov'u, Chrome ve Firefox yalnızca VP9/.webm'i
     destekliyor. Safari webm'i de oynatabildiği için <source> sıralaması
     ayrıştırmaz - yanlış dosyayı seçip tuğlaların arkasını siyah gösterir. */
  var tuglaKutu = document.querySelector(".hero-tugla");
  var tuglaVideo = tuglaKutu && tuglaKutu.querySelector("video");
  if (tuglaVideo && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var safari = /^((?!chrome|crios|fxios|android).)*safari/i.test(navigator.userAgent);
    tuglaVideo.src = safari ? "video/tugla-safari.mov" : "video/tugla.webm";
    // Yer ancak kaynak atandıktan sonra açılıyor; yüklenemezse boşluk kalmasın.
    tuglaVideo.addEventListener("loadeddata", function () {
      tuglaKutu.classList.add("acik");
      var s = tuglaVideo.play();
      if (s && s.catch) s.catch(function () { /* otomatik oynatma engellendi */ });
    });
    tuglaVideo.load();
  }

  /* ---- kayan şeritler (genel görünüm + markalar) --------------------- */
  /* Kaydırma CSS animasyonuyla DEĞİL, tarayıcının kendi yatay kaydırmasıyla
     yapılıyor: kullanıcının şeridi tutup sürükleyebilmesi isteniyor,
     transform'la kayan bir rayda sürükleme ile animasyon birbirini ezerdi.
     Ray iki özdeş yarıdan oluşuyor; kaydırma bir yarıyı geçince başa
     alınıyor, desen aynı olduğu için sıçrama görünmüyor. */
  function kayanSerit(kutu, ray, hiz, mq) {
    var suruklu = false, baslangicX = 0, baslangicKaydirma = 0;
    var yariGenislik = function () { return ray.scrollWidth / 2; };

    // Soldan sağa akış: scrollLeft AZALIR. Ortadan başlanıyor ki ilk
    // karede solda boşluk kalmasın.
    var konum = yariGenislik();
    kutu.scrollLeft = konum;
    /* Parmak değdiğinde otomatik akış susar. Zaman damgası tutuluyor:
       iOS'ta ivmeli kaydırma parmak kalktıktan SONRA da sürüyor, o
       sırada scrollLeft'e yazmak zıplamaya (glitch) yol açıyordu. */
    var dokunmaKilidi = 0;

    /* Konum AYRI bir değişkende ondalıklı tutuluyor. Doğrudan
       `kutu.scrollLeft -= hiz` yazılırsa tarayıcı değeri tam sayıya
       yuvarlar; kare başına 1 pikselden küçük adımlarda (marka şeridi
       0,4 px) okunan değer hep aynı kalır ve şerit hiç kımıldamaz. */
    var sarmala = function () {
      var yari = yariGenislik();
      if (konum <= 0) konum += yari;
      else if (konum >= yari * 2) konum -= yari;
    };

    var adim = function () {
      // mq verilmişse şerit yalnızca o kırılımda akar (markalar: telefon).
      if (mq && !mq.matches) { requestAnimationFrame(adim); return; }
      if (suruklu || performance.now() < dokunmaKilidi) {
        // Kullanıcı sürüklüyor ya da ivme sönüyor: konumu ondan al,
        // scrollLeft'e YAZMA.
        konum = kutu.scrollLeft;
      } else {
        // Tekerlek/parmakla elle kaydırıldıysa sapmayı yakala.
        if (Math.abs(kutu.scrollLeft - konum) > 2) konum = kutu.scrollLeft;
        konum -= hiz;
        sarmala();
        kutu.scrollLeft = konum;
      }
      requestAnimationFrame(adim);
    };
    requestAnimationFrame(adim);

    /* Dokunmatikte yatay kaydırmayı TARAYICI yapıyor (CSS'te
       touch-action: pan-x pan-y). Aşağıdaki fare sürüklemesi yalnızca
       imleçli cihazlar için; ikisi aynı anda çalışırsa iOS'ta kendi
       kaydırmasıyla çakışıp titriyor. */
    var dokunuldu = function (sure) {
      return function () { dokunmaKilidi = performance.now() + sure; };
    };
    kutu.addEventListener("touchstart", dokunuldu(1500), { passive: true });
    kutu.addEventListener("touchmove", dokunuldu(1500), { passive: true });
    kutu.addEventListener("touchend", dokunuldu(1100), { passive: true });

    kutu.addEventListener("pointerdown", function (e) {
      if (mq && !mq.matches) return;
      if (e.pointerType !== "mouse") return;   // dokunmatik: tarayıcı kaydırsın
      suruklu = true;
      baslangicX = e.clientX;
      // Parmak/fare tekerleğiyle elle kaydırılmış olabilir: gerçek konumu al
      konum = baslangicKaydirma = kutu.scrollLeft;
      kutu.classList.add("tutuluyor");
      kutu.setPointerCapture(e.pointerId);
    });
    kutu.addEventListener("pointermove", function (e) {
      if (!suruklu) return;
      e.preventDefault();
      konum = baslangicKaydirma - (e.clientX - baslangicX);
      sarmala();
      kutu.scrollLeft = konum;
    });
    var birak = function (e) {
      if (!suruklu) return;
      suruklu = false;
      kutu.classList.remove("tutuluyor");
      if (e.pointerId != null && kutu.hasPointerCapture(e.pointerId)) {
        kutu.releasePointerCapture(e.pointerId);
      }
    };
    kutu.addEventListener("pointerup", birak);
    kutu.addEventListener("pointercancel", birak);
    kutu.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var galeri = document.querySelector(".serit");
    if (galeri && galeri.querySelector(".serit-ray")) {
      kayanSerit(galeri, galeri.querySelector(".serit-ray"), 0.55);
    }
    var refKutu = document.querySelector(".ref-serit");
    if (refKutu && refKutu.querySelector(".ref-ray")) {
      // İş ortakları şeridi de yalnızca telefonda akıyor.
      kayanSerit(refKutu, refKutu.querySelector(".ref-ray"), 0.45,
                 matchMedia("(max-width: 620px)"));
    }
    var markaKutu = document.querySelector(".marka-serit");
    if (markaKutu && markaKutu.querySelector(".marka-ray")) {
      /* Marka şeridi YALNIZCA telefonda akıyor; masaüstünde aynı hücreler
         CSS ile altı sütunlu ızgaraya diziliyor, kaydırma yok.
         Logolar fotoğraflardan küçük, aynı hızda daha telaşlı görünüyor. */
      kayanSerit(markaKutu, markaKutu.querySelector(".marka-ray"), 0.4,
                 matchMedia("(max-width: 620px)"));
    }
  }

  /* ---- tam ekran katmanlar (markalar + iş ortakları) ------------------ */
  function tamEkranKatman(acButon, katman, kapatButon) {
    if (!acButon || !katman || typeof katman.showModal !== "function") return;

    acButon.addEventListener("click", function () {
      katman.showModal();
      // Sınıf BİR SONRAKİ karede ekleniyor: aynı karede eklenirse tarayıcı
      // başlangıç durumunu hiç görmez, geçiş oynamaz.
      requestAnimationFrame(function () { katman.classList.add("acik"); });
    });

    var kapat = function () {
      katman.classList.remove("acik");
      // Kapanış animasyonu bitmeden close() çağrılırsa katman aniden
      // kaybolur; süre CSS'teki geçişle aynı.
      setTimeout(function () { katman.close(); }, 260);
    };
    if (kapatButon) kapatButon.addEventListener("click", kapat);
    // Escape'in kendi kapatması animasyonu atlıyor: iptal edip elle kapat.
    katman.addEventListener("cancel", function (e) { e.preventDefault(); kapat(); });
    // Katmanın boş alanına tıklayınca da kapansın
    katman.addEventListener("click", function (e) { if (e.target === katman) kapat(); });
  }

  tamEkranKatman(
    document.querySelector(".marka-tumu-ac"),
    document.querySelector(".marka-tum:not(.ref-tum)"),
    document.querySelector(".marka-tum:not(.ref-tum) .marka-tum-kapat")
  );
  tamEkranKatman(
    document.querySelector(".ref-tumu-ac"),
    document.querySelector(".ref-tum"),
    document.querySelector(".ref-tum .ref-tum-kapat")
  );

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

  /* ---- ürün karuseli ------------------------------------------------ */
  /* Ray JS olmadan da kaydırılabilir (overflow-x). Buradaki tek katkı
     ok düğmeleri, sayaç ve uç noktalarda pasifleştirme. Düğmeler HTML'de
     hidden geliyor; JS yoksa ölü kontrol olarak görünmesinler diye. */
  var ray = document.getElementById("urun-ray");
  if (ray) {
    var sarmal = ray.parentElement;
    var oklar  = sarmal.querySelectorAll(".urun-ok");
    var sayac  = document.querySelector(".urun-sayac");

    sarmal.setAttribute("data-js", "");
    oklar.forEach(function (b) { b.hidden = false; });
    if (sayac) sayac.hidden = false;

    function sayfaSay() { return Math.max(1, Math.round(ray.scrollWidth / ray.clientWidth)); }
    function suAnki()   { return Math.round(ray.scrollLeft / ray.clientWidth); }

    function tazele() {
      var i = suAnki(), n = sayfaSay();
      oklar.forEach(function (b) {
        var yon = parseInt(b.getAttribute("data-yon"), 10);
        b.disabled = yon < 0 ? i <= 0 : i >= n - 1;
      });
      if (sayac) sayac.innerHTML = "<b>" + (i + 1) + "</b> / " + n;
    }

    oklar.forEach(function (b) {
      b.addEventListener("click", function () {
        var yon = parseInt(b.getAttribute("data-yon"), 10);
        ray.scrollBy({ left: yon * ray.clientWidth, behavior: still ? "auto" : "smooth" });
        // scroll olayi bogulursa da durum guncellensin
        setTimeout(tazele, 450);
      });
    });

    var bekle;
    ray.addEventListener("scroll", function () {
      clearTimeout(bekle);
      bekle = setTimeout(tazele, 90);
    });
    addEventListener("resize", tazele);
    tazele();
  }

  /* ---- ürün listesi katmanı ----------------------------------------- */
  /* Açma/kapama :target ile CSS'te. Burada eklenen: Escape ile kapatma,
     odağın katmana taşınması ve kapanınca geri verilmesi, arka planın
     kaydırılmaması. Hiçbiri olmasa da katman çalışmaya devam eder. */
  var katmanlar = document.querySelectorAll(".urun-liste");
  if (katmanlar.length) {
    var oncekiOdak = null;

    function acik() {
      var h = location.hash;
      if (!h || h.length < 2) return null;
      var el = document.getElementById(h.slice(1));
      return el && el.classList.contains("urun-liste") ? el : null;
    }

    function kapat() {
      var el = acik();
      if (!el) return;
      /* Yalnızca hash'i düşürmek YETMİYOR: tarayıcı :target'i replaceState
         sonrası yeniden hesaplamıyor, katman ekranda kalıyordu (ölçüldü).
         Sınıf katmanı kesin kapatır; bir sonraki açılışta kaldırılır. */
      el.classList.add("js-kapali");
      // pathname+search ile hash'i düşür: geri tuşuna yeni kayıt eklemez
      history.replaceState(null, "", location.pathname + location.search);
      durumTazele();
    }

    function durumTazele() {
      var el = acik();
      document.body.style.overflow = el ? "hidden" : "";
      if (el) {
        oncekiOdak = document.activeElement;
        var kapa = el.querySelector(".urun-liste-kapat");
        if (kapa) kapa.focus({ preventScroll: true });
      } else if (oncekiOdak) {
        oncekiOdak.focus({ preventScroll: true });
        oncekiOdak = null;
      }
    }

    addEventListener("hashchange", function () {
      // yeni katman açılıyor: önceki kapatmanın izini temizle
      for (var i = 0; i < katmanlar.length; i++) {
        katmanlar[i].classList.remove("js-kapali");
      }
      durumTazele();
    });
    addEventListener("keydown", function (e) {
      if (e.key === "Escape") kapat();
    });

    /* Kapatma bağlantıları (çarpı ve arka plan) HTML'de "#urunler"e gider;
       JS yoksa katman böyle kapanır, ama tarayıcı o çapaya ATLAR — kullanıcı
       listeyi kapatınca kendini bölümün en üstünde bulurdu. Burada gezinme
       iptal edilip hash sessizce düşürülüyor: katman kapanır, sayfa
       kullanıcının bıraktığı yerde kalır. */
    document.addEventListener("click", function (e) {
      var kapa = e.target.closest(".urun-liste-kapat, .urun-liste-ort");
      if (!kapa) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      kapat();
    });
    durumTazele();
  }
})();
