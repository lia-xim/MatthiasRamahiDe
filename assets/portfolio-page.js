// Fade-in on view
  (function(){
    const spreads = document.querySelectorAll('.pf-spread');
    if(!('IntersectionObserver' in window)){
      spreads.forEach(function(s){ s.classList.add('is-visible'); });
      return;
    }
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    spreads.forEach(function(s){ io.observe(s); });

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
      viewer.classList.add('is-open');
      viewer.setAttribute('aria-hidden', 'false');
      viewer.removeAttribute('inert');
      document.body.style.overflow = 'hidden';
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
      document.body.style.overflow = '';
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
    addEventListener('keydown', function(e){
      if(!viewer.classList.contains('is-open')) return;
      if(e.key === 'Escape') closeViewer();
      else if(e.key === 'ArrowRight') open(idx + 1);
      else if(e.key === 'ArrowLeft') open(idx - 1);
    });
  })();
