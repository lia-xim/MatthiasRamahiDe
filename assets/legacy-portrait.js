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
    const firstImg=slides[0] && slides[0].querySelector('.hero-pt__base-img');
    const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
    const SLIDE_MS=12000;
    let revealed=false;
    let zCounter=10;
    let cycleTimer=null;

    function activateSlide(i){
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
        if(reduce) return;
        let i=0;
        cycleTimer=setInterval(()=>{
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

    // Pause cycling when the page is hidden — saves CPU and avoids
    // a sudden jump when the tab gets focus back.
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden && cycleTimer){clearInterval(cycleTimer);cycleTimer=null;}
      else if(!document.hidden && revealed && !cycleTimer && !reduce){
        let i=slides.findIndex(s=>s.classList.contains('is-active'));
        if(i<0) i=0;
        cycleTimer=setInterval(()=>{
          i=(i+1)%slides.length;
          activateSlide(i);
        },SLIDE_MS);
      }
    });
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
