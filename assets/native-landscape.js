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

    const images=(hero.dataset.images||'').split(',').map(s=>s.trim()).filter(Boolean);
    if(!images.length) return;

    // Counter-Bars
    counterEl.innerHTML='';
    images.forEach(()=>{const i=document.createElement('i');counterEl.appendChild(i);});
    const bars=Array.from(counterEl.children);
    const setActive=(idx)=>bars.forEach((b,i)=>b.classList.toggle('on',i===idx));

    // Bilder vorladen, damit der Wechsel nicht ruckelt
    images.forEach(src=>{const im=new Image();im.decoding='async';im.src=src;});

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
      if(!ripple) return;
      ripple.setAttribute('cx', cx.toFixed(0));
      ripple.setAttribute('cy', cy.toFixed(0));
      ripple.setAttribute('r','0');
      ripple.style.strokeOpacity='0';
      const t0=performance.now();
      const DUR=1700, MAX_R=DIAG*0.62;
      const ease=t=>1-Math.pow(1-t,3);
      function tick(now){
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
        const next=images[nextIdx % images.length];
        imgTop.setAttribute('href', next);
        setActive(nextIdx % images.length);

        await buildInkOnMask(blobsB);

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

    // Sanftes Mouse-Parallax auf der Bildbühne — sehr dezent, fühlt sich „lebendig" an
    if(!reduced && stage){
      let targetX=0,targetY=0,curX=0,curY=0,rafId=null;
      const RANGE=10; // px in jede Richtung
      hero.addEventListener('mousemove',(e)=>{
        const r=hero.getBoundingClientRect();
        const nx=((e.clientX-r.left)/r.width-0.5)*2;
        const ny=((e.clientY-r.top)/r.height-0.5)*2;
        targetX=-nx*RANGE; targetY=-ny*RANGE;
        if(!rafId) rafId=requestAnimationFrame(loop);
      },{passive:true});
      hero.addEventListener('mouseleave',()=>{targetX=0;targetY=0;if(!rafId) rafId=requestAnimationFrame(loop);});
      function loop(){
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
