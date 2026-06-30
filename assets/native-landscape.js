// Hero — Multi-Image Liquid Reveal (cinematic, ruhig, slow)
  document.addEventListener('DOMContentLoaded',()=>{
    const hero=document.querySelector('.hero-ls');
    if(!hero) return;
    const SVGNS='http://www.w3.org/2000/svg';
    const imgBottom=document.getElementById('lsImgBottom');
    const imgTop=document.getElementById('lsImgTop');
    const blobsA=document.getElementById('blobsA');
    const blobsB=document.getElementById('blobsB');
    const counterEl=document.getElementById('lsCounter');
    if(!imgBottom||!imgTop) return;

    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection=navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const heroModeOverride=(()=>{
      try{
        const params=new URLSearchParams(location.search);
        const mode=params.get('landscapeHero') || params.get('landschaftHero') || params.get('hero') || localStorage.getItem('mrLandscapeHeroMode') || localStorage.getItem('mrLandschaftHeroMode') || localStorage.getItem('mrHeroMode') || '';
        if(/^(static|lite)$/i.test(mode)) return 'static';
        if(/^(animated|shader|webgl)$/i.test(mode)) return 'animated';
      }catch(_){}
      return '';
    })();
    const forceAnimated=heroModeOverride==='animated';
    let staticHero=false;
    let pageVisible=!document.hidden;
    let heroInView=true;

    const images=(hero.dataset.images||'').split(',').map(s=>s.trim()).filter(Boolean);
    if(!images.length) return;

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
      if(reduced) return 'reduced-motion';
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
      return !staticHero && !reduced && pageVisible && heroInView;
    }
    function updateHeroPauseClass(){
      if(staticHero) return;
      hero.classList.toggle('is-perf-paused', !canAnimateHero());
    }

    // Counter-Bars
    counterEl.innerHTML='';
    images.forEach(()=>{const i=document.createElement('i');counterEl.appendChild(i);});
    const bars=Array.from(counterEl.children);
    const setActive=(idx)=>bars.forEach((b,i)=>b.classList.toggle('on',i===idx));

    // easeInOutCubic — sanftes Beschleunigen + Abklingen, fühlt sich premium an
    const easeInOutCubic=t=>t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;

    const CANVAS_W=1920, CANVAS_H=1080;
    const DIAG=Math.hypot(CANVAS_W, CANVAS_H); // ~2203
    const FULL_R=DIAG*1.25;  // sicher die ganze Fläche abdecken auch off-center
    const HOLD_MS=5600;      // ruhig, aber nicht ewig — fühlt sich wie ein Atemzug an
    const REVEAL_MS=3400;    // sanft cinematisch, gleitet weich aus
    const SAT_DELAY=480;
    const SAT_DUR=2900;
    const ripple=document.getElementById('lsRipple');
    const stage=hero.querySelector('.hero-ls__stage');

    function rand(min,max){return min+Math.random()*(max-min);}
    function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
    function clearChildren(el){while(el.firstChild)el.removeChild(el.firstChild);}

    // Wählt einen Triggerpunkt mit gutem Abstand zum vorherigen, sodass der Wechsel sich nicht wiederholt anfühlt
    let lastPt={cx:CANVAS_W*0.78, cy:CANVAS_H*0.25};
    function pickPoint(){
      // Versuche bis zu 6× einen Punkt zu finden, der ≥ 35% der Diagonale vom letzten entfernt ist
      const minDist=DIAG*0.34;
      let best=null, bestD=-1;
      for(let i=0;i<6;i++){
        const p={cx:rand(CANVAS_W*0.15, CANVAS_W*0.85), cy:rand(CANVAS_H*0.18, CANVAS_H*0.82)};
        const d=Math.hypot(p.cx-lastPt.cx, p.cy-lastPt.cy);
        if(d>=minDist){ best=p; bestD=d; break; }
        if(d>bestD){ best=p; bestD=d; }
      }
      lastPt=best;
      return best;
    }

    // Synchroner Ripple-Ring der vom Tinten-Ursprung expandiert
    function fireRipple(cx, cy){
      if(staticHero || !ripple) return;
      ripple.setAttribute('cx', cx.toFixed(0));
      ripple.setAttribute('cy', cy.toFixed(0));
      ripple.setAttribute('r','0');
      ripple.style.strokeOpacity='0';
      const t0=performance.now();
      const DUR=1700, MAX_R=DIAG*0.62;
      const ease=t=>1-Math.pow(1-t,3);
      function tick(now){
        if(staticHero){ripple.style.strokeOpacity='0';return;}
        const t=clamp((now-t0)/DUR,0,1);
        ripple.setAttribute('r',(MAX_R*ease(t)).toFixed(0));
        // sanfter Fade — peak bei ~12%, dann ausklingen
        const op = t<0.12 ? (t/0.12)*0.32 : (1-((t-0.12)/0.88))*0.32;
        ripple.style.strokeOpacity = Math.max(0,op).toFixed(3);
        ripple.style.strokeWidth = (1.6 + 0.8*(1-t)).toFixed(2);
        if(t<1) requestAnimationFrame(tick);
        else ripple.style.strokeOpacity='0';
      }
      requestAnimationFrame(tick);
    }

    // Erzeugt 1 Haupt-Blob + 1 sanften Satelliten — keine Splatter, keine Drips
    function buildInkOnMask(blobGroup){
      if(staticHero) return Promise.resolve();
      clearChildren(blobGroup);
      const seed=pickPoint();
      // Ripple gleichzeitig mit dem Reveal feuern
      fireRipple(seed.cx, seed.cy);
      const main=document.createElementNS(SVGNS,'circle');
      main.setAttribute('cx', seed.cx.toFixed(0));
      main.setAttribute('cy', seed.cy.toFixed(0));
      main.setAttribute('r','0');
      main.setAttribute('fill','white');
      blobGroup.appendChild(main);

      // Satellite: ein zweiter, kleinerer Blob im Gegenquadranten, leicht versetzt → bricht die Kreissymmetrie
      const offAng=rand(0, Math.PI*2);
      const offDist=rand(CANVAS_W*0.22, CANVAS_W*0.38);
      const sat={cx:clamp(seed.cx+Math.cos(offAng)*offDist, 160, CANVAS_W-160),
                 cy:clamp(seed.cy+Math.sin(offAng)*offDist, 140, CANVAS_H-140)};
      const sec=document.createElementNS(SVGNS,'circle');
      sec.setAttribute('cx', sat.cx.toFixed(0));
      sec.setAttribute('cy', sat.cy.toFixed(0));
      sec.setAttribute('r','0');
      sec.setAttribute('fill','white');
      blobGroup.appendChild(sec);

      return new Promise(resolve=>{
        const t0=performance.now();
        const totalDur=REVEAL_MS+260;
        function tick(now){
          if(staticHero){resolve();return;}
          const t=now-t0;
          const lm=clamp((t-0)/REVEAL_MS,0,1);
          main.setAttribute('r', (FULL_R*easeInOutCubic(lm)).toFixed(0));
          const ls=clamp((t-SAT_DELAY)/SAT_DUR,0,1);
          // Satellite muss nicht ganz so groß werden; er sorgt nur für asymmetrischen Anfang
          sec.setAttribute('r', (FULL_R*0.7*easeInOutCubic(ls)).toFixed(0));
          if(t<totalDur){
            requestAnimationFrame(tick);
          } else {
            // Am Ende sicherstellen, dass die Maske wirklich voll ist
            main.setAttribute('r', FULL_R.toFixed(0));
            sec.setAttribute('r', FULL_R.toFixed(0));
            resolve();
          }
        }
        requestAnimationFrame(tick);
      });
    }

    function setFullMask(group){
      clearChildren(group);
      const c=document.createElementNS(SVGNS,'circle');
      c.setAttribute('cx', CANVAS_W/2);
      c.setAttribute('cy', CANVAS_H/2);
      c.setAttribute('r', FULL_R);
      c.setAttribute('fill','white');
      group.appendChild(c);
    }

    function useStaticHero(reason){
      staticHero=true;
      hero.classList.remove('is-perf-paused');
      hero.classList.add('is-revealed','is-static-hero');
      hero.dataset.heroRenderer='static';
      hero.dataset.heroStaticReason=reason || 'static';
      imgBottom.setAttributeNS('http://www.w3.org/1999/xlink','href', images[0]);
      imgBottom.setAttribute('href', images[0]);
      imgBottom.removeAttribute('mask');
      imgTop.setAttributeNS('http://www.w3.org/1999/xlink','href', '');
      imgTop.setAttribute('href', '');
      imgTop.setAttribute('display','none');
      blobsA.removeAttribute('filter');
      blobsB.removeAttribute('filter');
      setFullMask(blobsA);
      clearChildren(blobsB);
      setActive(0);
      if(ripple){
        ripple.setAttribute('r','0');
        ripple.style.strokeOpacity='0';
      }
      if(stage) stage.style.transform='none';
    }

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
    document.addEventListener('visibilitychange',()=>{
      pageVisible=!document.hidden;
      updateHeroPauseClass();
    });

    // Bilder vorladen, damit der Wechsel nicht ruckelt. Im statischen
    // Performance-Modus bleibt es beim ersten Bild.
    images.forEach(src=>{const im=new Image();im.decoding='async';im.src=src;});

    async function runCycle(){
      // PHASE 0: erstes Bild
      imgBottom.setAttributeNS('http://www.w3.org/1999/xlink','href', images[0]);
      imgBottom.setAttribute('href', images[0]);
      imgTop.setAttribute('href', '');
      clearChildren(blobsB);
      setActive(0);

      if(reduced){
        setFullMask(blobsA);
        hero.classList.add('is-revealed');
        return;
      }

      hero.classList.add('is-revealed');
      await buildInkOnMask(blobsA);

      // PHASE LOOP
      let nextIdx=1;
      while(true){
        await sleep(HOLD_MS);
        if(!canAnimateHero()) continue;
        const next=images[nextIdx % images.length];
        imgTop.setAttribute('href', next);
        setActive(nextIdx % images.length);

        await buildInkOnMask(blobsB);
        if(staticHero) return;

        // Übernehmen
        imgBottom.setAttribute('href', next);
        setFullMask(blobsA);
        clearChildren(blobsB);

        nextIdx++;
      }
    }

    function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      setTimeout(()=>{runCycle().catch(()=>{});}, 320);
    }));

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

    // Sanftes Mouse-Parallax auf der Bildbühne — sehr dezent, fühlt sich „lebendig" an
    if(!reduced && !staticHero && stage){
      let targetX=0,targetY=0,curX=0,curY=0,rafId=null;
      const RANGE=10; // px in jede Richtung
      hero.addEventListener('mousemove',(e)=>{
        if(!canAnimateHero()) return;
        const r=hero.getBoundingClientRect();
        const nx=((e.clientX-r.left)/r.width-0.5)*2;
        const ny=((e.clientY-r.top)/r.height-0.5)*2;
        targetX=-nx*RANGE; targetY=-ny*RANGE;
        if(!rafId) rafId=requestAnimationFrame(loop);
      },{passive:true});
      hero.addEventListener('mouseleave',()=>{targetX=0;targetY=0;if(!rafId) rafId=requestAnimationFrame(loop);});
      function loop(){
        if(!canAnimateHero()){rafId=null;return;}
        curX+=(targetX-curX)*0.08;
        curY+=(targetY-curY)*0.08;
        stage.style.transform=`translate3d(${curX.toFixed(2)}px,${curY.toFixed(2)}px,0) scale(1.025)`;
        if(Math.abs(targetX-curX)>0.05 || Math.abs(targetY-curY)>0.05){
          rafId=requestAnimationFrame(loop);
        } else { rafId=null; }
      }
      // initial slight zoom-out so parallax-shift never reveals empty edge
      stage.style.transform='translate3d(0,0,0) scale(1.025)';
    }
  });

  // Lazy image fade
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
    const tiles=Array.from(document.querySelectorAll('.bg-ls__tile'));
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
