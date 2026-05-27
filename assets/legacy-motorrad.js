(function(){
  function bindLazy(){
    document.querySelectorAll('img[loading="lazy"]').forEach(function(img){
      if(img.dataset.lzbound) return; img.dataset.lzbound='1';
      if(img.complete && img.naturalWidth>0){ img.classList.add('is-loaded'); return; }
      img.addEventListener('load', function(){ img.classList.add('is-loaded'); }, {once:true});
    });
  }
  bindLazy();

  /* ═══════════════════════════════════════════════════════════════
     HERO — FOCUS RIG controller (vereinfacht)
     Keine rAF-Loop, kein cursor-getriebener Fokus. Statische Iris-Maske
     vermeidet Repaint-Artefakte. Nur Slide-Wechsel + Reveal.
     ─────────────────────────────────────────────────────────────── */
  (function(){
    var hero = document.querySelector('.hero-mr');
    if(!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-mr__slide'));
    var firstImg = slides[0] && slides[0].querySelector('.hero-mr__sharp');
    var dotsEl = document.getElementById('heroMrDots');
    var edgeEl = document.getElementById('heroMrEdge');
    var dots = dotsEl ? Array.prototype.slice.call(dotsEl.querySelectorAll('button')) : [];
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    var current = 0;
    var transitioning = false;
    var timer = null;
    var revealed = false;
    var SLIDE_MS = 8200;

    function decodeImage(img){
      function decodeNow(){ return img.decode ? img.decode().catch(function(){}) : Promise.resolve(); }
      if(img.complete) return img.naturalWidth > 0 ? decodeNow() : Promise.resolve();
      return new Promise(function(resolve){
        img.addEventListener('load', function(){ decodeNow().then(resolve); }, {once:true});
        img.addEventListener('error', resolve, {once:true});
      });
    }

    var slideReady = slides.map(function(slide){
      var imgs = Array.prototype.slice.call(slide.querySelectorAll('img'));
      return Promise.all(imgs.map(decodeImage));
    });
    var allReady = Promise.all(slideReady);

    function setDots(idx){
      dots.forEach(function(dot, i){ dot.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
    }

    function fireEdge(){
      if(!edgeEl || reduce) return;
      edgeEl.classList.remove('is-wipe');
      // force reflow so the animation restarts cleanly
      void edgeEl.offsetWidth;
      edgeEl.classList.add('is-wipe');
    }

    function activateSlide(idx){
      if(idx === current || transitioning) return;
      var prevIdx = current;
      current = idx;
      transitioning = true;

      var prev = slides[prevIdx];
      var next = slides[idx];

      // Mark previous as "still visible underneath" until wipe completes.
      prev.classList.remove('is-active');
      prev.classList.add('is-prev');

      // Activating triggers clip-path transition from inset(0 0 0 100%) → inset(0 0 0 0).
      next.classList.add('is-active');

      fireEdge();
      setDots(idx);

      var done = function(ev){
        if(ev && ev.propertyName && ev.propertyName !== 'clip-path') return;
        next.removeEventListener('transitionend', done);
        prev.classList.remove('is-prev');
        transitioning = false;
      };
      next.addEventListener('transitionend', done);
      // Safety net if transitionend fails to fire (e.g. tab hidden).
      setTimeout(done, 1300);
    }

    function nextSlide(){
      var idx = (current + 1) % slides.length;
      slideReady[idx].then(function(){ if(!document.hidden) activateSlide(idx); });
    }
    function jump(idx){
      if(idx === current) return;
      slideReady[idx].then(function(){ activateSlide(idx); });
    }

    dots.forEach(function(dot, idx){
      dot.addEventListener('click', function(ev){ ev.preventDefault(); jump(idx); });
    });

    function startCycle(){
      if(reduce || timer) return;
      allReady.then(function(){
        if(revealed && !timer && !document.hidden) timer = setInterval(nextSlide, SLIDE_MS);
      });
    }
    function stopCycle(){ if(timer){ clearInterval(timer); timer = null; } }

    function reveal(){
      if(revealed) return;
      revealed = true;
      requestAnimationFrame(function(){
        hero.classList.add('is-on');
        var title = document.getElementById('heroMrTitle');
        if(title) setTimeout(function(){ title.classList.add('is-in'); }, reduce ? 0 : 220);
        setDots(0);
        if(!reduce) startCycle();
      });
    }

    if(firstImg){
      if(firstImg.complete && firstImg.naturalWidth > 0) reveal();
      else {
        firstImg.addEventListener('load', reveal, {once:true});
        firstImg.addEventListener('error', reveal, {once:true});
      }
    }
    setTimeout(reveal, 900);

    document.addEventListener('visibilitychange', function(){
      if(document.hidden) stopCycle();
      else if(revealed && !reduce) startCycle();
    });
  })();

  (function(){
    var grid = document.getElementById('poGrid');
    if(!grid) return;
    var tiles = Array.prototype.slice.call(grid.querySelectorAll('.po-tile'));
    if(!tiles.length) return;
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(reduce){ tiles.forEach(function(t){ t.classList.add('is-in'); }); }
    else if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            tiles.forEach(function(t,i){ setTimeout(function(){ t.classList.add('is-in'); }, 80*i); });
            io.disconnect();
          }
        });
      }, { rootMargin:'0px 0px -10% 0px', threshold:.05 });
      io.observe(grid);
    } else { tiles.forEach(function(t){ t.classList.add('is-in'); }); }

    var IMAGES = tiles.map(function(t){ var img=t.querySelector('img'); return { src:img.getAttribute('src'), alt:img.getAttribute('alt')||'' }; });
    var lb=document.getElementById('lightbox'), lbImg=document.getElementById('lbImg'),
        lbCount=document.getElementById('lbCounter'), lbClose=document.getElementById('lbClose'),
        lbPrev=document.getElementById('lbPrev'), lbNext=document.getElementById('lbNext');
    if(!lb||!lbImg) return;
    var cur=0;
    function setImg(i){
      cur=(i+IMAGES.length)%IMAGES.length;
      lbImg.classList.remove('show');
      var pre=new Image();
      pre.onload=function(){ lbImg.src=pre.src; lbImg.alt=IMAGES[cur].alt; requestAnimationFrame(function(){ lbImg.classList.add('show'); }); };
      pre.src=IMAGES[cur].src;
      lbCount.textContent=String(cur+1).padStart(2,'0')+' / '+String(IMAGES.length).padStart(2,'0');
    }
    function open(i){ setImg(i); lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
    function close(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); document.body.style.overflow=''; lbImg.classList.remove('show'); }
    tiles.forEach(function(tile,i){ tile.addEventListener('click', function(ev){ ev.preventDefault(); open(i); }); });
    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', function(){ setImg(cur-1); });
    lbNext.addEventListener('click', function(){ setImg(cur+1); });
    lb.addEventListener('click', function(e){ if(e.target===lb) close(); });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key==='Escape') close();
      else if(e.key==='ArrowLeft') setImg(cur-1);
      else if(e.key==='ArrowRight') setImg(cur+1);
    });
  })();
})();
