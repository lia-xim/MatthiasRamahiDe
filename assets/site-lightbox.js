(function () {
  var gallerySelector = '[data-site-lightbox-gallery]';
  var singleSelector = '[data-site-lightbox-single]';
  var readyAttribute = 'data-site-lightbox-ready';
  var currentItems = [];
  var currentIndex = 0;
  var imageRequest = 0;
  var lastTrigger = null;
  var touchStartX = 0;

  function isInsidePage(element) {
    return Boolean(element && element.closest('main, #mr-content, .site-main'));
  }

  function parseLargestSrcset(srcset) {
    if (!srcset) return '';
    return srcset
      .split(',')
      .map(function (candidate) {
        var parts = candidate.trim().split(/\s+/);
        var descriptor = parts[parts.length - 1] || '';
        return {
          src: parts[0] || '',
          score: /w$/.test(descriptor) ? parseInt(descriptor, 10) || 0 : /x$/.test(descriptor) ? (parseFloat(descriptor) || 0) * 1000 : 0,
        };
      })
      .filter(function (candidate) { return candidate.src; })
      .sort(function (a, b) { return b.score - a.score; })[0]?.src || '';
  }

  function fullSource(trigger) {
    var image = trigger.matches('img') ? trigger : trigger.querySelector('img');
    if (!image) return '';
    var pictureSources = image.closest('picture') ? Array.from(image.closest('picture').querySelectorAll('source[srcset]')) : [];
    var candidates = [
      trigger.getAttribute('data-full'),
      image.getAttribute('data-full'),
      parseLargestSrcset(image.getAttribute('srcset')),
      ...pictureSources.map(function (source) { return parseLargestSrcset(source.getAttribute('srcset')); }),
      image.currentSrc,
      image.getAttribute('src'),
      image.getAttribute('data-src'),
    ];
    return candidates.find(Boolean) || '';
  }

  function captionFor(trigger) {
    var image = trigger.matches('img') ? trigger : trigger.querySelector('img');
    var figure = trigger.closest('figure');
    var article = trigger.closest('[data-gallery-item]');
    var caption = figure?.querySelector('figcaption')?.textContent || article?.querySelector('p')?.textContent || image?.getAttribute('alt') || '';
    return caption.trim();
  }

  function validTrigger(element) {
    if (!element || !isInsidePage(element) || element.closest('[data-site-lightbox="false"]')) return false;
    if (element.matches('button[data-full]')) return Boolean(element.querySelector('img'));
    if (element.matches(singleSelector)) return Boolean(element.matches('img') || element.querySelector('img'));
    if (element.matches('img') && element.closest(gallerySelector)) {
      return !element.closest('a[href], button:not([data-full])');
    }
    return false;
  }

  function triggerFromTarget(target) {
    if (!(target instanceof Element) || target.closest('.site-lightbox')) return null;
    var button = target.closest('button[data-full]');
    if (validTrigger(button)) return button;
    var single = target.closest(singleSelector);
    if (validTrigger(single)) return single;
    var image = target.closest(gallerySelector + ' img');
    return validTrigger(image) ? image : null;
  }

  function galleryItems(trigger) {
    var root = trigger.closest(gallerySelector);
    var candidates;
    if (root) {
      candidates = Array.from(root.querySelectorAll('button[data-full], ' + singleSelector + ', img'));
    } else if (trigger.matches('button[data-full]')) {
      var section = trigger.closest('section') || trigger.parentElement;
      candidates = Array.from(section.querySelectorAll('button[data-full]'));
    } else {
      candidates = [trigger];
    }

    var seen = new Set();
    return candidates
      .filter(function (candidate) {
        if (candidate.matches('img') && candidate.closest('button[data-full], ' + singleSelector)) return false;
        if (!validTrigger(candidate)) return false;
        var src = fullSource(candidate);
        if (!src || seen.has(src)) return false;
        seen.add(src);
        return true;
      })
      .map(function (candidate) {
        return { element: candidate, src: fullSource(candidate), caption: captionFor(candidate) };
      });
  }

  function createLightbox() {
    var element = document.createElement('div');
    element.className = 'site-lightbox';
    element.id = 'siteLightbox';
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
    element.setAttribute('aria-label', 'Bildvorschau');
    element.setAttribute('aria-hidden', 'true');
    element.innerHTML = '<div class="site-lightbox__stage">' +
      '<button class="site-lightbox__close" type="button" aria-label="Bildvorschau schließen">×</button>' +
      '<button class="site-lightbox__prev" type="button" aria-label="Vorheriges Bild">‹</button>' +
      '<img class="site-lightbox__image" alt="" decoding="async">' +
      '<button class="site-lightbox__next" type="button" aria-label="Nächstes Bild">›</button>' +
      '<div class="site-lightbox__meta"><span class="site-lightbox__caption"></span><span class="site-lightbox__counter" aria-live="polite"></span></div>' +
      '</div>';
    document.body.appendChild(element);
    return element;
  }

  var lightbox = createLightbox();
  var stage = lightbox.querySelector('.site-lightbox__stage');
  var image = lightbox.querySelector('.site-lightbox__image');
  var caption = lightbox.querySelector('.site-lightbox__caption');
  var counter = lightbox.querySelector('.site-lightbox__counter');
  var closeButton = lightbox.querySelector('.site-lightbox__close');
  var previousButton = lightbox.querySelector('.site-lightbox__prev');
  var nextButton = lightbox.querySelector('.site-lightbox__next');

  function setItem(index) {
    if (!currentItems.length) return;
    currentIndex = (index + currentItems.length) % currentItems.length;
    var item = currentItems[currentIndex];
    var request = ++imageRequest;
    image.classList.remove('is-ready');
    image.alt = item.caption || 'Vergrößerte Bildansicht';
    caption.textContent = item.caption;
    counter.textContent = String(currentIndex + 1).padStart(2, '0') + ' / ' + String(currentItems.length).padStart(2, '0');
    previousButton.hidden = currentItems.length < 2;
    nextButton.hidden = currentItems.length < 2;
    var preload = new Image();
    preload.onload = function () {
      if (request !== imageRequest) return;
      image.src = preload.src;
      requestAnimationFrame(function () { image.classList.add('is-ready'); });
    };
    preload.src = item.src;
  }

  function open(trigger) {
    currentItems = galleryItems(trigger);
    if (!currentItems.length) return;
    var triggerIndex = currentItems.findIndex(function (item) { return item.element === trigger; });
    lastTrigger = trigger;
    setItem(triggerIndex < 0 ? 0 : triggerIndex);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('site-lightbox-open');
    closeButton.focus({ preventScroll: true });
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('site-lightbox-open');
    image.classList.remove('is-ready');
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: true });
  }

  function prepare(element) {
    if (!validTrigger(element) || element.hasAttribute(readyAttribute)) return;
    element.setAttribute(readyAttribute, 'true');
    element.classList.add('site-lightbox-trigger');
    if (!element.matches('button, a, input, select, textarea, [tabindex]')) {
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
    }
    if (!element.getAttribute('aria-label')) {
      var label = captionFor(element);
      element.setAttribute('aria-label', (label ? label + ' – ' : '') + 'Bild vergrößern');
    }
  }

  function prepareAll(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('main button[data-full], #mr-content button[data-full], ' + singleSelector + ', ' + gallerySelector + ' img').forEach(prepare);
  }

  document.addEventListener('click', function (event) {
    var trigger = triggerFromTarget(event.target);
    if (!trigger) return;
    event.preventDefault();
    open(trigger);
  });

  document.addEventListener('keydown', function (event) {
    if (lightbox.classList.contains('is-open')) {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowLeft') setItem(currentIndex - 1);
      else if (event.key === 'ArrowRight') setItem(currentIndex + 1);
      return;
    }
    if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof Element && event.target.hasAttribute(readyAttribute)) {
      event.preventDefault();
      open(event.target);
    }
  });

  closeButton.addEventListener('click', close);
  previousButton.addEventListener('click', function () { setItem(currentIndex - 1); });
  nextButton.addEventListener('click', function () { setItem(currentIndex + 1); });
  lightbox.addEventListener('click', function (event) { if (event.target === lightbox) close(); });
  stage.addEventListener('touchstart', function (event) { touchStartX = event.changedTouches[0]?.clientX || 0; }, { passive: true });
  stage.addEventListener('touchend', function (event) {
    var distance = (event.changedTouches[0]?.clientX || 0) - touchStartX;
    if (Math.abs(distance) < 50 || currentItems.length < 2) return;
    setItem(distance > 0 ? currentIndex - 1 : currentIndex + 1);
  }, { passive: true });

  prepareAll(document);
  var pendingPreparation = false;
  new MutationObserver(function () {
    if (pendingPreparation) return;
    pendingPreparation = true;
    requestAnimationFrame(function () {
      pendingPreparation = false;
      prepareAll(document);
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
