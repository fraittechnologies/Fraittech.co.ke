(function () {
  'use strict';

  var STORAGE_KEY = 'fraittech_cart_v1';
  var CATALOG = {
    'wd-starter': { title: 'Website development — Starter', unitPrice: 25000 },
    'wd-standard': { title: 'Website development — Standard', unitPrice: 35000 },
    'wd-premium': { title: 'Website development — Premium', unitPrice: 45000 },
    'gd-starter': { title: 'Graphic design — Starter', unitPrice: 3000 },
    'gd-standard': { title: 'Graphic design — Standard', unitPrice: 12000 },
    'gd-premium': { title: 'Graphic design — Premium', unitPrice: 28000 },
    'ic-starter': { title: 'IT consulting — Starter', unitPrice: 35000 },
    'ic-standard': { title: 'IT consulting — Standard', unitPrice: 75000 },
    'is-bronze': { title: 'IT support — Bronze', unitPrice: 8000 },
    'is-silver': { title: 'IT support — Silver', unitPrice: 15000 },
    'si-starter': { title: 'System integration — Starter', unitPrice: 75000 },
    'si-standard': { title: 'System integration — Standard', unitPrice: 150000 },
    'cs-assessment': { title: 'Cloud services — Assessment', unitPrice: 45000 },
    'cs-migration': { title: 'Cloud services — Migration', unitPrice: 150000 }
  };

  function readCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { lines: [] };
      var data = JSON.parse(raw);
      if (!data || !Array.isArray(data.lines)) return { lines: [] };
      return { lines: data.lines };
    } catch (e) {
      return { lines: [] };
    }
  }

  function writeCart(lines) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines: lines }));
    try {
      window.dispatchEvent(new CustomEvent('fraittech-cart-updated'));
    } catch (e) { /* ignore */ }
  }

  function emitCart() {
    writeCart(readCart().lines);
  }

  window.FraittechCart = {
    formatMoney: function (amount) {
      var n = Math.round(Number(amount) || 0);
      return 'KES ' + n.toLocaleString('en-KE');
    },

    getLinesDetailed: function () {
      var lines = readCart().lines;
      return lines.map(function (l) {
        var meta = CATALOG[l.sku] || { title: l.sku, unitPrice: 0 };
        var qty = Math.max(1, parseInt(l.qty, 10) || 1);
        var unit = meta.unitPrice;
        var lineTotal = unit * qty;
        return {
          sku: l.sku,
          title: meta.title,
          qty: qty,
          unitPrice: unit,
          lineTotal: lineTotal,
          priceNote: unit <= 0 ? 'Price on agreement' : ''
        };
      });
    },

    getSubtotal: function () {
      return this.getLinesDetailed().reduce(function (sum, l) {
        return sum + (l.lineTotal || 0);
      }, 0);
    },

    buildOrderSummaryText: function () {
      return this.getLinesDetailed()
        .map(function (l) {
          return l.title + ' × ' + l.qty + ' @ ' + FraittechCart.formatMoney(l.unitPrice) + ' = ' + FraittechCart.formatMoney(l.lineTotal);
        })
        .join(' | ');
    },

    updateCartBadges: function () {
      var n = this.getLinesDetailed().reduce(function (sum, l) {
        return sum + (l.qty || 0);
      }, 0);
      document.querySelectorAll('[data-cart-count]').forEach(function (el) {
        el.textContent = String(n);
        if (n > 0) el.removeAttribute('hidden');
        else el.setAttribute('hidden', '');
      });
    },

    addSku: function (sku, qty) {
      sku = String(sku || '').trim();
      if (!sku || !CATALOG[sku]) return;
      qty = Math.max(1, parseInt(qty, 10) || 1);
      var cart = readCart();
      var found = cart.lines.find(function (l) { return l.sku === sku; });
      if (found) found.qty = (parseInt(found.qty, 10) || 1) + qty;
      else cart.lines.push({ sku: sku, qty: qty });
      writeCart(cart.lines);
    },

    setQty: function (sku, qty) {
      sku = String(sku || '').trim();
      var q = Math.max(1, Math.min(99, parseInt(qty, 10) || 1));
      var cart = readCart();
      var found = cart.lines.find(function (l) { return l.sku === sku; });
      if (found) found.qty = q;
      writeCart(cart.lines);
    },

    removeLine: function (sku) {
      sku = String(sku || '').trim();
      var cart = readCart();
      cart.lines = cart.lines.filter(function (l) { return l.sku !== sku; });
      writeCart(cart.lines);
    },

    clearCart: function () {
      writeCart([]);
    },

    consumeUrlAdd: function () {
      try {
        var params = new URLSearchParams(window.location.search);
        var add = params.get('add');
        if (add) {
          this.addSku(add, 1);
          params.delete('add');
          var qs = params.toString();
          var path = window.location.pathname + (qs ? '?' + qs : '');
          window.history.replaceState({}, '', path);
        }
      } catch (e) { /* ignore */ }
    }
  };

  emitCart();
})();
