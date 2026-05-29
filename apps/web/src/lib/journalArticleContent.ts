export type JournalArticleLink = {
  href: string
  label: string
}

export type JournalArticleCard = JournalArticleLink & {
  category: string
  image: string
  imageAlt: string
  minutes: string
  text: string
  title: string
}

export type JournalArticleSection = {
  id: string
  kicker?: string
  title: string
  paragraphs?: string[]
  paragraphsHtml?: string[]
  list?: Array<{ label?: string; text: string }>
  quote?: { text: string; cite?: string }
  figure?: {
    alt: string
    caption: string
    height: number
    image: string
    width: number
  }
  inlineCta?: {
    href: string
    label: string
    text: string
    title: string
  }
}

export type JournalArticle = {
  author?: {
    image: string
    text: string
  }
  category: string
  categoryHref?: string
  cta?: {
    primaryHref: string
    primaryLabel: string
    secondaryHref?: string
    secondaryLabel?: string
    text: string
    title: string
  }
  dateLabel: string
  dateTime: string
  description: string
  faq?: Array<{ answer: string; question: string }>
  heroImage: string
  heroImageAlt: string
  legacyFile: string
  links: JournalArticleLink[]
  minutes: string
  relatedCards?: JournalArticleCard[]
  sections: JournalArticleSection[]
  seoTitle?: string
  title: string
  titleHtml?: string
  variant?: 'feature' | 'support'
}

const supportArticles: JournalArticle[] = [
  {
    legacyFile: 'blog-portraits-ohne-generische-posen.html',
    title: 'Portraits ohne generische Posen',
    description:
      'Wie ruhige Portraitfotografie in Duesseldorf mehr Wirkung erzeugt als ueberinszenierte Posen: Licht, Distanz, Haltung und Bildauswahl bewusst fuehren.',
    category: 'Portrait',
    minutes: '4 Min',
    dateLabel: 'Aktualisiert 27.05.2026',
    dateTime: '2026-05-27',
    heroImage: 'assets/photos/portrait-warm.webp',
    heroImageAlt: 'Portrait in warmem Licht',
    links: [
      { label: 'Portraitfotografie Duesseldorf', href: 'portraitfotografie-duesseldorf.html' },
      { label: 'Business Portrait', href: 'business-portrait-duesseldorf.html' },
      { label: 'Headshot Fotograf', href: 'headshot-fotograf-duesseldorf.html' },
    ],
    sections: [
      {
        id: 'abschnitt-1',
        kicker: '01',
        title: 'Der ruhige Raum wirkt staerker',
        paragraphs: [
          'Gute Portraits muessen nicht laut sein. Entscheidend ist, ob der Bildraum der Person hilft, praesent zu bleiben. Wenn Pose, Licht und Hintergrund zu viel erklaeren, verschwindet oft genau das, was ein Portrait tragen soll: Haltung, Blick und eine glaubwuerdige Naehe.',
        ],
      },
      {
        id: 'abschnitt-2',
        kicker: '02',
        title: 'Fuehrung statt Posing-Katalog',
        paragraphs: [
          'Im Shooting geht es nicht darum, eine Liste bekannter Posen abzuhaken. Sinnvoller ist eine klare Fuehrung: kleine Veraenderungen in Schulterlinie, Blickrichtung, Abstand zur Kamera und Atemtempo. Dadurch entsteht Varianz, ohne dass die Person in eine Rolle gedrueckt wird.',
        ],
      },
      {
        id: 'abschnitt-3',
        kicker: '03',
        title: 'Licht als Tonfall',
        paragraphs: [
          'Portraitlicht darf praezise sein, ohne steril zu wirken. Weiches Seitenlicht, kontrollierte Schatten und ein ruhiger Hintergrund geben dem Gesicht Struktur. Fuer Business, Editorial und Personal Branding ist diese Balance wichtiger als ein Effekt, der nur auf den ersten Blick auffaellt.',
        ],
      },
      {
        id: 'abschnitt-4',
        kicker: '04',
        title: 'Auswahl ist Teil der Fotografie',
        paragraphs: [
          'Die finale Serie entsteht in der Auswahl. Ein gutes Set braucht nicht moeglichst viele Motive, sondern eine nachvollziehbare Reihenfolge: ein starkes Hauptportrait, Varianten fuer Website und Social, Details fuer redaktionische Nutzung und Bilder, die auch in kleiner Groesse funktionieren.',
        ],
      },
    ],
    faq: [
      {
        question: 'Wie viele Portraits braucht man wirklich?',
        answer: 'Fuer die meisten Anwendungen reichen wenige starke Motive mit klarer Variation. Wichtiger als Menge ist, dass jedes Bild eine eigene Funktion erfuellt.',
      },
      {
        question: 'Ist eine bestimmte Location notwendig?',
        answer: 'Nicht zwingend. Ein ruhiger Raum, gutes Fensterlicht oder ein passender Arbeitskontext koennen oft glaubwuerdiger wirken als ein neutraler Hintergrund.',
      },
    ],
  },
  {
    legacyFile: 'blog-serie-kuratieren.html',
    title: 'Wie eine fotografische Serie kuratiert wird',
    description:
      'Von der ersten Bildauswahl bis zur finalen Reihenfolge: Warum kuratierte Fotografie-Serien staerker wirken als lose Einzelbilder.',
    category: 'Prozess',
    minutes: '6 Min',
    dateLabel: 'Aktualisiert 27.05.2026',
    dateTime: '2026-05-27',
    heroImage: 'assets/optimized/assets-photos-oldtimer-stage-1920.webp',
    heroImageAlt: 'Oldtimer Szene in dunklem Licht',
    links: [
      { label: 'Portfolio ansehen', href: 'portfolio.html' },
      { label: 'Automobil Fotografie', href: 'automobil-fotografie-duesseldorf.html' },
      { label: 'Oldtimer Fotografie', href: 'oldtimer-fotografie-duesseldorf.html' },
    ],
    sections: [
      {
        id: 'abschnitt-1',
        kicker: '01',
        title: 'Eine Serie braucht Richtung',
        paragraphs: [
          'Einzelbilder koennen stark sein, aber eine Serie muss fuehren. Sie braucht Anfang, Verdichtung und Abschluss. Gerade bei Fahrzeugen, Portraits oder Landschaften entscheidet die Reihenfolge darueber, ob ein Betrachter bleibt oder nur schnell durchscrollt.',
        ],
      },
      {
        id: 'abschnitt-2',
        kicker: '02',
        title: 'Erst Funktion, dann Geschmack',
        paragraphs: [
          'Vor der Auswahl steht die Frage nach der Nutzung: Verkauf, Portfolio, Website, Print, Kampagne oder interne Praesentation. Erst wenn diese Funktion klar ist, laesst sich entscheiden, welche Bilder tragen und welche nur Varianten sind.',
        ],
      },
      {
        id: 'abschnitt-3',
        kicker: '03',
        title: 'Reduktion macht wertiger',
        paragraphs: [
          'Eine gute Auswahl laesst Luft. Aehnliche Motive konkurrieren miteinander und schwaechen oft den Eindruck. Besser ist eine knappe Serie mit klaren Rollen: Einstieg, Totale, Detail, Atmosphaere, Mensch oder Kontext und ein starkes Schlussbild.',
        ],
      },
      {
        id: 'abschnitt-4',
        kicker: '04',
        title: 'Technische Konsistenz zaehlt',
        paragraphs: [
          'Farbe, Kontrast, Beschnitt und Helligkeit muessen zusammenarbeiten. Eine Serie wirkt hochwertig, wenn jedes Bild eigenstaendig bleibt und trotzdem dieselbe visuelle Sprache spricht.',
        ],
      },
    ],
    faq: [
      {
        question: 'Wie viele Bilder gehoeren in eine Serie?',
        answer: 'Das haengt vom Einsatz ab. Fuer eine Website reichen oft 8 bis 16 Bilder, fuer eine Kampagne oder ein Portfolio koennen mehr Varianten sinnvoll sein.',
      },
      {
        question: 'Wer entscheidet die finale Auswahl?',
        answer: 'Die Auswahl entsteht idealerweise gemeinsam: fotografische Kuratierung trifft auf den realen Einsatz der Bilder.',
      },
    ],
  },
  {
    legacyFile: 'blog-oldtimer-wertobjekt.html',
    title: 'Oldtimer als Wertobjekt fotografieren',
    description:
      'Warum Oldtimer-Fotografie fuer Verkauf, Sammlung und Auktion von Zurueckhaltung, Materialtreue und klarer Dokumentation profitiert.',
    category: 'Oldtimer',
    minutes: '3 Min',
    dateLabel: 'Aktualisiert 27.05.2026',
    dateTime: '2026-05-27',
    heroImage: 'assets/optimized/assets-photos-oldtimer-stage-1920.webp',
    heroImageAlt: 'Oldtimer in Buehnenlicht',
    links: [
      { label: 'Oldtimer Fotografie Duesseldorf', href: 'oldtimer-fotografie-duesseldorf.html' },
      { label: 'Classic Car Fotografie', href: 'classic-car-fotografie-duesseldorf.html' },
      { label: 'Oldtimer Verkaufsfotos', href: 'oldtimer-verkaufsfotos-duesseldorf.html' },
    ],
    sections: [
      {
        id: 'abschnitt-1',
        kicker: '01',
        title: 'Wert braucht Ruhe',
        paragraphs: [
          'Ein Oldtimer ist selten nur ein Fahrzeug. Zustand, Herkunft, Material und Pflegegeschichte sind Teil des Bildes. Zu viel Drama kann diesen Wert verdecken. Ruhige Perspektiven, kontrollierte Reflexe und ehrliche Details wirken oft hochwertiger.',
        ],
      },
      {
        id: 'abschnitt-2',
        kicker: '02',
        title: 'Dokumentation und Atmosphaere verbinden',
        paragraphs: [
          'Fuer Verkauf oder Auktion muss Fotografie klar zeigen, was vorhanden ist: Karosserie, Innenraum, Lack, Chrom, Leder, Instrumente und Gebrauchsspuren. Gleichzeitig darf die Serie nicht wie ein technischer Zustandsbericht wirken.',
        ],
      },
      {
        id: 'abschnitt-3',
        kicker: '03',
        title: 'Patina nicht verstecken',
        paragraphs: [
          'Patina kann Charakter sein. Sie sollte nicht platt retuschiert werden, sondern sauber sichtbar bleiben. Entscheidend ist, ob Gebrauchsspuren als Mangel oder als Geschichte gelesen werden. Die Bildfuehrung hilft bei dieser Einordnung.',
        ],
      },
      {
        id: 'abschnitt-4',
        kicker: '04',
        title: 'Kontext macht Vertrauen',
        paragraphs: [
          'Ein neutraler, ordentlicher Standort, nachvollziehbare Details und konsistente Farbe schaffen Vertrauen. Gerade bei hochwertigen Fahrzeugen sind Bilder Teil der Verkaufsargumentation.',
        ],
      },
    ],
    faq: [
      { question: 'Sind Detailbilder wichtig?', answer: 'Ja. Details wie Leder, Instrumente, Chrom, Felgen und Lack geben Kaeufern und Sammlern Orientierung.' },
      { question: 'Soll ein Oldtimer dramatisch inszeniert werden?', answer: 'Nur wenn es zur Nutzung passt. Fuer Verkauf und Sammlung ist eine kontrollierte, ruhige Bildsprache meist staerker.' },
    ],
  },
  {
    legacyFile: 'blog-fine-art-druck.html',
    title: 'Vom Bild zum Fine-Art-Druck',
    description:
      'Warum Material, Papier, Farbmanagement und Format Teil der fotografischen Wirkung sind, wenn Bilder als Fine-Art-Print oder Wandbild funktionieren sollen.',
    category: 'Druck',
    minutes: '5 Min',
    dateLabel: 'Aktualisiert 27.05.2026',
    dateTime: '2026-05-27',
    heroImage: 'assets/services/fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp',
    heroImageAlt: 'Fotobuecher und Druckprodukte',
    links: [
      { label: 'Fotolabor und Druck', href: 'fotolabor-druck-duesseldorf.html' },
      { label: 'Landschaftsbilder kaufen', href: 'landschaftsbilder-kaufen.html' },
      { label: 'Wandbilder Landschaftsfotografie', href: 'wandbilder-landschaftsfotografie.html' },
    ],
    sections: [
      {
        id: 'abschnitt-1',
        kicker: '01',
        title: 'Druck ist kein Export-Klick',
        paragraphs: [
          'Ein Bild veraendert sich, sobald es den Bildschirm verlaesst. Papierstruktur, Format, Betrachtungsabstand und Licht im Raum bestimmen, ob ein Motiv ruhig, dicht oder flach wirkt. Deshalb gehoert Druckplanung zur fotografischen Entscheidung.',
        ],
      },
      {
        id: 'abschnitt-2',
        kicker: '02',
        title: 'Material traegt die Stimmung',
        paragraphs: [
          'Matte Papiere nehmen Glanz zurueck und betonen Flaeche und Tiefe. Glattere Oberflaechen koennen Details und Kontrast praesenter machen. Die Wahl des Materials sollte zur Stimmung des Motivs und zum Raum passen.',
        ],
      },
      {
        id: 'abschnitt-3',
        kicker: '03',
        title: 'Farbmanagement schafft Verlaesslichkeit',
        paragraphs: [
          'Fine-Art-Druck braucht kontrollierte Daten: Profil, Tonwerte, Schaerfung und Probedrucke. Ein starker Print entsteht nicht durch maximale Saettigung, sondern durch eine stimmige Uebersetzung des Bildes in Material.',
        ],
      },
      {
        id: 'abschnitt-4',
        kicker: '04',
        title: 'Format ist Wirkung',
        paragraphs: [
          'Ein kleines Format fordert Naehe. Ein grosses Format veraendert einen Raum. Vor dem Druck sollte klar sein, ob das Bild Blickfang, Ruhepunkt oder Teil einer Serie sein soll.',
        ],
      },
    ],
    faq: [
      { question: 'Welche Groesse ist sinnvoll?', answer: 'Das haengt vom Raum und Betrachtungsabstand ab. Ein groesseres Bild braucht nicht immer mehr Motiv, sondern mehr Ruhe in der Komposition.' },
      { question: 'Kann jedes Foto als Fine-Art-Print funktionieren?', answer: 'Nicht jedes. Aufloesung, Tonwerte, Motivruhe und Material muessen zusammenpassen.' },
    ],
  },
  {
    legacyFile: 'blog-location-scouting-duesseldorf.html',
    title: 'Location Scouting fuer starke Motive',
    description:
      'Wie Orte fuer Automotive-, Portrait- und Landschaftsfotografie ausgewaehlt werden: Licht, Zugang, Hintergrund, Ruhe und Nutzungsziel.',
    category: 'Location',
    minutes: '4 Min',
    dateLabel: 'Aktualisiert 27.05.2026',
    dateTime: '2026-05-27',
    heroImage: 'assets/optimized/assets-photos-landschaft-1920.webp',
    heroImageAlt: 'Landschaftsmotiv mit starker Tiefe',
    links: [
      { label: 'Fotografie Duesseldorf', href: 'fotografie-duesseldorf.html' },
      { label: 'Automobil Fotografie Duesseldorf', href: 'automobil-fotografie-duesseldorf.html' },
      { label: 'Portraitfotografie Duesseldorf', href: 'portraitfotografie-duesseldorf.html' },
    ],
    sections: [
      {
        id: 'abschnitt-1',
        kicker: '01',
        title: 'Ein Ort muss arbeiten',
        paragraphs: [
          'Eine Location ist nicht nur Kulisse. Sie bestimmt Licht, Linien, Abstand, Ruhe und organisatorischen Ablauf. Gute Orte helfen dem Motiv, statt sich davorzudraengen.',
        ],
      },
      {
        id: 'abschnitt-2',
        kicker: '02',
        title: 'Lichtfenster zuerst',
        paragraphs: [
          'Der gleiche Ort kann morgens weich, mittags flach und abends cineastisch wirken. Deshalb beginnt Scouting mit Sonnenstand, Schatten, Reflexionsflaechen und der Frage, wann ein Motiv wirklich atmen kann.',
        ],
      },
      {
        id: 'abschnitt-3',
        kicker: '03',
        title: 'Zugang und Stoerungen planen',
        paragraphs: [
          'Parken, Publikumsverkehr, Genehmigungen und Wetteroptionen sind technische SEO-fremde, aber fotografisch entscheidende Faktoren. Eine starke Serie entsteht leichter, wenn diese Reibung vorher geloest ist.',
        ],
      },
      {
        id: 'abschnitt-4',
        kicker: '04',
        title: 'Ort und Suchintention verbinden',
        paragraphs: [
          'Fuer lokale SEO-Seiten ist Location nicht nur ein Keyword. Sie muss zeigen, warum ein Auftrag in Duesseldorf, NRW oder einer konkreten Stadt sinnvoll geplant werden kann. Ein guter Ort ergaenzt deshalb die Suchintention: Er macht sichtbar, ob es um Verkauf, Markenwirkung, persoenliche Praesenz oder eine ruhige redaktionelle Serie geht.',
        ],
      },
    ],
    faq: [
      { question: 'Wird die Location vorab festgelegt?', answer: 'Ja, zumindest die Richtung. Je nach Wetter und Motiv koennen Alternativen vorbereitet werden.' },
      { question: 'Sind urbane Orte immer besser?', answer: 'Nein. Ein ruhiger, reduzierter Ort kann fuer Portraits oder Fahrzeuge oft hochwertiger wirken als ein auffaelliger Hintergrund.' },
    ],
  },
  {
    legacyFile: 'blog-motorradfotografie-linien.html',
    title: 'Linien, Metall, Haltung',
    description:
      'Warum starke Motorradfotografie ueber Silhouette, Naehe, Material, Fahrerhaltung und klare Linien funktioniert.',
    category: 'Motorrad',
    minutes: '4 Min',
    dateLabel: 'Aktualisiert 27.05.2026',
    dateTime: '2026-05-27',
    heroImage: 'assets/optimized/assets-photos-motorrad-1920.webp',
    heroImageAlt: 'Motorrad vor Architektur',
    links: [
      { label: 'Motorrad Fotografie Duesseldorf', href: 'motorrad-fotografie-duesseldorf.html' },
      { label: 'Custom Bike Fotografie', href: 'custom-bike-fotografie-duesseldorf.html' },
      { label: 'Motorrad Verkaufsfotos', href: 'motorrad-verkaufsfotos-duesseldorf.html' },
    ],
    sections: [
      {
        id: 'abschnitt-1',
        kicker: '01',
        title: 'Motorradbilder brauchen Spannung',
        paragraphs: [
          'Bei Motorraedern geht es um Linien, Material und Haltung. Ein gutes Bild zeigt nicht nur ein Objekt, sondern Energie: Tanklinie, Lenker, Reifen, Stand, Details und die Beziehung zum Fahrer oder zur Werkstatt.',
        ],
      },
      {
        id: 'abschnitt-2',
        kicker: '02',
        title: 'Silhouette vor Detailflut',
        paragraphs: [
          'Wenn alles gleich wichtig ist, verliert das Bike seine Form. Erst die klare Silhouette, dann die Details. Eine Serie sollte zeigen, wie die Maschine steht, wie sie gebaut ist und welche Stimmung sie traegt.',
        ],
      },
      {
        id: 'abschnitt-3',
        kicker: '03',
        title: 'Metall und Lack kontrollieren',
        paragraphs: [
          'Reflexe sind bei Motorraedern besonders sensibel. Chrom, Lack, Carbon und Gummi brauchen Lichtfuehrung, die Material zeigt, ohne alles zu ueberstrahlen.',
        ],
      },
      {
        id: 'abschnitt-4',
        kicker: '04',
        title: 'Fahrerbilder sparsam einsetzen',
        paragraphs: [
          'Mit Fahrer entsteht Haltung. Ohne Fahrer entsteht Objektpraesenz. Beide Varianten koennen stark sein, wenn sie bewusst getrennt und nicht zufaellig gemischt werden.',
        ],
      },
    ],
    faq: [
      { question: 'Sind Fahrerportraits sinnvoll?', answer: 'Ja, wenn die Person Teil der Geschichte ist. Fuer reine Verkaufsbilder kann das Motorrad allein klarer sein.' },
      { question: 'Welche Location passt zu einem Custom Bike?', answer: 'Das haengt von Material und Stil ab. Werkstatt, Architektur oder ruhige Strassenkante funktionieren besser als beliebige Kulissen.' },
    ],
  },
]

const featureArticle: JournalArticle = {
  legacyFile: 'blog-automotive-fotografie-duesseldorf.html',
  seoTitle: 'Automotive-Fotografie Düsseldorf | Matthias Ramahi',
  title: 'Automotive-Fotografie in Düsseldorf: Licht, Standort, Karosserie.',
  titleHtml: 'Automotive-Fotografie in Düsseldorf: <em>Licht, Standort, Karosserie.</em>',
  description:
    'Automotive-Fotografie in Düsseldorf: Licht, Standort und Karosserie bewusst planen, damit Fahrzeugbilder für Verkauf, Marke und Kampagne funktionieren.',
  category: 'Automotive',
  categoryHref: 'automobil-fotografie-duesseldorf.html',
  minutes: '5 Minuten',
  dateLabel: '12. Mai 2026',
  dateTime: '2026-05-12',
  heroImage: 'assets/optimized/assets-photos-automobil-neon-1920.webp',
  heroImageAlt: 'Automobil in neonartigem Licht',
  variant: 'feature',
  links: [
    { label: 'Automobil-Fotografie Düsseldorf', href: 'automobil-fotografie-duesseldorf.html' },
    { label: 'Wie eine Bildserie kuratiert wird', href: 'blog-serie-kuratieren.html' },
    { label: 'Location Scouting für starke Motive', href: 'blog-location-scouting-duesseldorf.html' },
  ],
  sections: [
    {
      id: 'standort',
      kicker: '01',
      title: 'Der Standort kommt zuerst',
      paragraphs: [
        'Ein gutes Automobil-Bild entsteht nicht beim Auslösen. Es entsteht in vier Entscheidungen, die zwei Tage vorher getroffen werden müssen: Standort, Lichtquelle, Perspektive zur Karosserie, Tageszeit. Wer diese vier richtig setzt, hat ein Bild. Wer sie offen lässt, hat ein Produktfoto.',
        'Düsseldorf hat als Stadt eine eigene Lichtsignatur. Die Wasserflächen am Hafen, die Glasflächen in Derendorf, der dunkle Asphalt am Rheinufer und die Tunnel- und Brückenkanten am Medienhafen liefern alle eine andere Art von Licht. Das ist kein Zufall, das ist Material.',
        'Der häufigste Fehler in der Automobil-Fotografie ist die Reihenfolge: erst Auto, dann Location suchen. Richtig ist umgekehrt. Der Charakter des Fahrzeugs entscheidet, welche Stadtarchitektur ihn trägt.',
      ],
      list: [
        { label: 'Industriekante', text: 'Hafenbecken, Werften, Lagergebäude. Liefert raue Texturen und gerichtetes Reflexlicht von Wasserflächen.' },
        { label: 'Glas und Beton', text: 'Medienhafen, Kö-Bogen, Düsseldorfer Stadttor. Liefert kühle Reflexe und klare geometrische Hintergründe.' },
        { label: 'Allee und Park', text: 'Hofgarten, Nordpark, Schlossufer Benrath. Liefert weiches Streulicht und einen ruhigen Hintergrund.' },
      ],
    },
    {
      id: 'licht',
      kicker: '02',
      title: 'Lichtkante schlägt Lichtwand',
      paragraphsHtml: [
        'Karosserie ist eine Spiegelfläche. Was sie zeigt, ist nicht das Fahrzeug, sondern die Lichtquelle. Eine Lichtwand erzeugt ein technisch sauberes Bild, aber kein lebendiges. Eine <strong>Lichtkante</strong> erzeugt Volumen: Sie zeichnet die Sicke an der Tür, die Schulter über dem Radlauf, den Übergang von Dach zu Heck.',
        'Bei Tageslicht heißt das: 60-80 Minuten vor Sonnenuntergang, Fahrzeug quer zum Sonnenstand, die Lichtkante läuft über die Karosserie. Bei Nacht: eine einzige starke Reflexquelle und eine Position, in der diese Quelle entlang der Schulter spiegelt.',
      ],
      figure: {
        image: 'assets/optimized/assets-photos-automobil-sunset-1920.webp',
        alt: 'Automobil im warmen Streiflicht der Goldenen Stunde - Düsseldorf',
        caption: 'Goldene Stunde · Streiflicht entlang Schulter und Heck · Düsseldorf',
        width: 1920,
        height: 1280,
      },
    },
    {
      id: 'karosserie',
      kicker: '03',
      title: 'Karosserieform liest sich nur aus einer Richtung',
      paragraphsHtml: [
        'Jede Karosserie hat eine Leserichtung. Bei manchen Fahrzeugen entsteht diese Leserichtung aus der Dreiviertel-Front, weil dort Motorhaube, Schweller und Radlauf gleichzeitig sichtbar sind. Bei anderen liest sich die Form besser aus der Dreiviertel-Heck.',
        'Praktisch heißt das: Vor dem ersten Auslöser einmal um das Fahrzeug gehen, an drei Standardpositionen kurz ins Sucherbild schauen und entscheiden, welche dieser drei dem Fahrzeug die meiste Form gibt. Dann diese als <strong>Hero-Achse</strong> festhalten.',
      ],
      quote: {
        text: 'Ein Fahrzeug fotografisch zu verstehen heißt, seine Hero-Achse zu finden. Alles andere ist Variation.',
        cite: 'Werkstattnotiz',
      },
    },
    {
      id: 'tageszeit',
      kicker: '04',
      title: 'Tageszeit ist eine Entscheidung',
      paragraphs: [
        'Es gibt für jedes Automobil-Bild ein 30-Minuten-Fenster, in dem Licht, Verkehr, Reflexionen und Stimmung zusammenpassen. Außerhalb dieses Fensters sind die Faktoren technisch ähnlich gut, das Bild wirkt aber nicht.',
      ],
      list: [
        { label: 'Goldene Stunde', text: '60 Minuten vor Sonnenuntergang, für warme Schulter-Streiflichter.' },
        { label: 'Blaue Stunde', text: '15 Minuten nach Sonnenuntergang, für Wechselspiel aus Tageslicht und Stadtbeleuchtung.' },
        { label: 'Tiefe Nacht', text: 'Wenn Verkehr weg ist und Reflexquellen sich isoliert auf der Karosserie zeichnen lassen.' },
        { label: 'Bewölkter Vormittag', text: 'Wenn die Karosseriefarbe matt und gedämpft erscheinen soll.' },
      ],
      inlineCta: {
        title: 'Automotive-Shooting planen',
        text: 'Standort-Scouting, Tageszeitfenster und Hero-Achse vorab im Briefing definiert.',
        href: 'contact.html',
        label: 'Projekt anfragen →',
      },
    },
    {
      id: 'auswahl',
      kicker: '05',
      title: 'Auswahl ist Teil des Bildes',
      paragraphs: [
        'Nach dem Shooting liegen typischerweise 60-120 Frames vor. Davon werden 8-14 für die Auslieferung kuratiert: nicht die zehn technisch besten, sondern eine Sequenz, die einer Dramaturgie folgt. Der Unterschied zwischen einer Automobil-Bildstrecke und einem Produktfoto liegt zu 40 Prozent in dieser Reihenfolge.',
      ],
    },
    {
      id: 'fazit',
      kicker: '06',
      title: 'Fazit',
      paragraphs: [
        'Automotive-Fotografie ist nicht eine Frage der Ausrüstung. Sie ist eine Frage von Reihenfolge: Standort, Lichtquelle, Hero-Achse, Tageszeitfenster, Kuration. Wer diese fünf Entscheidungen vor dem Auslöser trifft, kommt mit weniger Frames, aber stärkeren Bildern zurück.',
      ],
    },
  ],
  author: {
    image: 'assets/portraits/_DSC9301-Enhanced-NR.webp',
    text: 'Fotograf mit Schwerpunkt Automobil und Portrait. Arbeitet aus Düsseldorf für Kunden in NRW und deutschlandweit: Editorial, Marken-Shootings, Sammlerfahrzeuge, Auktionskataloge.',
  },
  relatedCards: [
    {
      href: 'blog-serie-kuratieren.html',
      label: 'Wie eine Serie kuratiert wird',
      image: 'assets/optimized/assets-photos-oldtimer-stage-1920.webp',
      imageAlt: 'Oldtimer Szene in dunklem Licht',
      category: 'Prozess',
      minutes: '6 Min',
      title: 'Wie eine Serie kuratiert wird.',
      text: 'Von der ersten Auswahl bis zur Reihenfolge, die beim Betrachten Spannung hält.',
    },
    {
      href: 'blog-location-scouting-duesseldorf.html',
      label: 'Location Scouting fuer starke Motive',
      image: 'assets/optimized/assets-photos-landschaft-1920.webp',
      imageAlt: 'Landschaftsmotiv mit starker Tiefe',
      category: 'Location',
      minutes: '4 Min',
      title: 'Location Scouting für starke Motive.',
      text: 'Wie Orte ausgewählt werden, bevor Kamera und Licht überhaupt aufgebaut sind.',
    },
    {
      href: 'blog-oldtimer-wertobjekt.html',
      label: 'Oldtimer als Wertobjekt',
      image: 'assets/optimized/assets-photos-oldtimer-stage-1920.webp',
      imageAlt: 'Oldtimer in Bühnenlicht',
      category: 'Oldtimer',
      minutes: '3 Min',
      title: 'Oldtimer als Wertobjekt.',
      text: 'Warum Zurückhaltung oft hochwertiger wirkt als dramatischer Dauer-Effekt.',
    },
  ],
  cta: {
    title: 'Automotive-Shooting planen.',
    text: 'Briefing mit Fahrzeug, Wunschstandort und Zeitraum: Standort-Scouting und Tageszeitfenster werden vorab abgestimmt.',
    primaryHref: 'contact.html',
    primaryLabel: 'Projekt anfragen',
    secondaryHref: 'automobil-fotografie-duesseldorf.html',
    secondaryLabel: 'Leistungen ansehen',
  },
}

export const journalArticles: JournalArticle[] = [featureArticle, ...supportArticles]

export const journalArticleByLegacyFile = Object.fromEntries(
  journalArticles.map((article) => [article.legacyFile, article]),
) as Record<string, JournalArticle>
