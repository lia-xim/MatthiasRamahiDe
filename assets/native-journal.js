// Journal index — Beiträge einblenden (Reveal), „Mehr laden" und Kategorie-Filter.
// Ohne dieses Script bleiben die .post-Karten auf opacity:0 stehen (unsichtbar).
(function () {
  const postGrid = document.querySelector('.post-grid')
  if (!postGrid) return

  const posts = Array.prototype.slice.call(postGrid.querySelectorAll('.post'))
  const loadPanel = document.getElementById('loadPanel')
  const loadMore = document.getElementById('loadMore')
  const loadStatus = document.getElementById('loadStatus')
  const filters = Array.prototype.slice.call(document.querySelectorAll('.filter'))
  const STEP = 6

  let activeFilter = 'all'
  let loadedCount = STEP

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  let io = null
  if (!reduce && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
  }

  function matches(post) {
    return activeFilter === 'all' || post.getAttribute('data-category') === activeFilter
  }

  function render() {
    const matched = posts.filter(matches)
    let shown = 0
    posts.forEach(function (post) {
      const visible = matches(post) && matched.indexOf(post) < loadedCount
      if (visible) {
        post.classList.remove('hidden', 'not-loaded')
        if (io) io.observe(post)
        else post.classList.add('visible')
        shown += 1
      } else {
        post.classList.add('hidden')
        post.classList.remove('visible')
      }
    })

    if (loadStatus) {
      loadStatus.textContent = Math.min(shown, matched.length) + ' von ' + matched.length + ' Beiträgen sichtbar'
    }
    if (loadPanel) {
      if (matched.length > loadedCount) loadPanel.removeAttribute('hidden')
      else loadPanel.setAttribute('hidden', '')
    }
  }

  if (loadMore) {
    loadMore.addEventListener('click', function () {
      loadedCount += STEP
      render()
    })
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active') })
      btn.classList.add('active')
      activeFilter = btn.getAttribute('data-filter') || 'all'
      loadedCount = STEP
      render()
      const head = document.querySelector('.journal-head')
      if (head) head.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    })
  })

  render()
})()
