export type VehicleDisciplineKey = 'automobil' | 'sportwagen' | 'oldtimer' | 'motorrad'

export type VehicleWorkflowStep = {
  title: string
  text: string
  /** Foto zum Schritt (eigenes, freigegebenes Motiv; nicht schon im Seitenraster). */
  image: string
  alt: string
}

export type VehiclePillarSpec = {
  workflowHeading: string
  workflowEmphasis: string
  workflowIntro: string
  workflowSteps: VehicleWorkflowStep[]
  scopeHeading: string
  scopePriceNote: string
  scopeBullets: string[]
  scopeCtaLabel: string
  portfolioHref: string
  portfolioLabel: string
}

export const vehiclePillarSpecs: Record<VehicleDisciplineKey, VehiclePillarSpec> = {
  automobil: {
    workflowHeading: 'So läuft dein',
    workflowEmphasis: 'Auto-Shooting ab.',
    workflowIntro:
      'Jede Serie startet beim Verwendungszweck, ob Privatverkauf, Autohaus-Bestand, persönliches Lieblingsfahrzeug oder Markenkampagne. Daraus ergeben sich Location, Lichtfenster und Bildliste.',
    workflowSteps: [
      {
        title: 'Briefing & Zweck klären',
        text: 'Du schreibst kurz, welches Fahrzeug fotografiert wird, wo es steht und wofür die Bilder gedacht sind (Inserat, Privat, Showroom, Social Media oder Druck). Daraus entsteht ein konkreter Plan und ein transparentes Angebot.',
        image: '/assets/portfolio/automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0427.webp',
        alt: 'Grüner BMW Alpina B8 zwischen Glasfassaden im Düsseldorfer Medienhafen',
      },
      {
        title: 'Location-Scouting & Lichtfenster',
        text: 'Wir wählen den passenden Ort in Düsseldorf oder NRW, etwa Medienhafen, Rheinufer, ruhige Industriekulissen oder direkt bei dir am Autohaus bzw. Stellplatz. Die meisten Termine liegen am späten Nachmittag oder zur blauen Stunde für weiche Reflexe.',
        image: '/assets/portfolio/automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0743.webp',
        alt: 'BMW Alpina B8 am Rheinufer vor der Rheinkniebrücke im Abendlicht',
      },
      {
        title: 'Shooting mit Lack- & Reflexkontrolle',
        text: 'Vor Ort fotografieren wir in klarer Reihenfolge: Exterieur mit kontrollierten Spiegelungen, Interieur mit mobilem Licht, Details wie Felgen und Nähte sowie auf Wunsch Rolling Shots auf geeigneter, abgesicherter Strecke.',
        image: '/assets/portfolio/automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0430.webp',
        alt: 'Front des BMW Alpina B8 mit Schmiedefelge und Spiegelungen im Lack',
      },
      {
        title: 'Kuration, Retusche & Lieferung',
        text: 'Die ausgewählte Serie wird einheitlich und fahrzeugtreu bearbeitet und als sortierte Online-Galerie (z. B. über Google Drive) in Web- und Druckauflösung bereitgestellt. Fine-Art-Prints sind separat möglich.',
        image: '/assets/portfolio/automobil-bmw-alpina-b8-medienhafen-duesseldorf-dsc0492-hdr.webp',
        alt: 'Innenraum des BMW Alpina B8 mit Lederausstattung',
      },
    ],
    scopeHeading: 'Rahmen, Umfang & Lieferung',
    scopePriceNote: 'Einstieg ab 250 € inkl. MwSt.',
    scopeBullets: [
      'Individuelles Angebot nach Fahrzeuganzahl, Motivumfang, Location und geplanter Nutzung',
      'Kuratierte, einheitlich bearbeitete Bildserie in Web- und Druckauflösung als Online-Galerie',
      'Nutzungsrechte (privat, Inserat oder gewerblich/Kampagne) vor dem Termin klar vereinbart',
      'Basis in Erkrath bei Düsseldorf, mobil in ganz NRW; Drucke & Sonderwünsche separat',
    ],
    scopeCtaLabel: 'Auto-Shooting anfragen',
    portfolioHref: '/portfolio/portfolio-auswahl-automobil',
    portfolioLabel: 'Kuratierte Automobil-Auswahl ansehen',
  },

  sportwagen: {
    workflowHeading: 'So läuft dein',
    workflowEmphasis: 'Sportwagen-Shooting ab.',
    workflowIntro:
      'Flache Silhouetten, Sichtcarbon, große Bremsanlagen und dunkle Lacke reagieren empfindlich auf Perspektive und Licht. Deshalb planen wir Zufahrt, Kulisse und Bildfolge gezielt für dein Fahrzeug.',
    workflowSteps: [
      {
        title: 'Fahrzeug, Finish & Ziel abstimmen',
        text: 'Wir klären Modell, Lack- oder Folienfinish, Bodenfreiheit und Verwendungszweck, von der privaten Sammlerserie über Sportwagenvermietungen bis zu Händler- oder Kampagnenmotiven.',
        image: '/assets/portfolio/automobil-porsche-911-schloss-bensberg-dsc5761.webp',
        alt: 'Silberner Porsche 911 im Hof von Schloss Bensberg',
      },
      {
        title: 'Kulisse & Zufahrt in NRW prüfen',
        text: 'Architektur mit klaren Kanten wie im Düsseldorfer Medienhafen, Industriekulissen wie Zollverein oder ein gemietetes Studio: Wir wählen nur Spots mit sauberer Zufahrt ohne unnötige Rampenrisiken.',
        image: '/assets/portfolio/automobil-porsche-911-schloss-bensberg-dsc5746.webp',
        alt: 'Porsche 911 Carrera 4S in der Seitenansicht vor Schloss Bensberg',
      },
      {
        title: 'Präzises Shooting vor Ort',
        text: 'Tiefe Kamerahöhe für Stance und Proportion, kontrollierte Reflexe auf Lack und Carbon, mobiles Licht für Cockpit und Details sowie auf Wunsch Fahraufnahmen oder Trackday-Mitzieher.',
        image: '/assets/portfolio/automobil-porsche-911-schloss-bensberg-dsc5873.webp',
        alt: 'Heckleuchte des Porsche 911 im Detail',
      },
      {
        title: 'Farbtreue Bearbeitung & Übergabe',
        text: 'Zurückhaltende, farbtreue Ausarbeitung ohne künstliche Überzeichnung. Lieferung als sortierte Online-Galerie für Web, Social Media und Großformatdruck.',
        image: '/assets/portfolio/automobil-porsche-911-schloss-bensberg-dsc6027.webp',
        alt: 'Cockpit des Porsche 911 mit Blick auf Schloss Bensberg',
      },
    ],
    scopeHeading: 'Rahmen, Umfang & Lieferung',
    scopePriceNote: 'Einstieg ab 250 € inkl. MwSt.',
    scopeBullets: [
      'Verbindliches Angebot je nach Fahrzeugzahl, Location-Wechsel, Fahrbildern und Nutzung',
      'Geschlossene Serie aus Exterieur, Cockpit, Details (Carbon, Felge, Bremse) und optionaler Bewegung',
      'Ausgabe in Web- und Druckauflösung als Online-Galerie; Hoch- und Querformate direkt mitgeplant',
      'Basis in Erkrath bei Düsseldorf, Einsätze in ganz NRW; Fine-Art-Prints separat aus dem Fotolabor',
    ],
    scopeCtaLabel: 'Sportwagen-Shooting anfragen',
    portfolioHref: '/portfolio/portfolio-auswahl-sportwagen',
    portfolioLabel: 'Kuratierte Sportwagen-Auswahl ansehen',
  },

  oldtimer: {
    workflowHeading: 'So läuft dein',
    workflowEmphasis: 'Oldtimer-Shooting ab.',
    workflowIntro:
      'Ein Klassiker verlangt Ruhe, Respekt vor dem Material und eine klare Unterscheidung zwischen ehrlicher Wertdokumentation und zeitloser Inszenierung, direkt am Standort oder an einer passenden Kulisse.',
    workflowSteps: [
      {
        title: 'Modell, Baujahr & Einsatzzweck klären',
        text: 'Wir besprechen, ob die Serie für Versicherung, Online-Auktion, Verkauf, Sammlungsarchiv oder als Wandbild entsteht. Danach legen wir die verbindliche Ansichten- und Detail-Liste fest.',
        image: '/assets/optimized/oldtimer-mercedes-w196-silberpfeil-960.webp',
        alt: 'Mercedes W196 Silberpfeil vor dunklem Hintergrund',
      },
      {
        title: 'Schonende Standort- & Lichtwahl',
        text: 'Direkt in deiner Garage, im Winterlager, vor ruhiger Architektur in NRW oder in einem gemieteten Studio. Keine unnötigen Fahrten bei schlechtem Wetter. Mobiles Licht bringe ich mit.',
        image: '/assets/portfolio/automobil-oldtimer-supersportwagen-messe-bruessel-dsc3804.webp',
        alt: 'Vorkriegs-Bentley mit Speichenrädern auf der Interclassic Brüssel',
      },
      {
        title: 'Behutsame Dokumentation vor Ort',
        text: 'Alle vier Dreiviertelansichten, gerade Profile auf Scheinwerferhöhe, Innenraum, Armaturen, Motor- und Kofferraum, Typenschild, Schlüssel und Patina entstehen strukturiert und ohne Hektik.',
        image: '/assets/portfolio/serie-oldtimer-bugatti-cockpit.webp',
        alt: 'Cockpit eines Bugatti Type 35 in Schwarzweiß',
      },
      {
        title: 'Zeitlose Farbwelt & Print-Option',
        text: 'Ehrliche, zurückhaltende Ausarbeitung ohne künstliche Retro-Filter. Du erhältst eine sortierte Online-Galerie für Archiv, Katalog oder Inserat, auf Wunsch ergänzt um Fine-Art-Prints.',
        image: '/assets/optimized/oldtimer-mercedes-w196-kuehler-960.webp',
        alt: 'Front des Mercedes W196 mit Kühlergrill',
      },
    ],
    scopeHeading: 'Rahmen, Umfang & Lieferung',
    scopePriceNote: 'Einstieg ab 250 € inkl. MwSt.',
    scopeBullets: [
      'Klare Preis- und Umfangsabstimmung nach Fahrzeugzahl, Dokumentations-Tiefe und Standort',
      'Vollständige, nachvollziehbare Bildfolge für Verkauf, Auktion, Versicherung oder Sammlungsarchiv',
      'Behutsamer Umgang mit Sammlerfahrzeugen: Nichts wird ohne Absprache bewegt oder berührt',
      'Fine-Art-Prints & Wandbilder aus derselben Serie optional über das Fotolabor-Angebot mit Partnerlabor (separat)',
    ],
    scopeCtaLabel: 'Oldtimer-Shooting anfragen',
    portfolioHref: '/portfolio/portfolio-auswahl-oldtimer',
    portfolioLabel: 'Kuratierte Oldtimer-Auswahl ansehen',
  },

  motorrad: {
    workflowHeading: 'So läuft dein',
    workflowEmphasis: 'Motorrad-Shooting ab.',
    workflowIntro:
      'Ein Motorrad ist schmal, mechanisch offen und lebt vom Zusammenspiel aus Maschine, Linie und Fahrer. Wir planen Standbilder, Details, Fahrer-Portraits und sichere Bewegungsaufnahmen als eine geschlossene Serie.',
    workflowSteps: [
      {
        title: 'Bike, Stil & Bildtypen abstimmen',
        text: 'Wir klären Modell oder Custom-Umbau, gewünschte Module (Stand, Details, Biker-Portrait, Pan-Shots/Action oder Nacht/Lightpainting) und wofür die Serie genutzt wird.',
        image: '/assets/journal/motorrad-kawasaki-ninja-20250309-dsc00441.webp',
        alt: 'Kawasaki Ninja in der Heckansicht vor hellem Himmel',
      },
      {
        title: 'Spots, Strecken & Licht in NRW wählen',
        text: 'Sichere Stellfläche mit ruhigem Hintergrund, etwa Medienhafen, Rheinufer, Werkstatttor oder Strecken im Bergischen Land, kombiniert mit einem passenden Lichtfenster am Nachmittag, Abend oder in der Dämmerung.',
        image: '/uploads/payload/20250311-DSC00578-1100x734.webp',
        alt: 'Rheinkniebrücke und Rheinturm in Düsseldorf zur blauen Stunde',
      },
      {
        title: 'Sicherheits-Briefing & Shooting (2–4 Std.)',
        text: 'Vor Bewegungsbildern legen wir Tempo, Linie, Wendepunkt und Handzeichen fest. Am Set entstehen ruhige Silhouetten, Streiflicht-Details, Fahrerbilder und auf Wunsch Mitzieher oder Lightpainting.',
        image: '/assets/journal/motorrad-fahrergruppe-20241201-dsc09060.webp',
        alt: 'Motorradgruppe mit ihren Maschinen am Abend',
      },
      {
        title: 'Serie in Quer- & Hochformat geliefert',
        text: 'Einheitlich bearbeitet und sortiert nach Stand, Detail, Fahrer und Action, als Online-Galerie (z. B. Google Drive) für Website, Inserat, 9:16-Social und optional als Fine-Art-Print.',
        image: '/uploads/payload/20250311-DSC00587-1100x434.webp',
        alt: 'Düsseldorfer Rheinufer bei Nacht',
      },
    ],
    scopeHeading: 'Rahmen, Umfang & Lieferung',
    scopePriceNote: 'Einstieg ab 250 € inkl. MwSt. · ca. 2–4 Stunden',
    scopeBullets: [
      'Klares Angebot nach Anzahl der Bikes, gewünschten Bildtypen (Static, Fahrer, Action/Nacht) und Ort',
      'Querformate für Website, Inserat & Druck sowie 9:16-Hochformate für Reels und Story direkt mitgeplant',
      'Sicherheits- und Ablauf-Briefing vor allen Fahraufnahmen. Verkehrsregeln stehen vor jedem Motiv',
      'Fine-Art-Prints für Werkstatt oder Wand sowie Geschenkgutscheine separat verfügbar',
    ],
    scopeCtaLabel: 'Motorrad-Shooting anfragen',
    portfolioHref: '/portfolio/portfolio-auswahl-motorrad',
    portfolioLabel: 'Kuratierte Motorrad-Auswahl ansehen',
  },
}
