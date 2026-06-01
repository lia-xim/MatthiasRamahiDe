/* =====================================================================
   Analytics Bridge — Umami (analytics.contextter.com)
   ---------------------------------------------------------------------
   Umami selbst erfasst Page Views automatisch (cookiefrei, DSGVO-freundlich).
   Dieses Script ergaenzt die Event-Ebene:

   1) Bruecke der bestehenden Conversion-Oberflaeche: site-chrome.js und
      contact-cta.js feuern bereits `mr:conversion` CustomEvents fuer das
      komplette Formular-Funnel und CTA-Klicks. Die werden hier 1:1 als
      saubere Umami-Events weitergereicht — keine doppelte Pflege noetig.

   2) Zusatz-Tracking ohne Markup-Aenderung (delegierte Listener):
        - Kontaktkanaele:   tel / mailto / WhatsApp
        - Social-Klicks:    Instagram, etc.
        - Outbound-Links:   alle externen Links
        - Scrolltiefe:      25 / 50 / 75 / 100 %
        - Verweildauer:     30 / 60 / 120 s aktive Zeit
        - Galerie:          "Mehr Bilder laden"
        - FAQ:              Aufklappen einer Frage

   Umami-Limits: Event-Name <= 50 Zeichen, Property-Werte string|number|
   boolean. clean() haelt das ein. Bei nicht geladenem Umami (z. B. lokal,
   Preview, oder durch data-domains gesperrt) werden Events kurz gepuffert
   und dann verworfen — nie blockierend, nie endlos.
   ===================================================================== */

(function () {
  'use strict';

  /* ---------- Umami-Wrapper: puffert bis das Script bereit ist ---------- */
  var queue = [];
  var flushTimer = 0;
  var attempts = 0;
  var MAX_ATTEMPTS = 40; // ~12 s, dann aufgeben (z. B. lokal/Preview)
  var MAX_QUEUE = 50;

  function umamiReady() {
    return typeof window.umami !== 'undefined' && typeof window.umami.track === 'function';
  }

  function flush() {
    flushTimer = 0;
    if (!umamiReady()) {
      if (attempts++ >= MAX_ATTEMPTS) {
        queue.length = 0;
        return;
      }
      flushTimer = window.setTimeout(flush, 300);
      return;
    }
    while (queue.length) {
      var item = queue.shift();
      try {
        item.data ? window.umami.track(item.name, item.data) : window.umami.track(item.name);
      } catch (err) {}
    }
  }

  function track(name, data) {
    if (!name) return;
    if (queue.length >= MAX_QUEUE) return;
    queue.push({ name: String(name).slice(0, 50), data: clean(data) });
    if (umamiReady()) flush();
    else if (!flushTimer) flushTimer = window.setTimeout(flush, 300);
  }

  /* Nur valide Umami-Property-Typen behalten, Strings kuerzen. */
  function clean(obj) {
    if (!obj) return undefined;
    var out = {};
    Object.keys(obj).forEach(function (k) {
      var v = obj[k];
      if (v === null || v === undefined || v === '') return;
      if (typeof v === 'string') out[k] = v.replace(/\s+/g, ' ').trim().slice(0, 180);
      else if (typeof v === 'number' || typeof v === 'boolean') out[k] = v;
    });
    return Object.keys(out).length ? out : undefined;
  }

  function hostOf(url) {
    try {
      return new URL(url, location.href).hostname.replace(/^www\./, '');
    } catch (err) {
      return '';
    }
  }

  /* =====================================================================
     1) Bruecke: mr:conversion -> Umami
     ===================================================================== */
  var EVENT_NAME_MAP = {
    cta_click: 'cta-click',
    form_start: 'form-start',
    form_submit_attempt: 'form-submit-attempt',
    form_validation_error: 'form-validation-error',
    form_submit_success: 'form-submit', // primaere Conversion
    form_submit_fallback: 'form-submit-mailto',
    form_honeypot: 'form-honeypot'
  };
  var CONVERSION_PROPS = [
    'form', 'subject', 'transport', 'role', 'placement', 'text', 'href',
    'intent', 'use', 'reason', 'requestId',
    'lastCta', 'lastCtaRole', 'durationSeconds', 'lastField'
  ];

  document.addEventListener('mr:conversion', function (e) {
    var d = (e && e.detail) || {};
    var raw = d.event || 'conversion';
    var name = EVENT_NAME_MAP[raw] || String(raw).replace(/_/g, '-');
    var data = {};
    CONVERSION_PROPS.forEach(function (k) {
      if (d[k] !== undefined) data[k] = d[k];
    });
    if (d.hasProject !== undefined) data.hasProject = !!d.hasProject;
    if (d.hasDate !== undefined) data.hasDate = !!d.hasDate;
    track(name, data);
  });

  /* =====================================================================
     2a) Klick-Klassifizierung: Kontaktkanaele / Social / Outbound
     ===================================================================== */
  var SOCIAL = {
    'instagram.com': 'instagram',
    'facebook.com': 'facebook',
    'linkedin.com': 'linkedin',
    'youtube.com': 'youtube',
    'youtu.be': 'youtube',
    'tiktok.com': 'tiktok',
    'pinterest.com': 'pinterest',
    'pinterest.de': 'pinterest',
    'behance.net': 'behance',
    'x.com': 'x',
    'twitter.com': 'x',
    'threads.net': 'threads',
    'vimeo.com': 'vimeo'
  };

  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#') return;

    var lower = href.toLowerCase();
    var label = (link.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);

    if (lower.indexOf('tel:') === 0) {
      track('contact-phone', { href: href, label: label });
      return;
    }
    if (lower.indexOf('mailto:') === 0) {
      track('contact-email', { href: href, label: label });
      return;
    }

    var host = hostOf(href);
    if (!host) return; // relativ / interne Sprungmarke ohne Host

    if (host.indexOf('wa.me') !== -1 || host.indexOf('whatsapp.com') !== -1) {
      track('contact-whatsapp', { href: href });
      return;
    }

    // Social-Netzwerke (auch Subdomains wie de.linkedin.com)
    var network = null;
    Object.keys(SOCIAL).forEach(function (domain) {
      if (host === domain || host.indexOf('.' + domain) !== -1 || host.indexOf(domain) === 0) {
        network = SOCIAL[domain];
      }
    });
    if (network) {
      track('social-click', { network: network, href: href });
      return;
    }

    // Restliche externe Links
    if (host !== location.hostname.replace(/^www\./, '')) {
      track('outbound-link', { domain: host, href: href.slice(0, 180) });
    }
  }, { capture: true });

  /* =====================================================================
     2b) Galerie "Mehr laden" + FAQ aufklappen
     ===================================================================== */
  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest && e.target.closest('[data-load-more-button]');
    if (btn) track('gallery-load-more', { page: location.pathname });
  });

  // FAQ: native <details> oder Akkordeons mit aria-expanded
  document.addEventListener('toggle', function (e) {
    var el = e.target;
    if (!el || el.tagName !== 'DETAILS' || !el.open) return;
    // Anfrage-Form-Details ("Projektangaben ergaenzen") = Engagement-Signal, kein FAQ
    if (el.classList && el.classList.contains('contact-cta__details')) {
      track('form-expand', { form: 'contact-cta', page: location.pathname });
      return;
    }
    var summary = el.querySelector('summary');
    var q = summary ? (summary.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120) : '';
    track('faq-open', { question: q, page: location.pathname });
  }, { capture: true });

  /* =====================================================================
     2e) Formular-Abbruch — wer anfaengt, aber nicht absendet
     Wichtigste Funnel-Insight: Abbruchquote + das zuletzt erreichte Feld
     (= ungefaehre Aussteiger-Position). Erfolgreicher Versand ODER
     mailto-Fallback zaehlen NICHT als Abbruch.
     ===================================================================== */
  (function () {
    var FORM_SEL = '.contact-cta__form, .mr-contact__form';
    var started = false;
    var completed = false;
    var abandonSent = false;
    var formName = '';
    var lastField = '';

    document.addEventListener('focusin', function (e) {
      var control = e.target && e.target.closest && e.target.closest('input,textarea,select');
      if (!control) return;
      var form = control.closest(FORM_SEL);
      if (!form) return;
      started = true;
      formName = form.classList.contains('mr-contact__form') ? 'mr-contact' : 'contact-cta';
      var n = control.getAttribute('name');
      if (n && n !== 'website') lastField = n; // Honeypot ignorieren
    }, true);

    document.addEventListener('mr:conversion', function (e) {
      var ev = e && e.detail && e.detail.event;
      if (ev === 'form_submit_success' || ev === 'form_submit_fallback') completed = true;
    });

    function maybeAbandon() {
      if (abandonSent || !started || completed) return;
      abandonSent = true;
      // pagehide laesst keine Zeit fuer den 300ms-Puffer -> track() flusht
      // synchron, wenn Umami bereit ist (sendet via Beacon).
      track('form-abandon', { form: formName, lastField: lastField, page: location.pathname });
    }
    window.addEventListener('pagehide', maybeAbandon);
  })();

  /* =====================================================================
     2f) CTA-Impressionen — ermoeglicht Click-Through-Rate je Platzierung
     (cta-view vs. cta-click mit gleichem `placement`).
     ===================================================================== */
  (function () {
    if (!('IntersectionObserver' in window)) return;

    function collect() {
      var targets = [];
      function add(sel, placement) {
        document.querySelectorAll(sel).forEach(function (el) {
          targets.push({ el: el, placement: placement });
        });
      }
      add('.topbar__cta', 'header');
      add('.mr-sticky-cta', 'sticky');
      add('.contact-cta, .mr-contact, [data-contact-section]', 'contact');
      add('.mr-exit-cta', 'exit');
      return targets;
    }

    var targets = collect();
    if (!targets.length) return;

    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var match = targets.filter(function (x) { return x.el === entry.target; })[0];
        var placement = match ? match.placement : 'body';
        if (seen[placement]) return; // pro Platzierung nur einmal zaehlen
        seen[placement] = true;
        track('cta-view', { placement: placement, page: location.pathname });
      });
    }, { threshold: 0.4 });

    targets.forEach(function (t) { io.observe(t.el); });
  })();

  /* =====================================================================
     2c) Scrolltiefe — 25 / 50 / 75 / 100 %
     ===================================================================== */
  (function () {
    var marks = [25, 50, 75, 100];
    var fired = {};
    var raf = 0;

    function measure() {
      raf = 0;
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      var pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (var i = 0; i < marks.length; i++) {
        var m = marks[i];
        if (pct >= m && !fired[m]) {
          fired[m] = true;
          track('scroll-depth', { percent: m, page: location.pathname });
        }
      }
      if (fired[100]) {
        window.removeEventListener('scroll', schedule);
      }
    }
    function schedule() {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('load', schedule);
    schedule();
  })();

  /* =====================================================================
     2d) Aktive Verweildauer — 30 / 60 / 120 s
     Zaehlt nur, solange der Tab sichtbar ist (echtes Engagement).
     ===================================================================== */
  (function () {
    var marks = [30, 60, 120];
    var idx = 0;
    var active = 0; // aktive Sekunden
    var timer = 0;

    function tick() {
      active += 1;
      while (idx < marks.length && active >= marks[idx]) {
        track('engaged-time', { seconds: marks[idx], page: location.pathname });
        idx++;
      }
      if (idx >= marks.length) stop();
    }
    function start() {
      if (timer || idx >= marks.length) return;
      timer = window.setInterval(tick, 1000);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = 0; }
    }
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
    if (!document.hidden) start();
  })();
})();
