/*
 * Vitra Lightscape — interactions
 * Script classique (sans import) : fonctionne aussi en ouvrant la page localement.
 * Tout le contenu reste lisible sans JavaScript.
 */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* ---------- Apparitions au défilement ---------- */
  var revealables = document.querySelectorAll('.reveal, .reveal-mask');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    // Un élément masqué par clip-path n'est pas « visible » pour l'observateur :
    // pour les masques, on observe donc leur conteneur.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target.__revealTarget || entry.target;
          el.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealables.forEach(function (el) {
      var watched = el.classList.contains('reveal-mask') ? el.parentElement : el;
      watched.__revealTarget = el;
      io.observe(watched);
    });
  }

  /* ---------- Léger mouvement d'image (grands écrans uniquement) ---------- */
  var parallaxItems = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var wide = window.matchMedia('(min-width: 1024px)');
  if (!reduceMotion && parallaxItems.length) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var vh = window.innerHeight;
      parallaxItems.forEach(function (el) {
        var img = el.querySelector('img');
        if (!img) return;
        if (!wide.matches) { img.style.transform = ''; return; }
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1 environ
        img.style.transform = 'translate3d(0,' + (p * -28).toFixed(1) + 'px,0) scale(1.08)';
      });
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- Aperçu : jour → ombre → ligne ---------- */
  var stage = document.querySelector('[data-apercu-stage]');
  var buttons = document.querySelectorAll('[data-step-target]');
  if (stage && buttons.length) {
    var timers = [];
    var clearTimers = function () { timers.forEach(clearTimeout); timers = []; };
    var setStep = function (n) {
      stage.setAttribute('data-step', String(n));
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-step-target') === String(n) ? 'true' : 'false');
      });
    };
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        clearTimers();
        setStep(Number(b.getAttribute('data-step-target')));
      });
    });

    // Sans réduction des animations : la séquence se joue une fois à l'arrivée.
    // Avec réduction : l'état final (la ligne) est affiché directement.
    if (!reduceMotion && 'IntersectionObserver' in window) {
      setStep(1);
      var played = false;
      var seq = new IntersectionObserver(function (entries) {
        if (played || !entries[0].isIntersecting) return;
        played = true;
        seq.disconnect();
        timers.push(setTimeout(function () { setStep(2); }, 900));
        timers.push(setTimeout(function () { setStep(3); }, 2600));
      }, { threshold: 0.5 });
      seq.observe(stage);
    }
  }
})();
