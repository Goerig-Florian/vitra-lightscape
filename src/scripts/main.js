/*
 * Vitra Lightscape — interactions de la page
 * - navigation mobile
 * - vidéo du premier écran : horloge synchronisée, lumière à la nuit, pause
 * - « Le soleil se couche » : ciel, soleil, horloge et logo liés au défilement
 * - parcours : chemin lumineux étape par étape, filtres, liste ↔ repères du plan
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
  var revealables = document.querySelectorAll('.reveal');
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
    var toggleBtn = hero.querySelector('[data-video-toggle]');
    var toggleLabel = hero.querySelector('[data-video-label]');
    var NIGHT_AT = 0.8; // part de la vidéo à partir de laquelle il fait nuit
    var raf = null;

    var setPaused = function (paused) {
      toggleBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      toggleLabel.textContent = paused ? 'Lire la vidéo' : 'Mettre la vidéo en pause';
    };

    var sync = function () {
      var d = video.duration || 12;
      var p = clamp(video.currentTime / d, 0, 1);
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
      hero.classList.add('is-night');
    };

    video.addEventListener('play', function () {
      teaser(false);
      setPaused(false);
      cancelAnimationFrame(raf);
      loop();
    });
    video.addEventListener('pause', function () { setPaused(true); sync(); });
    var teaserTimer = null;
    var teaser = function (on) {
      clearTimeout(teaserTimer);
      hero.classList.toggle('is-teaser', on);
      if (on) teaserTimer = setTimeout(function () { hero.classList.remove('is-teaser'); }, 3600);
    };
    video.addEventListener('ended', function () {
      if (!reduceMotion) teaser(true);
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

  /* ---------- Parcours : chemin lumineux, fiche du bâtiment, filtres, liste ↔ carte ---------- */
  var parcours = document.querySelector('[data-parcours]');
  var plan = parcours && parcours.querySelector('[data-plan]');
  if (parcours && plan) {
    var q = function (sel) { return Array.prototype.slice.call(parcours.querySelectorAll(sel)); };
    var stops = q('[data-stop]');
    var filters = q('[data-filter]');
    var ats = stops.map(function (s) { return Number(s.dataset.at); });
    var bldgs = {}, spurs = {};
    q('[data-bldg]').forEach(function (b) { (bldgs[b.dataset.bldg] = bldgs[b.dataset.bldg] || []).push(b); });
    q('[data-spur]').forEach(function (s) { spurs[s.dataset.spur] = s; });
    var nowN = parcours.querySelector('[data-now-n]');
    var nowName = parcours.querySelector('[data-now-name]');
    var nowMeta = parcours.querySelector('[data-now-meta]');
    var ctrl = parcours.querySelector('[data-plan-toggle]');
    var ctrlLabel = parcours.querySelector('[data-plan-label]');
    var current = 0;
    var payload = JSON.parse(document.getElementById('fiches-data').textContent);
    var data = payload.stops;
    var fiche = parcours.querySelector('[data-fiche]');
    var fImg = fiche.querySelector('[data-fiche-img]');
    var fNight = fiche.querySelector('[data-fiche-night]');
    var fTime = fiche.querySelector('[data-fiche-time]');
    var fTimeLabel = fiche.querySelector('[data-fiche-time-label]');
    var fCredit = fiche.querySelector('[data-fiche-credit]');
    var nightOn = false; // vrai seulement après un clic sur « Voir de nuit », pour l'étape affichée
    var selected = 0;
    var pauseAnim = function () {};
    var seek = function () {}; // amène le chemin à l'étape choisie (défini avec l'animation)

    var extras = function (i) {
      var id = stops[i].dataset.id;
      return (bldgs[id] || []).concat(spurs[id] ? [spurs[id]] : []);
    };

    var two = function (i) { return (i < 9 ? '0' : '') + (i + 1); };

    // Étape affichée sous la carte (numéro, nom, auteur)
    var show = function (i) {
      nowN.textContent = two(i);
      nowName.textContent = data[i].name;
      nowMeta.textContent = data[i].meta;
    };

    // Texte de la fiche (numéro, nom, auteur, modes, lien)
    var fillBody = function (i) {
      var d = data[i];
      fiche.querySelector('[data-fiche-n]').textContent = two(i);
      fiche.querySelector('[data-fiche-name]').textContent = d.name;
      fiche.querySelector('[data-fiche-meta]').textContent = d.meta;
      fiche.querySelector('[data-fiche-link]').href = d.href;
      var box = fiche.querySelector('[data-fiche-modes]');
      box.textContent = '';
      d.modes.forEach(function (m) {
        var row = document.createElement('div');
        row.className = 'fiche__mode';
        var tag = document.createElement('p');
        tag.className = 'tag tag--' + m.key;
        var mark = document.createElement('span');
        mark.className = 'mode-mark mode-mark--' + m.key;
        mark.setAttribute('aria-hidden', 'true');
        tag.appendChild(mark);
        tag.appendChild(document.createTextNode(m.short));
        var txt = document.createElement('p');
        txt.textContent = m.text;
        row.appendChild(tag);
        row.appendChild(txt);
        box.appendChild(row);
      });
    };

    // Hauteur de la fiche figée sur la plus grande de toutes : la page ne saute plus d'une étape à l'autre
    var fBody = fiche.querySelector('.fiche__body');
    var lockHeight = function () {
      fBody.removeAttribute('aria-live'); // pas d'annonce pendant la mesure
      fBody.style.minHeight = '';
      var max = 0;
      for (var j = 0; j < data.length; j++) {
        fillBody(j);
        max = Math.max(max, fBody.offsetHeight);
      }
      fillBody(selected);
      fBody.style.minHeight = max + 'px';
      fBody.setAttribute('aria-live', 'polite');
    };
    var lockTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(lockTimer);
      lockTimer = setTimeout(lockHeight, 150);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockHeight);

    // Jour ou nuit : fondu entre la photo de jour et la visualisation de nuit (quand elle existe)
    var applyTime = function (i) {
      var d = data[i];
      var has = !!d.night;
      var on = nightOn && has && i === selected;
      fiche.classList.toggle('has-night', has);
      fiche.classList.toggle('is-night', on);
      fTime.hidden = !has || i !== selected;
      fTime.setAttribute('aria-pressed', on ? 'true' : 'false');
      fTimeLabel.textContent = on ? 'Voir de jour' : 'Voir de nuit';
      fCredit.textContent = on ? payload.credits.night : payload.credits.day;
      if (has && i === selected) { // la vue de nuit ne se charge que pour l'étape choisie
        if (fNight.getAttribute('src') !== d.night) fNight.src = d.night;
      } else {
        fNight.removeAttribute('src');
      }
      fImg.alt = (on ? 'Visualisation de nuit : ' : 'Photographie de jour : ') + d.name;
    };

    fTime.addEventListener('click', function () {
      nightOn = !nightOn;
      if (!reduceMotion) {
        fiche.classList.remove('is-turning');
        fiche.classList.toggle('is-to-night', nightOn);
        void fiche.offsetWidth; // relance l'animation du crépuscule
        fiche.classList.add('is-turning');
        clearTimeout(fTime._t);
        fTime._t = setTimeout(function () { fiche.classList.remove('is-turning'); }, 1400);
      }
      applyTime(selected);
    });

    // Affichage de la fiche d'un bâtiment : photo, auteur, année, mode de mise en lumière
    var shown = 0;
    var render = function (i) {
      var d = data[i];
      shown = i;
      fiche.classList.add('is-loading');
      fImg.onload = function () { fiche.classList.remove('is-loading'); };
      fImg.src = d.photo;
      fImg.width = d.w;
      fImg.height = d.h;
      if (fImg.complete) fiche.classList.remove('is-loading');
      // pas de fondu quand on change de bâtiment : l'état jour / nuit s'applique tout de suite
      fiche.classList.add('is-switching');
      applyTime(i);
      requestAnimationFrame(function () { requestAnimationFrame(function () { fiche.classList.remove('is-switching'); }); });
      fillBody(i);
    };

    // Étape choisie (clic, Entrée, précédent / suivant) : repère et bâtiment restent mis en avant
    var select = function (i) {
      nightOn = false; // chaque fiche s'ouvre de jour : la nuit ne se lance qu'au clic sur le bouton
      stops[selected].classList.remove('is-selected');
      (bldgs[stops[selected].dataset.id] || []).forEach(function (b) { b.classList.remove('is-selected'); });
      selected = i;
      stops[i].classList.add('is-selected');
      (bldgs[stops[i].dataset.id] || []).forEach(function (b) { b.classList.add('is-selected'); });
      render(i);
    };

    // Aperçu au survol d'un numéro : la fiche montre ce bâtiment, puis revient à l'étape choisie
    var restoreTimer = null;
    var preloaded = false;
    var preload = function () {
      if (preloaded) return;
      preloaded = true;
      data.forEach(function (d) { var im = new Image(); im.src = d.photo; }); // photos en cache : l'aperçu est instantané
    };
    var preview = function (i) {
      preload();
      clearTimeout(restoreTimer);
      if (shown !== i) render(i);
    };
    var restore = function () {
      clearTimeout(restoreTimer);
      // petit délai : en passant d'un numéro à l'autre, la fiche ne repasse pas par l'étape choisie
      restoreTimer = setTimeout(function () { if (shown !== selected) render(selected); }, 160);
    };
    parcours.addEventListener('pointerenter', preload, { once: true });

    // Choix de la personne : met l'animation en pause et ouvre la fiche
    var pick = function (i) {
      pauseAnim();
      select(i);
      seek(i);
    };

    // Précédent / suivant, en sautant les étapes masquées par le filtre
    var step = function (dir) {
      var n = stops.length, i = selected;
      for (var k = 0; k < n; k++) {
        i = (i + dir + n) % n;
        if (!stops[i].classList.contains('is-dim')) { pick(i); return; }
      }
    };
    fiche.querySelector('[data-fiche-prev]').addEventListener('click', function () { step(-1); });
    fiche.querySelector('[data-fiche-next]').addEventListener('click', function () { step(1); });

    var light = function (i) {
      stops[i].classList.add('is-lit');
      extras(i).forEach(function (el) { el.classList.add('is-lit'); });
      if (stops[current]) stops[current].classList.remove('is-current');
      stops[i].classList.add('is-current');
      current = i;
      show(i);
    };

    var activate = function (i, on) {
      stops[i].classList.toggle('is-active', on);
      (bldgs[stops[i].dataset.id] || []).forEach(function (b) { b.classList.toggle('is-active', on); });
      show(on ? i : current);
      if (on) preview(i); else restore();
    };

    stops.forEach(function (stop, i) {
      stop.addEventListener('mouseenter', function () { activate(i, true); });
      stop.addEventListener('mouseleave', function () { activate(i, false); });
      stop.addEventListener('focus', function () { activate(i, true); });
      stop.addEventListener('blur', function () { activate(i, false); });
      stop.addEventListener('click', function () {
        pick(i);
        // petit écran : la fiche est sous la carte, on l'amène à l'écran
        if (window.matchMedia('(max-width: 1023px)').matches) {
          fiche.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
      stop.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pick(i);
        }
      });
    });
    select(0);
    lockHeight();

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.dataset.filter;
        filters.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        plan.classList.toggle('is-filtered', f !== 'all');
        stops.forEach(function (stop, i) {
          var match = f === 'all' || data[i].modes.some(function (m) { return m.key === f; });
          stop.classList.toggle('is-dim', !match);
        });
      });
    });

    if (reduceMotion || !('IntersectionObserver' in window)) {
      // Plan affiché d'un coup, sans animation
      Object.keys(bldgs).forEach(function (id) { bldgs[id].forEach(function (b) { b.classList.add('is-lit'); }); });
      stops.forEach(function (s) { s.classList.add('is-lit'); });
    } else {
      // Le chemin avance à vitesse de marche constante et marque une pause à chaque étape
      var TRAVEL = 12000; // durée du trajet complet, en ms
      var DWELL = 260; // pause à chaque étape, en ms
      var p = 0, k = 0, wait = 0, last = 0, playing = false, frameId = null;

      var setState = function (state) {
        ctrl.dataset.state = state;
        ctrlLabel.textContent = state === 'playing' ? 'Mettre en pause' : state === 'paused' ? 'Reprendre' : 'Rejouer le parcours';
      };

      var draw = function () { plan.style.setProperty('--dash', (1 - p).toFixed(4)); };

      var tick = function (t) {
        var dt = Math.min(t - (last || t), 50);
        last = t;
        if (wait > 0) {
          wait -= dt;
        } else {
          var target = k < ats.length ? ats[k] : 1;
          p = Math.min(target, p + dt / TRAVEL);
          if (p >= target && k < ats.length) {
            light(k);
            k++;
            wait = DWELL;
          }
        }
        draw();
        if (k >= ats.length && p >= 1) {
          playing = false;
          setState('done');
          return;
        }
        if (playing) frameId = requestAnimationFrame(tick);
      };

      var play = function () {
        playing = true;
        last = 0;
        setState('playing');
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(tick);
      };

      var reset = function () {
        p = 0; k = 0; wait = 0;
        stops.forEach(function (s, i) {
          s.classList.remove('is-lit', 'is-current');
          extras(i).forEach(function (el) { el.classList.remove('is-lit'); });
        });
        draw();
      };

      plan.classList.add('is-animated');
      draw();
      ctrl.hidden = false;
      setState('paused');
      ctrlLabel.textContent = 'Lancer le parcours';

      // Le chemin avance ou recule jusqu'à l'étape choisie, en allumant ou éteignant les étapes au passage
      var seekId = null;
      var sync = function () {
        var top = -1;
        stops.forEach(function (st, j) {
          var on = ats[j] <= p + 0.0005;
          if (on !== st.classList.contains('is-lit')) {
            st.classList.toggle('is-lit', on);
            extras(j).forEach(function (el) { el.classList.toggle('is-lit', on); });
          }
          if (on) top = j;
        });
        if (top !== current) {
          if (stops[current]) stops[current].classList.remove('is-current');
          if (stops[top]) stops[top].classList.add('is-current');
          current = top;
        }
      };
      seek = function (i) {
        cancelAnimationFrame(seekId);
        var from = p, to = ats[i];
        var dur = Math.min(1600, Math.max(500, Math.abs(to - from) * TRAVEL * 0.45));
        var t0 = null;
        k = i + 1; wait = 0;
        setState('paused');
        var move = function (t) {
          if (t0 === null) t0 = t;
          var u = Math.min(1, (t - t0) / dur);
          p = from + (to - from) * (u * u * (3 - 2 * u));
          draw();
          sync();
          if (u < 1) {
            seekId = requestAnimationFrame(move);
          } else {
            p = to;
            draw();
            sync();
            show(i);
          }
        };
        seekId = requestAnimationFrame(move);
      };

      pauseAnim = function () {
        cancelAnimationFrame(seekId);
        if (ctrl.dataset.state === 'playing') {
          playing = false;
          cancelAnimationFrame(frameId);
          setState('paused');
        }
      };

      ctrl.addEventListener('click', function () {
        if (ctrl.dataset.state === 'playing') {
          playing = false;
          cancelAnimationFrame(frameId);
          setState('paused');
        } else {
          cancelAnimationFrame(seekId);
          if (ctrl.dataset.state === 'done') reset();
          play();
        }
      });

      var planIO = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          planIO.disconnect();
          if (k === 0 && p === 0 && ctrl.dataset.state !== 'playing') play();
        }
      }, { threshold: 0.35 });
      planIO.observe(plan);
    }
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
    header.toggleAttribute('data-scrolled', window.scrollY >= 4);
    if (header.getAttribute('data-theme') !== theme) header.setAttribute('data-theme', theme);
  };

  /* ---------- Lampe torche : la visualisation n'apparaît que dans le cercle de lumière ---------- */
  var torch = document.querySelector('[data-torch]');
  if (torch) {
    var hint = torch.querySelector('[data-torch-hint]');
    var touchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (touchDevice && hint) hint.textContent = 'Glissez le doigt sur la façade';
    var tx = 0.62, ty = 0.5; // position de la torche, en part de la largeur et de la hauteur
    var driven = false;      // vrai quand la personne la déplace elle-même
    var lastMove = 0;
    var inView = false;
    var place = function () {
      var w = torch.clientWidth, h = torch.clientHeight;
      torch.style.setProperty('--x', (tx * w).toFixed(1) + 'px');
      torch.style.setProperty('--y', (ty * h).toFixed(1) + 'px');
      torch.style.setProperty('--r', (Math.max(110, w * 0.2)).toFixed(1) + 'px');
    };
    var moveTo = function (e) {
      var b = torch.getBoundingClientRect();
      tx = clamp((e.clientX - b.left) / b.width, 0, 1);
      ty = clamp((e.clientY - b.top) / b.height, 0, 1);
      driven = true;
      lastMove = performance.now();
      torch.classList.add('is-used');
      place();
    };
    torch.addEventListener('pointermove', moveTo);
    torch.addEventListener('pointerdown', moveTo);
    place();
    window.addEventListener('resize', place);
    // sans action de la personne, la torche se promène doucement sur la façade
    if (!reduceMotion && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; }, { threshold: 0.2 }).observe(torch);
      var wander = function (t) {
        if (inView && (!driven || t - lastMove > 2500)) {
          driven = false;
          tx = 0.5 + 0.34 * Math.sin(t / 2300);
          ty = 0.48 + 0.2 * Math.sin(t / 1700 + 1.2);
          place();
        }
        requestAnimationFrame(wander);
      };
      requestAnimationFrame(wander);
    }
  }

  /* ---------- Fil d'Ariane lumineux : la ligne descend, les points s'allument bloc après bloc ---------- */
  var rail = document.querySelector('[data-rail]');
  var updateRail = function () {};
  if (rail) {
    var railLinks = Array.prototype.slice.call(rail.querySelectorAll('.rail__dot'));
    var railTargets = railLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var railLast = -1;
    var flashTimer = null;
    updateRail = function () {
      var n = railTargets.length;
      var anchor = window.innerHeight * 0.4; // repère de lecture : 40 % de la hauteur de la fenêtre
      var tops = railTargets.map(function (t) { return t.getBoundingClientRect().top - anchor; });
      var idx = 0;
      for (var i = 0; i < n; i++) if (tops[i] <= 0) idx = i;
      var frac = 0;
      if (idx < n - 1) frac = clamp(-tops[idx] / (tops[idx + 1] - tops[idx]), 0, 1);
      // premier tronçon : la ligne part de zéro tout en haut de la page
      if (idx === 0 && n > 1) frac = clamp(window.scrollY / (tops[1] + window.scrollY), 0, 1);
      // tout en bas de la page, le dernier bloc compte comme atteint
      var doc = document.documentElement;
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 4) { idx = n - 1; frac = 0; }
      rail.style.setProperty('--rail-p', ((idx + frac) / (n - 1)).toFixed(4));
      railLinks.forEach(function (a, i) {
        a.classList.toggle('is-lit', i <= idx);
        a.classList.toggle('is-active', i === idx);
        if (i === idx) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      if (idx !== railLast) {
        if (railLast !== -1) {
          railLinks[idx].classList.add('is-flash');
          clearTimeout(flashTimer);
          flashTimer = setTimeout(function () { railLinks.forEach(function (a) { a.classList.remove('is-flash'); }); }, 1800);
        }
        railLast = idx;
      }
    };
  }

  /* ---------- Boucle ---------- */
  var ticking = false;
  var frame = function () {
    ticking = false;
    updateDusk();
    updateHeader();
    updateRail();
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
