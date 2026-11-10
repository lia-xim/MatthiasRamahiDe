import type { PayloadDoc } from './payload'
import {
  type LocalSeoLayoutFamily,
  localSeoCityTokens,
  localSeoFamilyPrefixMap,
  localSeoParentLegacyFiles,
  normalizeLocalSeoSlug,
} from './localSeoLayoutFamilies'

export type LocalSeoScope = {
  generic?: boolean
  label: string
  slug: string
}

export type VisualItem = {
  alt: string
  className?: string
  fullImage?: string
  height: number
  image: string
  label?: string
  title?: string
  text?: string
  width: number
}

type LinkItem = {
  href: string
  label: string
}

export type LocalSeoFamilyContent = {
  baseSlug: string
  contactLead: (scope: LocalSeoScope, serviceLabel: string) => string
  contactNoun: string
  family: LocalSeoLayoutFamily
  gallery: VisualItem[]
  heroImages: VisualItem[]
  introHeadline: string
  introParagraphs: string[]
  label: string
  moduleHeadline: string
  moduleLead: string
  modules: VisualItem[]
  parentLegacyFile: string
  related: VisualItem[]
  searchLinks: LinkItem[]
  seoTitle: string
  serviceLabel: string
}

const scopeLabels: Record<string, string> = {
  'bergisch-gladbach': 'Bergisch Gladbach',
  bochum: 'Bochum',
  deutschland: 'Deutschland',
  dormagen: 'Dormagen',
  dortmund: 'Dortmund',
  duesseldorf: 'Düsseldorf',
  duisburg: 'Duisburg',
  erkrath: 'Erkrath',
  essen: 'Essen',
  gelsenkirchen: 'Gelsenkirchen',
  hilden: 'Hilden',
  koeln: 'Köln',
  krefeld: 'Krefeld',
  leverkusen: 'Leverkusen',
  mettmann: 'Mettmann',
  moenchengladbach: 'Mönchengladbach',
  moers: 'Moers',
  neuss: 'Neuss',
  nrw: 'NRW',
  oberhausen: 'Oberhausen',
  ratingen: 'Ratingen',
  remscheid: 'Remscheid',
  solingen: 'Solingen',
  wuppertal: 'Wuppertal',
}

export const localSeoScopes: LocalSeoScope[] = [
  'duesseldorf',
  ...localSeoCityTokens.filter((slug) => slug !== 'duesseldorf'),
].map((slug) => ({
  label: scopeLabels[slug] || slug,
  slug,
}))

const keywordLabels: Record<string, string> = {
  'auto-fotografieren-tipps': 'Auto fotografieren Tipps',
  'auto-fotoshooting': 'Auto-Fotoshooting',
  'autohaus-fotografie': 'Autohaus Fotografie',
  autofotografie: 'Autofotografie',
  'autoverkauf-fotos': 'Autoverkauf Fotos',
  'automobil-fotografie': 'Automobil Fotografie',
  'automotive-fotografie': 'Automotive Fotografie',
  'bike-fotografie': 'Bike Fotografie',
  'biker-portrait': 'Biker Portrait',
  'bilder-mit-auto': 'Bilder mit Auto',
  'business-portrait': 'Business Portrait',
  'classic-car-fotografie': 'Classic Car Fotografie',
  'custom-bike-fotografie': 'Custom Bike Fotografie',
  'dating-fotoshooting': 'Dating Fotoshooting',
  'exotic-car-fotografie': 'Exotic Car Fotografie',
  fahrzeugfotografie: 'Fahrzeugfotografie',
  'fine-art-prints': 'Fine-Art-Prints Landschaft',
  'fotoshooting-gutschein': 'Fotoshooting Gutschein',
  'fotoshooting-mit-auto': 'Fotoshooting mit Auto',
  'fotoshooting-preise': 'Fotoshooting Preise',
  'headshot-fotograf': 'Headshot Fotograf',
  landschaftsbilder: 'Landschaftsbilder kaufen',
  landschaftsfotografie: 'Landschaftsfotografie',
  'landschaftsfotografie-print': 'Landschaftsfotografie Print',
  'motorrad-fotografie': 'Motorrad Fotografie',
  'motorrad-shooting': 'Motorrad Shooting',
  'motorrad-verkaufsfotos': 'Motorrad Verkaufsfotos',
  'motorsport-fotografie': 'Motorsport Fotografie',
  'motorsport-sportwagen-fotografie': 'Motorsport- und Sportwagen-Fotografie',
  naturfotografie: 'Naturfotografie Prints',
  'oldtimer-fotografie': 'Oldtimer Fotografie',
  'oldtimer-shooting': 'Oldtimer Shooting',
  'oldtimer-verkaufsfotos': 'Oldtimer Verkaufsfotos',
  'performance-car-fotografie': 'Performance Car Fotografie',
  'paarshooting-familienshooting': 'Paarshooting und Familienshooting',
  'personal-branding-fotografie': 'Personal Branding Fotografie',
  'portrait-fotoshooting': 'Portrait Fotoshooting',
  'portraitfotografie-beleuchtung': 'Portraitfotografie Beleuchtung',
  portraitfotografie: 'Portraitfotografie',
  pressefoto: 'Pressefoto',
  sammlerfahrzeug: 'Sammlerfahrzeug Fotografie',
  'schwarz-weiss-portrait-fotografie': 'Schwarz-Weiss Portrait Fotografie',
  'vintage-fotoshooting': 'Vintage Fotoshooting',
  'fotoshooting-maenner': 'Fotoshooting für Männer',
  musikerfotografie: 'Musikerfotografie',
  'sportwagen-fotografie': 'Sportwagen Fotografie',
  'sportwagen-fotoshooting': 'Sportwagen Fotoshooting',
  'sportwagen-shooting': 'Sportwagen Shooting',
  supersportwagen: 'Supersportwagen Fotografie',
  unternehmensportrait: 'Unternehmensportrait',
  wandbilder: 'Wandbilder Landschaftsfotografie',
  youngtimer: 'Youngtimer Fotografie',
}

const normalizedPrefixEntries = localSeoFamilyPrefixMap.flatMap(({ family, prefixes }) =>
  prefixes.map((prefix) => ({ family, prefix, label: keywordLabels[prefix] || keywordLabels[prefix.split('-')[0]] })),
)

const standaloneKeywordSlugs = new Set([
  'auto-fotografieren-tipps',
  'auto-fotoshooting',
  'autofotografie',
  'autohaus-fotografie',
  'automotive-fotografie',
  'bike-fotografie',
  'bilder-mit-auto',
  'classic-car-fotografie',
  'custom-bike-fotografie',
  'dating-fotoshooting',
  'exotic-car-fotografie',
  'fahrzeugfotografie',
  'fine-art-prints-landschaft',
  'fotoshooting-gutschein',
  'fotoshooting-mit-auto',
  'fotoshooting-preise',
  'landschaftsbilder-kaufen',
  'motorsport-fotografie',
  'motorsport-sportwagen-fotografie',
  'naturfotografie-prints',
  'paarshooting-familienshooting',
  'performance-car-fotografie',
  'personal-branding-fotografie',
  'portrait-fotoshooting',
  'portraitfotografie-beleuchtung',
  'sammlerfahrzeug-fotografie',
  'schwarz-weiss-portrait-fotografie',
  'supersportwagen-fotografie',
  'vintage-fotoshooting',
  'fotoshooting-maenner',
  'musikerfotografie',
  'wandbilder-landschaftsfotografie',
  'youngtimer-fotografie',
])

export type KeywordFocusCopy = {
  audienceHeadline?: string
  audienceLead?: string
  faq?: Array<{ q: string; a: string }>
  cards?: Array<{
    label?: string
    text: string
    title: string
  }>
  contactLead?: string
  featureBody?: string
  featureTitle?: string
  galleryHeadline?: string
  galleryLead?: string
  heroEmphasis?: string
  heroLead?: string
  heroTitle?: string
  metaDescription?: string
  processHeadline?: string
  processLead?: string
  processSteps?: Array<{
    label?: string
    text: string
    title: string
  }>
  pullEmphasis?: string
  pullHeadline?: string
  pullKicker?: string
  pullLead?: string
  relatedLead?: string
  sectionEmphasis?: string
  sectionHeadline?: string
  sectionLead?: string
  statementBody?: string[]
  statementEmphasis?: string
  statementHeadline?: string
}

type SimpleKeywordBrief = {
  cards: [string, string, string, string]
  feature: string
  heroEmphasis: string
  heroTitle: string
  intent: string
  output: string
  planning: string
  related: string
  sectionEmphasis: string
  sectionHeadline: string
}

const simpleKeywordCopy = (label: string, brief: SimpleKeywordBrief): KeywordFocusCopy => ({
  audienceHeadline: `${label}: passende Anfragen.`,
  audienceLead: brief.output,
  cards: [
    { label: 'Fokus', title: brief.cards[0], text: brief.intent },
    { label: 'Planung', title: brief.cards[1], text: brief.planning },
    { label: 'Ausgabe', title: brief.cards[2], text: brief.output },
    { label: 'Grenze', title: brief.cards[3], text: brief.related },
  ],
  contactLead: `Schreibe kurz, welches Motiv im Mittelpunkt steht, wofür ${label} gebraucht wird und ob die Bilder privat, kommerziell, redaktionell oder für Verkauf und Print genutzt werden sollen.`,
  featureBody: brief.feature,
  featureTitle: 'Eigenes Motiv statt Kopie.',
  galleryHeadline: `${label} als Bildserie.`,
  galleryLead: brief.output,
  heroEmphasis: brief.heroEmphasis,
  heroLead: `${label}: ${brief.intent} ${brief.planning}`,
  heroTitle: brief.heroTitle,
  metaDescription: `${label}: ${brief.output}`,
  processHeadline: `${label}: Ablauf.`,
  processLead: `Vor dem Termin werden Ziel, Motiv, Ort, Lichtfenster und Ausgabe geklärt, damit aus der Anfrage ein eigener Bildsatz wird.`,
  processSteps: [
    { title: 'Ziel klären', text: brief.intent },
    { title: 'Motiv planen', text: brief.planning },
    { title: 'Serie bauen', text: brief.feature },
    { title: 'Ausgabe liefern', text: brief.output },
  ],
  pullEmphasis: 'eigener Richtung.',
  pullHeadline: `${label} mit`,
  pullKicker: 'Bildrichtung',
  pullLead: brief.intent,
  relatedLead: brief.related,
  sectionEmphasis: brief.sectionEmphasis,
  sectionHeadline: brief.sectionHeadline,
  sectionLead: brief.planning,
  statementBody: [brief.intent, brief.planning],
  statementEmphasis: 'eigenem Zweck.',
  statementHeadline: `${label} mit`,
})

const keywordFocusDefaults: Record<string, KeywordFocusCopy> = {
  'auto-fotografieren-tipps': simpleKeywordCopy('Auto fotografieren Tipps', {
    cards: ['Licht verstehen', 'Perspektive wählen', 'Reflexe kontrollieren', 'Zum Shooting führen'],
    feature: 'Die Ratgeberseite beantwortet praktische Fragen und zeigt, wann ein professioneller Bildsatz mehr bringt als weitere Einzelversuche.',
    heroEmphasis: 'Tipps.',
    heroTitle: 'Auto fotografieren',
    intent: 'Suchende wollen konkrete Hilfe zu Licht, Winkel, Lackreflexen, Standort und Bildaufbau.',
    output: 'Hilfreiche Tipps plus Brücke zur professionellen Automobilfotografie in NRW.',
    planning: 'Der Text trennt Grundlagen, typische Fehler und professionelle Umsetzung klar voneinander.',
    related: 'Die Seite verlinkt zu Auto-Fotoshooting, Bilder mit Auto und Automobilfotografie, ohne diese Angebote zu verwischen.',
    sectionEmphasis: 'Reflexe.',
    sectionHeadline: 'Licht, Linien,',
  }),
  'auto-fotoshooting': simpleKeywordCopy('Auto-Fotoshooting', {
    cards: ['Lieblingsfahrzeug', 'Location und Licht', 'Bildserie', 'Nicht nur Inserat'],
    feature: 'Das Shooting wird als Erlebnis und verwertbare Serie geplant: Hero-Motiv, Details, Innenraum und Social-Crops.',
    heroEmphasis: 'planen.',
    heroTitle: 'Auto-Fotoshooting',
    intent: 'Die Seite holt private Fahrzeugbesitzer, Sammler, Content-Anfragen und Verkaufsabsichten gemeinsam ab.',
    output: 'Professionelles Auto-Fotoshooting für Privat, Verkauf, Marke und Social Media.',
    planning: 'Ort, Zustand, Tageszeit und Nutzung werden vorab festgelegt, damit das Fahrzeug nicht zufällig wirkt.',
    related: 'Auto-Fotoshooting bleibt die breite Einstiegsseite und verweist auf Bilder mit Auto, Sportwagen, Oldtimer und Motorrad.',
    sectionEmphasis: 'Serie.',
    sectionHeadline: 'Fahrzeug als',
  }),
  'automobil-fotografie': simpleKeywordCopy('Automobilfotografie', {
    cards: ['Exterieur', 'Interieur', 'Details', 'Kampagne'],
    feature: 'Die Hauptseite bleibt die Klammer für Fahrzeugbilder mit Nutzungsziel: Inserat, Marke, Showroom, Kampagne oder private Sammlung.',
    heroEmphasis: 'Fotografie.',
    heroTitle: 'Automobil',
    intent: 'Hier geht es um hochwertige Fahrzeugserien statt um ein einzelnes schönes Autobild.',
    output: 'Automobilfotografie für Verkauf, Marke, Showroom, Kampagne und hochwertige private Fahrzeuge.',
    planning: 'Fahrzeug, Location, Lichtfenster, Bildtypen und Ausgabe werden als Produktionsplan zusammengebracht.',
    related: 'Die Hauptseite verteilt Suchende sauber in Sportwagen, Oldtimer, Motorrad und Auto-Fotoshooting.',
    sectionEmphasis: 'Nutzung.',
    sectionHeadline: 'Fahrzeug, Licht,',
  }),
  'automotive-fotografie': simpleKeywordCopy('Automotive Fotografie', {
    cards: ['Markenlook', 'Editorial', 'Content-Serie', 'Abgrenzung'],
    feature: 'Automotive Fotografie spricht Marken-, Agentur- und Content-Suchen an und ist damit kommerzieller als ein privates Auto-Fotoshooting.',
    heroEmphasis: 'Content.',
    heroTitle: 'Automotive',
    intent: 'Suchende erwarten eine visuelle Sprache für Marke, Kampagne, Social Media oder redaktionelle Strecke.',
    output: 'Automotive Fotografie für Marken, Händler, Content-Serien und redaktionelle Nutzung.',
    planning: 'Briefing, Kanalübersicht, Formate und Wiedererkennbarkeit werden vor der Produktion geklärt.',
    related: 'Die Seite grenzt kommerzielle Automotive-Arbeit von Auto-Fotoshooting und reinen Verkaufsbildern ab.',
    sectionEmphasis: 'Marke.',
    sectionHeadline: 'Bildsprache für',
  }),
  'autofotografie': simpleKeywordCopy('Autofotografie', {
    cards: ['Breiter Einstieg', 'Privat und Business', 'Saubere Motive', 'Weiterleitung'],
    feature: 'Autofotografie ist der kürzere, allgemeinere Begriff und braucht deshalb eine klare Führung in die passenden Unterseiten.',
    heroEmphasis: 'klar.',
    heroTitle: 'Autofotografie',
    intent: 'Der Begriff ist breit: private Autos, Verkauf, Marke, Social und Fahrzeugliebe können gemeint sein.',
    output: 'Autofotografie als Überblick mit schneller Orientierung zu Shooting, Verkauf und Automotive-Serien.',
    planning: 'Die Seite fragt früh nach Zweck, Fahrzeugart und Ausgabe, damit Nutzer schnell beim passenden Angebot landen.',
    related: 'Von hier geht es gezielt zu Automobilfotografie, Auto-Fotoshooting, Fahrzeugfotografie und Autohaus-Fotografie.',
    sectionEmphasis: 'Zweck.',
    sectionHeadline: 'Auto, Bild,',
  }),
  'autohaus-fotografie': simpleKeywordCopy('Autohaus Fotografie', {
    cards: ['Bestand', 'Showroom', 'Portale', 'Prozess'],
    feature: 'Autohaus Fotografie braucht Wiederholbarkeit: gleiche Bildlogik, schnelle Abläufe und klare Motive für Web, Portale und Verkauf.',
    heroEmphasis: 'Bestand.',
    heroTitle: 'Autohaus',
    intent: 'Händler suchen nicht nur schöne Autos, sondern konsistente Bildsätze für viele Fahrzeuge.',
    output: 'Autohaus Fotografie für Showroom, Bestand, Fahrzeugportale und Verkaufsseiten.',
    planning: 'Fahrzeugliste, Standort, Stellfläche, Licht und Reihenfolge werden als Ablauf vorbereitet.',
    related: 'Die Seite trennt Händlerbedarf klar von privaten Shootings und führt zu Autoverkauf-Fotos.',
    sectionEmphasis: 'Verkauf.',
    sectionHeadline: 'Bestand mit',
  }),
  'autoverkauf-fotos': simpleKeywordCopy('Autoverkauf Fotos', {
    cards: ['Inserat', 'Zustand', 'Ausstattung', 'Vertrauen'],
    feature: 'Verkaufsbilder müssen Zustand, Ausstattung und Wertigkeit nachvollziehbar zeigen, ohne das Fahrzeug falsch zu überinszenieren.',
    heroEmphasis: 'verkaufen.',
    heroTitle: 'Autoverkauf Fotos',
    intent: 'Hier geht es konkret um bessere Verkaufsbilder, die Vertrauen schaffen und den Verkauf unterstützen.',
    output: 'Autoverkauf Fotos für Inserate, Auktionen, Portale und private Fahrzeugverkäufe.',
    planning: 'Vorab werden Bildliste, Mängel, Details, Innenraum und Ausstattungsmerkmale festgelegt.',
    related: 'Autoverkauf-Fotos werden von Autohaus-Fotografie und Auto-Fotoshooting getrennt, damit der Verkaufsintent klar bleibt.',
    sectionEmphasis: 'Vertrauen.',
    sectionHeadline: 'Bilder für',
  }),
  fahrzeugfotografie: simpleKeywordCopy('Fahrzeugfotografie', {
    cards: ['Auto', 'Motorrad', 'Nutzungsziel', 'Bereich'],
    feature: 'Fahrzeugfotografie ist der neutrale Sammelbegriff und braucht eine saubere Sortierung nach Auto, Sportwagen, Oldtimer und Motorrad.',
    heroEmphasis: 'sortiert.',
    heroTitle: 'Fahrzeugfotografie',
    intent: 'Suchende können Autos, Bikes, Händlerbestand, Verkauf oder redaktionelle Serien meinen.',
    output: 'Fahrzeugfotografie als Überblick für Auto, Sportwagen, Oldtimer, Motorrad und Verkauf.',
    planning: 'Die Seite führt früh über Fahrzeugart, Zweck und Bildausgabe zur passenden Unterseite.',
    related: 'Sie ersetzt nicht jedes Angebot, sondern führt bewusst zur passenden Fahrzeugart weiter.',
    sectionEmphasis: 'Kategorie.',
    sectionHeadline: 'Fahrzeug nach',
  }),
  'bilder-mit-auto': simpleKeywordCopy('Bilder mit Auto', {
    cards: ['Mensch und Auto', 'Geschenk', 'Social', 'Portraitnähe'],
    feature: 'Diese Seite mischt Fahrzeug- und Portraitlogik und erklärt, wann Auto, Person und Location zusammenarbeiten.',
    heroEmphasis: 'inszenieren.',
    heroTitle: 'Bilder mit Auto',
    intent: 'Suchende wollen oft nicht nur das Auto, sondern sich selbst, ein Paar oder eine Geschichte mit dem Fahrzeug zeigen.',
    output: 'Bilder mit Auto für Besitzer, Geschenkideen, Social Content und persönliche Serien.',
    planning: 'Pose, Abstand, Kleidung, Ort und Fahrzeugwirkung werden so geplant, dass das Auto nicht wie Requisite wirkt.',
    related: 'Die Seite verbindet Automobil und Portrait und führt passend zu beiden Bereichen weiter.',
    sectionEmphasis: 'Person.',
    sectionHeadline: 'Auto plus',
  }),
  'fotoshooting-mit-auto': simpleKeywordCopy('Fotoshooting mit Auto', {
    cards: ['Erlebnis', 'Auto und Mensch', 'Location', 'Serie'],
    feature: 'Das Keyword ist näher am Shooting-Erlebnis als an klassischer Produktfotografie.',
    heroEmphasis: 'erleben.',
    heroTitle: 'Fotoshooting mit Auto',
    intent: 'Hier geht es um einen Termin mit Fahrzeug, Stimmung, Person und nutzbaren Motiven.',
    output: 'Fotoshooting mit Auto für Lieblingsfahrzeuge, Geschenk, Social Media und private Erinnerungen.',
    planning: 'Fahrzeug, Personen, Stimmung und Bildformate werden gemeinsam geplant.',
    related: 'Die Seite führt weiter zu Auto-Fotoshooting, Bilder mit Auto, Portrait und Gutschein.',
    sectionEmphasis: 'Moment.',
    sectionHeadline: 'Shooting mit',
  }),
  'motorsport-fotografie': simpleKeywordCopy('Motorsport Fotografie', {
    cards: ['Trackday', 'Bewegung', 'Team', 'Eventcontent'],
    feature: 'Motorsport braucht Dynamik, Sicherheit, Standortplanung und ruhige Details neben Actionbildern.',
    heroEmphasis: 'Track.',
    heroTitle: 'Motorsport',
    intent: 'Die Seite bedient Event-, Trackday-, Club- und Team-Suchen mit bewegten Fahrzeugen.',
    output: 'Motorsport Fotografie für Trackdays, Clubs, Teams, Sponsoren und private Fahrer.',
    planning: 'Strecke, Zonen, Licht, Bewegungsrichtung, Fahrerlager und Nutzungsrechte werden vorab geklärt.',
    related: 'Motorsport bleibt eigenständig und verlinkt zu Sportwagen, Performance Cars und Automobil.',
    sectionEmphasis: 'Bewegung.',
    sectionHeadline: 'Track und',
  }),
  'motorsport-sportwagen-fotografie': simpleKeywordCopy('Motorsport- und Sportwagen-Fotografie', {
    cards: ['Performance', 'Standbild', 'Action', 'Sammler'],
    feature: 'Diese Brückenseite kombiniert ruhige Sportwagenbilder mit Motorsport- und Trackday-Dynamik.',
    heroEmphasis: 'Performance.',
    heroTitle: 'Motorsport und Sportwagen',
    intent: 'Suchende wollen Performance zeigen: im Stand, in Bewegung oder als komplette Strecke.',
    output: 'Motorsport- und Sportwagen-Fotografie für Performance Cars, Clubs, Sammler und Marken.',
    planning: 'Standort, Actionfenster, Detailmotive und Nutzungsformate werden zusammen gedacht.',
    related: 'Die Seite verbindet Motorsport mit Sportwagen, ohne beide Hauptseiten zu ersetzen.',
    sectionEmphasis: 'Standbild.',
    sectionHeadline: 'Bewegung plus',
  }),
  'sportwagen-fotografie': simpleKeywordCopy('Sportwagenfotografie', {
    cards: ['Performance Car', 'Material', 'Druck', 'Sammlung'],
    feature: 'Sportwagen werden über Form, Innenraum, Details und Druckqualitaet als hochwertige Serie gezeigt.',
    heroEmphasis: 'Fotografie.',
    heroTitle: 'Sportwagen',
    intent: 'Der Fokus liegt auf Performance, Design, Wertigkeit und Nutzbarkeit der Bildserie.',
    output: 'Sportwagenfotografie für Sammler, Händler, Marken, Verkauf und Fine-Art-Druck.',
    planning: 'Reflexe, Strecke, Standbild, Cockpit und Detailmotive werden mit klarer Dramaturgie geplant.',
    related: 'Die Hauptseite führt zu Motorsport, Performance Car, Exotic Car und Supersportwagen.',
    sectionEmphasis: 'Druckqualitaet.',
    sectionHeadline: 'Form, Material,',
  }),
  'sportwagen-shooting': simpleKeywordCopy('Sportwagen Shooting', {
    cards: ['Privat', 'Treffpunkt', 'Cinematic', 'Abgrenzung'],
    feature: 'Sportwagen Shooting ist persönlicher als reine Sportwagenfotografie und braucht Anlass, Ort und Erlebnislogik.',
    heroEmphasis: 'buchen.',
    heroTitle: 'Sportwagen Shooting',
    intent: 'Suchende wollen einen konkreten Termin für ihr Fahrzeug, häufig privat, als Geschenk oder für Social.',
    output: 'Sportwagen Shooting in Düsseldorf und NRW mit Exterieur, Interieur, Details und starken Hero-Motiven.',
    planning: 'Treffpunkt, Lichtfenster, Fahrbarkeit und Bildformate werden vorab festgelegt.',
    related: 'Die Seite grenzt sich von Motorsport und Haendler-Fotografie ab.',
    sectionEmphasis: 'Termin.',
    sectionHeadline: 'Sportwagen als',
  }),
  'sportwagen-fotoshooting': simpleKeywordCopy('Sportwagen Fotoshooting', {
    cards: ['Erlebnis', 'Bildserie', 'Details', 'Social'],
    feature: 'Das Keyword sucht nach Shooting-Erlebnis und Ergebnis zugleich: hochwertige Bilder vom eigenen Sportwagen.',
    heroEmphasis: 'erleben.',
    heroTitle: 'Sportwagen Fotoshooting',
    intent: 'Der Suchende will nicht nur Informationen, sondern einen planbaren Foto-Termin.',
    output: 'Sportwagen Fotoshooting für Besitzer, Geschenk, Social Media und hochwertige Erinnerungen.',
    planning: 'Auto, Person, Ort und Stimmung werden so kombiniert, dass die Serie nicht beliebig wirkt.',
    related: 'Die Seite verbindet Sportwagenfotografie mit Auto-Fotoshooting und Gutschein.',
    sectionEmphasis: 'Serie.',
    sectionHeadline: 'Fotoshooting mit',
  }),
  'performance-car-fotografie': simpleKeywordCopy('Performance Car Fotografie', {
    cards: ['Leistung', 'Aerodynamik', 'Tracknähe', 'Content'],
    feature: 'Performance Cars brauchen eine Bildsprache, die technische Details, Dynamik und Wertigkeit zusammenhält.',
    heroEmphasis: 'zeigen.',
    heroTitle: 'Performance Car',
    intent: 'Der Fokus liegt auf sportlichen Fahrzeugen, Umbauten, Track-nahem Look und leistungsbezogenem Content.',
    output: 'Performance Car Fotografie für Besitzer, Tuner, Clubs, Marken und Social Content.',
    planning: 'Standbild, Detail, Bewegung, Sound-Anmutung und Formatbedarf werden im Ablauf kombiniert.',
    related: 'Die Seite grenzt Performance Cars von Exotic Cars, Supersportwagen und Motorsport ab.',
    sectionEmphasis: 'Leistung.',
    sectionHeadline: 'Design trifft',
  }),
  'exotic-car-fotografie': simpleKeywordCopy('Exotic Car Fotografie', {
    cards: ['Seltenheit', 'Wertigkeit', 'Sammler', 'Diskretion'],
    feature: 'Exotic Cars brauchen ruhige, hochwertige Bilder mit Blick auf Seltenheit, Zustand und Präsentation.',
    heroEmphasis: 'selten.',
    heroTitle: 'Exotic Car',
    intent: 'Suchende meinen oft besondere, seltene oder sehr hochwertige Fahrzeuge mit Sammlerwert.',
    output: 'Exotic Car Fotografie für Sammler, Verkauf, private Archive und hochwertige Präsentation.',
    planning: 'Location, Diskretion, Transport, Licht und Detailtiefe werden sensibel geplant.',
    related: 'Die Seite bleibt bei hochwertigen Sportwagen und verweist zu Supersportwagen und Performance Car.',
    sectionEmphasis: 'Seltenheit.',
    sectionHeadline: 'Seltenes mit',
  }),
  'supersportwagen-fotografie': simpleKeywordCopy('Supersportwagen Fotografie', {
    cards: ['High-End', 'Details', 'Launch-Look', 'Sammlung'],
    feature: 'Supersportwagen brauchen maximale Kontrolle über Reflexe, Linien, Innenraum und Hero-Frames.',
    heroEmphasis: 'High-End.',
    heroTitle: 'Supersportwagen',
    intent: 'Hier geht es um besonders hochwertige Sportwagen mit engerem Bildanspruch als bei allgemeiner Sportwagenfotografie.',
    output: 'Supersportwagen Fotografie für Besitzer, Sammler, Händler, Marken und Editorials.',
    planning: 'Sicherheit, Location, Licht, Formate und Nutzungsrechte werden vorab sauber abgestimmt.',
    related: 'Die Seite führt zu Sportwagen, Exotic Car und Performance Car, ohne diese Begriffe zu vermischen.',
    sectionEmphasis: 'Kontrolle.',
    sectionHeadline: 'High-End mit',
  }),
  'oldtimer-fotografie': simpleKeywordCopy('Oldtimer-Fotografie', {
    cards: ['Patina', 'Innenraum', 'Sammlung', 'Auktion'],
    feature: 'Oldtimer brauchen ruhige Dokumentation statt Effektpose: Zustand, Herkunft und Material müssen lesbar bleiben.',
    heroEmphasis: 'Fotografie.',
    heroTitle: 'Oldtimer',
    intent: 'Die Seite konzentriert sich auf Fahrzeuge mit Geschichte, Patina, Material und Sammlerwert.',
    output: 'Oldtimer-Fotografie für Sammlung, Verkauf, Auktion, Ausstellung und private Archive.',
    planning: 'Baujahr, Zustand, Dokumente, Detailbedarf und Ausgabeformat bestimmen die Bildliste.',
    related: 'Die Hauptseite führt zu Classic Car, Youngtimer, Sammlerfahrzeug und Oldtimer-Verkaufsfotos.',
    sectionEmphasis: 'Herkunft.',
    sectionHeadline: 'Patina und',
  }),
  'oldtimer-shooting': simpleKeywordCopy('Oldtimer Shooting', {
    cards: ['Liebhaber', 'Geschichte', 'Ort', 'Serie'],
    feature: 'Das Shooting stellt den Oldtimer als persönliches Fahrzeug und nicht nur als Verkaufsobjekt in den Mittelpunkt.',
    heroEmphasis: 'planen.',
    heroTitle: 'Oldtimer Shooting',
    intent: 'Suchende wollen einen Termin für ein besonderes Fahrzeug mit emotionalem oder historischem Wert.',
    output: 'Oldtimer Shooting für Besitzer, Geschenkideen, Sammlung und hochwertige Erinnerungen.',
    planning: 'Fahrzeuggeschichte, Ort, Licht und gewünschte Bildwirkung werden vorab abgestimmt.',
    related: 'Die Seite grenzt sich von Verkaufsfotos und Auktionsdokumentation ab.',
    sectionEmphasis: 'Geschichte.',
    sectionHeadline: 'Shooting mit',
  }),
  'oldtimer-verkaufsfotos': simpleKeywordCopy('Oldtimer Verkaufsfotos', {
    cards: ['Zustand', 'Details', 'Dokumente', 'Auktion'],
    feature: 'Verkaufsfotos für Oldtimer müssen Vertrauen schaffen: Patina zeigen, Mängel nicht verstecken und Wertmerkmale sauber dokumentieren.',
    heroEmphasis: 'verkaufen.',
    heroTitle: 'Oldtimer Verkaufsfotos',
    intent: 'Hier geht es klar um Verkauf: bessere Bilder für Inserat, Auktion oder Sammlerfahrzeug.',
    output: 'Oldtimer Verkaufsfotos für Inserate, Auktionen, Sammlerfahrzeuge und Versicherungsdokumentation.',
    planning: 'Bildliste, Detailtiefe, Innenraum, Motorraum, Dokumente und Provenienz werden vorab sortiert.',
    related: 'Die Seite trennt Verkauf klar von Oldtimer Shooting und Classic Car Fotografie.',
    sectionEmphasis: 'Vertrauen.',
    sectionHeadline: 'Verkauf mit',
  }),
  'classic-car-fotografie': simpleKeywordCopy('Classic Car Fotografie', {
    cards: ['Classic Look', 'Material', 'Editorial', 'Sammlung'],
    feature: 'Classic Car Fotografie spricht eine internationale, stilistische Bildsprache an und bleibt fachlich bei Oldtimer und Sammlerfahrzeugen.',
    heroEmphasis: 'classic.',
    heroTitle: 'Classic Car',
    intent: 'Der Begriff ist stilistisch und internationaler als Oldtimer-Fotografie.',
    output: 'Classic Car Fotografie für Sammler, Editorials, Verkauf, Auktion und hochwertige Serien.',
    planning: 'Designlinie, Baujahr, Material und Bildstil werden bewusst ruhiger geführt.',
    related: 'Die Seite verlinkt zu Oldtimer, Youngtimer und Sammlerfahrzeug, statt diese Angebote zu überdecken.',
    sectionEmphasis: 'Stil.',
    sectionHeadline: 'Klassik mit',
  }),
  'youngtimer-fotografie': simpleKeywordCopy('Youngtimer Fotografie', {
    cards: ['90er und 00er', 'Zustand', 'Szene', 'Verkauf'],
    feature: 'Youngtimer brauchen weniger Museumspathos und mehr Blick auf Zustand, Originalität, Umbauten und Szene.',
    heroEmphasis: 'neu klassisch.',
    heroTitle: 'Youngtimer',
    intent: 'Suchende meinen jüngere Klassiker, Liebhaberfahrzeuge und Szeneautos.',
    output: 'Youngtimer Fotografie für Besitzer, Verkauf, Sammlung, Szene und Social Content.',
    planning: 'Baujahr, Originalzustand, Umbauten, Details und Nutzung der Bilder werden separat bewertet.',
    related: 'Die Seite trennt Youngtimer klar von Oldtimer und Classic Car.',
    sectionEmphasis: 'Szene.',
    sectionHeadline: 'Junge Klassiker',
  }),
  'sammlerfahrzeug-fotografie': simpleKeywordCopy('Sammlerfahrzeug Fotografie', {
    cards: ['Provenienz', 'Archiv', 'Edition', 'Wert'],
    feature: 'Sammlerfahrzeuge brauchen eine dokumentierende, wertige Bildsprache für Archiv, Versicherung, Verkauf oder Ausstellung.',
    heroEmphasis: 'archivieren.',
    heroTitle: 'Sammlerfahrzeug',
    intent: 'Der Fokus liegt auf Besitz, Wert, Herkunft und langfristiger Dokumentation.',
    output: 'Sammlerfahrzeug Fotografie für private Sammlungen, Archive, Versicherung, Verkauf und Kataloge.',
    planning: 'Fahrzeugdaten, Historie, Zustand, Detailmotive und Ausgabeformate werden strukturiert aufgenommen.',
    related: 'Die Seite verbindet Oldtimer, Classic Car, Youngtimer und Verkaufsfotos mit Sammlungslogik.',
    sectionEmphasis: 'Wert.',
    sectionHeadline: 'Sammlung mit',
  }),
  'motorrad-fotografie': simpleKeywordCopy('Motorradfotografie', {
    cards: ['Silhouette', 'Mechanik', 'Fahrerbezug', 'Social'],
    feature: 'Motorradfotografie verbindet Maschine, Haltung, Detail und bei Bedarf Fahrerportrait.',
    heroEmphasis: 'Fotografie.',
    heroTitle: 'Motorrad',
    intent: 'Die Hauptseite sortiert Bike-Shootings, Custom Bikes, Verkaufsbilder und Biker Portraits.',
    output: 'Motorradfotografie für private Maschinen, Custom Bikes, Händler, Werkstätten und Social Content.',
    planning: 'Bike, Standort, Fahrerbezug, Licht und Hochformatbedarf werden vorab geplant.',
    related: 'Die Hauptseite verteilt weiter zu Motorrad Shooting, Bike Fotografie, Custom Bike und Verkaufsfotos.',
    sectionEmphasis: 'Haltung.',
    sectionHeadline: 'Maschine mit',
  }),
  'motorrad-shooting': simpleKeywordCopy('Motorrad Shooting', {
    cards: ['Besitzer', 'Location', 'Bike und Fahrer', 'Erlebnis'],
    feature: 'Motorrad Shooting ist näher am Erlebnis und an persönlichen Bildern als an reiner Fahrzeugdokumentation.',
    heroEmphasis: 'buchen.',
    heroTitle: 'Motorrad Shooting',
    intent: 'Suchende wollen einen Termin für Bike, Besitzer, Treffpunkt und Bildserie.',
    output: 'Motorrad Shooting für Besitzer, Geschenk, Social Media, Werkstatt und private Erinnerung.',
    planning: 'Maschine, Kleidung, Helm, Ort, Tageszeit und Bildtypen werden abgestimmt.',
    related: 'Die Seite trennt private Shooting-Anfragen von Verkaufsfotos und Custom-Bike-Dokumentation.',
    sectionEmphasis: 'Besitzer.',
    sectionHeadline: 'Bike plus',
  }),
  'motorrad-verkaufsfotos': simpleKeywordCopy('Motorrad Verkaufsfotos', {
    cards: ['Inserat', 'Zustand', 'Umbauten', 'Details'],
    feature: 'Verkaufsfotos für Motorräder müssen Zustand, Umbauten, Pflege und Details klar zeigen.',
    heroEmphasis: 'verkaufen.',
    heroTitle: 'Motorrad Verkaufsfotos',
    intent: 'Die Suche ist verkaufsnah und braucht vertrauensbildende Motive statt Lifestyle.',
    output: 'Motorrad Verkaufsfotos für Inserate, Portale, Händler und private Verkäufe.',
    planning: 'Tank, Motor, Reifen, Cockpit, Umbauten, Gebrauchsspuren und Gesamtansichten werden vorab als Bildliste gedacht.',
    related: 'Die Seite grenzt sich von Motorrad Shooting und Biker Portrait ab.',
    sectionEmphasis: 'Zustand.',
    sectionHeadline: 'Verkauf mit',
  }),
  'bike-fotografie': simpleKeywordCopy('Bike Fotografie', {
    cards: ['Breiter Begriff', 'Motorrad', 'Szene', 'Weiterführung'],
    feature: 'Bike Fotografie ist breiter und umgangssprachlicher als Motorradfotografie und braucht klare Sortierung.',
    heroEmphasis: 'sortiert.',
    heroTitle: 'Bike Fotografie',
    intent: 'Suchende können Motorrad, Custom Bike, Fahrerbild oder Social Content meinen.',
    output: 'Bike Fotografie als Einstieg für Motorrad, Custom Bike, Biker Portrait und Verkaufsbilder.',
    planning: 'Der Text fragt früh nach Bike-Art, Person, Nutzung und Ort.',
    related: 'Die Seite führt in die passenden Motorrad-Unterseiten, statt alles in einem Angebot zu vermischen.',
    sectionEmphasis: 'Nutzung.',
    sectionHeadline: 'Bike nach',
  }),
  'custom-bike-fotografie': simpleKeywordCopy('Custom Bike Fotografie', {
    cards: ['Umbau', 'Handwerk', 'Werkstatt', 'Detail'],
    feature: 'Custom Bikes brauchen Detailnähe: Material, Teile, Umbauideen und handwerkliche Entscheidungen.',
    heroEmphasis: 'Umbau.',
    heroTitle: 'Custom Bike',
    intent: 'Die Seite richtet sich an Besitzer, Werkstätten und Builder mit individuellen Maschinen.',
    output: 'Custom Bike Fotografie für Umbauten, Werkstätten, Builder, Magazine und Social Content.',
    planning: 'Umbaugeschichte, Teile, Materialien, Werkstattumfeld und Detailmotive werden bewusst eingeplant.',
    related: 'Die Seite trennt individuelle Umbauten von allgemeinen Motorrad-Shootings und Verkaufsfotos.',
    sectionEmphasis: 'Handwerk.',
    sectionHeadline: 'Umbau und',
  }),
  'biker-portrait': simpleKeywordCopy('Biker Portrait', {
    cards: ['Fahrer', 'Haltung', 'Bike', 'Portrait'],
    feature: 'Biker Portrait verbindet Portraitregie mit Motorrad-Haltung und vermeidet reine Pose.',
    heroEmphasis: 'Portrait.',
    heroTitle: 'Biker',
    intent: 'Suchende wollen Mensch und Maschine zusammen zeigen, nicht nur das Fahrzeug.',
    output: 'Biker Portrait für Fahrer, Clubs, Social Media, Personal Branding und private Serien.',
    planning: 'Person, Bike, Kleidung, Helm, Location und gewünschte Wirkung werden gemeinsam abgestimmt.',
    related: 'Die Seite liegt zwischen Portrait und Motorrad und verbindet beide Bildwelten.',
    sectionEmphasis: 'Mensch.',
    sectionHeadline: 'Bike plus',
  }),
  portraitfotografie: simpleKeywordCopy('Portraitfotografie', {
    cards: ['Person', 'Licht', 'Wirkung', 'Nutzung'],
    feature: 'Portraitfotografie braucht Regie, Licht und eine klare Verwendung statt Passbild- oder Massenstudio-Logik.',
    heroEmphasis: 'Fotografie.',
    heroTitle: 'Portrait',
    intent: 'Die Hauptseite sammelt private, berufliche, redaktionelle und persönliche Portrait-Suchen.',
    output: 'Portraitfotografie für Personal Branding, Business, Editorial, Dating, Paar und private Serien.',
    planning: 'Person, Wirkung, Ort, Kleidung, Licht und Ausgabe werden vorab besprochen.',
    related: 'Die Hauptseite verteilt sauber zu Dating, Gutschein, Preisen, Beleuchtung und Schwarz-Weiss.',
    sectionEmphasis: 'Wirkung.',
    sectionHeadline: 'Blick und',
  }),
  'portrait-fotoshooting': simpleKeywordCopy('Portrait Fotoshooting', {
    cards: ['Privat', 'Profil', 'Paar', 'Brand'],
    feature: 'Portrait Fotoshooting ist der breite Buchungsintent und muss Anlass, Person und Wirkung klar führen.',
    heroEmphasis: 'buchen.',
    heroTitle: 'Portrait Fotoshooting',
    intent: 'Suchende wollen gute Bilder von sich oder anderen, ohne Passbild- oder Standardstudio-Charakter.',
    output: 'Portrait Fotoshooting für Profile, Dating, Paar, Familie, Personal Branding und private Bilder.',
    planning: 'Vorbereitung, Ort, Licht, Kleidung und Bildauswahl werden so einfach wie möglich gehalten.',
    related: 'Die Seite führt zu Dating, Gutschein, Preise, Paar/Familie und Personal Branding.',
    sectionEmphasis: 'Richtung.',
    sectionHeadline: 'Portrait mit',
  }),
  'business-portrait': simpleKeywordCopy('Business Portrait', {
    cards: ['Profil', 'Website', 'Team', 'Vertrauen'],
    feature: 'Business Portraits müssen professionell wirken, ohne die Person glattzubügeln.',
    heroEmphasis: 'professionell.',
    heroTitle: 'Business Portrait',
    intent: 'Suchende brauchen Bilder für Website, LinkedIn, Presse, Bewerbung oder Teamseite.',
    output: 'Business Portraits für Selbstständige, Führungskräfte, Teams, Praxen, Kanzleien und Agenturen.',
    planning: 'Branche, Wirkung, Hintergrund, Kleidung, Licht und Wiederverwendbarkeit werden vorab geklärt.',
    related: 'Die Seite grenzt Business Portrait von Headshot, Personal Branding und Unternehmensportrait ab.',
    sectionEmphasis: 'Vertrauen.',
    sectionHeadline: 'Professionell mit',
  }),
  'headshot-fotograf': simpleKeywordCopy('Headshot Fotograf', {
    cards: ['Kopfportrait', 'Profil', 'Presse', 'Klarheit'],
    feature: 'Headshots brauchen Reduktion: Blick, Licht, Hauttöne und Haltung müssen sofort funktionieren.',
    heroEmphasis: 'klar.',
    heroTitle: 'Headshot Fotograf',
    intent: 'Die Anfrage ist enger als klassische Portraitfotografie und meist profil- oder pressebezogen.',
    output: 'Headshot Fotograf für LinkedIn, Website, Presse, Bewerbung, Speaker und Teams.',
    planning: 'Ausschnitt, Hintergrund, Licht, Ausdruck und Dateiformate werden effizient vorbereitet.',
    related: 'Die Seite verweist zu Business Portrait, Personal Branding und Pressefoto.',
    sectionEmphasis: 'Profil.',
    sectionHeadline: 'Kopfportrait mit',
  }),
  'personal-branding-fotografie': simpleKeywordCopy('Personal Branding Fotografie', {
    cards: ['Person', 'Arbeit', 'Content', 'Positionierung'],
    feature: 'Personal Branding Fotografie zeigt Person, Arbeitsweise, Umfeld und wiederkehrende Kommunikationsmotive.',
    heroEmphasis: 'sichtbar.',
    heroTitle: 'Personal Branding',
    intent: 'Suchende brauchen mehr als ein Profilbild: eine Bildwelt für Website, Social und Angebot.',
    output: 'Personal Branding Fotografie für Selbstständige, Founder, Speaker, Coaches und Experten.',
    planning: 'Positionierung, Themen, Orte, Kleidung, Requisiten und Formate werden als Content-Plan gedacht.',
    related: 'Die Seite grenzt sich von Business Portrait und Headshot ab, verlinkt aber bewusst dorthin.',
    sectionEmphasis: 'Auftritt.',
    sectionHeadline: 'Person als',
  }),
  'dating-fotoshooting': simpleKeywordCopy('Dating Fotoshooting', {
    cards: ['Natürlich', 'Profil', 'Alltag', 'Auswahl'],
    feature: 'Datingbilder müssen sympathisch wirken und dürfen nicht wie eine fremde Kampagne aussehen.',
    heroEmphasis: 'echt.',
    heroTitle: 'Dating Fotoshooting',
    intent: 'Suchende wollen bessere Bilder für Dating-Apps, Social Media oder private Profile.',
    output: 'Dating Fotoshooting für natürliche Profilbilder ohne steife Studio-Posen.',
    planning: 'Location, Kleidung, Ausdruck, Ganzkörperbild und Auswahl für das Profil werden zusammen geplant.',
    related: 'Die Seite bleibt bei Portraits und führt zu Preisen und Portrait Fotoshooting.',
    sectionEmphasis: 'Profil.',
    sectionHeadline: 'Sympathisch im',
  }),
  'fotoshooting-gutschein': simpleKeywordCopy('Fotoshooting Gutschein', {
    cards: ['Geschenk', 'Flexibel', 'Einlösen', 'Shootingart'],
    feature: 'Ein Gutschein muss offen genug sein, damit Portrait, Paar, Familie oder Auto später passend gewählt werden können.',
    heroEmphasis: 'schenken.',
    heroTitle: 'Fotoshooting Gutschein',
    intent: 'Suchende wollen ein Geschenk, aber oft noch keine finale Shootingart festlegen.',
    output: 'Fotoshooting Gutschein für Portrait, Paar, Familie, Auto-Fotoshooting und besondere Anlässe.',
    planning: 'Wert, Anlass, Einlösung, Stil und mögliche Shootingarten werden einfach geklärt.',
    related: 'Die Seite verbindet Portrait, Paar/Familie, Auto-Fotoshooting und Preise.',
    sectionEmphasis: 'Spielraum.',
    sectionHeadline: 'Geschenk mit',
  }),
  'fotoshooting-preise': simpleKeywordCopy('Fotoshooting Preise', {
    cards: ['Umfang', 'Nutzung', 'Ort', 'Angebot'],
    feature: 'Preis-Suchen brauchen Transparenz über Aufwand, Nutzung und Ausgabe statt starre Billigpakete.',
    heroEmphasis: 'transparent.',
    heroTitle: 'Fotoshooting Preise',
    intent: 'Suchende wollen Orientierung, was ein Shooting kostet und warum Preise variieren.',
    output: 'Fotoshooting Preise für Portrait, Auto, Sportwagen, Paar, Familie und individuelle Bildserien.',
    planning: 'Shootingart, Dauer, Location, Bildanzahl, Retusche und Nutzungsrechte werden getrennt betrachtet.',
    related: 'Die Seite führt zu den passenden Leistungsseiten und ersetzt keine konkrete Anfrage.',
    sectionEmphasis: 'Kontext.',
    sectionHeadline: 'Preis mit',
  }),
  'portraitfotografie-beleuchtung': simpleKeywordCopy('Portraitfotografie Beleuchtung', {
    cards: ['Fensterlicht', 'Mobiles Licht', 'Kontrast', 'Look'],
    feature: 'Die Ratgeberseite erklärt Licht als Bildsprache und nicht als Technikliste.',
    heroEmphasis: 'Licht.',
    heroTitle: 'Portrait Beleuchtung',
    intent: 'Suchende interessieren sich für Lichtwirkung, Setup und professionelle Portraitanmutung.',
    output: 'Portraitfotografie Beleuchtung für natürliche, kontrollierte und editorial wirkende Portraits.',
    planning: 'Wirkung, Ort, vorhandenes Licht, mobiles Setup und finaler Look werden vor dem Shooting geklärt.',
    related: 'Die Seite verbindet Portrait Fotoshooting, Schwarz-Weiss und Personal Branding.',
    sectionEmphasis: 'Kontur.',
    sectionHeadline: 'Licht mit',
  }),
  'paarshooting-familienshooting': simpleKeywordCopy('Paarshooting und Familienshooting', {
    cards: ['Paar', 'Kleine Familie', 'Zuhause', 'Outdoor'],
    feature: 'Paar- und Familienshootings leben von Nähe, Bewegung und kleinen Momenten statt starrer Aufstellung.',
    heroEmphasis: 'natürlich.',
    heroTitle: 'Paar und Familie',
    intent: 'Suchende wollen persönliche Bilder von zwei Menschen oder kleinen Familien.',
    output: 'Paarshooting und Familienshooting für ruhige, natürliche Serien ohne Gruppenfoto-Fokus.',
    planning: 'Konstellation, Ort, Stimmung, Kinder, Licht und Tempo werden entspannt vorbereitet.',
    related: 'Die Seite bleibt bewusst bei Portraits und grenzt grosse Gruppen aus.',
    sectionEmphasis: 'Nähe.',
    sectionHeadline: 'Menschen mit',
  }),
  'schwarz-weiss-portrait-fotografie': simpleKeywordCopy('Schwarz-Weiss Portrait Fotografie', {
    cards: ['Kontrast', 'Tonwerte', 'Editorial', 'Print'],
    feature: 'Schwarz-Weiss ist kein Filter, sondern eine Entscheidung für Licht, Blick, Form und Haltung.',
    heroEmphasis: 'reduziert.',
    heroTitle: 'Schwarz-Weiss Portrait',
    intent: 'Suchende wollen zeitlose, markante oder künstlerisch reduzierte Portraits.',
    output: 'Schwarz-Weiss Portrait Fotografie für Profil, Editorial, Personal Branding, Print und private Serien.',
    planning: 'Licht, Kontrast, Kleidung, Hintergrund und Tonwerte werden bereits beim Shooting mitgedacht.',
    related: 'Die Seite verlinkt zu Beleuchtung, Portrait Fotoshooting und Personal Branding.',
    sectionEmphasis: 'Tonwert.',
    sectionHeadline: 'Kontrast und',
  }),
  'vintage-fotoshooting': simpleKeywordCopy('Vintage Fotoshooting', {
    cards: ['Stil', 'Location', 'Licht', 'Bearbeitung'],
    feature: 'Ein Vintage-Look entsteht aus Styling, Ort, warmem Licht und einer Bearbeitung, die an Film erinnert – nicht aus einem Filter.',
    heroEmphasis: 'mit Retro-Charme.',
    heroTitle: 'Vintage Fotoshooting',
    intent: 'Suchende wollen Portraits mit Vintage- oder Retro-Look in NRW oder Düsseldorf.',
    output: 'Vintage-Portraits für persönliche Serien, Musikerinnen und Musiker, Paare und Print.',
    planning: 'Epoche, Outfit, Location, Lichtstimmung und Stärke des Retro-Looks werden vor dem Shooting festgelegt.',
    related: 'Die Seite verlinkt zu Portraitfotografie Düsseldorf, Schwarz-Weiss Portrait und Musiker-Portraits.',
    sectionEmphasis: 'Film-Anmutung.',
    sectionHeadline: 'Portraits mit',
  }),
  'fotoshooting-maenner': simpleKeywordCopy('Fotoshooting für Männer', {
    cards: ['Haltung', 'Outfit', 'Licht', 'Nutzung'],
    feature: 'Männerportraits entstehen ohne Pose-Drill: klare Hinweise zu Haltung und Händen, passendes Licht und ein Ort, der zum Zweck passt.',
    heroEmphasis: 'ohne Pose-Drill.',
    heroTitle: 'Fotoshooting für Männer',
    intent: 'Suchende wollen Männerportraits für Business, Dating oder Social Media in NRW.',
    output: 'Männerportraits für LinkedIn, Website, Dating-Profil, Personal Branding und Social Media.',
    planning: 'Zweck, Outfits, Ort und Lichtstimmung werden vor dem Shooting abgestimmt.',
    related: 'Die Seite verlinkt zu Business Portrait, Dating Fotoshooting und Personal Branding.',
    sectionEmphasis: 'Haltung.',
    sectionHeadline: 'Portraits mit',
  }),
  musikerfotografie: simpleKeywordCopy('Musikerfotografie', {
    cards: ['Nutzung', 'Instrument', 'Band', 'Look'],
    feature: 'Musikerfotos übersetzen eine Klangwelt ins Bild – mit Instrument, Licht und einem Look, der zur Musik passt.',
    heroEmphasis: 'mit Klangbild.',
    heroTitle: 'Musikerfotografie',
    intent: 'Suchende wollen Pressebilder, Cover und Portraits für Musikerinnen, Musiker und Bands in NRW.',
    output: 'Musikerportraits, Bandfotos, Pressebilder und Cover-Motive mit klaren Nutzungsrechten.',
    planning: 'Nutzung, Instrument, Aufstellung, Styling und Look werden vor dem Shooting festgelegt.',
    related: 'Die Seite verlinkt zu Musiker-Portraits im Journal, Vintage Fotoshooting und Schwarz-Weiss Portrait.',
    sectionEmphasis: 'sichtbar.',
    sectionHeadline: 'Musik',
  }),
  unternehmensportrait: simpleKeywordCopy('Unternehmensportrait', {
    cards: ['Team', 'Führung', 'Räume', 'Vertrauen'],
    feature: 'Unternehmensportraits zeigen Menschen, Arbeit, Räume und Haltung in einer konsistenten Bildsprache.',
    heroEmphasis: 'zeigen.',
    heroTitle: 'Unternehmensportrait',
    intent: 'Suchende brauchen Bilder für Website, PR, Recruiting, Teamseiten oder Unternehmenskommunikation.',
    output: 'Unternehmensportrait für Teams, Führungskräfte, Praxen, Kanzleien, Agenturen und Mittelstand.',
    planning: 'Personen, Ablauf, Location, Bildliste, Nutzungsrechte und interne Abstimmung werden vorab sortiert.',
    related: 'Die Seite trennt Unternehmensportrait von Business Portrait und Personal Branding.',
    sectionEmphasis: 'Organisation.',
    sectionHeadline: 'Menschen im',
  }),
  pressefoto: simpleKeywordCopy('Pressefoto', {
    cards: ['PR', 'Speaker', 'Redaktion', 'Dateiformate'],
    feature: 'Pressefotos brauchen klare Aussage, schnelle Nutzbarkeit und saubere Formate für Redaktionen.',
    heroEmphasis: 'bereit.',
    heroTitle: 'Pressefoto',
    intent: 'Suchende brauchen Bilder für Medien, Vorträge, Interviews, Pressekit oder Website.',
    output: 'Pressefoto für Unternehmer, Künstler, Speaker, PR, Redaktion und Personal Branding.',
    planning: 'Aussage, Hintergrund, Quer-/Hochformat, Freistellung, Dateinamen und Nutzungsrechte werden mitgedacht.',
    related: 'Die Seite führt zu Headshot, Business Portrait und Personal Branding.',
    sectionEmphasis: 'Redaktion.',
    sectionHeadline: 'Bild für',
  }),
  landschaftsfotografie: simpleKeywordCopy('Landschaftsfotografie', {
    cards: ['Motiv', 'Raum', 'Material', 'Edition'],
    feature: 'Landschaftsfotografie wird hier als kuratierte Bild- und Printwelt für Räume verstanden.',
    heroEmphasis: 'Fotografie.',
    heroTitle: 'Landschaft',
    intent: 'Suchende interessieren sich für Motive, Ruhe, Raumwirkung, Druck und Editionen.',
    output: 'Landschaftsfotografie als Fine-Art-Print, Wandbild, Edition und grossformatige Arbeit.',
    planning: 'Motiv, Format, Material, Raumlicht und Lieferung werden als Printprojekt geplant.',
    related: 'Die Hauptseite führt zu Landschaftsbilder kaufen, Fine-Art-Prints, Wandbildern und Naturfotografie-Prints.',
    sectionEmphasis: 'Raum.',
    sectionHeadline: 'Motiv und',
  }),
  'landschaftsfotografie-print': simpleKeywordCopy('Landschaftsfotografie Print', {
    cards: ['Motivwahl', 'Material', 'Format', 'Lieferung'],
    feature: 'Print-Anfragen brauchen mehr Material-, Format- und Raumberatung als die allgemeine Landschaftsseite.',
    heroEmphasis: 'Print.',
    heroTitle: 'Landschaftsfotografie',
    intent: 'Suchende wollen Landschaftsbilder als fertigen Druck für Wand, Praxis, Hotel oder Sammlung.',
    output: 'Landschaftsfotografie Print für Fine-Art-Papier, Aluminium, Acrylglas, Edition und Sonderformat.',
    planning: 'Motiv, Größe, Material, Raumwirkung, Helligkeit und Montage werden gemeinsam geplant.',
    related: 'Die Seite trennt Printberatung von Portfolio- und Landschafts-Hauptseite.',
    sectionEmphasis: 'Material.',
    sectionHeadline: 'Print mit',
  }),
  landschaftsbilder: simpleKeywordCopy('Landschaftsbilder kaufen', {
    cards: ['Auswahl', 'Wohnraum', 'Praxis', 'Geschenk'],
    feature: 'Kauf-Suchende brauchen Orientierung zu Motiv, Format, Material und Wirkung im Raum.',
    heroEmphasis: 'kaufen.',
    heroTitle: 'Landschaftsbilder',
    intent: 'Hier soll ein Bild ausgewählt und als fertiges Objekt bestellt werden.',
    output: 'Landschaftsbilder kaufen als Fine-Art-Print, Wandbild, Edition oder grossformatige Arbeit.',
    planning: 'Raum, Wandgröße, Farbigkeit, Material und Lieferziel bestimmen die Empfehlung.',
    related: 'Die Seite führt weiter zu Fine-Art-Prints, Wandbildern und Druck/Sonderanfertigung.',
    sectionEmphasis: 'Auswahl.',
    sectionHeadline: 'Bild für',
  }),
  'fine-art-prints': simpleKeywordCopy('Fine-Art-Prints Landschaft', {
    cards: ['Papier', 'Tonwert', 'Edition', 'Sammlung'],
    feature: 'Fine-Art-Prints brauchen mehr Fokus auf Papier, Farbstabilität, Tonwert und Haptik.',
    heroEmphasis: 'Fine-Art.',
    heroTitle: 'Fine-Art-Prints',
    intent: 'Suchende wollen hochwertige Drucke, nicht nur digitale Landschaftsbilder.',
    output: 'Fine-Art-Prints Landschaft für Wohnraum, Praxis, Sammlung, Edition und Geschenk.',
    planning: 'Motiv, Papier, Format, Rand, Signatur, Rahmung und Lieferung werden abgestimmt.',
    related: 'Die Seite grenzt Fine-Art-Papier von Wandbildern, Acrylglas und Aluminium ab.',
    sectionEmphasis: 'Papier.',
    sectionHeadline: 'Print auf',
  }),
  'wandbilder-landschaftsfotografie': simpleKeywordCopy('Wandbilder Landschaftsfotografie', {
    cards: ['Wandgröße', 'Material', 'Raumwirkung', 'Montage'],
    feature: 'Wandbilder brauchen Planung aus Sicht des Raums: Größe, Abstand, Licht und Material entscheiden.',
    heroEmphasis: 'Wandbild.',
    heroTitle: 'Wandbilder',
    intent: 'Suchende wollen Landschaftsfotografie als sichtbares Objekt für Wand, Praxis, Hotel oder Büro.',
    output: 'Wandbilder Landschaftsfotografie auf Fine-Art-Papier, Aluminium, Acrylglas oder als Sonderformat.',
    planning: 'Raumfoto, Wandmass, Licht, Farbigkeit, Format und Montageart werden berücksichtigt.',
    related: 'Die Seite verlinkt zu Landschaftsbilder kaufen, Fine-Art-Prints und Druck/Sonderanfertigung.',
    sectionEmphasis: 'Raum.',
    sectionHeadline: 'Wandbild mit',
  }),
  'naturfotografie-prints': simpleKeywordCopy('Naturfotografie Prints', {
    cards: ['Naturmotiv', 'Ruhe', 'Material', 'Edition'],
    feature: 'Naturfotografie-Prints setzen stärker auf Ruhe, Motivwirkung und Material als auf lokale Shooting-Anfragen.',
    heroEmphasis: 'Prints.',
    heroTitle: 'Naturfotografie',
    intent: 'Suchende wollen Naturmotive als hochwertige Drucke für private oder gewerbliche Räume.',
    output: 'Naturfotografie Prints für Wohnraum, Praxis, Hotel, Büro, Sammlung und Geschenk.',
    planning: 'Motivstimmung, Format, Material, Raumlicht und Lieferziel werden passend ausgewählt.',
    related: 'Die Seite bleibt bei Landschaft und Print und verweist zu Wandbildern und Fine-Art-Prints.',
    sectionEmphasis: 'Ruhe.',
    sectionHeadline: 'Natur als',
  }),
}

const keywordFocusCopies: Record<string, KeywordFocusCopy> = {
  'auto-fotografieren-tipps': {
    heroLead:
      'Auto fotografieren Tipps: Perspektive, Licht, Reflexe, Location und Details entscheiden, ob ein Fahrzeug wertig wirkt. Von den Grundlagen geht es direkt zu einem professionell geplanten Auto-Shooting, wenn aus Einzelbildern ein nutzbarer Bildsatz werden soll.',
    metaDescription:
      'Auto fotografieren Tipps zu Licht, Perspektive, Reflexen und Details. Professionelle Automobilfotografie für private Fahrzeuge, Verkauf und Marke.',
    contactLead:
      'Wenn aus den Tipps ein professioneller Bildsatz werden soll, schreibe kurz, welches Fahrzeug fotografiert werden soll, wo es steht und ob die Bilder für Verkauf, privat, Marke oder Social gedacht sind.',
    pullKicker: 'Praxisleitfaden',
    pullHeadline: 'Tipps, die zum',
    pullEmphasis: 'Bildsatz führen.',
    pullLead:
      'Diese Seite beantwortet zuerst praktische Fragen: Licht, Standort, Brennweite und Reflexe. Danach wird klar, wann ein professionelles Auto-Shooting den Unterschied zwischen Einzelbild und verwendbarer Serie macht.',
    sectionHeadline: 'Licht, Linien,',
    sectionEmphasis: 'Reflexe.',
    sectionLead:
      'Gute Autofotos beginnen vor der Kamera: saubere Flächen, ruhiger Hintergrund, ein planbares Lichtfenster und ein Ablauf, der Exterieur, Interieur und Details getrennt denkt.',
    featureTitle: 'Erst sehen, dann auslösen.',
    featureBody:
      'Viele Fehler entstehen, weil das Fahrzeug wie ein normales Motiv behandelt wird. Entscheidend sind Karosseriekanten, Spiegelungen im Lack, Radstellung, Höhe der Kamera und ein klarer Zweck für jedes Bild.',
    galleryHeadline: 'Tipps als Bildbeispiele.',
    galleryLead:
      'Die Motive zeigen typische Entscheidungen aus einem Auto-Shooting: ruhige Linien, Materialdetails, Innenraum und Lichtstimmung.',
    audienceHeadline: 'Für wen diese Tipps nützlich sind.',
    audienceLead:
      'Die Tipps helfen beim Einstieg. Wenn die Bilder verkaufen, überzeugen oder als hochwertige Erinnerung bleiben sollen, wird aus dem Wissen ein sauber geplanter Bildsatz.',
    cards: [
      { label: 'Privat', title: 'Besitzer', text: 'Lieblingsfahrzeug besser zeigen, ohne dass die Bilder zufällig oder nach Handy-Snapshot wirken.' },
      { label: 'Verkauf', title: 'Inserate', text: 'Perspektiven und Details so planen, dass Zustand, Wertigkeit und Ausstattung klar lesbar werden.' },
      { label: 'Content', title: 'Social Media', text: 'Mehrere Motive aus einer Location holen: Front, Heck, Seite, Cockpit und kleine Details.' },
      { label: 'Marke', title: 'Professionelle Serie', text: 'Wenn ein Fahrzeug wiederholt eingesetzt wird, braucht die Bildsprache System statt Zufall.' },
    ],
    relatedLead:
      'Auto fotografieren Tipps sind der Einstieg in bessere Fahrzeugbilder. Von hier führen die passenden Links zu konkreten Shootings, Verkaufsbildern und spezialisierten Fahrzeugbereichen.',
  },
  'auto-fotoshooting': {
    heroLead:
      'Auto-Fotoshooting für private Fahrzeuge, Sportwagen, Oldtimer, Autohäuser und Marken. Exterieur, Interieur, Details und Cinematic werden als nutzbare Serie geplant - mit derselben Bildsprache wie die Automobil-Hauptseite.',
    metaDescription:
      'Auto-Fotoshooting für private Fahrzeuge, Sportwagen, Oldtimer, Verkauf und Marke. Automobilfotografie in Düsseldorf, NRW und DACH.',
    contactLead:
      'Schreibe kurz, welches Auto im Mittelpunkt steht, ob es um private Erinnerung, Verkauf, Marke oder Social geht und welcher Ort oder Zeitraum möglich ist.',
    pullKicker: 'Shootingplanung',
    pullHeadline: 'Ein Auto-Fotoshooting mit',
    pullEmphasis: 'klarem Zweck.',
    pullLead:
      'Beim Auto-Fotoshooting geht es nicht um eine schöne Einzelaufnahme, sondern um eine Serie, die nachher wirklich nutzbar ist: Hero-Motiv, Details, Innenraum, Social-Crops und bei Bedarf Verkaufsbilder.',
    sectionHeadline: 'Von der Karosserie bis zur',
    sectionEmphasis: 'Atmosphäre.',
    sectionLead:
      'Das Fahrzeug wird in mehreren Ebenen fotografiert: Totale für Proportion, Detail für Wertigkeit, Interieur für Material und Stimmungsbilder für Charakter.',
    featureTitle: 'Geplant statt gesucht.',
    featureBody:
      'Vor dem Termin werden Zustand, Location, Lichtfenster und Nutzung geklärt. So entsteht ein ruhiger Ablauf, bei dem Lack, Linien und Ausstattung nicht dem Zufall überlassen werden.',
    galleryHeadline: 'Bildserie statt Einzelmotiv.',
    galleryLead:
      'Die Galerie steht für den Mix, den ein Auto-Fotoshooting braucht: starke Hauptmotive, kleine Detailbilder und nutzbare Formate für Website, Social und Druck.',
    audienceHeadline: 'Auto-Fotoshooting für konkrete Anlässe.',
    audienceLead:
      'Die Seite richtet sich an Menschen und Marken, die ein Fahrzeug nicht nur dokumentieren, sondern bewusster zeigen möchten.',
    cards: [
      { label: 'Privat', title: 'Lieblingsfahrzeug', text: 'Ein sauberer Bildsatz für Erinnerung, Geschenk oder Portfolio des eigenen Autos.' },
      { label: 'Verkauf', title: 'Inserat & Auktion', text: 'Bilder, die Ausstattung, Pflegezustand und Charakter nachvollziehbar zeigen.' },
      { label: 'Marke', title: 'Content-Serie', text: 'Motive für Website, Kampagne, Social Media und wiederkehrende Kommunikation.' },
      { label: 'Sammlung', title: 'Archiv', text: 'Ruhige Serien für Sammlerfahrzeuge, Umbauten oder besondere Fahrzeuggeschichten.' },
    ],
    relatedLead:
      'Auto-Fotoshooting bleibt der breite Einstieg. Wer spezieller sucht, findet eigene Seiten für Bilder mit Auto, Fotoshooting mit Auto, Sportwagen, Oldtimer und Motorrad.',
  },
  'bilder-mit-auto': {
    heroLead:
      'Bilder mit Auto für Besitzer, Sammler, Content, Geschenkideen und hochwertige Verkaufsauftritte. Fahrzeug, Mensch, Location und Licht werden so verbunden, dass das Auto nicht nur dokumentiert, sondern inszeniert wird.',
    metaDescription:
      'Bilder mit Auto als professionelles Shooting für Besitzer, Verkauf, Social Media und Markenauftritt. Automobilfotografie in NRW.',
    contactLead:
      'Schreibe kurz, ob das Auto allein, mit Person oder als komplette Serie fotografiert werden soll und wofür die Bilder später genutzt werden.',
    pullKicker: 'Auto und Mensch',
    pullHeadline: 'Bilder mit Auto,',
    pullEmphasis: 'nicht nur vom Auto.',
    pullLead:
      'Diese Anfrage ist breiter als klassische Automobilfotografie. Hier geht es oft um Besitzer, Paar, Geschenk, Social Content oder eine Geschichte, in der das Fahrzeug Teil der Identität ist.',
    sectionHeadline: 'Fahrzeug, Person,',
    sectionEmphasis: 'Szene.',
    sectionLead:
      'Die Serie kann das Auto allein zeigen oder Mensch und Fahrzeug zusammenbringen. Wichtig ist, dass Pose, Abstand und Location natürlich bleiben und das Auto nicht wie eine Requisite wirkt.',
    featureTitle: 'Nahe am Besitzer.',
    featureBody:
      'Bei Bildern mit Auto wird die Inszenierung persönlicher: Sitzposition, Blickrichtung, Kleidung und Umgebung entscheiden, ob das Motiv authentisch oder gestellt wirkt.',
    galleryHeadline: 'Zwischen Portrait und Fahrzeug.',
    galleryLead:
      'Die Bildauswahl kann ruhige Fahrzeugmotive, Detailaufnahmen und Motive mit Person mischen, damit die Seite sowohl Auto- als auch Shooting-Suchende abholt.',
    audienceHeadline: 'Bilder mit Auto für persönliche Motive.',
    audienceLead:
      'Geeignet für alle, die das Fahrzeug als Teil einer Geschichte zeigen möchten - vom neuen Sportwagen bis zum Oldtimer mit emotionalem Wert.',
    cards: [
      { label: 'Besitzer', title: 'Du mit deinem Auto', text: 'Natürliche Motive, die Verbindung und Charakter zeigen, ohne übertrieben zu posen.' },
      { label: 'Geschenk', title: 'Überraschung', text: 'Ein Shooting als Erlebnis für Menschen, die ihr Fahrzeug wirklich feiern.' },
      { label: 'Social', title: 'Content', text: 'Eine abwechslungsreiche Serie für Profilbilder, Posts, Reels-Cover und Story-Motive.' },
      { label: 'Paar', title: 'Gemeinsame Bilder', text: 'Wenn Auto, Menschen und Location zusammen eine kleine Strecke ergeben sollen.' },
    ],
    relatedLead:
      'Bilder mit Auto verbindet Portrait- und Automobilfotografie. Deshalb führt die Seite zu Auto-Fotoshooting, Portrait und spezialisierten Fahrzeugbereichen.',
  },
  'fotoshooting-mit-auto': {
    heroLead:
      'Fotoshooting mit Auto: ideal für Lieblingsfahrzeuge, Sportwagen, Oldtimer, Geschenkideen und Content-Serien. Die Seite verbindet Fahrzeug, Mensch und Anlass zu einer planbaren Shootingstrecke.',
    metaDescription:
      'Fotoshooting mit Auto für private Fahrzeuge, Sportwagen, Oldtimer und Content. Professionelle Automobilfotografie in Düsseldorf und NRW.',
    contactLead:
      'Schreibe kurz, welches Fahrzeug dabei ist, ob Menschen mit aufs Bild sollen und welche Stimmung die Serie bekommen soll.',
    pullKicker: 'Shootingidee',
    pullHeadline: 'Fotoshooting mit Auto als',
    pullEmphasis: 'Erlebnis.',
    pullLead:
      'Viele suchen nicht nach reiner Fahrzeugfotografie, sondern nach einem Shooting mit Auto: persönlich, planbar und mit Bildern, die sowohl das Fahrzeug als auch den Anlass tragen.',
    sectionHeadline: 'Mehr als ein',
    sectionEmphasis: 'Parkplatzfoto.',
    sectionLead:
      'Der Ablauf wird auf die gewünschte Stimmung angepasst: urban, ruhig, sportlich, nostalgisch oder clean. Daraus entstehen Motive für Menschen, Fahrzeug und Details.',
    featureTitle: 'Das Auto gibt den Rahmen.',
    featureBody:
      'Ein gutes Fotoshooting mit Auto braucht Balance. Das Fahrzeug soll wirken, ohne alle Aufmerksamkeit zu verschlucken; Menschen sollen natürlich aussehen, ohne das Auto nur als Hintergrund zu nutzen.',
    galleryHeadline: 'Shootingstrecke mit Fahrzeug.',
    galleryLead:
      'Die Motive zeigen, wie Hauptbild, Details, Innenraum und Atmosphäre als kleine Strecke zusammenspielen können.',
    audienceHeadline: 'Passend für Anlass und Nutzung.',
    audienceLead:
      'Die Seite holt Geschenk-, Privat- und Content-Anfragen ab und führt sie in eine professionell geplante Automobilserie.',
    cards: [
      { label: 'Privat', title: 'Lieblingsauto', text: 'Ein persönlicher Bildsatz für Erinnerung, Wandbild oder Social-Profil.' },
      { label: 'Geschenk', title: 'Gutscheinidee', text: 'Ein Shooting, das beim Einlösen flexibel auf Person und Fahrzeug abgestimmt wird.' },
      { label: 'Content', title: 'Profil & Feed', text: 'Mehrere Motive in konsistentem Stil für Posts, Website oder Portfolio.' },
      { label: 'Besonderes Auto', title: 'Sportwagen & Oldtimer', text: 'Fahrzeuge mit Charakter bekommen mehr Raum für Details, Linien und Geschichte.' },
    ],
    relatedLead:
      'Fotoshooting mit Auto sitzt bewusst unter Automobilfotografie und verbindet zu Gutschein-, Portrait- und Sportwagen-Seiten, weil Anlass, Person und Fahrzeug häufig zusammengehören.',
  },
  'motorsport-fotografie': {
    heroLead:
      'Motorsport Fotografie für Fahrzeuge, Teams, Trackdays, Clubs und Performance-Content. Fokus liegt auf Dynamik, Linien, Details und einem Bildsatz, der Event, Fahrzeug und Marke zusammenhält.',
    metaDescription:
      'Motorsport Fotografie für Trackdays, Clubs, Teams und Performance-Fahrzeuge. Sportwagen- und Automobilfotografie aus NRW.',
    contactLead:
      'Schreibe kurz, welches Motorsport- oder Trackday-Format geplant ist, welche Fahrzeuge dabei sind und welche Nutzung die Bilder haben sollen.',
    statementHeadline: 'Motorsport braucht',
    statementEmphasis: 'Tempo und Ordnung.',
    statementBody: [
      'Motorsport Fotografie muss Geschwindigkeit zeigen, ohne dass die Serie unruhig wird. Deshalb werden Standort, Licht, Bewegungsrichtung und sichere Blickachsen vor dem Einsatz mitgedacht.',
      'Neben Action zählen Details: Fahrer, Boxengasse, Reifen, Bremsen, Material, Team und Atmosphäre. So entsteht Content, der Event und Fahrzeug nicht voneinander trennt.',
    ],
    sectionHeadline: 'Track, Team,',
    sectionEmphasis: 'Fahrzeug.',
    sectionLead:
      'Der Bildsatz verbindet dynamische Motive mit ruhigen Detailbildern. Dadurch kann die Serie für Club, Website, Social Media, Sponsoren oder private Erinnerung genutzt werden.',
    galleryHeadline: 'Motorsport in Sequenzen.',
    galleryLead:
      'Die Auswahl denkt in Serien: Hero-Frame, Bewegung, Detail, Umfeld und Stimmungsbild statt nur ein einzelner Mitzieher.',
    audienceHeadline: 'Für Trackdays, Clubs und Teams.',
    audienceLead:
      'Motorsport Fotografie lohnt sich, wenn ein Event nicht nur dokumentiert, sondern als wiederverwendbarer Content aufgebaut werden soll.',
    cards: [
      { label: 'Trackday', title: 'Fahrer & Fahrzeuge', text: 'Dynamische Motive auf Strecke plus ruhige Bilder im Fahrerlager.' },
      { label: 'Club', title: 'Events', text: 'Eine Strecke für Mitglieder, Social Media, Rückblick und Website.' },
      { label: 'Team', title: 'Sponsorencontent', text: 'Fahrzeug, Fahrer, Details und Umfeld als konsistente Kommunikationsbasis.' },
      { label: 'Privat', title: 'Performance Cars', text: 'Sportliche Fahrzeuge mit Bewegung, Standbild und Materialdetails.' },
    ],
    relatedLead:
      'Motorsport Fotografie führt zu Sportwagen und Performance Cars, bleibt aber eigenständig: Action, Event und Trackday brauchen eine andere Bildsprache als ein ruhiges Sportwagen-Shooting.',
  },
  'motorsport-sportwagen-fotografie': {
    heroLead:
      'Motorsport- und Sportwagen-Fotografie für Performance Cars, Trackdays, Clubs, Sammler und Marken. Standbilder, Details und dynamische Motive werden als zusammenhängende Serie geplant.',
    metaDescription:
      'Motorsport- und Sportwagen-Fotografie für Performance Cars, Trackdays, Clubs und Marken in NRW und DACH.',
    contactLead:
      'Schreibe kurz, welcher Sportwagen oder Motorsport-Kontext fotografiert werden soll, ob Standbilder, Details oder Action im Fokus stehen und wofür die Serie genutzt wird.',
    statementHeadline: 'Performance sichtbar',
    statementEmphasis: 'machen.',
    statementBody: [
      'Motorsport- und Sportwagen-Fotografie sitzt zwischen zwei Welten: präzise Standbilder für Form und Material, dynamische Bilder für Tempo, Sound und Charakter.',
      'Die Serie wird so geplant, dass sie für Sammler, Clubs, Trackdays und Marken funktioniert. Nicht jedes Motiv muss schnell sein; wichtig ist, dass jedes Bild die Performance glaubwürdig erzählt.',
    ],
    sectionHeadline: 'Standbild und',
    sectionEmphasis: 'Bewegung.',
    sectionLead:
      'Exterieur, Interieur, Details und Action werden als zusammenhängende Strecke gedacht. So entstehen Motive für Website, Social, Druck und redaktionelle Nutzung.',
    galleryHeadline: 'Performance als Bildsprache.',
    galleryLead:
      'Die Galerie bleibt visuell im Sportwagen-Layout, aber die Texte rahmen sie als Mischung aus Motorsport, Fahrzeugportrait und Detailserie.',
    audienceHeadline: 'Für Besitzer, Clubs und Marken.',
    audienceLead:
      'Die Seite holt Suchende ab, die Motorsport und Sportwagen nicht trennen wollen: Trackday, Performance Car, Event, Sammlung oder Kampagne.',
    cards: [
      { label: 'Sportwagen', title: 'Besitzer & Sammler', text: 'Hochwertige Motive für Fahrzeuge, die mehr brauchen als normale Verkaufsbilder.' },
      { label: 'Motorsport', title: 'Trackday & Club', text: 'Action, Fahrerlager und Details als Serie für Event und Community.' },
      { label: 'Marke', title: 'Performance Content', text: 'Bildsprache für Launches, Social Media, Website oder redaktionelle Strecken.' },
      { label: 'Druck', title: 'Fine Details', text: 'Ruhige Frames, die Linien, Material und Innenraum grossformatig tragen.' },
    ],
    relatedLead:
      'Diese Seite ist die Brücke zwischen Sportwagen- und Motorsport-Suche. Darum verlinkt sie bewusst weiter zu Automobil, Oldtimer und Motorrad, ohne die Hauptkategorie zu verlassen.',
  },
  'portrait-fotoshooting': {
    heroLead:
      'Portrait Fotoshooting für Menschen, die keine austauschbaren Bilder wollen: ruhig, nahbar, klar geführt und passend zu Nutzung, Person und Wirkung.',
    metaDescription:
      'Portrait Fotoshooting für Personal Branding, Dating, Paar, Familie, Editorial und professionelle Profile in Düsseldorf und NRW.',
    contactLead:
      'Schreibe kurz, für wen das Portrait Fotoshooting gedacht ist, welche Wirkung du dir wünschst und ob es um privat, Profil, Dating, Paar, Familie oder Personal Branding geht.',
    pullHeadline: 'Portraits mit Richtung,',
    pullEmphasis: 'nicht mit Pose.',
    statementBody: [
      'Ein Portrait Fotoshooting beginnt mit der Frage, wofür die Bilder gebraucht werden. Profil, Dating, Paar, Familie oder Personal Branding brauchen jeweils andere Distanz, anderes Licht und eine andere Bildauswahl.',
      'Die Regie bleibt ruhig und konkret. Es geht nicht darum, jemanden zu verkleiden, sondern Blick, Haltung und Umgebung so zu führen, dass die Person erkennbar bleibt.',
    ],
    sectionHeadline: 'Vom privaten Bild bis zum',
    sectionEmphasis: 'Auftritt.',
    sectionLead:
      'Diese Seite sammelt die breiten Portrait-Anfragen und führt sie in klare Shooting-Module, ohne Passbild- oder Studio-Massenware zu bedienen.',
    cards: [
      { label: 'Profil', title: 'Profilbilder', text: 'Klare Portraits für Website, LinkedIn, Dating oder Social Media mit passender Bildwirkung.' },
      { label: 'Privat', title: 'Persönliche Serie', text: 'Ruhige Bilder für Menschen, die ein gutes Portrait von sich möchten, ohne künstlich zu wirken.' },
      { label: 'Paar', title: 'Zu zweit', text: 'Nahe Motive mit echter Verbindung, geführt ohne steife Standardsituationen.' },
      { label: 'Familie', title: 'Kleine Familien', text: 'Natürliche Serien für Familien, bei denen Stimmung wichtiger ist als perfekte Aufstellung.' },
      { label: 'Brand', title: 'Personal Branding', text: 'Portraits, die Person, Arbeit und Wirkung in eine konsistente Bildsprache bringen.' },
    ],
    processHeadline: 'Ablauf für ein Portrait Fotoshooting.',
    processLead:
      'Der Ablauf bleibt bewusst übersichtlich: kurze Einordnung, Stilabstimmung, entspanntes Shooting und eine Auswahl, die zur späteren Nutzung passt.',
    processSteps: [
      { title: 'Ziel klären', text: 'Wir legen fest, ob die Bilder privat, beruflich, für Dating, Paar, Familie oder Personal Branding gedacht sind.' },
      { title: 'Stimmung setzen', text: 'Licht, Ort, Kleidung und Bildsprache werden so abgestimmt, dass du dich nicht verkleidet fühlst.' },
      { title: 'Ruhig fotografieren', text: 'Beim Shooting bekommst du klare Regie, genug Zeit und zwischendurch Orientierung am Bild.' },
      { title: 'Auswahl treffen', text: 'Du bekommst eine kuratierte Vorauswahl und entscheidest, welche Motive final bearbeitet werden.' },
      { title: 'Fertig liefern', text: 'Die finalen Dateien kommen passend für Web, Social, Print oder persönliche Nutzung.' },
    ],
    relatedLead:
      'Portrait Fotoshooting bleibt die breite Einstiegsseite. Die Unterseiten für Dating, Gutschein, Preise, Schwarz-Weiss und Beleuchtung greifen enger gefasste Anliegen auf.',
  },
  'portraitfotografie-beleuchtung': {
    heroLead:
      'Portraitfotografie Beleuchtung: Licht ist kein Effekt, sondern die Grundlage für Nähe, Kontur und Haltung. Diese Seite greift Suchende ab, die gezielt nach Licht, Setup und professioneller Portraitwirkung suchen.',
    metaDescription:
      'Portraitfotografie Beleuchtung: ruhige, professionelle Portraits mit passendem Licht für Profil, Personal Branding, Editorial und private Shootings.',
    contactLead:
      'Schreibe kurz, welche Lichtstimmung du suchst - weich, kontrastreich, natürlich oder editorial - und wofür die Portraits später genutzt werden.',
    pullHeadline: 'Licht führt den Blick,',
    pullEmphasis: 'nicht die Technik.',
    statementBody: [
      'Bei Portraitfotografie Beleuchtung geht es nicht um möglichst viel Equipment. Entscheidend ist, ob das Licht Gesicht, Haltung und Stimmung unterstützt.',
      'Weiches Fensterlicht, gesetztes mobiles Licht oder ein kontrastreicher Look erzeugen völlig unterschiedliche Aussagen. Deshalb wird die Lichtwirkung vor dem Shooting bewusst gewählt.',
    ],
    sectionHeadline: 'Weich, klar oder',
    sectionEmphasis: 'kontrastreich.',
    sectionLead:
      'Diese Seite erklärt Licht als Teil der Bildsprache und nicht als technische Spielerei. Sie passt für Suchende, die bewusst nach Wirkung, Setup und professioneller Portraitanmutung suchen.',
    cards: [
      { label: 'Weich', title: 'Natürliches Licht', text: 'Ruhige Portraits mit sanften Übergängen, ideal für nahbare Profile und private Serien.' },
      { label: 'Klar', title: 'Kontrolliertes Setup', text: 'Mobiles Licht für konsistente Ergebnisse, wenn Ort oder Tageszeit nicht alles leisten.' },
      { label: 'Kontur', title: 'Kantenlicht', text: 'Feine Trennung von Person und Hintergrund, ohne den Look künstlich wirken zu lassen.' },
      { label: 'Editorial', title: 'Kontrast', text: 'Stärkere Lichtsetzung für markante Portraits, Schwarz-Weiss-Serien oder Magazinwirkung.' },
      { label: 'Mix', title: 'Innen und aussen', text: 'Lichtstimmungen können innerhalb einer Serie wechseln, solange die Bildsprache zusammenhält.' },
    ],
    processHeadline: 'Lichtplanung vor dem Portrait.',
    processLead:
      'Vor dem Shooting wird nicht nur der Ort festgelegt, sondern auch die Lichtidee: natürlich, ruhig, grafisch, kontrastreich oder editorial.',
    processSteps: [
      { title: 'Wirkung bestimmen', text: 'Wir klären, ob die Portraits weich, seriös, markant, ruhig oder redaktionell wirken sollen.' },
      { title: 'Ort prüfen', text: 'Fenster, Schatten, Wandfarbe und Hintergrund entscheiden, ob vorhandenes Licht reicht.' },
      { title: 'Setup wählen', text: 'Bei Bedarf kommt mobiles Licht dazu, damit Augen, Kontur und Hauttöne kontrolliert bleiben.' },
      { title: 'Varianten fotografieren', text: 'Innerhalb des Termins können ruhige und stärkere Lichtstimmungen entstehen.' },
      { title: 'Look finalisieren', text: 'Die Bearbeitung bleibt zurückhaltend und stärkt die geplante Lichtwirkung.' },
    ],
    relatedLead:
      'Portraitfotografie Beleuchtung eignet sich als fachlicher Ratgeber innerhalb des Portrait-Clusters und verlinkt zu Portrait Fotoshooting, Schwarz-Weiss und Personal Branding.',
  },
  'dating-fotoshooting': {
    heroLead:
      'Dating Fotoshooting für natürliche, gute Portraits ohne steife Posen. Ziel sind Bilder, die sympathisch, klar und ehrlich wirken - für Datingprofile, Social Media und private Nutzung.',
    metaDescription:
      'Dating Fotoshooting für natürliche Portraits in Düsseldorf und NRW. Authentische Bilder für Datingprofile, Social Media und private Nutzung.',
    contactLead:
      'Schreibe kurz, welche Plattform oder Wirkung wichtig ist und ob du eher natürliche Outdoor-Bilder, ruhige Portraits oder eine kleine Serie möchtest.',
    pullHeadline: 'Datingbilder, die',
    pullEmphasis: 'echt wirken.',
    statementBody: [
      'Ein Dating Fotoshooting braucht keine künstliche Coolness. Gute Bilder zeigen Sympathie, Offenheit und ein bisschen Kontext, ohne wie eine Kampagne für eine fremde Person zu wirken.',
      'Die Serie wird so geplant, dass mehrere Situationen entstehen: klares Portrait, natürliches Lachen, ruhige Ganzkörperaufnahme und ein Bild mit Umgebung.',
    ],
    sectionHeadline: 'Sympathisch, klar,',
    sectionEmphasis: 'unverkrampft.',
    sectionLead:
      'Die Seite spricht Menschen an, die bessere Datingbilder möchten, aber keine gestellten Studiofotos. Der Look bleibt natürlich und alltagstauglich.',
    cards: [
      { label: 'Profil', title: 'Erstes Bild', text: 'Ein klares Portrait, das freundlich wirkt und nicht überinszeniert ist.' },
      { label: 'Alltag', title: 'Natürlicher Kontext', text: 'Motive mit Umgebung, damit dein Profil mehr zeigt als nur ein Gesicht.' },
      { label: 'Haltung', title: 'Ganzkörper', text: 'Lockere Bilder mit Körperhaltung, ohne starre Posen.' },
      { label: 'Auswahl', title: 'Serienlogik', text: 'Mehrere Bilder, die zusammen abwechslungsreich wirken und nicht wie derselbe Moment.' },
      { label: 'Ehrlich', title: 'Keine Maskerade', text: 'Die Bearbeitung bleibt realistisch, damit du auf dem Bild wiedererkannt wirst.' },
    ],
    processHeadline: 'Ablauf für Datingbilder.',
    processLead:
      'Der Termin bleibt leicht und praktisch: kurze Vorbereitung, passende Location, klare Regie und am Ende eine Auswahl für dein Profil.',
    processSteps: [
      { title: 'Profilziel klären', text: 'Wir sprechen kurz über Plattform, Bildwirkung und welche Seiten von dir sichtbar werden sollen.' },
      { title: 'Location wählen', text: 'Outdoor, Cafe-Umfeld, ruhige Strasse oder schlichter Hintergrund - passend zu dir.' },
      { title: 'Locker starten', text: 'Wir beginnen mit einfachen Motiven, damit du ins Shooting reinkommst.' },
      { title: 'Varianten bauen', text: 'Portrait, Lachen, Ganzkörper und Umfeld werden als kleine Profilserie fotografiert.' },
      { title: 'Profilauswahl liefern', text: 'Du bekommst bearbeitete Bilder, die für App, Social und private Nutzung funktionieren.' },
    ],
    relatedLead:
      'Dating Fotoshooting ist eine eigene Portrait-Anfrage. Von hier führen Links zu Portrait Fotoshooting, Preisen und Gutschein, ohne Passfoto-Themen aufzunehmen.',
  },
  'fotoshooting-gutschein': {
    heroLead:
      'Fotoshooting Gutschein als hochwertiges Geschenk: für Portraits, Paare, Familie oder ein besonderes Fahrzeug. Der Gutschein bleibt einfach einlösbar und wird später in ein konkretes Shooting übersetzt.',
    metaDescription:
      'Fotoshooting Gutschein für Portrait, Paar, Familie oder Auto-Fotoshooting in Düsseldorf, Mettmann, Erkrath und NRW.',
    contactLead:
      'Schreibe kurz, für wen der Gutschein gedacht ist und ob eher Portrait, Paar, Familie oder Auto-Fotoshooting passt. Den genauen Stil können wir beim Einlösen gemeinsam festlegen.',
    pullHeadline: 'Ein Gutschein mit',
    pullEmphasis: 'echtem Spielraum.',
    statementBody: [
      'Ein Fotoshooting Gutschein sollte nicht wie ein starres Paket wirken. Die beschenkte Person soll später entscheiden können, ob Portrait, Paar, Familie oder Auto besser passt.',
      'Darum wird der Gutschein bewusst offen gehalten und erst beim Einlösen in Stil, Ort, Umfang und Bildsprache übersetzt.',
    ],
    sectionHeadline: 'Geschenkidee mit',
    sectionEmphasis: 'klarer Einlösung.',
    sectionLead:
      'Diese Seite holt Geschenk-Suchende ab und führt sie nicht auf eine generische Shop-Seite, sondern in konkrete Shootingarten, die Matthias tatsächlich anbietet.',
    cards: [
      { label: 'Portrait', title: 'Einzelperson', text: 'Für Menschen, die endlich gute Bilder von sich selbst haben möchten.' },
      { label: 'Paar', title: 'Gemeinsam', text: 'Ein ruhiger Termin für Paare, die natürliche Bilder statt gestellte Motive wollen.' },
      { label: 'Familie', title: 'Kleine Familie', text: 'Als Geschenk für Eltern, Geschwister oder besondere Anlässe.' },
      { label: 'Auto', title: 'Fahrzeugliebe', text: 'Für Besitzer von Sportwagen, Oldtimer, Motorrad oder besonderem Alltagsauto.' },
      { label: 'Frei', title: 'Stil später klären', text: 'Der konkrete Look wird erst beim Einlösen gemeinsam abgestimmt.' },
    ],
    processHeadline: 'So funktioniert der Gutschein.',
    processLead:
      'Der Gutschein bleibt unkompliziert: Anfrage, Wert oder Shootingart festlegen, persönlich übergeben und später gemeinsam einlösen.',
    processSteps: [
      { title: 'Anlass nennen', text: 'Du sagst kurz, für wen der Gutschein ist und ob ein bestimmtes Shooting naheliegt.' },
      { title: 'Rahmen festlegen', text: 'Wir klären Wert, Shootingart und ob der Gutschein offen oder konkreter formuliert wird.' },
      { title: 'Gutschein vorbereiten', text: 'Der Gutschein wird so gehalten, dass er als Geschenk sauber übergeben werden kann.' },
      { title: 'Einlösen planen', text: 'Die beschenkte Person meldet sich und wir planen Ort, Stil und Ablauf.' },
      { title: 'Shooting umsetzen', text: 'Aus dem Geschenk wird ein echter Termin mit final bearbeiteten Bildern.' },
    ],
    relatedLead:
      'Fotoshooting Gutschein verbindet Portrait-, Paar-, Familien- und Automobilseiten. Die interne Verlinkung hilft, den passenden Gutscheinrahmen schnell zu finden.',
  },
  'fotoshooting-preise': {
    heroLead:
      'Fotoshooting Preise hängen von Umfang, Nutzung, Ort, Vorbereitung und Ausgabe ab. Diese Seite gibt Suchenden einen passenden Einstieg und führt zur konkreten Anfrage statt zu pauschalen Billigpaketen.',
    metaDescription:
      'Fotoshooting Preise für Portrait, Auto, Sportwagen und individuelle Shootings. Anfrage für transparente Pakete in Düsseldorf und NRW.',
    contactLead:
      'Schreibe kurz, welche Art Shooting du planst, wie viele Personen oder Fahrzeuge dabei sind und wofür die Bilder genutzt werden. Dann lässt sich der Preis sauber einordnen.',
    pullHeadline: 'Preise brauchen',
    pullEmphasis: 'Kontext.',
    statementBody: [
      'Fotoshooting Preise sind selten sinnvoll vergleichbar, wenn nur eine Zahl im Raum steht. Entscheidend sind Motiv, Nutzung, Ort, Dauer, Vorbereitung und Anzahl der finalen Bilder.',
      'Diese Seite erklärt, warum ein Portraittermin, ein Auto-Fotoshooting und eine Content-Serie unterschiedlich kalkuliert werden, ohne in unpassende Billigpakete abzurutschen.',
    ],
    sectionHeadline: 'Was den Umfang',
    sectionEmphasis: 'verändert.',
    sectionLead:
      'Preisfragen werden transparent beantwortet: nicht mit einer langen Paketliste, sondern mit Kriterien, die für eine seriöse Anfrage wirklich zählen.',
    cards: [
      { label: 'Art', title: 'Shootingtyp', text: 'Portrait, Paar, Familie, Auto oder Sportwagen haben unterschiedliche Vorbereitung und Bildlogik.' },
      { label: 'Ort', title: 'Location', text: 'Anfahrt, Genehmigung, Lichtfenster und Setup beeinflussen den Aufwand.' },
      { label: 'Nutzung', title: 'Privat oder kommerziell', text: 'Bilder für Website, Kampagne oder Verkauf werden anders lizenziert als private Erinnerungen.' },
      { label: 'Umfang', title: 'Bildanzahl', text: 'Eine kleine Auswahl braucht weniger Retusche und Abstimmung als eine umfangreiche Serie.' },
      { label: 'Output', title: 'Dateien & Formate', text: 'Web, Social, Print und grosse Drucke haben unterschiedliche Anforderungen.' },
    ],
    processHeadline: 'So wird ein Preis sauber.',
    processLead:
      'Statt pauschal zu raten, wird der Rahmen in wenigen Punkten geklärt. Danach kann ein Angebot passend zum echten Bedarf entstehen.',
    processSteps: [
      { title: 'Shootingart nennen', text: 'Du beschreibst kurz, ob es um Portrait, Paar, Familie, Auto, Sportwagen oder Content geht.' },
      { title: 'Nutzung klären', text: 'Privat, Social, Website, Verkauf oder Kampagne machen einen Unterschied.' },
      { title: 'Umfang schätzen', text: 'Wir sprechen über Dauer, Location, Personen oder Fahrzeuge und gewünschte Bildanzahl.' },
      { title: 'Angebot erhalten', text: 'Du bekommst eine klare Einordnung mit passendem Leistungsrahmen.' },
      { title: 'Termin planen', text: 'Nach Freigabe werden Ort, Ablauf und Ausgabe sauber festgelegt.' },
    ],
    relatedLead:
      'Fotoshooting Preise ist ein beratender Einstieg. Von hier sollten Nutzer direkt zu den passenden Leistungsseiten wechseln können: Portrait, Auto, Gutschein oder Dating.',
  },
  'paarshooting-familienshooting': {
    heroLead:
      'Paarshooting und Familienshooting für echte Nähe statt gestellter Gruppenbilder. Der Fokus liegt auf ruhigen, persönlichen Serien mit klarer Lichtführung und natürlicher Regie.',
    metaDescription:
      'Paarshooting und Familienshooting in Düsseldorf, Mettmann, Erkrath und NRW. Natürliche Portraits für Paare und Familien.',
    contactLead:
      'Schreibe kurz, ob es um Paar, kleine Familie oder einen besonderen Anlass geht, welche Stimmung passen soll und wo das Shooting stattfinden könnte.',
    pullHeadline: 'Nahe Bilder ohne',
    pullEmphasis: 'Aufstellung.',
    statementBody: [
      'Paarshooting und Familienshooting funktionieren am besten, wenn nicht jede Person in eine perfekte Pose gezwungen wird. Kleine Bewegungen, Blickwechsel und echte Situationen tragen mehr.',
      'Der Fokus liegt auf Paaren und kleinen Familien, die ruhige, persönliche Bilder möchten. Grosse Gruppen werden bewusst nicht als Hauptangebot nach vorne gestellt.',
    ],
    sectionHeadline: 'Paar, kleine Familie,',
    sectionEmphasis: 'echte Momente.',
    sectionLead:
      'Diese Seite verbindet zwei nahe Anlässe, ohne sie zu verwässern: Paarbilder und kleine Familienshootings mit natürlicher Regie.',
    cards: [
      { label: 'Paar', title: 'Zu zweit', text: 'Ruhige Motive, die Verbindung zeigen, ohne kitschig oder gestellt zu wirken.' },
      { label: 'Familie', title: 'Kleine Familien', text: 'Natürliche Serien mit Kindern oder Eltern, bei denen Bewegung erlaubt bleibt.' },
      { label: 'Anlass', title: 'Jahrestag & Geschenk', text: 'Ein Shooting als gemeinsames Erlebnis oder als persönliches Geschenk.' },
      { label: 'Zuhause', title: 'Vertraute Orte', text: 'Wenn der Ort Teil der Geschichte ist, kann er bewusst in die Bilder einfließen.' },
      { label: 'Outdoor', title: 'Licht und Raum', text: 'Ruhige Aussenorte schaffen Abstand, Bewegung und eine natürliche Atmosphäre.' },
    ],
    processHeadline: 'Ablauf für Paar und Familie.',
    processLead:
      'Der Termin soll leicht bleiben: klare Vorbereitung, wenig Druck, flexible Führung und eine Auswahl mit echten Zwischenmomenten.',
    processSteps: [
      { title: 'Konstellation klären', text: 'Wir sprechen darüber, ob es um Paar, kleine Familie oder einen konkreten Anlass geht.' },
      { title: 'Ort wählen', text: 'Zuhause, draussen oder an einem persönlichen Ort - passend zur Geschichte.' },
      { title: 'Locker beginnen', text: 'Einfache Bewegungen helfen, damit sich niemand beobachtet oder aufgestellt fühlt.' },
      { title: 'Momente sammeln', text: 'Neben klaren Portraits entstehen kleine Szenen, Details und Zwischentöne.' },
      { title: 'Serie liefern', text: 'Die finalen Bilder werden als zusammenhängende Erinnerung bearbeitet.' },
    ],
    relatedLead:
      'Paarshooting und Familienshooting bleibt bewusst bei Portraits und grenzt sich von Gruppen- und Passbildsuchen ab.',
  },
  'schwarz-weiss-portrait-fotografie': {
    heroLead:
      'Schwarz-Weiss Portrait Fotografie reduziert ein Bild auf Licht, Blick, Kontur und Haltung. Geeignet für starke Einzelportraits, Editorials, Personal Branding und private Serien mit ruhiger Wirkung.',
    metaDescription:
      'Schwarz-Weiss Portrait Fotografie für klare, ruhige Portraits mit Fokus auf Licht, Blick und Haltung in Düsseldorf und NRW.',
    contactLead:
      'Schreibe kurz, ob du eine reine Schwarz-Weiss-Serie oder eine Mischung aus Farbe und Schwarz-Weiss möchtest und wofür die Bilder genutzt werden.',
    pullHeadline: 'Reduziert auf Licht,',
    pullEmphasis: 'Blick und Haltung.',
    statementBody: [
      'Schwarz-Weiss Portrait Fotografie nimmt Farbe aus dem Bild und macht dadurch andere Dinge lauter: Blick, Form, Haut, Kontur, Schatten und Haltung.',
      'Der Look eignet sich für markante Einzelportraits, Editorials, künstlerische Serien und Personal Branding, wenn die Bilder ruhiger und zeitloser wirken sollen.',
    ],
    sectionHeadline: 'Kontrast statt',
    sectionEmphasis: 'Ablenkung.',
    sectionLead:
      'Diese Seite bedient eine klare Stil-Suche. Sie erklärt Schwarz-Weiss nicht als Filter, sondern als bewusste Entscheidung für Licht, Tonwerte und Bildwirkung.',
    cards: [
      { label: 'Klar', title: 'Einzelportrait', text: 'Reduzierte Bilder mit Fokus auf Gesicht, Blick und Haltung.' },
      { label: 'Editorial', title: 'Stärkere Serie', text: 'Kontraste, Schatten und Ausschnitt dürfen präsenter sein als in klassischen Profilbildern.' },
      { label: 'Brand', title: 'Zeitloser Auftritt', text: 'Schwarz-Weiss kann Personal Branding ruhiger und weniger trendabhängig machen.' },
      { label: 'Mix', title: 'Farbe plus Schwarz-Weiss', text: 'Eine Serie kann farbige Hauptmotive und ausgewählte Schwarz-Weiss-Finals kombinieren.' },
      { label: 'Print', title: 'Wandbild', text: 'Tonwerte und Kontrast werden so bearbeitet, dass die Bilder auch im Druck tragen.' },
    ],
    processHeadline: 'Ablauf für Schwarz-Weiss Portraits.',
    processLead:
      'Schon vor dem Shooting wird entschieden, ob Schwarz-Weiss die Hauptsprache der Serie ist oder als finale Auswahl dazukommt.',
    processSteps: [
      { title: 'Look festlegen', text: 'Wir klären, ob die Serie weich, kontrastreich, ruhig oder editorial werden soll.' },
      { title: 'Licht planen', text: 'Schwarz-Weiss lebt von Form und Schatten; das Licht wird entsprechend gesetzt.' },
      { title: 'Motive fotografieren', text: 'Blick, Haltung und Ausschnitt werden bewusster geführt als bei sehr farbigen Serien.' },
      { title: 'Tonwerte bearbeiten', text: 'Die Retusche konzentriert sich auf Kontrast, Haut, Struktur und saubere Graustufen.' },
      { title: 'Finale Auswahl liefern', text: 'Du bekommst die Bilder passend für Profil, Print, Website oder private Nutzung.' },
    ],
    relatedLead:
      'Schwarz-Weiss Portrait Fotografie ist eine Stilseite innerhalb des Portrait-Clusters und verlinkt sinnvoll zu Beleuchtung, Portrait Fotoshooting und Personal Branding.',
  },
  'business-portrait': {
    heroLead:
      'Business Portrait für Website, LinkedIn, Presse und Team: professionelle Portraits mit Haltung statt Passbild. Klar, hochwertig und auf den Auftritt der Person abgestimmt.',
    metaDescription:
      'Business Portrait Fotograf: professionelle Portraits für Website, LinkedIn, Presse, Team und Marke in Düsseldorf und NRW - keine Passbilder.',
    contactLead:
      'Schreibe kurz, für wen das Business Portrait gedacht ist - einzelne Person, Führungsebene oder Team - wofür die Bilder genutzt werden (Website, LinkedIn, Presse) und ob es vor Ort, on location oder in ruhiger Umgebung entstehen soll.',
    pullHeadline: 'Professionell wirken,',
    pullEmphasis: 'nicht gestellt.',
    statementBody: [
      'Ein Business Portrait ist kein Bewerbungsfoto und kein Passbild. Es soll Kompetenz, Nahbarkeit und Wiedererkennung transportieren - für Website, LinkedIn, Presse oder die Teamseite.',
      'Licht, Distanz und Hintergrund werden auf Rolle und Branche abgestimmt. Eine Kanzlei braucht andere Bilder als ein Startup, bleibt aber in einer klaren, professionellen Bildsprache.',
    ],
    sectionHeadline: 'Vom Einzelportrait bis zum',
    sectionEmphasis: 'Team.',
    sectionLead:
      'Diese Seite bündelt Business-Portraits für Person, Führung, Team und Marke - ohne in Passbild- oder Studio-Massenware abzurutschen.',
    cards: [
      { label: 'Person', title: 'Einzelportrait', text: 'Hochwertige Portraits für Website, LinkedIn und Profil mit klarer, professioneller Wirkung.' },
      { label: 'Führung', title: 'Geschäftsführung', text: 'Portraits für Führungsebene, Aufsichtsrat und Presse mit ruhiger Autorität.' },
      { label: 'Team', title: 'Teamseite', text: 'Konsistente Bildsprache über mehrere Personen, damit die Teamseite zusammenhängt.' },
      { label: 'Marke', title: 'Corporate Look', text: 'Bildwelt, die zu Branding, Website und Unternehmensauftritt passt.' },
    ],
    processHeadline: 'Ablauf für ein Business Portrait.',
    processLead:
      'Der Ablauf bleibt effizient und planbar - wichtig bei mehreren Personen oder engem Terminfenster im Unternehmen.',
    processSteps: [
      { title: 'Nutzung klären', text: 'Wir legen fest, ob die Bilder für Website, LinkedIn, Presse, Team oder Kampagne gedacht sind.' },
      { title: 'Look abstimmen', text: 'Hintergrund, Kleidung, Bildausschnitt und Stimmung werden auf Rolle und Branche abgestimmt.' },
      { title: 'Vor Ort oder on location', text: 'Das Shooting findet im Unternehmen, on location oder in ruhiger Umgebung statt - je nach Bedarf.' },
      { title: 'Effizient fotografieren', text: 'Auch mehrere Personen werden in einem klaren Ablauf mit gleichbleibender Qualität fotografiert.' },
      { title: 'Liefern und pflegen', text: 'Finale Dateien kommen passend für Web, Print und Social; Nachzügler lassen sich konsistent ergänzen.' },
    ],
    relatedLead:
      'Business Portrait ist die kommerzielle Einstiegsseite. Für engere Intentionen verweist sie auf Headshot, Personal Branding, Unternehmensportrait und Pressefoto.',
  },
  'headshot-fotograf': {
    heroLead:
      'Headshots für LinkedIn, Team-Seiten und Bewerbung: klar, sauber und auf den Punkt - ein professionelles Gesicht ohne Studio-Steifheit.',
    metaDescription:
      'Headshot Fotograf: klare, professionelle Headshots für LinkedIn, Profil, Team und Bewerbung in Düsseldorf und NRW.',
    contactLead:
      'Schreibe kurz, ob es um eine Person oder ein Team geht, wo die Headshots genutzt werden (LinkedIn, Website, Bewerbung) und ob ein einheitlicher Look über mehrere Personen wichtig ist.',
    pullHeadline: 'Ein Gesicht,',
    pullEmphasis: 'klar gezeigt.',
    statementBody: [
      'Ein Headshot ist der enge, fokussierte Ausschnitt: Gesicht, Blick und Ausdruck stehen im Mittelpunkt. Genau das brauchen LinkedIn, Profile, Team-Grids und Bewerbungen.',
      'Wichtig ist Wiederholbarkeit. Wenn mehrere Personen denselben Look brauchen, bleiben Licht, Hintergrund und Ausschnitt über alle Aufnahmen konsistent.',
    ],
    sectionHeadline: 'Sauber, einheitlich,',
    sectionEmphasis: 'wiedererkennbar.',
    sectionLead:
      'Diese Seite bleibt bewusst eng: professionelle Profilbilder, kein verkleidetes Konzept-Shooting.',
    cards: [
      { label: 'Profil', title: 'LinkedIn & Web', text: 'Klare Headshots, die auf Profilen und Teamseiten sofort professionell wirken.' },
      { label: 'Team', title: 'Einheitlicher Look', text: 'Gleiches Licht, gleicher Hintergrund, gleicher Ausschnitt über alle Personen.' },
      { label: 'Bewerbung', title: 'Bewerbungsbild', text: 'Sympathisch und professionell - moderner als ein klassisches Passbild.' },
      { label: 'Schnell', title: 'Effizienter Termin', text: 'Kompakter Ablauf, ideal für einzelne Personen oder ganze Teams am Stück.' },
    ],
    processHeadline: 'Ablauf für Headshots.',
    processLead:
      'Headshots leben von einem ruhigen, schnellen Ablauf - besonders, wenn mehrere Personen nacheinander fotografiert werden.',
    processSteps: [
      { title: 'Zweck klären', text: 'Wir klären Nutzung, gewünschte Wirkung und ob ein einheitlicher Team-Look nötig ist.' },
      { title: 'Setup setzen', text: 'Licht, Hintergrund und Ausschnitt werden einmal sauber festgelegt und konstant gehalten.' },
      { title: 'Person führen', text: 'Kurze, klare Regie für Blick und Haltung, damit der Ausdruck natürlich bleibt.' },
      { title: 'Auswahl treffen', text: 'Pro Person eine kuratierte Auswahl der besten Aufnahmen.' },
      { title: 'Konsistent liefern', text: 'Finale Headshots in einheitlichem Look für Web, Profil und Bewerbung.' },
    ],
    relatedLead:
      'Headshot ist die engste Portraitform. Wer mehr Bildwelt braucht, findet bei Business Portrait, Personal Branding und Unternehmensportrait den passenden Umfang.',
  },
  'personal-branding-fotografie': {
    heroLead:
      'Personal Branding Fotografie für Selbstständige, Founder und Coaches: eine Bildwelt aus mehreren Looks und Orten statt eines einzelnen Profilbilds.',
    metaDescription:
      'Personal Branding Fotografie: Bildwelt für Website, Social und Angebot - mehrere Looks, Orte und Motive für Selbstständige und Founder.',
    contactLead:
      'Schreibe kurz, wofür die Bilder gebraucht werden (Website, Social, Angebot), wie du positioniert bist und welche Themen oder Orte deine Arbeit am besten zeigen.',
    pullHeadline: 'Eine Person,',
    pullEmphasis: 'eine Bildwelt.',
    statementBody: [
      'Personal Branding Fotografie endet nicht beim Portrait. Es geht um eine zusammenhängende Bildwelt: Person, Arbeitsweise, Umfeld und wiederkehrende Motive für alle Kanäle.',
      'Eine Serie liefert Material für Website, Social Media, Newsletter und Angebote - mit genug Varianten, damit über Monate nicht immer dasselbe Bild läuft.',
    ],
    sectionHeadline: 'Mehr als ein',
    sectionEmphasis: 'Profilbild.',
    sectionLead:
      'Diese Seite richtet sich an Menschen, die ihre Marke selbst sind. Statt eines Einzelbilds entsteht ein nutzbarer Vorrat an Motiven.',
    cards: [
      { label: 'Person', title: 'Hauptportraits', text: 'Klare Portraits als Anker der Bildwelt für Startseite und Profil.' },
      { label: 'Arbeit', title: 'In Aktion', text: 'Bilder bei der Arbeit, im Gespräch oder am Material - glaubwürdig statt gestellt.' },
      { label: 'Umfeld', title: 'Orte & Atmosphäre', text: 'Büro, Studio oder typische Locations als Teil der Geschichte.' },
      { label: 'Content', title: 'Social-Vorrat', text: 'Hoch- und Querformate plus Detailmotive für einen laufenden Content-Plan.' },
    ],
    processHeadline: 'Ablauf für Personal Branding.',
    processLead:
      'Vor dem Shooting steht ein kleiner Content-Plan: Positionierung, Themen und Kanäle bestimmen, welche Motive wirklich gebraucht werden.',
    processSteps: [
      { title: 'Positionierung klären', text: 'Wir schauen, wofür du stehst und welche Bilder dein Angebot stützen.' },
      { title: 'Motivliste bauen', text: 'Themen, Orte, Outfits und Formate werden als Liste statt als Zufall geplant.' },
      { title: 'In Etappen fotografieren', text: 'Verschiedene Looks und Situationen entstehen in einem strukturierten Termin.' },
      { title: 'Auswahl kuratieren', text: 'Du bekommst eine sortierte Auswahl nach Verwendungszweck, nicht nur nach Schönheit.' },
      { title: 'Vorrat liefern', text: 'Die Bildwelt kommt in Formaten für Website, Social und Print - bereit für Monate.' },
    ],
    relatedLead:
      'Personal Branding Fotografie ist die breiteste Auftritts-Seite. Sie grenzt sich von Headshot und Business Portrait ab, verlinkt aber bewusst dorthin.',
  },
  'unternehmensportrait': {
    heroLead:
      'Unternehmensportrait für Team, Führung und Standort: eine konsistente Bildsprache über alle Personen - vor Ort im Unternehmen oder on location.',
    metaDescription:
      'Unternehmensportrait: konsistente Portraits für Team, Führung und Standort in Düsseldorf und NRW - vor Ort und mit einheitlichem Look.',
    contactLead:
      'Schreibe kurz, wie viele Personen fotografiert werden, ob es vor Ort im Unternehmen stattfinden soll und wofür die Bilder genutzt werden (Website, Recruiting, Presse, Bericht).',
    pullHeadline: 'Ein Unternehmen,',
    pullEmphasis: 'eine Bildsprache.',
    statementBody: [
      'Beim Unternehmensportrait geht es selten um eine einzelne Person, sondern um viele: Team, Führung, Abteilungen und Standort sollen in einer gemeinsamen Bildsprache erscheinen.',
      'Der Schlüssel ist Konsistenz und Logistik. Licht, Hintergrund und Ausschnitt bleiben gleich, auch wenn an einem Tag viele Menschen nacheinander fotografiert werden.',
    ],
    sectionHeadline: 'Team, Führung,',
    sectionEmphasis: 'Standort.',
    sectionLead:
      'Diese Seite ist für Unternehmen, die mehr als ein Portrait brauchen: eine verlässliche, wiederholbare Bildlinie für den gesamten Auftritt.',
    cards: [
      { label: 'Team', title: 'Mitarbeiterportraits', text: 'Einheitliche Portraits für Website, Recruiting und Teamseite.' },
      { label: 'Führung', title: 'Geschäftsleitung', text: 'Repräsentative Portraits für Presse, Bericht und Investor Relations.' },
      { label: 'Standort', title: 'Vor Ort', text: 'Arbeitsumgebung und Räume als Teil des Unternehmensbildes.' },
      { label: 'System', title: 'Erweiterbar', text: 'Neue Mitarbeitende lassen sich später im gleichen Look ergänzen.' },
    ],
    processHeadline: 'Ablauf für Unternehmensportraits.',
    processLead:
      'Bei vielen Personen entscheidet die Organisation über das Ergebnis: klarer Zeitplan, fester Setup-Ort und ein effizienter Durchlauf.',
    processSteps: [
      { title: 'Umfang klären', text: 'Personenzahl, Orte, Nutzung und gewünschter Look werden vorab abgestimmt.' },
      { title: 'Setup aufbauen', text: 'Ein fester Punkt im Unternehmen sorgt für gleichbleibendes Licht und Hintergrund.' },
      { title: 'Im Takt fotografieren', text: 'Personen werden nacheinander in kurzen, ruhigen Slots fotografiert.' },
      { title: 'Konsistent bearbeiten', text: 'Alle Portraits werden in derselben Bildsprache retuschiert.' },
      { title: 'Strukturiert liefern', text: 'Benannte Dateien pro Person, bereit für Website, Intranet und Presse.' },
    ],
    relatedLead:
      'Unternehmensportrait ist die team- und standortbezogene Seite. Für einzelne Personen passt Business Portrait oder Headshot, für Marken-Aufbau Personal Branding.',
  },
  'pressefoto': {
    heroLead:
      'Pressefotos für Medien, PR und Bericht: glaubwürdig, redaktionell nutzbar und mit klaren Rechten - Portraits und Motive, die Redaktionen direkt verwenden können.',
    metaDescription:
      'Pressefoto Fotograf: redaktionell nutzbare Portraits und Motive für Presse, PR und Medienkit in Düsseldorf und NRW - mit klarer Nutzungsfreigabe.',
    contactLead:
      'Schreibe kurz, wofür die Pressefotos gebraucht werden (Pressemitteilung, Medienkit, Bericht), wer abgebildet wird und welche Rechte oder Formate die Redaktionen brauchen.',
    pullHeadline: 'Bilder, die Redaktionen',
    pullEmphasis: 'verwenden.',
    statementBody: [
      'Ein Pressefoto muss anders funktionieren als ein Werbebild: glaubwürdig, redaktionell nutzbar und technisch sauber. Es soll eine Geschichte stützen, nicht überinszenieren.',
      'Genauso wichtig sind klare Nutzungsrechte und Formate. Ein gutes Medienkit liefert Portrait, Situativ und Detail in Auflösungen, die Print und Online abdecken.',
    ],
    sectionHeadline: 'Glaubwürdig, klar,',
    sectionEmphasis: 'freigegeben.',
    sectionLead:
      'Diese Seite richtet sich an PR, Kommunikation und Personen des öffentlichen Lebens, die verlässliches, redaktionstaugliches Bildmaterial brauchen.',
    cards: [
      { label: 'Portrait', title: 'Pressebild Person', text: 'Repräsentatives, glaubwürdiges Portrait für Pressemitteilung und Profil.' },
      { label: 'Situativ', title: 'Im Kontext', text: 'Person in Arbeits- oder Anlasssituation - redaktionell statt gestellt.' },
      { label: 'Kit', title: 'Medienkit', text: 'Mehrere Motive und Formate als fertiger Satz für Redaktionen.' },
      { label: 'Rechte', title: 'Klare Freigabe', text: 'Nutzungsrechte und Bildunterschriften werden eindeutig geregelt.' },
    ],
    processHeadline: 'Ablauf für Pressefotos.',
    processLead:
      'Vor dem Termin werden Anlass, Verwendung und Rechte geklärt, damit das Material später ohne Rückfragen einsatzbereit ist.',
    processSteps: [
      { title: 'Anlass klären', text: 'Pressemitteilung, Medienkit oder Bericht bestimmen Motive und Tonalität.' },
      { title: 'Motive planen', text: 'Portrait, Situativ und Detail werden so geplant, dass Redaktionen Auswahl haben.' },
      { title: 'Redaktionell fotografieren', text: 'Die Bildsprache bleibt glaubwürdig und vermeidet überzogene Werbeoptik.' },
      { title: 'Auflösungen liefern', text: 'Print- und Online-Formate werden getrennt bereitgestellt.' },
      { title: 'Rechte dokumentieren', text: 'Nutzungsfreigabe und Credits werden klar mitgeliefert.' },
    ],
    relatedLead:
      'Pressefoto ist die redaktionell ausgerichtete Seite. Für reine Profilbilder passt Business Portrait oder Headshot, für laufende Marke Personal Branding.',
  },
  fahrzeugfotografie: {
    heroLead:
      'Fahrzeugfotografie ist der Sortierpunkt für Auto, Sportwagen, Oldtimer, Motorrad, Händlerbestand und Verkaufsbilder. Die Seite führt nicht in eine Einheitsleistung, sondern in den passenden Bildansatz nach Fahrzeugart, Zweck und Ausgabeformat.',
    metaDescription:
      'Fahrzeugfotografie für Auto, Sportwagen, Oldtimer, Motorrad, Händlerbestand und Verkauf. Saubere Bildserien nach Fahrzeugart und Nutzung.',
    contactLead:
      'Schreibe kurz, welches Fahrzeug oder welcher Bestand fotografiert werden soll, ob es um Verkauf, Sammlung, Marke, Portal oder Editorial geht und welche Ausgabeformate gebraucht werden.',
    pullKicker: 'Fahrzeug-Cluster',
    pullHeadline: 'Erst Fahrzeugart klären,',
    pullEmphasis: 'dann fotografieren.',
    statementBody: [
      'Fahrzeugfotografie ist bewusst der neutrale Einstieg. Ein Motorrad braucht andere Blickachsen als ein Oldtimer, ein Händlerbestand andere Wiederholbarkeit als ein privates Sammlerfahrzeug.',
      'Deshalb führt diese Seite früh in die passenden Unterseiten: Automobil, Sportwagen, Oldtimer, Motorrad, Autohaus-Fotografie und Autoverkauf-Fotos. So bleibt der Suchintent sauber, statt alles unter einem generischen Angebot zu stapeln.',
    ],
    sectionHeadline: 'Auto, Bike, Bestand,',
    sectionEmphasis: 'klar getrennt.',
    sectionLead:
      'Die Module beantworten nicht nur, was fotografiert wird, sondern warum der Bildansatz je nach Fahrzeugtyp und Nutzung unterschiedlich sein muss.',
    featureTitle: 'Keine Sammelseite ohne Richtung.',
    featureBody:
      'Der erste Schritt ist die Einordnung: einzelnes Fahrzeug, laufender Bestand, Verkauf, Sammlung, Marke oder redaktionelle Strecke. Daraus ergeben sich Licht, Perspektiven, Bildliste und Lieferformat.',
    galleryHeadline: 'Fahrzeugarten als Bildlogik.',
    galleryLead:
      'Die Beispiele stehen für unterschiedliche Aufgaben: Lack und Linie, Innenraum, Detail, Zustand, Bewegung und Material.',
    audienceHeadline: 'Fahrzeugfotografie für klare Fälle.',
    audienceLead:
      'Wer noch nicht weiss, welche Spezialseite passt, findet hier die richtige Richtung ohne Umweg über ein generisches Portfolio.',
    cards: [
      { label: 'Auto', title: 'Automobil', text: 'Fahrzeugserien für Privat, Marke, Verkauf und Showroom mit Exterieur, Interieur und Details.' },
      { label: 'Sport', title: 'Sportwagen', text: 'Präzise Bildsprache für Performance, Linien, Innenraum und hochwertige Verkaufs- oder Sammlungsbilder.' },
      { label: 'Historisch', title: 'Oldtimer', text: 'Ruhige Dokumentation von Herkunft, Patina, Chrom, Leder und Zustand für Sammlung, Auktion oder Verkauf.' },
      { label: 'Bike', title: 'Motorrad', text: 'Silhouette, Mechanik, Fahrerbezug und Custom-Details als eigene Bildwelt statt Auto-Logik.' },
      { label: 'Bestand', title: 'Händler & Verkauf', text: 'Wiederholbare Bildsätze für Portal, Inserat, Flotte oder Autohaus mit klarer Dateistruktur.' },
    ],
    processHeadline: 'Ablauf für Fahrzeugfotografie.',
    processLead:
      'Der Ablauf beginnt mit der Einordnung des Fahrzeugs und endet mit Dateien, die zum geplanten Kanal passen.',
    processSteps: [
      { title: 'Fahrzeugart klären', text: 'Auto, Sportwagen, Oldtimer, Motorrad oder Bestand werden getrennt eingeordnet.' },
      { title: 'Nutzung bestimmen', text: 'Verkauf, Sammlung, Marke, Editorial oder Portal entscheiden über Umfang und Stil.' },
      { title: 'Bildliste bauen', text: 'Exterieur, Innenraum, Details, Zustand und Spezialmotive werden vorab festgelegt.' },
      { title: 'Location planen', text: 'Showroom, Aussenort, Industrie, Rheinraum oder Studio werden nach Fahrzeug und Licht gewählt.' },
      { title: 'Formate liefern', text: 'Web, Portal, Social, Print oder Druck bekommen passende Auflösungen und Beschnitte.' },
    ],
    relatedLead:
      'Fahrzeugfotografie ist der Verteiler im Fahrzeug-Cluster. Die Seite soll Nutzer in Automobil, Sportwagen, Oldtimer, Motorrad, Autohaus-Fotografie oder Autoverkauf-Fotos weiterführen.',
  },
  'autohaus-fotografie': {
    heroLead:
      'Autohaus Fotografie ist auf Bestand, Showroom und Fahrzeugportale ausgelegt: gleiche Perspektiven, gleicher Lichtstandard, klare Dateistruktur und schnelle Ablaufe für viele Fahrzeuge.',
    metaDescription:
      'Autohaus Fotografie für Bestand, Showroom und Fahrzeugportale. Konsistente Bildsätze für Händler, Gebrauchtwagenzentren und Flotten.',
    contactLead:
      'Schreibe kurz, wie viele Fahrzeuge fotografiert werden sollen, wo der Bestand steht, welche Portal- oder Websiteformate gebraucht werden und ob ein wiederkehrender Ablauf geplant ist.',
    pullKicker: 'Händlerbestand',
    pullHeadline: 'Viele Fahrzeuge,',
    pullEmphasis: 'eine Bildlogik.',
    statementBody: [
      'Autohaus Fotografie ist kein einzelnes Auto-Shooting. Entscheidend ist, dass zehn, zwanzig oder fünfzig Fahrzeuge visuell zusammenpassen und trotzdem jedes Fahrzeug sauber lesbar bleibt.',
      'Dafür werden Perspektivenfolge, Stellfläche, Lichtfenster und Dateibenennung vorab definiert. Das Ergebnis ist ein Bestand, der auf Website, mobile.de, AutoScout24 und im Showroom konsistent wirkt.',
    ],
    sectionHeadline: 'Bestand, Showroom,',
    sectionEmphasis: 'Portal.',
    sectionLead:
      'Diese Seite trennt Händlerbedarf klar von privaten Fahrzeugshootings: Wiederholbarkeit und Geschwindigkeit sind Teil der Leistung.',
    featureTitle: 'Serienproduktion mit fotografischem Standard.',
    featureBody:
      'Aussenansichten, Innenraum, Details und Zustandsbilder folgen einer festen Reihenfolge. So bleibt der Ablauf vor Ort schlank und das Ergebnis vergleichbar.',
    galleryHeadline: 'Autohaus-Fotografie als Bestandssystem.',
    galleryLead:
      'Die Bildtypen zeigen, wie ein Händlerbestand strukturiert werden kann: Front, Seite, Heck, Innenraum, Ausstattung und Detail.',
    audienceHeadline: 'Autohaus Fotografie für wiederkehrenden Bedarf.',
    audienceLead:
      'Geeignet für Betriebe, die nicht jedes Fahrzeug neu erfinden, sondern ihren Bestand visuell sauber führen wollen.',
    cards: [
      { label: 'Bestand', title: 'Autohäuser', text: 'Laufende Bestandsfahrzeuge mit gleicher Perspektive, Lichtstimmung und portalfertiger Ausgabe.' },
      { label: 'Gebraucht', title: 'Gebrauchtwagenzentren', text: 'Viele Fahrzeuge in kurzer Zeit, mit klarer Reihenfolge und einheitlicher Dateibenennung.' },
      { label: 'Showroom', title: 'Ausstellung', text: 'Fahrzeuge im Raum, Showroom-Licht und Architektur als Teil der Verkaufswirkung.' },
      { label: 'Flotte', title: 'Leasing & Rückläufer', text: 'Zustandsnahe Dokumentation für Weitervermarktung, Übergabe und interne Systeme.' },
      { label: 'Marketing', title: 'Aktionen & Kampagnen', text: 'Highlight-Fahrzeuge als separate Motive für Website, Social, Print und saisonale Angebote.' },
    ],
    processHeadline: 'Ablauf für Autohaus Fotografie.',
    processLead:
      'Je klarer die Fahrzeugliste vorbereitet ist, desto konsistenter und schneller entsteht der fertige Bestand.',
    processSteps: [
      { title: 'Bestandsliste', text: 'Fahrzeuge, Prioritäten, Kennzeichen oder interne Codes werden vorab sortiert.' },
      { title: 'Bildschema', text: 'Exterieur, Interieur, Details und Zustandsbilder bekommen eine feste Reihenfolge.' },
      { title: 'Stellfläche', text: 'Showroom, Hof oder neutraler Ort werden nach Licht, Hintergrund und Ablauf gewählt.' },
      { title: 'Produktion', text: 'Die Fahrzeuge laufen seriell durch denselben Bildstandard.' },
      { title: 'Ausgabe', text: 'Dateien werden web- und portalfertig geliefert, auf Wunsch benannt nach Bestandscode.' },
    ],
    relatedLead:
      'Autohaus Fotografie ist die Händlerseite im Automobil-Cluster. Private Verkaufsbilder liegen bei Autoverkauf-Fotos, breitere Markenarbeit bei Automotive Fotografie.',
  },
  'autoverkauf-fotos': {
    heroLead:
      'Autoverkauf Fotos sind auf Vertrauen ausgelegt: Zustand, Ausstattung, Innenraum, Lack, Felgen und relevante Details müssen ehrlich lesbar sein, damit ein Inserat weniger Rückfragen und bessere Anfragen bekommt.',
    metaDescription:
      'Autoverkauf Fotos für Inserate, Auktionen und Fahrzeugportale. Ehrliche Bildsätze für Zustand, Ausstattung, Innenraum und Details.',
    contactLead:
      'Schreibe kurz, welches Fahrzeug verkauft werden soll, auf welchem Portal oder in welchem Auktionskontext es erscheint und welche Details besonders wichtig sind.',
    pullKicker: 'Verkaufsbilder',
    pullHeadline: 'Zeigen, was Käufer',
    pullEmphasis: 'wissen wollen.',
    statementBody: [
      'Gute Autoverkauf Fotos sind nicht nur schön. Sie beantworten Fragen, bevor sie gestellt werden: Zustand, Ausstattung, Pflege, Lack, Innenraum, Reifen, Felgen und besondere Merkmale.',
      'Die Bildserie bleibt deshalb näher am Inserat als an der Kampagne. Sie soll Vertrauen schaffen, nicht ein Fahrzeug in eine fremde Luxuswelt verschieben.',
    ],
    sectionHeadline: 'Inserat, Auktion,',
    sectionEmphasis: 'Vertrauen.',
    sectionLead:
      'Diese Seite bedient den klaren Verkaufsintent und grenzt sich von Autohaus-Fotografie und privaten Erinnerungs-Shootings ab.',
    featureTitle: 'Ehrlich statt überinszeniert.',
    featureBody:
      'Ein Verkaufsbild muss Zustand und Wertigkeit zeigen. Licht, Winkel und Detailauswahl werden so gewählt, dass Interessenten das Fahrzeug realistisch einschätzen können.',
    galleryHeadline: 'Bildliste für den Verkauf.',
    galleryLead:
      'Ein guter Bildsatz umfasst Totale, Seitenansichten, Innenraum, Ausstattung, Kilometerstand, Felgen, Lackdetails und relevante Besonderheiten.',
    audienceHeadline: 'Autoverkauf Fotos für konkrete Verkaufsfälle.',
    audienceLead:
      'Die Seite richtet sich an private Verkäufer, kleine Händler und Sammler, die ein Fahrzeug ernsthaft und nachvollziehbar anbieten wollen.',
    cards: [
      { label: 'Privat', title: 'Privatverkauf', text: 'Ein Fahrzeug wird als vollständiger, sauberer Bildsatz für Portal oder Kleinanzeige vorbereitet.' },
      { label: 'Auktion', title: 'Auktionsfahrzeug', text: 'Zustand, Ausstattung und Details werden für Katalog, Plattform oder Expose nachvollziehbar gezeigt.' },
      { label: 'Sammler', title: 'Oldtimer & Youngtimer', text: 'Patina, Originalteile, Innenraum und besondere Merkmale werden ohne Hochglanz-Verfaelschung dokumentiert.' },
      { label: 'Flotte', title: 'Rückgabe & Firmenwagen', text: 'Zustandsbilder helfen bei Übergabe, Weiterverkauf und interner Dokumentation.' },
      { label: 'Portal', title: 'mobile.de & AutoScout24', text: 'Beschnitte, Auflösungen und Dateistruktur werden auf die Plattform vorbereitet.' },
    ],
    processHeadline: 'Ablauf für Autoverkauf Fotos.',
    processLead:
      'Der Ablauf ist kompakt und auf schnelle Nutzbarkeit ausgerichtet.',
    processSteps: [
      { title: 'Verkaufsziel klären', text: 'Portal, Auktion, Expose oder Direktverkauf bestimmen Bildanzahl und Detailtiefe.' },
      { title: 'Fahrzeug vorbereiten', text: 'Innenraum, Lack und relevante Dokumentationspunkte werden vorab sortiert.' },
      { title: 'Bildliste fotografieren', text: 'Exterieur, Innenraum, Details und Zustand entstehen nach klarer Reihenfolge.' },
      { title: 'Bearbeiten', text: 'Die Bilder werden realistisch korrigiert, ohne Zustand oder Farbe zu verfremden.' },
      { title: 'Insertbereit liefern', text: 'Die Dateien kommen in passenden Formaten für Portal, Web und Weitergabe.' },
    ],
    relatedLead:
      'Autoverkauf Fotos ist die Verkaufsseite. Für regelmäßigen Händlerbestand passt Autohaus Fotografie, für emotionale Serien Auto-Fotoshooting.',
  },
  landschaftsbilder: {
    heroLead:
      'Landschaftsbilder kaufen bedeutet: Motiv, Format, Material und Raumwirkung zusammen entscheiden. Die Seite führt von der Bildauswahl bis zu Fine-Art-Papier, Alu-Dibond, Acrylglas, Edition und Lieferung.',
    metaDescription:
      'Landschaftsbilder kaufen als Fine-Art-Print, Wandbild oder Edition. Beratung zu Motiv, Format, Material, Raumwirkung und Lieferung.',
    contactLead:
      'Schreibe kurz, für welchen Raum das Landschaftsbild gedacht ist, welche Wandgröße oder Atmosphäre passt und ob Papier, Dibond, Acrylglas oder Beratung offen ist.',
    pullKicker: 'Bildkauf',
    pullHeadline: 'Ein Motiv muss',
    pullEmphasis: 'im Raum tragen.',
    statementBody: [
      'Ein Landschaftsbild wirkt nicht allein durch das Motiv. Größe, Betrachtungsabstand, Wandfarbe, Raumlicht und Material entscheiden, ob ein Print ruhig, schwer, offen oder zu dominant wirkt.',
      'Deshalb ist diese Seite als Kauf- und Beratungsseite formuliert: Motivauswahl, Format, Material, Edition, Produktion und Lieferung werden gemeinsam betrachtet.',
    ],
    sectionHeadline: 'Motiv, Format,',
    sectionEmphasis: 'Material.',
    sectionLead:
      'Die Seite ist keine lokale Shooting-Seite, sondern ein Einstieg in den Kauf fertiger Landschaftsfotografie als Objekt.',
    featureTitle: 'Vom Bildschirm an die Wand.',
    featureBody:
      'Vor dem Druck wird geklärt, wie gross das Bild wirken darf, welches Material zur Oberfläche passt und ob ein einzelnes Motiv oder eine kleine Serie sinnvoller ist.',
    galleryHeadline: 'Landschaftsbilder als Raumobjekte.',
    galleryLead:
      'Die Motive werden nicht nur nach Schönheit, sondern nach Ruhe, Tonwert, Tiefe und Materialtauglichkeit ausgewählt.',
    audienceHeadline: 'Landschaftsbilder kaufen für konkrete Räume.',
    audienceLead:
      'Wer ein Bild für Wohnung, Praxis, Kanzlei, Hotel oder Geschenk sucht, bekommt hier eine klarere Entscheidungshilfe als in einem allgemeinen Portfolio.',
    cards: [
      { label: 'Privat', title: 'Wohnraum', text: 'Motiv und Format werden auf Wand, Licht, Abstand und vorhandene Einrichtung abgestimmt.' },
      { label: 'Praxis', title: 'Praxis & Kanzlei', text: 'Ruhige Naturmotive als hochwertiger Gegenpol zu dichter Arbeitsumgebung.' },
      { label: 'Hotel', title: 'Objekt & Serie', text: 'Mehrere Prints können als zusammenhängende Ausstattung für Flur, Lobby oder Suite geplant werden.' },
      { label: 'Geschenk', title: 'Edition', text: 'Ein signierter Print mit Motivwahl, Formatberatung und sauberer Ausführung.' },
      { label: 'Lizenz', title: 'Gewerbliche Nutzung', text: 'Bei Bedarf werden Motivlizenzen für Website, Broschüre oder Markenkommunikation geklärt.' },
    ],
    processHeadline: 'Ablauf beim Kauf eines Landschaftsbildes.',
    processLead:
      'Der Kauf folgt nicht dem Warenkorb-Prinzip, sondern einer kurzen Abstimmung zu Motiv, Raum und Material.',
    processSteps: [
      { title: 'Raum beschreiben', text: 'Wandgröße, Licht, Nutzung und gewünschte Stimmung werden eingeordnet.' },
      { title: 'Motiv wählen', text: 'Passende Landschaften werden nach Tonwert, Ruhe und Wirkung vorgeschlagen.' },
      { title: 'Material entscheiden', text: 'Fine-Art-Papier, Dibond, Acrylglas oder Rahmung werden nach Raumwirkung gewählt.' },
      { title: 'Produktion freigeben', text: 'Format, Auflage und Ausführung werden vor dem Druck bestätigt.' },
      { title: 'Liefern', text: 'Das fertige Bild wird sicher verpackt und mit relevanten Angaben übergeben.' },
    ],
    relatedLead:
      'Landschaftsbilder kaufen ist die Kaufseite im Landschafts-Cluster. Fine-Art-Prints, Wandbilder und Naturfotografie-Prints vertiefen Material und Nutzung.',
  },
  'wandbilder-landschaftsfotografie': {
    heroLead:
      'Wandbilder Landschaftsfotografie sind für Räume geplant: Format, Material, Licht, Betrachtungsabstand und Montage entscheiden mehr als ein einzelnes Vorschaubild.',
    metaDescription:
      'Wandbilder Landschaftsfotografie für Wohnraum, Praxis, Büro und Hotel. Materialberatung für Leinwand, Acrylglas, Alu-Dibond und Fine-Art-Print.',
    contactLead:
      'Schreibe kurz, welche Wand oder welcher Raum ausgestattet werden soll, ungefähre Masse, Lichtverhältnisse und ob ein einzelnes Wandbild oder eine Serie geplant ist.',
    pullKicker: 'Wandbild-Planung',
    pullHeadline: 'Grossformat braucht',
    pullEmphasis: 'Raumgefühl.',
    statementBody: [
      'Ein Wandbild aus Landschaftsfotografie muss aus mehreren Metern Entfernung funktionieren und aus der Nähe sauber bleiben. Motivruhe, Kanten, Tonwerte und Material werden deshalb vor der Produktion zusammen entschieden.',
      'Die Seite ist auf Raumwirkung ausgelegt: Wohnraum, Büro, Praxis, Hotel oder Showroom haben unterschiedliche Anforderungen an Größe, Glanz, Gewicht und Montage.',
    ],
    sectionHeadline: 'Wand, Abstand,',
    sectionEmphasis: 'Material.',
    sectionLead:
      'Diese Seite unterscheidet Wandbilder klar von kleineren Fine-Art-Prints und von reiner Bildauswahl.',
    featureTitle: 'Nicht jedes Motiv gehört gross an die Wand.',
    featureBody:
      'Grossformate brauchen ruhige Kompositionen, saubere Daten, passende Oberflächen und eine Montage, die zum Raum passt.',
    galleryHeadline: 'Wandbilder nach Raumwirkung.',
    galleryLead:
      'Die Bildauswahl zeigt Motive, die als grossformatige Flächen funktionieren: Weite, Ruhe, Tiefe und klare Tonwerte.',
    audienceHeadline: 'Wandbilder für Räume mit Anspruch.',
    audienceLead:
      'Die Seite richtet sich an Menschen und Betriebe, die nicht Deko suchen, sondern ein Bildobjekt für eine konkrete Fläche.',
    cards: [
      { label: 'Wohnung', title: 'Wohnraum', text: 'Ein Grossformat als ruhiger Mittelpunkt oder Gegenpol zu vorhandener Einrichtung.' },
      { label: 'Praxis', title: 'Wartebereich', text: 'Naturmotive, die Ruhe schaffen, ohne beliebige Kalenderoptik zu erzeugen.' },
      { label: 'Büro', title: 'Kanzlei & Agentur', text: 'Wandbilder für Empfang, Besprechungsraum oder Arbeitsbereich mit klarer Materialwirkung.' },
      { label: 'Hotel', title: 'Objektserie', text: 'Mehrere Motive als zusammenhängende Bildstrecke für Lobby, Flur und Zimmer.' },
      { label: 'Montage', title: 'Ausführung', text: 'Format, Träger, Gewicht und Hängung werden vor Produktion mitgedacht.' },
    ],
    processHeadline: 'Ablauf für Landschafts-Wandbilder.',
    processLead:
      'Der Prozess beginnt beim Raum, nicht beim Format.',
    processSteps: [
      { title: 'Wand prüfen', text: 'Masse, Licht, Abstand und Umgebung werden kurz eingeordnet.' },
      { title: 'Motiv vorschlagen', text: 'Auswahl nach Ruhe, Bildtiefe, Tonwert und gewünschter Stimmung.' },
      { title: 'Material wählen', text: 'Leinwand, Fine-Art-Papier, Dibond oder Acrylglas werden passend zum Raum verglichen.' },
      { title: 'Druck vorbereiten', text: 'Daten, Beschnitt und Proof werden für das gewählte Format kontrolliert.' },
      { title: 'Lieferung planen', text: 'Verpackung, Montagehinweis und Übergabe werden nach Format abgestimmt.' },
    ],
    relatedLead:
      'Wandbilder Landschaftsfotografie vertieft die Raum- und Materialfrage. Landschaftsbilder kaufen bleibt der breitere Einstieg, Fine-Art-Prints erklären die Papierseite.',
  },
}

const keywordFaqs: Record<string, Array<{ q: string; a: string }>> = {
  'automobil-fotografie': [
    { q: 'Was kostet ein Automobil-Fotoshooting?', a: 'Der Preis richtet sich nach Umfang: Anzahl der Fahrzeuge, gewünschte Bildtypen (Exterieur, Interieur, Detail, Cinematic), Location und Nutzung. Du bekommst vorab ein klares Angebot statt eines Pauschalpreises.' },
    { q: 'Wo findet das Shooting statt?', a: 'In Düsseldorf, im Umland oder an einer passenden Location in NRW. Ort und Lichtfenster werden nach Fahrzeug und gewünschter Wirkung gemeinsam festgelegt.' },
    { q: 'Kann ich mein eigenes Fahrzeug mitbringen?', a: 'Ja. Die meisten Serien entstehen mit dem Fahrzeug des Kunden – vom privaten Liebhaberstück bis zum Händler- oder Markenfahrzeug.' },
    { q: 'Wofür sind die Bilder nutzbar?', a: 'Für Verkauf und Inserat, Website und Social Media, Showroom, Editorial und Kampagne. Formate und Auflösung werden auf die geplante Nutzung abgestimmt.' },
  ],
  'sportwagen-fotografie': [
    { q: 'Worin unterscheidet sich Sportwagen- von allgemeiner Automobilfotografie?', a: 'Sportwagen brauchen Präzision statt Effekt: niedrige Blickachsen, kontrollierte Reflexe und Details, die Leistung sichtbar machen. Die Bildsprache bleibt ruhig und hochwertig statt reißerisch.' },
    { q: 'Wo wird fotografiert?', a: 'In Düsseldorf und NRW, je nach Wagen an ruhiger Location, in Architektur oder Halle. Ort und Tageszeit werden auf Lack, Form und Reflexe abgestimmt.' },
    { q: 'Eignen sich die Bilder für Verkauf oder Sammlung?', a: 'Ja. Eine Serie funktioniert für Verkauf und Inserat genauso wie als Sammlungs- oder Markendokumentation.' },
    { q: 'Was kostet ein Sportwagen-Shooting?', a: 'Nach Umfang – Fahrzeuganzahl, Bildtypen, Location und Nutzung. Du erhältst vorab ein konkretes Angebot.' },
  ],
  'oldtimer-fotografie': [
    { q: 'Wie werden Oldtimer fotografiert?', a: 'Mit Ruhe und Abstand. Lack, Chrom, Leder und Patina werden bewusst geführt – ehrlich und ohne Effekt-Pose, damit Charakter und Zustand lesbar bleiben.' },
    { q: 'Eignen sich die Bilder für Auktion oder Verkauf?', a: 'Ja. Exterieur, Interieur, Material- und Detailaufnahmen dokumentieren Herkunft und Zustand für Auktion, Inserat, Versicherung oder Sammlung.' },
    { q: 'Wo findet das Shooting statt?', a: 'In Düsseldorf, im Umland oder an einer passenden Bühne in NRW. Für empfindliche Fahrzeuge wird die Logistik vorab geklärt.' },
    { q: 'Was kostet eine Oldtimer-Serie?', a: 'Nach Umfang und Nutzung. Du bekommst vorab ein klares Angebot, abgestimmt auf Fahrzeug und Verwendungszweck.' },
  ],
  'motorrad-fotografie': [
    { q: 'Wird mit oder ohne Fahrer fotografiert?', a: 'Beides. Das Bike pur (Silhouette, Mechanik, Detail) oder mit Fahrerbezug als Haltung – je nach gewünschter Wirkung und Nutzung.' },
    { q: 'Fotografierst du auch Custom Bikes?', a: 'Ja. Umbauten, Details und Lackierung werden so in Szene gesetzt, dass die handwerkliche Arbeit sichtbar wird.' },
    { q: 'Sind Verkaufsfotos möglich?', a: 'Ja. Saubere Stand-, Detail- und Innenaufnahmen unterstützen Inserat und Verkauf.' },
    { q: 'Was kostet ein Motorrad-Shooting?', a: 'Nach Umfang – Maschine, Bildtypen, Fahrerbilder und Location. Vorab gibt es ein konkretes Angebot.' },
  ],
  'portraitfotografie': [
    { q: 'Machst du Passbilder oder Bewerbungsfotos?', a: 'Keine klassischen Passbilder. Es geht um professionelle Portraits mit Haltung – für Profil, Personal Branding, Editorial, Paar oder Familie.' },
    { q: 'Findet das Shooting indoor oder outdoor statt?', a: 'Beides ist möglich. Ort, Licht und Hintergrund werden auf Person, Nutzung und gewünschte Stimmung abgestimmt – on location, draußen oder in ruhiger Umgebung.' },
    { q: 'Wie läuft die Bildauswahl ab?', a: 'Du bekommst eine kuratierte Vorauswahl als Galerie und entscheidest, welche Motive final – zurückhaltend – retuschiert werden.' },
    { q: 'Was kostet ein Portrait-Shooting?', a: 'Nach Umfang: Dauer, Anzahl der Bilder, Personen und Nutzung. Vorab erhältst du ein klares Angebot.' },
  ],
  'landschaftsfotografie': [
    { q: 'Kann ich Bilder als Print oder Wandbild kaufen?', a: 'Ja. Die Landschaftsarbeiten sind als Fine-Art-Print, Wandbild oder limitierte Edition erhältlich – kuratiert und passend zum Raum.' },
    { q: 'Welche Materialien gibt es?', a: 'Fine-Art-Papier, Aluminium-Dibond und Acrylglas. Das Material wird nach Motiv, Raum und gewünschter Wirkung empfohlen.' },
    { q: 'Welche Formate und Größen sind möglich?', a: 'Von kleineren Editionen bis zu großformatigen Arbeiten. Format und Größe werden auf Raum und Betrachtungsabstand abgestimmt.' },
    { q: 'Wie läuft die Bestellung ab?', a: 'Nach Anfrage werden Motiv, Material, Format und Lieferung geklärt; die Fertigung erfolgt sauber und auf Bestellung.' },
  ],
  'business-portrait': [
    { q: 'Was ist der Unterschied zwischen Business Portrait und Bewerbungsfoto?', a: 'Ein Business Portrait ist kein Passbild. Es transportiert Kompetenz und Wiedererkennung für Website, LinkedIn, Presse und Team – hochwertiger und vielseitiger als ein klassisches Bewerbungsfoto.' },
    { q: 'Können mehrere Personen oder ein ganzes Team fotografiert werden?', a: 'Ja. Auch größere Teams werden in einem effizienten Ablauf mit gleichbleibender Bildsprache fotografiert.' },
    { q: 'Bekomme ich Bilder für Website und LinkedIn?', a: 'Ja. Die Portraits werden in passenden Ausschnitten und Formaten für Website, LinkedIn, Presse und Print geliefert.' },
    { q: 'Wo findet das Shooting statt?', a: 'Im Unternehmen, on location oder in ruhiger Umgebung in Düsseldorf und NRW – je nach gewünschter Wirkung.' },
  ],
  'headshot-fotograf': [
    { q: 'Was ist ein Headshot?', a: 'Der enge, fokussierte Portraitausschnitt: Gesicht, Blick und Ausdruck stehen im Mittelpunkt – ideal für LinkedIn, Profile, Teamseiten und Bewerbungen.' },
    { q: 'Bekommt ein ganzes Team denselben Look?', a: 'Ja. Licht, Hintergrund und Ausschnitt bleiben über alle Personen konsistent, damit die Teamseite zusammenhängt.' },
    { q: 'Eignet sich ein Headshot als Bewerbungsbild?', a: 'Ja – moderner und natürlicher als ein klassisches Passbild, aber genauso professionell.' },
    { q: 'Wie schnell geht ein Headshot-Termin?', a: 'Der Ablauf ist kompakt. Einzelpersonen sind schnell fertig, Teams werden effizient nacheinander fotografiert.' },
  ],
  'personal-branding-fotografie': [
    { q: 'Was ist Personal Branding Fotografie?', a: 'Eine zusammenhängende Bildwelt aus Portraits, Arbeitssituationen und Umfeld – statt eines einzelnen Profilbilds. Material für Website, Social Media und Angebote.' },
    { q: 'Wie viele Looks oder Bilder entstehen?', a: 'Nach Bedarf. Geplant wird eine Motivliste mit verschiedenen Looks und Orten, damit über Monate genug Varianten vorhanden sind.' },
    { q: 'Für wen ist das geeignet?', a: 'Für Selbstständige, Founder, Coaches, Speaker und Experten, die selbst Teil ihrer Marke sind.' },
    { q: 'Wie planen wir die Motive?', a: 'Vor dem Shooting steht ein kleiner Content-Plan aus Positionierung, Themen, Orten und Formaten – so entsteht ein nutzbarer Bildvorrat statt Zufall.' },
  ],
  'unternehmensportrait': [
    { q: 'Können viele Mitarbeitende an einem Tag fotografiert werden?', a: 'Ja. Mit festem Setup-Punkt und klarem Zeitplan werden auch große Teams in ruhigen Slots nacheinander fotografiert.' },
    { q: 'Findet das Shooting vor Ort im Unternehmen statt?', a: 'In der Regel ja. Vor Ort lassen sich Arbeitsumgebung und Räume als Teil des Unternehmensbildes nutzen; on location ist ebenfalls möglich.' },
    { q: 'Lassen sich neue Mitarbeitende später ergänzen?', a: 'Ja. Licht, Hintergrund und Ausschnitt sind dokumentiert, sodass spätere Aufnahmen im gleichen Look entstehen.' },
    { q: 'Wofür werden die Bilder genutzt?', a: 'Für Website, Recruiting, Teamseite, Presse und Bericht – benannt und geliefert pro Person.' },
  ],
  'pressefoto': [
    { q: 'Was macht ein gutes Pressefoto aus?', a: 'Es ist glaubwürdig, redaktionell nutzbar und technisch sauber. Es stützt eine Geschichte, statt wie Werbung zu überinszenieren.' },
    { q: 'Bekomme ich klare Nutzungsrechte?', a: 'Ja. Nutzungsfreigabe und Bildunterschriften werden eindeutig geregelt, damit Redaktionen das Material ohne Rückfragen verwenden können.' },
    { q: 'Welche Formate werden geliefert?', a: 'Print- und Online-Auflösungen getrennt, auf Wunsch als Medienkit mit Portrait, Situativ und Detail.' },
    { q: 'Was kostet ein Pressetermin?', a: 'Nach Anlass und Umfang. Du erhältst vorab ein klares Angebot, abgestimmt auf Verwendung und Lieferumfang.' },
  ],
}

export function keywordFocusCopyForSlug(value?: string | null): KeywordFocusCopy | null {
  const slug = normalizeLocalSeoSlug(value)
  const copies = { ...keywordFocusDefaults, ...keywordFocusCopies }
  const prefix = Object.keys(copies)
    .sort((a, b) => b.length - a.length)
    .find((entry) => slug === entry || slug.startsWith(`${entry}-`))

  if (!prefix) return null

  const defaults = keywordFocusDefaults[prefix]
  const custom = keywordFocusCopies[prefix]
  const faq = keywordFaqs[prefix]

  const base = !defaults
    ? custom
    : !custom
      ? defaults
      : {
          ...defaults,
          ...custom,
          cards: custom.cards || defaults.cards,
          processSteps: custom.processSteps || defaults.processSteps,
          statementBody: custom.statementBody || defaults.statementBody,
        }

  if (!base) return faq ? { faq } : null
  const cleanCardLabel = (label = '') => label.replace(/^\s*\d+\s*(?:\/|·|-)\s*/, '').trim()
  const cleaned = {
    ...base,
    cards: base.cards?.map((card) => ({ ...card, label: cleanCardLabel(card.label) || card.label })),
  }
  return faq ? { ...cleaned, faq } : cleaned
}

const visual = (
  image: string,
  alt: string,
  width: number,
  height: number,
  extra: Pick<VisualItem, 'className' | 'label' | 'title' | 'text'> = {},
): VisualItem => ({ image, alt, width, height, ...extra })

const previewImages: Record<string, Pick<VisualItem, 'height' | 'image' | 'width'>> = {
  '/assets/optimized/assets-photos-automobil-neon-1920.webp': { image: '/assets/optimized/assets-photos-automobil-neon-960.webp', width: 960, height: 640 },
  '/assets/optimized/assets-photos-automobil-sunset-1920.webp': { image: '/assets/optimized/assets-photos-automobil-sunset-960.webp', width: 960, height: 640 },
  '/assets/optimized/assets-photos-landschaft-1920.webp': { image: '/assets/optimized/assets-photos-landschaft-720.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-photos-motorrad-1920.webp': { image: '/assets/optimized/assets-photos-motorrad-720.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-photos-motorrad-duke-1920.webp': { image: '/assets/optimized/assets-photos-motorrad-duke-720.webp', width: 720, height: 1280 },
  '/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp': { image: '/assets/optimized/assets-photos-motorrad-ninja-road-720.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-photos-oldtimer-stage-1920.webp': { image: '/assets/optimized/assets-photos-oldtimer-stage-960.webp', width: 960, height: 640 },
  '/assets/photos/portrait-blue.webp': { image: '/assets/optimized/assets-photos-portrait-blue-720.webp', width: 720, height: 900 },
  '/assets/photos/portrait-warm.webp': { image: '/assets/optimized/assets-photos-portrait-warm-720.webp', width: 720, height: 1152 },
  '/assets/optimized/assets-portfolio-20250327-dsc01550-1920.webp': { image: '/assets/portfolio/thumbs/20250327-DSC01550.webp', width: 720, height: 1090 },
  '/assets/optimized/assets-portfolio-20250414-dsc00341-1920.webp': { image: '/assets/portfolio/thumbs/20250414-DSC00341.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portfolio-20250605-dsc03756-1920.webp': { image: '/assets/portfolio/thumbs/20250605-DSC03756.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portfolio-20250605-dsc03978-1920.webp': { image: '/assets/portfolio/thumbs/20250605-DSC03978.webp', width: 720, height: 960 },
  '/assets/optimized/assets-portfolio-20250605-dsc04020-1920.webp': { image: '/assets/portfolio/thumbs/20250605-DSC04020.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portfolio-dsc2986-1920.webp': { image: '/assets/portfolio/thumbs/_DSC2986.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3032_genErase (1).webp', width: 720, height: 480 },
  '/assets/optimized/assets-portfolio-dsc3878-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3878.webp', width: 720, height: 480 },
  '/assets/optimized/assets-portfolio-dsc3879-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3879.webp', width: 720, height: 480 },
  '/assets/optimized/assets-portfolio-dsc3892-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3892.webp', width: 720, height: 480 },
  '/assets/optimized/assets-portfolio-dsc3982-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3982.webp', width: 720, height: 480 },
  '/assets/optimized/assets-portfolio-dsc8032-1920.webp': { image: '/assets/portfolio/thumbs/_DSC8032.webp', width: 720, height: 900 },
  '/assets/optimized/assets-portfolio-wettberwerb-foto10-wunder-der-natur-1920.webp': { image: '/assets/portfolio/thumbs/Wettberwerb_Foto10_Wunder_der_natur.webp', width: 720, height: 448 },
  '/assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp': { image: '/assets/portfolio/thumbs/Wettberwerb_Foto5_Wunder_der_Natur2.webp', width: 720, height: 471 },
  '/assets/optimized/assets-portfolio-wettberwerb-foto6-wunder-der-natur-1920.webp': { image: '/assets/portfolio/thumbs/Wettberwerb_Foto6_Wunder_der_Natur.webp', width: 720, height: 520 },
  '/assets/optimized/assets-portraits-20250327-dsc01550-1920.webp': { image: '/assets/portfolio/thumbs/20250327-DSC01550.webp', width: 720, height: 1090 },
  '/assets/optimized/assets-portraits-20250605-dsc04020-1920.webp': { image: '/assets/portfolio/thumbs/20250605-DSC04020.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portraits-dsc2310-1920.webp': { image: '/assets/portfolio/thumbs/_DSC2310.webp', width: 720, height: 480 },
  '/assets/optimized/assets-portraits-dsc2358-1920.webp': { image: '/assets/portfolio/thumbs/_DSC2358.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portraits-dsc2744-1920.webp': { image: '/assets/portfolio/thumbs/_DSC2744.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portraits-dsc2986-1920.webp': { image: '/assets/portfolio/thumbs/_DSC2986.webp', width: 720, height: 1080 },
  '/assets/optimized/assets-portraits-dsc3878-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3878.webp', width: 720, height: 480 },
  '/assets/optimized/assets-portraits-dsc3908-1920.webp': { image: '/assets/portfolio/thumbs/_DSC3908.webp', width: 720, height: 480 },
  '/assets/portfolio/_DSC0470-Enhanced-NR.webp': { image: '/assets/portfolio/thumbs/_DSC0470-Enhanced-NR.webp', width: 720, height: 1152 },
  '/assets/portfolio/_DSC9301-Enhanced-NR.webp': { image: '/assets/portfolio/thumbs/_DSC9301-Enhanced-NR.webp', width: 720, height: 900 },
  '/assets/portfolio/_DSC9321-Enhanced-NR.webp': { image: '/assets/portfolio/thumbs/_DSC9321-Enhanced-NR.webp', width: 720, height: 1080 },
  '/assets/portraits/_DSC0470-Enhanced-NR.webp': { image: '/assets/portfolio/thumbs/_DSC0470-Enhanced-NR.webp', width: 720, height: 1152 },
  '/assets/portraits/_DSC9301-Enhanced-NR.webp': { image: '/assets/portfolio/thumbs/_DSC9301-Enhanced-NR.webp', width: 720, height: 900 },
  '/assets/portraits/_DSC9321-Enhanced-NR.webp': { image: '/assets/portfolio/thumbs/_DSC9321-Enhanced-NR.webp', width: 720, height: 1080 },
}

export function localSeoPreviewVisual(item: VisualItem): VisualItem {
  const preview = previewImages[item.image]
  return preview ? { ...item, ...preview, fullImage: item.fullImage || item.image } : item
}

export const localSeoFamilyContent: Record<LocalSeoLayoutFamily, LocalSeoFamilyContent> = {
  automobil: {
    baseSlug: 'automobil-fotografie',
    contactLead: (scope, service) =>
      `Schreibe kurz, welches Fahrzeug für ${service} in ${scope.label} fotografiert werden soll, wo es steht, welche Wirkung die Bilder tragen sollen und ob die Serie privat, kommerziell oder als Kampagne genutzt wird. Wir klären Location, Licht und Ablauf gemeinsam vor dem ersten Klick.`,
    contactNoun: 'Automobil',
    family: 'automobil',
    gallery: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3032_genErase.webp', 'Automobil als ruhiges Exterieur-Motiv', 1920, 1280, { className: 'bg-t-hero', label: 'Showroom' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC2983.webp', 'Cockpit und Materialdetail im Fahrzeug', 1707, 2560, { className: 'bg-t-a', label: 'Interieur' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3023.webp', 'Felgen- und Bremsdetail', 1920, 1280, { className: 'bg-t-b', label: 'Detail' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC2831%20(1).webp', 'Cineastische Fahrzeugaufnahme', 1920, 1280, { className: 'bg-t-c', label: 'Cinematic' }),
    ],
    heroImages: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC2831%20(1).webp', 'Automobil Exterieur', 1920, 1280),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC2983.webp', 'Automobil Interieur', 1707, 2560),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3032_genErase.webp', 'Automobil Cinematic', 1920, 1280),
    ],
    introHeadline: 'Vom Inserat bis zur Kampagne.',
    introParagraphs: [
      'Klare Ansichten, kontrollierte Reflexe und eine Bildserie, die für Verkauf, Website, Social, Print und Kampagne funktioniert.',
      'Die lokale Seite nutzt die gleiche Art Direction wie die Automobil-Hauptseite und passt Text, Anfrage und SEO-Kontext auf den Ort an.',
    ],
    label: 'Automobil',
    moduleHeadline: 'Ein Bildsatz, vier Blickwinkel.',
    moduleLead: 'Exterieur, Interieur, Details und Cinematic greifen ineinander, damit aus dem Fahrzeug kein einzelnes Hero-Bild, sondern ein nutzbarer Bildsatz wird.',
    modules: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3032_genErase.webp', 'Automobil Exterieur', 1920, 1280, { title: 'Exterieur', text: 'Ruhige Linien, klare Flächen, kontrollierte Spiegelungen.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC2983.webp', 'Automobil Interieur', 1707, 2560, { title: 'Interieur', text: 'Cockpit, Material, Farbe und Nutzung bleiben lesbar.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3023.webp', 'Automobil Detail', 1920, 1280, { title: 'Details', text: 'Sicken, Felgen, Embleme und Oberflächen erzählen den Wert.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3086.webp', 'Automobil mit Lichtstimmung', 1920, 1280, { title: 'Cinematic', text: 'Stimmung für Kampagne, Editorial und Markenbild.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.automobil,
    related: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3032_genErase.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3982.webp', 'Sportwagenfotografie', 1920, 1280, { title: 'Sportwagen', label: '/sportwagen-fotografie.html' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250418-DSC00660.webp', 'Oldtimerfotografie', 1920, 1280, { title: 'Oldtimer', label: '/oldtimer-fotografie.html' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC6968.webp', 'Motorradfotografie', 1707, 2560, { title: 'Motorrad', label: '/motorrad-fotografie.html' }),
    ],
    searchLinks: [
      { href: '/auto-fotoshooting.html', label: 'Auto-Fotoshooting' },
      { href: '/bilder-mit-auto.html', label: 'Bilder mit Auto' },
      { href: '/fotoshooting-mit-auto.html', label: 'Fotoshooting mit Auto' },
      { href: '/automotive-fotografie.html', label: 'Automotive Fotografie' },
      { href: '/autofotografie.html', label: 'Autofotografie' },
      { href: '/fahrzeugfotografie.html', label: 'Fahrzeugfotografie' },
      { href: '/auto-fotografieren-tipps.html', label: 'Auto fotografieren Tipps' },
      { href: '/autohaus-fotografie.html', label: 'Autohaus Fotografie' },
      { href: '/autoverkauf-fotos-duesseldorf.html', label: 'Autoverkauf Fotos' },
    ],
    seoTitle: 'Automobilfotografie',
    serviceLabel: 'Automobil Fotografie',
  },
  sportwagen: {
    baseSlug: 'sportwagen-fotografie',
    contactLead: (scope, service) =>
      `Schreibe kurz, welcher Sportwagen für ${service} in ${scope.label} fotografiert werden soll, ob die Bilder für Verkauf, Sammlung, Marke oder Social genutzt werden und welches Zeitfenster möglich ist. Wir planen Licht, Ort und Ablauf gemeinsam.`,
    contactNoun: 'Sportwagen',
    family: 'sportwagen',
    gallery: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3982.webp', 'Sportwagen Exterieur', 1920, 1280, { className: 't1', label: 'Exterieur' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3908-1.webp', 'Sportwagen Cockpit', 1920, 1280, { className: 't2', label: 'Interieur' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3892-1.webp', 'Sportwagen Detail', 1920, 1280, { className: 't3', label: 'Detail' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC2110.webp', 'Sportwagen Cinematic', 1920, 1280, { className: 't6', label: 'Cinematic' }),
    ],
    heroImages: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3982.webp', 'Sportwagen Ganzansicht', 1920, 1280, { className: 'detail' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC2345-2.webp', 'Sportwagen Heckansicht', 1920, 1280, { className: 'full' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3908-1.webp', 'Sportwagen Interieur', 1920, 1280, { className: 'interior' }),
    ],
    introHeadline: 'Bilder mit Druckqualität.',
    introParagraphs: [
      'Sportwagen brauchen Präzision statt Effektfeuerwerk: niedrige Blickachsen, kontrollierte Reflexe und Details, die Leistung sichtbar machen.',
      'Die lokale Variante bleibt Teil derselben visuellen Familie und setzt Ort, Anlass und Anfrage-Kontext gezielt um.',
    ],
    label: 'Sportwagen',
    moduleHeadline: 'Das Auto, aus jedem Winkel.',
    moduleLead: 'Performance, Form, Innenraum und Details werden mit ruhiger Dramaturgie sichtbar.',
    modules: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3982.webp', 'Sportwagen Exterieur', 1920, 1280, { title: 'Exterieur', text: 'Vollformatige Außenaufnahmen mit sauberer Linienführung.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3908-1.webp', 'Sportwagen Interieur', 1920, 1280, { title: 'Interieur', text: 'Cockpit, Sitze, Material und Atmosphäre.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3892-1.webp', 'Sportwagen Detail', 1920, 1280, { title: 'Details', text: 'Emblem, Bremse, Sicke, Felge und Material.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC2110.webp', 'Sportwagen Cinematic', 1920, 1280, { title: 'Cinematic', text: 'Bilder mit Filmcharakter für Kampagne und Magazin.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.sportwagen,
    related: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3032_genErase.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250418-DSC00660.webp', 'Oldtimerfotografie', 1920, 1280, { title: 'Oldtimer', label: '/oldtimer-fotografie.html' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC6968.webp', 'Motorradfotografie', 1707, 2560, { title: 'Motorrad', label: '/motorrad-fotografie.html' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC2345-2.webp', 'Sportwagen-Auswahl', 1920, 1280, { title: 'Sportwagen-Auswahl', label: '/portfolio/portfolio-auswahl-sportwagen' }),
    ],
    searchLinks: [
      { href: '/motorsport-sportwagen-fotografie.html', label: 'Motorsport & Sportwagen' },
      { href: '/motorsport-fotografie.html', label: 'Motorsport Fotografie' },
      { href: '/sportwagen-shooting-duesseldorf.html', label: 'Sportwagen Shooting' },
      { href: '/sportwagen-fotoshooting-duesseldorf.html', label: 'Sportwagen Fotoshooting' },
      { href: '/performance-car-fotografie.html', label: 'Performance Car Fotografie' },
      { href: '/exotic-car-fotografie.html', label: 'Exotic Car Fotografie' },
      { href: '/supersportwagen-fotografie.html', label: 'Supersportwagen Fotografie' },
    ],
    seoTitle: 'Sportwagenfotografie',
    serviceLabel: 'Sportwagen Fotografie',
  },
  oldtimer: {
    baseSlug: 'oldtimer-fotografie',
    contactLead: (scope, service) =>
      `Schreibe kurz, welcher Oldtimer für ${service} in ${scope.label} fotografiert werden soll - Modell, Baujahr, Standort und ob die Bilder für Sammlung, Auktion, Verkauf oder privat genutzt werden. Wir klären Raum, Licht und Ablauf gemeinsam.`,
    contactNoun: 'Oldtimer',
    family: 'oldtimer',
    gallery: [
      visual('https://cms.matthiasramahi.de/uploads/payload/20250418-DSC006552.webp', 'Oldtimer Exponat', 1920, 1280, { className: 't1', label: 'Exponat' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250423-DSC02271.webp', 'Oldtimer Cockpit', 1920, 1280, { className: 't2', label: 'Cockpit' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250426-DSC02653.webp', 'Oldtimer Material', 1707, 2560, { className: 't3', label: 'Material' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250418-DSC00638.webp', 'Oldtimer Sammlung', 1920, 1280, { className: 't6', label: 'Bühne' }),
    ],
    heroImages: [
      visual('https://cms.matthiasramahi.de/uploads/payload/20250418-DSC006552.webp', 'Oldtimer Bühne', 1920, 1280),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250423-DSC021802.webp', 'Historischer Rennwagen', 1707, 2560),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250426-DSC02648.webp', 'Oldtimer Detail', 1920, 1280),
    ],
    introHeadline: 'Charakter mit Nostalgie.',
    introParagraphs: [
      'Oldtimer brauchen Ruhe und Abstand. Lack, Chrom, Leder und Patina werden bewusst geführt, ohne Effekt-Pose.',
      'Die Serie kann Sammlung, Auktion, Verkauf oder Ausstellung tragen und bleibt lokal auffindbar.',
    ],
    label: 'Oldtimer',
    moduleHeadline: 'Vier Spuren einer Geschichte.',
    moduleLead: 'Material, Patina, Embleme und Innenraum greifen ineinander und dokumentieren Herkunft und Zustand.',
    modules: [
      visual('https://cms.matthiasramahi.de/uploads/payload/20250423-DSC021802.webp', 'Oldtimer Exponat', 1707, 2560, { title: 'Exponat', text: 'Hauptmotiv wie eine Ausstellung.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250426-DSC02653.webp', 'Oldtimer Patina', 1707, 2560, { title: 'Patina', text: 'Material und Alterung ehrlich sichtbar.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250423-DSC02271.webp', 'Oldtimer Innenraum', 1920, 1280, { title: 'Innenraum', text: 'Cockpit, Leder, Holz und Armaturen.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250426-DSC02651.webp', 'Oldtimer Provenance', 1920, 1280, { title: 'Provenance', text: 'Details für Auktion, Versicherung und Verkauf.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.oldtimer,
    related: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3032_genErase.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3982.webp', 'Sportwagenfotografie', 1920, 1280, { title: 'Sportwagen', label: '/sportwagen-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc8032-1920.webp', 'Drucke', 1920, 2400, { title: 'Drucke', label: '/drucke-sonderanfertigungen-duesseldorf.html' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250418-DSC00660.webp', 'Oldtimer-Auswahl', 1920, 1280, { title: 'Oldtimer-Auswahl', label: '/portfolio/portfolio-auswahl-oldtimer' }),
    ],
    searchLinks: [
      { href: '/classic-car-fotografie.html', label: 'Classic Car Fotografie' },
      { href: '/oldtimer-shooting-duesseldorf.html', label: 'Oldtimer Shooting' },
      { href: '/youngtimer-fotografie.html', label: 'Youngtimer Fotografie' },
      { href: '/sammlerfahrzeug-fotografie.html', label: 'Sammlerfahrzeug Fotografie' },
      { href: '/oldtimer-verkaufsfotos-duesseldorf.html', label: 'Oldtimer Verkaufsfotos' },
    ],
    seoTitle: 'Oldtimer-Fotografie',
    serviceLabel: 'Oldtimer Fotografie',
  },
  motorrad: {
    baseSlug: 'motorrad-fotografie',
    contactLead: (scope, service) =>
      `Schreibe kurz, welches Bike für ${service} in ${scope.label} fotografiert werden soll - Modell, Standort, ob Fahrerbilder gewünscht sind und wofür die Bilder genutzt werden. Wir klären Licht, Location und Ablauf gemeinsam.`,
    contactNoun: 'Motorrad',
    family: 'motorrad',
    gallery: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC6968.webp', 'Motorrad Hero-Motiv', 1707, 2560, { className: 't1', label: 'Silhouette' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC7025.webp', 'Motorrad Detail', 1707, 2560, { className: 't2', label: 'Detail' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC7026.webp', 'Motorrad mit Fahrerbezug', 1707, 2560, { className: 't3', label: 'Haltung' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC6979.webp', 'Motorrad Cinematic', 1920, 1280, { className: 't6', label: 'Cinematic' }),
    ],
    heroImages: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC6968.webp', 'Motorrad Straße', 1707, 2560),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC7026.webp', 'Motorrad Duke', 1707, 2560),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC6982-1.webp', 'Motorrad Detail', 1707, 2560),
    ],
    introHeadline: 'Geschwindigkeit und Leidenschaft auf Bildern.',
    introParagraphs: [
      'Ein Motorrad muss auch im Stand Spannung tragen: Mechanik, Material, Silhouette und Haltung werden als kraftvolle Serie geplant.',
      'Die lokale Seite bleibt im Motorrad-Layout und passt Standort, Anlass und Anfrage sauber an.',
    ],
    label: 'Motorrad',
    moduleHeadline: 'Vom Detail bis zur Kurve.',
    moduleLead: 'Stand, Detail, Fahrerbezug, Bewegung und Social-Formate werden je nach Maschine und Nutzung kombiniert.',
    modules: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC7039.webp', 'Motorrad Stand und Silhouette', 1707, 2560, { title: 'Stand & Silhouette', text: 'Bike pur: Proportionen, Linienführung, Haltung.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC7025.webp', 'Motorrad Detail', 1707, 2560, { title: 'Detail', text: 'Tank, Motor, Felge, Lenker und Material.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC7026.webp', 'Motorrad mit Fahrer', 1707, 2560, { title: 'Mit Fahrer', text: 'Mensch und Maschine als Haltung.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC6979.webp', 'Motorrad Cinematic', 1920, 1280, { title: 'Cinematic', text: 'Werkhalle, Asphalt, Dämmerung, Editorial.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.motorrad,
    related: [
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3032_genErase.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC3982.webp', 'Sportwagenfotografie', 1920, 1280, { title: 'Sportwagen', label: '/sportwagen-fotografie.html' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC6979.webp', 'Videografie', 1920, 1280, { title: 'Videografie', label: '/videografie-duesseldorf.html' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/_DSC6968.webp', 'Motorrad-Auswahl', 1707, 2560, { title: 'Motorrad-Auswahl', label: '/portfolio/portfolio-auswahl-motorrad' }),
    ],
    searchLinks: [
      { href: '/motorrad-shooting-duesseldorf.html', label: 'Motorrad Shooting' },
      { href: '/bike-fotografie.html', label: 'Bike Fotografie' },
      { href: '/custom-bike-fotografie.html', label: 'Custom Bike Fotografie' },
      { href: '/motorrad-verkaufsfotos-duesseldorf.html', label: 'Motorrad Verkaufsfotos' },
      { href: '/biker-portrait-duesseldorf.html', label: 'Biker Portrait' },
    ],
    seoTitle: 'Motorradfotografie',
    serviceLabel: 'Motorrad Fotografie',
  },
  portrait: {
    baseSlug: 'portraitfotografie',
    contactLead: (scope, service) =>
      `Schreibe kurz, wofür die Portraits für ${service} in ${scope.label} gedacht sind - Personal Branding, Editorial, Team, Presse oder Bewerbung. Wichtig sind Person oder Team, gewünschte Wirkung, Ort und Zeitraum. Stil und Licht klären wir vor dem ersten Klick.`,
    contactNoun: 'Portrait',
    family: 'portrait',
    gallery: [
      visual('/assets/portraits/_DSC0470-Enhanced-NR.webp', 'Portrait Hauptmotiv', 1600, 2560, { className: 't-hero', label: 'Portrait' }),
      visual('/assets/portraits/_DSC9321-Enhanced-NR.webp', 'Portrait Editorial', 1707, 2560, { className: 't-a', label: 'Editorial' }),
      visual('/assets/optimized/assets-portraits-dsc3908-1920.webp', 'Portrait Team', 1920, 1280, { className: 't-b', label: 'Team' }),
      visual('/assets/optimized/assets-portraits-20250605-dsc04020-1920.webp', 'Portrait Konzept', 1707, 2560, { className: 't-f', label: 'Konzept' }),
    ],
    heroImages: [
      visual('/assets/portraits/_DSC0470-Enhanced-NR.webp', 'Portrait warm', 1600, 2560),
      visual('/assets/portraits/_DSC9301-Enhanced-NR.webp', 'Portrait Profil', 2048, 2560),
      visual('/assets/portraits/_DSC9321-Enhanced-NR.webp', 'Portrait Editorial', 1707, 2560),
      visual('/assets/optimized/assets-portraits-20250327-dsc01550-1920.webp', 'Portrait Konzept', 1691, 2560),
    ],
    introHeadline: 'Nähe ohne Beliebigkeit.',
    introParagraphs: [
      'Portraits sollen professionell wirken, ohne Menschen glattzubügeln. Licht, Distanz und Blickführung werden auf Nutzung und Persönlichkeit abgestimmt.',
      'Die lokale Variante folgt dem Portrait-Layout und bleibt in der Bildsprache konsistent.',
    ],
    label: 'Portrait',
    moduleHeadline: 'Verschiedene Perspektiven.',
    moduleLead: 'Vom Personal Brand bis zur redaktionellen Strecke bekommt jedes Portrait einen klaren Zweck.',
    modules: [
      visual('/assets/portraits/_DSC0470-Enhanced-NR.webp', 'Founder Portrait', 1600, 2560, { title: 'Founder & Speaker', text: 'Bilder, die wirken, ohne sich aufzudrängen.' }),
      visual('/assets/optimized/assets-portraits-dsc3908-1920.webp', 'Team Portrait', 1920, 1280, { title: 'Agentur & Kanzlei', text: 'Konsistente Bildsprache ohne Charakterverlust.' }),
      visual('/assets/optimized/assets-portraits-20250605-dsc04020-1920.webp', 'Editorial Portrait', 1707, 2560, { title: 'Magazin & Strecke', text: 'Portraits mit Haltung und Erzählung.' }),
      visual('/assets/portraits/_DSC9321-Enhanced-NR.webp', 'Headshot und Profil', 1707, 2560, { title: 'Headshot & Profil', text: 'Klare Bilder für professionelle Auftritte.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.portrait,
    related: [
      visual('/assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp', 'Landschaftsfotografie', 1920, 1280, { title: 'Landschaft', label: '/landschaftsfotografie.html' }),
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Videografie', 1920, 1280, { title: 'Videografie', label: '/videografie-duesseldorf.html' }),
      visual('/assets/portraits/_DSC9321-Enhanced-NR.webp', 'Portfolio', 1707, 2560, { title: 'Portfolio', label: '/portfolio.html' }),
    ],
    searchLinks: [
      { href: '/portrait-fotoshooting.html', label: 'Portrait Fotoshooting' },
      { href: '/fotoshooting-gutschein.html', label: 'Fotoshooting Gutschein' },
      { href: '/fotoshooting-preise.html', label: 'Fotoshooting Preise' },
      { href: '/dating-fotoshooting.html', label: 'Dating Fotoshooting' },
      { href: '/business-portrait-duesseldorf.html', label: 'Business Portrait' },
      { href: '/headshot-fotograf-duesseldorf.html', label: 'Headshot Fotograf' },
      { href: '/personal-branding-fotografie.html', label: 'Personal Branding Fotografie' },
      { href: '/schwarz-weiss-portrait-fotografie.html', label: 'Schwarz-Weiss Portrait' },
      { href: '/vintage-fotoshooting.html', label: 'Vintage Fotoshooting' },
      { href: '/fotoshooting-maenner.html', label: 'Fotoshooting für Männer' },
      { href: '/musikerfotografie.html', label: 'Musikerfotografie' },
      { href: '/portraitfotografie-beleuchtung.html', label: 'Portrait Beleuchtung' },
      { href: '/paarshooting-familienshooting.html', label: 'Paar & Familie' },
      { href: '/unternehmensportrait-duesseldorf.html', label: 'Unternehmensportrait' },
      { href: '/pressefoto-duesseldorf.html', label: 'Pressefoto' },
    ],
    seoTitle: 'Portraitfotografie',
    serviceLabel: 'Portrait Fotografie',
  },
  landschaft: {
    baseSlug: 'landschaftsfotografie',
    contactLead: (scope, service) =>
      `Schreibe kurz, wofür ${service} in ${scope.label} eingesetzt werden soll - Fine-Art-Print, Innenraum, Editorial, Website oder Markenbild. Wichtig sind gewünschte Atmosphäre, Format, Material und Zeitraum.`,
    contactNoun: 'Landschaft',
    family: 'landschaft',
    gallery: [
      visual('/assets/portfolio/thumbs/Wettberwerb_Foto5_Wunder_der_Natur2.webp', 'Landschaft Hauptmotiv', 720, 471, { className: 't-hero', label: 'Ruhe' }),
      visual('/assets/portfolio/thumbs/Wettberwerb_Foto6_Wunder_der_Natur.webp', 'Landschaft Fine Art', 720, 520, { className: 't-a', label: 'Fine Art' }),
      visual('/assets/portfolio/thumbs/Wettberwerb_Foto10_Wunder_der_natur.webp', 'Landschaft Atmosphäre', 720, 448, { className: 't-b', label: 'Atmosphäre' }),
      visual('/assets/portfolio/thumbs/20250605-DSC04020.webp', 'Landschaft Cinema', 720, 1080, { className: 't-c', label: 'Raum' }),
    ],
    heroImages: [
      visual('/assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp', 'Landschaft Wasser', 1920, 1280),
      visual('/assets/optimized/assets-portfolio-20250605-dsc04020-1920.webp', 'Landschaft Wald', 1707, 2560),
      visual('/assets/optimized/assets-portfolio-wettberwerb-foto10-wunder-der-natur-1920.webp', 'Landschaft Licht', 1920, 1194),
    ],
    introHeadline: 'Bilder, die einen Raum verändern.',
    introParagraphs: [
      'Landschaft steht hier weniger für lokales Shooting als für kuratierte Bildauswahl, Fine-Art-Prints, Wandbilder und großformatige Arbeiten.',
      'Die lokale Variante macht regionale Nachfrage auffindbar, ohne die Bildsprache zu verwässern.',
    ],
    label: 'Landschaft',
    moduleHeadline: 'Vier Ausführungen.',
    moduleLead: 'Jedes Motiv wird nach Raum, Material, Größe und Wirkung geplant.',
    modules: [
      visual('/assets/optimized/assets-portfolio-wettberwerb-foto6-wunder-der-natur-1920.webp', 'Fine-Art Landschaft', 1920, 1387, { title: 'Fine-Art', text: 'Papier, Tonwert und Oberfläche passend zum Motiv.' }),
      visual('/assets/optimized/assets-portfolio-wettberwerb-foto10-wunder-der-natur-1920.webp', 'Aluminium Landschaft', 1920, 1194, { title: 'Aluminium', text: 'Klare Fläche für Praxis, Hotel und Büro.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250605-DSC03793-2.webp', 'Acrylglas Landschaft', 1707, 2560, { title: 'Acrylglas', text: 'Tiefe und Kontrast für repräsentative Räume.' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250605-DSC03816-2.webp', 'Landschaft Edition', 1707, 2560, { title: 'Edition', text: 'Limitierte Auswahl mit sauberer Fertigung.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.landschaft,
    related: [
      visual('/assets/photos/portrait-blue.webp', 'Portraitfotografie', 2048, 2560, { title: 'Portrait', label: '/portraitfotografie.html' }),
      visual('https://cms.matthiasramahi.de/uploads/payload/20250418-DSC00660.webp', 'Oldtimerfotografie', 1920, 1280, { title: 'Oldtimer', label: '/oldtimer-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-20250605-dsc03978-1920.webp', 'Drucke', 1707, 2560, { title: 'Drucke', label: '/drucke-sonderanfertigungen-duesseldorf.html' }),
      visual('/assets/optimized/assets-portfolio-wettberwerb-foto10-wunder-der-natur-1920.webp', 'Portfolio', 1920, 1194, { title: 'Portfolio', label: '/portfolio.html' }),
    ],
    searchLinks: [
      { href: '/landschaftsbilder-kaufen.html', label: 'Landschaftsbilder kaufen' },
      { href: '/fine-art-prints-landschaft.html', label: 'Fine-Art-Prints Landschaft' },
      { href: '/wandbilder-landschaftsfotografie.html', label: 'Wandbilder Landschaftsfotografie' },
      { href: '/naturfotografie-prints.html', label: 'Naturfotografie Prints' },
      { href: '/landschaftsfotografie-print-deutschland.html', label: 'Landschaftsfotografie Print Deutschland' },
    ],
    seoTitle: 'Landschaftsfotografie',
    serviceLabel: 'Landschaftsfotografie',
  },
}

export function scopeFromSlug(value?: string | null): LocalSeoScope {
  const slug = normalizeLocalSeoSlug(value)
  const token = localSeoCityTokens.find((city) => slug.endsWith(`-${city}`) || slug.includes(`-${city}-`))

  if (token) return { label: scopeLabels[token] || token, slug: token }
  if (slug.includes('deutschland')) return { label: 'Deutschland', slug: 'deutschland' }
  if (slug.includes('nrw')) return { label: 'NRW', slug: 'nrw' }
  if (standaloneKeywordSlugs.has(slug)) return { generic: true, label: 'Überregional', slug: 'generic' }

  return { label: 'Düsseldorf', slug: 'duesseldorf' }
}

export function serviceLabelFromSlug(value: string | null | undefined, familyContent: LocalSeoFamilyContent) {
  const slug = normalizeLocalSeoSlug(value)
  const match = normalizedPrefixEntries
    .filter((entry) => entry.family === familyContent.family)
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find((entry) => slug.startsWith(entry.prefix))

  return match?.label || familyContent.serviceLabel
}

export function titleForLocalSeoPage(doc: PayloadDoc | null | undefined, serviceLabel: string, scope: LocalSeoScope) {
  if (!doc?.title && scope.generic) return `${serviceLabel} | Matthias Ramahi`
  return doc?.title || `${serviceLabel} ${scope.label}`
}

const cityCharacter: Record<string, string> = {
  koeln: 'Rhein, Rheinauhafen und urbane Hinterhöfe',
  essen: 'Ruhrgebiet, Zeche Zollverein und sachliche Industriearchitektur',
  dortmund: 'Phoenix-See, Westfalenpark und Hafenkante',
  duisburg: 'Innenhafen, Landschaftspark und Industriekulisse',
  bochum: 'Jahrhunderthalle, Bermuda3eck und Ruhr-Architektur',
  wuppertal: 'Schwebebahn, Wupper-Tal und steile Talsenken',
  leverkusen: 'Rhein, Bayer-Werk und ruhige Wohnlagen',
  oberhausen: 'Gasometer, CentrO und weite Industrielandschaft',
  krefeld: 'Rhein, Seide-Architektur und der Hülser Berg',
  moenchengladbach: 'Schloss Rheydt, Hardter Wald und Hockeypark',
  moers: 'Niederrhein, Schlosspark und ruhige Altstadt',
  gelsenkirchen: 'Arena, Nordsternpark und Zechen-Kulisse',
  'bergisch-gladbach': 'Bergisches Land, Bensberg und Forsbach',
  solingen: 'Schloss Burg, Müngstener Brücke und Wupperhänge',
  remscheid: 'Bergisches Land, Müngstener Brücke und Talsperren',
  mettmann: 'Neandertal, Bergisches Land und die ruhige Lage zwischen Düsseldorf und Wuppertal',
  hilden: 'Stadtwald, Itter und die Düsseldorf-nahe Lage',
  dormagen: 'Rhein, Chempark und ländliche Außenbereiche',
  neuss: 'Rhein, Hafen und die Düsseldorf-nahe Lage',
  erkrath: 'Neandertal, Düssel-Auen und die direkte Nähe zu Düsseldorf',
  ratingen: 'Blauer See, Altstadt und die Lage am Rand von Düsseldorf',
}

export function cityScopePhrase(scope: LocalSeoScope): string {
  if (scope.generic) return ''
  if (scope.slug === 'duesseldorf')
    return 'Düsseldorf ist der Standort- und Planungsanker; Wege, Lichtfenster, Location und Ausgabeformat lassen sich dadurch präzise abstimmen.'
  if (scope.slug === 'nrw')
    return 'NRW verbindet Rheinland, Ruhrgebiet, Niederrhein und Bergisches Land; die Produktion bleibt lokal auffindbar und wird von Düsseldorf aus sauber geplant.'
  if (scope.slug === 'deutschland')
    return 'Deutschlandweite Termine werden über Motiv, Nutzung, Anreise und Lichtfenster geplant; Düsseldorf bleibt der organisatorische Ausgangspunkt.'
  const character = cityCharacter[scope.slug]
  return character
    ? `In ${scope.label} prägen ${character} den Bildkontext; Wege, Lichtfenster und Location werden gezielt darauf abgestimmt.`
    : `${scope.label} wird als lokaler Suchraum mit klarer Planung, passendem Lichtfenster und sauberer Nutzung der Bildserie geführt.`
}

export function placeDescriptor(scope: LocalSeoScope, family: LocalSeoLayoutFamily) {
  if (scope.slug === 'nrw') {
    return family === 'landschaft'
      ? 'NRW bündelt die Nachfrage nach Fine-Art-Prints, Wandbildern und Editionen; Auswahl, Material und Lieferung werden passend zum Raum geplant.'
      : 'NRW verbindet Rheinland, Ruhrgebiet, Niederrhein und Bergisches Land; die Produktion bleibt lokal auffindbar und wird von Düsseldorf aus sauber geplant.'
  }

  if (scope.slug === 'deutschland') {
    return family === 'landschaft'
      ? 'Deutschlandweit zählt vor allem die passende Motivwahl, Druckqualität, Materialität und Wirkung im Raum.'
      : 'Deutschlandweite Produktionen werden über Motiv, Nutzung, Reise, Lichtfenster und Output geplant; Düsseldorf bleibt der organisatorische Ausgangspunkt.'
  }

  if (scope.slug === 'duesseldorf') {
    return 'Düsseldorf ist der lokale Standort- und Planungsanker; Wege, Lichtfenster, Location und Ausgabeformat lassen sich dadurch präzise abstimmen.'
  }

  return cityScopePhrase(scope)
}

export function heroCopyForLocalSeoPage(
  doc: PayloadDoc | null | undefined,
  familyContent: LocalSeoFamilyContent,
  serviceLabel: string,
  scope: LocalSeoScope,
) {
  if (doc?.intro) return doc.intro

  if (scope.generic) {
    return familyContent.family === 'landschaft'
      ? `${serviceLabel}: Motivwahl, Druckqualität, Material und Raumwirkung werden als Fine-Art-Print, Wandbild, Edition oder großformatige Arbeit kuratiert.`
      : `${serviceLabel}: Bildsprache, Licht, Details und Nutzung werden als kuratierte Serie geplant - vom ersten Motiv bis zur Ausgabe für Verkauf, Marke, Editorial oder Kampagne.`
  }

  const descriptor = placeDescriptor(scope, familyContent.family)
  const base =
    familyContent.family === 'landschaft'
      ? `${serviceLabel} für ${scope.label}: Licht, Weite, Material und Raumwirkung werden kuratiert - als Fine-Art-Print, Wandbild, Edition oder großformatige Arbeit.`
      : `${serviceLabel} in ${scope.label}: Bildsprache, Licht, Details und Nutzung werden als kuratierte Serie geplant.`

  return `${base} ${descriptor}`
}

export function cityLinksForFamily(familyContent: LocalSeoFamilyContent) {
  return localSeoScopes.map((scope) => ({
    href: scope.slug === 'duesseldorf' ? `/${familyContent.baseSlug}.html` : `/${familyContent.baseSlug}-${scope.slug}.html`,
    label: scope.label,
  }))
}

export function siblingFamilyLinks(scope: LocalSeoScope, currentFamily: LocalSeoLayoutFamily) {
  return Object.values(localSeoFamilyContent)
    .filter((item) => item.family !== currentFamily)
    .map((item) => ({
      href: scope.slug === 'duesseldorf' || scope.generic ? `/${item.baseSlug}.html` : `/${item.baseSlug}-${scope.slug}.html`,
      label: scope.generic ? item.seoTitle : `${item.seoTitle} ${scope.label}`,
    }))
}
