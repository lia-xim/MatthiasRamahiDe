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

// Index strip — smooth scroll + active state
  (function(){
    const links = document.querySelectorAll('.pf-index a');
    const sections = Array.from(links).map(function(a){
      const id = a.getAttribute('href').slice(1);
      return document.getElementById(id);
    });
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Smooth scroll on click (custom easing, ~1.1s)
    function scrollTo(target){
      const topbar = document.getElementById('topbar');
      const offset = topbar ? topbar.getBoundingClientRect().height : 64;
      const startY = scrollY;
      const endY = Math.max(0, target.getBoundingClientRect().top + scrollY - offset - 4);
      if(reduced){ window.scrollTo(0, endY); return; }
      const dist = endY - startY;
      const dur = Math.min(1400, Math.max(700, Math.abs(dist) * 0.45));
      const t0 = performance.now();
      function ease(t){ return t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 3)/2; }
      function step(now){
        const t = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, startY + dist * ease(t));
        if(t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    links.forEach(function(a, i){
      a.addEventListener('click', function(ev){
        const target = sections[i];
        if(!target) return;
        ev.preventDefault();
        scrollTo(target);
        history.replaceState(null, '', a.getAttribute('href'));
      });
    });

    function update(){
      const y = scrollY + innerHeight * 0.35;
      let active = -1;
      sections.forEach(function(s, i){
        if(s && s.offsetTop <= y) active = i;
      });
      links.forEach(function(a, i){ a.classList.toggle('is-active', i === active); });
    }
    addEventListener('scroll', update, { passive: true });
    update();
  })();

// Lightbox
  (function(){
    const viewer = document.getElementById('pfViewer');
    const img = document.getElementById('pfViewerImg');
    const cap = document.getElementById('pfViewerCap');
    const close = document.getElementById('pfClose');
    const prev = document.getElementById('pfPrev');
    const next = document.getElementById('pfNext');
    const photos = Array.from(document.querySelectorAll('.pf-photo'));
    let idx = 0;

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
