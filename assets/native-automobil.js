(function(){
  /* lazy fade */
  function bindLazy(){
    document.querySelectorAll('img[loading="lazy"]').forEach(function(img){
      if(img.dataset.lzbound) return; img.dataset.lzbound='1';
      if(img.complete && img.naturalWidth>0){ img.classList.add('is-loaded'); return; }
      img.addEventListener('load', function(){ img.classList.add('is-loaded'); }, {once:true});
    });
  }
  bindLazy();

  /* ============ HERO — PRINT DEVELOP (auto-cycle, video atmosphere) ============ */
  (function(){
    var hero = document.querySelector('.hero-pd');
    if(!hero) return;
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    var a = document.getElementById('pdFrameA');
    var b = document.getElementById('pdFrameB');
    if(!a || !b) return;

    var desktopPool = [
      'assets/optimized/mpjpgo2b-dsc3032-generase-1-1920.webp',
      'assets/optimized/mpjpgq5s-dsc2316-1920.webp',
      'assets/optimized/mpjpgsdt-dsc2310-1920.webp',
      'assets/optimized/mpjpgu5f-dsc3892-1920.webp'
    ];
    var mobilePool = [
      'assets/optimized/mpjpgo2b-dsc3032-generase-1-1280.webp',
      'assets/optimized/mpjpgq5s-dsc2316-1280.webp',
      'assets/optimized/mpjpgsdt-dsc2310-1280.webp',
      'assets/optimized/mpjpgu5f-dsc3892-1280.webp'
    ];
    var POOL = matchMedia('(max-width:900px)').matches ? mobilePool : desktopPool;

    // preload images quietly so each develop-in starts from cache
    POOL.forEach(function(src){ var i=new Image(); i.src=src; });

    function setFrameImage(frame, src){
      var inner = frame.querySelector('.pd-frame-inner');
      if(inner) inner.style.backgroundImage = "url('" + src + "')";
    }
    function setInkOrigin(frame){
      // bias origin toward the lower-left / right thirds for cinematic feel
      var cx = 24 + Math.random()*52;   // 24–76 %
      var cy = 32 + Math.random()*42;   // 32–74 %
      frame.style.setProperty('--cx', cx + '%');
      frame.style.setProperty('--cy', cy + '%');
    }

    // First frame is rendered in HTML so LCP does not wait for deferred JS.
    if(!a.classList.contains('is-in')){
      setFrameImage(a, POOL[0]);
      setInkOrigin(a);
      void a.offsetWidth;
      a.classList.add('is-in');
    }

    if(reduce){ return; } // single static frame is enough for reduced-motion

    var idx = 0;             // index of currently-developed frame's image
    var active = a;          // currently visible / developing frame
    var standby = b;         // about to develop next

    // cycle interval: develop ~5.4s, hold ~7s -> swap every ~12400ms
    var CYCLE_MS = 12400;

    function tick(){
      idx = (idx + 1) % POOL.length;
      // swap roles
      var tmp = active; active = standby; standby = tmp;
      active.classList.remove('is-in');
      setFrameImage(active, POOL[idx]);
      setInkOrigin(active);
      // force reflow so re-applying class re-triggers animation
      void active.offsetWidth;
      // bring active to top so its develop-in covers the previous frame
      active.style.zIndex = 2;
      standby.style.zIndex = 1;
      active.classList.add('is-in');
      // after animation completes, clear the standby frame to free repaint cost
      setTimeout(function(){
        if(standby !== active){
          standby.classList.remove('is-in');
          standby.style.opacity = '';
        }
      }, 6400);
    }

    // staggered start so the second frame doesn't overlap the first too soon
    setTimeout(function intervalLoop(){
      tick();
      setTimeout(intervalLoop, CYCLE_MS);
    }, CYCLE_MS);

    // gentle "re-develop pulse" — every ~16-22s a tiny secondary develop pass on the active frame
    function rePulse(){
      if(reduce) return;
      var delay = 16000 + Math.random()*6000;
      setTimeout(function(){
        // re-trigger develop on active frame (subtle: filter sweep, no full re-animation)
        var el = active;
        if(!el) { rePulse(); return; }
        el.animate([
          { filter: 'brightness(1) saturate(1) sepia(0) contrast(1)' },
          { filter: 'brightness(1.18) saturate(.55) sepia(.18) contrast(.92)' },
          { filter: 'brightness(1) saturate(1) sepia(0) contrast(1)' }
        ], { duration: 1400, easing: 'cubic-bezier(.4,0,.2,1)' });
        rePulse();
      }, delay);
    }
    rePulse();

  })();

  /* ===== legacy shader block removed ===== */

  /* ============ BENTO GRID reveal + lightbox ============ */
  (function(){
    var list = document.getElementById('bgGrid');
    if(!list) return;
    var tiles = Array.prototype.slice.call(list.querySelectorAll('.bg-tile'));
    if(!tiles.length) return;

    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(reduce){
      tiles.forEach(function(t){ t.classList.add('is-in'); });
    } else if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            var i = tiles.indexOf(e.target);
            setTimeout(function(){ e.target.classList.add('is-in'); }, 80 * (i<0?0:i));
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
      tiles.forEach(function(t){ io.observe(t); });
    } else {
      tiles.forEach(function(t){ t.classList.add('is-in'); });
    }

    var IMAGES = tiles.map(function(t){
      var img = t.querySelector('img');
      return {
        src: t.getAttribute('data-full') || img.getAttribute('data-full') || img.getAttribute('data-src') || img.getAttribute('src'),
        alt: img.getAttribute('alt') || ''
      };
    });

    var lb       = document.getElementById('lightbox');
    var lbImg    = document.getElementById('lbImg');
    var lbCount  = document.getElementById('lbCounter');
    var lbClose  = document.getElementById('lbClose');
    var lbPrev   = document.getElementById('lbPrev');
    var lbNext   = document.getElementById('lbNext');
    if(!lb || !lbImg) return;
    var cur = 0;

    function setImg(i){
      cur = (i + IMAGES.length) % IMAGES.length;
      lbImg.classList.remove('show');
      var pre = new Image();
      pre.onload = function(){
        lbImg.src = pre.src;
        lbImg.alt = IMAGES[cur].alt;
        requestAnimationFrame(function(){ lbImg.classList.add('show'); });
      };
      pre.src = IMAGES[cur].src;
      lbCount.textContent = String(cur+1).padStart(2,'0') + ' / ' + String(IMAGES.length).padStart(2,'0');
    }
    function open(i){
      setImg(i);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      lbImg.classList.remove('show');
    }

    tiles.forEach(function(tile, i){
      tile.addEventListener('click', function(ev){ ev.preventDefault(); open(i); });
    });
    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', function(){ setImg(cur-1); });
    lbNext.addEventListener('click', function(){ setImg(cur+1); });
    lb.addEventListener('click', function(e){ if(e.target === lb) close(); });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape') close();
      else if(e.key === 'ArrowLeft') setImg(cur-1);
      else if(e.key === 'ArrowRight') setImg(cur+1);
    });
  })();

  /* ============ SWITCH-STAGE — Auto-Cycle + Tab Click ============ */
  (function(){
    var stage = document.getElementById('swStage');
    if(!stage) return;
    var tabs   = Array.prototype.slice.call(document.querySelectorAll('.sw-tab'));
    var frames = Array.prototype.slice.call(stage.querySelectorAll('.frame'));
    var title  = document.getElementById('swTitle');
    var body   = document.getElementById('swBody');
    var list   = document.getElementById('swList');
    var desc   = document.getElementById('swDesc');
    var fill   = document.getElementById('swFill');
    var prog   = document.getElementById('swProgress');

    var DATA = [
      {label:'Exterieur', title:'Vollformat, ruhige Linien.',
       body:'Außenaufnahmen mit kontrolliertem Licht und ruhigen Reflexen. Lack, Proportionen und Linienführung wirken stimmig — Showroom, Industrie oder urbanes Setting.',
       list:['Showroom & Location','Architektur & Industrie','Tages- und Nachtlicht']},
      {label:'Interieur', title:'Cockpit, Sitz, Material.',
       body:'Innenraum mit mobilem Licht inszeniert. Leder, Carbon und Chrom behalten ihren Ton — der Innenraum spricht dieselbe Sprache wie das Exterieur.',
       list:['Cockpit & Lenkrad','Materialien & Naht','Lichtstimmung im Raum']},
      {label:'Details', title:'Emblem, Felge, Naht.',
       body:'Sicken, Felgen, Bremsen, Schalter, Logos. Detailaufnahmen erzählen die Geschichte eines Fahrzeugs im Kleinen — perfekt für Händlerseiten, Landingpages, Magazinstrecken.',
       list:['Emblem & Lackdetail','Felge & Bremse','Naht & Material']},
      {label:'Cinematic', title:'Architektur, Licht, Dramaturgie.',
       body:'Inszenierte Perspektiven mit gesetztem Licht und gewählter Architektur. Bilder mit Filmcharakter — für Kampagne, Magazin und Bildstrecken, die Stimmung tragen.',
       list:['Nachtaufnahmen','Architektur als Bühne','Kampagnen-Look']}
    ];

    var CYCLE_MS = 6000;
    var TICK_MS  = 80;
    var cur = 0, paused = false, tickerId = null, elapsed = 0;

    function setActive(i){
      i = ((i % DATA.length) + DATA.length) % DATA.length;
      cur = i;
      frames.forEach(function(f, idx){ f.classList.toggle('is-active', idx === i); });
      tabs.forEach(function(t, idx){ t.setAttribute('aria-selected', idx === i ? 'true' : 'false'); });
      var d = DATA[i];
      // restart description stagger
      var groups = desc.querySelectorAll('.group');
      groups.forEach(function(g){ g.classList.remove('is-in'); });
      // swap text on next frame so the fade-out registers
      requestAnimationFrame(function(){
        title.textContent  = d.title;
        body.textContent   = d.body;
        if(list){ list.innerHTML = d.list.map(function(item){ return '<li>'+item+'</li>'; }).join(''); }
        requestAnimationFrame(function(){
          groups.forEach(function(g){ g.classList.add('is-in'); });
        });
      });
      resetProgress();
    }

    function resetProgress(){ elapsed = 0; if(fill) fill.style.width = '0%'; }

    function tick(){
      if(paused) return;
      elapsed += TICK_MS;
      var pct = Math.min(100, (elapsed / CYCLE_MS) * 100);
      if(fill) fill.style.width = pct + '%';
      if(elapsed >= CYCLE_MS){ setActive(cur + 1); }
    }

    function start(){ stop(); tickerId = setInterval(tick, TICK_MS); }
    function stop(){ if(tickerId){ clearInterval(tickerId); tickerId = null; } }
    function pause(){ paused = true; if(prog) prog.classList.add('is-paused'); }
    function resume(){ paused = false; if(prog) prog.classList.remove('is-paused'); }

    tabs.forEach(function(t, idx){
      t.addEventListener('click', function(){ setActive(idx); resume(); });
      t.addEventListener('mouseenter', pause);
      t.addEventListener('mouseleave', resume);
      t.addEventListener('focus', pause);
      t.addEventListener('blur', resume);
    });
    stage.addEventListener('mouseenter', pause);
    stage.addEventListener('mouseleave', resume);

    var reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(!reduced){ start(); } else { resetProgress(); }
  })();
})();
