(() => {
  const hero = document.querySelector('.kd-hero')
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  let raf = 0
  let nextX = 0.66
  let nextY = 0.42

  const write = () => {
    raf = 0
    document.documentElement.style.setProperty('--kd-mx', String(nextX.toFixed(3)))
    document.documentElement.style.setProperty('--kd-my', String(nextY.toFixed(3)))
  }

  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect()
    nextX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    nextY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
    if (!raf) raf = window.requestAnimationFrame(write)
  }, { passive: true })
})();

(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const bgSlides = Array.from(document.querySelectorAll('[data-kd-hero-slide]'))
  const label = document.querySelector('[data-kd-hero-label]')
  if (!bgSlides.length) return

  const labels = ['Keyword-Details', 'Listenansicht', 'Discovery', 'Wettbewerb']
  let active = 0

  const activate = (next) => {
    bgSlides[active]?.classList.remove('is-active')
    active = next % bgSlides.length
    bgSlides[active]?.classList.add('is-active')
    if (label) label.textContent = labels[active] || 'App-Ansicht'
  }

  window.setInterval(() => activate(active + 1), 5200)
})();

(() => {
  const items = document.querySelectorAll(
    '.kd-focus article,.kd-wide-shot,.kd-product-row,.kd-media-card,.kd-flow__steps article,.kd-faq article',
  )
  if (!items.length || !('IntersectionObserver' in window)) return

  items.forEach((item) => item.classList.add('kd-reveal'))
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  }, { threshold: 0.16 })

  items.forEach((item) => observer.observe(item))
})();
