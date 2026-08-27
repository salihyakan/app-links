(function () {
  var SOCIAL_ICONS = {
    instagram:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
    x:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    tiktok:
      '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M16.6 3c.4 2.2 1.9 3.9 4.1 4.2v2.9c-1.5.1-2.9-.4-4.1-1.2v6.7c0 3.4-2.8 6.1-6.2 6.1S4.2 18 4.2 14.6c0-3.3 2.6-6 5.9-6.1v3c-1.6.1-2.9 1.4-2.9 3.1 0 1.7 1.4 3.1 3.1 3.1s3.1-1.4 3.1-3.1V3h3.2z"/></svg>',
    appstore:
      '<svg viewBox="0 0 384 512" fill="currentColor" stroke="none"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 8 184.8 8 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-65.7-90-65.7-91.9zm-56.6-164.2c27-32.1 24.5-61.2 23.7-71.7-23.8 1.4-51.3 16.4-67 34.9-17.3 19.8-27.5 44.3-25.4 71.4 25.9 2 49.5-11.4 68.7-34.6z"/></svg>',
    play:
      '<svg viewBox="0 0 512 512" fill="currentColor" stroke="none"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60-34.1c17.8-11.1 17.8-49.7-1.1-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>'
  };

  var SOCIAL_LABEL = { instagram: "Instagram", x: "X", tiktok: "TikTok" };

  var slug = document.body.dataset.slug;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  fetch("../assets/apps.json")
    .then(function (r) { return r.json(); })
    .then(function (apps) {
      var app = apps[slug];
      if (!app) return;

      document.body.classList.add("theme-" + (app.theme || slug));
      document.title = app.name;

      document.getElementById("icon").src = "../" + app.icon;
      document.getElementById("name").textContent = app.name;
      document.getElementById("tagline").textContent = app.tagline;

      var descEl = document.getElementById("description");
      if (app.description) {
        descEl.textContent = app.description;
      } else {
        descEl.remove();
      }

      renderSocials(app);
      renderStoreSection(app);
    });

  function renderSocials(app) {
    var section = document.getElementById("socialSection");
    if (!app.socials || app.socials.length === 0) {
      section.remove();
      return;
    }
    var row = document.getElementById("socialRow");
    app.socials.forEach(function (s) {
      var a = document.createElement("a");
      a.className = "social-icon";
      a.href = s.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = (SOCIAL_ICONS[s.platform] || "") + "<span>" + (SOCIAL_LABEL[s.platform] || s.platform) + "</span>";
      row.appendChild(a);
    });
  }

  function renderStoreSection(app) {
    var container = document.getElementById("storeSection");

    if (app.status !== "live") {
      container.innerHTML =
        '<p class="soon-note">' + app.name + " çok yakında App Store ve Google Play'de. Hazır olduğunda bu sayfa otomatik yönlendirmeye başlayacak.</p>";
      return;
    }

    container.innerHTML =
      '<div class="redirect-card">' +
      '<div class="status" id="status" role="status" aria-live="polite">' +
      '<span class="spinner" id="spinner"></span><span id="statusText">Cihazın kontrol ediliyor…</span></div>' +
      '<div class="actions">' +
      '<a class="store-btn" id="btnIos" href="' + app.appStoreUrl + '" rel="noopener">' +
      SOCIAL_ICONS.appstore +
      '<span class="btn-label"><span>App Store</span><small>iPhone / iPad</small></span></a>' +
      '<a class="store-btn" id="btnAndroid" href="' + app.playStoreUrl + '" rel="noopener">' +
      SOCIAL_ICONS.play +
      '<span class="btn-label"><span>Google Play</span><small>Android</small></span></a>' +
      "</div>" +
      '<p class="footnote">Otomatik yönlendirme çalışmazsa yukarıdaki butona dokun.</p>' +
      "</div>";

    var ua = navigator.userAgent || "";
    var isIOS = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
    var isAndroid = /Android/.test(ua);

    var statusText = document.getElementById("statusText");
    var spinner = document.getElementById("spinner");
    var btnIos = document.getElementById("btnIos");
    var btnAndroid = document.getElementById("btnAndroid");

    setTimeout(function () {
      if (isIOS) {
        statusText.textContent = "iPhone algılandı, App Store'a yönlendiriliyorsun…";
        btnIos.classList.add("primary");
        setTimeout(function () { window.location.href = btnIos.href; }, reduceMotion ? 0 : 700);
      } else if (isAndroid) {
        statusText.textContent = "Android algılandı, Google Play'e yönlendiriliyorsun…";
        btnAndroid.classList.add("primary");
        setTimeout(function () { window.location.href = btnAndroid.href; }, reduceMotion ? 0 : 700);
      } else {
        spinner.style.display = "none";
        statusText.textContent = "Cihazını algılayamadık, aşağıdan seç:";
      }
    }, reduceMotion ? 0 : 900);
  }
})();
