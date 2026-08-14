(function () {
  if (!document.body.classList.contains('ft-home')) return;

  var nodes = document.querySelectorAll('.ft-lp-reveal');
  if (!nodes.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  if (!('IntersectionObserver' in window)) {
    nodes.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  nodes.forEach(function (el) { io.observe(el); });
})();
