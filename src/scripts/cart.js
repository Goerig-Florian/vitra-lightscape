/*
 * Vitra Lightscape — billetterie et panier
 * Le panier est conservé dans le navigateur (localStorage). Aucun paiement
 * n'est branché : la page panier affiche un message de démonstration.
 */
(function () {
  var raw = document.body.getAttribute('data-booking');
  if (!raw) return;
  var DATA = JSON.parse(raw);
  var IC = {};
  try { IC = (JSON.parse(document.body.getAttribute('data-i18n') || '{}')).cart || {}; } catch (e) { IC = {}; }
  var IF = {};
  try { IF = (JSON.parse(document.body.getAttribute('data-i18n') || '{}')).form || {}; } catch (e) { IF = {}; }
  var fill = function (s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v[k] === undefined ? '' : v[k]; }); };
  var KEY = 'vitra-lightscape-cart-v2';
  
  var tickets = {};
  DATA.tickets.forEach(function (t) { tickets[t.id] = t; });
  var dateLabel = {};
  var dateWeekend = {};
  DATA.dates.forEach(function (d) { dateLabel[d.id] = d.label; dateWeekend[d.id] = d.we; });
  /* prix d'un billet pour une soirée donnée : tarif semaine (lun-jeu) ou week-end (ven-dim) */
  var priceOf = function (t, date) { return date && dateWeekend[date] ? t.prices.we : t.prices.sem; };

  var euro = function (n) { return n === 0 ? '0 €' : n.toLocaleString(DATA.locale || 'fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €'; };

  /* ---------- Stockage ---------- */
  var memory = [];
  var load = function () {
    try {
      var v = JSON.parse(window.localStorage.getItem(KEY) || '[]');
      return Array.isArray(v) ? v.filter(function (i) { return tickets[i.type] && dateLabel[i.date] && i.qty > 0; }) : [];
    } catch (e) {
      return memory;
    }
  };
  var save = function (items) {
    memory = items;
    try { window.localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* navigation privée */ }
    renderCart();
  };
  var cart = function () { return load(); };

  var keyOf = function (i) { return i.date + '|' + i.slot + '|' + i.type; };

  var addItems = function (items) {
    var current = cart();
    items.forEach(function (it) {
      var found = current.find(function (c) { return keyOf(c) === keyOf(it); });
      if (found) found.qty = Math.min(DATA.max, found.qty + it.qty);
      else current.push({ date: it.date, slot: it.slot, type: it.type, qty: Math.min(DATA.max, it.qty) });
    });
    save(current);
  };

  var setQty = function (key, qty) {
    var current = cart()
      .map(function (c) { if (keyOf(c) === key) c.qty = clampQty(qty); return c; })
      .filter(function (c) { return c.qty > 0; });
    save(current);
  };

  var clampQty = function (q) { return Math.max(0, Math.min(DATA.max, q)); };

  var total = function (items) {
    return items.reduce(function (s, i) { return s + priceOf(tickets[i.type], i.date) * i.qty; }, 0);
  };

  var count = function (items) {
    return items.reduce(function (s, i) { return s + i.qty; }, 0);
  };

  /* ---------- Rendu du panier ---------- */
  // flèche dessinée en SVG : la police n'a pas de glyphe « → »
  var ARROW = '<svg class="arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>';

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var renderCart = function () {
    var items = cart();
    var groups = {};
    var order = [];
    items
      .slice()
      .sort(function (a, b) { return (a.date + a.slot).localeCompare(b.date + b.slot); })
      .forEach(function (i) {
        var g = i.date + '|' + i.slot;
        if (!groups[g]) { groups[g] = []; order.push(g); }
        groups[g].push(i);
      });

    var html = '';
    if (!items.length) {
      html = '<div class="cart-empty"><p>' + esc(IC.empty || 'Votre panier est vide.') + '</p><a href="' + esc(DATA.cartUrl.replace(/panier\/$/, '')) + '#billetterie">' + esc(IC.choose || 'Choisir une soirée') + ' ' + ARROW + '</a></div>';
    } else {
      order.forEach(function (g) {
        var parts = g.split('|');
        html += '<div class="cart-group"><p class="cart-group__title">' + esc(dateLabel[parts[0]]) + '</p>';
        html += '<p class="cart-group__slot">' + esc(fill(IC.entryAt || 'Entrée à {slot} · Vitra Campus, Weil am Rhein', { slot: parts[1] })) + '</p>';
        groups[g]
          .sort(function (a, b) { return DATA.tickets.indexOf(tickets[a.type]) - DATA.tickets.indexOf(tickets[b.type]); })
          .forEach(function (i) {
            var t = tickets[i.type];
            var k = esc(keyOf(i));
            html +=
              '<div class="cart-line">' +
              '<span class="cart-line__label">' + esc(t.label) + '<small>' + esc(t.detail) + ' · ' + euro(priceOf(t, i.date)) + '</small></span>' +
              '<div class="stepper" role="group" aria-label="' + esc(fill(IC.qty || 'Quantité, {label}', { label: t.label })) + '">' +
              '<button type="button" class="stepper__btn" data-cart-step="-1" data-key="' + k + '" aria-label="' + esc(fill(IC.remove1 || 'Retirer un billet {label}', { label: t.label })) + '">−</button>' +
              '<output class="stepper__value" aria-live="polite">' + i.qty + '</output>' +
              '<button type="button" class="stepper__btn" data-cart-step="1" data-key="' + k + '" aria-label="' + esc(fill(IC.add1 || 'Ajouter un billet {label}', { label: t.label })) + '"' + (i.qty >= DATA.max ? ' disabled' : '') + '>+</button>' +
              '</div>' +
              '<button type="button" class="cart-line__remove" data-cart-remove data-key="' + k + '">' + esc(IC.remove || 'Retirer') + '<span class="sr-only"> ' + esc(t.label) + '</span></button>' +
              '<span class="cart-line__price">' + euro(priceOf(t, i.date) * i.qty) + '</span>' +
              '</div>';
          });
        html += '</div>';
      });
    }

    document.querySelectorAll('[data-cart-list]').forEach(function (el) { el.innerHTML = html; });
    document.querySelectorAll('[data-cart-total]').forEach(function (el) { el.textContent = euro(total(items)); });
    var n = count(items);
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = String(n);
      el.hidden = n === 0;
    });
    document.querySelectorAll('[data-cart-label]').forEach(function (el) {
      el.textContent = n ? fill(n > 1 ? (IC.labelNs || 'Panier, {n} billets') : (IC.labelN || 'Panier, {n} billet'), { n: n }) : (IC.labelEmpty || 'Panier, vide');
    });
    document.querySelectorAll('[data-cart-checkout], [data-pay], [data-cart-clear]').forEach(function (el) {
      if (el.tagName === 'A') el.toggleAttribute('aria-disabled', !items.length);
      else el.disabled = !items.length;
    });
  };

  document.addEventListener('click', function (e) {
    var step = e.target.closest('[data-cart-step]');
    if (step) {
      var key = step.getAttribute('data-key');
      var item = cart().find(function (c) { return keyOf(c) === key; });
      if (item) setQty(key, item.qty + Number(step.getAttribute('data-cart-step')));
      return;
    }
    var rm = e.target.closest('[data-cart-remove]');
    if (rm) {
      setQty(rm.getAttribute('data-key'), 0);
      toast(IC.removed || 'Billet retiré du panier.');
    }
  });

  window.addEventListener('storage', function (e) { if (e.key === KEY) renderCart(); });

  /* ---------- Tiroir ---------- */
  var drawer = document.querySelector('[data-drawer]');
  var panel = drawer && drawer.querySelector('[data-drawer-panel]');
  var lastFocus = null;

  var openDrawer = function () {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      drawer.classList.add('is-open');
      panel.focus();
    });
  };

  var closeDrawer = function () {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
    var done = function () { drawer.hidden = true; };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) done();
    else setTimeout(done, 350);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-open]')) {
      e.preventDefault();
      openDrawer();
    } else if (e.target.closest('[data-cart-close]')) {
      closeDrawer();
    } else if (e.target.closest('[data-cart-checkout][aria-disabled]')) {
      e.preventDefault();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!drawer || drawer.hidden) return;
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Tab') {
      var f = panel.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------- Message ---------- */
  var toastEl = document.querySelector('[data-toast]');
  var toastTimer;
  var toast = function (msg, withAction) {
    if (!toastEl) return;
    toastEl.innerHTML = '<span>' + esc(msg) + '</span>' + (withAction ? '<button type="button" data-cart-open>' + esc(IC.see || 'Voir le panier') + '</button>' : '');
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 5000);
  };

  /* ---------- Formulaire de réservation ---------- */
  var form = document.querySelector('[data-booking-form]');
  if (form) {
    var qty = {};
    DATA.tickets.forEach(function (t) { qty[t.id] = 0; });
    var sumDate = form.querySelector('[data-sum-date]');
    var sumSlot = form.querySelector('[data-sum-slot]');
    var sumLines = form.querySelector('[data-sum-lines]');
    var sumTotal = form.querySelector('[data-sum-total]');
    var addBtn = form.querySelector('[data-add]');
    var hint = form.querySelector('[data-sum-hint]');

    var people = function () {
      return Object.keys(qty).reduce(function (s, k) { return s + qty[k] * (tickets[k].persons || 1); }, 0);
    };
    var adults = function () { return Object.keys(qty).reduce(function (s, k) { return s + (tickets[k].adult ? qty[k] : 0); }, 0); };

    var update = function () {
      var date = (form.querySelector('input[name="date"]:checked') || {}).value;
      var slot = (form.querySelector('input[name="slot"]:checked') || {}).value;
      sumDate.textContent = date ? dateLabel[date] + (dateWeekend[date] ? (IF.wkTag || ' · tarif week-end') : (IF.semTag || ' · tarif semaine')) : (IF.toChoose || 'À choisir');
      sumSlot.textContent = slot || (IF.toChoose || 'À choisir');

      var lines = '';
      var sum = 0;
      DATA.tickets.forEach(function (t) {
        form.querySelector('[data-qty="' + t.id + '"]').textContent = String(qty[t.id]);
        var minus = form.querySelector('[data-ticket="' + t.id + '"][data-step="-1"]');
        var plus = form.querySelector('[data-ticket="' + t.id + '"][data-step="1"]');
        minus.disabled = qty[t.id] === 0;
        plus.disabled = qty[t.id] >= DATA.max;
        if (qty[t.id] > 0) {
          var pu = priceOf(t, date);
          lines += '<li><span>' + esc(t.label) + ' × ' + qty[t.id] + '</span><span>' + euro(pu * qty[t.id]) + '</span></li>';
          sum += pu * qty[t.id];
        }
      });
      sumLines.innerHTML = lines;
      sumTotal.textContent = euro(sum);

      var msg = '';
      if (!date || !slot || people() === 0) msg = IF.hint || 'Choisissez une soirée, un horaire et au moins un billet.';
      else if (adults() === 0) msg = IF.hintAdult || 'Les enfants doivent être accompagnés d’un adulte : ajoutez un billet plein tarif ou réduit.';
      addBtn.disabled = msg !== '';
      hint.textContent = msg;
    };

    form.addEventListener('change', update);
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-step][data-ticket]');
      if (!b) return;
      var id = b.getAttribute('data-ticket');
      qty[id] = clampQty(qty[id] + Number(b.getAttribute('data-step')));
      update();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (addBtn.disabled) return;
      var date = form.querySelector('input[name="date"]:checked').value;
      var slot = form.querySelector('input[name="slot"]:checked').value;
      var items = [];
      Object.keys(qty).forEach(function (k) { if (qty[k] > 0) items.push({ date: date, slot: slot, type: k, qty: qty[k] }); });
      addItems(items);
      Object.keys(qty).forEach(function (k) { qty[k] = 0; });
      update();
      toast(IC.added || 'Ajouté au panier.', true);
    });

    update();
  }

  /* ---------- Page panier ---------- */
  var pay = document.querySelector('[data-pay]');
  var payNote = document.querySelector('[data-pay-note]');
  if (pay && payNote) {
    pay.addEventListener('click', function () {
      payNote.hidden = false;
      payNote.focus();
    });
  }
  var clear = document.querySelector('[data-cart-clear]');
  if (clear) {
    clear.addEventListener('click', function () {
      save([]);
      if (payNote) payNote.hidden = true;
      toast(IC.cleared || 'Panier vidé.');
    });
  }

  renderCart();
})();
