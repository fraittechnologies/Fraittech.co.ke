(function () {
  'use strict';

  var mount = document.getElementById('ftPortfolioGalleriesMount');
  if (!mount) return;

  var PROJECTS = [
    {
      type: 'web',
      title: 'Tasksfy',
      meta: 'Service marketplace',
      src: 'img/Projects/website/tasksfy.webp',
      full: 'img/Projects/website/full/tasksfy.webp',
      alt: 'Tasksfy landing page — service outsourcing app',
      url: 'https://tasksfy.com',
    },
    {
      type: 'web',
      title: 'Food Security Millers',
      meta: 'Flour & animal feed',
      src: 'img/Projects/website/food.webp',
      full: 'img/Projects/website/full/food.webp',
      alt: 'Food Security Millers landing page',
      url: 'https://foodsecuritymillers.com',
    },
    {
      type: 'web',
      title: 'La Satarah',
      meta: 'Herb exporter',
      src: 'img/Projects/website/Lasatarah.webp',
      full: 'img/Projects/website/full/Lasatarah.webp',
      alt: 'La Satarah landing page — premium herbs',
      url: 'https://lasatarah.co.ke',
    },
    {
      type: 'web',
      title: 'All Things Grand',
      meta: 'Home & lifestyle shop',
      src: 'img/Projects/website/all.webp',
      full: 'img/Projects/website/full/all.webp',
      alt: 'All Things Grand landing page',
      url: 'https://allthingsgrand.co.ke/',
    },
    {
      type: 'web',
      title: 'Larpei & Company',
      meta: 'Law firm',
      src: 'img/Projects/website/larpei.webp',
      full: 'img/Projects/website/full/larpei.webp',
      alt: 'Larpei & Company Advocates landing page',
      url: 'https://www.larpeiandcompanyadvocates.co.ke/',
    },
    {
      type: 'web',
      title: 'Kingdom City Church',
      meta: 'Church',
      src: 'img/Projects/website/kc.webp',
      full: 'img/Projects/website/full/kc.webp',
      alt: 'Kingdom City Church Nanyuki landing page',
      url: 'https://www.kingdomcitychurchnanyuki.org/',
    },
    {
      type: 'web',
      title: 'Gee Radio',
      meta: 'Live radio',
      src: 'img/Projects/website/geeradio.webp',
      full: 'img/Projects/website/full/geeradio.webp',
      alt: 'Gee Radio landing page',
      url: 'https://geeradio.co.ke',
    },
    {
      type: 'web',
      title: 'Nanyuki Now',
      meta: 'Local discovery guide',
      src: 'img/Projects/website/nanyuki-now.webp',
      full: 'img/Projects/website/full/nanyuki-now.webp',
      alt: 'Nanyuki Now landing page — guide to Nanyuki, Timau & Naromoru',
      url: 'https://nanyukinow.co.ke',
    },
    {
      type: 'web',
      title: 'FMK Interior Decor',
      meta: 'Curtains & interiors',
      src: 'img/Projects/website/fmk-interior.webp',
      full: 'img/Projects/website/full/fmk-interior.webp',
      alt: 'FMK Interior Decor landing page',
      url: 'https://fmkdecor.co.ke',
    },
    {
      type: 'web',
      title: 'Bamba Radio',
      meta: 'Digital radio',
      src: 'img/Projects/website/bamba-radio.webp',
      full: 'img/Projects/website/full/bamba-radio.webp',
      alt: 'Bamba Radio landing page',
      url: 'https://bambaradio.com/',
    },
    {
      type: 'web',
      title: 'Munene Pen',
      meta: 'Academic writing',
      src: 'img/Projects/website/munene-pen.webp',
      full: 'img/Projects/website/full/munene-pen.webp',
      alt: 'Munene Pen landing page — academic writing and research support',
      url: 'https://munenepen.co.ke',
    },
    {
      type: 'saas',
      subtype: 'church',
      title: 'Church MIS',
      meta: 'Congregation & giving',
      src: 'img/Projects/saas/church-mis.webp',
      full: 'img/Projects/saas/full/church-mis.webp',
      alt: 'Church MIS staff login — Fraittech',
      demoUrl: 'https://finance.fraittech.co.ke/login',
    },
    {
      type: 'saas',
      subtype: 'law',
      title: 'Law firm MIS',
      meta: 'Practice management',
      src: 'img/Projects/saas/lawfirm-mis.webp',
      full: 'img/Projects/saas/full/lawfirm-mis.webp',
      alt: 'Law firm MIS staff portal login — Fraittech',
      demoUrl: 'https://lawfirm.fraittech.co.ke/',
    },
    {
      type: 'saas',
      subtype: 'football',
      title: 'Football MIS',
      meta: 'Club operations',
      src: 'img/Projects/saas/football-mis.webp',
      full: 'img/Projects/saas/full/football-mis.webp',
      alt: 'Football MIS — Golden Strikers Academy staff portal login',
      demoUrl: 'https://goldenstrikers.fraittech.co.ke/login.php',
    },
    {
      type: 'saas',
      subtype: 'radio',
      title: 'Radio MIS',
      meta: 'Station operations',
      src: 'img/Projects/saas/radio-mis.webp',
      full: 'img/Projects/saas/full/radio-mis.webp',
      alt: 'Radio MIS — Gee Radio admin dashboard login',
      demoUrl: 'https://portal.geeradio.co.ke/',
    },
    {
      type: 'saas',
      subtype: 'writing',
      title: 'Writing MIS',
      meta: 'Editorial desk',
      src: 'img/Projects/saas/writing-mis.webp',
      full: 'img/Projects/saas/full/writing-mis.webp',
      alt: 'Writing MIS — Fraittech client portal login',
      demoUrl: 'https://portal.fraittech.co.ke/',
    },
    {
      type: 'saas',
      subtype: 'writing',
      title: 'Writing MIS Admin',
      meta: 'Staff portal',
      src: 'img/Projects/saas/writing-admin.webp',
      full: 'img/Projects/saas/full/writing-admin.webp',
      alt: 'Writing MIS — Fraittech staff admin login',
      demoUrl: 'https://admin.fraittech.co.ke/',
    },
    {
      type: 'design',
      title: 'Sifa 26',
      meta: 'Event poster',
      src: 'img/Projects/graphics/Sifa.jpeg',
      alt: 'Sifa 26 gospel event poster',
    },
    {
      type: 'design',
      flip: true,
      title: 'Hampden Pointe',
      meta: 'Business card',
      src: 'img/Projects/graphics/business-cards/hampden-front.jpeg',
      back: 'img/Projects/graphics/business-cards/hampden-back.jpeg',
      alt: 'Hampden Pointe Property Solutions business card — front',
      backAlt: 'Hampden Pointe Property Solutions business card — back',
    },
    {
      type: 'design',
      title: 'Mashujaa Day',
      meta: 'Campaign',
      src: 'img/Projects/graphics/mashujaa.webp',
      alt: 'Mashujaa Day campaign creative',
    },
    {
      type: 'design',
      title: 'Irie',
      meta: 'Packaging',
      src: 'img/Projects/graphics/Irie_with_barcode.webp',
      alt: 'Irie packaging with barcode',
    },
    {
      type: 'design',
      title: 'Menu',
      meta: 'Print',
      src: 'img/Projects/graphics/MENU.webp',
      alt: 'Hospitality menu design',
    },
    {
      type: 'design',
      title: 'Bee Hype',
      meta: 'Brand',
      src: 'img/Projects/graphics/Bee_hype.webp',
      alt: 'Bee Hype brand graphic',
    },
    {
      type: 'design',
      title: 'Chai & Chaos',
      meta: 'Brand',
      src: 'img/Projects/graphics/Chai & Chaos.webp',
      alt: 'Chai & Chaos brand creative',
    },
    {
      type: 'design',
      title: 'Holiday',
      meta: 'Campaign',
      src: 'img/Projects/graphics/Christmas.webp',
      alt: 'Holiday campaign creative',
    },
    {
      type: 'design',
      title: 'Retro',
      meta: 'Campaign',
      src: 'img/Projects/graphics/retro.webp',
      alt: 'Retro campaign graphic',
    },
    {
      type: 'design',
      title: 'Sax',
      meta: 'Product',
      src: 'img/Projects/graphics/Sax.webp',
      alt: 'Sax product graphic',
    },
    {
      type: 'design',
      title: 'Larpei',
      meta: 'Legal',
      src: 'img/Projects/graphics/larpei.webp',
      alt: 'Larpei marketing suite',
    },
    {
      type: 'design',
      title: 'Weekend',
      meta: 'Campaign',
      src: 'img/Projects/graphics/weekend.webp',
      alt: 'Weekend lifestyle campaign',
    },
    {
      type: 'design',
      title: 'Replay',
      meta: 'Launch',
      src: 'img/Projects/graphics/replay.webp',
      alt: 'Replay launch creative',
    },
    {
      type: 'design',
      title: 'Blue',
      meta: 'Product',
      src: 'img/Projects/graphics/blue.webp',
      alt: 'Blue product launch visual',
    },
  ];

  var GROUPS = [
    { id: 'web', title: 'Websites', lightbox: 'ft-work-web' },
    { id: 'design', title: 'Design', lightbox: 'ft-work-design' },
    { id: 'saas', title: 'SaaS Platforms' },
  ];

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function attrUrl(path) {
    return encodeURI(String(path || ''))
      .replace(/'/g, '%27')
      .replace(/&/g, '%26');
  }

  function hostLabel(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch (e) {
      return '';
    }
  }

  function buildCard(p, gi, idx) {
    var group = GROUPS[gi];
    var eager = p.type === 'web' || p.type === 'saas' ? idx < 4 : idx < 2;
    var img =
      '<img src="' +
      attrUrl(p.src) +
      '" alt="' +
      esc(p.alt) +
      '" width="1200" height="750" loading="' +
      (eager ? 'eager' : 'lazy') +
      '" decoding="async"' +
      (idx === 0 && p.type === 'web' ? ' fetchpriority="high"' : '') +
      '>';

    if (p.type === 'web' || p.type === 'saas') {
      var liveUrl = p.type === 'saas' ? p.demoUrl : p.url;
      var host = liveUrl ? hostLabel(liveUrl) : '';
      var fullSrc = p.full || p.src;
      var peek = p.type === 'saas' ? 'Enter demo' : 'Scroll landing page';
      var liveLabel = p.type === 'saas' ? 'Enter demo' : 'Open live site';
      var previewAttrs =
        ' data-ft-preview' +
        ' data-title="' +
        esc(p.title) +
        '"' +
        ' data-meta="' +
        esc(p.meta) +
        '"' +
        ' data-full="' +
        attrUrl(fullSrc) +
        '"' +
        ' data-live-label="' +
        esc(liveLabel) +
        '"' +
        ' data-hint="' +
        esc(p.type === 'saas' ? 'Login portal preview' : 'Scroll the landing page') +
        '"' +
        (liveUrl ? ' data-url="' + attrUrl(liveUrl) + '"' : '');

      return (
        '<article class="ft-work-card ft-work-card--web" data-work-item data-type="' +
        esc(p.type) +
        '"' +
        (p.subtype ? ' data-subtype="' + esc(p.subtype) + '"' : '') +
        '>' +
        '  <button type="button" class="ft-work-card__preview"' +
        previewAttrs +
        ' aria-label="' +
        (p.type === 'saas' ? 'Preview ' + esc(p.title) + ' demo login' : 'Preview ' + esc(p.title) + ' landing page') +
        '">' +
        '    <span class="ft-work-card__chrome" aria-hidden="true">' +
        '      <span class="ft-work-card__dots"></span>' +
        (host ? '<span class="ft-work-card__url">' + esc(host) + '</span>' : '') +
        '    </span>' +
        '    <span class="ft-work-card__screen">' +
        img +
        '      <span class="ft-work-card__peek">' +
        esc(peek) +
        '</span>' +
        '    </span>' +
        '  </button>' +
        '  <div class="ft-work-card__body">' +
        '    <h3 class="ft-work-card__title">' +
        '      <button type="button" class="ft-work-card__title-link"' +
        previewAttrs +
        '>' +
        esc(p.title) +
        '</button>' +
        '    </h3>' +
        '    <p class="ft-work-card__meta">' +
        esc(p.meta) +
        '</p>' +
        '  </div>' +
        '</article>'
      );
    }

    if (p.type === 'design' && p.flip && p.back) {
      return (
        '<article class="ft-work-card ft-work-card--design ft-work-card--flip" data-work-item data-type="design">' +
        '  <button type="button" class="ft-work-card__flip" data-ft-flip aria-pressed="false" aria-label="Flip ' +
        esc(p.title) +
        ' business card to see the other side">' +
        '    <span class="ft-work-card__flip-scene">' +
        '      <span class="ft-work-card__flip-inner">' +
        '        <span class="ft-work-card__face ft-work-card__face--front">' +
        '          <img src="' +
        attrUrl(p.src) +
        '" alt="' +
        esc(p.alt) +
        '" width="1200" height="750" loading="' +
        (eager ? 'eager' : 'lazy') +
        '" decoding="async">' +
        '        </span>' +
        '        <span class="ft-work-card__face ft-work-card__face--back" aria-hidden="true">' +
        '          <img src="' +
        attrUrl(p.back) +
        '" alt="' +
        esc(p.backAlt || p.alt) +
        '" width="1200" height="750" loading="lazy" decoding="async">' +
        '        </span>' +
        '      </span>' +
        '    </span>' +
        '    <span class="ft-work-card__flip-hint" aria-hidden="true"><i class="fa fa-sync-alt"></i> Flip</span>' +
        '  </button>' +
        '  <div class="ft-work-card__body">' +
        '    <div class="ft-work-card__copy">' +
        '      <h3 class="ft-work-card__title">' +
        esc(p.title) +
        '</h3>' +
        '      <p class="ft-work-card__meta">' +
        esc(p.meta) +
        ' · tap to flip</p>' +
        '    </div>' +
        '  </div>' +
        '</article>'
      );
    }

    return (
      '<article class="ft-work-card ft-work-card--design" data-work-item data-type="design">' +
      '  <a class="ft-work-card__media" href="' +
      attrUrl(p.src) +
      '" data-lightbox="' +
      esc(group.lightbox) +
      '" data-title="' +
      esc(p.title) +
      ' — ' +
      esc(p.meta) +
      '">' +
      img +
      '    <span class="ft-work-card__view" aria-hidden="true"><i class="fa fa-expand"></i></span>' +
      '  </a>' +
      '  <div class="ft-work-card__body">' +
      '    <div class="ft-work-card__copy">' +
      '      <h3 class="ft-work-card__title">' +
      esc(p.title) +
      '</h3>' +
      '      <p class="ft-work-card__meta">' +
      esc(p.meta) +
      '</p>' +
      '    </div>' +
      '  </div>' +
      '</article>'
    );
  }

  function buildGroup(group, gi) {
    var items = PROJECTS.filter(function (p) {
      return p.type === group.id;
    });
    if (!items.length) return '';
    return (
      '<div class="ft-work-group" data-work-group="' +
      group.id +
      '" data-page="1">' +
      '  <header class="ft-work-group__head">' +
      '    <h2 class="ft-work-group__title">' +
      esc(group.title) +
      '</h2>' +
      '    <span class="ft-work-group__n">' +
      items.length +
      '</span>' +
      '  </header>' +
      '  <div class="ft-work-grid ft-work-grid--' +
      group.id +
      '">' +
      items.map(function (p, idx) {
        return buildCard(p, gi, idx);
      }).join('') +
      '  </div>' +
      '  <nav class="ft-work-pager" data-work-pager aria-label="' +
      esc(group.title) +
      ' pagination">' +
      '    <button type="button" class="ft-work-pager__btn" data-page-prev disabled aria-label="Previous page">' +
      '      <i class="fa fa-chevron-left" aria-hidden="true"></i> Prev' +
      '    </button>' +
      '    <p class="ft-work-pager__status mb-0" data-page-status></p>' +
      '    <button type="button" class="ft-work-pager__btn ft-work-pager__btn--next" data-page-next aria-label="Next page">' +
      '      Next <i class="fa fa-chevron-right" aria-hidden="true"></i>' +
      '    </button>' +
      '  </nav>' +
      '</div>'
    );
  }

  mount.innerHTML = GROUPS.map(buildGroup).join('');

  /* Websites: 3-col → 9. Design: 2/3-col → multiples of 6 so rows stay full. */
  var PAGE_SIZE = { web: 9, design: 6, saas: 9 };
  var filters = [].slice.call(document.querySelectorAll('.ft-work-filter'));
  var countEl = document.querySelector('[data-work-count]');
  var groups = [].slice.call(mount.querySelectorAll('[data-work-group]'));
  var misWrap = document.getElementById('ftWorkMisWrap');
  var misSelect = document.getElementById('ftWorkMisSelect');
  var active = 'all';
  var misSubtype = 'all';

  function labelFor(filter, n) {
    if (filter === 'web') return n + (n === 1 ? ' website' : ' websites');
    if (filter === 'saas') return n + (n === 1 ? ' platform' : ' platforms');
    if (filter === 'design') return n + (n === 1 ? ' piece' : ' pieces');
    return n + ' projects';
  }

  function groupItems(g) {
    var id = g.getAttribute('data-work-group');
    var cards = [].slice.call(g.querySelectorAll('[data-work-item]'));
    if (id !== 'saas' || misSubtype === 'all') return cards;
    return cards.filter(function (el) {
      return el.getAttribute('data-subtype') === misSubtype;
    });
  }

  function syncMisVisibility(filter) {
    if (!misWrap) return;
    var show = filter === 'saas' || filter === 'all';
    misWrap.hidden = !show;
  }

  function pageSizeFor(groupId, total) {
    var base = PAGE_SIZE[groupId] || 9;
    if (groupId !== 'design') return base;
    /* Prefer sizes that fill 2-col and 3-col rows, and split pages evenly. */
    var options = [6, 12, 9, 8, 4, 3];
    var best = base;
    var bestScore = -Infinity;
    options.forEach(function (size) {
      if (size > total && size !== total) return;
      var pages = Math.ceil(total / size);
      var last = total - size * (pages - 1);
      var fillsTwo = size % 2 === 0 && last % 2 === 0;
      var fillsThree = size % 3 === 0 && last % 3 === 0;
      var even = pages > 1 ? 1 - Math.abs(size - last) / size : 1;
      var score =
        (fillsTwo ? 4 : 0) +
        (fillsThree ? 5 : 0) +
        even * 3 +
        (pages >= 2 && pages <= 4 ? 1 : 0) -
        Math.abs(size - 6) * 0.05;
      if (score > bestScore) {
        bestScore = score;
        best = size;
      }
    });
    return best;
  }

  function renderGroupPage(g) {
    var id = g.getAttribute('data-work-group');
    var allCards = [].slice.call(g.querySelectorAll('[data-work-item]'));
    var cards = groupItems(g);
    var total = cards.length;
    var size = pageSizeFor(id, total);
    var pages = Math.max(1, Math.ceil(total / size) || 1);
    var page = parseInt(g.getAttribute('data-page') || '1', 10);
    if (isNaN(page) || page < 1) page = 1;
    if (page > pages) page = pages;
    g.setAttribute('data-page', String(page));

    var start = (page - 1) * size;
    var end = start + size;
    allCards.forEach(function (el) {
      el.hidden = true;
    });
    cards.forEach(function (el, idx) {
      el.hidden = idx < start || idx >= end;
    });

    var nEl = g.querySelector('.ft-work-group__n');
    if (nEl && id === 'saas') nEl.textContent = String(total);

    var pager = g.querySelector('[data-work-pager]');
    var prev = g.querySelector('[data-page-prev]');
    var next = g.querySelector('[data-page-next]');
    var status = g.querySelector('[data-page-status]');
    if (!pager) return;

    if (pages <= 1 || total === 0) {
      pager.hidden = true;
      return;
    }
    pager.hidden = false;
    if (prev) prev.disabled = page <= 1;
    if (next) next.disabled = page >= pages;
    if (status) {
      status.textContent = 'Page ' + page + ' of ' + pages;
    }
  }

  function visibleCount(filter) {
    if (filter === 'all') {
      if (misSubtype === 'all') return PROJECTS.length;
      return PROJECTS.filter(function (p) {
        return p.type !== 'saas' || p.subtype === misSubtype;
      }).length;
    }
    if (filter === 'saas') {
      return PROJECTS.filter(function (p) {
        return p.type === 'saas' && (misSubtype === 'all' || p.subtype === misSubtype);
      }).length;
    }
    return PROJECTS.filter(function (p) {
      return p.type === filter;
    }).length;
  }

  function applyFilter(filter) {
    active = filter;
    syncMisVisibility(filter);
    groups.forEach(function (g) {
      var id = g.getAttribute('data-work-group');
      var visible = filter === 'all' || filter === id;
      g.hidden = !visible;
      var head = g.querySelector('.ft-work-group__head');
      if (head) head.hidden = filter !== 'all';
      if (visible) {
        g.setAttribute('data-page', '1');
        renderGroupPage(g);
      }
    });
    if (countEl) countEl.textContent = labelFor(filter, visibleCount(filter));
    filters.forEach(function (btn) {
      var on = btn.getAttribute('data-filter') === filter;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function applyMisSubtype(subtype) {
    misSubtype = subtype || 'all';
    groups.forEach(function (g) {
      if (g.getAttribute('data-work-group') !== 'saas') return;
      if (g.hidden) return;
      g.setAttribute('data-page', '1');
      renderGroupPage(g);
    });
    if (countEl) countEl.textContent = labelFor(active, visibleCount(active));
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyFilter(btn.getAttribute('data-filter') || 'all');
    });
  });

  if (misSelect) {
    misSelect.addEventListener('change', function () {
      applyMisSubtype(misSelect.value || 'all');
    });
  }

  mount.addEventListener('click', function (e) {
    var nextBtn = e.target.closest('[data-page-next]');
    var prevBtn = e.target.closest('[data-page-prev]');
    if (!nextBtn && !prevBtn) return;
    var g = e.target.closest('[data-work-group]');
    if (!g) return;
    var page = parseInt(g.getAttribute('data-page') || '1', 10);
    if (nextBtn && !nextBtn.disabled) page += 1;
    if (prevBtn && !prevBtn.disabled) page -= 1;
    g.setAttribute('data-page', String(page));
    renderGroupPage(g);
    var head = g.querySelector('.ft-work-group__head') || g;
    if (head && typeof head.scrollIntoView === 'function') {
      head.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  var hash = (location.hash || '').replace('#', '');
  var misHash = {
    church: 'church',
    'church-mis': 'church',
    law: 'law',
    lawfirm: 'law',
    'law-firm': 'law',
    'lawfirm-mis': 'law',
    football: 'football',
    'football-mis': 'football',
    radio: 'radio',
    'radio-mis': 'radio',
    geeradio: 'radio',
    writing: 'writing',
    'writing-mis': 'writing',
    admin: 'writing',
    'writing-admin': 'writing',
  };
  if (hash === 'websites' || hash === 'web') applyFilter('web');
  else if (hash === 'saas' || hash === 'platforms' || hash === 'systems') applyFilter('saas');
  else if (hash === 'design') applyFilter('design');
  else if (misHash[hash]) {
    applyFilter('saas');
    if (misSelect) {
      misSelect.value = misHash[hash];
      applyMisSubtype(misHash[hash]);
    }
  } else applyFilter('all');

  function ensurePreview() {
    var el = document.getElementById('ftSitePreview');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'ftSitePreview';
    el.className = 'ft-site-preview';
    el.hidden = true;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'ftSitePreviewTitle');
    el.innerHTML =
      '<div class="ft-site-preview__panel">' +
      '  <header class="ft-site-preview__bar">' +
      '    <div class="ft-site-preview__id">' +
      '      <p class="ft-site-preview__host" data-ft-preview-host></p>' +
      '      <h2 class="ft-site-preview__name" id="ftSitePreviewTitle" data-ft-preview-title></h2>' +
      '    </div>' +
      '    <p class="ft-site-preview__hint mb-0" data-ft-preview-hint>Scroll the landing page</p>' +
      '    <a class="ft-site-preview__live" data-ft-preview-live target="_blank" rel="noopener noreferrer">Open live site <i class="fa fa-external-link-alt" aria-hidden="true"></i></a>' +
      '    <button type="button" class="ft-site-preview__close" data-ft-preview-close aria-label="Close preview"><i class="fa fa-times" aria-hidden="true"></i></button>' +
      '  </header>' +
      '  <div class="ft-site-preview__scroll">' +
      '    <img class="ft-site-preview__shot" data-ft-preview-img alt="">' +
      '  </div>' +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      if (e.target === el) closePreview();
    });
    el.querySelector('[data-ft-preview-close]').addEventListener('click', closePreview);
    return el;
  }

  var previewLastFocus = null;

  function openPreview(btn) {
    var shell = ensurePreview();
    var title = btn.getAttribute('data-title') || 'Website';
    var full = btn.getAttribute('data-full') || '';
    var url = btn.getAttribute('data-url') || '';
    var liveLabel = btn.getAttribute('data-live-label') || 'Open live site';
    var hintText = btn.getAttribute('data-hint') || 'Scroll the landing page';
    var img = shell.querySelector('[data-ft-preview-img]');
    var live = shell.querySelector('[data-ft-preview-live]');
    var host = shell.querySelector('[data-ft-preview-host]');
    var name = shell.querySelector('[data-ft-preview-title]');
    var hint = shell.querySelector('[data-ft-preview-hint]');

    previewLastFocus = btn;
    name.textContent = title;
    host.textContent = url ? hostLabel(url) : '';
    if (hint) hint.textContent = hintText;
    img.src = full;
    img.alt = title + ' — preview';
    if (url) {
      live.href = url;
      live.innerHTML =
        esc(liveLabel) + ' <i class="fa fa-external-link-alt" aria-hidden="true"></i>';
      live.hidden = false;
    } else {
      live.removeAttribute('href');
      live.hidden = true;
    }
    shell.hidden = false;
    document.body.classList.add('ft-preview-open');
    shell.querySelector('.ft-site-preview__scroll').scrollTop = 0;
    shell.querySelector('[data-ft-preview-close]').focus();
  }

  function closePreview() {
    var shell = document.getElementById('ftSitePreview');
    if (!shell || shell.hidden) return;
    shell.hidden = true;
    document.body.classList.remove('ft-preview-open');
    var img = shell.querySelector('[data-ft-preview-img]');
    if (img) img.removeAttribute('src');
    if (previewLastFocus && typeof previewLastFocus.focus === 'function') {
      previewLastFocus.focus();
    }
  }

  document.addEventListener('click', function (e) {
    var flipBtn = e.target.closest('[data-ft-flip]');
    if (flipBtn) {
      e.preventDefault();
      var on = !flipBtn.classList.contains('is-flipped');
      flipBtn.classList.toggle('is-flipped', on);
      flipBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      var back = flipBtn.querySelector('.ft-work-card__face--back');
      var front = flipBtn.querySelector('.ft-work-card__face--front');
      if (back) back.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (front) front.setAttribute('aria-hidden', on ? 'true' : 'false');
      return;
    }
    var btn = e.target.closest('[data-ft-preview]');
    if (!btn) return;
    e.preventDefault();
    openPreview(btn);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePreview();
  });
})();
