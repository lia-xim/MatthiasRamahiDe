(() => {
  const root = document.documentElement;
  const topbar = document.querySelector('.topbar');
  const menuToggle = document.querySelector('.menu-toggle');
  menuToggle?.addEventListener('click', () => {
    const open = topbar.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });
  document.querySelectorAll('.topbar nav a').forEach((a) => a.addEventListener('click', () => {
    topbar?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  let tx = .72, ty = .34, cx = tx, cy = ty, raf = false;
  function pointerFrame(){
    cx += (tx - cx) * .12; cy += (ty - cy) * .12;
    root.style.setProperty('--mx', (cx * 100).toFixed(2) + '%');
    root.style.setProperty('--my', (cy * 100).toFixed(2) + '%');
    root.style.setProperty('--mxn', (cx - .5).toFixed(4));
    root.style.setProperty('--myn', (cy - .5).toFixed(4));
    raf = false;
    if (Math.abs(tx - cx) > .001 || Math.abs(ty - cy) > .001) { raf = true; requestAnimationFrame(pointerFrame); }
  }
  addEventListener('pointermove', (event) => {
    tx = event.clientX / innerWidth; ty = event.clientY / innerHeight;
    if (!raf) { raf = true; requestAnimationFrame(pointerFrame); }
  }, { passive: true });

  const calibrationHero = document.querySelector('.auto-calibration');
  const calibrationStage = calibrationHero?.querySelector('.calibration-stage');
  if (calibrationHero && calibrationStage) {
    const setCalibrationPoint = (event) => {
      const rect = calibrationStage.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height)));
      calibrationHero.style.setProperty('--cal-x', `${(x * 100).toFixed(2)}%`);
      calibrationHero.style.setProperty('--cal-y', `${(y * 100).toFixed(2)}%`);
    };
    calibrationStage.addEventListener('pointermove', setCalibrationPoint, { passive: true });
    calibrationStage.addEventListener('pointerleave', () => {
      calibrationHero.style.setProperty('--cal-x', '62%');
      calibrationHero.style.setProperty('--cal-y', '44%');
    }, { passive: true });
  }

  function parseColor(value, fallback) {
    const text = String(value || '').trim();
    const hex = text.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
      const raw = hex[1].length === 3 ? hex[1].split('').map((c) => c + c).join('') : hex[1];
      const int = parseInt(raw, 16);
      return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
    }
    return fallback;
  }

  function initHeroShader(heroEl) {
    if (!heroEl || heroEl.classList.contains('concept-hero') || document.body.classList.contains('service-auto') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-shader';
    canvas.setAttribute('aria-hidden', 'true');
    heroEl.prepend(canvas);
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true });
    if (!gl) { canvas.remove(); return; }

    const vertex = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    const fragment = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_scroll;
      uniform float u_intensity;
      uniform vec3 u_tone;
      uniform vec3 u_tone2;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = mat2(1.62, 1.08, -1.08, 1.62) * p + 0.17;
          a *= 0.52;
        }
        return v;
      }
      float softEllipse(vec2 p, vec2 center, vec2 radius, float falloff) {
        vec2 q = (p - center) / radius;
        return exp(-dot(q, q) * falloff);
      }

      void main() {
        vec2 uv = v_uv;
        float aspect = u_resolution.x / max(u_resolution.y, 1.0);
        vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
        vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);

        vec2 local = (p - m);
        float focus = softEllipse(p, m, vec2(0.34, 0.22), 2.9);
        float inner = softEllipse(p, m, vec2(0.17, 0.105), 3.9);
        float shoulder = softEllipse(p, m + vec2(0.055, -0.035), vec2(0.52, 0.30), 4.2);

        float glass = fbm(local * 7.5 + vec2(u_time * 0.030, -u_time * 0.024));
        float micro = fbm(local * 18.0 + vec2(-u_time * 0.022, u_time * 0.018));
        float texture = smoothstep(0.30, 0.92, glass * 0.72 + micro * 0.28);

        vec3 neutralChrome = vec3(0.86, 0.91, 0.88);
        vec3 warmTint = mix(neutralChrome, u_tone, 0.22);
        vec3 coolTint = mix(neutralChrome, u_tone2, 0.16);
        vec3 color = mix(coolTint, warmTint, texture);
        color = mix(color, neutralChrome, inner * 0.54);

        float alpha = (focus * 0.11 + inner * 0.18 + shoulder * texture * 0.08) * u_intensity;
        alpha *= 1.0 - smoothstep(0.58, 0.95, length(local));
        gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.28));
      }
    `;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'shader compile failed');
      return shader;
    };

    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'shader link failed');
    } catch (error) {
      canvas.remove();
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    const uniforms = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
      time: gl.getUniformLocation(program, 'u_time'),
      scroll: gl.getUniformLocation(program, 'u_scroll'),
      intensity: gl.getUniformLocation(program, 'u_intensity'),
      tone: gl.getUniformLocation(program, 'u_tone'),
      tone2: gl.getUniformLocation(program, 'u_tone2'),
    };
    const styles = getComputedStyle(root);
    const tone = parseColor(styles.getPropertyValue('--tone'), [0.82, 0.22, 0.18]);
    const tone2 = parseColor(styles.getPropertyValue('--tone-2'), [0.30, 0.45, 0.58]);
    const strength = parseFloat(styles.getPropertyValue('--shader-strength')) || 1;
    const localClamp = (n, min, max) => Math.max(min, Math.min(max, n));
    let width = 0;
    let height = 0;

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1.05 : 1.55);
      const nextWidth = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const nextHeight = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (nextWidth === width && nextHeight === height) return;
      width = canvas.width = nextWidth;
      height = canvas.height = nextHeight;
      gl.viewport(0, 0, width, height);
    }

    function render(time) {
      resize();
      const rect = heroEl.getBoundingClientRect();
      const scroll = localClamp(-rect.top / Math.max(1, rect.height - innerHeight * 0.55), 0, 1);
      const visible = rect.bottom > 0 && rect.top < innerHeight;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.enableVertexAttribArray(position);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uniforms.resolution, width, height);
      gl.uniform2f(uniforms.mouse, cx, 1 - cy);
      gl.uniform1f(uniforms.time, time * 0.001);
      gl.uniform1f(uniforms.scroll, scroll);
      gl.uniform1f(uniforms.intensity, (innerWidth < 760 ? 0.58 : 1.0) * strength);
      gl.uniform3fv(uniforms.tone, tone);
      gl.uniform3fv(uniforms.tone2, tone2);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (visible || time < 2000) requestAnimationFrame(render);
      else setTimeout(() => requestAnimationFrame(render), 250);
    }
    addEventListener('resize', resize, { passive: true });
    requestAnimationFrame(render);
  }

  initHeroShader(document.querySelector('.hero'));

  const revealTargets = [...document.querySelectorAll('.module, .step, .strip-img, .mr-footer')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible', 'in-view');
          if (!entry.target.classList.contains('mr-footer')) io.unobserve(entry.target);
        }
      });
    }, { threshold: .18 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('visible', 'in-view'));
  }

  const hero = document.querySelector('.hero');
  const stripImages = [...document.querySelectorAll('.gallery-strip')];
  const header = document.querySelector('.topbar');
  let scrollRaf = false;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  function updateScroll(){
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, rect.height - innerHeight * .5), 0, 1);
      hero.style.setProperty('--scrollP', p.toFixed(4));
    }
    stripImages.forEach((strip) => {
      const r = strip.getBoundingClientRect();
      const p = clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1);
      strip.style.setProperty('--p', p.toFixed(4));
    });
    if (header && innerWidth > 920) {
      const y = Math.max(10, Math.min(innerHeight - 10, header.getBoundingClientRect().top + 30));
      const stack = document.elementsFromPoint(innerWidth / 2, y).filter((el) => !header.contains(el));
      const marker = stack.map((el) => el.closest?.('[data-header-theme]')).find(Boolean);
      header.classList.toggle('header-on-light', marker?.dataset.headerTheme === 'light');
    }
    scrollRaf = false;
  }
  function queueScroll(){ if (!scrollRaf) { scrollRaf = true; requestAnimationFrame(updateScroll); } }
  addEventListener('scroll', queueScroll, { passive: true });
  addEventListener('resize', queueScroll, { passive: true });
  updateScroll();

  document.querySelectorAll('form[data-mailto]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(data.get('subject') || form.dataset.subject || 'Fotografie-Anfrage');
      const lines = [];
      for (const [key, value] of data.entries()) {
        if (key === 'subject') continue;
        lines.push(`${key}: ${value || '—'}`);
      }
      location.href = `mailto:${form.dataset.mailto}?subject=${subject}&body=${encodeURIComponent(lines.join('\n'))}`;
      const status = form.querySelector('.form-status');
      if (status) status.textContent = 'Ihr E-Mail-Programm wird geöffnet.';
    });
  });
})();
