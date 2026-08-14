(function () {
  'use strict';

  var LS_KEY = 'fraittech_cookie_consent_v1';
  var COOKIE_NAME = 'fraittech_cookie_consent';
  var DAYS = 180;

  function getConsent() {
    try {
      var v = localStorage.getItem(LS_KEY);
      if (v === 'all' || v === 'essential') return v;
    } catch (e) { /* ignore */ }
    var m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  function setConsent(value) {
    try {
      localStorage.setItem(LS_KEY, value);
    } catch (e) { /* ignore */ }
    var maxAge = DAYS * 24 * 60 * 60;
    document.cookie = COOKIE_NAME + '=' + encodeURIComponent(value) + ';path=/;max-age=' + maxAge + ';SameSite=Lax';
  }

  function removeTawk() {
    var w = window;
    if (w.Tawk_API && typeof w.Tawk_API.shutdown === 'function') {
      try { w.Tawk_API.shutdown(); } catch (e) { /* ignore */ }
    }
    document.querySelectorAll('script[src*="embed.tawk.to"]').forEach(function (s) {
      s.parentNode && s.parentNode.removeChild(s);
    });
  }

  function loadTawk() {
    /* Set window.FRAITTECH_TAWK_EMBED_PATH = 'PROPERTY_ID/WIDGET_ID' from your Tawk admin embed code */
    var path = window.FRAITTECH_TAWK_EMBED_PATH;
    if (!path || String(path).indexOf('REPLACE') === 0) return;
    path = String(path).replace(/^\/+/, '');
    if (document.querySelector('script[src*="embed.tawk.to"]')) return;
    var s1 = document.createElement('script');
    var s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/' + path;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
  }

  function applyConsent(value) {
    setConsent(value);
    if (value === 'all') loadTawk();
    else removeTawk();
    var b = document.getElementById('ftCookieBanner');
    if (b) b.remove();
  }

  function openPrefsModal() {
    var el = document.getElementById('ftCookiePrefsModal');
    if (!el || typeof bootstrap === 'undefined' || !bootstrap.Modal) return;
    bootstrap.Modal.getOrCreateInstance(el).show();
  }

  function ensurePrefsModal() {
    if (document.getElementById('ftCookiePrefsModal')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="modal fade" id="ftCookiePrefsModal" tabindex="-1" aria-hidden="true">' +
      '  <div class="modal-dialog modal-dialog-centered">' +
      '    <div class="modal-content">' +
      '      <div class="modal-header"><h5 class="modal-title">Cookie preferences</h5>' +
      '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>' +
      '      <div class="modal-body">' +
      '        <p class="small text-muted">Essential cookies keep the site and cart working. Optional cookies load live chat when you allow them.</p>' +
      '      </div>' +
      '      <div class="modal-footer flex-wrap gap-2">' +
      '        <button type="button" class="btn btn-outline-secondary" data-ft-consent="essential">Essential only</button>' +
      '        <button type="button" class="btn btn-primary" data-ft-consent="all">Accept all</button>' +
      '      </div>' +
      '    </div></div></div>';
    document.body.appendChild(wrap.firstElementChild);
    document.getElementById('ftCookiePrefsModal').addEventListener('click', function (e) {
      var t = e.target && e.target.getAttribute && e.target.getAttribute('data-ft-consent');
      if (!t) return;
      applyConsent(t);
      bootstrap.Modal.getInstance(document.getElementById('ftCookiePrefsModal')).hide();
    });
  }

  function showBanner() {
    if (document.getElementById('ftCookieBanner')) return;
    var bar = document.createElement('div');
    bar.id = 'ftCookieBanner';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookies');
    bar.className = 'position-fixed bottom-0 start-0 end-0 p-3';
    bar.style.zIndex = '10800';
    bar.innerHTML =
      '<div class="container-xxl">' +
      '  <div class="bg-dark text-white rounded-3 shadow p-3 p-md-4 d-flex flex-column flex-lg-row align-items-lg-center gap-3 justify-content-between">' +
      '    <p class="mb-0 small">We use cookies and local storage for the cart and your choices. Optional chat loads only if you accept all.</p>' +
      '    <div class="d-flex flex-wrap gap-2">' +
      '      <button type="button" class="btn btn-sm btn-outline-light" data-ft-consent="essential">Essential only</button>' +
      '      <button type="button" class="btn btn-sm btn-primary" data-ft-consent="all">Accept all</button>' +
      '    </div></div></div>';
    document.body.appendChild(bar);
    bar.addEventListener('click', function (e) {
      var t = e.target && e.target.getAttribute && e.target.getAttribute('data-ft-consent');
      if (!t) return;
      applyConsent(t);
    });
  }

  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest && e.target.closest('[data-ft-cookie-prefs]');
    if (!el) return;
    e.preventDefault();
    ensurePrefsModal();
    openPrefsModal();
  });

  var existing = getConsent();
  if (existing === 'all') {
    loadTawk();
  } else if (existing === 'essential') {
    removeTawk();
  } else {
    showBanner();
  }
})();
