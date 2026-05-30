// Fade-in on view
  (function(){
    if(!('IntersectionObserver' in window)) return;
    const spreads = document.querySelectorAll('.pf-spread');
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    spreads.forEach(function(s){ io.observe(s); });

    const tiles = document.querySelectorAll('.pf-archive__grid .pf-photo');
    const io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          const idx = Array.prototype.indexOf.call(tiles, e.target);
          e.target.style.transitionDelay = (Math.min(idx, 20) * 30) + 'ms';
          e.target.classList.add('is-shown');
          io2.unobserve(e.target);
        }
      });
    }, { threshold: 0.04 });
    tiles.forEach(function(t){ io2.observe(t); });
  })();

// Archiv: lädt schrittweise beim Scrollen nach. Die nächste Charge wird vorab
// geladen & dekodiert, SOLANGE sie noch versteckt ist — erst dann einblenden.
// Dadurch kein Weiß-Blitz / kein Nachlade-Ruckeln (rechte Spalte) beim Reveal.
  (function(){
    const grid = document.getElementById('pfArchiveGrid');
    if(!grid) return;
    const batch = Number(grid.getAttribute('data-archive-batch')) || 12;
    const hiddenItems = function(){ return Array.prototype.slice.call(grid.querySelectorAll('.pf-photo[hidden]')); };

    function preload(el){
      const img = el.querySelector('img');
      if(!img) return Promise.resolve();
      img.loading = 'eager';
      const ds = img.getAttribute('data-src');
      if(ds && !img.getAttribute('src')) img.setAttribute('src', ds);
      try { return img.decode ? img.decode().catch(function(){}) : Promise.resolve(); }
      catch(e){ return Promise.resolve(); }
    }

    if(!('IntersectionObserver' in window)){
      hiddenItems().forEach(function(el){ el.removeAttribute('hidden'); el.classList.add('is-shown'); });
      return;
    }

    let busy = false;

    function reveal(){
      const next = hiddenItems().slice(0, batch);
      if(!next.length) return Promise.resolve(0);
      // Erst dekodieren (noch hidden) …
      return Promise.all(next.map(preload)).then(function(){
        // … dann einblenden — die Bilder sind bereits fertig, kein Weiß.
        next.forEach(function(el, i){
          el.removeAttribute('hidden');
          el.style.transitionDelay = (i * 22) + 'ms';
          requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('is-shown'); }); });
        });
        return hiddenItems().length;
      });
    }

    const sentinel = document.createElement('div');
    sentinel.className = 'pf-archive__sentinel';
    sentinel.setAttribute('aria-hidden', 'true');
    grid.after(sentinel);

    // Füllt nach, solange der Sentinel im Vorlade-Bereich liegt; stoppt sonst.
    function pump(){
      if(busy) return;
      const r = sentinel.getBoundingClientRect();
      if(r.top > window.innerHeight + 800) return;
      busy = true;
      reveal().then(function(remaining){
        busy = false;
        if(remaining === 0){ io.disconnect(); sentinel.remove(); return; }
        pump();
      });
    }

    const io = new IntersectionObserver(function(entries){
      if(entries.some(function(e){ return e.isIntersecting; })) pump();
    }, { rootMargin: '800px 0px' });
    io.observe(sentinel);
    pump();
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
    let idx = 0;
    if (!viewer || !photos.length) return;

    function open(i){
      idx = (i + photos.length) % photos.length;
      const a = photos[idx];
      img.src = a.getAttribute('href');
      img.alt = a.querySelector('img').alt || '';
      cap.textContent = a.dataset.caption || '';
      viewer.classList.add('is-open');
      viewer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeViewer(){
      viewer.classList.remove('is-open');
      viewer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    photos.forEach(function(a, i){
      a.addEventListener('click', function(e){ e.preventDefault(); open(i); });
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
