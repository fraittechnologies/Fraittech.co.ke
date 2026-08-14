(function () {
  'use strict';

  var mount = document.getElementById('ftPortfolioGalleriesMount');
  if (!mount) return;

  /* Curated galleries: swap images or add entries as you ship new work */
  var GALLERIES = [
    {
      title: 'Web & brand',
      blurb: 'Responsive sites and campaign landing experiences.',
      images: [
        { src: 'img/it-2.webp', alt: 'Web project showcase' },
        { src: 'img/digital solutions.webp', alt: 'Digital solutions' },
        { src: 'img/graphoc-design-4.webp', alt: 'Graphic and web design' }
      ]
    },
    {
      title: 'Creative & campaigns',
      blurb: 'Visual systems, social assets, and launch kits.',
      images: [
        { src: 'img/hero-slide-1.webp', alt: 'Campaign creative' },
        { src: 'img/graphoc-design-4.webp', alt: 'Brand creative' }
      ]
    }
  ];

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function buildGallery(g, gi) {
    var gid = 'ft-portfolio-gallery-' + gi;
    var main = g.images[0];
    var thumbs = g.images
      .map(function (im, i) {
        var active = i === 0 ? ' active' : '';
        return (
          '<button type="button" class="ft-portfolio-thumb btn btn-link p-1 border rounded-2' + active + '" data-g="' +
          gi +
          '" data-i="' +
          i +
          '" aria-label="Show image ' +
          (i + 1) +
          '">' +
          '<img src="' +
          esc(im.src) +
          '" alt="" class="rounded-2" width="120" height="80" loading="lazy" style="object-fit:cover;width:120px;height:80px">' +
          '</button>'
        );
      })
      .join('');

    return (
      '<section class="ft-portfolio-gallery mb-5 pb-lg-4" aria-labelledby="' +
      gid +
      '-title">' +
      '  <div class="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-2 mb-3">' +
      '    <div><h2 class="h4 mb-1" id="' +
      gid +
      '-title">' +
      esc(g.title) +
      '</h2>' +
      '    <p class="text-muted small mb-0">' +
      esc(g.blurb) +
      '</p></div></div>' +
      '  <div class="row g-3 g-lg-4 align-items-start">' +
      '    <div class="col-lg-8">' +
      '      <a href="' +
      esc(main.src) +
      '" data-lightbox="' +
      esc(gid) +
      '" data-title="' +
      esc(main.alt) +
      '" class="d-block rounded-3 overflow-hidden border ft-portfolio-main-link" data-g="' +
      gi +
      '">' +
      '        <img src="' +
      esc(main.src) +
      '" alt="' +
      esc(main.alt) +
      '" class="w-100 ft-portfolio-main-img" style="max-height:420px;object-fit:cover" loading="lazy" data-g="' +
      gi +
      '" data-role="main">' +
      '      </a>' +
      '      <div class="d-flex flex-wrap gap-2 mt-3" role="toolbar" aria-label="Gallery thumbnails">' +
      thumbs +
      '      </div>' +
      '    </div>' +
      '    <div class="col-lg-4 small text-muted">' +
      '      <p class="mb-0">Tip: click the large image for a full-screen lightbox view. Use thumbnails to switch the hero image.</p>' +
      '    </div>' +
      '  </div>' +
      '</section>'
    );
  }

  mount.innerHTML = GALLERIES.map(buildGallery).join('');

  mount.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.ft-portfolio-thumb');
    if (!btn) return;
    var g = parseInt(btn.getAttribute('data-g'), 10);
    var i = parseInt(btn.getAttribute('data-i'), 10);
    var gal = GALLERIES[g];
    if (!gal || !gal.images[i]) return;
    var wrap = mount.querySelector('.ft-portfolio-gallery:nth-of-type(' + (g + 1) + ')');
    if (!wrap) return;
    var mainImg = wrap.querySelector('img[data-role="main"]');
    var mainLink = wrap.querySelector('a.ft-portfolio-main-link');
    var im = gal.images[i];
    if (mainImg) {
      mainImg.src = im.src;
      mainImg.alt = im.alt;
    }
    if (mainLink) {
      mainLink.href = im.src;
      mainLink.setAttribute('data-title', im.alt);
    }
    wrap.querySelectorAll('.ft-portfolio-thumb').forEach(function (b) {
      b.classList.toggle('active', b === btn);
    });
  });
})();
