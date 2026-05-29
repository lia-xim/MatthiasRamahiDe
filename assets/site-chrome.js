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
    (function () {
      const images = Array.from(document.querySelectorAll('img[data-src]'));
      if (images.length === 0) return;

      function load(image) {
        if (image.dataset.src) {
          image.src = image.dataset.src;
          delete image.dataset.src;
        }
        if (image.dataset.srcset) {
          image.srcset = image.dataset.srcset;
          delete image.dataset.srcset;
        }
      }

      if (!('IntersectionObserver' in window)) {
        images.forEach(load);
        return;
      }

      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          load(entry.target);
        });
      }, { rootMargin: '1000px 0px' });

      images.forEach(function (image) {
        observer.observe(image);
      });
    })();

    const bar = document.getElementById('topbar');
    if (!bar) return;

    const pagePath = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const hasInlineInquiry = !!document.querySelector('section[data-contact-section], .contact-cta');

    function pageIntent() {
      const title = (document.querySelector('h1')?.textContent || document.title || '').replace(/\s+/g, ' ').trim();
      const base = {
        key: 'projekt',
        label: 'Projekt',
        title: 'Der naechste Schritt bleibt klein.',
        lead: 'Ein kurzer Kontext reicht: Motiv, Ziel, Zeitraum und gewuenschte Nutzung. Daraus entsteht ein klares Rueckfrage- oder Angebotsfenster.',
        cards: [
          ['Passend fuer', 'Marke, Sammlung oder Privatprojekt', 'Wenn Bilder nicht nur dokumentieren, sondern Wert, Haltung oder Verkauf staerken sollen.'],
          ['Ergebnis', 'Bildserie statt Zufallstreffer', 'Planung, Licht, Auswahl und Uebergabe werden auf die spaetere Nutzung abgestimmt.'],
          ['Naechster Schritt', 'Kurze Anfrage, dann Klarheit', 'Du musst noch kein fertiges Konzept haben. Wir klaeren Umfang, Ort und Ablauf gemeinsam.']
        ]
      };

      if (/automobil|automotive|autofotografie|fahrzeugfotografie|autohaus|autoverkauf/.test(pagePath)) {
        return Object.assign({}, base, {
          key: 'automobil',
          label: 'Automobil',
          title: 'Fuer Verkauf, Showroom und Kampagne.',
          cards: [
            ['Passend fuer', 'Fahrzeugverkauf, Showroom, Marke', 'Exterieur, Interieur und Details werden als verwertbare Bildserie geplant.'],
            ['Wichtig', 'Wert sichtbar machen', 'Lack, Linien, Zustand und Nutzung brauchen klare Motive statt beliebiger Fahrzeugbilder.'],
            ['Naechster Schritt', 'Fahrzeug, Ziel, Zeitfenster', 'Diese drei Angaben reichen fuer eine erste Einschaetzung und den passenden Ablauf.']
          ]
        });
      }
      if (/sportwagen|performance-car|exotic-car|supersportwagen/.test(pagePath)) {
        return Object.assign({}, base, {
          key: 'sportwagen',
          label: 'Sportwagen',
          title: 'Fuer Verkauf, Sammlung und Markenwirkung.',
          cards: [
            ['Passend fuer', 'Sportwagen & Performance Cars', 'Hero-Motive, Detailserien und komplette Sets fuer Verkauf, Sammlung, Social oder Kampagne.'],
            ['Wichtig', 'Linie, Licht und Material', 'Lack, Form und Innenraum brauchen kontrollierte Perspektiven statt schneller Schnappschuesse.'],
            ['Naechster Schritt', 'Fahrzeug, Ort, Zeitfenster', 'Diese drei Angaben reichen fuer eine erste Einschaetzung und einen sinnvollen Ablauf.']
          ]
        });
      }
      if (/oldtimer|classic-car|youngtimer|sammlerfahrzeug/.test(pagePath)) {
        return Object.assign({}, base, {
          key: 'oldtimer',
          label: 'Oldtimer',
          title: 'Fuer Fahrzeuge mit Geschichte und Wert.',
          cards: [
            ['Passend fuer', 'Sammlung, Verkauf oder Dokumentation', 'Die Serie zeigt Zustand, Charakter und Details ohne Auktionskatalog-Kaelte.'],
            ['Wichtig', 'Authentizitaet vor Effekt', 'Licht und Location sollen Herkunft und Material staerken, nicht ueberdecken.'],
            ['Naechster Schritt', 'Fahrzeug, Standort, Ziel', 'Mehr braucht es fuer die erste Klaerung meist nicht.']
          ]
        });
      }
      if (/motorrad|bike|biker|custom-bike/.test(pagePath)) {
        return Object.assign({}, base, {
          key: 'motorrad',
          label: 'Motorrad',
          title: 'Fuer Haltung, Linie und Maschine.',
          cards: [
            ['Passend fuer', 'Bike, Custom Build oder Portrait', 'Motorrad, Fahrer und Material werden als zusammenhaengende Geschichte gedacht.'],
            ['Wichtig', 'Form und Koerpersprache', 'Die Bildserie braucht Rhythmus: Totale, Details, Haltung, Bewegung.'],
            ['Naechster Schritt', 'Bike, Stil, Zeitfenster', 'Kurze Eckdaten reichen fuer eine erste Richtung.']
          ]
        });
      }
      if (/portrait|business-portrait|headshot|personal-branding|unternehmensportrait|pressefoto/.test(pagePath)) {
        return Object.assign({}, base, {
          key: 'portrait',
          label: 'Portrait',
          title: 'Fuer Praesenz ohne generische Posen.',
          cards: [
            ['Passend fuer', 'Personal Branding, Presse, Team', 'Portraits werden auf Rolle, Kontext und spaetere Nutzung abgestimmt.'],
            ['Wichtig', 'Fuehrung statt Pose', 'Licht, Hintergrund und Ablauf geben Sicherheit, ohne die Person zu glatt zu machen.'],
            ['Naechster Schritt', 'Person, Ziel, Ort', 'Damit laesst sich der Rahmen schnell klaeren.']
          ]
        });
      }
      if (/landschaft|wandbilder|naturfotografie|fine-art-prints/.test(pagePath)) {
        return Object.assign({}, base, {
          key: 'landschaft',
          label: 'Landschaft',
          title: 'Fuer Prints, Raeume und ruhige Bildwirkung.',
          cards: [
            ['Passend fuer', 'Fine-Art, Wandbild, Serie', 'Motiv, Format und Material werden zusammen gedacht.'],
            ['Wichtig', 'Raum, Format, Abstand', 'Ein gutes Wandbild entsteht nicht nur im Motiv, sondern im Zusammenspiel mit dem Ort.'],
            ['Naechster Schritt', 'Raum oder Motividee', 'Ein Foto, Mass oder Raumkontext reicht fuer den Einstieg.']
          ]
        });
      }
      if (/webdesign|videografie|werbetechnik|druck|grossformat|fotolabor|viola|leistungen|weitere-dienstleistungen/.test(pagePath)) {
        return Object.assign({}, base, {
          key: 'zusatzleistung',
          label: 'Zusatzleistung',
          title: 'Wenn Bild, Print und Auftritt zusammenpassen sollen.',
          cards: [
            ['Passend fuer', 'Print, Web, Video oder Ausstattung', 'Sinnvoll, wenn die fotografische Sprache auch im Material oder digitalen Auftritt weitergehen soll.'],
            ['Wichtig', 'Ein Ansprechpartner', 'Ablauf, Bildsprache und Partner werden gemeinsam koordiniert.'],
            ['Naechster Schritt', 'Ziel, Medium, Timing', 'Damit laesst sich schnell klaeren, welche Leistung passt.']
          ]
        });
      }
      if (/blog|journal/.test(pagePath)) {
        return Object.assign({}, base, {
          key: 'journal',
          label: 'Journal',
          title: 'Aus dem Thema kann direkt ein Projekt werden.',
          cards: [
            ['Passend fuer', 'Aehnliche Bildsprache', 'Wenn der Artikel eine Richtung trifft, laesst sich daraus ein konkretes Shooting entwickeln.'],
            ['Wichtig', 'Kontext statt fertiges Briefing', 'Ein paar Stichpunkte reichen, um Motiv, Nutzung und Aufwand einzuordnen.'],
            ['Naechster Schritt', 'Kurz anfragen', 'Ich melde mich mit Rueckfragen oder einem sinnvollen naechsten Schritt.']
          ]
        });
      }
      if (/ueber-mich/.test(pagePath)) {
        return Object.assign({}, base, {
          key: 'about',
          label: 'Haltung',
          title: 'Wenn die Haltung passt, klaeren wir das Projekt.',
          cards: [
            ['Passend fuer', 'Menschen mit konkreter Bildabsicht', 'Nicht jedes Motiv braucht Laerm. Viele brauchen Ruhe, Praezision und Richtung.'],
            ['Wichtig', 'Direkte Abstimmung', 'Du sprichst direkt mit Matthias, nicht mit einer anonymen Produktionsschicht.'],
            ['Naechster Schritt', 'Idee kurz skizzieren', 'Ein Absatz reicht, um den Rahmen zu pruefen.']
          ]
        });
      }
      if (pagePath === 'index.html' || pagePath === '') {
        return Object.assign({}, base, {
          key: 'home',
          label: 'Fotografie',
          title: 'Schnell erkennen, ob der Stil passt.',
          lead: 'Die Seite ist gross und visuell. Diese Kurzstrecke ordnet ein, wofuer die Arbeit am haeufigsten angefragt wird.',
          cards: [
            ['Automotive', 'Verkauf, Sammlung, Kampagne', 'Fahrzeuge als Wertobjekt, Marke oder Editorial-Motiv.'],
            ['Portrait', 'Praesenz ohne generische Posen', 'Menschen, Teams und Rollen mit ruhiger Fuehrung.'],
            ['Print & Raum', 'Fine-Art und Wandbilder', 'Bild, Format, Material und Raum zusammen gedacht.']
          ]
        });
      }
      return base;
    }

    function inquiryHref() {
      return hasInlineInquiry ? '#anfrage' : 'contact.html#anfrage';
    }

    function trackConversionEvent(name, detail) {
      const payload = Object.assign({
        event: name,
        page: pagePath,
        path: location.pathname,
        title: document.title,
        intent: pageIntent().key
      }, detail || {});
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
      document.dispatchEvent(new CustomEvent('mr:conversion', { detail: payload }));
    }

    /* ---------- Mobile quick CTA -----------------------------------------
       The desktop header CTA is hidden on small screens to keep the menu
       usable. Add a compact sticky action so mobile visitors can start an
       inquiry without opening navigation first.
       --------------------------------------------------------------------- */
    (function () {
      const source = bar.querySelector('.topbar__cta');
      if (!source || document.querySelector('.mr-sticky-cta')) return;
      const sticky = document.createElement('a');
      sticky.className = 'mr-sticky-cta';
      sticky.href = source.getAttribute('href') || 'contact.html#anfrage';
      sticky.textContent = source.textContent || 'Projekt anfragen';
      sticky.setAttribute('aria-label', sticky.textContent);
      sticky.setAttribute('data-cta-role', 'mobile-sticky');
      document.body.appendChild(sticky);

      let stickyThreshold = window.innerHeight * 0.62;
      let stickyRaf = 0;

      function syncStickyVisibility() {
        stickyRaf = 0;
        sticky.classList.toggle('is-visible', window.scrollY > stickyThreshold);
      }

      function queueStickyVisibility() {
        if (stickyRaf) return;
        stickyRaf = requestAnimationFrame(syncStickyVisibility);
      }

      queueStickyVisibility();
      window.addEventListener('scroll', queueStickyVisibility, { passive: true });
      window.addEventListener('resize', function () {
        stickyThreshold = window.innerHeight * 0.62;
        queueStickyVisibility();
      }, { passive: true });
    })();

    /* ---------- Conversion intent tracking -------------------------------
       The site currently has no analytics stack in the markup. This creates a
       clean event surface for future GA4/Plausible/etc. without coupling the
       UI to a vendor: clicks push into dataLayer and dispatch mr:conversion.
       --------------------------------------------------------------------- */
    (function () {
      document.addEventListener('click', function (e) {
        const el = e.target.closest && e.target.closest('a,button');
        if (!el) return;
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
        const href = el.getAttribute && (el.getAttribute('href') || '');
        const isCta = /anfrag|kontakt|projekt|mailto:|tel:|portfolio|arbeiten ansehen/i.test(text + ' ' + href);
        if (!isCta) return;
        const role = el.getAttribute('data-cta-role') || (el.className || '').toString().replace(/\s+/g, '.').slice(0, 80) || el.tagName.toLowerCase();
        try {
          sessionStorage.setItem('mr:lastCta', JSON.stringify({
            text: text,
            href: href,
            role: role,
            page: pagePath,
            at: Date.now()
          }));
        } catch (err) {}
        trackConversionEvent('cta_click', { text: text, href: href, role: role });
      }, { capture: true });
    })();

    /* ---------- Decision strip — REMOVED 2026-05-27
       The "Schnell erkennen, ob der Stil passt." / "Fuer X..." / "Der naechste
       Schritt bleibt klein." block has been retired on request — the page
       compositions (hero → topic chapters → portfolio → contact) carry the
       qualification work on their own. pageIntent() is still used by exit-CTA
       and the conversion-event tracker, so the function stays in place.
       --------------------------------------------------------------------- */

    /* ---------- Exit CTA for non-form pages -------------------------------
       Journal/About/Portfolio pages often educate or build trust but do not
       carry the inline inquiry form. Give them a compact, page-specific exit
       step before the footer. Legal pages stay untouched.
       --------------------------------------------------------------------- */
    (function () {
      if (hasInlineInquiry || document.querySelector('.mr-exit-cta')) return;
      if (/datenschutz|impressum/.test(pagePath)) return;
      const footer = document.querySelector('.mr-footer, footer');
      if (!footer) return;
      const intent = pageIntent();
      const section = document.createElement('section');
      section.className = 'mr-exit-cta';
      section.setAttribute('data-header-theme', 'light');
      section.setAttribute('aria-label', 'Naechster Schritt');
      section.innerHTML =
        '<div class="mr-exit-cta__inner">' +
          '<p class="mr-exit-cta__eyebrow">' + intent.label + '</p>' +
          '<h2>' + intent.title + '</h2>' +
          '<p>' + intent.lead + '</p>' +
          '<div class="mr-exit-cta__actions">' +
            '<a class="mr-exit-cta__primary" data-cta-role="exit-cta-primary" href="contact.html#anfrage">Projekt anfragen</a>' +
            '<a class="mr-exit-cta__secondary" data-cta-role="exit-cta-secondary" href="portfolio.html">Arbeiten ansehen</a>' +
          '</div>' +
        '</div>';
      footer.insertAdjacentElement('beforebegin', section);
    })();

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

      function hydrateContactSlots() {
        let slotCounter = 0;

        slots.forEach(function (slot) {
        const subject = slot.getAttribute('data-contact-subject') || 'Projekt-Anfrage';
        const headline = slot.getAttribute('data-contact-headline') || 'Projekt <em>anfragen.</em>';
        const lead = slot.getAttribute('data-contact-lead') ||
          'Beschreibe kurz dein Projekt: worum es geht, wo es stattfindet, welche Wirkung die Bilder tragen sollen und in welchem Rahmen sie genutzt werden. Wir klären Location, Licht und Ablauf gemeinsam vor dem ersten Klick.';
        const endpoint = slot.getAttribute('data-contact-endpoint') || '/api/contact';
        const uid = 'mrc-' + (slotCounter++);

        if (!slot.id) slot.id = 'anfrage';
        slot.classList.add('mr-contact');
        slot.setAttribute('aria-label', 'Anfrage');

        slot.innerHTML =
          '<div class="mr-contact__inner">' +
            '<div class="mr-contact__head">' +
              '<h2>' + headline + '</h2>' +
              '<p class="mr-contact__lead">' + lead + '</p>' +
              '<ul class="mr-contact__proof" aria-label="Anfrage Vorteile">' +
                '<li>Unverbindliche Erstklaerung</li>' +
                '<li>Antwort meist innerhalb von 24 Stunden</li>' +
                '<li>Direkt mit Matthias</li>' +
              '</ul>' +
              /* Briefing cards (Was reicht / Was klaeren wir / Naechster Schritt) removed 2026-05-27 */
              '<div class="mr-contact__mail">' +
                '<a href="mailto:info@matthiasramahi.de?subject=' + encodeURIComponent(subject) + '">info@matthiasramahi.de</a>' +
              '</div>' +
            '</div>' +
            '<form class="mr-contact__form" novalidate data-started-at="' + Date.now() + '">' +
              '<div class="mr-contact__trap" aria-hidden="true"><label for="' + uid + '-site">Website</label><input id="' + uid + '-site" name="website" tabindex="-1" autocomplete="off"></div>' +
              '<div class="mr-contact__row">' +
                '<div class="mr-contact__field"><label for="' + uid + '-name">Name <span>Pflicht</span></label><input id="' + uid + '-name" name="name" autocomplete="name" required></div>' +
                '<div class="mr-contact__field"><label for="' + uid + '-contact">E-Mail oder Telefon <span>Pflicht</span></label><input id="' + uid + '-contact" name="contact" autocomplete="email" inputmode="email" required></div>' +
              '</div>' +
              '<div class="mr-contact__field"><label for="' + uid + '-msg">Projekt kurz beschreiben <span>Pflicht</span></label><textarea id="' + uid + '-msg" name="message" required placeholder="Leistung, Ort, Zeitraum und gewuenschte Wirkung reichen fuer den ersten Schritt."></textarea></div>' +
              '<details class="mr-contact__details">' +
                '<summary>Projektangaben ergaenzen <span>Optional</span></summary>' +
                '<div class="mr-contact__row">' +
                  '<div class="mr-contact__field"><label for="' + uid + '-project">Projekt / Motiv <span>Optional</span></label><input id="' + uid + '-project" name="project" autocomplete="off"></div>' +
                  '<div class="mr-contact__field"><label for="' + uid + '-date">Zeitraum <span>Optional</span></label><input id="' + uid + '-date" name="date" autocomplete="off" placeholder="z. B. KW 24, Juni, offen"></div>' +
                '</div>' +
                '<div class="mr-contact__row">' +
                  '<div class="mr-contact__field"><label for="' + uid + '-use">Nutzung <span>Optional</span></label>' +
                    '<select id="' + uid + '-use" name="use">' +
                      '<option value="">Noch offen</option>' +
                      '<option>Privat</option>' +
                      '<option>Kommerziell</option>' +
                      '<option>Kampagne</option>' +
                      '<option>Editorial</option>' +
                      '<option>Sonstiges</option>' +
                    '</select>' +
                  '</div>' +
                  '<div class="mr-contact__field"><label for="' + uid + '-phone">Telefon fuer Rueckfragen <span>Optional</span></label><input id="' + uid + '-phone" name="phone" autocomplete="tel"></div>' +
                '</div>' +
              '</details>' +
              '<div class="mr-contact__actions">' +
                '<button class="mr-contact__submit" type="submit">Projekt anfragen -></button>' +
                '<p class="mr-contact__reassurance">Unverbindlich. Kein Paket-Zwang. Antwort meist innerhalb von 24 Stunden.</p>' +
                '<p class="mr-contact__status" role="status" aria-live="polite"></p>' +
              '</div>' +
            '</form>' +
          '</div>';

        const form = slot.querySelector('form.mr-contact__form');
        const submit = slot.querySelector('.mr-contact__submit');
        const status = slot.querySelector('.mr-contact__status');
        let formStarted = false;

        function setStatus(text, mode) {
          if (!status) return;
          status.textContent = text;
          status.classList.remove('is-ok', 'is-error', 'is-busy');
          if (mode) status.classList.add('is-' + mode);
        }

        form.addEventListener('focusin', function () {
          if (formStarted) return;
          formStarted = true;
          trackConversionEvent('form_start', { form: 'mr-contact', subject: subject });
        });

        form.addEventListener('submit', async function (e) {
          e.preventDefault();
          const data = {
            name: form.elements['name'].value.trim(),
            contact: form.elements['contact'].value.trim(),
            project: form.elements['project'].value.trim(),
            date: form.elements['date'].value.trim(),
            use: form.elements['use'].value,
            phone: form.elements['phone'].value.trim(),
            message: form.elements['message'].value.trim()
          };
          const intent = pageIntent();
          let lastCta = '';
          try {
            const stored = JSON.parse(sessionStorage.getItem('mr:lastCta') || '{}');
            lastCta = [stored.text, stored.role, stored.href].filter(Boolean).join(' / ');
          } catch (err) {}
          trackConversionEvent('form_submit_attempt', {
            form: 'mr-contact',
            subject: subject,
            hasProject: !!data.project,
            hasDate: !!data.date,
            use: data.use || 'Noch offen'
          });
          if (form.elements['website'] && form.elements['website'].value) {
            form.reset();
            setStatus('Danke — deine Anfrage ist vorgemerkt.', 'ok');
            trackConversionEvent('form_honeypot', { form: 'mr-contact' });
            return;
          }
          if (!data.name || !data.contact || !data.message) {
            setStatus('Bitte Name, Kontaktweg und Projektbeschreibung ausfuellen.', 'error');
            trackConversionEvent('form_validation_error', { form: 'mr-contact' });
            form.reportValidity();
            return;
          }
          if (endpoint) {
            try {
              submit.disabled = true;
              setStatus('Wird sicher uebertragen ...', 'busy');
              const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.assign({
                  subject: subject,
                  source: location.pathname,
                  pageTitle: document.title,
                  pageUrl: location.href,
                  intent: intent.key,
                  intentLabel: intent.label,
                  lastCta: lastCta
                }, data))
              });
              const result = await res.json().catch(function () { return {}; });
              if (!res.ok || !result.ok) throw new Error(result.error || ('HTTP ' + res.status));
              setStatus(result.queued ? 'Danke. Die Anfrage ist gesichert und wird automatisch zugestellt.' : 'Danke. Die Anfrage wurde versendet. Antwort meist innerhalb von 24 Stunden.', 'ok');
              trackConversionEvent('form_submit_success', {
                form: 'mr-contact',
                transport: result.queued ? 'resend-queue' : 'resend',
                requestId: result.id || ''
              });
              form.reset();
            } catch (err) {
              setStatus('Direktversand nicht moeglich. Mail-App wird als Fallback geoeffnet.', 'error');
              const body =
                'Seite: ' + document.title + '\n' +
                'URL: ' + location.href + '\n' +
                'Kontext: ' + intent.label + '\n' +
                'CTA: ' + (lastCta || 'Direkt / unbekannt') + '\n\n' +
                'Name: ' + data.name + '\n' +
                'Kontakt: ' + data.contact + '\n' +
                'Projekt / Motiv: ' + (data.project || 'Noch offen') + '\n' +
                'Zeitraum: ' + (data.date || 'Noch offen') + '\n' +
                'Nutzung: ' + (data.use || 'Noch offen') + '\n' +
                'Telefon: ' + (data.phone || 'Noch offen') + '\n\n' +
                'Nachricht:\n' + data.message;
              window.location.href = 'mailto:info@matthiasramahi.de?subject=' +
                encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
              trackConversionEvent('form_submit_fallback', { form: 'mr-contact', transport: 'mailto' });
            } finally {
              submit.disabled = false;
            }
          } else {
            const body =
              'Seite: ' + document.title + '\n' +
              'URL: ' + location.href + '\n' +
              'Kontext: ' + intent.label + '\n' +
              'CTA: ' + (lastCta || 'Direkt / unbekannt') + '\n\n' +
              'Name: ' + data.name + '\n' +
              'Kontakt: ' + data.contact + '\n' +
              'Projekt / Motiv: ' + (data.project || 'Noch offen') + '\n' +
              'Zeitraum: ' + (data.date || 'Noch offen') + '\n' +
              'Nutzung: ' + (data.use || 'Noch offen') + '\n' +
              'Telefon: ' + (data.phone || 'Noch offen') + '\n\n' +
              'Nachricht:\n' + data.message;
            setStatus('Mail-App wird geöffnet …', 'ok');
            window.location.href = 'mailto:info@matthiasramahi.de?subject=' +
              encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
            trackConversionEvent('form_submit_success', { form: 'mr-contact', transport: 'mailto' });
          }
        });
      });
      }

      let hydratedContactSlots = false;

      function hydrateContactSlotsOnce() {
        if (hydratedContactSlots) return;
        hydratedContactSlots = true;
        hydrateContactSlots();
      }

      if (location.hash === '#anfrage') {
        hydrateContactSlotsOnce();
      } else if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
          if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
          observer.disconnect();
          hydrateContactSlotsOnce();
        }, { rootMargin: '35% 0px' });
        slots.forEach(function (slot) { observer.observe(slot); });
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(hydrateContactSlotsOnce, { timeout: 4200 });
        } else {
          window.setTimeout(hydrateContactSlotsOnce, 4200);
        }
      } else if ('requestIdleCallback' in window) {
        window.requestIdleCallback(hydrateContactSlotsOnce, { timeout: 1200 });
      } else {
        window.setTimeout(hydrateContactSlotsOnce, 1200);
      }
    })();
  });
})();
