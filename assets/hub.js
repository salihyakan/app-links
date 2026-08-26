(function () {
  var ORDER = ["habitrive", "yonetimo", "charmelo"];

  function chevronSvg() {
    return '<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M9 6l6 6-6 6"/></svg>';
  }

  function cardInner(app) {
    return (
      '<div class="icon-tile' + (app.status === "soon" ? " soon" : "") + '">' +
      '<img src="' + app.icon + '" alt="" loading="lazy"></div>' +
      '<div class="app-card-body"><h2>' + app.name + "</h2>" +
      '<p class="tagline">' + app.tagline + "</p></div>" +
      (app.status === "live"
        ? '<span class="pill live"><span class="dot"></span>Canlı</span>' + chevronSvg()
        : '<span class="pill soon">Yakında</span>')
    );
  }

  fetch("assets/apps.json")
    .then(function (r) { return r.json(); })
    .then(function (apps) {
      var grid = document.getElementById("appGrid");
      ORDER.forEach(function (slug) {
        var app = apps[slug];
        if (!app) return;
        if (app.status === "live") {
          var a = document.createElement("a");
          a.className = "card-link";
          a.href = slug + "/";
          a.innerHTML = '<div class="app-card">' + cardInner(app) + "</div>";
          grid.appendChild(a);
        } else {
          var div = document.createElement("div");
          div.className = "app-card disabled";
          div.innerHTML = cardInner(app);
          grid.appendChild(div);
        }
      });
    });
})();
