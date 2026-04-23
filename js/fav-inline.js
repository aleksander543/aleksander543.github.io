// Megapolis — sekcja "Twoje ulubione" na landing page
// Renderuje tylko gdy localStorage ma cokolwiek w ulubionych.
// Wymagane: /js/favorites.js + /js/apartments-data.js zaladowane wczesniej.

(function () {
  var section = document.getElementById('favInlineSection');
  var grid    = document.getElementById('favInlineGrid');
  var subEl   = document.getElementById('favInlineSub');
  if (!section || !grid) return;
  if (!window.MegapolisFavs || !window.getMegapolisApartment) return;

  var invColors = { ozon: '#2d7a5f', clou: '#c9a55c', fi: '#e8614a', link: '#1a5490' };
  function fmtPrice(p) {
    return window.formatMegapolisPrice ? window.formatMegapolisPrice(p) : (p + ' zł');
  }

  function render() {
    var ids = window.MegapolisFavs.getAll();
    var apts = ids.map(window.getMegapolisApartment).filter(Boolean);

    if (apts.length === 0) {
      section.hidden = true;
      return;
    }
    section.hidden = false;

    // Podsumowanie "Masz zapisane X mieszkania — suma Y zl"
    if (subEl) {
      var total = apts.reduce(function (s, a) { return s + (a.price || 0); }, 0);
      var wordApt = apts.length === 1 ? 'mieszkanie' : (apts.length < 5 ? 'mieszkania' : 'mieszkań');
      subEl.innerHTML = 'Masz zapisane <strong>' + apts.length + '</strong> ' + wordApt +
        ' &middot; szacunkowa wartość <strong>' + fmtPrice(total) + '</strong>';
    }

    // Max 4 karty inline, reszta na /ulubione/
    var shown = apts.slice(0, 4);
    var html = shown.map(function (apt) {
      var invColor = invColors[apt.investment] || '#003c71';
      return (
        '<a href="/mieszkanie/?id=' + apt.id + '" class="fav-inline-card" style="--inv-c: ' + invColor + ';">' +
          '<div class="fav-inline-card__tags">' +
            '<span class="fav-inline-card__inv">' + apt.invName + ' &middot; ' + apt.city + '</span>' +
          '</div>' +
          '<div class="fav-inline-card__id">' + apt.id + '</div>' +
          '<div class="fav-inline-card__meta">' + apt.rooms + ' pokoje &middot; ' + apt.area + ' m² &middot; ' + apt.floorLabel + '</div>' +
          '<div class="fav-inline-card__foot">' +
            '<span class="fav-inline-card__price">' + fmtPrice(apt.price) + '</span>' +
            '<button type="button" class="fav-inline-card__remove" data-remove-fav="' + apt.id + '" aria-label="Usun z ulubionych">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>' +
          '</div>' +
        '</a>'
      );
    }).join('');

    grid.innerHTML = html;

    // Handler X w kazdej karcie - usun bez przechodzenia do szczegolow
    grid.querySelectorAll('[data-remove-fav]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        window.MegapolisFavs.toggle(btn.dataset.removeFav);
      });
    });
  }

  render();
  window.MegapolisFavs.on(render);
  window.addEventListener('megapolis-favs-change', render);
})();
