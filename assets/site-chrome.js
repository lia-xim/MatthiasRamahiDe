/* =====================================================================
   Site Chrome — Header/Footer JavaScript
   - Theme-Switch: Header-Textfarbe wechselt zwischen hell und dunkel,
     basierend auf data-theme der gerade sichtbaren Sektion.
   - Dropdown: Fotografie-Untermenü öffnet sich per Hover (Desktop)
     und per Klick/Tap (Touch + Mobile).
   - Mobile Overlay: Menü-Toggle öffnet/schließt das Vollbild-Menü.
   - Aktiver Zustand: data-current auf <header data-current="..."> wird
     auf passende Nav-Links und Submenu-Links übertragen.
   ===================================================================== */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  }

  ready(function () {
    const bar = document.getElementById('topbar');
    if (!bar) return;

    /* ---------- Theme switch ---------------------------------------------
       Probe the element that is currently sitting directly under the header.
       This is bullet-proof: regardless of section height, the bar adopts
       the theme of whatever data-theme section is at the top of the viewport.
       (IntersectionObserver with band + ratio drifts on tall/short sections.)
       --------------------------------------------------------------------- */
    (function () {
      let last = null;
      let raf = 0;

      function probe() {
        raf = 0;
        // Use the actual on-screen bottom of the header, not offsetHeight.
        // (header is position:fixed with top:18, so offsetHeight alone misses the offset.)
        const rect = bar.getBoundingClientRect();
        const baseY = Math.ceil(rect.bottom) + 4;
        const cx = Math.round(window.innerWidth / 2);
        // Probe several (x, y) combinations. The y-cascade matters: pages where
        // <main> has top padding will resolve to a bare <main> at baseY, so we
        // step further down until we hit a themed section.
        const ys = [baseY, baseY + 40, baseY + 80, baseY + 140, baseY + 220];
        const xs = [cx, cx - 120, cx + 120, 40, window.innerWidth - 40];
        let theme = null;
        outer: for (let j = 0; j < ys.length; j++) {
          for (let i = 0; i < xs.length; i++) {
            const el = document.elementFromPoint(xs[i], ys[j]);
            if (!el) continue;
            // Skip anything that lives inside the topbar itself
            if (bar.contains(el)) continue;
            // Accept both data-theme (used on index.html) and data-header-theme
            // (used on every other page). Whichever ancestor we hit first wins.
            const sec = el.closest('[data-theme],[data-header-theme]');
            if (sec) {
              const t = sec.dataset.theme || sec.dataset.headerTheme;
              if (t) { theme = t; break outer; }
            }
          }
        }
        if (!theme || theme === last) return;
        last = theme;
        bar.classList.toggle('theme-light', theme === 'light');
      }
      function schedule() {
        if (raf) return;
        raf = requestAnimationFrame(probe);
      }

      // Initial pass after layout settles
      requestAnimationFrame(probe);
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      // Re-probe after images/fonts load (header height can change)
      window.addEventListener('load', function () { last = null; schedule(); });
    })();

    /* ---------- Active state — auto-detected from location.pathname ----- */
    (function () {
      const mobileMenu = document.getElementById('mobile-menu');
      const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

      // Explicit pathname → nav key map
      const map = {
        'index.html':                                   'home',
        '':                                             'home',
        'portfolio.html':                               'portfolio',
        'ueber-mich.html':                              'ueber-mich',
        'blog.html':                                    'blog',
        'leistungen.html':                              'leistungen',
        'contact.html':                                 'kontakt',
        'automobil-fotografie-duesseldorf.html':        'fotografie:automobil',
        'sportwagen-fotografie-duesseldorf.html':       'fotografie:sportwagen',
        'oldtimer-fotografie-duesseldorf.html':         'fotografie:oldtimer',
        'motorrad-fotografie-duesseldorf.html':         'fotografie:motorrad',
        'portraitfotografie-duesseldorf.html':          'fotografie:portrait',
        'landschaftsfotografie-duesseldorf.html':       'fotografie:landschaft'
      };
      let current = map[path] || '';
      if (!current) {
        if (/^(automobil-fotografie|automotive-fotografie|autofotografie|fahrzeugfotografie|autohaus-fotografie|autoverkauf-fotos)-/.test(path)) current = 'fotografie:automobil';
        else if (/^(sportwagen-fotografie|sportwagen-shooting|sportwagen-fotoshooting|performance-car-fotografie|exotic-car-fotografie|supersportwagen-fotografie)-/.test(path)) current = 'fotografie:sportwagen';
        else if (/^(oldtimer-fotografie|classic-car-fotografie|oldtimer-shooting|youngtimer-fotografie|sammlerfahrzeug-fotografie|oldtimer-verkaufsfotos)-/.test(path)) current = 'fotografie:oldtimer';
        else if (/^(motorrad-fotografie|motorrad-shooting|bike-fotografie|custom-bike-fotografie|motorrad-verkaufsfotos|biker-portrait)-/.test(path)) current = 'fotografie:motorrad';
        else if (/^(portraitfotografie|business-portrait|headshot-fotograf|personal-branding-fotografie|unternehmensportrait|pressefoto)-/.test(path)) current = 'fotografie:portrait';
        else if (/^(landschaftsfotografie|landschaftsbilder-kaufen|fine-art-prints-landschaft|wandbilder-landschaftsfotografie|naturfotografie-prints)-/.test(path)) current = 'fotografie:landschaft';
        else if (/^fotografie-(duesseldorf|nrw|deutschland)\.html$/.test(path)) current = 'fotografie:overview';
      }
      if (!current) return;

      const isPhoto = current.indexOf('fotografie:') === 0;
      const sub = isPhoto ? current.split(':')[1] : null;

      function applyActive(scope) {
        if (!scope) return;
        if (isPhoto) {
          const group = scope.querySelector('[data-nav="fotografie"]');
          if (group) group.classList.add('is-active');
          const subs = scope.querySelectorAll('.topbar__submenu a, .mobile-menu__group a');
          const parentBySub = {
            overview: 'fotografie-duesseldorf.html',
            automobil: 'automobil-fotografie-duesseldorf.html',
            sportwagen: 'sportwagen-fotografie-duesseldorf.html',
            oldtimer: 'oldtimer-fotografie-duesseldorf.html',
            motorrad: 'motorrad-fotografie-duesseldorf.html',
            portrait: 'portraitfotografie-duesseldorf.html',
            landschaft: 'landschaftsfotografie-duesseldorf.html'
          };
          subs.forEach(function (a) {
            const href = (a.getAttribute('href') || '').toLowerCase();
            if (href === path || (sub && href === parentBySub[sub])) a.classList.add('is-active');
          });
        } else {
          const direct = scope.querySelector('[data-nav="' + current + '"]');
          if (direct) direct.classList.add('is-active');
        }
      }
      applyActive(bar);
      applyActive(mobileMenu);
    })();

    /* ---------- Dropdown (hover desktop; click only for <button> toggles) ----------
       If the toggle is an <a>, clicks navigate to the overview page — the dropdown
       opens on hover via CSS, no JS click handler is added. Touch users get the
       full list via the mobile menu overlay. */
    const groups = bar.querySelectorAll('.topbar__group');
    groups.forEach(function (group) {
      const toggle = group.querySelector('.topbar__group-toggle');
      if (!toggle) return;
      if (toggle.tagName === 'A') return;
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        const willOpen = !group.classList.contains('is-open');
        groups.forEach(function (g) { g.classList.remove('is-open'); });
        group.classList.toggle('is-open', willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));
      });
    });
    document.addEventListener('click', function (e) {
      if (!bar.contains(e.target)) {
        groups.forEach(function (g) {
          g.classList.remove('is-open');
          const t = g.querySelector('.topbar__group-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        groups.forEach(function (g) { g.classList.remove('is-open'); });
        closeMobile();
      }
    });

    /* ---------- Mobile overlay ---------- */
    const menuBtn = bar.querySelector('.topbar__menu');
    const overlay = document.getElementById('mobile-menu');
    function openMobile() {
      if (!overlay) return;
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }
    function closeMobile() {
      if (!overlay) return;
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
    if (menuBtn && overlay) {
      menuBtn.addEventListener('click', function () {
        if (overlay.classList.contains('is-open')) { closeMobile(); }
        else { openMobile(); }
      });
      overlay.addEventListener('click', function (e) {
        if (e.target.matches('a')) closeMobile();
      });
    }

    /* ---------- Shared Contact Section ------------------------------------
       Any <section data-contact-section> on the page is filled with the
       canonical Anfrage form. Optional attributes:
         data-contact-subject  — mail subject (default: "Projekt-Anfrage")
         data-contact-headline — override headline ("Projekt <em>anfragen.</em>")
         data-contact-lead     — override lead paragraph
         data-contact-endpoint — optional POST URL (e.g. "/api/contact").
                                 When set, the form POSTs JSON and shows
                                 inline status. When absent, the form opens
                                 a prefilled mailto: link as fallback.
       --------------------------------------------------------------------- */
    (function () {
      const slots = document.querySelectorAll('section[data-contact-section]');
      if (!slots.length) return;

      let slotCounter = 0;

      slots.forEach(function (slot) {
        const subject = slot.getAttribute('data-contact-subject') || 'Projekt-Anfrage';
        const headline = slot.getAttribute('data-contact-headline') || 'Projekt <em>anfragen.</em>';
        const lead = slot.getAttribute('data-contact-lead') ||
          'Beschreibe kurz dein Projekt: worum es geht, wo es stattfindet, welche Wirkung die Bilder tragen sollen und in welchem Rahmen sie genutzt werden. Wir klären Location, Licht und Ablauf gemeinsam vor dem ersten Klick.';
        const endpoint = slot.getAttribute('data-contact-endpoint') || '';
        const uid = 'mrc-' + (slotCounter++);

        if (!slot.id) slot.id = 'anfrage';
        slot.classList.add('mr-contact');
        slot.setAttribute('aria-label', 'Anfrage');

        slot.innerHTML =
          '<div class="mr-contact__inner">' +
            '<div class="mr-contact__head">' +
              '<h2>' + headline + '</h2>' +
              '<p class="mr-contact__lead">' + lead + '</p>' +
              '<div class="mr-contact__mail">' +
                '<a href="mailto:info@matthiasramahi.de?subject=' + encodeURIComponent(subject) + '">info@matthiasramahi.de</a>' +
              '</div>' +
            '</div>' +
            '<form class="mr-contact__form" novalidate>' +
              '<div class="mr-contact__row">' +
                '<div class="mr-contact__field"><label for="' + uid + '-name">Name</label><input id="' + uid + '-name" name="name" autocomplete="name" required></div>' +
                '<div class="mr-contact__field"><label for="' + uid + '-mail">E-Mail</label><input id="' + uid + '-mail" type="email" name="email" autocomplete="email" required></div>' +
              '</div>' +
              '<div class="mr-contact__row">' +
                '<div class="mr-contact__field"><label for="' + uid + '-motiv">Motiv / Projekt</label><input id="' + uid + '-motiv" name="motiv"></div>' +
                '<div class="mr-contact__field"><label for="' + uid + '-use">Nutzung</label>' +
                  '<select id="' + uid + '-use" name="use">' +
                    '<option>Privat</option>' +
                    '<option>Kommerziell</option>' +
                    '<option>Kampagne</option>' +
                    '<option>Editorial</option>' +
                    '<option>Sonstiges</option>' +
                  '</select>' +
                '</div>' +
              '</div>' +
              '<div class="mr-contact__field"><label for="' + uid + '-msg">Nachricht</label><textarea id="' + uid + '-msg" name="message" required placeholder="Worum geht es, Standort, gewünschte Wirkung, Deadline …"></textarea></div>' +
              '<div class="mr-contact__actions">' +
                '<button class="mr-contact__submit" type="submit">Anfrage senden →</button>' +
                '<p class="mr-contact__status" role="status" aria-live="polite"></p>' +
              '</div>' +
            '</form>' +
          '</div>';

        const form = slot.querySelector('form.mr-contact__form');
        const submit = slot.querySelector('.mr-contact__submit');
        const status = slot.querySelector('.mr-contact__status');

        function setStatus(text, mode) {
          if (!status) return;
          status.textContent = text;
          status.classList.remove('is-ok', 'is-error', 'is-busy');
          if (mode) status.classList.add('is-' + mode);
        }

        form.addEventListener('submit', async function (e) {
          e.preventDefault();
          const data = {
            name: form.elements['name'].value.trim(),
            email: form.elements['email'].value.trim(),
            motiv: form.elements['motiv'].value.trim(),
            use: form.elements['use'].value,
            message: form.elements['message'].value.trim()
          };
          if (!data.name || !data.email || !data.message) {
            setStatus('Bitte Name, E-Mail und Nachricht ausfüllen.', 'error');
            form.reportValidity();
            return;
          }
          if (endpoint) {
            try {
              submit.disabled = true;
              setStatus('Wird gesendet …', 'busy');
              const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.assign({ subject: subject, source: location.pathname }, data))
              });
              if (!res.ok) throw new Error('HTTP ' + res.status);
              setStatus('Danke — deine Nachricht ist angekommen. Antwort meist innerhalb von 24 Stunden.', 'ok');
              form.reset();
            } catch (err) {
              setStatus('Senden fehlgeschlagen. Öffne deine Mail-App stattdessen.', 'error');
              const body =
                'Name: ' + data.name + '\n' +
                'E-Mail: ' + data.email + '\n' +
                'Motiv: ' + (data.motiv || '—') + '\n' +
                'Nutzung: ' + data.use + '\n\n' +
                'Nachricht:\n' + data.message;
              window.location.href = 'mailto:info@matthiasramahi.de?subject=' +
                encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
            } finally {
              submit.disabled = false;
            }
          } else {
            const body =
              'Name: ' + data.name + '\n' +
              'E-Mail: ' + data.email + '\n' +
              'Motiv: ' + (data.motiv || '—') + '\n' +
              'Nutzung: ' + data.use + '\n\n' +
              'Nachricht:\n' + data.message;
            setStatus('Mail-App wird geöffnet …', 'ok');
            window.location.href = 'mailto:info@matthiasramahi.de?subject=' +
              encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
          }
        });
      });
    })();
  });
})();
