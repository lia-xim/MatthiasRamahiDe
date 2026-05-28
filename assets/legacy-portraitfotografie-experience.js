(function(){
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Mark ready so hero words fade up
      setTimeout(()=>document.body.classList.add('ready'), 30);

      /* -------- Topbar mobile menu -------- */
      const bar = document.getElementById('topbar');
      const tog = bar && bar.querySelector('.menu-toggle');
      if(tog){
        tog.addEventListener('click', ()=>{
          const open = bar.classList.toggle('open');
          tog.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        bar.querySelectorAll('nav a').forEach(a=>a.addEventListener('click', ()=>bar.classList.remove('open')));
      }

      /* -------- Cinematic chamber: cursor spotlight -------- */
      const chamber = document.querySelector('.chamber');
      const spot = document.getElementById('chamberSpot');
      const halo = document.getElementById('chamberHalo');
      const plate = chamber && chamber.querySelector('.chamber__plate img');
      if(chamber && spot && !reduce){
        let raf=0, tx=50, ty=50, cx=50, cy=50;
        const apply = ()=>{
          cx += (tx-cx)*.12; cy += (ty-cy)*.12;
          spot.style.setProperty('--cx', cx+'%');
          spot.style.setProperty('--cy', cy+'%');
          if(halo){
            halo.style.setProperty('--cx', cx+'%');
            halo.style.setProperty('--cy', cy+'%');
          }
          if(plate){
            const dx = (cx-50)/50, dy = (cy-50)/50;
            plate.style.transform = `scale(1.06) translate(${dx*-1.6}%, ${dy*-1.6}%)`;
          }
          raf = Math.abs(tx-cx)+Math.abs(ty-cy) > .1 ? requestAnimationFrame(apply) : 0;
        };
        chamber.addEventListener('pointermove', e=>{
          const r = chamber.getBoundingClientRect();
          tx = ((e.clientX - r.left)/r.width)*100;
          ty = ((e.clientY - r.top)/r.height)*100;
          if(!raf) raf = requestAnimationFrame(apply);
        });
        chamber.addEventListener('pointerleave', ()=>{
          tx = 50; ty = 52; if(!raf) raf = requestAnimationFrame(apply);
        });
        spot.style.setProperty('--cx','50%'); spot.style.setProperty('--cy','52%');
      }

      /* -------- Lighting Location -------- */
      const subject = document.getElementById('locationSubject');
      const marker = document.getElementById('locationMarker');
      const stageBox = document.getElementById('locationStage');
      const chips = document.querySelectorAll('.location__chips button');

      const setLight = (lx, ly)=>{
        if(subject){ subject.style.setProperty('--lx', lx); subject.style.setProperty('--ly', ly); }
        if(marker){ marker.style.setProperty('--lx', lx); marker.style.setProperty('--ly', ly); }
      };

      chips.forEach(btn=>{
        btn.addEventListener('click', ()=>{
          chips.forEach(b=>b.classList.remove('active'));
          btn.classList.add('active');
          setLight(btn.dataset.lx, btn.dataset.ly);
        });
      });

      // Drag the marker manually for fine control
      if(stageBox && marker && subject && !reduce){
        let dragging = false;
        const onMove = e=>{
          if(!dragging) return;
          const r = stageBox.getBoundingClientRect();
          const x = Math.max(2, Math.min(98, ((e.clientX - r.left)/r.width)*100));
          const y = Math.max(2, Math.min(98, ((e.clientY - r.top)/r.height)*100));
          setLight(x+'%', y+'%');
          chips.forEach(b=>b.classList.remove('active'));
        };
        marker.addEventListener('pointerdown', e=>{ dragging = true; marker.setPointerCapture(e.pointerId); });
        marker.addEventListener('pointermove', onMove);
        marker.addEventListener('pointerup', ()=>dragging=false);
        marker.addEventListener('pointercancel', ()=>dragging=false);
        marker.style.cursor = 'grab';
      }

      /* -------- Anatomie: scroll-trigger + note↔line hover linking -------- */
      const anatomy = document.querySelector('.anatomy');
      if(anatomy){
        if(reduce){
          anatomy.classList.add('in');
        } else {
          const io = new IntersectionObserver((entries)=>{
            entries.forEach(en=>{
              if(en.isIntersecting){
                anatomy.classList.add('in');
                io.unobserve(en.target);
              }
            });
          }, { threshold: 0.22, rootMargin: '0px 0px -10% 0px' });
          io.observe(anatomy);
        }

        const notes = anatomy.querySelectorAll('.anatomy__note');
        const lines = anatomy.querySelectorAll('.anatomy__svg path');
        const setHot = (key, on)=>{
          lines.forEach(l=>{
            if(l.dataset.link === key) l.classList.toggle('is-hot', on);
          });
        };
        notes.forEach(n=>{
          const key = n.dataset.link;
          n.addEventListener('mouseenter', ()=>setHot(key, true));
          n.addEventListener('mouseleave', ()=>setHot(key, false));
          n.addEventListener('focusin',  ()=>setHot(key, true));
          n.addEventListener('focusout', ()=>setHot(key, false));
        });
      }

    })();
