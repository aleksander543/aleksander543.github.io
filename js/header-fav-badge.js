// Megapolis — badge licznika w ikonie serduszka w headerze
// Wymaga /js/favorites.js zaladowanego wczesniej.

(function () {
  function update() {
    var badge = document.getElementById('hdrFavBadge');
    var link  = document.getElementById('hdrFavLink');
    if (!badge || !window.MegapolisFavs) return;
    var n = window.MegapolisFavs.count();
    badge.textContent = String(n);
    if (n > 0) {
      badge.hidden = false;
      if (link) link.classList.add('has-favs');
    } else {
      badge.hidden = true;
      if (link) link.classList.remove('has-favs');
    }
  }

  function init() {
    if (!window.MegapolisFavs) return;
    update();
    window.MegapolisFavs.on(update);
    window.addEventListener('megapolis-favs-change', update);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// === FLY-HEART ANIMACJA: serduszko lecace z karty do headera =================
// Uzycie: MegapolisFlyHeart(sourceEl) po dodaniu mieszkania do ulubionych.
// Anim: ~800ms, parabola do headera, konczy sie "bounce" na headerowej ikonie.
(function () {
  var HEART_SVG = '<svg viewBox="0 0 24 24" fill="#e8414c" stroke="#e8414c" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

  function bounceTarget(target) {
    if (!target || typeof target.animate !== 'function') return;
    target.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.35)', offset: 0.4 },
      { transform: 'scale(0.92)', offset: 0.7 },
      { transform: 'scale(1)' }
    ], { duration: 380, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1.2)' });
  }

  window.MegapolisFlyHeart = function (sourceEl) {
    var target = document.getElementById('hdrFavLink');
    if (!sourceEl || !target || typeof sourceEl.getBoundingClientRect !== 'function') return;
    if (typeof document.createElement('div').animate !== 'function') {
      // Fallback: tylko bounce na headerze (brak WAAPI)
      bounceTarget(target);
      return;
    }

    // Mierzymy bounding box samej IKONY SVG w headerze (nie linku z badge'm),
    // zeby duch trafil dokladnie w serduszko a nie gdzies obok.
    var targetIcon = target.querySelector('svg') || target;
    var srcIcon    = sourceEl.querySelector('svg') || sourceEl;
    var src = srcIcon.getBoundingClientRect();
    var dst = targetIcon.getBoundingClientRect();
    var size = 24;
    var startX = src.left + src.width  / 2;
    var startY = src.top  + src.height / 2;
    var endX   = dst.left + dst.width  / 2;
    var endY   = dst.top  + dst.height / 2;

    var ghost = document.createElement('div');
    ghost.setAttribute('aria-hidden', 'true');
    ghost.innerHTML = HEART_SVG;
    ghost.style.cssText =
      'position:fixed;left:0;top:0;width:' + size + 'px;height:' + size + 'px;' +
      'z-index:10001;pointer-events:none;' +
      'filter:drop-shadow(0 6px 18px rgba(232,65,76,0.55));' +
      'will-change:transform,opacity;';
    var svg = ghost.querySelector('svg');
    if (svg) { svg.setAttribute('width', size); svg.setAttribute('height', size); svg.style.display = 'block'; }
    document.body.appendChild(ghost);

    // Lot po linii prostej - bez luku. Duch wyskakuje ze zrodla (skala 0.6 -> 1.3),
    // po czym leci prosto do headerowej ikony i kurczy sie wchodzac w nia.
    var anim = ghost.animate([
      { transform: 'translate(' + (startX - size/2) + 'px,' + (startY - size/2) + 'px) scale(0.6)',  opacity: 0.0, offset: 0 },
      { transform: 'translate(' + (startX - size/2) + 'px,' + (startY - size/2) + 'px) scale(1.3)',  opacity: 1,   offset: 0.15 },
      { transform: 'translate(' + (endX   - size/2) + 'px,' + (endY   - size/2) + 'px) scale(0.55)', opacity: 1,   offset: 0.9  },
      { transform: 'translate(' + (endX   - size/2) + 'px,' + (endY   - size/2) + 'px) scale(0.25)', opacity: 0,   offset: 1 }
    ], {
      duration: 1350,
      easing: 'cubic-bezier(0.45, 0, 0.2, 1)'
    });
    anim.onfinish = function () {
      ghost.remove();
      bounceTarget(target);
    };
  };
})();
