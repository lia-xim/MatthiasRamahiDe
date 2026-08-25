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
  const desktopGrid = matchMedia('(min-width: 1121px)')

  const params = new URLSearchParams(location.search)
  const requestedCategory = params.get('category') || 'all'
  let activeFilter = filters.some(function (btn) { return btn.getAttribute('data-filter') === requestedCategory }) ? requestedCategory : 'all'
  let activeTag = (params.get('tag') || '').toLocaleLowerCase('de-DE')
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
    const categoryMatches = activeFilter === 'all' || post.getAttribute('data-category') === activeFilter
    const tags = (post.getAttribute('data-tags') || '').split('|')
    const tagMatches = !activeTag || tags.indexOf(activeTag) >= 0
    return categoryMatches && tagMatches
  }

  function render() {
    const matched = posts.filter(matches)
    const visiblePosts = []
    let shown = 0
    posts.forEach(function (post) {
      post.style.removeProperty('grid-column')
      const visible = matches(post) && matched.indexOf(post) < loadedCount
      if (visible) {
        post.classList.remove('hidden', 'not-loaded')
        if (io) io.observe(post)
        else post.classList.add('visible')
        visiblePosts.push(post)
        shown += 1
      } else {
        post.classList.add('hidden')
        post.classList.remove('visible')
      }
    })

    // Das Desktop-Raster hat zwoelf Spalten. Eine unvollstaendige letzte Reihe
    // verteilt den freien Platz gleichmaessig statt eine grosse und eine kleine
    // Karte nebeneinander stehen zu lassen.
    if (desktopGrid.matches && visiblePosts.length > 0) {
      visiblePosts.forEach(function (post) { post.style.gridColumn = 'span 4' })
      const remainder = visiblePosts.length % 3
      if (remainder === 2) {
        visiblePosts.slice(-2).forEach(function (post) { post.style.gridColumn = 'span 6' })
      } else if (remainder === 1) {
        visiblePosts[visiblePosts.length - 1].style.gridColumn = 'span 12'
      }
    }

    if (loadStatus) {
      const suffix = activeTag ? ' zum Thema „' + activeTag + '“' : ''
      loadStatus.textContent = Math.min(shown, matched.length) + ' von ' + matched.length + ' Beiträgen sichtbar' + suffix
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
    if (btn.getAttribute('data-filter') === activeFilter && !activeTag) btn.classList.add('active')
    else btn.classList.remove('active')
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active') })
      btn.classList.add('active')
      activeFilter = btn.getAttribute('data-filter') || 'all'
      activeTag = ''
      loadedCount = STEP
      const nextUrl = new URL(location.href)
      nextUrl.searchParams.delete('tag')
      if (activeFilter === 'all') nextUrl.searchParams.delete('category')
      else nextUrl.searchParams.set('category', activeFilter)
      history.replaceState(null, '', nextUrl.pathname + nextUrl.search + '#journal')
      render()
      const head = document.querySelector('.journal-head')
      if (head) head.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    })
  })

  if (desktopGrid.addEventListener) desktopGrid.addEventListener('change', render)

  render()
})()
