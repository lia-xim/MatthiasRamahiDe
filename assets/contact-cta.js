function trackContactEvent(name, detail) {
  var payload = Object.assign(
    {
      event: name,
      page: location.pathname,
      title: document.title,
      form: 'contact-cta',
    },
    detail || {},
  )
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
  document.dispatchEvent(new CustomEvent('mr:conversion', { detail: payload }))
}

document.addEventListener('focusin', function (event) {
  var form = event.target && event.target.closest && event.target.closest('.contact-cta__form')
  if (!form || form.dataset.started === 'true') return
  form.dataset.started = 'true'
  trackContactEvent('form_start', { subject: form.dataset.subject || 'Projektanfrage' })
})

document.addEventListener('submit', function (event) {
  const form = event.target
  if (!(form instanceof HTMLFormElement) || !form.matches('.contact-cta__form')) return
  event.preventDefault()

  const status = form.querySelector('.contact-cta__status')
  const data = new FormData(form)
  if (data.get('website')) {
    form.reset()
    if (status) status.textContent = 'Danke, deine Anfrage ist vorgemerkt.'
    return
  }

  const name = String(data.get('name') || '').trim()
  const contact = String(data.get('contact') || '').trim()
  const message = String(data.get('message') || '').trim()
  trackContactEvent('form_submit_attempt', {
    subject: form.dataset.subject || 'Projektanfrage',
    hasProject: Boolean(String(data.get('project') || '').trim()),
    hasDate: Boolean(String(data.get('date') || '').trim()),
    use: data.get('use') || 'Noch offen',
  })

  if (!name || !contact || !message) {
    if (status) status.textContent = 'Bitte Name, Kontaktweg und Projektbeschreibung ausfuellen.'
    trackContactEvent('form_validation_error', { subject: form.dataset.subject || 'Projektanfrage' })
    form.reportValidity()
    return
  }

  const body = [
    ['Seite', document.title],
    ['URL', location.href],
    ['Name', name],
    ['Kontakt', contact],
    ['Projekt / Motiv', data.get('project') || 'Noch offen'],
    ['Zeitraum', data.get('date') || 'Noch offen'],
    ['Nutzung', data.get('use') || 'Noch offen'],
    ['Telefon', data.get('phone') || 'Noch offen'],
    ['', ''],
    ['Nachricht', message],
  ]
    .map(function (row) {
      return row[0] ? row[0] + ': ' + row[1] : ''
    })
    .join(String.fromCharCode(10))

  const endpoint = form.dataset.endpoint || '/api/contact'
  const submit = form.querySelector('button[type="submit"]')

  function openMailFallback() {
    window.location.href =
      'mailto:' +
      encodeURIComponent(form.dataset.mailto || 'info@matthiasramahi.de') +
      '?subject=' +
      encodeURIComponent(form.dataset.subject || 'Projektanfrage') +
      '&body=' +
      encodeURIComponent(body)
    trackContactEvent('form_submit_fallback', { transport: 'mailto', subject: form.dataset.subject || 'Projektanfrage' })
  }

  if (status) status.textContent = 'Wird sicher uebertragen ...'
  if (submit) submit.disabled = true

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      subject: form.dataset.subject || 'Projektanfrage',
      source: location.pathname,
      pageTitle: document.title,
      pageUrl: location.href,
      name,
      contact,
      message,
      project: data.get('project') || '',
      date: data.get('date') || '',
      use: data.get('use') || '',
      phone: data.get('phone') || '',
      website: data.get('website') || '',
    }),
  })
    .then(function (response) {
      return response.json().catch(function () {
        return {}
      }).then(function (result) {
        if (!response.ok || !result.ok) throw new Error(result.error || 'HTTP ' + response.status)
        if (status) {
          status.textContent = result.queued
            ? 'Danke. Die Anfrage ist gesichert und wird automatisch zugestellt.'
            : 'Danke. Die Anfrage wurde versendet.'
        }
        trackContactEvent('form_submit_success', {
          transport: result.queued ? 'resend-queue' : 'resend',
          subject: form.dataset.subject || 'Projektanfrage',
          requestId: result.id || '',
        })
        form.reset()
      })
    })
    .catch(function () {
      if (status) status.textContent = 'Direktversand nicht moeglich. Mail-App wird als Fallback geoeffnet.'
      openMailFallback()
    })
    .finally(function () {
      if (submit) submit.disabled = false
    })
})
