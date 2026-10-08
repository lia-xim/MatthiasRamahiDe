(function () {
  if (window.mrContactTurnstile) return;
  var widgets = new WeakMap();
  var loading;

  function loadApi() {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (!loading) {
      loading = new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.onload = function () { resolve(window.turnstile); };
        script.onerror = function () { loading = null; script.remove(); reject(new Error('load-failed')); };
        document.head.appendChild(script);
      });
    }
    return loading;
  }

  function mount(container) {
    var form = container.closest('form');
    if (!form || widgets.has(form)) return;
    var status = container.querySelector('[data-turnstile-status]');
    var state = { id: null, token: '', status: status };
    widgets.set(form, state);
    if (!container.dataset.sitekey) {
      status.textContent = 'Sicherheitsprüfung derzeit nicht verfügbar. Bitte direkt per E-Mail oder Telefon Kontakt aufnehmen.';
      return;
    }
    status.textContent = 'Sicherheitsprüfung wird geladen …';
    loadApi().then(function (api) {
      state.id = api.render(container.querySelector('[data-turnstile-widget]'), {
        sitekey: container.dataset.sitekey,
        action: 'contact',
        theme: 'auto',
        size: 'flexible',
        language: 'de',
        callback: function (token) { state.token = token; status.textContent = ''; },
        'expired-callback': function () { state.token = ''; api.reset(state.id); },
        'error-callback': function () {
          state.token = '';
          status.textContent = 'Sicherheitsprüfung fehlgeschlagen. Bitte erneut versuchen oder direkt Kontakt aufnehmen.';
        }
      });
    }).catch(function () {
      widgets.delete(form);
      status.textContent = 'Sicherheitsprüfung konnte nicht geladen werden. Bitte erneut versuchen oder direkt Kontakt aufnehmen.';
    });
  }

  window.mrContactTurnstile = {
    getToken: function (form) {
      var container = form.querySelector('[data-contact-turnstile]');
      if (container) mount(container);
      var state = widgets.get(form);
      if (!state || !state.token) throw new Error('Bitte die Sicherheitsprüfung abschließen und erneut senden.');
      return state.token;
    },
    reset: function (form) {
      var state = widgets.get(form);
      if (!state) return;
      state.token = '';
      if (window.turnstile && state.id !== null) window.turnstile.reset(state.id);
    }
  };

  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { mount(entry.target); observer.unobserve(entry.target); }
    });
  }, { rootMargin: '200px' }) : null;
  document.querySelectorAll('[data-contact-turnstile]').forEach(function (container) {
    if (observer) observer.observe(container);
    else mount(container);
  });
  document.addEventListener('focusin', function (event) {
    var form = event.target.closest && event.target.closest('form');
    var container = form && form.querySelector('[data-contact-turnstile]');
    if (container) mount(container);
  });
})();
