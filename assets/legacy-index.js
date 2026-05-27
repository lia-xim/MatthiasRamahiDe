/* Topbar theme switch + mobile menu live in assets/site-chrome.js */

/* ====== Footer aperture animation observer ====== */
(()=>{const f=document.querySelector('.mr-footer');if(!f) return;const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){f.classList.add('in-view');io.disconnect();}});},{threshold:.28});io.observe(f);})();

/* ====== Global smooth lazy-image fade-in ======
   Every <img loading="lazy" decoding="async"> starts hidden via CSS and gets .is-loaded once
   the browser actually has the pixels — for cached, in-flight, and
   future-injected images alike. */
(()=>{
  const mark = img => {
    if (img.classList.contains('is-loaded')) return;
    img.classList.add('is-loaded');
  };
  const watch = img => {
    if (img.dataset.lf === '1') return;
    img.dataset.lf = '1';
    if (img.complete && img.naturalWidth > 0) { mark(img); return; }
    img.addEventListener('load', () => mark(img), { once:true });
    img.addEventListener('error', () => mark(img), { once:true });
  };
  document.querySelectorAll('img[loading="lazy"]').forEach(watch);
  // catch images injected later (marquee tiles, etc.)
  const mo = new MutationObserver(muts => {
    for (const m of muts) for (const node of m.addedNodes) {
      if (node.nodeType !== 1) continue;
      if (node.tagName === 'IMG' && node.getAttribute('loading') === 'lazy') watch(node);
      else if (node.querySelectorAll) node.querySelectorAll('img[loading="lazy"]').forEach(watch);
    }
  });
  mo.observe(document.body, { childList:true, subtree:true });
})();

/* ====== HERO: Cinematic Image Cycle + Lens Shader ======
   Konzept: Bühne aus 6 Bildern (Automobil → Porträt → Oldtimer →
   Motorrad → Landschaft → Sportwagen), die in langsamen Cinematic-
   Crossfades wechseln. Eine virtuelle Linse folgt der Maus: dort
   wird das Bild scharf, voll farbig, leicht magnifiziert, und
   bei schneller Mausbewegung tritt Chromatic Aberration auf.
   Klick = Shutter-Flash + sofortiger Wechsel zum nächsten Motiv.
   Ken-Burns gibt der Szene eine ruhige Atmung. Komplett eigener
   Shader, keine externen Libs.
*/
(()=>{
  const canvas=document.getElementById('hero-shader');
  if(!canvas) return;
  const hero=canvas.closest('.hero');
  const cursor=document.getElementById('hero-cursor');

  /* parse "url,url,..." */
  const raw=(canvas.dataset.imgs||'').split(',').map(s=>s.trim()).filter(Boolean);
  const slides=raw.map(url=>({url}));
  if(!slides.length){return;}

  const gl=canvas.getContext('webgl',{antialias:true,premultipliedAlpha:false,powerPreference:'default'});
  if(!gl){canvas.style.background='radial-gradient(55% 45% at 50% 55%,#1a0a08,#010104 72%)';return;}

  const vsrc=`attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
  const fsrc=`
  precision highp float;
  uniform sampler2D uA;
  uniform sampler2D uB;
  uniform float uT;
  uniform vec2  uR;
  uniform vec2  uIRA;
  uniform vec2  uIRB;
  uniform vec2  uM;       /* mouse normalised 0..1 */
  uniform float uMA;      /* mouse activity 0..1 (presence) */
  uniform float uVel;     /* mouse velocity 0..1 */
  uniform float uMix;     /* 0=A, 1=B */
  uniform float uReady;
  uniform float uShutter; /* 0..1 pulse on click */
  uniform float uKB;      /* ken-burns phase per slide 0..1 */

  float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }

  vec3 desat(vec3 c, float s){
    float l=dot(c, vec3(0.2126, 0.7152, 0.0722));
    return mix(vec3(l), c, s);
  }

  vec2 coverUV(vec2 uv, vec2 ir, float kb, float seed){
    float canvasRatio=uR.x/uR.y;
    float imgRatio=ir.x/ir.y;
    /* proper "cover" sampling: shrink the sampled UV range along the
       overflow axis so the image fills the canvas without stretch.    */
    vec2 scale=(canvasRatio>imgRatio) ? vec2(1.0, imgRatio/canvasRatio) : vec2(canvasRatio/imgRatio, 1.0);
    /* continuous ken-burns: time-based slow drift that never stops and
       never resets between slides. Both slots use identical motion, so
       the promote moment cannot cause a visible jump. kb is elapsed
       seconds since hero load. */
    float kbScale=1.045 + 0.045*sin(kb*0.15);
    vec2 kbPan=vec2(sin(kb*0.22)*0.055, cos(kb*0.17)*0.042);
    vec2 q=(uv-0.5) * scale / kbScale + kbPan;
    q+=0.5;
    q.y=1.0-q.y;
    return q;
  }

  /* split-tone: warm shadows, slightly cool/neutral highlights */
  vec3 splitTone(vec3 c){
    float l=dot(c, vec3(0.2126, 0.7152, 0.0722));
    vec3 shadow=vec3(1.040, 0.992, 0.948);   /* warm bone */
    vec3 highlight=vec3(0.985, 0.998, 1.012); /* whisper of cool steel */
    vec3 tint=mix(shadow, highlight, smoothstep(0.0, 1.0, l));
    return c*tint;
  }

  void main(){
    vec2 uv=gl_FragCoord.xy/uR.xy;
    float canvasRatio=uR.x/uR.y;

    /* both slots sample with the SAME continuous time-based motion, so the
       promote moment cannot cause a position jump — motion is identical
       in both textures, only the texture content swaps. */
    vec2 uvA=coverUV(uv, uIRA, uKB, 17.0);
    vec2 uvB=coverUV(uv, uIRB, uKB, 17.0);

    /* aspect-corrected for distance math */
    vec2 p=uv*2.0-1.0; p.x*=canvasRatio;
    vec2 m=uM*2.0-1.0; m.x*=canvasRatio;

    /* idle drift so the light breathes even without the mouse */
    vec2 drift=vec2(sin(uT*0.13)*0.28, cos(uT*0.10)*0.16);
    vec2 lp=mix(drift, m, clamp(uMA, 0.0, 1.0));

    float dist=length(p-lp);

    /* BASE: photo at near-full visibility — no distortion, no CA */
    vec3 baseA=texture2D(uA, clamp(uvA, 0.0, 1.0)).rgb;
    vec3 baseB=texture2D(uB, clamp(uvB, 0.0, 1.0)).rgb;
    vec3 col=mix(baseA, baseB, uMix);

    /* gentle filmic grade — split-tone + light contrast lift */
    col=pow(max(col, 0.0), vec3(0.97));
    col=splitTone(col);

    /* very slow global "breath" — barely perceptible exposure pulse */
    float breath=0.5 + 0.5*sin(uT*0.22);
    col*=mix(0.985, 1.015, breath);

    /* SPOTLIGHT — base sits slightly darker / a touch desaturated so the
       cursor's lift reads as a real reveal. No lens distortion. */
    float liftR=0.95;
    float lift=1.0 - smoothstep(0.0, liftR, dist);
    lift=pow(lift, 1.45);
    /* far-from-cursor darken (this is what gives the spotlight feel) */
    float ambient=mix(0.78, 1.0, lift);
    col*=ambient;
    /* lateral desat far from cursor — pulls grey deeper, color blooms at cursor */
    float lum0=dot(col, vec3(0.2126, 0.7152, 0.0722));
    col=mix(mix(vec3(lum0), col, 0.78), col, mix(0.0, 1.0, lift));
    /* exposure lift right under the cursor */
    col*=1.0 + lift * (0.20 + 0.16*uMA);
    /* saturation re-bloom at the cursor */
    float lum=dot(col, vec3(0.2126, 0.7152, 0.0722));
    col=mix(col, mix(vec3(lum), col, 1.32), lift * (0.62 + 0.55*uMA));

    /* warm core right at the cursor — small punch of "exposure" */
    float core=exp(-dist*5.4);
    col += core * vec3(0.14, 0.10, 0.06) * (0.10 + 0.42*uMA);

    /* secondary ring — a wider, much subtler halo (gives the spotlight depth) */
    float halo=exp(-dist*1.7) - exp(-dist*3.2);
    col += max(halo, 0.0) * vec3(0.06, 0.05, 0.04) * (0.20 + 0.45*uMA);

    /* PHOTOGRAPHIC EDGE FRAME — soft dark corners + a tighter inner vignette
       so the image feels printed, not slapped onto the canvas. */
    vec2 vuv=uv-0.5;
    float r2=dot(vuv, vuv);
    /* inner vignette (gentle) */
    float vig=1.0 - r2*0.85;
    col*=clamp(vig, 0.58, 1.0);
    /* outer corner fade (per-corner, stronger than a circular vignette) */
    float cornerX=smoothstep(0.32, 0.50, abs(vuv.x));
    float cornerY=smoothstep(0.34, 0.50, abs(vuv.y));
    float corner=max(cornerX, cornerY);
    col*=mix(1.0, 0.78, corner * 0.55);

    /* cinematic top+bottom fade for text legibility */
    float topFade=smoothstep(0.0, 0.16, uv.y);
    float bottomFade=smoothstep(0.0, 0.22, 1.0-uv.y);
    col*=mix(0.84, 1.0, topFade);
    col*=mix(0.78, 1.0, bottomFade);

    /* crossfade darken right when mixing slides — small */
    float xfade=4.0 * uMix * (1.0-uMix);
    col *= 1.0 - xfade*0.06 * smoothstep(0.0, 0.7, length(uv-0.5));

    /* shutter flash on click — softer */
    col = mix(col, vec3(1.0), uShutter*0.55);

    /* 35mm grain — very fine, modulated by luminance so it lives in mids */
    float g=fract(sin(dot(uv*vec2(1920.0,1080.0)+uT, vec2(12.9898, 78.233)))*43758.5453);
    float gl=dot(col, vec3(0.2126, 0.7152, 0.0722));
    float gmask=smoothstep(0.05, 0.55, gl) * (1.0 - smoothstep(0.55, 0.95, gl));
    col+=(g-0.5)*0.024*gmask;

    col*=uReady;
    gl_FragColor=vec4(col, 1.0);
  }`;

  function compile(type,src){
    const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(s));return null;}
    return s;
  }
  const vs=compile(gl.VERTEX_SHADER,vsrc);
  const fs=compile(gl.FRAGMENT_SHADER,fsrc);
  const prog=gl.createProgram(); gl.attachShader(prog,vs); gl.attachShader(prog,fs); gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){console.warn(gl.getProgramInfoLog(prog));return;}
  gl.useProgram(prog);

  const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const a=gl.getAttribLocation(prog,'p'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);

  const U={};
  ['uT','uR','uIRA','uIRB','uM','uMA','uVel','uMix','uReady','uShutter','uKB'].forEach(n=>{U[n]=gl.getUniformLocation(prog,n);});
  const uA=gl.getUniformLocation(prog,'uA');
  const uB=gl.getUniformLocation(prog,'uB');
  gl.uniform1i(uA,0); gl.uniform1i(uB,1);

  function placeholderTex(){
    const t=gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,t);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([4,4,8,255]));
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    return t;
  }
  const texA=placeholderTex();
  const texB=placeholderTex();

  /* preload all images */
  const cache=slides.map(()=>null);
  function loadImage(idx){
    return new Promise(res=>{
      if(cache[idx]){res(cache[idx]);return;}
      const im=new Image(); im.crossOrigin='anonymous';
      im.onload=()=>{cache[idx]={img:im,w:im.naturalWidth||im.width,h:im.naturalHeight||im.height};res(cache[idx]);};
      im.onerror=()=>{cache[idx]={img:null,w:1,h:1};res(cache[idx]);};
      im.src=slides[idx].url;
    });
  }
  function uploadInto(tex, entry){
    if(!entry || !entry.img) return;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    try{ gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,entry.img); }
    catch(e){ console.warn('tex upload failed',e); }
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  }

  /* slot state: slotA + slotB hold images; uMix interpolates A→B */
  let currentIdx=0, nextIdx=1;
  let irA={w:1,h:1}, irB={w:1,h:1};
  let targetReady=0, ready=0;
  let mix=0, targetMix=0;
  let transitioning=false;
  const heroStartT=performance.now();

  /* boot — load first image into slot A, second into slot B */
  loadImage(0).then(entry=>{
    if(!entry) return;
    irA={w:entry.w,h:entry.h};
    gl.activeTexture(gl.TEXTURE0); uploadInto(texA, entry);
    targetReady=1;
  });
  loadImage(1%slides.length).then(entry=>{
    if(!entry) return;
    irB={w:entry.w,h:entry.h};
    gl.activeTexture(gl.TEXTURE1); uploadInto(texB, entry);
  });

  const CYCLE_MS=6800;
  const TRANSITION_MS=1500;
  let lastCycle=performance.now();

  async function startTransition(toIdx){
    if(transitioning) return;
    transitioning=true;
    /* make sure the "to" image is in slot B, and reset KB so the new slide
       starts its ken-burns from the beginning AFTER the transition completes.
       During the transition slot B already shows the new image. */
    const target=toIdx;
    /* load target into the inactive slot (slot B) */
    const entry=await loadImage(target);
    if(entry){
      irB={w:entry.w,h:entry.h};
      gl.activeTexture(gl.TEXTURE1); uploadInto(texB, entry);
    }
    targetMix=1;

    /* after the mix completes, promote B→A and reset */
    setTimeout(()=>{
      /* copy: now slot A should hold the "target" image, slot B can hold whatever comes next */
      const promote=cache[target];
      if(promote){
        irA={w:promote.w,h:promote.h};
        gl.activeTexture(gl.TEXTURE0); uploadInto(texA, promote);
      }
      mix=0; targetMix=0;
      currentIdx=target;
      nextIdx=(target+1)%slides.length;
      /* preload the one after into slot B */
      loadImage(nextIdx).then(e=>{
        if(e){
          irB={w:e.w,h:e.h};
          gl.activeTexture(gl.TEXTURE1); uploadInto(texB, e);
        }
      });
      /* motion is continuous and identical for both slots — no kb reset
         needed, both samples drift with the same time-based pan/zoom so
         the promote is invisible. */
      transitioning=false;
      lastCycle=performance.now();
    }, TRANSITION_MS+40);
  }

  /* ===== one text per image — single swap per cycle =====
     Each slide carries exactly one headline. On image change: current
     text exits right, content replaces, new text enters from left. */
  const HERO_TEXTS=[
    ['Fotografie','Düsseldorf'],
    ['Automobil'],
    ['Landschaft'],
    ['Oldtimer'],
    ['Automobil'],
    ['Motorrad'],
  ];
  const titleEl=hero?.querySelector('.hero-title');
  const leadEl=hero?.querySelector('#hero-lead');
  let swapToken=0;
  const wait=(ms)=>new Promise(r=>setTimeout(r,ms));

  function renderTitle(lines){
    if(!titleEl) return;
    titleEl.innerHTML = lines.map(w=>`<span class="line"><span class="word">${w}</span></span>`).join('');
  }

  /* intro: words slide in from the left, second line trails the first. */
  if(titleEl){
    setTimeout(()=>{ titleEl.classList.add('is-in'); }, 220);
  }

  async function swapToText(idx){
    if(!titleEl) return;
    const lines=HERO_TEXTS[idx%HERO_TEXTS.length];
    if(!lines) return;
    const t=++swapToken;
    /* 1. current title exits right */
    titleEl.classList.remove('is-in');
    titleEl.classList.add('is-out');
    await wait(720); if(t!==swapToken) return;
    /* 2. snap to left-start (no transition), swap content, then animate in */
    titleEl.classList.add('no-anim');
    titleEl.classList.remove('is-out');
    renderTitle(lines);
    void titleEl.offsetWidth;            /* flush styles */
    titleEl.classList.remove('no-anim');
    leadEl?.classList.toggle('is-hidden', idx%HERO_TEXTS.length !== 0);
    requestAnimationFrame(()=>titleEl.classList.add('is-in'));
  }

  function cycleNext(){
    if(transitioning) return;
    const nxt=(currentIdx+1)%slides.length;
    startTransition(nxt);
    swapToText(nxt);
  }

  /* shutter flash uniform */
  let shutter=0;
  function flash(){shutter=1;}

  /* ===== mouse + velocity tracking ===== */
  let mx=0.62, my=0.45, tx=0.62, ty=0.45, act=0.0, lastMove=0;
  let lastX=mx, lastY=my, vel=0, velTarget=0;

  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,1.5);
    const w=canvas.clientWidth, h=canvas.clientHeight;
    canvas.width=Math.max(1,Math.floor(w*dpr));
    canvas.height=Math.max(1,Math.floor(h*dpr));
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  const ro=new ResizeObserver(resize); ro.observe(canvas);
  resize();

  function move(ev){
    const r=canvas.getBoundingClientRect();
    const x=(ev.clientX-r.left)/r.width;
    const y=1.0-(ev.clientY-r.top)/r.height;
    if(x>=0 && x<=1 && y>=0 && y<=1){
      tx=x; ty=y;
      lastMove=performance.now();
    }
    if(cursor){
      cursor.style.transform=`translate(${ev.clientX}px,${ev.clientY}px) translate(-50%,-50%)`;
    }
  }
  function touch(ev){if(ev.touches&&ev.touches[0]){ const t=ev.touches[0]; move({clientX:t.clientX, clientY:t.clientY}); }}
  function enter(){if(cursor) cursor.classList.add('is-active');}
  function leave(){
    if(cursor) cursor.classList.remove('is-active');
  }
  function down(){if(cursor) cursor.classList.add('is-pressed'); flash(); cycleNext();}
  function up(){if(cursor) cursor.classList.remove('is-pressed');}
  if(hero){
    hero.addEventListener('mousemove',move,{passive:true});
    hero.addEventListener('mouseenter',enter);
    hero.addEventListener('mouseleave',leave);
    hero.addEventListener('mousedown',down);
    hero.addEventListener('mouseup',up);
    hero.addEventListener('touchmove',touch,{passive:true});
    hero.addEventListener('touchstart',(e)=>{down();touch(e);},{passive:true});
    hero.addEventListener('touchend',up);
  }
  /* prevent the CTA buttons from triggering a hero shutter when clicked */
  hero?.querySelectorAll('a,button').forEach(el=>{
    el.addEventListener('mousedown',e=>e.stopPropagation());
    el.addEventListener('mouseup',e=>e.stopPropagation());
  });

  const start=performance.now();
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function frame(){
    const now=performance.now();
    const t=(now-start)/1000.0;
    const k=reduce?0.06:0.12;
    mx+=(tx-mx)*k; my+=(ty-my)*k;
    const idle=Math.min(1,(now-lastMove)/1500);
    const tact=(1-idle);
    act+=(tact-act)*0.07;
    ready+=(targetReady-ready)*0.08;

    /* velocity: distance per frame, smoothed and clamped */
    const dx=mx-lastX, dy=my-lastY;
    const inst=Math.min(1, Math.sqrt(dx*dx+dy*dy)*22);
    velTarget=inst;
    vel+=(velTarget-vel)*0.18;
    lastX=mx; lastY=my;

    /* mix animation */
    if(targetMix>mix){
      const step=1000/TRANSITION_MS / 60;
      mix+=step;
      if(mix>=1){mix=1;}
    }

    /* shutter decay */
    shutter*=0.88;

    /* continuous ken-burns clock: seconds since hero load. The shader
       drives slow sinusoidal pan + zoom from this so motion never stops
       and never resets between slides. */
    const kbT=(now-heroStartT)/1000;

    /* auto-cycle */
    if(!reduce && !transitioning && (now-lastCycle)>CYCLE_MS){
      cycleNext();
    }

    gl.uniform1f(U.uT, reduce?0.0:t);
    gl.uniform2f(U.uR, canvas.width, canvas.height);
    gl.uniform2f(U.uIRA, irA.w, irA.h);
    gl.uniform2f(U.uIRB, irB.w, irB.h);
    gl.uniform2f(U.uM, mx, my);
    gl.uniform1f(U.uMA, act);
    gl.uniform1f(U.uVel, vel);
    gl.uniform1f(U.uMix, mix);
    gl.uniform1f(U.uReady, ready);
    gl.uniform1f(U.uShutter, shutter);
    gl.uniform1f(U.uKB, reduce?0.0:kbT);

    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texA);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texB);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* ============ PORTFOLIO MARQUEE + LIGHTBOX ============ */
(function(){
  const PORTFOLIO_IMAGES = [
    'assets/optimized/assets-portfolio-dsc3879-1920.webp',
    'assets/optimized/assets-portfolio-dsc3878-1920.webp',
    'assets/optimized/assets-portfolio-dsc3892-1920.webp',
    'assets/optimized/assets-portfolio-dsc3908-1920.webp',
    'assets/optimized/assets-portfolio-dsc3982-1920.webp',
    'assets/optimized/assets-portfolio-20250605-dsc04020-1920.webp',
    'assets/optimized/assets-portfolio-20250605-dsc03978-1920.webp',
    'assets/optimized/assets-portfolio-20250605-dsc03816-1920.webp',
    'assets/optimized/assets-portfolio-20250605-dsc03793-1920.webp',
    'assets/optimized/assets-portfolio-20250605-dsc03756-1920.webp',
    'assets/portfolio/_DSC0470-Enhanced-NR.webp',
    'assets/portfolio/_DSC9321-Enhanced-NR.webp',
    'assets/portfolio/_DSC9301-Enhanced-NR.webp',
    'assets/optimized/assets-portfolio-dsc2310-1920.webp',
    'assets/optimized/assets-portfolio-dsc2316-1920.webp',
    'assets/optimized/assets-portfolio-dsc2329-1920.webp',
    'assets/optimized/assets-portfolio-dsc2345-1920.webp',
    'assets/optimized/assets-portfolio-dsc2358-1920.webp',
    'assets/optimized/assets-portfolio-dsc2744-1920.webp',
    'assets/optimized/assets-portfolio-dsc2762-1920.webp',
    'assets/optimized/assets-portfolio-dsc2986-1920.webp',
    'assets/optimized/assets-portfolio-dsc6982-1920.webp',
    'assets/optimized/assets-portfolio-dsc8032-1920.webp',
    'assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp',
    'assets/optimized/assets-portfolio-wettberwerb-foto6-wunder-der-natur-1920.webp',
    'assets/optimized/assets-portfolio-wettberwerb-foto10-wunder-der-natur-1920.webp',
    'assets/optimized/assets-portfolio-20250327-dsc01550-1920.webp',
    'assets/optimized/assets-portfolio-20250414-dsc00341-1920.webp'
  ];

  const SIZES = ['--ww','--w','--t','--s','--w','--ww','--t','--s'];
  const t1 = document.getElementById('pfTrack1');
  const t2 = document.getElementById('pfTrack2');
  if(!t1 || !t2) return;

  const half = Math.ceil(PORTFOLIO_IMAGES.length / 2);
  const list1 = PORTFOLIO_IMAGES.slice(0, half);
  const list2 = PORTFOLIO_IMAGES.slice(half).concat(PORTFOLIO_IMAGES.slice(0, Math.max(0, half - PORTFOLIO_IMAGES.length + half)));

  function thumbOf(src){
    // assets/portfolio/foo.webp -> assets/portfolio/thumbs/foo.webp
    return src.replace('assets/portfolio/', 'assets/portfolio/thumbs/');
  }

  function makeTile(src, sizeCls, fullIndex){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pf-tile ' + sizeCls;
    btn.setAttribute('aria-label','Bild vergrößern');
    btn.dataset.idx = String(fullIndex);
    const img = document.createElement('img');
    img.src = thumbOf(src);
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 720;
    btn.appendChild(img);
    return btn;
  }

  function fillTrack(track, list, offset){
    const frag = document.createDocumentFragment();
    // two consecutive copies for seamless loop
    for(let dup=0; dup<2; dup++){
      list.forEach((src, i) => {
        const sz = SIZES[(i + offset) % SIZES.length];
        const fullIdx = PORTFOLIO_IMAGES.indexOf(src);
        frag.appendChild(makeTile(src, sz, fullIdx));
      });
    }
    track.appendChild(frag);
  }
  // Defer building marquee tiles until the section is near the viewport.
  const marquee = document.querySelector('.pf-marquee');
  let built = false;
  const buildTiles = () => {
    if (built) return; built = true;
    fillTrack(t1, list1, 0);
    fillTrack(t2, list2, 3);
  };
  if ('IntersectionObserver' in window && marquee) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { buildTiles(); io.disconnect(); break; }
      }
    }, { rootMargin: '600px 0px' });
    io.observe(marquee);
  } else {
    buildTiles();
  }

  /* Lightbox */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let cur = 0;

  function setImg(i){
    cur = (i + PORTFOLIO_IMAGES.length) % PORTFOLIO_IMAGES.length;
    lbImg.classList.remove('show');
    const next = new Image();
    next.onload = () => {
      lbImg.src = next.src;
      requestAnimationFrame(() => lbImg.classList.add('show'));
    };
    next.src = PORTFOLIO_IMAGES[cur];
    lbCounter.textContent = String(cur + 1).padStart(2,'0') + ' / ' + String(PORTFOLIO_IMAGES.length).padStart(2,'0');
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

  document.querySelector('.pf-marquee').addEventListener('click', (e) => {
    const tile = e.target.closest('.pf-tile');
    if(!tile) return;
    e.preventDefault();
    const idx = parseInt(tile.dataset.idx, 10) || 0;
    open(idx);
  });
  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', () => setImg(cur - 1));
  lbNext.addEventListener('click', () => setImg(cur + 1));
  lb.addEventListener('click', (e) => { if(e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    else if(e.key === 'ArrowLeft') setImg(cur - 1);
    else if(e.key === 'ArrowRight') setImg(cur + 1);
  });
})();
