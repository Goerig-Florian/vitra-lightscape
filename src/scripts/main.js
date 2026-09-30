/*
 * Vitra Lightscape — interactions de la page
 * - navigation mobile
 * - vidéo du premier écran : horloge synchronisée, mapping à la nuit, pause
 * - « Le soleil se couche » : ciel, soleil, horloge et logo liés au défilement
 * - parcours : filtres par mode de mise en lumière, liste ↔ points du plan
 * - en-tête transparent / jour / nuit, apparitions au défilement
 * Tout le contenu reste lisible sans JavaScript.
 */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var smooth = function (a, b, v) {
    var t = clamp((v - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  var fmt = function (m) {
    var h = Math.floor(m / 60), mm = Math.floor(m % 60);
    return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm;
  };

  /* ---------- Navigation mobile ---------- */
  var nav = document.querySelector('[data-nav]');
  if (nav) {
    var toggle = nav.querySelector('[data-nav-toggle]');
    var setOpen = function (open) {
      if (open) nav.setAttribute('data-open', '');
      else nav.removeAttribute('data-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.hasAttribute('data-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Apparitions ---------- */
  var revealables = document.querySelectorAll('.reveal, [data-map]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Vidéo du premier écran ---------- */
  var hero = document.querySelector('[data-hero]');
  var video = hero && hero.querySelector('[data-hero-video]');
  if (hero && video) {
    var clock = hero.querySelector('[data-hero-clock]');
    var toggleBtn = hero.querySelector('[data-video-toggle]');
    var toggleLabel = hero.querySelector('[data-video-label]');
    var replayBtn = hero.querySelector('[data-video-replay]');
    var from = Number(hero.dataset.from), to = Number(hero.dataset.to);
    var NIGHT_AT = 0.8; // part de la vidéo à partir de laquelle il fait nuit
    var raf = null;

    var setPaused = function (paused) {
      toggleBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      toggleLabel.textContent = paused ? 'Lire la vidéo' : 'Mettre la vidéo en pause';
    };

    var sync = function () {
      var d = video.duration || 12;
      var p = clamp(video.currentTime / d, 0, 1);
      clock.textContent = fmt(from + (to - from) * p);
      hero.classList.toggle('is-night', p >= NIGHT_AT);
    };

    var loop = function () {
      sync();
      if (!video.paused && !video.ended) raf = requestAnimationFrame(loop);
    };

    // Animations réduites : l'affiche de nuit (dernière image de la vidéo) reste affichée
    var showNight = function () {
      var still = document.createElement('img');
      still.className = 'hero__video hero__still';
      still.src = video.dataset.posterNight;
      still.alt = '';
      video.after(still);
      video.preload = 'none';
      clock.textContent = fmt(to);
      hero.classList.add('is-night');
    };

    video.addEventListener('play', function () {
      setPaused(false);
      cancelAnimationFrame(raf);
      loop();
    });
    video.addEventListener('pause', function () { setPaused(true); sync(); });
    video.addEventListener('ended', function () {
      setPaused(true);
      toggleLabel.textContent = 'Revoir la vidéo';
      sync();
    });
    video.addEventListener('seeked', sync);

    toggleBtn.addEventListener('click', function () {
      if (video.paused || video.ended) {
        if (video.ended) video.currentTime = 0;
        video.muted = true;
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    });

    replayBtn.addEventListener('click', function () {
      hero.classList.remove('is-night');
      video.currentTime = 0;
      video.play().catch(function () {});
    });

    if (reduceMotion) {
      setPaused(true);
      showNight();
    } else {
      video.muted = true; // nécessaire à la lecture automatique sur mobile
      var p = video.play();
      if (p && p.catch) p.catch(function () { setPaused(true); });
    }
  }

  /* ---------- Le soleil se couche ---------- */
  var dusk = document.querySelector('[data-dusk]');
  var duskSticky = dusk && dusk.querySelector('[data-dusk-sticky]');
  var duskClock = dusk && dusk.querySelector('[data-dusk-clock]');
  var duskLogo = dusk && dusk.querySelector('[data-logo-flare]');
  var duskP = 0;
  var sky = [
    [0, [232, 171, 147]],
    [0.2, [224, 146, 128]],
    [0.38, [201, 130, 138]],
    [0.52, [120, 82, 116]],
    [0.66, [60, 44, 84]],
    [0.8, [26, 24, 48]],
    [1, [11, 14, 26]],
  ];
  var mix = function (stops, t) {
    for (var i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) {
        var a = stops[i - 1], b = stops[i];
        var k = (t - a[0]) / (b[0] - a[0]);
        return a[1].map(function (c, j) { return Math.round(c + (b[1][j] - c) * k); });
      }
    }
    return stops[stops.length - 1][1];
  };
  var updateDusk = function () {
    if (!dusk) return;
    var r = dusk.getBoundingClientRect();
    duskP = clamp(-r.top / (r.height - window.innerHeight), 0, 1);
    var c = mix(sky, duskP);
    duskSticky.style.setProperty('--sky', 'rgb(' + c.join(',') + ')');
    var night = duskP >= 0.45;
    duskSticky.style.setProperty('--sky-ink', night ? '#f4efe8' : '#1c1512');
    duskSticky.classList.toggle('is-night', duskP >= 0.55);
    duskSticky.style.setProperty('--sun-o', (1 - smooth(0.25, 0.6, duskP)).toFixed(3));
    duskSticky.style.setProperty('--sun-y', (smooth(0, 0.6, duskP) * 30).toFixed(1) + 'vmin');
    duskSticky.style.setProperty('--stars', smooth(0.62, 0.9, duskP).toFixed(3));
    var from = Number(dusk.dataset.from), to = Number(dusk.dataset.to);
    duskClock.textContent = fmt(from + (to - from) * duskP);
    var logoO = smooth(0.6, 0.72, duskP);
    duskSticky.style.setProperty('--logo-o', logoO.toFixed(3));
    if (duskLogo && logoO > 0.5 && !duskLogo.classList.contains('is-playing')) duskLogo.classList.add('is-playing');
  };

  /* ---------- Parcours : filtres et liaison liste ↔ plan ---------- */
  var parcours = document.querySelector('[data-parcours]');
  if (parcours) {
    var map = parcours.querySelector('[data-map]');
    var stops = Array.prototype.slice.call(parcours.querySelectorAll('[data-stop]'));
    var items = Array.prototype.slice.call(parcours.querySelectorAll('[data-item]'));
    var filters = Array.prototype.slice.call(parcours.querySelectorAll('[data-filter]'));

    var activate = function (idx, on) {
      if (stops[idx]) stops[idx].classList.toggle('is-active', on);
      if (items[idx]) items[idx].classList.toggle('is-active', on);
    };

    items.forEach(function (item) {
      var idx = Number(item.dataset.item);
      item.addEventListener('mouseenter', function () { activate(idx, true); });
      item.addEventListener('mouseleave', function () { activate(idx, false); });
      item.addEventListener('focus', function () { activate(idx, true); });
      item.addEventListener('blur', function () { activate(idx, false); });
    });

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.dataset.filter;
        filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        map.classList.toggle('is-filtered', f !== 'all');
        items.forEach(function (item, i) {
          var match = f === 'all' || item.dataset.modes.split(' ').indexOf(f) !== -1;
          item.hidden = !match;
          if (stops[i]) stops[i].classList.toggle('is-dim', !match);
        });
      });
    });
  }

  /* ---------- En-tête ---------- */
  var header = document.querySelector('[data-header]');
  var themed = Array.prototype.slice.call(document.querySelectorAll('main [data-theme], footer[data-theme], [data-dusk]'));
  var updateHeader = function () {
    if (!header) return;
    var y = 65;
    var theme = header.getAttribute('data-theme');
    for (var i = 0; i < themed.length; i++) {
      var r = themed[i].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) {
        theme = themed[i].hasAttribute('data-dusk') ? (duskP >= 0.45 ? 'night' : 'day') : themed[i].getAttribute('data-theme');
      }
    }
    if (window.scrollY < 4 && hero) theme = 'hero';
    if (header.getAttribute('data-theme') !== theme) header.setAttribute('data-theme', theme);
  };

  /* ---------- Boucle ---------- */
  var ticking = false;
  var frame = function () {
    ticking = false;
    updateDusk();
    updateHeader();
  };
  var request = function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  frame();
})();
