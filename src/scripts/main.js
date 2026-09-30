/*
 * Vitra Lightscape — interactions de la page
 * - navigation mobile
 * - en-tête jour / nuit
 * - « La nuit tombe » : ciel, horloge et logo liés au défilement
 * - stations : passage jour → nuit → mapping au défilement
 * - chemin lumineux qui s'allume en descendant
 * - apparitions au défilement
 * Tout le contenu reste lisible sans JavaScript.
 */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stickyMode = window.matchMedia('(min-width: 1024px) and (min-height: 620px)');

  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var smooth = function (a, b, v) {
    var t = clamp((v - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
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

  /* ---------- En-tête jour / nuit ---------- */
  var header = document.querySelector('[data-header]');
  var themed = Array.prototype.slice.call(document.querySelectorAll('main [data-theme], footer[data-theme], [data-dusk]'));

  /* ---------- La nuit tombe ---------- */
  var dusk = document.querySelector('[data-dusk]');
  var duskSticky = dusk && dusk.querySelector('[data-dusk-sticky]');
  var duskClock = dusk && dusk.querySelector('[data-dusk-clock]');
  var duskLogo = dusk && dusk.querySelector('[data-logo-flare]');
  var duskP = 0;
  var sky = [
    [0, [255, 255, 255]],
    [0.22, [246, 236, 222]],
    [0.4, [214, 176, 150]],
    [0.55, [120, 96, 118]],
    [0.7, [42, 44, 70]],
    [0.85, [14, 18, 32]],
    [1, [7, 10, 18]],
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
  var fmt = function (m) {
    var h = Math.floor(m / 60), mm = Math.round(m % 60);
    return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm;
  };
  var updateDusk = function () {
    if (!dusk) return;
    var r = dusk.getBoundingClientRect();
    var span = r.height - window.innerHeight;
    duskP = clamp(-r.top / span, 0, 1);
    var c = mix(sky, duskP);
    duskSticky.style.setProperty('--sky', 'rgb(' + c.join(',') + ')');
    var ink = duskP < 0.5 ? '#111111' : '#f1eee8';
    duskSticky.style.setProperty('--sky-ink', ink);
    duskSticky.style.setProperty('--stars', smooth(0.7, 0.95, duskP).toFixed(3));
    var from = Number(dusk.dataset.from), to = Number(dusk.dataset.to);
    duskClock.textContent = fmt(from + (to - from) * duskP);
    var logoO = smooth(0.55, 0.7, duskP);
    duskSticky.style.setProperty('--logo-o', logoO.toFixed(3));
    if (duskLogo && logoO > 0.5 && !duskLogo.classList.contains('is-playing')) {
      duskLogo.classList.add('is-playing');
    }
  };

  /* ---------- Stations ---------- */
  var stations = Array.prototype.slice.call(document.querySelectorAll('[data-station]')).map(function (el) {
    var drawCore = Array.prototype.slice.call(el.querySelectorAll('.mapping__core [data-draw]'));
    var drawGlow = Array.prototype.slice.call(el.querySelectorAll('.mapping__glow [data-draw]'));
    var st = {
      el: el,
      frame: el.querySelector('.station__frame'),
      core: drawCore,
      glow: drawGlow,
      band: el.querySelector('[data-sweep]'),
      width: Number((el.querySelector('.mapping').getAttribute('viewBox') || '0 0 1672 941').split(' ')[2]),
      buttons: Array.prototype.slice.call(el.querySelectorAll('[data-phase]')),
      manual: null,
      manualAt: 0,
      p: 1,
    };
    st.buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        st.manual = Number(b.dataset.phase);
        st.manualAt = scrollP(st);
        render(st, st.manual);
      });
    });
    return st;
  });

  var scrollP = function (st) {
    var vh = window.innerHeight;
    if (stickyMode.matches) {
      var r = st.el.getBoundingClientRect();
      var stickyH = vh - 64;
      return clamp((64 - r.top) / (r.height - stickyH), 0, 1);
    }
    var f = st.frame.getBoundingClientRect();
    return clamp((vh * 0.92 - f.top) / (vh * 0.72), 0, 1);
  };

  var render = function (st, p) {
    st.p = p;
    var night = smooth(0.08, 0.42, p);
    var map = smooth(0.5, 0.9, p);
    st.el.style.setProperty('--night-o', night.toFixed(3));
    st.el.style.setProperty('--map', map.toFixed(3));
    st.el.style.setProperty('--p', p.toFixed(3));
    var n = st.core.length, s = 0.4, k = 1 + (n - 1) * s;
    for (var i = 0; i < n; i++) {
      var li = clamp(map * k - i * s, 0, 1);
      var off = (1 - li).toFixed(4);
      st.core[i].style.strokeDashoffset = off;
      if (st.glow[i]) st.glow[i].style.strokeDashoffset = off;
    }
    var live = map > 0.98;
    st.el.classList.toggle('is-live', live);
    if (st.band) {
      st.band.style.transform = live ? '' : 'translateX(' + (map * (st.width + 840)).toFixed(0) + 'px)';
    }
    var phase = p < 0.25 ? 0 : p < 0.75 ? 1 : 2;
    st.buttons.forEach(function (b, idx) { b.setAttribute('aria-pressed', idx === phase ? 'true' : 'false'); });
  };

  var updateStations = function () {
    stations.forEach(function (st) {
      if (reduceMotion && st.manual === null) {
        if (st.p !== 1) render(st, 1);
        return;
      }
      var p = scrollP(st);
      if (st.manual !== null) {
        if (Math.abs(p - st.manualAt) < 0.12) return;
        st.manual = null;
      }
      if (Math.abs(p - st.p) > 0.0005) render(st, p);
    });
  };

  /* ---------- Chemin lumineux ---------- */
  var section = document.querySelector('#stations');
  var lp = document.querySelector('[data-lightpath]');
  var lpPaths = lp ? lp.querySelectorAll('path') : [];
  var lpLit = lp && lp.querySelector('.lightpath__lit');
  var lpGlow = lp && lp.querySelector('.lightpath__glow');
  var lpHead = lp && lp.querySelector('.lightpath__head');
  var nodes = section ? Array.prototype.slice.call(section.querySelectorAll('[data-path-node]')) : [];
  var samples = [];
  var totalLen = 0;
  var nodeY = [];

  var buildPath = function () {
    if (!lp || !section) return;
    var sr = section.getBoundingClientRect();
    var top = sr.top + window.scrollY;
    lp.setAttribute('viewBox', '0 0 ' + sr.width + ' ' + sr.height);
    var pts = nodes.map(function (n) {
      var r = n.getBoundingClientRect();
      return { x: r.left + r.width / 2 - sr.left, y: r.top + window.scrollY + r.height / 2 - top };
    });
    nodeY = pts.map(function (p) { return p.y; });
    if (!pts.length) return;
    var x0 = pts[0].x;
    var amp = Math.min(22, Math.max(6, x0 - 4));
    var d = 'M ' + x0 + ' 0 L ' + x0 + ' ' + pts[0].y;
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i];
      var dir = i % 2 ? 1 : -1;
      var dy = b.y - a.y;
      d += ' C ' + (a.x + amp * dir) + ' ' + (a.y + dy * 0.35) + ', ' + (b.x - amp * dir) + ' ' + (b.y - dy * 0.35) + ', ' + b.x + ' ' + b.y;
    }
    for (var j = 0; j < lpPaths.length; j++) lpPaths[j].setAttribute('d', d);
    totalLen = lpLit.getTotalLength();
    lpLit.style.strokeDasharray = totalLen + ' ' + totalLen;
    lpGlow.style.strokeDasharray = totalLen + ' ' + totalLen;
    samples = [];
    var steps = 240;
    for (var s = 0; s <= steps; s++) {
      var len = (totalLen * s) / steps;
      var pt = lpLit.getPointAtLength(len);
      samples.push([len, pt.x, pt.y]);
    }
  };

  var updatePath = function () {
    if (!lp || !samples.length) return;
    var sr = section.getBoundingClientRect();
    var target = reduceMotion ? Infinity : window.innerHeight * 0.62 - sr.top;
    var len = totalLen, hx = samples[samples.length - 1][1], hy = samples[samples.length - 1][2];
    if (target < samples[samples.length - 1][2]) {
      len = 0; hx = samples[0][1]; hy = samples[0][2];
      for (var i = 1; i < samples.length; i++) {
        if (samples[i][2] >= target) {
          var a = samples[i - 1], b = samples[i];
          var k = b[2] === a[2] ? 1 : clamp((target - a[2]) / (b[2] - a[2]), 0, 1);
          len = a[0] + (b[0] - a[0]) * k;
          hx = a[1] + (b[1] - a[1]) * k;
          hy = a[2] + (b[2] - a[2]) * k;
          break;
        }
      }
      if (target <= 0) len = 0;
    }
    var off = (totalLen - len).toFixed(1);
    lpLit.style.strokeDashoffset = off;
    lpGlow.style.strokeDashoffset = off;
    lpHead.setAttribute('cx', hx.toFixed(1));
    lpHead.setAttribute('cy', hy.toFixed(1));
    lpHead.style.opacity = len > 0 && len < totalLen ? '1' : '0';
    nodes.forEach(function (n, idx) { n.classList.toggle('is-lit', target >= nodeY[idx] - 2); });
  };

  /* ---------- En-tête ---------- */
  var updateHeader = function () {
    if (!header) return;
    var y = 65;
    var theme = 'day';
    for (var i = 0; i < themed.length; i++) {
      var r = themed[i].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) {
        theme = themed[i].hasAttribute('data-dusk') ? (duskP > 0.5 ? 'night' : 'day') : themed[i].getAttribute('data-theme');
      }
    }
    if (header.getAttribute('data-theme') !== theme) header.setAttribute('data-theme', theme);
  };

  /* ---------- Boucle ---------- */
  var ticking = false;
  var frame = function () {
    ticking = false;
    updateDusk();
    updateStations();
    updatePath();
    updateHeader();
  };
  var request = function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  };

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', function () {
    buildPath();
    request();
  });
  if ('ResizeObserver' in window && section) {
    new ResizeObserver(function () { buildPath(); request(); }).observe(section);
  }
  if (stickyMode.addEventListener) stickyMode.addEventListener('change', function () { buildPath(); request(); });
  window.addEventListener('load', function () { buildPath(); request(); });

  buildPath();
  stations.forEach(function (st) { st.p = -1; });
  frame();
})();
