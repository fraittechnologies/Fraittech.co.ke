(function () {
  'use strict';

  function hidePreloader() {
    var s = document.getElementById('spinner');
    if (!s) return;
    s.classList.remove('show');
    s.setAttribute('aria-busy', 'false');
    s.setAttribute('hidden', '');
    s.style.display = 'none';
    s.style.pointerEvents = 'none';
  }

  function toast(msg, variant, title) {
    variant = variant || 'primary';
    var c = document.getElementById('ft-toast-stack');
    if (!c) {
      c = document.createElement('div');
      c.id = 'ft-toast-stack';
      c.className = 'toast-container position-fixed top-0 end-0 p-3';
      c.style.zIndex = '10900';
      document.body.appendChild(c);
    }
    var el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'polite');
    var head =
      title
        ? '<div class="toast-header"><strong class="me-auto">' +
          String(title).replace(/</g, '&lt;') +
          '</strong><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div>'
        : '';
    el.innerHTML =
      head +
      '<div class="toast-body d-flex align-items-center">' +
      '<span class="badge bg-' +
      variant +
      ' me-2">&nbsp;</span><span>' +
      String(msg).replace(/</g, '&lt;') +
      '</span></div>';
    c.appendChild(el);
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
      var t = new bootstrap.Toast(el, { delay: 6500 });
      t.show();
      el.addEventListener('hidden.bs.toast', function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    } else {
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 6000);
    }
  }

  window.FtNotify = {
    success: function (m, t) { toast(m, 'success', t); },
    info: function (m, t) { toast(m, 'info', t); },
    warning: function (m, t) { toast(m, 'warning', t); },
    error: function (m, t) { toast(m, 'danger', t); }
  };

  function setCurrentYear() {
    var y = document.getElementById('currentYear');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function initHeroSlider() {
    var track = document.querySelector('.hero-home-slider');
    if (!track) return;
    var slides = track.querySelectorAll('.hero-slide');
    if (!slides.length) return;
    var idx = 0;
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].classList.contains('active')) idx = i;
    }
    window.changeSlide = function (dir) {
      slides[idx].classList.remove('active');
      idx = (idx + Number(dir || 0) + slides.length) % slides.length;
      slides[idx].classList.add('active');
    };
  }

  function initWow() {
    if (typeof WOW === 'undefined') return;
    new WOW().init();
  }

  function initCounters($) {
    if (!$ || typeof $.fn.counterUp !== 'function') return;
    $('[data-toggle="counter-up"]').counterUp({ delay: 10, time: 1600 });
  }

  function initTestimonialCarousel($) {
    if (!$ || typeof $.fn.owlCarousel !== 'function') return;
    var $el = $('.testimonial-carousel.ft-testimonial-carousel');
    if (!$el.length) return;
    $el.owlCarousel({
      autoplay: true,
      smartSpeed: 1000,
      margin: 24,
      dots: true,
      loop: true,
      responsive: { 0: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } }
    });
  }

  function initAjaxForms($) {
    if (!$) return;
    $(document).on('submit', 'form.ft-ajax', function (e) {
      e.preventDefault();
      var form = this;
      var action = form.getAttribute('action');
      if (!action) return;
      var btn = form.querySelector('[type="submit"]');
      var busy = form.getAttribute('data-ft-busy-label') || 'Please wait…';
      var orig = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = busy;
      }
      var fd = new FormData(form);
      fetch(action, {
        method: form.getAttribute('method') || 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
        credentials: 'same-origin'
      })
        .then(function (r) {
          return r.text().then(function (t) {
            return { ok: r.ok, text: t, status: r.status };
          });
        })
        .then(function (res) {
          var data;
          try {
            data = JSON.parse(res.text.replace(/^\uFEFF/, '').trim());
          } catch (err) {
            throw new Error(res.ok ? 'Unexpected response from server.' : 'Request failed (' + res.status + ').');
          }
          if (data.success) {
            window.FtNotify.success(data.message || 'Submitted successfully.', 'Thank you');
            form.reset();
          } else {
            throw new Error(data.message || 'Something went wrong.');
          }
        })
        .catch(function (err) {
          window.FtNotify.error(err.message || 'Something went wrong.', 'Form');
        })
        .finally(function () {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = orig;
          }
        });
    });
  }

  window.addEventListener('load', hidePreloader);
  if (document.readyState === 'complete') hidePreloader();

  var $ = window.jQuery;
  if ($) {
    $(function () {
      hidePreloader();
      setCurrentYear();
      initHeroSlider();
      initWow();
      initCounters($);
      initTestimonialCarousel($);
      initAjaxForms($);
    });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      hidePreloader();
      setCurrentYear();
      initHeroSlider();
      initWow();
    });
  }
})();
