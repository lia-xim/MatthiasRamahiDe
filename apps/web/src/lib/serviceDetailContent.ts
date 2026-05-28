export type ServiceDetailCard = {
  body: string
  items: string[]
  kicker: string
  title: string
}

export type ServiceDetailPage = {
  contact: {
    headline: string
    lead: string
    subject: string
  }
  ctaHead: string
  feature: {
    aria: string
    eyebrow: string
    items: Array<{ line: string; tag: string }>
    lead: string
    title: string
  }
  file: string
  hero: {
    alt: string
    crumb: string
    eyebrow: string
    h1: string
    height: number
    image: string
    lead: string
    primary: string
    secondary: string
    side: [string, string, string]
    width: number
  }
  overview: {
    cards: ServiceDetailCard[]
    eyebrow: string
    lead: string
    title: string
  }
}

const asset = (path: string) => (path.startsWith('/') ? path : `/${path}`)

export const nativeServiceDetailPages: Record<string, ServiceDetailPage> = {
  'grossformatdruck-duesseldorf.html': {
    file: 'grossformatdruck-duesseldorf.html',
    hero: {
      image: asset('assets/services/Catoir_Ramahi-1-106-768x512-1.webp'),
      alt: 'Großformatdruck-Installation',
      width: 768,
      height: 512,
      crumb: 'Großformatdruck',
      eyebrow: 'Large Format · Düsseldorf',
      h1: 'Großformat<br><em>druck.</em>',
      lead: 'Hochauflösender Druck im Großformat — für Wandbilder, Showrooms, Schaufenster und Messen. Vom Korrekturlauf am Soft-Proof bis zur Montage vor Ort.',
      primary: 'Großformat anfragen →',
      secondary: 'Leistungen ansehen',
      side: ['Düsseldorf · NRW', 'Großformatdruck', '≤ 24 h Antwort'],
    },
    overview: {
      eyebrow: 'Leistungen im Überblick',
      title: 'Format <em>leistungen.</em>',
      lead: 'Große Flächen brauchen mehr als hohe Auflösung. Material, Betrachtungsabstand, Lichtsituation und Montage entscheiden, ob ein Großformat ruhig oder unruhig wirkt.',
      cards: [
        {
          kicker: '01 / Wand',
          title: 'Wandbilder XL',
          body: 'Hochformatige oder querformatige Bilder ab 100 × 70 cm bis 400 × 250 cm — auf Acryl, Alu, Leinwand oder direkt geklebt.',
          items: ['Acryl bis 250 × 150 cm', 'Alu-Dibond bis 300 × 150 cm', 'Direktklebung auf gestrichene Wand'],
        },
        {
          kicker: '02 / Marke',
          title: 'Showroom &amp; Empfang',
          body: 'Markenwände für Empfangsbereiche, Autohäuser, Boutiquen und Marken — abgestimmt auf Corporate Look und Lichtsituation.',
          items: ['Beleuchtungs-Check vor Druck', 'Material auf CI-Farben abgestimmt', 'Montage mit Schiene oder Distanzhalter'],
        },
        {
          kicker: '03 / Event',
          title: 'Messebanner &amp; Roll-Ups',
          body: 'Vom mobilen Roll-Up bis zur 6 m Messewand — leichte Stoffsysteme, Backlit-Folien, Hardcase-Lieferung.',
          items: ['Stoff- oder PVC-Banner', 'Roll-Up 85 × 200 cm und 120 × 200 cm', 'Backlit für hinterleuchtete Rahmen'],
        },
        {
          kicker: '04 / Schaufenster',
          title: 'Folien &amp; Fenster',
          body: 'Schaufensterfolien, Sichtschutzfolien, milchige Klebefolie und farbige Akzentfolien — mit Verlegung auf Wunsch.',
          items: ['Frosted-Folien und Sandstrahleffekt', 'Vollflächige Bildmotive', 'Branding-Folien auf Glas und Türen'],
        },
      ],
    },
    feature: {
      aria: 'Skala',
      eyebrow: 'Skala',
      title: 'Wenn Größe <em>Bestandteil ist.</em>',
      lead: 'Ein gutes Bild bleibt im Großformat ruhig — schlechtes Bildmaterial wird laut. Deshalb sind Auswahl, Aufbereitung und Material gleichwertig zur Größe selbst.',
      items: [
        { tag: 'Auflösung', line: 'Mindestens 150 dpi auf der finalen Größe — bei Betrachtungsabstand zur Wand reichen oft 120 dpi.' },
        { tag: 'Material', line: 'Acryl wirkt mit Licht, Alu ruhig, Stoff weich. Die Wahl folgt dem Raum.' },
        { tag: 'Montage', line: 'Schienen, Distanzhalter, Klett oder Direktklebung — abgestimmt auf Wand und Wechselbedarf.' },
        { tag: 'Lieferung', line: 'Eigenlieferung im Rheinland, Spedition deutschlandweit, Aufbau auf Wunsch.' },
      ],
    },
    ctaHead: 'Bereit für ein <em>Großformatdruck-Briefing.</em>',
    contact: {
      subject: 'Großformat-Anfrage — Matthias Ramahi',
      headline: 'Großformat anfragen.',
      lead: 'Beschreibe kurz Wand oder Anlass, ungefähre Größe und Material. Wenn nur die Wand bekannt ist, reicht ein Foto und die Maße — daraus lassen sich Format und Material vorschlagen.',
    },
  },
  'werbetechnik-duesseldorf.html': {
    file: 'werbetechnik-duesseldorf.html',
    hero: {
      image: asset('assets/services/Catoir_Ramahi-1-32-768x512-1.webp'),
      alt: 'Werbetechnik-Installation in Düsseldorf',
      width: 768,
      height: 512,
      crumb: 'Werbetechnik',
      eyebrow: 'Signage · Düsseldorf',
      h1: 'Werbe<br><em>technik.</em>',
      lead: 'Schilder, Folien, Fahrzeuge, Schaufenster, Lichtwerbung — physische Markenpräsenz im Stadtraum. In Düsseldorf umgesetzt mit erfahrenen Partnerwerkstätten.',
      primary: 'Werbetechnik anfragen →',
      secondary: 'Leistungen ansehen',
      side: ['Düsseldorf · NRW', 'Werbetechnik', '≤ 24 h Antwort'],
    },
    overview: {
      eyebrow: 'Leistungen im Überblick',
      title: 'Anwendungs <em>bereiche.</em>',
      lead: 'Werbetechnik ist Handwerk vor Ort. Wir denken Motiv, Material und Montage zusammen — egal ob Schaufenster, Fahrzeug oder Hausfassade.',
      cards: [
        {
          kicker: '01 / Fahrzeug',
          title: 'Fahrzeugbeschriftung',
          body: 'Logo, Kontakt, Vollverklebung — auf PKW, Transporter, LKW oder Anhänger. Mit Vorab-Visualisierung am Fahrzeugfoto.',
          items: ['Teilbeklebung mit Hochleistungsfolie', 'Vollfolierung in Farbe oder Carbon', 'Montage im rheinländischen Raum'],
        },
        {
          kicker: '02 / Schaufenster',
          title: 'Schaufenster &amp; Glas',
          body: 'Werbung an Ladenflächen — von der dezenten Logofolie bis zur vollflächigen Bildmotivfolie. Demontagefreundlich und sauber.',
          items: ['Frosted für Sichtschutz', 'Bedruckte Folien mit Bildmotiv', 'Türaufkleber und Hinweistexte'],
        },
        {
          kicker: '03 / Fassade',
          title: 'Schilder &amp; Beschilderung',
          body: 'Außenschilder, Hinweisschilder, Türschilder und Leitsysteme — aus Alu-Dibond, Acryl, Metall oder beleuchtet.',
          items: ['Außenmontage mit Statik-Check', 'Acrylplatten mit Standoffs', 'Leitsysteme für Praxen und Marken'],
        },
        {
          kicker: '04 / Licht',
          title: 'LED-Lichtwerbung',
          body: 'Hinterleuchtete Logos, Profilbuchstaben und Lightboxes — energieeffizient mit LED und langer Lebensdauer.',
          items: ['Profilbuchstaben aus Acryl mit LED', 'Backlit-Boxes für Schaufenster', 'Außenfertige Lichtkästen IP65'],
        },
      ],
    },
    feature: {
      aria: 'Ablauf',
      eyebrow: 'Ablauf',
      title: 'Vom Foto auf die <em>Fläche.</em>',
      lead: 'Ein Aufkleber wirkt nur, wenn er sitzt. Wir liefern Werbetechnik mit Vorlauf: Visualisierung am Foto, Materialcheck, Montagetermin und Endabnahme.',
      items: [
        { tag: 'Vorlauf', line: 'Visualisierung auf Foto von Fahrzeug, Fläche oder Schaufenster.' },
        { tag: 'Material', line: 'Hochleistungsfolien für Außenmontage — UV-stabil, salzwasserfest, demontagefreundlich.' },
        { tag: 'Montage', line: 'Vor-Ort-Montage im Rheinland, Werkstattfolierung für Fahrzeuge.' },
        { tag: 'Wartung', line: 'Nachbestellungen, Reparaturen und Wartung mit gleicher Folie und Druck.' },
      ],
    },
    ctaHead: 'Bereit für ein <em>Werbetechnik-Briefing.</em>',
    contact: {
      subject: 'Werbetechnik-Anfrage — Matthias Ramahi',
      headline: 'Werbetechnik anfragen.',
      lead: 'Schreibe kurz, was und wo beklebt oder beschriftet werden soll. Hilfreich: Foto der Fläche, gewünschtes Logo oder Motiv und ein grober Zeitraum.',
    },
  },
  'webdesign-seo-duesseldorf.html': {
    file: 'webdesign-seo-duesseldorf.html',
    hero: {
      image: asset('assets/services/screencapture-gr-knospe-de-2025-10-02-23_10_04-scaled.webp'),
      alt: 'Website Screenshot — Webdesign Düsseldorf',
      width: 1814,
      height: 2560,
      crumb: 'Webdesign &amp; SEO',
      eyebrow: 'Web · Düsseldorf',
      h1: 'Webdesign<br><em>&amp; SEO.</em>',
      lead: 'Moderne Websites mit klarer Struktur, schneller Performance und lokaler Suchmaschinensichtbarkeit — für Marken, Marken und Mittelstand im Rheinland.',
      primary: 'Website anfragen →',
      secondary: 'Leistungen ansehen',
      side: ['Düsseldorf · NRW', 'Webdesign &amp; SEO', '≤ 24 h Antwort'],
    },
    overview: {
      eyebrow: 'Leistungen im Überblick',
      title: 'Web <em>leistungen.</em>',
      lead: 'Webdesign und SEO als eine Sache. Eine schöne Seite, die niemand findet, ist genauso wenig wert wie eine ranking-starke Seite, die niemand mag.',
      cards: [
        {
          kicker: '01 / Site',
          title: 'Neue Websites',
          body: 'Editorial geführte, moderne Websites — handgebaut, ohne Page-Builder-Aufblähung. Schnell, schlank, semantisch sauber.',
          items: ['HTML/CSS/JS hand-getuned', 'Performance-Budget &lt; 200 KB Initial', 'Strukturierte Daten und OG-Tags'],
        },
        {
          kicker: '02 / Local SEO',
          title: 'Lokale Sichtbarkeit',
          body: 'Lokale Kategorieseiten, Google-Business-Optimierung, strukturierte Daten und Local-Pack-Sichtbarkeit für Düsseldorf und NRW.',
          items: ['Stadtseiten mit echtem Mehrwert', 'LocalBusiness-Schema', 'Bewertungs- und GBP-Pflege'],
        },
        {
          kicker: '03 / Content',
          title: 'Inhalte &amp; Bildsprache',
          body: 'Aus Fotografie und Text wird ein konsistenter Auftritt. Bildauswahl, Tonalität und Struktur kommen aus einer Hand.',
          items: ['Eigene Fotos statt Stock', 'Editorial-Texte mit Haltung', 'Konsistente Mikrocopy'],
        },
        {
          kicker: '04 / Tech',
          title: 'Performance &amp; Wartung',
          body: 'Schnelle Ladezeiten, Core-Web-Vitals im grünen Bereich, regelmäßige Wartung und neue Inhalte ohne Drama.',
          items: ['LCP &lt; 2 s, CLS ~ 0', 'Wartungspaket monatlich', 'Inhalte-Updates ohne CMS-Stress'],
        },
      ],
    },
    feature: {
      aria: 'System',
      eyebrow: 'System',
      title: 'Nicht eine Seite — <em>ein System.</em>',
      lead: 'Eine Website ist kein Layout, sondern ein System aus Inhalten, Struktur und Verbindungen. Wenn das System stimmt, wachsen einzelne Seiten organisch dazu.',
      items: [
        { tag: 'Struktur', line: 'Sitemap, URL-Schema und interne Verlinkung vor dem ersten Pixel.' },
        { tag: 'Design', line: 'Editorial geführt, mit echtem Bildmaterial und ruhiger Typo.' },
        { tag: 'Tech', line: 'Astro, Next.js oder reines HTML — je nach Bedarf, nicht nach Trend.' },
        { tag: 'SEO', line: 'On-Page, Local, Schema, OG-Tags und Sitemap im Standard inbegriffen.' },
      ],
    },
    ctaHead: 'Bereit für ein <em>Webdesign &amp; SEO-Briefing.</em>',
    contact: {
      subject: 'Webdesign-Anfrage — Matthias Ramahi',
      headline: 'Website anfragen.',
      lead: 'Beschreibe kurz, ob es um eine neue Website, Relaunch, lokale SEO-Seiten oder eine Beratung geht. Hilfreich: vorhandene Website, Branche, Zielregion und ob Texte oder Bilder schon vorhanden sind.',
    },
  },
  'videografie-duesseldorf.html': {
    file: 'videografie-duesseldorf.html',
    hero: {
      image: asset('assets/services/portfolio_webp_full_058-1.webp'),
      alt: 'Filmstill aus einer Videografie-Produktion',
      width: 1536,
      height: 1920,
      crumb: 'Videografie',
      eyebrow: 'Motion · Düsseldorf',
      h1: 'Video<br><em>grafie.</em>',
      lead: 'Bewegtbild aus Düsseldorf — Imagefilm, Musikvideo, Eventfilm und redaktionelles Bewegtbild. Aus einer Familie, aus einer Bildsprache: Foto und Video aus einem Guss.',
      primary: 'Video anfragen →',
      secondary: 'Leistungen ansehen',
      side: ['Düsseldorf · NRW', 'Videografie', '≤ 24 h Antwort'],
    },
    overview: {
      eyebrow: 'Leistungen im Überblick',
      title: 'Bewegtbild <em>leistungen.</em>',
      lead: 'Bewegtbild verlangt eine andere Planung als Stand — aber dieselbe Bildsprache. Wir koordinieren beides parallel auf Set, damit nichts zweimal gefilmt werden muss.',
      cards: [
        {
          kicker: '01 / Marke',
          title: 'Imagefilm',
          body: 'Kurze, ruhige Imagefilme für Marken, Marken, Praxen und Handwerk — mit echtem Bildmaterial statt Stock.',
          items: ['60–120 Sekunden Schnittfassung', 'Voice-Over oder reine Bildsprache', 'Vertikal- und Horizontalvariante'],
        },
        {
          kicker: '02 / Musik',
          title: 'Musikvideo',
          body: 'Musikvideos für Soloartists, Bands und Klassiker — produziert von Sophia Ramahi in Düsseldorf.',
          items: ['Konzeption mit Künstler:innen', 'Mehrtägige Drehs möglich', 'Color Grading editorial'],
        },
        {
          kicker: '03 / Event',
          title: 'Eventfilm',
          body: 'Hochzeit, Konzert, Konferenz, Galaabend — diskrete Multi-Kamera-Aufzeichnung und cineastischer Schnitt.',
          items: ['Multi-Kamera mit getrenntem Audio', 'Highlightfilm und Lang-Dokument', 'Lieferung in 14 Tagen'],
        },
        {
          kicker: '04 / Redaktion',
          title: 'Redaktionelles Bewegtbild',
          body: 'Reportagen, Interviews, Behind-the-Scenes — für Pressekits, Social und Magazine.',
          items: ['Interview-Setup mit Backdrop', 'Untertitel und Kapitelmarken', 'Vertikal-Version für Social'],
        },
      ],
    },
    feature: {
      aria: 'Foto + Video',
      eyebrow: 'Foto + Video',
      title: 'Bewegung und <em>Bild — gleichzeitig.</em>',
      lead: 'Wenn Foto und Video aus einer Hand kommen, gibt es weniger Termine, weniger Doppelarbeit und ein einheitliches Ergebnis. Sophia und ich planen Sets gemeinsam.',
      items: [
        { tag: 'Planung', line: 'Ein Briefing für Foto und Video — abgestimmte Bildsprache und Shotlist.' },
        { tag: 'Crew', line: 'Sophia Ramahi (Video), Matthias Ramahi (Foto), Tonpartner aus NRW.' },
        { tag: 'Lieferung', line: 'Foto-Galerie + Schnittfassung Video parallel, 1–3 Wochen.' },
        { tag: 'Netzwerk', line: 'Imagefilm, Musikvideo, Eventfilm und redaktionelles Bewegtbild aus einem eingespielten Netzwerk.' },
      ],
    },
    ctaHead: 'Bereit für ein <em>Videografie-Briefing.</em>',
    contact: {
      subject: 'Video-Anfrage — Matthias Ramahi',
      headline: 'Video anfragen.',
      lead: 'Schreibe kurz Anlass, Format und gewünschten Termin. Wenn paralleles Foto gewünscht ist, einfach erwähnen — dann planen wir es gemeinsam mit Sophia.',
    },
  },
  'viola-musik-duesseldorf.html': {
    file: 'viola-musik-duesseldorf.html',
    hero: {
      image: asset('assets/services/portfolio_webp_full_004-2.webp'),
      alt: 'Viola und Geige beim klassischen Auftritt',
      width: 853,
      height: 1280,
      crumb: 'Viola Musik',
      eyebrow: 'Music · Düsseldorf',
      h1: 'Viola<br><em>Musik.</em>',
      lead: 'Klassische Begleitung für Hochzeit, Empfang, Trauerfeier und private Anlässe — Viola, Geige und Klavier. Über das Partnernetzwerk aus Düsseldorf vermittelt.',
      primary: 'Musik anfragen →',
      secondary: 'Leistungen ansehen',
      side: ['Düsseldorf · NRW', 'Viola Musik', '≤ 24 h Antwort'],
    },
    overview: {
      eyebrow: 'Leistungen im Überblick',
      title: 'Anlass <em>leistungen.</em>',
      lead: 'Eine ruhige musikalische Begleitung verändert einen Raum spürbar. Hier vermittelte Künstler:innen spielen klassisches Repertoire, sensibel und ohne Show.',
      cards: [
        {
          kicker: '01 / Hochzeit',
          title: 'Trauung &amp; Empfang',
          body: 'Standesamt, kirchliche Trauung, freie Trauung und Sektempfang — mit klassischem Repertoire oder Pop-Arrangements.',
          items: ['Solo Viola, Geige oder Duo', 'Repertoire abgestimmt vorab', 'Auf-/Abbau leise und unkompliziert'],
        },
        {
          kicker: '02 / Trauer',
          title: 'Trauerfeier',
          body: 'Würdevolle musikalische Begleitung in Trauerhalle, Kirche oder am Grab — ruhig und einfühlsam.',
          items: ['Ruhige Stückauswahl', 'Diskret im Hintergrund', 'Kurzfristig verfügbar'],
        },
        {
          kicker: '03 / Privat',
          title: 'Private Anlässe',
          body: 'Geburtstag, Jubiläum, Firmenfeier, Galaempfang — klassische Musik als Atmosphäre, nicht als Hintergrundbeschallung.',
          items: ['Sets von 30–90 Minuten', 'Mehrere Künstler verfügbar', 'Beleuchtung und Aufstellung beachtet'],
        },
        {
          kicker: '04 / Location',
          title: 'Aufnahmen',
          body: 'Für Filme, Imagefilme oder eigene Kompositionen entstehen Location- und Live-Aufnahmen über das Musiknetzwerk.',
          items: ['Live- und Location-Aufnahmen in Düsseldorf', 'Live-Mitschnitt mit Multi-Mikro', 'Lizenzierung für Imagefilme'],
        },
      ],
    },
    feature: {
      aria: 'Vermittlung',
      eyebrow: 'Vermittlung',
      title: 'Musik aus dem <em>Netzwerk.</em>',
      lead: 'Wir spielen nicht selbst — wir vermitteln Künstler:innen aus dem direkten Umfeld. Erfahren, zuverlässig, im Rheinland verwurzelt.',
      items: [
        { tag: 'Repertoire', line: 'Klassik, Filmmusik, Pop-Arrangements und individuelle Stücke nach Absprache.' },
        { tag: 'Besetzung', line: 'Solo Viola/Geige, Duo mit Klavier, kleines Streicher-Ensemble.' },
        { tag: 'Anlass', line: 'Trauung, Trauerfeier, Empfang, Galadinner, Privatkonzert.' },
        { tag: 'Region', line: 'Düsseldorf · Rheinland · NRW — auf Anfrage auch deutschlandweit.' },
      ],
    },
    ctaHead: 'Bereit für ein <em>Viola Musik-Briefing.</em>',
    contact: {
      subject: 'Musik-Anfrage — Matthias Ramahi',
      headline: 'Musik anfragen.',
      lead: 'Schreibe kurz Anlass, Ort, Datum und ungefähre Dauer. Wir vermitteln passende Künstler:innen und melden uns mit Vorschlag und Konditionen.',
    },
  },
  'drucke-sonderanfertigungen-duesseldorf.html': {
    file: 'drucke-sonderanfertigungen-duesseldorf.html',
    hero: {
      image: asset('assets/services/fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp'),
      alt: 'Sonderanfertigung — Print als Objekt',
      width: 860,
      height: 603,
      crumb: 'Drucke &amp; Sonderanfertigungen',
      eyebrow: 'Object Lab · Düsseldorf',
      h1: 'Drucke &amp;<br><em>Sonderanfertigungen.</em>',
      lead: 'Wenn ein Motiv nicht in ein Standardformat passt — Sonderformate, Materialtests, Interior-Lösungen und objektartige Präsentationen für Wand, Raum und Anlass.',
      primary: 'Sonderanfertigung anfragen →',
      secondary: 'Leistungen ansehen',
      side: ['Düsseldorf · NRW', 'Drucke &amp; Sonderanfertigungen', '≤ 24 h Antwort'],
    },
    overview: {
      eyebrow: 'Leistungen im Überblick',
      title: 'Object <em>leistungen.</em>',
      lead: 'Diese Seite bündelt alles, was nicht in Standardformate passt: besondere Materialien, kleine Serien, persönliche Geschenke und objektartige Präsentationen.',
      cards: [
        {
          kicker: '01 / Objekt',
          title: 'Individuelle Fotodrucke',
          body: 'Einzelmotive als hochwertiges Objekt geplant — Format, Material und Oberfläche passend zum Bild, nicht zur Lagerware.',
          items: ['Portrait, Landschaft oder Fahrzeug', 'Rahmung und Präsentationsart', 'Materialberatung nach Einsatzort'],
        },
        {
          kicker: '02 / Serie',
          title: 'Kleine Serien &amp; Editionen',
          body: 'Für Ausstellungen, Geschenke oder Sammler entstehen abgestimmte Serien mit konsistenter Farbe und Präsentation.',
          items: ['Signatur oder Editionsnummer', 'Mehrere Größen aus einer Serie', 'Verpackung und Übergabe'],
        },
        {
          kicker: '03 / Raum',
          title: 'Interior &amp; Wand',
          body: 'Motiv und Raum gemeinsam gedacht: Größe, Blickachse, Licht und Material bestimmen das Ergebnis.',
          items: ['Wohnraum, Büro oder Showroom', 'Panoramen und Sonderformate', 'Wandcheck und Empfehlung'],
        },
        {
          kicker: '04 / Test',
          title: 'Materialtests &amp; Sonderfinish',
          body: 'Wenn das Motiv eine besondere Oberfläche braucht, werden Finish, Träger und Wirkung vorher sauber geprüft.',
          items: ['Acryl, Dibond, Canvas, Papier', 'Matt, glänzend, metallic', 'Proof und Muster möglich'],
        },
      ],
    },
    feature: {
      aria: 'Materiallogik',
      eyebrow: 'Materiallogik',
      title: 'Material verändert <em>das Bild.</em>',
      lead: 'Ein Auto auf Metallic-Papier wirkt anders als ein Portrait auf mattem FineArt. Eine Landschaft auf Acrylglas hat eine andere Tiefe als auf Leinwand. Material ist Teil der Bildwirkung.',
      items: [
        { tag: 'Glanz', line: 'Für Tiefe, Farbe und Reflexion — Auto, Location, dunkle Motive.' },
        { tag: 'Matt', line: 'Für ruhige, galerieartige Bildwirkung — Portrait, Landschaft.' },
        { tag: 'Objekt', line: 'Für stabile, repräsentative Wandflächen — Acryl, Dibond.' },
        { tag: 'Sonder', line: 'Für haptische Editionen und Geschenke — Bütten, Holz, Metallpapier.' },
      ],
    },
    ctaHead: 'Bereit für ein <em>Drucke &amp; Sonderanfertigungen-Briefing.</em>',
    contact: {
      subject: 'Sonderanfertigung — Matthias Ramahi',
      headline: 'Sonderanfertigung anfragen.',
      lead: 'Schreib kurz Motiv, Format und Einsatzort. Wenn Größe, Material oder Menge noch offen sind, beschreibe einfach Raum, Anlass und gewünschte Wirkung — daraus lässt sich die passende Lösung ableiten.',
    },
  },
}

export const nativeServiceDetailFiles = Object.keys(nativeServiceDetailPages)
