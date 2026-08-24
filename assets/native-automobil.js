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
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var heroModeOverride = (function(){
      try {
        var params = new URLSearchParams(location.search);
        var mode = params.get('automobilHero') || params.get('hero') || localStorage.getItem('mrAutomobilHeroMode') || localStorage.getItem('mrHeroMode') || '';
        if(/^(static|lite)$/i.test(mode)) return 'static';
        if(/^(animated|shader|webgl)$/i.test(mode)) return 'animated';
      } catch(_) {}
      return '';
    })();
    var forceAnimated = heroModeOverride === 'animated';
    var staticHero = false;
    var pageVisible = !document.hidden;
    var heroInView = true;

    function parseHeroPool(value){
      return String(value || '').split('|').map(function(src){ return src.trim(); }).filter(Boolean);
    }
    var desktopPool = parseHeroPool(hero.dataset.heroImagesDesktop);
    var mobilePool = parseHeroPool(hero.dataset.heroImagesMobile);
    var fallbackDesktopPool = [
      'assets/optimized/mpjpgo2b-dsc3032-generase-1-1920.webp',
      'assets/optimized/mpjpgq5s-dsc2316-1920.webp',
      'assets/optimized/mpjpgsdt-dsc2310-1920.webp',
      'assets/optimized/mpjpgu5f-dsc3892-1920.webp'
    ];
    var fallbackMobilePool = [
      'assets/optimized/mpjpgo2b-dsc3032-generase-1-1280.webp',
      'assets/optimized/mpjpgq5s-dsc2316-1280.webp',
      'assets/optimized/mpjpgsdt-dsc2310-1280.webp',
      'assets/optimized/mpjpgu5f-dsc3892-1280.webp'
    ];
    if(!desktopPool.length) desktopPool = fallbackDesktopPool;
    if(!mobilePool.length) mobilePool = desktopPool.length ? desktopPool : fallbackMobilePool;
    var POOL = matchMedia('(max-width:900px)').matches ? mobilePool : desktopPool;
    var idx = 0;
    var active = a;
    var standby = b;

    function setFrameImage(frame, src){
      var inner = frame.querySelector('.pd-frame-inner');
      if(!inner) return;
      inner.style.backgroundImage = src ? "url('" + src + "')" : "";
    }
    function matches(query){
      return window.matchMedia && window.matchMedia(query).matches;
    }
    function webglRenderer(){
      var canvas;
      var gl;
      try {
        canvas = document.createElement('canvas');
        gl = canvas.getContext('webgl', { powerPreference: 'low-power' }) || canvas.getContext('experimental-webgl');
        if(!gl) return '';
        var info = gl.getExtension('WEBGL_debug_renderer_info');
        if(!info) return '';
        return String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || '');
      } catch(_) {
        return '';
      } finally {
        try { if(gl) gl.getExtension('WEBGL_lose_context').loseContext(); } catch(_) {}
      }
    }
    function lowPowerGpuReason(renderer){
      if(forceAnimated) return '';
      if(/swiftshader|software rasterizer|llvmpipe/i.test(renderer)) return 'software-renderer';
      if(/\bintel\b|iris|uhd graphics|hd graphics/i.test(renderer) && !/arc|apple|radeon|nvidia|geforce/i.test(renderer)){
        return 'integrated-intel-gpu';
      }
      return '';
    }
    function initialStaticHeroReason(){
      if(heroModeOverride === 'static') return 'manual';
      if(forceAnimated) return '';
      if(reduce) return 'reduced-motion';
      if(matches('(hover: none), (pointer: coarse), (max-width: 900px)')) return 'touch-or-small';
      if(connection && connection.saveData) return 'save-data';
      if(/^(slow-)?2g$/i.test((connection && connection.effectiveType) || '')) return 'slow-network';
      var memory = Number(navigator.deviceMemory || 0);
      var cores = Number(navigator.hardwareConcurrency || 0);
      if(memory && memory <= 4) return 'low-memory';
      if(cores && cores <= 4) return 'low-core-count';
      return '';
    }
    function canAnimateHero(){
      return !staticHero && !reduce && pageVisible && heroInView;
    }
    function updateHeroPauseClass(){
      if(staticHero) return;
      hero.classList.toggle('is-perf-paused', !canAnimateHero());
    }
    function useStaticHero(reason){
      staticHero = true;
      hero.classList.remove('is-perf-paused');
      hero.classList.add('is-static-hero');
      hero.dataset.heroRenderer = 'static';
      hero.dataset.heroStaticReason = reason || 'static';
      setFrameImage(a, POOL[idx] || POOL[0]);
      a.style.zIndex = 2;
      b.style.zIndex = 1;
      a.classList.add('is-in');
      b.classList.remove('is-in');
      setFrameImage(b, '');
      active = a;
      standby = b;
    }
    function warmPool(){
      if(warmPool.done) return;
      warmPool.done = true;
      POOL.slice(1).forEach(function(src){ var i=new Image(); i.src=src; });
    }
    function scheduleWarmPool(){
      var run = function(){ warmPool(); };
      if('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 3200 });
      else setTimeout(run, 0);
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

    var staticReason = initialStaticHeroReason();
    if(!staticReason){
      var renderer = webglRenderer();
      if(renderer) hero.dataset.heroGpu = renderer.slice(0, 96);
      staticReason = lowPowerGpuReason(renderer);
    }
    if(staticReason){
      useStaticHero(staticReason);
      return;
    }
    hero.dataset.heroRenderer = 'animated';

    if('IntersectionObserver' in window){
      var heroObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.target === hero){
            heroInView = entry.isIntersecting;
            updateHeroPauseClass();
          }
        });
      }, { threshold: 0.01 });
      heroObserver.observe(hero);
    }
    document.addEventListener('visibilitychange', function(){
      pageVisible = !document.hidden;
      updateHeroPauseClass();
    });

    // Keep the first render quiet; the next frames are only needed for the later
    // develop cycle, so warming them can wait until after LCP.
    setTimeout(scheduleWarmPool, 6200);

    // cycle interval: develop ~5.4s, hold ~7s -> swap every ~12400ms
    var CYCLE_MS = 12400;

    function tick(){
      if(!canAnimateHero()) return;
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
      if(staticHero || reduce) return;
      var delay = 16000 + Math.random()*6000;
      setTimeout(function(){
        if(!canAnimateHero()){ rePulse(); return; }
        // re-trigger develop on active frame (subtle: filter sweep, no full re-animation)
        var el = active;
        if(!el) { rePulse(); return; }
        if(el.animate){
          el.animate([
            { filter: 'brightness(1) saturate(1) sepia(0) contrast(1)' },
            { filter: 'brightness(1.18) saturate(.55) sepia(.18) contrast(.92)' },
            { filter: 'brightness(1) saturate(1) sepia(0) contrast(1)' }
          ], { duration: 1400, easing: 'cubic-bezier(.4,0,.2,1)' });
        }
        rePulse();
      }, delay);
    }
    rePulse();

    (function watchFrameBudget(){
      if(forceAnimated || !('requestAnimationFrame' in window) || !performance || !performance.now) return;
      var last = performance.now();
      var samples = 0;
      var slowScore = 0;
      function sample(now){
        if(staticHero) return;
        if(!canAnimateHero()){
          last = now;
          requestAnimationFrame(sample);
          return;
        }
        var delta = now - last;
        last = now;
        samples += 1;
        slowScore = delta > 55 ? slowScore + 1 : Math.max(0, slowScore - 0.25);
        if(samples > 90 && slowScore >= 10){
          useStaticHero('slow-frame-budget');
          return;
        }
        if(samples < 360) requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    })();

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

    var fallbackData = [
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

    var DATA = tabs.map(function(tab, idx){
      var fallback = fallbackData[idx] || fallbackData[0];
      return {
        label: (tab.textContent || '').trim() || fallback.label,
        title: tab.getAttribute('data-title') || fallback.title,
        body: tab.getAttribute('data-body') || fallback.body,
        list: fallback.list
      };
    });
    if(!DATA.length) DATA = fallbackData;

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
