(function () {
  'use strict';

  var grid = document.getElementById('ftBlogGrid');
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('[data-blog-item]'));
  var searchInput = document.getElementById('ftBlogSearch');
  var countEl = document.getElementById('ftBlogCount');
  var resultsLabel = document.getElementById('ftBlogResultsLabel');
  var emptyEl = document.getElementById('ftBlogEmpty');
  var toggle = document.getElementById('ftBlogFilterToggle');
  var panel = document.getElementById('ftBlogFilterPanel');
  var topicList = document.getElementById('ftBlogTopicList');
  var sideTopics = document.getElementById('ftBlogSideTopics');
  var filterDot = document.getElementById('ftBlogFilterDot');

  var pager = document.getElementById('ftBlogPager');
  var PAGE_SIZE = 9;

  var state = { library: 'all', topic: '', query: '', page: 1 };

  var libraryLabels = {
    all: 'All articles',
    laikipia: 'Nanyuki & Laikipia',
    technology: 'Technology'
  };

  function slug(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function itemTag(item) {
    var tag = item.querySelector('.ft-blog-card__tag');
    return tag ? tag.textContent.trim() : '';
  }

  items.forEach(function (item) {
    var label = itemTag(item);
    if (label) item.setAttribute('data-tag', slug(label));
    var body = item.querySelector('.ft-blog-card__body');
    var titleLink = item.querySelector('.ft-blog-card__title a');
    if (body && titleLink && !body.querySelector('.ft-blog-card__more')) {
      var more = document.createElement('span');
      more.className = 'ft-blog-card__more';
      more.innerHTML = 'Read article <i class="fa fa-arrow-right" aria-hidden="true"></i>';
      body.appendChild(more);
    }
    var card = item.querySelector('.ft-blog-card');
    var img = item.querySelector('.ft-blog-card__img');
    if (img && !img.getAttribute('src')) {
      img.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80';
      img.alt = img.alt || 'Article image';
    }
    if (img) {
      img.addEventListener('error', function onImgError() {
        img.removeEventListener('error', onImgError);
        img.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80';
      });
    }
    if (card && titleLink) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        window.location.href = titleLink.href;
      });
    }
  });

  function uniqueTopics() {
    var seen = {};
    var list = [];
    items.forEach(function (item) {
      var label = itemTag(item);
      var key = slug(label);
      if (!label || seen[key]) return;
      seen[key] = true;
      list.push({ label: label, key: key });
    });
    list.sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
    return list;
  }

  function renderTopicButtons() {
    var topics = uniqueTopics();
    function makeBtn(topic, extraClass) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = extraClass;
      btn.setAttribute('data-blog-topic', topic.key);
      btn.textContent = topic.label;
      return btn;
    }
    if (topicList) {
      topicList.innerHTML = '';
      topics.forEach(function (t) {
        topicList.appendChild(makeBtn(t, 'ft-blog-filter-title'));
      });
    }
    if (sideTopics) {
      sideTopics.innerHTML = '';
      topics.forEach(function (t) {
        sideTopics.appendChild(makeBtn(t, 'ft-blog-side-topic'));
      });
    }
  }

  function matches(item) {
    var cat = item.getAttribute('data-category') || '';
    var tag = item.getAttribute('data-tag') || '';
    var hay = (item.getAttribute('data-search') || item.textContent || '').toLowerCase();
    if (state.library !== 'all' && cat !== state.library) return false;
    if (state.topic && tag !== state.topic) return false;
    if (state.query && hay.indexOf(state.query) === -1) return false;
    return true;
  }

  function renderPager(pages, matchedCount) {
    if (!pager) return;
    pager.innerHTML = '';
    if (pages <= 1) {
      pager.hidden = true;
      return;
    }
    pager.hidden = false;

    function addBtn(label, page, opts) {
      opts = opts || {};
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ft-blog-pager__btn' + (opts.current ? ' is-current' : '') + (opts.nav ? ' ft-blog-pager__btn--nav' : '');
      btn.textContent = label;
      if (opts.disabled) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', function () {
          state.page = page;
          apply();
          var main = document.querySelector('.ft-blog-main');
          if (main) main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
      pager.appendChild(btn);
    }

    addBtn('Previous', state.page - 1, { nav: true, disabled: state.page <= 1 });
    for (var i = 1; i <= pages; i++) {
      addBtn(String(i), i, { current: i === state.page });
    }
    addBtn('Next', state.page + 1, { nav: true, disabled: state.page >= pages });
  }

  function apply() {
    var matched = [];
    items.forEach(function (item) {
      item.classList.remove('is-featured');
      if (matches(item)) matched.push(item);
    });

    var pages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE) || 1);
    if (state.page > pages) state.page = pages;
    if (state.page < 1) state.page = 1;
    var start = (state.page - 1) * PAGE_SIZE;
    var pageItems = matched.slice(start, start + PAGE_SIZE);

    items.forEach(function (item) {
      item.classList.add('is-hidden');
    });
    pageItems.forEach(function (item) {
      item.classList.remove('is-hidden');
    });
    if (pageItems[0] && state.page === 1 && !state.query) {
      pageItems[0].classList.add('is-featured');
    }

    if (emptyEl) emptyEl.hidden = matched.length > 0;
    if (grid) grid.hidden = matched.length === 0;

    var total = items.length;
    if (countEl) countEl.textContent = total + ' article' + (total === 1 ? '' : 's');

    var label = libraryLabels[state.library] || 'All articles';
    if (state.topic) {
      var topicBtn = document.querySelector('[data-blog-topic="' + state.topic + '"]');
      label = topicBtn ? topicBtn.textContent : state.topic;
    }
    if (resultsLabel) {
      var from = matched.length ? start + 1 : 0;
      var to = start + pageItems.length;
      var q = state.query ? ' matching “' + state.query + '”' : '';
      resultsLabel.textContent =
        matched.length === 0
          ? 'No articles · ' + label + q
          : 'Showing ' + from + '–' + to + ' of ' + matched.length + ' · ' + label + q;
    }

    document.querySelectorAll('[data-blog-filter]').forEach(function (btn) {
      var on = btn.getAttribute('data-blog-filter') === state.library && !state.topic;
      btn.classList.toggle('is-active', on);
    });
    document.querySelectorAll('[data-blog-topic]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-blog-topic') === state.topic);
    });

    var counts = { all: items.length, laikipia: 0, technology: 0 };
    items.forEach(function (item) {
      var cat = item.getAttribute('data-category');
      if (counts[cat] != null) counts[cat] += 1;
    });
    document.querySelectorAll('[data-count-for]').forEach(function (el) {
      var key = el.getAttribute('data-count-for');
      el.textContent = counts[key] != null ? String(counts[key]) : '';
    });

    if (filterDot) filterDot.hidden = state.library === 'all' && !state.topic;
    renderPager(pages, matched.length);
  }

  function setLibrary(value) {
    state.library = value || 'all';
    state.topic = '';
    state.page = 1;
    apply();
  }

  function setTopic(value) {
    state.topic = value || '';
    if (state.topic) state.library = 'all';
    state.page = 1;
    apply();
  }

  function setPanel(open) {
    if (!panel || !toggle) return;
    panel.classList.toggle('is-open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  renderTopicButtons();
  apply();

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      state.query = String(searchInput.value || '').trim().toLowerCase();
      state.page = 1;
      apply();
    });
  }

  document.addEventListener('click', function (e) {
    var lib = e.target.closest('[data-blog-filter]');
    if (lib) {
      setLibrary(lib.getAttribute('data-blog-filter'));
      return;
    }
    var topic = e.target.closest('[data-blog-topic]');
    if (topic) {
      var next = topic.getAttribute('data-blog-topic');
      setTopic(state.topic === next ? '' : next);
    }
  });

  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setPanel(!panel.classList.contains('is-open'));
    });
  }

  document.addEventListener('click', function (e) {
    if (!panel || !panel.classList.contains('is-open')) return;
    if (panel.contains(e.target) || (toggle && toggle.contains(e.target))) return;
    setPanel(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setPanel(false);
  });
})();
