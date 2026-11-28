document.querySelectorAll('[data-load-more-gallery]').forEach((gallery) => {
  const section = gallery.closest('.gallery-loadmore')
  const button = section?.querySelector('[data-load-more-button]')
  const batchSize = Number(gallery.getAttribute('data-batch-size') || 12)

  function promoteImage(img) {
    if (!img) return
    if (img.loading === 'lazy') {
      img.loading = 'eager'
    }
    if (img.complete && img.naturalWidth === 0 && img.dataset.mrScrollRetry !== '1') {
      const retrySrc = img.currentSrc || img.getAttribute('src')
      if (retrySrc) {
        img.dataset.mrScrollRetry = '1'
        img.src = retrySrc
      }
    }
  }

  function promoteVisibleNearViewport() {
    const vh = window.innerHeight || document.documentElement.clientHeight || 900
    const imgs = gallery.querySelectorAll('[data-gallery-item]:not([hidden]) img')
    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) return
      const rect = img.getBoundingClientRect()
      if (rect.bottom >= -600 && rect.top <= vh + 1200) {
        promoteImage(img)
      }
    })
  }

  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          imgObserver.unobserve(entry.target)
          promoteImage(entry.target)
        })
      },
      { rootMargin: '1200px 0px 1200px 0px' },
    )
    gallery.querySelectorAll('[data-gallery-item]:not([hidden]) img').forEach((img) => {
      imgObserver.observe(img)
    })
  } else {
    gallery.querySelectorAll('[data-gallery-item]:not([hidden]) img').forEach(promoteImage)
  }

  let scrollTimer = 0
  const schedulePromote = () => {
    if (scrollTimer) window.clearTimeout(scrollTimer)
    scrollTimer = window.setTimeout(promoteVisibleNearViewport, 120)
  }
  window.addEventListener('scroll', schedulePromote, { passive: true })
  if ('onscrollend' in window) {
    window.addEventListener('scrollend', promoteVisibleNearViewport, { passive: true })
  }
  window.addEventListener('resize', schedulePromote, { passive: true })
  promoteVisibleNearViewport()

  if (!button) return

  button.addEventListener('click', () => {
    const hiddenItems = Array.from(gallery.querySelectorAll('[data-gallery-item][hidden]'))
    hiddenItems.slice(0, batchSize).forEach((item) => {
      item.removeAttribute('hidden')
      item.querySelectorAll('img').forEach(promoteImage)
    })
    if (gallery.querySelectorAll('[data-gallery-item][hidden]').length === 0) {
      button.setAttribute('hidden', '')
    }
  })
})
