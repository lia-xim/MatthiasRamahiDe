(function(){
  function bindLazy(){
    document.querySelectorAll('img[loading="lazy"]').forEach(function(img){
      if(img.dataset.lzbound) return; img.dataset.lzbound='1';
      if(img.complete && img.naturalWidth>0){ img.classList.add('is-loaded'); return; }
      img.addEventListener('load', function(){ img.classList.add('is-loaded'); }, {once:true});
    });
  }
  bindLazy();

  /* Oldtimer hero — crossfade Slideshow.
     EINE setInterval-Quelle toggelt nur die is-active Klasse. Ken Burns,
     Soft-Focus-Iris-Drift und Bokeh-Drift laufen als CSS-Loops, daher kein
     JS rAF, keine Multi-Element-Sync. Reduced-motion friert auf Slide 0. */
  (function(){
    var stage = document.getElementById('oldtimerSlides');
    if(!stage) return;
    var slides = Array.prototype.slice.call(stage.querySelectorAll('.hero-mp__slide'));
    if(slides.length < 2) return;
    var total = slides.length;
    var idx = 0;
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    var bokeh = document.querySelector('.hero-mp__bokeh');

    function applyBackground(slide){
      if(!slide || slide.style.backgroundImage) return;
      var bg = slide.getAttribute('data-bg');
      if(bg) slide.style.backgroundImage = "url('" + bg + "')";
    }
    function hydrateInactiveSlides(){
      slides.forEach(function(s, i){ if(i !== idx) applyBackground(s); });
    }
    function idle(callback, timeout){
      if('requestIdleCallback' in window) requestIdleCallback(callback, { timeout: timeout });
      else setTimeout(callback, Math.min(timeout, 1200));
    }
    function delayedIdle(callback, delay){
      setTimeout(function(){ idle(callback, 1400); }, delay);
    }
    idle(hydrateInactiveSlides, 1800);

    if(reduce){
      if(bokeh){ try{ bokeh.pause(); }catch(_){} }
      return;
    }

    var INTERVAL = 7000, tickTimer = null;
    function step(){
      var next = (idx + 1) % total;
      var prevEl = slides[idx];
      var nextEl = slides[next];
      applyBackground(nextEl);
      // Ken-Burns-Endframe einfrieren: der aktuelle computed transform
      // wird inline gepinnt, damit der Slide nach Verlust von .is-active
      // (Animation-Regel fällt weg) NICHT auf scale(1) zurückspringt.
      // Dieser sichtbare „Reset kurz vor dem Wipe" ist sonst der Bug.
      var ct = getComputedStyle(prevEl).transform;
      prevEl.style.transform = (ct && ct !== 'none') ? ct : '';
      prevEl.classList.remove('is-active');
      prevEl.classList.add('is-prev');
      // Next-Slide: alte Inline-Pinnung von einer früheren Runde entfernen,
      // sonst startet die KB-Animation auf einem Reststand statt am 0%-Frame.
      nextEl.style.transform = '';
      nextEl.classList.add('is-active');
      // is-prev nach Wipe (1500ms) + Puffer entfernen und Inline-Pin freigeben
      setTimeout(function(){
        prevEl.classList.remove('is-prev');
        prevEl.style.transform = '';
      }, 1600);
      idx = next;
    }
    function play(){
      var heroMp = stage.closest('.hero-mp');
      if(heroMp) heroMp.classList.add('is-animated');
      if(!tickTimer) tickTimer = setInterval(step, INTERVAL);
      if(bokeh){ try{ bokeh.play(); }catch(_){} }
    }
    function pause(){
      if(tickTimer){ clearInterval(tickTimer); tickTimer = null; }
      if(bokeh){ try{ bokeh.pause(); }catch(_){} }
    }
    delayedIdle(function(){ if(!document.hidden) play(); }, 12000);

    document.addEventListener('visibilitychange', function(){
      if(document.hidden) pause(); else play();
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

    var IMAGES = tiles.map(function(t){ var img=t.querySelector('img'); return { src:t.getAttribute('data-full')||img.getAttribute('data-full')||img.getAttribute('data-src')||img.getAttribute('src'), alt:img.getAttribute('alt')||'' }; });
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
