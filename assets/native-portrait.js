// Hero — Catchlight × perpetuierlicher Ken-Burns durch 4 Porträts
  // Timeline (ms):
  //   0      Catchlight pulsiert auf Schwarz
  //   ~700   Bild geladen → is-revealed: Iris-Reveal (clip-path 0→150vmax in 3.4s)
  //          + Slide 0 wird aktiv → Ken-Burns 1.55→1.0 in 14s
  //          + Catchlight fadet aus
  //   3200   Titel fadet ein
  //   3800   Sub-Lead fadet ein
  //   4100   CTA-Buttons faden ein
  //  12000   Slide 1 fadet ein (2.2s Crossfade) → frischer Ken-Burns
  //  24000   Slide 2 fadet ein
  //  36000   Slide 3 fadet ein
  //  48000   Slide 0 fadet wieder ein (perpetuierliche Schleife)
  (function(){
    const hero=document.getElementById('heroPt');
    if(!hero) return;
    const slides=Array.from(hero.querySelectorAll('.hero-pt__slide'));
    const firstImg=slides[0] && slides[0].querySelector('.hero-pt__image');
    const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
    const connection=navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const heroModeOverride=(()=>{
      try{
        const params=new URLSearchParams(location.search);
        const mode=params.get('portraitHero') || params.get('hero') || localStorage.getItem('mrPortraitHeroMode') || localStorage.getItem('mrHeroMode') || '';
        if(/^(static|lite)$/i.test(mode)) return 'static';
        if(/^(animated|shader|webgl)$/i.test(mode)) return 'animated';
      }catch(_){}
      return '';
    })();
    const forceAnimated=heroModeOverride==='animated';
    const SLIDE_MS=12000;
    let revealed=false;
    let zCounter=10;
    let cycleTimer=null;
    let staticHero=false;
    let pageVisible=!document.hidden;
    let heroInView=true;

    function matches(query){
      return window.matchMedia && window.matchMedia(query).matches;
    }
    function webglRenderer(){
      let canvas;
      let gl;
      try{
        canvas=document.createElement('canvas');
        gl=canvas.getContext('webgl',{powerPreference:'low-power'}) || canvas.getContext('experimental-webgl');
        if(!gl) return '';
        const info=gl.getExtension('WEBGL_debug_renderer_info');
        if(!info) return '';
        return String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || '');
      }catch(_){
        return '';
      }finally{
        try{ if(gl) gl.getExtension('WEBGL_lose_context').loseContext(); }catch(_){}
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
      if(heroModeOverride==='static') return 'manual';
      if(forceAnimated) return '';
      if(reduce) return 'reduced-motion';
      if(matches('(hover: none), (pointer: coarse), (max-width: 900px)')) return 'touch-or-small';
      if(connection && connection.saveData) return 'save-data';
      if(/^(slow-)?2g$/i.test((connection && connection.effectiveType) || '')) return 'slow-network';
      const memory=Number(navigator.deviceMemory || 0);
      const cores=Number(navigator.hardwareConcurrency || 0);
      if(memory && memory<=4) return 'low-memory';
      if(cores && cores<=4) return 'low-core-count';
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
      staticHero=true;
      if(cycleTimer){clearInterval(cycleTimer);cycleTimer=null;}
      hero.classList.remove('is-perf-paused');
      hero.classList.add('is-revealed','is-static-hero');
      hero.dataset.heroRenderer='static';
      hero.dataset.heroStaticReason=reason || 'static';
      zCounter++;
      slides.forEach((slide,index)=>{
        slide.classList.toggle('is-active', index===0);
        slide.style.zIndex=index===0 ? String(zCounter) : '0';
      });
    }

    function activateSlide(i){
      if(staticHero || !canAnimateHero()) return;
      const slide=slides[i];
      if(!slide) return;
      zCounter++;
      slide.style.zIndex=String(zCounter);
      // Force CSS animation restart so each slide zooms fresh from 1.55
      slide.classList.remove('is-active');
      void slide.offsetWidth;
      slide.classList.add('is-active');
      // After the crossfade settles, retire older slides so they can re-enter cleanly
      setTimeout(()=>{
        slides.forEach((s,j)=>{
          if(j!==i && (parseInt(s.style.zIndex||'0',10) < zCounter)){
            s.classList.remove('is-active');
          }
        });
      },2600);
    }

    function reveal(){
      if(revealed) return; revealed=true;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        hero.classList.add('is-revealed');
        activateSlide(0);
        if(reduce || staticHero) return;
        let i=0;
        cycleTimer=setInterval(()=>{
          if(!canAnimateHero()) return;
          i=(i+1)%slides.length;
          activateSlide(i);
        },SLIDE_MS);
      }));
    }

    if(firstImg){
      if(firstImg.complete && firstImg.naturalWidth>0) reveal();
      else { firstImg.addEventListener('load',reveal,{once:true}); firstImg.addEventListener('error',reveal,{once:true}); }
    }
    setTimeout(reveal,700);

    let staticReason=initialStaticHeroReason();
    if(!staticReason){
      const renderer=webglRenderer();
      if(renderer) hero.dataset.heroGpu=renderer.slice(0,96);
      staticReason=lowPowerGpuReason(renderer);
    }
    if(staticReason){
      useStaticHero(staticReason);
      return;
    }
    hero.dataset.heroRenderer='animated';

    if('IntersectionObserver' in window){
      const heroObserver=new IntersectionObserver((entries)=>{
        entries.forEach((entry)=>{
          if(entry.target===hero){
            heroInView=entry.isIntersecting;
            updateHeroPauseClass();
          }
        });
      },{threshold:0.01});
      heroObserver.observe(hero);
    }

    // Pause cycling when the page is hidden — saves CPU and avoids
    // a sudden jump when the tab gets focus back.
    document.addEventListener('visibilitychange',()=>{
      pageVisible=!document.hidden;
      updateHeroPauseClass();
      if(document.hidden && cycleTimer){clearInterval(cycleTimer);cycleTimer=null;}
      else if(!document.hidden && revealed && !cycleTimer && !reduce && !staticHero){
        let i=slides.findIndex(s=>s.classList.contains('is-active'));
        if(i<0) i=0;
        cycleTimer=setInterval(()=>{
          if(!canAnimateHero()) return;
          i=(i+1)%slides.length;
          activateSlide(i);
        },SLIDE_MS);
      }
    });

    (function watchFrameBudget(){
      if(forceAnimated || !('requestAnimationFrame' in window) || !performance || !performance.now) return;
      let last=performance.now();
      let samples=0;
      let slowScore=0;
      function sample(now){
        if(staticHero) return;
        if(!canAnimateHero()){
          last=now;
          requestAnimationFrame(sample);
          return;
        }
        const delta=now-last;
        last=now;
        samples+=1;
        slowScore=delta>55 ? slowScore+1 : Math.max(0,slowScore-0.25);
        if(samples>90 && slowScore>=10){
          useStaticHero('slow-frame-budget');
          return;
        }
        if(samples<360) requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    })();
  })();

  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('img[loading="lazy"]').forEach(img=>{
      if(img.complete) img.classList.add('is-loaded');
      else img.addEventListener('load',()=>img.classList.add('is-loaded'),{once:true});
    });
  });

  // Lightbox
  (function(){
    const lb=document.getElementById('lb'),lbImg=document.getElementById('lb-img'),lbCount=document.getElementById('lb-counter');
    const prev=document.getElementById('lb-prev'),next=document.getElementById('lb-next'),close=document.getElementById('lb-close');
    const tiles=Array.from(document.querySelectorAll('.bg-pt__tile'));
    if(!lb||!lbImg||!lbCount||!prev||!next||!close||!tiles.length) return;
    let idx=0;
    function open(i){idx=i;show();lb.classList.add('is-open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
    function show(){const src=tiles[idx].getAttribute('data-full');const im=new Image();im.onload=()=>{lbImg.src=src;lbCount.textContent=String(idx+1).padStart(2,'0')+' / '+String(tiles.length).padStart(2,'0')};im.src=src}
    function shut(){lb.classList.remove('is-open');lb.setAttribute('aria-hidden','true');document.body.style.overflow=''}
    tiles.forEach((t,i)=>t.addEventListener('click',()=>open(i)));
    prev.addEventListener('click',()=>{idx=(idx-1+tiles.length)%tiles.length;show()});
    next.addEventListener('click',()=>{idx=(idx+1)%tiles.length;show()});
    close.addEventListener('click',shut);
    lb.addEventListener('click',e=>{if(e.target===lb)shut()});
    document.addEventListener('keydown',e=>{if(!lb.classList.contains('is-open'))return;if(e.key==='Escape')shut();if(e.key==='ArrowLeft')prev.click();if(e.key==='ArrowRight')next.click()});
  })();
