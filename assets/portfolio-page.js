// Fade-in on view + fast-scroll lazy-image promoter
  (function(){
    const spreads = document.querySelectorAll('.pf-spread');
    if(!('IntersectionObserver' in window)){
      spreads.forEach(function(s){ s.classList.add('is-visible'); });
    } else {
      const io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
        });
      }, { threshold: 0.01, rootMargin: '200px 0px 200px 0px' });
      spreads.forEach(function(s){ io.observe(s); });
    }

    const galleryImgs = Array.from(document.querySelectorAll('.pf-spread img, .pf-archive__grid img'));
    if (!galleryImgs.length) return;

    function promoteImage(img) {
      if (img.loading === 'lazy') {
        img.loading = 'eager';
      }
      // Recover images whose fetch was aborted during an aggressive fast scroll
      if (img.complete && img.naturalWidth === 0 && img.dataset.mrScrollRetry !== '1') {
        const retrySrc = img.currentSrc || img.getAttribute('src');
        if (retrySrc) {
          img.dataset.mrScrollRetry = '1';
          img.src = retrySrc;
        }
      }
    }

    if ('IntersectionObserver' in window) {
      const imgObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (!entry.isIntersecting) return;
          imgObserver.unobserve(entry.target);
          promoteImage(entry.target);
        });
      }, { rootMargin: '1400px 0px 1400px 0px' });
      galleryImgs.forEach(function(img){ imgObserver.observe(img); });
    } else {
      galleryImgs.forEach(promoteImage);
    }

    function promoteNearViewport() {
      const vh = window.innerHeight || document.documentElement.clientHeight || 900;
      const topLimit = -600;
      const bottomLimit = vh + 1400;
      galleryImgs.forEach(function(img){
        if (img.complete && img.naturalWidth > 0) return;
        const rect = img.getBoundingClientRect();
        if (rect.bottom >= topLimit && rect.top <= bottomLimit) {
          promoteImage(img);
        }
      });
    }

    let scrollTimer = 0;
    function schedulePromote() {
      if (scrollTimer) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(promoteNearViewport, 120);
    }

    window.addEventListener('scroll', schedulePromote, { passive: true });
    if ('onscrollend' in window) {
      window.addEventListener('scrollend', promoteNearViewport, { passive: true });
    }
    window.addEventListener('resize', schedulePromote, { passive: true });
    document.addEventListener('visibilitychange', function(){
      if (!document.hidden) promoteNearViewport();
    });
    promoteNearViewport();
  })();

// Lightbox
  (function(){
    const viewer = document.getElementById('pfViewer');
    const img = document.getElementById('pfViewerImg');
    const cap = document.getElementById('pfViewerCap');
    const close = document.getElementById('pfClose');
    const prev = document.getElementById('pfPrev');
    const next = document.getElementById('pfNext');
    // Lightbox nur im Archiv — die Genre-Spreads sind jetzt ganz klickbar (Vorschau ohne Zoom).
    const photos = Array.from(document.querySelectorAll('.pf-archive__grid .pf-photo'));
    const emptySrc = img ? img.getAttribute('src') : '';
    const fullImageCache = new Map();
    let idx = 0;
    let loadToken = 0;
    let returnFocus = null;
    let previousOverflow = '';
    if (!viewer || !photos.length) return;

    function preloadFullImage(src){
      if(fullImageCache.has(src)) return fullImageCache.get(src);
      const pending = new Promise(function(resolve){
        const preloadImage = new Image();
        let settled = false;
        function finish(ok){
          if(settled) return;
          settled = true;
          resolve(ok);
        }
        function decoded(){
          if(preloadImage.decode){
            preloadImage.decode().then(function(){ finish(true); }).catch(function(){ finish(preloadImage.naturalWidth > 0); });
          } else finish(true);
        }
        preloadImage.onload = decoded;
        preloadImage.onerror = function(){ finish(false); };
        preloadImage.src = src;
        if(preloadImage.complete && preloadImage.naturalWidth > 0) decoded();
      });
      fullImageCache.set(src, pending);
      return pending;
    }

    async function open(i){
      const targetIdx = (i + photos.length) % photos.length;
      const a = photos[targetIdx];
      const src = a.getAttribute('href');
      const request = ++loadToken;
      viewer.setAttribute('aria-busy', 'true');
      const loaded = await preloadFullImage(src);
      if(request !== loadToken) return;
      viewer.removeAttribute('aria-busy');
      if(!loaded) return;
      idx = targetIdx;
      img.src = src;
      img.alt = a.querySelector('img').alt || '';
      cap.textContent = a.dataset.caption || '';
      if(img.decode){ try { await img.decode(); } catch(e){} }
      if(request !== loadToken) return;
      const wasOpen = viewer.classList.contains('is-open');
      if (!wasOpen) {
        returnFocus = document.activeElement;
        previousOverflow = document.body.style.overflow;
      }
      viewer.classList.add('is-open');
      viewer.setAttribute('aria-hidden', 'false');
      viewer.removeAttribute('inert');
      document.body.style.overflow = 'hidden';
      if (!wasOpen) close.focus({ preventScroll: true });
    }
    function closeViewer(){
      loadToken += 1;
      viewer.classList.remove('is-open');
      viewer.setAttribute('aria-hidden', 'true');
      viewer.setAttribute('inert', '');
      viewer.removeAttribute('aria-busy');
      img.src = emptySrc;
      img.alt = '';
      cap.textContent = '';
      document.body.style.overflow = previousOverflow;
      if (returnFocus instanceof HTMLElement) returnFocus.focus({ preventScroll: true });
    }
    photos.forEach(function(a, i){
      a.addEventListener('click', function(e){ e.preventDefault(); open(i); });
      a.addEventListener('pointerenter', function(){ preloadFullImage(a.getAttribute('href')); }, { once: true });
      a.addEventListener('focus', function(){ preloadFullImage(a.getAttribute('href')); }, { once: true });
    });
    close.addEventListener('click', closeViewer);
    prev.addEventListener('click', function(){ open(idx - 1); });
    next.addEventListener('click', function(){ open(idx + 1); });
    viewer.addEventListener('click', function(e){ if(e.target === viewer) closeViewer(); });
    (function(){
      var tx = 0, ty = 0;
      viewer.style.touchAction = 'pan-y';
      viewer.addEventListener('touchstart', function(e){ if(e.touches && e.touches[0]){ tx = e.touches[0].clientX; ty = e.touches[0].clientY; } }, { passive: true });
      viewer.addEventListener('touchend', function(e){
        if(!viewer.classList.contains('is-open') || !e.changedTouches || !e.changedTouches[0]) return;
        var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
        if(Math.abs(dx) >= 42 && Math.abs(dx) > Math.abs(dy) * 1.2){ dx < 0 ? open(idx + 1) : open(idx - 1); }
      }, { passive: true });
    })();
    addEventListener('keydown', function(e){
      if(!viewer.classList.contains('is-open')) return;
      if(e.key === 'Tab') {
        const controls = [close, prev, next];
        const current = controls.indexOf(document.activeElement);
        e.preventDefault();
        controls[(current + (e.shiftKey ? 2 : 1)) % controls.length].focus();
      }
      if(e.key === 'Escape') closeViewer();
      else if(e.key === 'ArrowRight') open(idx + 1);
      else if(e.key === 'ArrowLeft') open(idx - 1);
    });
  })();
