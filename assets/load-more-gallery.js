document.querySelectorAll('[data-load-more-gallery]').forEach((gallery) => {
  const section = gallery.closest('.gallery-loadmore')
  const button = section?.querySelector('[data-load-more-button]')
  const batchSize = Number(gallery.getAttribute('data-batch-size') || 12)
  if (!button) return

  button.addEventListener('click', () => {
    const hiddenItems = Array.from(gallery.querySelectorAll('[data-gallery-item][hidden]'))
    hiddenItems.slice(0, batchSize).forEach((item) => item.removeAttribute('hidden'))
    if (gallery.querySelectorAll('[data-gallery-item][hidden]').length === 0) {
      button.setAttribute('hidden', '')
    }
  })
})
