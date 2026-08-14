(function () {
  'use strict';

  var mount = document.getElementById('ftPortfolioGalleriesMount');
  if (!mount) return;

  var GALLERIES = [
    {
      title: 'Websites that win the first visit',
      blurb:
        'Speed, clarity, and mobile-first layouts that turn curious browsers into enquiries. Each build is structured around your goals — bookings, calls, WhatsApp leads, or e-commerce — so your site works as hard as your team does.',
      images: [
        {
          src: 'img/Projects/website/tasksfy.webp',
          alt: 'Tasksfy — productivity platform with a clean, confident interface',
          projectUrl: 'https://tasksfy.com',
          projectCta: 'Open live site',
        },
        {
          src: 'img/Projects/website/food.webp',
          alt: 'Food Security Millers — trustworthy sourcing story for maize flour and feeds',
          projectUrl: 'https://foodsecuritymillers.com',
          projectCta: 'Open live site',
        },
        {
          src: 'img/Projects/website/Lasatarah.webp',
          alt: 'Lasatarah — export-grade herbs with premium presentation',
          projectUrl: 'https://lasatarah.co.ke',
          projectCta: 'Open live site',
        },
        {
          src: 'img/Projects/website/all.webp',
          alt: 'All Things Grand — retail lifestyle brand with an inviting storefront online',
          projectUrl: 'https://allthingsgrand.co.ke/',
          projectCta: 'Open live site',
        },
        {
          src: 'img/Projects/website/larpei.webp',
          alt: 'Larpei — legal brand with authority-led messaging and polished UX',
          projectUrl: 'https://www.larpeiandcompanyadvocates.co.ke/',
          projectCta: 'Open live site',
        },
        {
          src: 'img/Projects/website/kingdomcity church Nanyuki.webp',
          alt: 'Kingdom City Church Nanyuki — community hub for events and connection',
          projectUrl: 'https://www.kingdomcitychurchnanyuki.org/',
          projectCta: 'Open live site',
        },
      ],
    },
    {
      title: 'Design that travels across every touchpoint',
      blurb:
        'Social, print, packaging, and campaign creative that stays unmistakably yours. We design for legibility on small screens, impact on posters, and consistency wherever your customers meet you next.',
      images: [
        { src: 'img/Projects/graphics/2.webp', alt: 'Bold social creative — colour-forward layout for scroll-stopping feeds' },
        { src: 'img/Projects/graphics/mashujaa.webp', alt: 'Mashujaa Day — patriotic moment captured for national visibility' },
        { src: 'img/Projects/graphics/Sax.webp', alt: 'Sax — punchy product graphic tuned for digital promos' },
        { src: 'img/Projects/graphics/blue.webp', alt: 'Blue — crisp launch visual with product-first hierarchy' },
        { src: 'img/Projects/graphics/christmas2.webp', alt: 'Christmas campaign — festive storytelling for retail uplift' },
        { src: 'img/Projects/graphics/Christmas.webp', alt: 'Holiday creative — warm seasonal branding for engagement' },
        { src: 'img/Projects/graphics/Irie_with_barcode.webp', alt: 'Irie — shelf-ready packaging with barcode and clear hierarchy' },
        { src: 'img/Projects/graphics/larpei.webp', alt: 'Larpei — professional legal-sector marketing suite' },
        { src: 'img/Projects/graphics/MENU.webp', alt: 'Menu design — typography-led hospitality layout' },
        { src: 'img/Projects/graphics/merry.webp', alt: 'Merry — bright seasonal graphic built for shares' },
        { src: 'img/Projects/graphics/retro.webp', alt: 'Retro campaign — nostalgic visual style for standout promos' },
        { src: 'img/Projects/graphics/replay.webp', alt: 'Replay — energetic creative for high-tempo launches' },
        { src: 'img/Projects/graphics/Bee_hype.webp', alt: 'Bee Hype — vibrant youth-facing brand graphic' },
        { src: 'img/Projects/graphics/weekend.webp', alt: 'Weekend campaign — lifestyle-led call to action' },
        { src: 'img/Projects/graphics/c3dc729130c8f2a67c45dc721ea97db0.webp', alt: 'Campaign artwork — polished composition for digital channels' },
      ],
    },
  ];

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function attrUrl(path) {
    return encodeURI(String(path || '')).replace(/'/g, '%27');
  }

  function buildCarousel(g, gi) {
    var gid = 'ft-portfolio-gallery-' + gi;
    var rootId = 'ftPortfolioCarouselRoot' + gi;
    var badge = gi === 0 ? 'Shipped & live' : 'Campaign-ready';
    var first = g.images[0] || { src: '', alt: '' };

    var thumbs = g.images
      .map(function (im, idx) {
        var active = idx === 0 ? ' is-active' : '';
        var urlAttr = im.projectUrl ? ' data-project-url="' + attrUrl(im.projectUrl) + '"' : '';
        var ctaAttr = im.projectUrl ? ' data-project-cta="' + esc(im.projectCta || 'See it live') + '"' : '';
        return (
          '<button type="button" class="ft-pc-thumb' +
          active +
          '" role="tab" aria-selected="' +
          (idx === 0 ? 'true' : 'false') +
          '" tabindex="' +
          (idx === 0 ? '0' : '-1') +
          '" data-ft-pc-index="' +
          idx +
          '" data-src="' +
          attrUrl(im.src) +
          '" data-alt="' +
          esc(im.alt) +
          '"' +
          urlAttr +
          ctaAttr +
          ' aria-controls="' +
          rootId +
          '-main">' +
          '  <span class="ft-pc-thumb__inner">' +
          '    <img src="' +
          attrUrl(im.src) +
          '" alt="" loading="' +
          (idx === 0 ? 'eager' : 'lazy') +
          '">' +
          '  </span>' +
          '</button>'
        );
      })
      .join('');

    var firstCta =
      first.projectUrl ?
        '<a class="ft-pc-stage__cta btn btn-primary rounded-pill px-4" href="' +
        attrUrl(first.projectUrl) +
        '" target="_blank" rel="noopener noreferrer"><i class="fa fa-external-link-alt me-2" aria-hidden="true"></i>' +
        esc(first.projectCta || 'See it live') +
        '</a>' :
        '';

    var lightboxHidden = g.images
      .map(function (im, idx) {
        return (
          '<a id="' +
          rootId +
          '-lb-' +
          idx +
          '" href="' +
          attrUrl(im.src) +
          '" data-lightbox="' +
          esc(gid) +
          '" data-title="' +
          esc(im.alt) +
          '" data-ft-pc-lb="' +
          idx +
          '" class="visually-hidden" tabindex="-1" aria-hidden="true"> </a>'
        );
      })
      .join('');

    return (
      '<section class="ft-portfolio-gallery ft-portfolio-gallery--carousel" aria-labelledby="' +
      gid +
      '-title">' +
      '  <div class="ft-portfolio-gallery__head">' +
      '    <div class="ft-portfolio-gallery__head-text">' +
      '      <h2 id="' +
      gid +
      '-title">' +
      esc(g.title) +
      '</h2>' +
      '      <p class="ft-portfolio-gallery__blurb">' +
      esc(g.blurb) +
      '</p>' +
      '    </div>' +
      '    <span class="ft-portfolio-gallery__badge">' +
      esc(badge) +
      '</span>' +
      '  </div>' +
      '  <div class="ft-portfolio-card ft-pc-carousel" id="' +
      rootId +
      '" data-ft-pc-root data-lightbox-group="' +
      esc(gid) +
      '">' +
      '    <div class="ft-pc-carousel__stage-wrap">' +
      '      <button type="button" class="ft-pc-nav ft-pc-nav--prev" data-ft-pc-prev aria-label="Previous slide">' +
      '        <i class="fa fa-chevron-left" aria-hidden="true"></i>' +
      '      </button>' +
      '      <figure class="ft-pc-stage" id="' +
      rootId +
      '-main">' +
      '        <div class="ft-pc-stage__frame">' +
          '          <img class="ft-pc-stage__img" src="' +
          attrUrl(first.src) +
          '" alt="' +
          esc(first.alt) +
          '" width="1200" height="750" decoding="async" fetchpriority="' +
          (gi === 0 ? 'high' : 'auto') +
          '">' +
          '          <button type="button" class="ft-pc-stage__lightbox-btn" data-ft-pc-expand aria-label="Open full-screen preview"><i class="fa fa-expand" aria-hidden="true"></i></button>' +
      '        </div>' +
      '        <figcaption class="ft-pc-stage__meta">' +
      '          <p class="ft-pc-caption mb-0" data-ft-pc-caption>' +
      esc(first.alt) +
      '</p>' +
      '          <div class="ft-pc-stage__actions" data-ft-pc-cta-wrap>' +
      firstCta +
      '          </div>' +
      '        </figcaption>' +
      '      </figure>' +
      '      <button type="button" class="ft-pc-nav ft-pc-nav--next" data-ft-pc-next aria-label="Next slide">' +
      '        <i class="fa fa-chevron-right" aria-hidden="true"></i>' +
      '      </button>' +
      '    </div>' +
      '    <div class="ft-pc-thumbs" role="tablist" aria-label="Gallery thumbnails">' +
      thumbs +
      '    </div>' +
      '    <div class="visually-hidden">' +
      lightboxHidden +
      '</div>' +
      '    <p class="ft-portfolio-gallery__hint mb-0">Tap the large image for a full-screen preview. Use the thumbnails below to browse every piece in this collection.</p>' +
      '  </div>' +
      '</section>'
    );
  }

  mount.innerHTML = GALLERIES.map(buildCarousel).join('');

  function setSlide(root, index) {
    var thumbs = [].slice.call(root.querySelectorAll('.ft-pc-thumb'));
    if (!thumbs.length) return;
    var n = thumbs.length;
    var i = ((index % n) + n) % n;
    var btn = thumbs[i];
    var src = btn.getAttribute('data-src') || '';
    var alt = btn.getAttribute('data-alt') || '';
    var projectUrl = btn.getAttribute('data-project-url');
    var projectCta = btn.getAttribute('data-project-cta') || 'See it live';

    var img = root.querySelector('.ft-pc-stage__img');
    var cap = root.querySelector('[data-ft-pc-caption]');
    var ctaWrap = root.querySelector('[data-ft-pc-cta-wrap]');

    if (img) {
      img.src = src;
      img.alt = alt;
    }
    if (cap) cap.textContent = alt;

    if (ctaWrap) {
      if (projectUrl) {
        ctaWrap.innerHTML =
          '<a class="ft-pc-stage__cta btn btn-primary rounded-pill px-4" href="' +
          attrUrl(projectUrl) +
          '" target="_blank" rel="noopener noreferrer"><i class="fa fa-external-link-alt me-2" aria-hidden="true"></i>' +
          esc(projectCta) +
          '</a>';
      } else {
        ctaWrap.innerHTML = '';
      }
    }

    thumbs.forEach(function (t, idx) {
      var on = idx === i;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
    });

    root.setAttribute('data-ft-pc-active', String(i));

    var strip = root.querySelector('.ft-pc-thumbs');
    if (strip && thumbs[i]) {
      var tEl = thumbs[i];
      var sRect = strip.getBoundingClientRect();
      var tRect = tEl.getBoundingClientRect();
      var delta = tRect.left + tRect.width / 2 - (sRect.left + sRect.width / 2);
      strip.scrollBy({ left: delta, behavior: 'smooth' });
    }
  }

  function currentIndex(root) {
    var v = parseInt(root.getAttribute('data-ft-pc-active') || '0', 10);
    if (isNaN(v)) return 0;
    return v;
  }

  mount.querySelectorAll('[data-ft-pc-root]').forEach(function (root) {
    var thumbs = [].slice.call(root.querySelectorAll('.ft-pc-thumb'));
    if (!thumbs.length) return;

    root.setAttribute('data-ft-pc-active', '0');

    thumbs.forEach(function (btn, idx) {
      btn.addEventListener('click', function () {
        setSlide(root, idx);
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSlide(root, idx);
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          var nextI = currentIndex(root) + 1;
          setSlide(root, nextI);
          thumbs[currentIndex(root)].focus();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          var prevI = currentIndex(root) - 1;
          setSlide(root, prevI);
          thumbs[currentIndex(root)].focus();
        }
      });
    });

    var prev = root.querySelector('[data-ft-pc-prev]');
    var next = root.querySelector('[data-ft-pc-next]');
    if (prev) prev.addEventListener('click', function () { setSlide(root, currentIndex(root) - 1); });
    if (next) next.addEventListener('click', function () { setSlide(root, currentIndex(root) + 1); });

    var expandBtn = root.querySelector('[data-ft-pc-expand]');
    if (expandBtn) {
      expandBtn.addEventListener('click', function () {
        var i = currentIndex(root);
        var link = root.querySelector('[data-ft-pc-lb="' + i + '"]');
        if (link) link.click();
      });
    }
  });
})();
