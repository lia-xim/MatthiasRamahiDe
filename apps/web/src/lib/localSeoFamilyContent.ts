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
  contactLead: `Schreibe kurz, welches Motiv im Mittelpunkt steht, wofuer ${label} gebraucht wird und ob die Bilder privat, kommerziell, redaktionell oder fuer Verkauf und Print genutzt werden sollen.`,
  featureBody: brief.feature,
  featureTitle: 'Eigenes Motiv statt Kopie.',
  galleryHeadline: `${label} als Bildserie.`,
  galleryLead: brief.output,
  heroEmphasis: brief.heroEmphasis,
  heroLead: `${label}: ${brief.intent} ${brief.planning}`,
  heroTitle: brief.heroTitle,
  metaDescription: `${label}: ${brief.output}`,
  processHeadline: `${label}: Ablauf.`,
  processLead: `Vor dem Termin werden Ziel, Motiv, Ort, Lichtfenster und Ausgabe geklaert, damit aus der Anfrage ein eigener Bildsatz wird.`,
  processSteps: [
    { title: 'Ziel klaeren', text: brief.intent },
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
    cards: ['Licht verstehen', 'Perspektive waehlen', 'Reflexe kontrollieren', 'Zum Shooting fuehren'],
    feature: 'Die Ratgeberseite beantwortet praktische Fragen und zeigt, wann ein professioneller Bildsatz mehr bringt als weitere Einzelversuche.',
    heroEmphasis: 'Tipps.',
    heroTitle: 'Auto fotografieren',
    intent: 'Suchende wollen konkrete Hilfe zu Licht, Winkel, Lackreflexen, Standort und Bildaufbau.',
    output: 'Hilfreiche Tipps plus Bruecke zur professionellen Automobilfotografie in NRW.',
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
    output: 'Professionelles Auto-Fotoshooting fuer Privat, Verkauf, Marke und Social Media.',
    planning: 'Ort, Zustand, Tageszeit und Nutzung werden vorab festgelegt, damit das Fahrzeug nicht zufaellig wirkt.',
    related: 'Auto-Fotoshooting bleibt die breite Einstiegsseite und verweist auf Bilder mit Auto, Sportwagen, Oldtimer und Motorrad.',
    sectionEmphasis: 'Serie.',
    sectionHeadline: 'Fahrzeug als',
  }),
  'automobil-fotografie': simpleKeywordCopy('Automobilfotografie', {
    cards: ['Exterieur', 'Interieur', 'Details', 'Kampagne'],
    feature: 'Die Hauptseite bleibt die Klammer fuer Fahrzeugbilder mit Nutzungsziel: Inserat, Marke, Showroom, Kampagne oder private Sammlung.',
    heroEmphasis: 'Fotografie.',
    heroTitle: 'Automobil',
    intent: 'Hier geht es um hochwertige Fahrzeugserien statt um ein einzelnes schoenes Autobild.',
    output: 'Automobilfotografie fuer Verkauf, Marke, Showroom, Kampagne und hochwertige private Fahrzeuge.',
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
    intent: 'Suchende erwarten eine visuelle Sprache fuer Marke, Kampagne, Social Media oder redaktionelle Strecke.',
    output: 'Automotive Fotografie fuer Marken, Haendler, Content-Serien und redaktionelle Nutzung.',
    planning: 'Briefing, Kanaluebersicht, Formate und Wiedererkennbarkeit werden vor der Produktion geklaert.',
    related: 'Die Seite grenzt kommerzielle Automotive-Arbeit von Auto-Fotoshooting und reinen Verkaufsbildern ab.',
    sectionEmphasis: 'Marke.',
    sectionHeadline: 'Bildsprache fuer',
  }),
  'autofotografie': simpleKeywordCopy('Autofotografie', {
    cards: ['Breiter Einstieg', 'Privat und Business', 'Saubere Motive', 'Weiterleitung'],
    feature: 'Autofotografie ist der kuerzere, allgemeinere Begriff und braucht deshalb eine klare Fuehrung in die passenden Unterseiten.',
    heroEmphasis: 'klar.',
    heroTitle: 'Autofotografie',
    intent: 'Der Begriff ist breit: private Autos, Verkauf, Marke, Social und Fahrzeugliebe koennen gemeint sein.',
    output: 'Autofotografie als Ueberblick mit schneller Orientierung zu Shooting, Verkauf und Automotive-Serien.',
    planning: 'Die Seite fragt frueh nach Zweck, Fahrzeugart und Ausgabe, damit Nutzer schnell beim passenden Angebot landen.',
    related: 'Von hier geht es gezielt zu Automobilfotografie, Auto-Fotoshooting, Fahrzeugfotografie und Autohaus-Fotografie.',
    sectionEmphasis: 'Zweck.',
    sectionHeadline: 'Auto, Bild,',
  }),
  'autohaus-fotografie': simpleKeywordCopy('Autohaus Fotografie', {
    cards: ['Bestand', 'Showroom', 'Portale', 'Prozess'],
    feature: 'Autohaus Fotografie braucht Wiederholbarkeit: gleiche Bildlogik, schnelle Ablaeufe und klare Motive fuer Web, Portale und Verkauf.',
    heroEmphasis: 'Bestand.',
    heroTitle: 'Autohaus',
    intent: 'Haendler suchen nicht nur schoene Autos, sondern konsistente Bildsaetze fuer viele Fahrzeuge.',
    output: 'Autohaus Fotografie fuer Showroom, Bestand, Fahrzeugportale und Verkaufsseiten.',
    planning: 'Fahrzeugliste, Standort, Stellflaeche, Licht und Reihenfolge werden als Ablauf vorbereitet.',
    related: 'Die Seite trennt Haendlerbedarf klar von privaten Shootings und fuehrt zu Autoverkauf-Fotos.',
    sectionEmphasis: 'Verkauf.',
    sectionHeadline: 'Bestand mit',
  }),
  'autoverkauf-fotos': simpleKeywordCopy('Autoverkauf Fotos', {
    cards: ['Inserat', 'Zustand', 'Ausstattung', 'Vertrauen'],
    feature: 'Verkaufsbilder muessen Zustand, Ausstattung und Wertigkeit nachvollziehbar zeigen, ohne das Fahrzeug falsch zu ueberinszenieren.',
    heroEmphasis: 'verkaufen.',
    heroTitle: 'Autoverkauf Fotos',
    intent: 'Hier geht es konkret um bessere Verkaufsbilder, die Vertrauen schaffen und den Verkauf unterstuetzen.',
    output: 'Autoverkauf Fotos fuer Inserate, Auktionen, Portale und private Fahrzeugverkaeufe.',
    planning: 'Vorab werden Bildliste, Maengel, Details, Innenraum und Ausstattungsmerkmale festgelegt.',
    related: 'Autoverkauf-Fotos werden von Autohaus-Fotografie und Auto-Fotoshooting getrennt, damit der Verkaufsintent klar bleibt.',
    sectionEmphasis: 'Vertrauen.',
    sectionHeadline: 'Bilder fuer',
  }),
  fahrzeugfotografie: simpleKeywordCopy('Fahrzeugfotografie', {
    cards: ['Auto', 'Motorrad', 'Nutzungsziel', 'Bereich'],
    feature: 'Fahrzeugfotografie ist der neutrale Sammelbegriff und braucht eine saubere Sortierung nach Auto, Sportwagen, Oldtimer und Motorrad.',
    heroEmphasis: 'sortiert.',
    heroTitle: 'Fahrzeugfotografie',
    intent: 'Suchende koennen Autos, Bikes, Haendlerbestand, Verkauf oder redaktionelle Serien meinen.',
    output: 'Fahrzeugfotografie als Ueberblick fuer Auto, Sportwagen, Oldtimer, Motorrad und Verkauf.',
    planning: 'Die Seite fuehrt frueh ueber Fahrzeugart, Zweck und Bildausgabe zur passenden Unterseite.',
    related: 'Sie ersetzt nicht jedes Angebot, sondern fuehrt bewusst zur passenden Fahrzeugart weiter.',
    sectionEmphasis: 'Kategorie.',
    sectionHeadline: 'Fahrzeug nach',
  }),
  'bilder-mit-auto': simpleKeywordCopy('Bilder mit Auto', {
    cards: ['Mensch und Auto', 'Geschenk', 'Social', 'Portraitnaehe'],
    feature: 'Diese Seite mischt Fahrzeug- und Portraitlogik und erklaert, wann Auto, Person und Location zusammenarbeiten.',
    heroEmphasis: 'inszenieren.',
    heroTitle: 'Bilder mit Auto',
    intent: 'Suchende wollen oft nicht nur das Auto, sondern sich selbst, ein Paar oder eine Geschichte mit dem Fahrzeug zeigen.',
    output: 'Bilder mit Auto fuer Besitzer, Geschenkideen, Social Content und persoenliche Serien.',
    planning: 'Pose, Abstand, Kleidung, Ort und Fahrzeugwirkung werden so geplant, dass das Auto nicht wie Requisite wirkt.',
    related: 'Die Seite verbindet Automobil und Portrait und fuehrt passend zu beiden Bereichen weiter.',
    sectionEmphasis: 'Person.',
    sectionHeadline: 'Auto plus',
  }),
  'fotoshooting-mit-auto': simpleKeywordCopy('Fotoshooting mit Auto', {
    cards: ['Erlebnis', 'Auto und Mensch', 'Location', 'Serie'],
    feature: 'Das Keyword ist naeher am Shooting-Erlebnis als an klassischer Produktfotografie.',
    heroEmphasis: 'erleben.',
    heroTitle: 'Fotoshooting mit Auto',
    intent: 'Hier geht es um einen Termin mit Fahrzeug, Stimmung, Person und nutzbaren Motiven.',
    output: 'Fotoshooting mit Auto fuer Lieblingsfahrzeuge, Geschenk, Social Media und private Erinnerungen.',
    planning: 'Fahrzeug, Personen, Stimmung und Bildformate werden gemeinsam geplant.',
    related: 'Die Seite fuehrt weiter zu Auto-Fotoshooting, Bilder mit Auto, Portrait und Gutschein.',
    sectionEmphasis: 'Moment.',
    sectionHeadline: 'Shooting mit',
  }),
  'motorsport-fotografie': simpleKeywordCopy('Motorsport Fotografie', {
    cards: ['Trackday', 'Bewegung', 'Team', 'Eventcontent'],
    feature: 'Motorsport braucht Dynamik, Sicherheit, Standortplanung und ruhige Details neben Actionbildern.',
    heroEmphasis: 'Track.',
    heroTitle: 'Motorsport',
    intent: 'Die Seite bedient Event-, Trackday-, Club- und Team-Suchen mit bewegten Fahrzeugen.',
    output: 'Motorsport Fotografie fuer Trackdays, Clubs, Teams, Sponsoren und private Fahrer.',
    planning: 'Strecke, Zonen, Licht, Bewegungsrichtung, Fahrerlager und Nutzungsrechte werden vorab geklaert.',
    related: 'Motorsport bleibt eigenstaendig und verlinkt zu Sportwagen, Performance Cars und Automobil.',
    sectionEmphasis: 'Bewegung.',
    sectionHeadline: 'Track und',
  }),
  'motorsport-sportwagen-fotografie': simpleKeywordCopy('Motorsport- und Sportwagen-Fotografie', {
    cards: ['Performance', 'Standbild', 'Action', 'Sammler'],
    feature: 'Diese Brueckenseite kombiniert ruhige Sportwagenbilder mit Motorsport- und Trackday-Dynamik.',
    heroEmphasis: 'Performance.',
    heroTitle: 'Motorsport und Sportwagen',
    intent: 'Suchende wollen Performance zeigen: im Stand, in Bewegung oder als komplette Strecke.',
    output: 'Motorsport- und Sportwagen-Fotografie fuer Performance Cars, Clubs, Sammler und Marken.',
    planning: 'Standort, Actionfenster, Detailmotive und Nutzungsformate werden zusammen gedacht.',
    related: 'Die Seite verbindet Motorsport mit Sportwagen, ohne beide Hauptseiten zu ersetzen.',
    sectionEmphasis: 'Standbild.',
    sectionHeadline: 'Bewegung plus',
  }),
  'sportwagen-fotografie': simpleKeywordCopy('Sportwagenfotografie', {
    cards: ['Performance Car', 'Material', 'Druck', 'Sammlung'],
    feature: 'Sportwagen werden ueber Form, Innenraum, Details und Druckqualitaet als hochwertige Serie gezeigt.',
    heroEmphasis: 'Fotografie.',
    heroTitle: 'Sportwagen',
    intent: 'Der Fokus liegt auf Performance, Design, Wertigkeit und Nutzbarkeit der Bildserie.',
    output: 'Sportwagenfotografie fuer Sammler, Haendler, Marken, Verkauf und Fine-Art-Druck.',
    planning: 'Reflexe, Strecke, Standbild, Cockpit und Detailmotive werden mit klarer Dramaturgie geplant.',
    related: 'Die Hauptseite fuehrt zu Motorsport, Performance Car, Exotic Car und Supersportwagen.',
    sectionEmphasis: 'Druckqualitaet.',
    sectionHeadline: 'Form, Material,',
  }),
  'sportwagen-shooting': simpleKeywordCopy('Sportwagen Shooting', {
    cards: ['Privat', 'Treffpunkt', 'Cinematic', 'Abgrenzung'],
    feature: 'Sportwagen Shooting ist persoenlicher als reine Sportwagenfotografie und braucht Anlass, Ort und Erlebnislogik.',
    heroEmphasis: 'buchen.',
    heroTitle: 'Sportwagen Shooting',
    intent: 'Suchende wollen einen konkreten Termin fuer ihr Fahrzeug, haeufig privat, als Geschenk oder fuer Social.',
    output: 'Sportwagen Shooting in Duesseldorf und NRW mit Exterieur, Interieur, Details und starken Hero-Motiven.',
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
    output: 'Sportwagen Fotoshooting fuer Besitzer, Geschenk, Social Media und hochwertige Erinnerungen.',
    planning: 'Auto, Person, Ort und Stimmung werden so kombiniert, dass die Serie nicht beliebig wirkt.',
    related: 'Die Seite verbindet Sportwagenfotografie mit Auto-Fotoshooting und Gutschein.',
    sectionEmphasis: 'Serie.',
    sectionHeadline: 'Fotoshooting mit',
  }),
  'performance-car-fotografie': simpleKeywordCopy('Performance Car Fotografie', {
    cards: ['Leistung', 'Aerodynamik', 'Tracknaehe', 'Content'],
    feature: 'Performance Cars brauchen eine Bildsprache, die technische Details, Dynamik und Wertigkeit zusammenhaelt.',
    heroEmphasis: 'zeigen.',
    heroTitle: 'Performance Car',
    intent: 'Der Fokus liegt auf sportlichen Fahrzeugen, Umbauten, Track-nahem Look und leistungsbezogenem Content.',
    output: 'Performance Car Fotografie fuer Besitzer, Tuner, Clubs, Marken und Social Content.',
    planning: 'Standbild, Detail, Bewegung, Sound-Anmutung und Formatbedarf werden im Ablauf kombiniert.',
    related: 'Die Seite grenzt Performance Cars von Exotic Cars, Supersportwagen und Motorsport ab.',
    sectionEmphasis: 'Leistung.',
    sectionHeadline: 'Design trifft',
  }),
  'exotic-car-fotografie': simpleKeywordCopy('Exotic Car Fotografie', {
    cards: ['Seltenheit', 'Wertigkeit', 'Sammler', 'Diskretion'],
    feature: 'Exotic Cars brauchen ruhige, hochwertige Bilder mit Blick auf Seltenheit, Zustand und Praesentation.',
    heroEmphasis: 'selten.',
    heroTitle: 'Exotic Car',
    intent: 'Suchende meinen oft besondere, seltene oder sehr hochwertige Fahrzeuge mit Sammlerwert.',
    output: 'Exotic Car Fotografie fuer Sammler, Verkauf, private Archive und hochwertige Praesentation.',
    planning: 'Location, Diskretion, Transport, Licht und Detailtiefe werden sensibel geplant.',
    related: 'Die Seite bleibt bei hochwertigen Sportwagen und verweist zu Supersportwagen und Performance Car.',
    sectionEmphasis: 'Seltenheit.',
    sectionHeadline: 'Seltenes mit',
  }),
  'supersportwagen-fotografie': simpleKeywordCopy('Supersportwagen Fotografie', {
    cards: ['High-End', 'Details', 'Launch-Look', 'Sammlung'],
    feature: 'Supersportwagen brauchen maximale Kontrolle ueber Reflexe, Linien, Innenraum und Hero-Frames.',
    heroEmphasis: 'High-End.',
    heroTitle: 'Supersportwagen',
    intent: 'Hier geht es um besonders hochwertige Sportwagen mit engerem Bildanspruch als bei allgemeiner Sportwagenfotografie.',
    output: 'Supersportwagen Fotografie fuer Besitzer, Sammler, Haendler, Marken und Editorials.',
    planning: 'Sicherheit, Location, Licht, Formate und Nutzungsrechte werden vorab sauber abgestimmt.',
    related: 'Die Seite fuehrt zu Sportwagen, Exotic Car und Performance Car, ohne diese Begriffe zu vermischen.',
    sectionEmphasis: 'Kontrolle.',
    sectionHeadline: 'High-End mit',
  }),
  'oldtimer-fotografie': simpleKeywordCopy('Oldtimer-Fotografie', {
    cards: ['Patina', 'Innenraum', 'Sammlung', 'Auktion'],
    feature: 'Oldtimer brauchen ruhige Dokumentation statt Effektpose: Zustand, Herkunft und Material muessen lesbar bleiben.',
    heroEmphasis: 'Fotografie.',
    heroTitle: 'Oldtimer',
    intent: 'Die Seite konzentriert sich auf Fahrzeuge mit Geschichte, Patina, Material und Sammlerwert.',
    output: 'Oldtimer-Fotografie fuer Sammlung, Verkauf, Auktion, Ausstellung und private Archive.',
    planning: 'Baujahr, Zustand, Dokumente, Detailbedarf und Ausgabeformat bestimmen die Bildliste.',
    related: 'Die Hauptseite fuehrt zu Classic Car, Youngtimer, Sammlerfahrzeug und Oldtimer-Verkaufsfotos.',
    sectionEmphasis: 'Herkunft.',
    sectionHeadline: 'Patina und',
  }),
  'oldtimer-shooting': simpleKeywordCopy('Oldtimer Shooting', {
    cards: ['Liebhaber', 'Geschichte', 'Ort', 'Serie'],
    feature: 'Das Shooting stellt den Oldtimer als persoenliches Fahrzeug und nicht nur als Verkaufsobjekt in den Mittelpunkt.',
    heroEmphasis: 'planen.',
    heroTitle: 'Oldtimer Shooting',
    intent: 'Suchende wollen einen Termin fuer ein besonderes Fahrzeug mit emotionalem oder historischem Wert.',
    output: 'Oldtimer Shooting fuer Besitzer, Geschenkideen, Sammlung und hochwertige Erinnerungen.',
    planning: 'Fahrzeuggeschichte, Ort, Licht und gewuenschte Bildwirkung werden vorab abgestimmt.',
    related: 'Die Seite grenzt sich von Verkaufsfotos und Auktionsdokumentation ab.',
    sectionEmphasis: 'Geschichte.',
    sectionHeadline: 'Shooting mit',
  }),
  'oldtimer-verkaufsfotos': simpleKeywordCopy('Oldtimer Verkaufsfotos', {
    cards: ['Zustand', 'Details', 'Dokumente', 'Auktion'],
    feature: 'Verkaufsfotos fuer Oldtimer muessen Vertrauen schaffen: Patina zeigen, Maengel nicht verstecken und Wertmerkmale sauber dokumentieren.',
    heroEmphasis: 'verkaufen.',
    heroTitle: 'Oldtimer Verkaufsfotos',
    intent: 'Hier geht es klar um Verkauf: bessere Bilder fuer Inserat, Auktion oder Sammlerfahrzeug.',
    output: 'Oldtimer Verkaufsfotos fuer Inserate, Auktionen, Sammlerfahrzeuge und Versicherungsdokumentation.',
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
    output: 'Classic Car Fotografie fuer Sammler, Editorials, Verkauf, Auktion und hochwertige Serien.',
    planning: 'Designlinie, Baujahr, Material und Bildstil werden bewusst ruhiger gefuehrt.',
    related: 'Die Seite verlinkt zu Oldtimer, Youngtimer und Sammlerfahrzeug, statt diese Angebote zu ueberdecken.',
    sectionEmphasis: 'Stil.',
    sectionHeadline: 'Klassik mit',
  }),
  'youngtimer-fotografie': simpleKeywordCopy('Youngtimer Fotografie', {
    cards: ['90er und 00er', 'Zustand', 'Szene', 'Verkauf'],
    feature: 'Youngtimer brauchen weniger Museumspathos und mehr Blick auf Zustand, Originalitaet, Umbauten und Szene.',
    heroEmphasis: 'neu klassisch.',
    heroTitle: 'Youngtimer',
    intent: 'Suchende meinen juengere Klassiker, Liebhaberfahrzeuge und Szeneautos.',
    output: 'Youngtimer Fotografie fuer Besitzer, Verkauf, Sammlung, Szene und Social Content.',
    planning: 'Baujahr, Originalzustand, Umbauten, Details und Nutzung der Bilder werden separat bewertet.',
    related: 'Die Seite trennt Youngtimer klar von Oldtimer und Classic Car.',
    sectionEmphasis: 'Szene.',
    sectionHeadline: 'Junge Klassiker',
  }),
  'sammlerfahrzeug-fotografie': simpleKeywordCopy('Sammlerfahrzeug Fotografie', {
    cards: ['Provenienz', 'Archiv', 'Edition', 'Wert'],
    feature: 'Sammlerfahrzeuge brauchen eine dokumentierende, wertige Bildsprache fuer Archiv, Versicherung, Verkauf oder Ausstellung.',
    heroEmphasis: 'archivieren.',
    heroTitle: 'Sammlerfahrzeug',
    intent: 'Der Fokus liegt auf Besitz, Wert, Herkunft und langfristiger Dokumentation.',
    output: 'Sammlerfahrzeug Fotografie fuer private Sammlungen, Archive, Versicherung, Verkauf und Kataloge.',
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
    output: 'Motorradfotografie fuer private Maschinen, Custom Bikes, Haendler, Werkstaetten und Social Content.',
    planning: 'Bike, Standort, Fahrerbezug, Licht und Hochformatbedarf werden vorab geplant.',
    related: 'Die Hauptseite verteilt weiter zu Motorrad Shooting, Bike Fotografie, Custom Bike und Verkaufsfotos.',
    sectionEmphasis: 'Haltung.',
    sectionHeadline: 'Maschine mit',
  }),
  'motorrad-shooting': simpleKeywordCopy('Motorrad Shooting', {
    cards: ['Besitzer', 'Location', 'Bike und Fahrer', 'Erlebnis'],
    feature: 'Motorrad Shooting ist naeher am Erlebnis und an persoenlichen Bildern als an reiner Fahrzeugdokumentation.',
    heroEmphasis: 'buchen.',
    heroTitle: 'Motorrad Shooting',
    intent: 'Suchende wollen einen Termin fuer Bike, Besitzer, Treffpunkt und Bildserie.',
    output: 'Motorrad Shooting fuer Besitzer, Geschenk, Social Media, Werkstatt und private Erinnerung.',
    planning: 'Maschine, Kleidung, Helm, Ort, Tageszeit und Bildtypen werden abgestimmt.',
    related: 'Die Seite trennt private Shooting-Anfragen von Verkaufsfotos und Custom-Bike-Dokumentation.',
    sectionEmphasis: 'Besitzer.',
    sectionHeadline: 'Bike plus',
  }),
  'motorrad-verkaufsfotos': simpleKeywordCopy('Motorrad Verkaufsfotos', {
    cards: ['Inserat', 'Zustand', 'Umbauten', 'Details'],
    feature: 'Verkaufsfotos fuer Motorraeder muessen Zustand, Umbauten, Pflege und Details klar zeigen.',
    heroEmphasis: 'verkaufen.',
    heroTitle: 'Motorrad Verkaufsfotos',
    intent: 'Die Suche ist verkaufsnah und braucht vertrauensbildende Motive statt Lifestyle.',
    output: 'Motorrad Verkaufsfotos fuer Inserate, Portale, Haendler und private Verkaeufe.',
    planning: 'Tank, Motor, Reifen, Cockpit, Umbauten, Gebrauchsspuren und Gesamtansichten werden vorab als Bildliste gedacht.',
    related: 'Die Seite grenzt sich von Motorrad Shooting und Biker Portrait ab.',
    sectionEmphasis: 'Zustand.',
    sectionHeadline: 'Verkauf mit',
  }),
  'bike-fotografie': simpleKeywordCopy('Bike Fotografie', {
    cards: ['Breiter Begriff', 'Motorrad', 'Szene', 'Weiterfuehrung'],
    feature: 'Bike Fotografie ist breiter und umgangssprachlicher als Motorradfotografie und braucht klare Sortierung.',
    heroEmphasis: 'sortiert.',
    heroTitle: 'Bike Fotografie',
    intent: 'Suchende koennen Motorrad, Custom Bike, Fahrerbild oder Social Content meinen.',
    output: 'Bike Fotografie als Einstieg fuer Motorrad, Custom Bike, Biker Portrait und Verkaufsbilder.',
    planning: 'Der Text fragt frueh nach Bike-Art, Person, Nutzung und Ort.',
    related: 'Die Seite fuehrt in die passenden Motorrad-Unterseiten, statt alles in einem Angebot zu vermischen.',
    sectionEmphasis: 'Nutzung.',
    sectionHeadline: 'Bike nach',
  }),
  'custom-bike-fotografie': simpleKeywordCopy('Custom Bike Fotografie', {
    cards: ['Umbau', 'Handwerk', 'Werkstatt', 'Detail'],
    feature: 'Custom Bikes brauchen Detailnaehe: Material, Teile, Umbauideen und handwerkliche Entscheidungen.',
    heroEmphasis: 'Umbau.',
    heroTitle: 'Custom Bike',
    intent: 'Die Seite richtet sich an Besitzer, Werkstaetten und Builder mit individuellen Maschinen.',
    output: 'Custom Bike Fotografie fuer Umbauten, Werkstaetten, Builder, Magazine und Social Content.',
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
    output: 'Biker Portrait fuer Fahrer, Clubs, Social Media, Personal Branding und private Serien.',
    planning: 'Person, Bike, Kleidung, Helm, Location und gewuenschte Wirkung werden gemeinsam abgestimmt.',
    related: 'Die Seite liegt zwischen Portrait und Motorrad und verbindet beide Bildwelten.',
    sectionEmphasis: 'Mensch.',
    sectionHeadline: 'Bike plus',
  }),
  portraitfotografie: simpleKeywordCopy('Portraitfotografie', {
    cards: ['Person', 'Licht', 'Wirkung', 'Nutzung'],
    feature: 'Portraitfotografie braucht Regie, Licht und eine klare Verwendung statt Passbild- oder Massenstudio-Logik.',
    heroEmphasis: 'Fotografie.',
    heroTitle: 'Portrait',
    intent: 'Die Hauptseite sammelt private, berufliche, redaktionelle und persoenliche Portrait-Suchen.',
    output: 'Portraitfotografie fuer Personal Branding, Business, Editorial, Dating, Paar und private Serien.',
    planning: 'Person, Wirkung, Ort, Kleidung, Licht und Ausgabe werden vorab besprochen.',
    related: 'Die Hauptseite verteilt sauber zu Dating, Gutschein, Preisen, Beleuchtung und Schwarz-Weiss.',
    sectionEmphasis: 'Wirkung.',
    sectionHeadline: 'Blick und',
  }),
  'portrait-fotoshooting': simpleKeywordCopy('Portrait Fotoshooting', {
    cards: ['Privat', 'Profil', 'Paar', 'Brand'],
    feature: 'Portrait Fotoshooting ist der breite Buchungsintent und muss Anlass, Person und Wirkung klar fuehren.',
    heroEmphasis: 'buchen.',
    heroTitle: 'Portrait Fotoshooting',
    intent: 'Suchende wollen gute Bilder von sich oder anderen, ohne Passbild- oder Standardstudio-Charakter.',
    output: 'Portrait Fotoshooting fuer Profile, Dating, Paar, Familie, Personal Branding und private Bilder.',
    planning: 'Vorbereitung, Ort, Licht, Kleidung und Bildauswahl werden so einfach wie moeglich gehalten.',
    related: 'Die Seite fuehrt zu Dating, Gutschein, Preise, Paar/Familie und Personal Branding.',
    sectionEmphasis: 'Richtung.',
    sectionHeadline: 'Portrait mit',
  }),
  'business-portrait': simpleKeywordCopy('Business Portrait', {
    cards: ['Profil', 'Website', 'Team', 'Vertrauen'],
    feature: 'Business Portraits muessen professionell wirken, ohne die Person glattzubuegeln.',
    heroEmphasis: 'professionell.',
    heroTitle: 'Business Portrait',
    intent: 'Suchende brauchen Bilder fuer Website, LinkedIn, Presse, Bewerbung oder Teamseite.',
    output: 'Business Portraits fuer Selbststaendige, Fuehrungskraefte, Teams, Praxen, Kanzleien und Agenturen.',
    planning: 'Branche, Wirkung, Hintergrund, Kleidung, Licht und Wiederverwendbarkeit werden vorab geklaert.',
    related: 'Die Seite grenzt Business Portrait von Headshot, Personal Branding und Unternehmensportrait ab.',
    sectionEmphasis: 'Vertrauen.',
    sectionHeadline: 'Professionell mit',
  }),
  'headshot-fotograf': simpleKeywordCopy('Headshot Fotograf', {
    cards: ['Kopfportrait', 'Profil', 'Presse', 'Klarheit'],
    feature: 'Headshots brauchen Reduktion: Blick, Licht, Hauttoene und Haltung muessen sofort funktionieren.',
    heroEmphasis: 'klar.',
    heroTitle: 'Headshot Fotograf',
    intent: 'Die Anfrage ist enger als klassische Portraitfotografie und meist profil- oder pressebezogen.',
    output: 'Headshot Fotograf fuer LinkedIn, Website, Presse, Bewerbung, Speaker und Teams.',
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
    intent: 'Suchende brauchen mehr als ein Profilbild: eine Bildwelt fuer Website, Social und Angebot.',
    output: 'Personal Branding Fotografie fuer Selbststaendige, Founder, Speaker, Coaches und Experten.',
    planning: 'Positionierung, Themen, Orte, Kleidung, Requisiten und Formate werden als Content-Plan gedacht.',
    related: 'Die Seite grenzt sich von Business Portrait und Headshot ab, verlinkt aber bewusst dorthin.',
    sectionEmphasis: 'Auftritt.',
    sectionHeadline: 'Person als',
  }),
  'dating-fotoshooting': simpleKeywordCopy('Dating Fotoshooting', {
    cards: ['Natuerlich', 'Profil', 'Alltag', 'Auswahl'],
    feature: 'Datingbilder muessen sympathisch wirken und duerfen nicht wie eine fremde Kampagne aussehen.',
    heroEmphasis: 'echt.',
    heroTitle: 'Dating Fotoshooting',
    intent: 'Suchende wollen bessere Bilder fuer Dating-Apps, Social Media oder private Profile.',
    output: 'Dating Fotoshooting fuer natuerliche Profilbilder ohne steife Studio-Posen.',
    planning: 'Location, Kleidung, Ausdruck, Ganzkoerperbild und Auswahl fuer das Profil werden zusammen geplant.',
    related: 'Die Seite bleibt bei Portraits und fuehrt zu Preisen und Portrait Fotoshooting.',
    sectionEmphasis: 'Profil.',
    sectionHeadline: 'Sympathisch im',
  }),
  'fotoshooting-gutschein': simpleKeywordCopy('Fotoshooting Gutschein', {
    cards: ['Geschenk', 'Flexibel', 'Einloesen', 'Shootingart'],
    feature: 'Ein Gutschein muss offen genug sein, damit Portrait, Paar, Familie oder Auto spaeter passend gewaehlt werden koennen.',
    heroEmphasis: 'schenken.',
    heroTitle: 'Fotoshooting Gutschein',
    intent: 'Suchende wollen ein Geschenk, aber oft noch keine finale Shootingart festlegen.',
    output: 'Fotoshooting Gutschein fuer Portrait, Paar, Familie, Auto-Fotoshooting und besondere Anlaesse.',
    planning: 'Wert, Anlass, Einloesung, Stil und moegliche Shootingarten werden einfach geklaert.',
    related: 'Die Seite verbindet Portrait, Paar/Familie, Auto-Fotoshooting und Preise.',
    sectionEmphasis: 'Spielraum.',
    sectionHeadline: 'Geschenk mit',
  }),
  'fotoshooting-preise': simpleKeywordCopy('Fotoshooting Preise', {
    cards: ['Umfang', 'Nutzung', 'Ort', 'Angebot'],
    feature: 'Preis-Suchen brauchen Transparenz ueber Aufwand, Nutzung und Ausgabe statt starre Billigpakete.',
    heroEmphasis: 'transparent.',
    heroTitle: 'Fotoshooting Preise',
    intent: 'Suchende wollen Orientierung, was ein Shooting kostet und warum Preise variieren.',
    output: 'Fotoshooting Preise fuer Portrait, Auto, Sportwagen, Paar, Familie und individuelle Bildserien.',
    planning: 'Shootingart, Dauer, Location, Bildanzahl, Retusche und Nutzungsrechte werden getrennt betrachtet.',
    related: 'Die Seite fuehrt zu den passenden Leistungsseiten und ersetzt keine konkrete Anfrage.',
    sectionEmphasis: 'Kontext.',
    sectionHeadline: 'Preis mit',
  }),
  'portraitfotografie-beleuchtung': simpleKeywordCopy('Portraitfotografie Beleuchtung', {
    cards: ['Fensterlicht', 'Mobiles Licht', 'Kontrast', 'Look'],
    feature: 'Die Ratgeberseite erklaert Licht als Bildsprache und nicht als Technikliste.',
    heroEmphasis: 'Licht.',
    heroTitle: 'Portrait Beleuchtung',
    intent: 'Suchende interessieren sich fuer Lichtwirkung, Setup und professionelle Portraitanmutung.',
    output: 'Portraitfotografie Beleuchtung fuer natuerliche, kontrollierte und editorial wirkende Portraits.',
    planning: 'Wirkung, Ort, vorhandenes Licht, mobiles Setup und finaler Look werden vor dem Shooting geklaert.',
    related: 'Die Seite verbindet Portrait Fotoshooting, Schwarz-Weiss und Personal Branding.',
    sectionEmphasis: 'Kontur.',
    sectionHeadline: 'Licht mit',
  }),
  'paarshooting-familienshooting': simpleKeywordCopy('Paarshooting und Familienshooting', {
    cards: ['Paar', 'Kleine Familie', 'Zuhause', 'Outdoor'],
    feature: 'Paar- und Familienshootings leben von Naehe, Bewegung und kleinen Momenten statt starrer Aufstellung.',
    heroEmphasis: 'natuerlich.',
    heroTitle: 'Paar und Familie',
    intent: 'Suchende wollen persoenliche Bilder von zwei Menschen oder kleinen Familien.',
    output: 'Paarshooting und Familienshooting fuer ruhige, natuerliche Serien ohne Gruppenfoto-Fokus.',
    planning: 'Konstellation, Ort, Stimmung, Kinder, Licht und Tempo werden entspannt vorbereitet.',
    related: 'Die Seite bleibt bewusst bei Portraits und grenzt grosse Gruppen aus.',
    sectionEmphasis: 'Naehe.',
    sectionHeadline: 'Menschen mit',
  }),
  'schwarz-weiss-portrait-fotografie': simpleKeywordCopy('Schwarz-Weiss Portrait Fotografie', {
    cards: ['Kontrast', 'Tonwerte', 'Editorial', 'Print'],
    feature: 'Schwarz-Weiss ist kein Filter, sondern eine Entscheidung fuer Licht, Blick, Form und Haltung.',
    heroEmphasis: 'reduziert.',
    heroTitle: 'Schwarz-Weiss Portrait',
    intent: 'Suchende wollen zeitlose, markante oder kuenstlerisch reduzierte Portraits.',
    output: 'Schwarz-Weiss Portrait Fotografie fuer Profil, Editorial, Personal Branding, Print und private Serien.',
    planning: 'Licht, Kontrast, Kleidung, Hintergrund und Tonwerte werden bereits beim Shooting mitgedacht.',
    related: 'Die Seite verlinkt zu Beleuchtung, Portrait Fotoshooting und Personal Branding.',
    sectionEmphasis: 'Tonwert.',
    sectionHeadline: 'Kontrast und',
  }),
  unternehmensportrait: simpleKeywordCopy('Unternehmensportrait', {
    cards: ['Team', 'Fuehrung', 'Raeume', 'Vertrauen'],
    feature: 'Unternehmensportraits zeigen Menschen, Arbeit, Raeume und Haltung in einer konsistenten Bildsprache.',
    heroEmphasis: 'zeigen.',
    heroTitle: 'Unternehmensportrait',
    intent: 'Suchende brauchen Bilder fuer Website, PR, Recruiting, Teamseiten oder Unternehmenskommunikation.',
    output: 'Unternehmensportrait fuer Teams, Fuehrungskraefte, Praxen, Kanzleien, Agenturen und Mittelstand.',
    planning: 'Personen, Ablauf, Location, Bildliste, Nutzungsrechte und interne Abstimmung werden vorab sortiert.',
    related: 'Die Seite trennt Unternehmensportrait von Business Portrait und Personal Branding.',
    sectionEmphasis: 'Organisation.',
    sectionHeadline: 'Menschen im',
  }),
  pressefoto: simpleKeywordCopy('Pressefoto', {
    cards: ['PR', 'Speaker', 'Redaktion', 'Dateiformate'],
    feature: 'Pressefotos brauchen klare Aussage, schnelle Nutzbarkeit und saubere Formate fuer Redaktionen.',
    heroEmphasis: 'bereit.',
    heroTitle: 'Pressefoto',
    intent: 'Suchende brauchen Bilder fuer Medien, Vortraege, Interviews, Pressekit oder Website.',
    output: 'Pressefoto fuer Unternehmer, Kuenstler, Speaker, PR, Redaktion und Personal Branding.',
    planning: 'Aussage, Hintergrund, Quer-/Hochformat, Freistellung, Dateinamen und Nutzungsrechte werden mitgedacht.',
    related: 'Die Seite fuehrt zu Headshot, Business Portrait und Personal Branding.',
    sectionEmphasis: 'Redaktion.',
    sectionHeadline: 'Bild fuer',
  }),
  landschaftsfotografie: simpleKeywordCopy('Landschaftsfotografie', {
    cards: ['Motiv', 'Raum', 'Material', 'Edition'],
    feature: 'Landschaftsfotografie wird hier als kuratierte Bild- und Printwelt fuer Raeume verstanden.',
    heroEmphasis: 'Fotografie.',
    heroTitle: 'Landschaft',
    intent: 'Suchende interessieren sich fuer Motive, Ruhe, Raumwirkung, Druck und Editionen.',
    output: 'Landschaftsfotografie als Fine-Art-Print, Wandbild, Edition und grossformatige Arbeit.',
    planning: 'Motiv, Format, Material, Raumlicht und Lieferung werden als Printprojekt geplant.',
    related: 'Die Hauptseite fuehrt zu Landschaftsbilder kaufen, Fine-Art-Prints, Wandbildern und Naturfotografie-Prints.',
    sectionEmphasis: 'Raum.',
    sectionHeadline: 'Motiv und',
  }),
  'landschaftsfotografie-print': simpleKeywordCopy('Landschaftsfotografie Print', {
    cards: ['Motivwahl', 'Material', 'Format', 'Lieferung'],
    feature: 'Print-Anfragen brauchen mehr Material-, Format- und Raumberatung als die allgemeine Landschaftsseite.',
    heroEmphasis: 'Print.',
    heroTitle: 'Landschaftsfotografie',
    intent: 'Suchende wollen Landschaftsbilder als fertigen Druck fuer Wand, Praxis, Hotel oder Sammlung.',
    output: 'Landschaftsfotografie Print fuer Fine-Art-Papier, Aluminium, Acrylglas, Edition und Sonderformat.',
    planning: 'Motiv, Groesse, Material, Raumwirkung, Helligkeit und Montage werden gemeinsam geplant.',
    related: 'Die Seite trennt Printberatung von Portfolio- und Landschafts-Hauptseite.',
    sectionEmphasis: 'Material.',
    sectionHeadline: 'Print mit',
  }),
  landschaftsbilder: simpleKeywordCopy('Landschaftsbilder kaufen', {
    cards: ['Auswahl', 'Wohnraum', 'Praxis', 'Geschenk'],
    feature: 'Kauf-Suchende brauchen Orientierung zu Motiv, Format, Material und Wirkung im Raum.',
    heroEmphasis: 'kaufen.',
    heroTitle: 'Landschaftsbilder',
    intent: 'Hier soll ein Bild ausgewaehlt und als fertiges Objekt bestellt werden.',
    output: 'Landschaftsbilder kaufen als Fine-Art-Print, Wandbild, Edition oder grossformatige Arbeit.',
    planning: 'Raum, Wandgroesse, Farbigkeit, Material und Lieferziel bestimmen die Empfehlung.',
    related: 'Die Seite fuehrt weiter zu Fine-Art-Prints, Wandbildern und Druck/Sonderanfertigung.',
    sectionEmphasis: 'Auswahl.',
    sectionHeadline: 'Bild fuer',
  }),
  'fine-art-prints': simpleKeywordCopy('Fine-Art-Prints Landschaft', {
    cards: ['Papier', 'Tonwert', 'Edition', 'Sammlung'],
    feature: 'Fine-Art-Prints brauchen mehr Fokus auf Papier, Farbstabilitaet, Tonwert und Haptik.',
    heroEmphasis: 'Fine-Art.',
    heroTitle: 'Fine-Art-Prints',
    intent: 'Suchende wollen hochwertige Drucke, nicht nur digitale Landschaftsbilder.',
    output: 'Fine-Art-Prints Landschaft fuer Wohnraum, Praxis, Sammlung, Edition und Geschenk.',
    planning: 'Motiv, Papier, Format, Rand, Signatur, Rahmung und Lieferung werden abgestimmt.',
    related: 'Die Seite grenzt Fine-Art-Papier von Wandbildern, Acrylglas und Aluminium ab.',
    sectionEmphasis: 'Papier.',
    sectionHeadline: 'Print auf',
  }),
  'wandbilder-landschaftsfotografie': simpleKeywordCopy('Wandbilder Landschaftsfotografie', {
    cards: ['Wandgroesse', 'Material', 'Raumwirkung', 'Montage'],
    feature: 'Wandbilder brauchen Planung aus Sicht des Raums: Groesse, Abstand, Licht und Material entscheiden.',
    heroEmphasis: 'Wandbild.',
    heroTitle: 'Wandbilder',
    intent: 'Suchende wollen Landschaftsfotografie als sichtbares Objekt fuer Wand, Praxis, Hotel oder Buero.',
    output: 'Wandbilder Landschaftsfotografie auf Fine-Art-Papier, Aluminium, Acrylglas oder als Sonderformat.',
    planning: 'Raumfoto, Wandmass, Licht, Farbigkeit, Format und Montageart werden beruecksichtigt.',
    related: 'Die Seite verlinkt zu Landschaftsbilder kaufen, Fine-Art-Prints und Druck/Sonderanfertigung.',
    sectionEmphasis: 'Raum.',
    sectionHeadline: 'Wandbild mit',
  }),
  'naturfotografie-prints': simpleKeywordCopy('Naturfotografie Prints', {
    cards: ['Naturmotiv', 'Ruhe', 'Material', 'Edition'],
    feature: 'Naturfotografie-Prints setzen staerker auf Ruhe, Motivwirkung und Material als auf lokale Shooting-Anfragen.',
    heroEmphasis: 'Prints.',
    heroTitle: 'Naturfotografie',
    intent: 'Suchende wollen Naturmotive als hochwertige Drucke fuer private oder gewerbliche Raeume.',
    output: 'Naturfotografie Prints fuer Wohnraum, Praxis, Hotel, Buero, Sammlung und Geschenk.',
    planning: 'Motivstimmung, Format, Material, Raumlicht und Lieferziel werden passend ausgewaehlt.',
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
      'Auto fotografieren Tipps zu Licht, Perspektive, Reflexen und Details. Professionelle Automobilfotografie fuer private Fahrzeuge, Verkauf und Marke.',
    contactLead:
      'Wenn aus den Tipps ein professioneller Bildsatz werden soll, schreibe kurz, welches Fahrzeug fotografiert werden soll, wo es steht und ob die Bilder fuer Verkauf, privat, Marke oder Social gedacht sind.',
    pullKicker: 'Praxisleitfaden',
    pullHeadline: 'Tipps, die zum',
    pullEmphasis: 'Bildsatz fuehren.',
    pullLead:
      'Diese Seite beantwortet zuerst praktische Fragen: Licht, Standort, Brennweite und Reflexe. Danach wird klar, wann ein professionelles Auto-Shooting den Unterschied zwischen Einzelbild und verwendbarer Serie macht.',
    sectionHeadline: 'Licht, Linien,',
    sectionEmphasis: 'Reflexe.',
    sectionLead:
      'Gute Autofotos beginnen vor der Kamera: saubere Flaechen, ruhiger Hintergrund, ein planbares Lichtfenster und ein Ablauf, der Exterieur, Interieur und Details getrennt denkt.',
    featureTitle: 'Erst sehen, dann ausloesen.',
    featureBody:
      'Viele Fehler entstehen, weil das Fahrzeug wie ein normales Motiv behandelt wird. Entscheidend sind Karosseriekanten, Spiegelungen im Lack, Radstellung, Hoehe der Kamera und ein klarer Zweck fuer jedes Bild.',
    galleryHeadline: 'Tipps als Bildbeispiele.',
    galleryLead:
      'Die Motive zeigen typische Entscheidungen aus einem Auto-Shooting: ruhige Linien, Materialdetails, Innenraum und Lichtstimmung.',
    audienceHeadline: 'Fuer wen diese Tipps nuetzlich sind.',
    audienceLead:
      'Die Tipps helfen beim Einstieg. Wenn die Bilder verkaufen, ueberzeugen oder als hochwertige Erinnerung bleiben sollen, wird aus dem Wissen ein sauber geplanter Bildsatz.',
    cards: [
      { label: 'Privat', title: 'Besitzer', text: 'Lieblingsfahrzeug besser zeigen, ohne dass die Bilder zufaellig oder nach Handy-Snapshot wirken.' },
      { label: 'Verkauf', title: 'Inserate', text: 'Perspektiven und Details so planen, dass Zustand, Wertigkeit und Ausstattung klar lesbar werden.' },
      { label: 'Content', title: 'Social Media', text: 'Mehrere Motive aus einer Location holen: Front, Heck, Seite, Cockpit und kleine Details.' },
      { label: 'Marke', title: 'Professionelle Serie', text: 'Wenn ein Fahrzeug wiederholt eingesetzt wird, braucht die Bildsprache System statt Zufall.' },
    ],
    relatedLead:
      'Auto fotografieren Tipps sind der Einstieg in bessere Fahrzeugbilder. Von hier fuehren die passenden Links zu konkreten Shootings, Verkaufsbildern und spezialisierten Fahrzeugbereichen.',
  },
  'auto-fotoshooting': {
    heroLead:
      'Auto-Fotoshooting fuer private Fahrzeuge, Sportwagen, Oldtimer, Autohaeuser und Marken. Exterieur, Interieur, Details und Cinematic werden als nutzbare Serie geplant - mit derselben Bildsprache wie die Automobil-Hauptseite.',
    metaDescription:
      'Auto-Fotoshooting fuer private Fahrzeuge, Sportwagen, Oldtimer, Verkauf und Marke. Automobilfotografie in Duesseldorf, NRW und DACH.',
    contactLead:
      'Schreibe kurz, welches Auto im Mittelpunkt steht, ob es um private Erinnerung, Verkauf, Marke oder Social geht und welcher Ort oder Zeitraum moeglich ist.',
    pullKicker: 'Shootingplanung',
    pullHeadline: 'Ein Auto-Fotoshooting mit',
    pullEmphasis: 'klarem Zweck.',
    pullLead:
      'Beim Auto-Fotoshooting geht es nicht um eine schoene Einzelaufnahme, sondern um eine Serie, die nachher wirklich nutzbar ist: Hero-Motiv, Details, Innenraum, Social-Crops und bei Bedarf Verkaufsbilder.',
    sectionHeadline: 'Von der Karosserie bis zur',
    sectionEmphasis: 'Atmosphaere.',
    sectionLead:
      'Das Fahrzeug wird in mehreren Ebenen fotografiert: Totale fuer Proportion, Detail fuer Wertigkeit, Interieur fuer Material und Stimmungsbilder fuer Charakter.',
    featureTitle: 'Geplant statt gesucht.',
    featureBody:
      'Vor dem Termin werden Zustand, Location, Lichtfenster und Nutzung geklaert. So entsteht ein ruhiger Ablauf, bei dem Lack, Linien und Ausstattung nicht dem Zufall ueberlassen werden.',
    galleryHeadline: 'Bildserie statt Einzelmotiv.',
    galleryLead:
      'Die Galerie steht fuer den Mix, den ein Auto-Fotoshooting braucht: starke Hauptmotive, kleine Detailbilder und nutzbare Formate fuer Website, Social und Druck.',
    audienceHeadline: 'Auto-Fotoshooting fuer konkrete Anlaesse.',
    audienceLead:
      'Die Seite richtet sich an Menschen und Marken, die ein Fahrzeug nicht nur dokumentieren, sondern bewusster zeigen moechten.',
    cards: [
      { label: 'Privat', title: 'Lieblingsfahrzeug', text: 'Ein sauberer Bildsatz fuer Erinnerung, Geschenk oder Portfolio des eigenen Autos.' },
      { label: 'Verkauf', title: 'Inserat & Auktion', text: 'Bilder, die Ausstattung, Pflegezustand und Charakter nachvollziehbar zeigen.' },
      { label: 'Marke', title: 'Content-Serie', text: 'Motive fuer Website, Kampagne, Social Media und wiederkehrende Kommunikation.' },
      { label: 'Sammlung', title: 'Archiv', text: 'Ruhige Serien fuer Sammlerfahrzeuge, Umbauten oder besondere Fahrzeuggeschichten.' },
    ],
    relatedLead:
      'Auto-Fotoshooting bleibt der breite Einstieg. Wer spezieller sucht, findet eigene Seiten fuer Bilder mit Auto, Fotoshooting mit Auto, Sportwagen, Oldtimer und Motorrad.',
  },
  'bilder-mit-auto': {
    heroLead:
      'Bilder mit Auto fuer Besitzer, Sammler, Content, Geschenkideen und hochwertige Verkaufsauftritte. Fahrzeug, Mensch, Location und Licht werden so verbunden, dass das Auto nicht nur dokumentiert, sondern inszeniert wird.',
    metaDescription:
      'Bilder mit Auto als professionelles Shooting fuer Besitzer, Verkauf, Social Media und Markenauftritt. Automobilfotografie in NRW.',
    contactLead:
      'Schreibe kurz, ob das Auto allein, mit Person oder als komplette Serie fotografiert werden soll und wofuer die Bilder spaeter genutzt werden.',
    pullKicker: 'Auto und Mensch',
    pullHeadline: 'Bilder mit Auto,',
    pullEmphasis: 'nicht nur vom Auto.',
    pullLead:
      'Diese Anfrage ist breiter als klassische Automobilfotografie. Hier geht es oft um Besitzer, Paar, Geschenk, Social Content oder eine Geschichte, in der das Fahrzeug Teil der Identitaet ist.',
    sectionHeadline: 'Fahrzeug, Person,',
    sectionEmphasis: 'Szene.',
    sectionLead:
      'Die Serie kann das Auto allein zeigen oder Mensch und Fahrzeug zusammenbringen. Wichtig ist, dass Pose, Abstand und Location natuerlich bleiben und das Auto nicht wie eine Requisite wirkt.',
    featureTitle: 'Nahe am Besitzer.',
    featureBody:
      'Bei Bildern mit Auto wird die Inszenierung persoenlicher: Sitzposition, Blickrichtung, Kleidung und Umgebung entscheiden, ob das Motiv authentisch oder gestellt wirkt.',
    galleryHeadline: 'Zwischen Portrait und Fahrzeug.',
    galleryLead:
      'Die Bildauswahl kann ruhige Fahrzeugmotive, Detailaufnahmen und Motive mit Person mischen, damit die Seite sowohl Auto- als auch Shooting-Suchende abholt.',
    audienceHeadline: 'Bilder mit Auto fuer persoenliche Motive.',
    audienceLead:
      'Geeignet fuer alle, die das Fahrzeug als Teil einer Geschichte zeigen moechten - vom neuen Sportwagen bis zum Oldtimer mit emotionalem Wert.',
    cards: [
      { label: 'Besitzer', title: 'Du mit deinem Auto', text: 'Natuerliche Motive, die Verbindung und Charakter zeigen, ohne uebertrieben zu posen.' },
      { label: 'Geschenk', title: 'Ueberraschung', text: 'Ein Shooting als Erlebnis fuer Menschen, die ihr Fahrzeug wirklich feiern.' },
      { label: 'Social', title: 'Content', text: 'Eine abwechslungsreiche Serie fuer Profilbilder, Posts, Reels-Cover und Story-Motive.' },
      { label: 'Paar', title: 'Gemeinsame Bilder', text: 'Wenn Auto, Menschen und Location zusammen eine kleine Strecke ergeben sollen.' },
    ],
    relatedLead:
      'Bilder mit Auto verbindet Portrait- und Automobilfotografie. Deshalb fuehrt die Seite zu Auto-Fotoshooting, Portrait und spezialisierten Fahrzeugbereichen.',
  },
  'fotoshooting-mit-auto': {
    heroLead:
      'Fotoshooting mit Auto: ideal fuer Lieblingsfahrzeuge, Sportwagen, Oldtimer, Geschenkideen und Content-Serien. Die Seite verbindet Fahrzeug, Mensch und Anlass zu einer planbaren Shootingstrecke.',
    metaDescription:
      'Fotoshooting mit Auto fuer private Fahrzeuge, Sportwagen, Oldtimer und Content. Professionelle Automobilfotografie in Duesseldorf und NRW.',
    contactLead:
      'Schreibe kurz, welches Fahrzeug dabei ist, ob Menschen mit aufs Bild sollen und welche Stimmung die Serie bekommen soll.',
    pullKicker: 'Shootingidee',
    pullHeadline: 'Fotoshooting mit Auto als',
    pullEmphasis: 'Erlebnis.',
    pullLead:
      'Viele suchen nicht nach reiner Fahrzeugfotografie, sondern nach einem Shooting mit Auto: persoenlich, planbar und mit Bildern, die sowohl das Fahrzeug als auch den Anlass tragen.',
    sectionHeadline: 'Mehr als ein',
    sectionEmphasis: 'Parkplatzfoto.',
    sectionLead:
      'Der Ablauf wird auf die gewuenschte Stimmung angepasst: urban, ruhig, sportlich, nostalgisch oder clean. Daraus entstehen Motive fuer Menschen, Fahrzeug und Details.',
    featureTitle: 'Das Auto gibt den Rahmen.',
    featureBody:
      'Ein gutes Fotoshooting mit Auto braucht Balance. Das Fahrzeug soll wirken, ohne alle Aufmerksamkeit zu verschlucken; Menschen sollen natuerlich aussehen, ohne das Auto nur als Hintergrund zu nutzen.',
    galleryHeadline: 'Shootingstrecke mit Fahrzeug.',
    galleryLead:
      'Die Motive zeigen, wie Hauptbild, Details, Innenraum und Atmosphaere als kleine Strecke zusammenspielen koennen.',
    audienceHeadline: 'Passend fuer Anlass und Nutzung.',
    audienceLead:
      'Die Seite holt Geschenk-, Privat- und Content-Anfragen ab und fuehrt sie in eine professionell geplante Automobilserie.',
    cards: [
      { label: 'Privat', title: 'Lieblingsauto', text: 'Ein persoenlicher Bildsatz fuer Erinnerung, Wandbild oder Social-Profil.' },
      { label: 'Geschenk', title: 'Gutscheinidee', text: 'Ein Shooting, das beim Einloesen flexibel auf Person und Fahrzeug abgestimmt wird.' },
      { label: 'Content', title: 'Profil & Feed', text: 'Mehrere Motive in konsistentem Stil fuer Posts, Website oder Portfolio.' },
      { label: 'Besonderes Auto', title: 'Sportwagen & Oldtimer', text: 'Fahrzeuge mit Charakter bekommen mehr Raum fuer Details, Linien und Geschichte.' },
    ],
    relatedLead:
      'Fotoshooting mit Auto sitzt bewusst unter Automobilfotografie und verbindet zu Gutschein-, Portrait- und Sportwagen-Seiten, weil Anlass, Person und Fahrzeug haeufig zusammengehoeren.',
  },
  'motorsport-fotografie': {
    heroLead:
      'Motorsport Fotografie fuer Fahrzeuge, Teams, Trackdays, Clubs und Performance-Content. Fokus liegt auf Dynamik, Linien, Details und einem Bildsatz, der Event, Fahrzeug und Marke zusammenhaelt.',
    metaDescription:
      'Motorsport Fotografie fuer Trackdays, Clubs, Teams und Performance-Fahrzeuge. Sportwagen- und Automobilfotografie aus NRW.',
    contactLead:
      'Schreibe kurz, welches Motorsport- oder Trackday-Format geplant ist, welche Fahrzeuge dabei sind und welche Nutzung die Bilder haben sollen.',
    statementHeadline: 'Motorsport braucht',
    statementEmphasis: 'Tempo und Ordnung.',
    statementBody: [
      'Motorsport Fotografie muss Geschwindigkeit zeigen, ohne dass die Serie unruhig wird. Deshalb werden Standort, Licht, Bewegungsrichtung und sichere Blickachsen vor dem Einsatz mitgedacht.',
      'Neben Action zaehlen Details: Fahrer, Boxengasse, Reifen, Bremsen, Material, Team und Atmosphaere. So entsteht Content, der Event und Fahrzeug nicht voneinander trennt.',
    ],
    sectionHeadline: 'Track, Team,',
    sectionEmphasis: 'Fahrzeug.',
    sectionLead:
      'Der Bildsatz verbindet dynamische Motive mit ruhigen Detailbildern. Dadurch kann die Serie fuer Club, Website, Social Media, Sponsoren oder private Erinnerung genutzt werden.',
    galleryHeadline: 'Motorsport in Sequenzen.',
    galleryLead:
      'Die Auswahl denkt in Serien: Hero-Frame, Bewegung, Detail, Umfeld und Stimmungsbild statt nur ein einzelner Mitzieher.',
    audienceHeadline: 'Fuer Trackdays, Clubs und Teams.',
    audienceLead:
      'Motorsport Fotografie lohnt sich, wenn ein Event nicht nur dokumentiert, sondern als wiederverwendbarer Content aufgebaut werden soll.',
    cards: [
      { label: 'Trackday', title: 'Fahrer & Fahrzeuge', text: 'Dynamische Motive auf Strecke plus ruhige Bilder im Fahrerlager.' },
      { label: 'Club', title: 'Events', text: 'Eine Strecke fuer Mitglieder, Social Media, Rueckblick und Website.' },
      { label: 'Team', title: 'Sponsorencontent', text: 'Fahrzeug, Fahrer, Details und Umfeld als konsistente Kommunikationsbasis.' },
      { label: 'Privat', title: 'Performance Cars', text: 'Sportliche Fahrzeuge mit Bewegung, Standbild und Materialdetails.' },
    ],
    relatedLead:
      'Motorsport Fotografie fuehrt zu Sportwagen und Performance Cars, bleibt aber eigenstaendig: Action, Event und Trackday brauchen eine andere Bildsprache als ein ruhiges Sportwagen-Shooting.',
  },
  'motorsport-sportwagen-fotografie': {
    heroLead:
      'Motorsport- und Sportwagen-Fotografie fuer Performance Cars, Trackdays, Clubs, Sammler und Marken. Standbilder, Details und dynamische Motive werden als zusammenhaengende Serie geplant.',
    metaDescription:
      'Motorsport- und Sportwagen-Fotografie fuer Performance Cars, Trackdays, Clubs und Marken in NRW und DACH.',
    contactLead:
      'Schreibe kurz, welcher Sportwagen oder Motorsport-Kontext fotografiert werden soll, ob Standbilder, Details oder Action im Fokus stehen und wofuer die Serie genutzt wird.',
    statementHeadline: 'Performance sichtbar',
    statementEmphasis: 'machen.',
    statementBody: [
      'Motorsport- und Sportwagen-Fotografie sitzt zwischen zwei Welten: praezise Standbilder fuer Form und Material, dynamische Bilder fuer Tempo, Sound und Charakter.',
      'Die Serie wird so geplant, dass sie fuer Sammler, Clubs, Trackdays und Marken funktioniert. Nicht jedes Motiv muss schnell sein; wichtig ist, dass jedes Bild die Performance glaubwuerdig erzaehlt.',
    ],
    sectionHeadline: 'Standbild und',
    sectionEmphasis: 'Bewegung.',
    sectionLead:
      'Exterieur, Interieur, Details und Action werden als zusammenhaengende Strecke gedacht. So entstehen Motive fuer Website, Social, Druck und redaktionelle Nutzung.',
    galleryHeadline: 'Performance als Bildsprache.',
    galleryLead:
      'Die Galerie bleibt visuell im Sportwagen-Layout, aber die Texte rahmen sie als Mischung aus Motorsport, Fahrzeugportrait und Detailserie.',
    audienceHeadline: 'Fuer Besitzer, Clubs und Marken.',
    audienceLead:
      'Die Seite holt Suchende ab, die Motorsport und Sportwagen nicht trennen wollen: Trackday, Performance Car, Event, Sammlung oder Kampagne.',
    cards: [
      { label: 'Sportwagen', title: 'Besitzer & Sammler', text: 'Hochwertige Motive fuer Fahrzeuge, die mehr brauchen als normale Verkaufsbilder.' },
      { label: 'Motorsport', title: 'Trackday & Club', text: 'Action, Fahrerlager und Details als Serie fuer Event und Community.' },
      { label: 'Marke', title: 'Performance Content', text: 'Bildsprache fuer Launches, Social Media, Website oder redaktionelle Strecken.' },
      { label: 'Druck', title: 'Fine Details', text: 'Ruhige Frames, die Linien, Material und Innenraum grossformatig tragen.' },
    ],
    relatedLead:
      'Diese Seite ist die Bruecke zwischen Sportwagen- und Motorsport-Suche. Darum verlinkt sie bewusst weiter zu Automobil, Oldtimer und Motorrad, ohne die Hauptkategorie zu verlassen.',
  },
  'portrait-fotoshooting': {
    heroLead:
      'Portrait Fotoshooting fuer Menschen, die keine austauschbaren Bilder wollen: ruhig, nahbar, klar gefuehrt und passend zu Nutzung, Person und Wirkung.',
    metaDescription:
      'Portrait Fotoshooting fuer Personal Branding, Dating, Paar, Familie, Editorial und professionelle Profile in Duesseldorf und NRW.',
    contactLead:
      'Schreibe kurz, fuer wen das Portrait Fotoshooting gedacht ist, welche Wirkung du dir wuenschst und ob es um privat, Profil, Dating, Paar, Familie oder Personal Branding geht.',
    pullHeadline: 'Portraits mit Richtung,',
    pullEmphasis: 'nicht mit Pose.',
    statementBody: [
      'Ein Portrait Fotoshooting beginnt mit der Frage, wofuer die Bilder gebraucht werden. Profil, Dating, Paar, Familie oder Personal Branding brauchen jeweils andere Distanz, anderes Licht und eine andere Bildauswahl.',
      'Die Regie bleibt ruhig und konkret. Es geht nicht darum, jemanden zu verkleiden, sondern Blick, Haltung und Umgebung so zu fuehren, dass die Person erkennbar bleibt.',
    ],
    sectionHeadline: 'Vom privaten Bild bis zum',
    sectionEmphasis: 'Auftritt.',
    sectionLead:
      'Diese Seite sammelt die breiten Portrait-Anfragen und fuehrt sie in klare Shooting-Module, ohne Passbild- oder Studio-Massenware zu bedienen.',
    cards: [
      { label: 'Profil', title: 'Profilbilder', text: 'Klare Portraits fuer Website, LinkedIn, Dating oder Social Media mit passender Bildwirkung.' },
      { label: 'Privat', title: 'Persoenliche Serie', text: 'Ruhige Bilder fuer Menschen, die ein gutes Portrait von sich moechten, ohne kuenstlich zu wirken.' },
      { label: 'Paar', title: 'Zu zweit', text: 'Nahe Motive mit echter Verbindung, gefuehrt ohne steife Standardsituationen.' },
      { label: 'Familie', title: 'Kleine Familien', text: 'Natuerliche Serien fuer Familien, bei denen Stimmung wichtiger ist als perfekte Aufstellung.' },
      { label: 'Brand', title: 'Personal Branding', text: 'Portraits, die Person, Arbeit und Wirkung in eine konsistente Bildsprache bringen.' },
    ],
    processHeadline: 'Ablauf fuer ein Portrait Fotoshooting.',
    processLead:
      'Der Ablauf bleibt bewusst uebersichtlich: kurze Einordnung, Stilabstimmung, entspanntes Shooting und eine Auswahl, die zur spaeteren Nutzung passt.',
    processSteps: [
      { title: 'Ziel klaeren', text: 'Wir legen fest, ob die Bilder privat, beruflich, fuer Dating, Paar, Familie oder Personal Branding gedacht sind.' },
      { title: 'Stimmung setzen', text: 'Licht, Ort, Kleidung und Bildsprache werden so abgestimmt, dass du dich nicht verkleidet fuehlst.' },
      { title: 'Ruhig fotografieren', text: 'Beim Shooting bekommst du klare Regie, genug Zeit und zwischendurch Orientierung am Bild.' },
      { title: 'Auswahl treffen', text: 'Du bekommst eine kuratierte Vorauswahl und entscheidest, welche Motive final bearbeitet werden.' },
      { title: 'Fertig liefern', text: 'Die finalen Dateien kommen passend fuer Web, Social, Print oder persoenliche Nutzung.' },
    ],
    relatedLead:
      'Portrait Fotoshooting bleibt die breite Einstiegsseite. Die Unterseiten fuer Dating, Gutschein, Preise, Schwarz-Weiss und Beleuchtung greifen enger gefasste Anliegen auf.',
  },
  'portraitfotografie-beleuchtung': {
    heroLead:
      'Portraitfotografie Beleuchtung: Licht ist kein Effekt, sondern die Grundlage fuer Naehe, Kontur und Haltung. Diese Seite greift Suchende ab, die gezielt nach Licht, Setup und professioneller Portraitwirkung suchen.',
    metaDescription:
      'Portraitfotografie Beleuchtung: ruhige, professionelle Portraits mit passendem Licht fuer Profil, Personal Branding, Editorial und private Shootings.',
    contactLead:
      'Schreibe kurz, welche Lichtstimmung du suchst - weich, kontrastreich, natuerlich oder editorial - und wofuer die Portraits spaeter genutzt werden.',
    pullHeadline: 'Licht fuehrt den Blick,',
    pullEmphasis: 'nicht die Technik.',
    statementBody: [
      'Bei Portraitfotografie Beleuchtung geht es nicht um moeglichst viel Equipment. Entscheidend ist, ob das Licht Gesicht, Haltung und Stimmung unterstuetzt.',
      'Weiches Fensterlicht, gesetztes mobiles Licht oder ein kontrastreicher Look erzeugen voellig unterschiedliche Aussagen. Deshalb wird die Lichtwirkung vor dem Shooting bewusst gewaehlt.',
    ],
    sectionHeadline: 'Weich, klar oder',
    sectionEmphasis: 'kontrastreich.',
    sectionLead:
      'Diese Seite erklaert Licht als Teil der Bildsprache und nicht als technische Spielerei. Sie passt fuer Suchende, die bewusst nach Wirkung, Setup und professioneller Portraitanmutung suchen.',
    cards: [
      { label: 'Weich', title: 'Natuerliches Licht', text: 'Ruhige Portraits mit sanften Uebergaengen, ideal fuer nahbare Profile und private Serien.' },
      { label: 'Klar', title: 'Kontrolliertes Setup', text: 'Mobiles Licht fuer konsistente Ergebnisse, wenn Ort oder Tageszeit nicht alles leisten.' },
      { label: 'Kontur', title: 'Kantenlicht', text: 'Feine Trennung von Person und Hintergrund, ohne den Look kuenstlich wirken zu lassen.' },
      { label: 'Editorial', title: 'Kontrast', text: 'Staerkere Lichtsetzung fuer markante Portraits, Schwarz-Weiss-Serien oder Magazinwirkung.' },
      { label: 'Mix', title: 'Innen und aussen', text: 'Lichtstimmungen koennen innerhalb einer Serie wechseln, solange die Bildsprache zusammenhaelt.' },
    ],
    processHeadline: 'Lichtplanung vor dem Portrait.',
    processLead:
      'Vor dem Shooting wird nicht nur der Ort festgelegt, sondern auch die Lichtidee: natuerlich, ruhig, grafisch, kontrastreich oder editorial.',
    processSteps: [
      { title: 'Wirkung bestimmen', text: 'Wir klaeren, ob die Portraits weich, seriös, markant, ruhig oder redaktionell wirken sollen.' },
      { title: 'Ort pruefen', text: 'Fenster, Schatten, Wandfarbe und Hintergrund entscheiden, ob vorhandenes Licht reicht.' },
      { title: 'Setup waehlen', text: 'Bei Bedarf kommt mobiles Licht dazu, damit Augen, Kontur und Hauttöne kontrolliert bleiben.' },
      { title: 'Varianten fotografieren', text: 'Innerhalb des Termins koennen ruhige und staerkere Lichtstimmungen entstehen.' },
      { title: 'Look finalisieren', text: 'Die Bearbeitung bleibt zurueckhaltend und staerkt die geplante Lichtwirkung.' },
    ],
    relatedLead:
      'Portraitfotografie Beleuchtung eignet sich als fachlicher Ratgeber innerhalb des Portrait-Clusters und verlinkt zu Portrait Fotoshooting, Schwarz-Weiss und Personal Branding.',
  },
  'dating-fotoshooting': {
    heroLead:
      'Dating Fotoshooting fuer natuerliche, gute Portraits ohne steife Posen. Ziel sind Bilder, die sympathisch, klar und ehrlich wirken - fuer Datingprofile, Social Media und private Nutzung.',
    metaDescription:
      'Dating Fotoshooting fuer natuerliche Portraits in Duesseldorf und NRW. Authentische Bilder fuer Datingprofile, Social Media und private Nutzung.',
    contactLead:
      'Schreibe kurz, welche Plattform oder Wirkung wichtig ist und ob du eher natuerliche Outdoor-Bilder, ruhige Portraits oder eine kleine Serie moechtest.',
    pullHeadline: 'Datingbilder, die',
    pullEmphasis: 'echt wirken.',
    statementBody: [
      'Ein Dating Fotoshooting braucht keine kuenstliche Coolness. Gute Bilder zeigen Sympathie, Offenheit und ein bisschen Kontext, ohne wie eine Kampagne fuer eine fremde Person zu wirken.',
      'Die Serie wird so geplant, dass mehrere Situationen entstehen: klares Portrait, natuerliches Lachen, ruhige Ganzkoerperaufnahme und ein Bild mit Umgebung.',
    ],
    sectionHeadline: 'Sympathisch, klar,',
    sectionEmphasis: 'unverkrampft.',
    sectionLead:
      'Die Seite spricht Menschen an, die bessere Datingbilder moechten, aber keine gestellten Studiofotos. Der Look bleibt natuerlich und alltagstauglich.',
    cards: [
      { label: 'Profil', title: 'Erstes Bild', text: 'Ein klares Portrait, das freundlich wirkt und nicht ueberinszeniert ist.' },
      { label: 'Alltag', title: 'Natuerlicher Kontext', text: 'Motive mit Umgebung, damit dein Profil mehr zeigt als nur ein Gesicht.' },
      { label: 'Haltung', title: 'Ganzkoerper', text: 'Lockere Bilder mit Koerperhaltung, ohne starre Posen.' },
      { label: 'Auswahl', title: 'Serienlogik', text: 'Mehrere Bilder, die zusammen abwechslungsreich wirken und nicht wie derselbe Moment.' },
      { label: 'Ehrlich', title: 'Keine Maskerade', text: 'Die Bearbeitung bleibt realistisch, damit du auf dem Bild wiedererkannt wirst.' },
    ],
    processHeadline: 'Ablauf fuer Datingbilder.',
    processLead:
      'Der Termin bleibt leicht und praktisch: kurze Vorbereitung, passende Location, klare Regie und am Ende eine Auswahl fuer dein Profil.',
    processSteps: [
      { title: 'Profilziel klaeren', text: 'Wir sprechen kurz ueber Plattform, Bildwirkung und welche Seiten von dir sichtbar werden sollen.' },
      { title: 'Location waehlen', text: 'Outdoor, Cafe-Umfeld, ruhige Strasse oder schlichter Hintergrund - passend zu dir.' },
      { title: 'Locker starten', text: 'Wir beginnen mit einfachen Motiven, damit du ins Shooting reinkommst.' },
      { title: 'Varianten bauen', text: 'Portrait, Lachen, Ganzkoerper und Umfeld werden als kleine Profilserie fotografiert.' },
      { title: 'Profilauswahl liefern', text: 'Du bekommst bearbeitete Bilder, die fuer App, Social und private Nutzung funktionieren.' },
    ],
    relatedLead:
      'Dating Fotoshooting ist eine eigene Portrait-Anfrage. Von hier fuehren Links zu Portrait Fotoshooting, Preisen und Gutschein, ohne Passfoto-Themen aufzunehmen.',
  },
  'fotoshooting-gutschein': {
    heroLead:
      'Fotoshooting Gutschein als hochwertiges Geschenk: fuer Portraits, Paare, Familie oder ein besonderes Fahrzeug. Der Gutschein bleibt einfach einloesbar und wird spaeter in ein konkretes Shooting uebersetzt.',
    metaDescription:
      'Fotoshooting Gutschein fuer Portrait, Paar, Familie oder Auto-Fotoshooting in Duesseldorf, Mettmann, Erkrath und NRW.',
    contactLead:
      'Schreibe kurz, fuer wen der Gutschein gedacht ist und ob eher Portrait, Paar, Familie oder Auto-Fotoshooting passt. Den genauen Stil koennen wir beim Einloesen gemeinsam festlegen.',
    pullHeadline: 'Ein Gutschein mit',
    pullEmphasis: 'echtem Spielraum.',
    statementBody: [
      'Ein Fotoshooting Gutschein sollte nicht wie ein starres Paket wirken. Die beschenkte Person soll spaeter entscheiden koennen, ob Portrait, Paar, Familie oder Auto besser passt.',
      'Darum wird der Gutschein bewusst offen gehalten und erst beim Einloesen in Stil, Ort, Umfang und Bildsprache uebersetzt.',
    ],
    sectionHeadline: 'Geschenkidee mit',
    sectionEmphasis: 'klarer Einloesung.',
    sectionLead:
      'Diese Seite holt Geschenk-Suchende ab und fuehrt sie nicht auf eine generische Shop-Seite, sondern in konkrete Shootingarten, die Matthias tatsaechlich anbietet.',
    cards: [
      { label: 'Portrait', title: 'Einzelperson', text: 'Fuer Menschen, die endlich gute Bilder von sich selbst haben moechten.' },
      { label: 'Paar', title: 'Gemeinsam', text: 'Ein ruhiger Termin fuer Paare, die natuerliche Bilder statt gestellte Motive wollen.' },
      { label: 'Familie', title: 'Kleine Familie', text: 'Als Geschenk fuer Eltern, Geschwister oder besondere Anlaesse.' },
      { label: 'Auto', title: 'Fahrzeugliebe', text: 'Fuer Besitzer von Sportwagen, Oldtimer, Motorrad oder besonderem Alltagsauto.' },
      { label: 'Frei', title: 'Stil spaeter klaeren', text: 'Der konkrete Look wird erst beim Einloesen gemeinsam abgestimmt.' },
    ],
    processHeadline: 'So funktioniert der Gutschein.',
    processLead:
      'Der Gutschein bleibt unkompliziert: Anfrage, Wert oder Shootingart festlegen, persoenlich uebergeben und spaeter gemeinsam einloesen.',
    processSteps: [
      { title: 'Anlass nennen', text: 'Du sagst kurz, fuer wen der Gutschein ist und ob ein bestimmtes Shooting naheliegt.' },
      { title: 'Rahmen festlegen', text: 'Wir klaeren Wert, Shootingart und ob der Gutschein offen oder konkreter formuliert wird.' },
      { title: 'Gutschein vorbereiten', text: 'Der Gutschein wird so gehalten, dass er als Geschenk sauber uebergeben werden kann.' },
      { title: 'Einloesen planen', text: 'Die beschenkte Person meldet sich und wir planen Ort, Stil und Ablauf.' },
      { title: 'Shooting umsetzen', text: 'Aus dem Geschenk wird ein echter Termin mit final bearbeiteten Bildern.' },
    ],
    relatedLead:
      'Fotoshooting Gutschein verbindet Portrait-, Paar-, Familien- und Automobilseiten. Die interne Verlinkung hilft, den passenden Gutscheinrahmen schnell zu finden.',
  },
  'fotoshooting-preise': {
    heroLead:
      'Fotoshooting Preise haengen von Umfang, Nutzung, Ort, Vorbereitung und Ausgabe ab. Diese Seite gibt Suchenden einen passenden Einstieg und fuehrt zur konkreten Anfrage statt zu pauschalen Billigpaketen.',
    metaDescription:
      'Fotoshooting Preise fuer Portrait, Auto, Sportwagen und individuelle Shootings. Anfrage fuer transparente Pakete in Duesseldorf und NRW.',
    contactLead:
      'Schreibe kurz, welche Art Shooting du planst, wie viele Personen oder Fahrzeuge dabei sind und wofuer die Bilder genutzt werden. Dann laesst sich der Preis sauber einordnen.',
    pullHeadline: 'Preise brauchen',
    pullEmphasis: 'Kontext.',
    statementBody: [
      'Fotoshooting Preise sind selten sinnvoll vergleichbar, wenn nur eine Zahl im Raum steht. Entscheidend sind Motiv, Nutzung, Ort, Dauer, Vorbereitung und Anzahl der finalen Bilder.',
      'Diese Seite erklaert, warum ein Portraittermin, ein Auto-Fotoshooting und eine Content-Serie unterschiedlich kalkuliert werden, ohne in unpassende Billigpakete abzurutschen.',
    ],
    sectionHeadline: 'Was den Umfang',
    sectionEmphasis: 'veraendert.',
    sectionLead:
      'Preisfragen werden transparent beantwortet: nicht mit einer langen Paketliste, sondern mit Kriterien, die fuer eine serioese Anfrage wirklich zaehlen.',
    cards: [
      { label: 'Art', title: 'Shootingtyp', text: 'Portrait, Paar, Familie, Auto oder Sportwagen haben unterschiedliche Vorbereitung und Bildlogik.' },
      { label: 'Ort', title: 'Location', text: 'Anfahrt, Genehmigung, Lichtfenster und Setup beeinflussen den Aufwand.' },
      { label: 'Nutzung', title: 'Privat oder kommerziell', text: 'Bilder fuer Website, Kampagne oder Verkauf werden anders lizenziert als private Erinnerungen.' },
      { label: 'Umfang', title: 'Bildanzahl', text: 'Eine kleine Auswahl braucht weniger Retusche und Abstimmung als eine umfangreiche Serie.' },
      { label: 'Output', title: 'Dateien & Formate', text: 'Web, Social, Print und grosse Drucke haben unterschiedliche Anforderungen.' },
    ],
    processHeadline: 'So wird ein Preis sauber.',
    processLead:
      'Statt pauschal zu raten, wird der Rahmen in wenigen Punkten geklaert. Danach kann ein Angebot passend zum echten Bedarf entstehen.',
    processSteps: [
      { title: 'Shootingart nennen', text: 'Du beschreibst kurz, ob es um Portrait, Paar, Familie, Auto, Sportwagen oder Content geht.' },
      { title: 'Nutzung klaeren', text: 'Privat, Social, Website, Verkauf oder Kampagne machen einen Unterschied.' },
      { title: 'Umfang schaetzen', text: 'Wir sprechen ueber Dauer, Location, Personen oder Fahrzeuge und gewuenschte Bildanzahl.' },
      { title: 'Angebot erhalten', text: 'Du bekommst eine klare Einordnung mit passendem Leistungsrahmen.' },
      { title: 'Termin planen', text: 'Nach Freigabe werden Ort, Ablauf und Ausgabe sauber festgelegt.' },
    ],
    relatedLead:
      'Fotoshooting Preise ist ein beratender Einstieg. Von hier sollten Nutzer direkt zu den passenden Leistungsseiten wechseln koennen: Portrait, Auto, Gutschein oder Dating.',
  },
  'paarshooting-familienshooting': {
    heroLead:
      'Paarshooting und Familienshooting fuer echte Naehe statt gestellter Gruppenbilder. Der Fokus liegt auf ruhigen, persoenlichen Serien mit klarer Lichtfuehrung und natuerlicher Regie.',
    metaDescription:
      'Paarshooting und Familienshooting in Duesseldorf, Mettmann, Erkrath und NRW. Natuerliche Portraits fuer Paare und Familien.',
    contactLead:
      'Schreibe kurz, ob es um Paar, kleine Familie oder einen besonderen Anlass geht, welche Stimmung passen soll und wo das Shooting stattfinden koennte.',
    pullHeadline: 'Nahe Bilder ohne',
    pullEmphasis: 'Aufstellung.',
    statementBody: [
      'Paarshooting und Familienshooting funktionieren am besten, wenn nicht jede Person in eine perfekte Pose gezwungen wird. Kleine Bewegungen, Blickwechsel und echte Situationen tragen mehr.',
      'Der Fokus liegt auf Paaren und kleinen Familien, die ruhige, persoenliche Bilder moechten. Grosse Gruppen werden bewusst nicht als Hauptangebot nach vorne gestellt.',
    ],
    sectionHeadline: 'Paar, kleine Familie,',
    sectionEmphasis: 'echte Momente.',
    sectionLead:
      'Diese Seite verbindet zwei nahe Anlaesse, ohne sie zu verwaessern: Paarbilder und kleine Familienshootings mit natuerlicher Regie.',
    cards: [
      { label: 'Paar', title: 'Zu zweit', text: 'Ruhige Motive, die Verbindung zeigen, ohne kitschig oder gestellt zu wirken.' },
      { label: 'Familie', title: 'Kleine Familien', text: 'Natuerliche Serien mit Kindern oder Eltern, bei denen Bewegung erlaubt bleibt.' },
      { label: 'Anlass', title: 'Jahrestag & Geschenk', text: 'Ein Shooting als gemeinsames Erlebnis oder als persoenliches Geschenk.' },
      { label: 'Zuhause', title: 'Vertraute Orte', text: 'Wenn der Ort Teil der Geschichte ist, kann er bewusst in die Bilder einfließen.' },
      { label: 'Outdoor', title: 'Licht und Raum', text: 'Ruhige Aussenorte schaffen Abstand, Bewegung und eine natuerliche Atmosphaere.' },
    ],
    processHeadline: 'Ablauf fuer Paar und Familie.',
    processLead:
      'Der Termin soll leicht bleiben: klare Vorbereitung, wenig Druck, flexible Fuehrung und eine Auswahl mit echten Zwischenmomenten.',
    processSteps: [
      { title: 'Konstellation klaeren', text: 'Wir sprechen darueber, ob es um Paar, kleine Familie oder einen konkreten Anlass geht.' },
      { title: 'Ort waehlen', text: 'Zuhause, draussen oder an einem persoenlichen Ort - passend zur Geschichte.' },
      { title: 'Locker beginnen', text: 'Einfache Bewegungen helfen, damit sich niemand beobachtet oder aufgestellt fuehlt.' },
      { title: 'Momente sammeln', text: 'Neben klaren Portraits entstehen kleine Szenen, Details und Zwischentoene.' },
      { title: 'Serie liefern', text: 'Die finalen Bilder werden als zusammenhaengende Erinnerung bearbeitet.' },
    ],
    relatedLead:
      'Paarshooting und Familienshooting bleibt bewusst bei Portraits und grenzt sich von Gruppen- und Passbildsuchen ab.',
  },
  'schwarz-weiss-portrait-fotografie': {
    heroLead:
      'Schwarz-Weiss Portrait Fotografie reduziert ein Bild auf Licht, Blick, Kontur und Haltung. Geeignet fuer starke Einzelportraits, Editorials, Personal Branding und private Serien mit ruhiger Wirkung.',
    metaDescription:
      'Schwarz-Weiss Portrait Fotografie fuer klare, ruhige Portraits mit Fokus auf Licht, Blick und Haltung in Duesseldorf und NRW.',
    contactLead:
      'Schreibe kurz, ob du eine reine Schwarz-Weiss-Serie oder eine Mischung aus Farbe und Schwarz-Weiss moechtest und wofuer die Bilder genutzt werden.',
    pullHeadline: 'Reduziert auf Licht,',
    pullEmphasis: 'Blick und Haltung.',
    statementBody: [
      'Schwarz-Weiss Portrait Fotografie nimmt Farbe aus dem Bild und macht dadurch andere Dinge lauter: Blick, Form, Haut, Kontur, Schatten und Haltung.',
      'Der Look eignet sich fuer markante Einzelportraits, Editorials, kuenstlerische Serien und Personal Branding, wenn die Bilder ruhiger und zeitloser wirken sollen.',
    ],
    sectionHeadline: 'Kontrast statt',
    sectionEmphasis: 'Ablenkung.',
    sectionLead:
      'Diese Seite bedient eine klare Stil-Suche. Sie erklaert Schwarz-Weiss nicht als Filter, sondern als bewusste Entscheidung fuer Licht, Tonwerte und Bildwirkung.',
    cards: [
      { label: 'Klar', title: 'Einzelportrait', text: 'Reduzierte Bilder mit Fokus auf Gesicht, Blick und Haltung.' },
      { label: 'Editorial', title: 'Staerkere Serie', text: 'Kontraste, Schatten und Ausschnitt duerfen praesenter sein als in klassischen Profilbildern.' },
      { label: 'Brand', title: 'Zeitloser Auftritt', text: 'Schwarz-Weiss kann Personal Branding ruhiger und weniger trendabhaengig machen.' },
      { label: 'Mix', title: 'Farbe plus Schwarz-Weiss', text: 'Eine Serie kann farbige Hauptmotive und ausgewaehlte Schwarz-Weiss-Finals kombinieren.' },
      { label: 'Print', title: 'Wandbild', text: 'Tonwerte und Kontrast werden so bearbeitet, dass die Bilder auch im Druck tragen.' },
    ],
    processHeadline: 'Ablauf fuer Schwarz-Weiss Portraits.',
    processLead:
      'Schon vor dem Shooting wird entschieden, ob Schwarz-Weiss die Hauptsprache der Serie ist oder als finale Auswahl dazukommt.',
    processSteps: [
      { title: 'Look festlegen', text: 'Wir klaeren, ob die Serie weich, kontrastreich, ruhig oder editorial werden soll.' },
      { title: 'Licht planen', text: 'Schwarz-Weiss lebt von Form und Schatten; das Licht wird entsprechend gesetzt.' },
      { title: 'Motive fotografieren', text: 'Blick, Haltung und Ausschnitt werden bewusster gefuehrt als bei sehr farbigen Serien.' },
      { title: 'Tonwerte bearbeiten', text: 'Die Retusche konzentriert sich auf Kontrast, Haut, Struktur und saubere Graustufen.' },
      { title: 'Finale Auswahl liefern', text: 'Du bekommst die Bilder passend fuer Profil, Print, Website oder private Nutzung.' },
    ],
    relatedLead:
      'Schwarz-Weiss Portrait Fotografie ist eine Stilseite innerhalb des Portrait-Clusters und verlinkt sinnvoll zu Beleuchtung, Portrait Fotoshooting und Personal Branding.',
  },
  'business-portrait': {
    heroLead:
      'Business Portrait fuer Website, LinkedIn, Presse und Team: professionelle Portraits mit Haltung statt Passbild. Klar, hochwertig und auf den Auftritt der Person abgestimmt.',
    metaDescription:
      'Business Portrait Fotograf: professionelle Portraits fuer Website, LinkedIn, Presse, Team und Marke in Duesseldorf und NRW - keine Passbilder.',
    contactLead:
      'Schreibe kurz, fuer wen das Business Portrait gedacht ist - einzelne Person, Fuehrungsebene oder Team - wofuer die Bilder genutzt werden (Website, LinkedIn, Presse) und ob es vor Ort, on location oder in ruhiger Umgebung entstehen soll.',
    pullHeadline: 'Professionell wirken,',
    pullEmphasis: 'nicht gestellt.',
    statementBody: [
      'Ein Business Portrait ist kein Bewerbungsfoto und kein Passbild. Es soll Kompetenz, Nahbarkeit und Wiedererkennung transportieren - fuer Website, LinkedIn, Presse oder die Teamseite.',
      'Licht, Distanz und Hintergrund werden auf Rolle und Branche abgestimmt. Eine Kanzlei braucht andere Bilder als ein Startup, bleibt aber in einer klaren, professionellen Bildsprache.',
    ],
    sectionHeadline: 'Vom Einzelportrait bis zum',
    sectionEmphasis: 'Team.',
    sectionLead:
      'Diese Seite buendelt Business-Portraits fuer Person, Fuehrung, Team und Marke - ohne in Passbild- oder Studio-Massenware abzurutschen.',
    cards: [
      { label: 'Person', title: 'Einzelportrait', text: 'Hochwertige Portraits fuer Website, LinkedIn und Profil mit klarer, professioneller Wirkung.' },
      { label: 'Fuehrung', title: 'Geschaeftsfuehrung', text: 'Portraits fuer Fuehrungsebene, Aufsichtsrat und Presse mit ruhiger Autoritaet.' },
      { label: 'Team', title: 'Teamseite', text: 'Konsistente Bildsprache ueber mehrere Personen, damit die Teamseite zusammenhaengt.' },
      { label: 'Marke', title: 'Corporate Look', text: 'Bildwelt, die zu Branding, Website und Unternehmensauftritt passt.' },
    ],
    processHeadline: 'Ablauf fuer ein Business Portrait.',
    processLead:
      'Der Ablauf bleibt effizient und planbar - wichtig bei mehreren Personen oder engem Terminfenster im Unternehmen.',
    processSteps: [
      { title: 'Nutzung klaeren', text: 'Wir legen fest, ob die Bilder fuer Website, LinkedIn, Presse, Team oder Kampagne gedacht sind.' },
      { title: 'Look abstimmen', text: 'Hintergrund, Kleidung, Bildausschnitt und Stimmung werden auf Rolle und Branche abgestimmt.' },
      { title: 'Vor Ort oder on location', text: 'Das Shooting findet im Unternehmen, on location oder in ruhiger Umgebung statt - je nach Bedarf.' },
      { title: 'Effizient fotografieren', text: 'Auch mehrere Personen werden in einem klaren Ablauf mit gleichbleibender Qualitaet fotografiert.' },
      { title: 'Liefern und pflegen', text: 'Finale Dateien kommen passend fuer Web, Print und Social; Nachzuegler lassen sich konsistent ergaenzen.' },
    ],
    relatedLead:
      'Business Portrait ist die kommerzielle Einstiegsseite. Fuer engere Intentionen verweist sie auf Headshot, Personal Branding, Unternehmensportrait und Pressefoto.',
  },
  'headshot-fotograf': {
    heroLead:
      'Headshots fuer LinkedIn, Team-Seiten und Bewerbung: klar, sauber und auf den Punkt - ein professionelles Gesicht ohne Studio-Steifheit.',
    metaDescription:
      'Headshot Fotograf: klare, professionelle Headshots fuer LinkedIn, Profil, Team und Bewerbung in Duesseldorf und NRW.',
    contactLead:
      'Schreibe kurz, ob es um eine Person oder ein Team geht, wo die Headshots genutzt werden (LinkedIn, Website, Bewerbung) und ob ein einheitlicher Look ueber mehrere Personen wichtig ist.',
    pullHeadline: 'Ein Gesicht,',
    pullEmphasis: 'klar gezeigt.',
    statementBody: [
      'Ein Headshot ist der enge, fokussierte Ausschnitt: Gesicht, Blick und Ausdruck stehen im Mittelpunkt. Genau das brauchen LinkedIn, Profile, Team-Grids und Bewerbungen.',
      'Wichtig ist Wiederholbarkeit. Wenn mehrere Personen denselben Look brauchen, bleiben Licht, Hintergrund und Ausschnitt ueber alle Aufnahmen konsistent.',
    ],
    sectionHeadline: 'Sauber, einheitlich,',
    sectionEmphasis: 'wiedererkennbar.',
    sectionLead:
      'Diese Seite bleibt bewusst eng: professionelle Profilbilder, kein verkleidetes Konzept-Shooting.',
    cards: [
      { label: 'Profil', title: 'LinkedIn & Web', text: 'Klare Headshots, die auf Profilen und Teamseiten sofort professionell wirken.' },
      { label: 'Team', title: 'Einheitlicher Look', text: 'Gleiches Licht, gleicher Hintergrund, gleicher Ausschnitt ueber alle Personen.' },
      { label: 'Bewerbung', title: 'Bewerbungsbild', text: 'Sympathisch und professionell - moderner als ein klassisches Passbild.' },
      { label: 'Schnell', title: 'Effizienter Termin', text: 'Kompakter Ablauf, ideal fuer einzelne Personen oder ganze Teams am Stueck.' },
    ],
    processHeadline: 'Ablauf fuer Headshots.',
    processLead:
      'Headshots leben von einem ruhigen, schnellen Ablauf - besonders, wenn mehrere Personen nacheinander fotografiert werden.',
    processSteps: [
      { title: 'Zweck klaeren', text: 'Wir klaeren Nutzung, gewuenschte Wirkung und ob ein einheitlicher Team-Look noetig ist.' },
      { title: 'Setup setzen', text: 'Licht, Hintergrund und Ausschnitt werden einmal sauber festgelegt und konstant gehalten.' },
      { title: 'Person fuehren', text: 'Kurze, klare Regie fuer Blick und Haltung, damit der Ausdruck natuerlich bleibt.' },
      { title: 'Auswahl treffen', text: 'Pro Person eine kuratierte Auswahl der besten Aufnahmen.' },
      { title: 'Konsistent liefern', text: 'Finale Headshots in einheitlichem Look fuer Web, Profil und Bewerbung.' },
    ],
    relatedLead:
      'Headshot ist die engste Portraitform. Wer mehr Bildwelt braucht, findet bei Business Portrait, Personal Branding und Unternehmensportrait den passenden Umfang.',
  },
  'personal-branding-fotografie': {
    heroLead:
      'Personal Branding Fotografie fuer Selbststaendige, Founder und Coaches: eine Bildwelt aus mehreren Looks und Orten statt eines einzelnen Profilbilds.',
    metaDescription:
      'Personal Branding Fotografie: Bildwelt fuer Website, Social und Angebot - mehrere Looks, Orte und Motive fuer Selbststaendige und Founder.',
    contactLead:
      'Schreibe kurz, wofuer die Bilder gebraucht werden (Website, Social, Angebot), wie du positioniert bist und welche Themen oder Orte deine Arbeit am besten zeigen.',
    pullHeadline: 'Eine Person,',
    pullEmphasis: 'eine Bildwelt.',
    statementBody: [
      'Personal Branding Fotografie endet nicht beim Portrait. Es geht um eine zusammenhaengende Bildwelt: Person, Arbeitsweise, Umfeld und wiederkehrende Motive fuer alle Kanaele.',
      'Eine Serie liefert Material fuer Website, Social Media, Newsletter und Angebote - mit genug Varianten, damit ueber Monate nicht immer dasselbe Bild laeuft.',
    ],
    sectionHeadline: 'Mehr als ein',
    sectionEmphasis: 'Profilbild.',
    sectionLead:
      'Diese Seite richtet sich an Menschen, die ihre Marke selbst sind. Statt eines Einzelbilds entsteht ein nutzbarer Vorrat an Motiven.',
    cards: [
      { label: 'Person', title: 'Hauptportraits', text: 'Klare Portraits als Anker der Bildwelt fuer Startseite und Profil.' },
      { label: 'Arbeit', title: 'In Aktion', text: 'Bilder bei der Arbeit, im Gespraech oder am Material - glaubwuerdig statt gestellt.' },
      { label: 'Umfeld', title: 'Orte & Atmosphaere', text: 'Buero, Studio oder typische Locations als Teil der Geschichte.' },
      { label: 'Content', title: 'Social-Vorrat', text: 'Hoch- und Querformate plus Detailmotive fuer einen laufenden Content-Plan.' },
    ],
    processHeadline: 'Ablauf fuer Personal Branding.',
    processLead:
      'Vor dem Shooting steht ein kleiner Content-Plan: Positionierung, Themen und Kanaele bestimmen, welche Motive wirklich gebraucht werden.',
    processSteps: [
      { title: 'Positionierung klaeren', text: 'Wir schauen, wofuer du stehst und welche Bilder dein Angebot stuetzen.' },
      { title: 'Motivliste bauen', text: 'Themen, Orte, Outfits und Formate werden als Liste statt als Zufall geplant.' },
      { title: 'In Etappen fotografieren', text: 'Verschiedene Looks und Situationen entstehen in einem strukturierten Termin.' },
      { title: 'Auswahl kuratieren', text: 'Du bekommst eine sortierte Auswahl nach Verwendungszweck, nicht nur nach Schoenheit.' },
      { title: 'Vorrat liefern', text: 'Die Bildwelt kommt in Formaten fuer Website, Social und Print - bereit fuer Monate.' },
    ],
    relatedLead:
      'Personal Branding Fotografie ist die breiteste Auftritts-Seite. Sie grenzt sich von Headshot und Business Portrait ab, verlinkt aber bewusst dorthin.',
  },
  'unternehmensportrait': {
    heroLead:
      'Unternehmensportrait fuer Team, Fuehrung und Standort: eine konsistente Bildsprache ueber alle Personen - vor Ort im Unternehmen oder on location.',
    metaDescription:
      'Unternehmensportrait: konsistente Portraits fuer Team, Fuehrung und Standort in Duesseldorf und NRW - vor Ort und mit einheitlichem Look.',
    contactLead:
      'Schreibe kurz, wie viele Personen fotografiert werden, ob es vor Ort im Unternehmen stattfinden soll und wofuer die Bilder genutzt werden (Website, Recruiting, Presse, Bericht).',
    pullHeadline: 'Ein Unternehmen,',
    pullEmphasis: 'eine Bildsprache.',
    statementBody: [
      'Beim Unternehmensportrait geht es selten um eine einzelne Person, sondern um viele: Team, Fuehrung, Abteilungen und Standort sollen in einer gemeinsamen Bildsprache erscheinen.',
      'Der Schluessel ist Konsistenz und Logistik. Licht, Hintergrund und Ausschnitt bleiben gleich, auch wenn an einem Tag viele Menschen nacheinander fotografiert werden.',
    ],
    sectionHeadline: 'Team, Fuehrung,',
    sectionEmphasis: 'Standort.',
    sectionLead:
      'Diese Seite ist fuer Unternehmen, die mehr als ein Portrait brauchen: eine verlaessliche, wiederholbare Bildlinie fuer den gesamten Auftritt.',
    cards: [
      { label: 'Team', title: 'Mitarbeiterportraits', text: 'Einheitliche Portraits fuer Website, Recruiting und Teamseite.' },
      { label: 'Fuehrung', title: 'Geschaeftsleitung', text: 'Repraesentative Portraits fuer Presse, Bericht und Investor Relations.' },
      { label: 'Standort', title: 'Vor Ort', text: 'Arbeitsumgebung und Raeume als Teil des Unternehmensbildes.' },
      { label: 'System', title: 'Erweiterbar', text: 'Neue Mitarbeitende lassen sich spaeter im gleichen Look ergaenzen.' },
    ],
    processHeadline: 'Ablauf fuer Unternehmensportraits.',
    processLead:
      'Bei vielen Personen entscheidet die Organisation ueber das Ergebnis: klarer Zeitplan, fester Setup-Ort und ein effizienter Durchlauf.',
    processSteps: [
      { title: 'Umfang klaeren', text: 'Personenzahl, Orte, Nutzung und gewuenschter Look werden vorab abgestimmt.' },
      { title: 'Setup aufbauen', text: 'Ein fester Punkt im Unternehmen sorgt fuer gleichbleibendes Licht und Hintergrund.' },
      { title: 'Im Takt fotografieren', text: 'Personen werden nacheinander in kurzen, ruhigen Slots fotografiert.' },
      { title: 'Konsistent bearbeiten', text: 'Alle Portraits werden in derselben Bildsprache retuschiert.' },
      { title: 'Strukturiert liefern', text: 'Benannte Dateien pro Person, bereit fuer Website, Intranet und Presse.' },
    ],
    relatedLead:
      'Unternehmensportrait ist die team- und standortbezogene Seite. Fuer einzelne Personen passt Business Portrait oder Headshot, fuer Marken-Aufbau Personal Branding.',
  },
  'pressefoto': {
    heroLead:
      'Pressefotos fuer Medien, PR und Bericht: glaubwuerdig, redaktionell nutzbar und mit klaren Rechten - Portraits und Motive, die Redaktionen direkt verwenden koennen.',
    metaDescription:
      'Pressefoto Fotograf: redaktionell nutzbare Portraits und Motive fuer Presse, PR und Medienkit in Duesseldorf und NRW - mit klarer Nutzungsfreigabe.',
    contactLead:
      'Schreibe kurz, wofuer die Pressefotos gebraucht werden (Pressemitteilung, Medienkit, Bericht), wer abgebildet wird und welche Rechte oder Formate die Redaktionen brauchen.',
    pullHeadline: 'Bilder, die Redaktionen',
    pullEmphasis: 'verwenden.',
    statementBody: [
      'Ein Pressefoto muss anders funktionieren als ein Werbebild: glaubwuerdig, redaktionell nutzbar und technisch sauber. Es soll eine Geschichte stuetzen, nicht ueberinszenieren.',
      'Genauso wichtig sind klare Nutzungsrechte und Formate. Ein gutes Medienkit liefert Portrait, Situativ und Detail in Aufloesungen, die Print und Online abdecken.',
    ],
    sectionHeadline: 'Glaubwuerdig, klar,',
    sectionEmphasis: 'freigegeben.',
    sectionLead:
      'Diese Seite richtet sich an PR, Kommunikation und Personen des oeffentlichen Lebens, die verlaessliches, redaktionstaugliches Bildmaterial brauchen.',
    cards: [
      { label: 'Portrait', title: 'Pressebild Person', text: 'Repraesentatives, glaubwuerdiges Portrait fuer Pressemitteilung und Profil.' },
      { label: 'Situativ', title: 'Im Kontext', text: 'Person in Arbeits- oder Anlasssituation - redaktionell statt gestellt.' },
      { label: 'Kit', title: 'Medienkit', text: 'Mehrere Motive und Formate als fertiger Satz fuer Redaktionen.' },
      { label: 'Rechte', title: 'Klare Freigabe', text: 'Nutzungsrechte und Bildunterschriften werden eindeutig geregelt.' },
    ],
    processHeadline: 'Ablauf fuer Pressefotos.',
    processLead:
      'Vor dem Termin werden Anlass, Verwendung und Rechte geklaert, damit das Material spaeter ohne Rueckfragen einsatzbereit ist.',
    processSteps: [
      { title: 'Anlass klaeren', text: 'Pressemitteilung, Medienkit oder Bericht bestimmen Motive und Tonalitaet.' },
      { title: 'Motive planen', text: 'Portrait, Situativ und Detail werden so geplant, dass Redaktionen Auswahl haben.' },
      { title: 'Redaktionell fotografieren', text: 'Die Bildsprache bleibt glaubwuerdig und vermeidet ueberzogene Werbeoptik.' },
      { title: 'Aufloesungen liefern', text: 'Print- und Online-Formate werden getrennt bereitgestellt.' },
      { title: 'Rechte dokumentieren', text: 'Nutzungsfreigabe und Credits werden klar mitgeliefert.' },
    ],
    relatedLead:
      'Pressefoto ist die redaktionell ausgerichtete Seite. Fuer reine Profilbilder passt Business Portrait oder Headshot, fuer laufende Marke Personal Branding.',
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
      `Schreibe kurz, welches Fahrzeug fuer ${service} in ${scope.label} fotografiert werden soll, wo es steht, welche Wirkung die Bilder tragen sollen und ob die Serie privat, kommerziell oder als Kampagne genutzt wird. Wir klaeren Location, Licht und Ablauf gemeinsam vor dem ersten Klick.`,
    contactNoun: 'Automobil',
    family: 'automobil',
    gallery: [
      visual('/assets/optimized/assets-portfolio-dsc3879-1920.webp', 'Ferrari F12 Berlinetta als Exterieur-Motiv', 1920, 1280, { className: 'bg-t-hero', label: 'Showroom' }),
      visual('/assets/portfolio/_DSC9301-Enhanced-NR.webp', 'Cockpit und Materialdetail im Fahrzeug', 2048, 2560, { className: 'bg-t-a', label: 'Interieur' }),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Lack- und Linien-Detail', 1920, 1280, { className: 'bg-t-b', label: 'Detail' }),
      visual('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Cineastische Fahrzeugaufnahme', 1920, 1280, { className: 'bg-t-c', label: 'Cinematic' }),
    ],
    heroImages: [
      visual('/assets/optimized/assets-portfolio-dsc3879-1920.webp', 'Automobil Exterieur', 1920, 1280),
      visual('/assets/optimized/assets-portfolio-dsc2986-1920.webp', 'Automobil Interieur', 1707, 2560),
      visual('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Automobil Cinematic', 1920, 1280),
    ],
    introHeadline: 'Vom Inserat bis zur Kampagne.',
    introParagraphs: [
      'Klare Ansichten, kontrollierte Reflexe und eine Bildserie, die fuer Verkauf, Website, Social, Print und Kampagne funktioniert.',
      'Die lokale Seite nutzt die gleiche Art Direction wie die Automobil-Hauptseite und passt Text, Anfrage und SEO-Kontext auf den Ort an.',
    ],
    label: 'Automobil',
    moduleHeadline: 'Ein Bildsatz, vier Blickwinkel.',
    moduleLead: 'Exterieur, Interieur, Details und Cinematic greifen ineinander, damit aus dem Fahrzeug kein einzelnes Hero-Bild, sondern ein nutzbarer Bildsatz wird.',
    modules: [
      visual('/assets/optimized/assets-portfolio-dsc3879-1920.webp', 'Automobil Exterieur', 1920, 1280, { title: 'Exterieur', text: 'Ruhige Linien, klare Flächen, kontrollierte Spiegelungen.' }),
      visual('/assets/portfolio/_DSC9321-Enhanced-NR.webp', 'Automobil Interieur', 1707, 2560, { title: 'Interieur', text: 'Cockpit, Material, Farbe und Nutzung bleiben lesbar.' }),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Automobil Detail', 1920, 1280, { title: 'Details', text: 'Sicken, Felgen, Embleme und Oberflächen erzählen den Wert.' }),
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobil mit Lichtstimmung', 1920, 1280, { title: 'Cinematic', text: 'Stimmung für Kampagne, Editorial und Markenbild.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.automobil,
    related: [
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Sportwagenfotografie', 1920, 1280, { title: 'Sportwagen', label: '/sportwagen-fotografie.html' }),
      visual('/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Oldtimerfotografie', 1920, 1280, { title: 'Oldtimer', label: '/oldtimer-fotografie.html' }),
      visual('/assets/optimized/assets-photos-motorrad-1920.webp', 'Motorradfotografie', 1707, 2560, { title: 'Motorrad', label: '/motorrad-fotografie.html' }),
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
      `Schreibe kurz, welcher Sportwagen fuer ${service} in ${scope.label} fotografiert werden soll, ob die Bilder fuer Verkauf, Sammlung, Marke oder Social genutzt werden und welches Zeitfenster moeglich ist. Wir planen Licht, Ort und Ablauf gemeinsam.`,
    contactNoun: 'Sportwagen',
    family: 'sportwagen',
    gallery: [
      visual('/assets/optimized/assets-portfolio-dsc3879-1920.webp', 'Sportwagen Exterieur', 1920, 1280, { className: 't1', label: 'Exterieur' }),
      visual('/assets/portfolio/_DSC9321-Enhanced-NR.webp', 'Sportwagen Cockpit', 1707, 2560, { className: 't2', label: 'Interieur' }),
      visual('/assets/optimized/assets-portfolio-dsc3982-1920.webp', 'Sportwagen Detail', 1920, 1280, { className: 't3', label: 'Detail' }),
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Sportwagen Cinematic', 1920, 1280, { className: 't6', label: 'Cinematic' }),
    ],
    heroImages: [
      visual('/assets/optimized/mpixih9c-dsc3982-1920.webp', 'Sportwagen Detail', 1920, 1280, { className: 'detail' }),
      visual('/assets/optimized/mpixi92f-dsc3032-generase-1-1920.webp', 'Sportwagen Ganzansicht', 1920, 1280, { className: 'full' }),
      visual('/assets/optimized/mpixhlgk-dsc2986-1920.webp', 'Sportwagen Interieur', 1707, 2560, { className: 'interior' }),
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
      visual('/assets/optimized/assets-portfolio-dsc3982-1920.webp', 'Sportwagen Exterieur', 1920, 1280, { title: 'Exterieur', text: 'Vollformatige Außenaufnahmen mit sauberer Linienführung.' }),
      visual('/assets/portfolio/_DSC9321-Enhanced-NR.webp', 'Sportwagen Interieur', 1707, 2560, { title: 'Interieur', text: 'Cockpit, Sitze, Material und Atmosphäre.' }),
      visual('/assets/portfolio/_DSC9301-Enhanced-NR.webp', 'Sportwagen Detail', 2048, 2560, { title: 'Details', text: 'Emblem, Bremse, Sicke, Felge und Material.' }),
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Sportwagen Cinematic', 1920, 1280, { title: 'Cinematic', text: 'Bilder mit Filmcharakter für Kampagne und Magazin.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.sportwagen,
    related: [
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Oldtimerfotografie', 1920, 1280, { title: 'Oldtimer', label: '/oldtimer-fotografie.html' }),
      visual('/assets/optimized/assets-photos-motorrad-1920.webp', 'Motorradfotografie', 1707, 2560, { title: 'Motorrad', label: '/motorrad-fotografie.html' }),
      visual('/assets/portfolio/thumbs/_DSC3879.webp', 'Portfolio', 720, 480, { title: 'Portfolio', label: '/portfolio.html' }),
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
      `Schreibe kurz, welcher Oldtimer fuer ${service} in ${scope.label} fotografiert werden soll - Modell, Baujahr, Standort und ob die Bilder fuer Sammlung, Auktion, Verkauf oder privat genutzt werden. Wir klaeren Raum, Licht und Ablauf gemeinsam.`,
    contactNoun: 'Oldtimer',
    family: 'oldtimer',
    gallery: [
      visual('/assets/portfolio/_DSC0470-Enhanced-NR.webp', 'Oldtimer Exponat', 1600, 2560, { className: 't1', label: 'Exponat' }),
      visual('/assets/portfolio/_DSC9321-Enhanced-NR.webp', 'Oldtimer Cockpit', 1707, 2560, { className: 't2', label: 'Cockpit' }),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Oldtimer Material', 1920, 1280, { className: 't3', label: 'Material' }),
      visual('/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Oldtimer Bühne', 1920, 1280, { className: 't6', label: 'Bühne' }),
    ],
    heroImages: [
      visual('/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Oldtimer Bühne', 1920, 1280),
      visual('/assets/portfolio/_DSC0470-Enhanced-NR.webp', 'Oldtimer Portrait', 1600, 2560),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Oldtimer Detail', 1920, 1280),
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
      visual('/assets/portfolio/_DSC0470-Enhanced-NR.webp', 'Oldtimer Exponat', 1600, 2560, { title: 'Exponat', text: 'Hauptmotiv wie eine Ausstellung.' }),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Oldtimer Patina', 1920, 1280, { title: 'Patina', text: 'Material und Alterung ehrlich sichtbar.' }),
      visual('/assets/optimized/assets-portfolio-dsc2986-1920.webp', 'Oldtimer Innenraum', 1707, 2560, { title: 'Innenraum', text: 'Cockpit, Leder, Holz und Armaturen.' }),
      visual('/assets/portfolio/_DSC9321-Enhanced-NR.webp', 'Oldtimer Provenance', 1707, 2560, { title: 'Provenance', text: 'Details für Auktion, Versicherung und Verkauf.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.oldtimer,
    related: [
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Sportwagenfotografie', 1920, 1280, { title: 'Sportwagen', label: '/sportwagen-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc8032-1920.webp', 'Drucke', 1920, 2400, { title: 'Drucke', label: '/drucke-sonderanfertigungen-duesseldorf.html' }),
      visual('/assets/portfolio/_DSC0470-Enhanced-NR.webp', 'Portfolio', 1600, 2560, { title: 'Portfolio', label: '/portfolio.html' }),
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
      `Schreibe kurz, welches Bike fuer ${service} in ${scope.label} fotografiert werden soll - Modell, Standort, ob Fahrerbilder gewuenscht sind und wofuer die Bilder genutzt werden. Wir klaeren Licht, Location und Ablauf gemeinsam.`,
    contactNoun: 'Motorrad',
    family: 'motorrad',
    gallery: [
      visual('/assets/optimized/assets-photos-motorrad-1920.webp', 'Motorrad Hero-Motiv', 1707, 2560, { className: 't1', label: 'Silhouette' }),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Motorrad Detail', 1920, 1280, { className: 't2', label: 'Detail' }),
      visual('/assets/optimized/assets-photos-motorrad-duke-1920.webp', 'Motorrad mit Fahrerbezug', 1920, 3413, { className: 't3', label: 'Haltung' }),
      visual('/assets/optimized/assets-portfolio-dsc3878-1920.webp', 'Motorrad Cinematic', 1920, 1280, { className: 't6', label: 'Cinematic' }),
    ],
    heroImages: [
      visual('/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp', 'Motorrad Straße', 1920, 2880),
      visual('/assets/optimized/assets-photos-motorrad-duke-1920.webp', 'Motorrad Duke', 1920, 3413),
      visual('/assets/optimized/assets-photos-motorrad-1920.webp', 'Motorrad Detail', 1707, 2560),
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
      visual('/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp', 'Motorrad Stand und Silhouette', 1920, 2880, { title: 'Stand & Silhouette', text: 'Bike pur: Proportionen, Linienführung, Haltung.' }),
      visual('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Motorrad Detail', 1920, 1280, { title: 'Detail', text: 'Tank, Motor, Felge, Lenker und Material.' }),
      visual('/assets/optimized/assets-photos-motorrad-duke-1920.webp', 'Motorrad mit Fahrer', 1920, 3413, { title: 'Mit Fahrer', text: 'Mensch und Maschine als Haltung.' }),
      visual('/assets/optimized/assets-portfolio-dsc2986-1920.webp', 'Motorrad Cinematic', 1707, 2560, { title: 'Cinematic', text: 'Werkhalle, Asphalt, Dämmerung, Editorial.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.motorrad,
    related: [
      visual('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobilfotografie', 1920, 1280, { title: 'Automobil', label: '/automobil-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Sportwagenfotografie', 1920, 1280, { title: 'Sportwagen', label: '/sportwagen-fotografie.html' }),
      visual('/assets/optimized/assets-portfolio-dsc8032-1920.webp', 'Videografie', 1920, 2400, { title: 'Videografie', label: '/videografie-duesseldorf.html' }),
      visual('/assets/optimized/assets-portfolio-dsc3879-1920.webp', 'Portfolio', 1920, 1280, { title: 'Portfolio', label: '/portfolio.html' }),
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
      `Schreibe kurz, wofuer die Portraits fuer ${service} in ${scope.label} gedacht sind - Personal Branding, Editorial, Team, Presse oder Bewerbung. Wichtig sind Person oder Team, gewuenschte Wirkung, Ort und Zeitraum. Stil und Licht klaeren wir vor dem ersten Klick.`,
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
      `Schreibe kurz, wofuer ${service} in ${scope.label} eingesetzt werden soll - Fine-Art-Print, Innenraum, Editorial, Website oder Markenbild. Wichtig sind gewuenschte Atmosphaere, Format, Material und Zeitraum.`,
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
      visual('/assets/optimized/assets-portfolio-20250414-dsc00341-1920.webp', 'Acrylglas Landschaft', 1707, 2560, { title: 'Acrylglas', text: 'Tiefe und Kontrast für repräsentative Räume.' }),
      visual('/assets/optimized/assets-portfolio-20250327-dsc01550-1920.webp', 'Landschaft Edition', 1691, 2560, { title: 'Edition', text: 'Limitierte Auswahl mit sauberer Fertigung.' }),
    ],
    parentLegacyFile: localSeoParentLegacyFiles.landschaft,
    related: [
      visual('/assets/photos/portrait-blue.webp', 'Portraitfotografie', 2048, 2560, { title: 'Portrait', label: '/portraitfotografie.html' }),
      visual('/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Oldtimerfotografie', 1920, 1280, { title: 'Oldtimer', label: '/oldtimer-fotografie.html' }),
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
