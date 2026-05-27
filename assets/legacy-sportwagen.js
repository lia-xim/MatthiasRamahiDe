(function(){
  // Lazy fade-in for images
  function bindLazy(){
    document.querySelectorAll('img[loading="lazy"]').forEach(function(img){
      if(img.dataset.lzbound) return; img.dataset.lzbound='1';
      if(img.complete && img.naturalWidth>0){ img.classList.add('is-loaded'); return; }
      img.addEventListener('load', function(){ img.classList.add('is-loaded'); }, {once:true});
    });
  }
  bindLazy();

  // Triptychon hover focus
  var hero = document.querySelector('.hero-tri');
  if(hero && !matchMedia('(hover:none)').matches){
    var cols = hero.querySelectorAll('.tri-col');
    cols.forEach(function(col){
      col.addEventListener('mouseenter', function(){
        hero.dataset.hover = '1';
        cols.forEach(function(c){ c.classList.toggle('is-active', c===col); });
      });
    });
    var stage = hero.querySelector('.tri-stage');
    if(stage){
      stage.addEventListener('mouseleave', function(){
        hero.dataset.hover = '0';
        cols.forEach(function(c){ c.classList.remove('is-active'); });
      });
    }
  }

  // Mini-Portfolio — Live Contact Sheet + Lightbox
  (function(){
    var grid = document.getElementById('poGrid');
    if(!grid) return;
    var tiles = Array.prototype.slice.call(grid.querySelectorAll('.po-tile'));
    if(!tiles.length) return;

    // Stagger reveal on intersection
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(reduce){
      tiles.forEach(function(t){ t.classList.add('is-in'); });
    } else if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            tiles.forEach(function(t, i){
              setTimeout(function(){ t.classList.add('is-in'); }, 80 * i);
            });
            io.disconnect();
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
      io.observe(grid);
    } else {
      tiles.forEach(function(t){ t.classList.add('is-in'); });
    }

    // Build full-image list for lightbox (data-src from each tile's <img decoding="async" loading="lazy">)
    var IMAGES = tiles.map(function(t){
      var img = t.querySelector('img');
      return { src: img.getAttribute('src'), alt: img.getAttribute('alt') || '' };
    });

    // Lightbox wiring
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
})();
