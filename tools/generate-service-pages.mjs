#!/usr/bin/env node
/**
 * Generates 7 service pages from a shared editorial template.
 * Run: node tools/generate-service-pages.mjs
 */
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';

const __dirname=dirname(fileURLToPath(import.meta.url));
const root=resolve(__dirname,'..');

const SERVICES=[
  {
    slug:'fotolabor-druck-duesseldorf',
    nav:'leistungen',
    title:'Fotolabor & Druck Düsseldorf — Matthias Ramahi',
    meta:'Hochwertiger Fotodruck in Düsseldorf: FineArt-Prints, Poster, Leinwand, Acrylglas, Alu-Dibond, Druckvorbereitung und persönliche Beratung über Matthias Ramahi.',
    crumbText:'Fotolabor & Druck',
    heroKicker:'Print Lab · Düsseldorf',
    h1:'Fotolabor',h1Em:'& Druck.',
    heroLead:'Hochwertige Drucke aus Düsseldorf — FineArt, Poster, Leinwand, Acrylglas und Spezialmaterialien. Vom Farbprofil bis zum Versandkarton aus einer Hand.',
    heroBg:'assets/services/portfolio_webp_full_057-1.webp',
    heroAlt:'Fotodruck-Detail aus dem Fotolabor',
    heroCaption:'Werkstatt · Düsseldorf · NRW',
    ctaPrimary:'Druck anfragen',ctaSecondary:'Leistungen ansehen',
    overviewHead:'Druck',overviewHeadEm:'leistungen.',
    overviewLead:'Vom kleinen Lieblingsprint bis zum großen Wandbild — jede Ausgabe wird auf Motiv, Betrachtungsabstand und Einsatzort abgestimmt.',
    cards:[
      {k:'01 / Print',t:'FineArt-Prints',body:'Galerie-Niveau auf zertifizierten Papieren. Hahnemühle, Canson, Ilford — matt, satiniert oder strukturiert.',list:['Pigmenttinten · 100+ Jahre Lichtechtheit','Kalibrierter Druck mit ICC-Profil','Signatur und Edition auf Wunsch']},
      {k:'02 / Wand',t:'Leinwand & Poster',body:'Klassische Wandbilder für Wohnraum, Empfang oder Büro — auf Keilrahmen, mattem Posterpapier oder Premium-Lustre.',list:['Galeriekanten oder weiße Ränder','Posterformate bis 100×150 cm','Versand sicher und schnell']},
      {k:'03 / Material',t:'Acrylglas & Alu-Dibond',body:'Brillante Tiefenwirkung auf Acryl, ruhige Mattheit auf Alu-Dibond. Beide Träger sind formstabil und langlebig.',list:['3 mm oder 5 mm Acrylglas','3 mm Alu-Dibond, hinter Acryl möglich','Aufhängung über Aluschienen oder Distanzhalter']},
      {k:'04 / Service',t:'Druckvorbereitung',body:'Farbkorrektur, Schärfung für das Druckmaterial, Soft-Proof. Damit das Ergebnis aussieht wie am Monitor — nur besser.',list:['Soft-Proof am kalibrierten Monitor','Korrektur für Material und Abstand','Mini-Testdruck bei größeren Auflagen']}
    ],
    featureKicker:'Material',
    featureHead:'Das Material trägt',featureHeadEm:'das Bild.',
    featureLead:'Ein Portrait wirkt auf mattem FineArt-Papier anders als auf glänzendem Lustre. Ein Auto auf Acrylglas ist nicht dasselbe wie auf Leinwand. Die Wahl ist nicht Geschmack — sie ist Teil des Bildes.',
    featureItems:[
      {tag:'Glanz',line:'Tiefe und Farbe — für Auto, Studio, dunkle Motive.'},
      {tag:'Matt',line:'Ruhe und galerieartige Bildwirkung — für Portrait und Landschaft.'},
      {tag:'Struktur',line:'Bütten und Strukturen — wenn das Motiv ein haptisches Objekt werden soll.'},
      {tag:'Objekt',line:'Acryl, Dibond, Holz — wenn der Druck Raumwirkung übernehmen soll.'}
    ],
    formSubject:'Druck-Anfrage — Matthias Ramahi',
    formHeadline:'Motiv drucken lassen.',
    formLead:'Schreib kurz, welches Motiv gedruckt werden soll, wo der Print später hängt und welches Format ungefähr geplant ist. Wenn Material oder Größe offen sind, reicht eine grobe Idee.'
  },
  {
    slug:'grossformatdruck-duesseldorf',
    nav:'leistungen',
    title:'Großformatdruck Düsseldorf — Matthias Ramahi',
    meta:'Großformatdruck in Düsseldorf: hochauflösende Wandbilder, Schaufensterfolien, Messebanner und individuelle Großformate für Marken, Showrooms und Galerien.',
    crumbText:'Großformatdruck',
    heroKicker:'Large Format · Düsseldorf',
    h1:'Großformat',h1Em:'druck.',
    heroLead:'Hochauflösender Druck im Großformat — für Wandbilder, Showrooms, Schaufenster und Messen. Vom Korrekturlauf am Soft-Proof bis zur Montage vor Ort.',
    heroBg:'assets/services/Catoir_Ramahi-1-106-768x512-1.webp',
    heroAlt:'Großformatdruck-Installation',
    heroCaption:'Installation · NRW',
    ctaPrimary:'Großformat anfragen',ctaSecondary:'Leistungen ansehen',
    overviewHead:'Format',overviewHeadEm:'leistungen.',
    overviewLead:'Große Flächen brauchen mehr als hohe Auflösung. Material, Betrachtungsabstand, Lichtsituation und Montage entscheiden, ob ein Großformat ruhig oder unruhig wirkt.',
    cards:[
      {k:'01 / Wand',t:'Wandbilder XL',body:'Hochformatige oder querformatige Bilder ab 100 × 70 cm bis 400 × 250 cm — auf Acryl, Alu, Leinwand oder direkt geklebt.',list:['Acryl bis 250 × 150 cm','Alu-Dibond bis 300 × 150 cm','Direktklebung auf gestrichene Wand']},
      {k:'02 / Marke',t:'Showroom & Empfang',body:'Markenwände für Empfangsbereiche, Autohäuser, Boutiquen und Studios — abgestimmt auf Corporate Look und Lichtsituation.',list:['Beleuchtungs-Check vor Druck','Material auf CI-Farben abgestimmt','Montage mit Schiene oder Distanzhalter']},
      {k:'03 / Event',t:'Messebanner & Roll-Ups',body:'Vom mobilen Roll-Up bis zur 6 m Messewand — leichte Stoffsysteme, Backlit-Folien, Hardcase-Lieferung.',list:['Stoff- oder PVC-Banner','Roll-Up 85 × 200 cm und 120 × 200 cm','Backlit für hinterleuchtete Rahmen']},
      {k:'04 / Schaufenster',t:'Folien & Fenster',body:'Schaufensterfolien, Sichtschutzfolien, milchige Klebefolie und farbige Akzentfolien — mit Verlegung auf Wunsch.',list:['Frosted-Folien und Sandstrahleffekt','Vollflächige Bildmotive','Branding-Folien auf Glas und Türen']}
    ],
    featureKicker:'Skala',
    featureHead:'Wenn Größe',featureHeadEm:'Bestandteil ist.',
    featureLead:'Ein gutes Bild bleibt im Großformat ruhig — schlechtes Bildmaterial wird laut. Deshalb sind Auswahl, Aufbereitung und Material gleichwertig zur Größe selbst.',
    featureItems:[
      {tag:'Auflösung',line:'Mindestens 150 dpi auf der finalen Größe — bei Betrachtungsabstand zur Wand reichen oft 120 dpi.'},
      {tag:'Material',line:'Acryl wirkt mit Licht, Alu ruhig, Stoff weich. Die Wahl folgt dem Raum.'},
      {tag:'Montage',line:'Schienen, Distanzhalter, Klett oder Direktklebung — abgestimmt auf Wand und Wechselbedarf.'},
      {tag:'Lieferung',line:'Eigenlieferung im Rheinland, Spedition deutschlandweit, Aufbau auf Wunsch.'}
    ],
    formSubject:'Großformat-Anfrage — Matthias Ramahi',
    formHeadline:'Großformat anfragen.',
    formLead:'Beschreibe kurz Wand oder Anlass, ungefähre Größe und Material. Wenn nur die Wand bekannt ist, reicht ein Foto und die Maße — daraus lassen sich Format und Material vorschlagen.'
  },
  {
    slug:'werbetechnik-duesseldorf',
    nav:'leistungen',
    title:'Werbetechnik Düsseldorf — Matthias Ramahi',
    meta:'Werbetechnik in Düsseldorf: Fahrzeugbeschriftung, Schaufenster, Beschilderung, Folierung und LED-Lichtwerbung — über Matthias Ramahi und das Partnernetzwerk vor Ort.',
    crumbText:'Werbetechnik',
    heroKicker:'Signage · Düsseldorf',
    h1:'Werbe',h1Em:'technik.',
    heroLead:'Schilder, Folien, Fahrzeuge, Schaufenster, Lichtwerbung — physische Markenpräsenz im Stadtraum. In Düsseldorf umgesetzt mit erfahrenen Partnerwerkstätten.',
    heroBg:'assets/services/Catoir_Ramahi-1-32-768x512-1.webp',
    heroAlt:'Werbetechnik-Installation in Düsseldorf',
    heroCaption:'Außenmontage · Rheinland',
    ctaPrimary:'Werbetechnik anfragen',ctaSecondary:'Leistungen ansehen',
    overviewHead:'Anwendungs',overviewHeadEm:'bereiche.',
    overviewLead:'Werbetechnik ist Handwerk vor Ort. Wir denken Motiv, Material und Montage zusammen — egal ob Schaufenster, Fahrzeug oder Hausfassade.',
    cards:[
      {k:'01 / Fahrzeug',t:'Fahrzeugbeschriftung',body:'Logo, Kontakt, Vollverklebung — auf PKW, Transporter, LKW oder Anhänger. Mit Vorab-Visualisierung am Fahrzeugfoto.',list:['Teilbeklebung mit Hochleistungsfolie','Vollfolierung in Farbe oder Carbon','Montage im rheinländischen Raum']},
      {k:'02 / Schaufenster',t:'Schaufenster & Glas',body:'Werbung an Ladenflächen — von der dezenten Logofolie bis zur vollflächigen Bildmotivfolie. Demontagefreundlich und sauber.',list:['Frosted für Sichtschutz','Bedruckte Folien mit Bildmotiv','Türaufkleber und Hinweistexte']},
      {k:'03 / Fassade',t:'Schilder & Beschilderung',body:'Außenschilder, Hinweisschilder, Türschilder und Leitsysteme — aus Alu-Dibond, Acryl, Metall oder beleuchtet.',list:['Außenmontage mit Statik-Check','Acrylplatten mit Standoffs','Leitsysteme für Praxen und Studios']},
      {k:'04 / Licht',t:'LED-Lichtwerbung',body:'Hinterleuchtete Logos, Profilbuchstaben und Lightboxes — energieeffizient mit LED und langer Lebensdauer.',list:['Profilbuchstaben aus Acryl mit LED','Backlit-Boxes für Schaufenster','Außenfertige Lichtkästen IP65']}
    ],
    featureKicker:'Ablauf',
    featureHead:'Vom Foto auf die',featureHeadEm:'Fläche.',
    featureLead:'Ein Aufkleber wirkt nur, wenn er sitzt. Wir liefern Werbetechnik mit Vorlauf: Visualisierung am Foto, Materialcheck, Montagetermin und Endabnahme.',
    featureItems:[
      {tag:'Vorlauf',line:'Visualisierung auf Foto von Fahrzeug, Fläche oder Schaufenster.'},
      {tag:'Material',line:'Hochleistungsfolien für Außenmontage — UV-stabil, salzwasserfest, demontagefreundlich.'},
      {tag:'Montage',line:'Vor-Ort-Montage im Rheinland, Werkstattfolierung für Fahrzeuge.'},
      {tag:'Wartung',line:'Nachbestellungen, Reparaturen und Wartung mit gleicher Folie und Druck.'}
    ],
    formSubject:'Werbetechnik-Anfrage — Matthias Ramahi',
    formHeadline:'Werbetechnik anfragen.',
    formLead:'Schreibe kurz, was und wo beklebt oder beschriftet werden soll. Hilfreich: Foto der Fläche, gewünschtes Logo oder Motiv und ein grober Zeitraum.'
  },
  {
    slug:'webdesign-seo-duesseldorf',
    nav:'leistungen',
    title:'Webdesign & SEO Düsseldorf — Matthias Ramahi',
    meta:'Webdesign und SEO in Düsseldorf: moderne Websites, lokale Sichtbarkeit, Performance, Bildsprache, Landingpages und suchmaschinenfreundliche Struktur.',
    crumbText:'Webdesign & SEO',
    heroKicker:'Web · Düsseldorf',
    h1:'Webdesign',h1Em:'& SEO.',
    heroLead:'Moderne Websites mit klarer Struktur, schneller Performance und lokaler Suchmaschinensichtbarkeit — für Studios, Marken und Mittelstand im Rheinland.',
    heroBg:'assets/services/screencapture-gr-knospe-de-2025-10-02-23_10_04-scaled.jpg',
    heroAlt:'Website Screenshot — Webdesign Düsseldorf',
    heroCaption:'Launch · NRW',
    ctaPrimary:'Website anfragen',ctaSecondary:'Leistungen ansehen',
    overviewHead:'Web',overviewHeadEm:'leistungen.',
    overviewLead:'Webdesign und SEO als eine Sache. Eine schöne Seite, die niemand findet, ist genauso wenig wert wie eine ranking-starke Seite, die niemand mag.',
    cards:[
      {k:'01 / Site',t:'Neue Websites',body:'Editorial geführte, moderne Websites — handgebaut, ohne Page-Builder-Aufblähung. Schnell, schlank, semantisch sauber.',list:['HTML/CSS/JS hand-getuned','Performance-Budget < 200 KB Initial','Strukturierte Daten und OG-Tags']},
      {k:'02 / Local SEO',t:'Lokale Sichtbarkeit',body:'Lokale Kategorieseiten, Google-Business-Optimierung, strukturierte Daten und Local-Pack-Sichtbarkeit für Düsseldorf und NRW.',list:['Stadtseiten mit echtem Mehrwert','LocalBusiness-Schema','Bewertungs- und GBP-Pflege']},
      {k:'03 / Content',t:'Inhalte & Bildsprache',body:'Aus Fotografie und Text wird ein konsistenter Auftritt. Bildauswahl, Tonalität und Struktur kommen aus einer Hand.',list:['Eigene Fotos statt Stock','Editorial-Texte mit Haltung','Konsistente Mikrocopy']},
      {k:'04 / Tech',t:'Performance & Wartung',body:'Schnelle Ladezeiten, Core-Web-Vitals im grünen Bereich, regelmäßige Wartung und neue Inhalte ohne Drama.',list:['LCP < 2 s, CLS ~ 0','Wartungspaket monatlich','Inhalte-Updates ohne CMS-Stress']}
    ],
    featureKicker:'System',
    featureHead:'Nicht eine Seite —',featureHeadEm:'ein System.',
    featureLead:'Eine Website ist kein Layout, sondern ein System aus Inhalten, Struktur und Verbindungen. Wenn das System stimmt, wachsen einzelne Seiten organisch dazu.',
    featureItems:[
      {tag:'Struktur',line:'Sitemap, URL-Schema und interne Verlinkung vor dem ersten Pixel.'},
      {tag:'Design',line:'Editorial geführt, mit echtem Bildmaterial und ruhiger Typo.'},
      {tag:'Tech',line:'Astro, Next.js oder reines HTML — je nach Bedarf, nicht nach Trend.'},
      {tag:'SEO',line:'On-Page, Local, Schema, OG-Tags und Sitemap im Standard inbegriffen.'}
    ],
    formSubject:'Webdesign-Anfrage — Matthias Ramahi',
    formHeadline:'Website anfragen.',
    formLead:'Beschreibe kurz, ob es um eine neue Website, Relaunch, lokale SEO-Seiten oder eine Beratung geht. Hilfreich: vorhandene Website, Branche, Zielregion und ob Texte oder Bilder schon vorhanden sind.'
  },
  {
    slug:'viola-musik-duesseldorf',
    nav:'leistungen',
    title:'Viola Musik Düsseldorf — Matthias Ramahi',
    meta:'Viola und Geigenmusik in Düsseldorf: Empfehlung über das Partnernetzwerk von Matthias Ramahi — Hochzeit, Empfang, Trauerfeier und private Anlässe.',
    crumbText:'Viola Musik',
    heroKicker:'Music · Düsseldorf',
    h1:'Viola',h1Em:'Musik.',
    heroLead:'Klassische Begleitung für Hochzeit, Empfang, Trauerfeier und private Anlässe — Viola, Geige und Klavier. Über das Partnernetzwerk aus Düsseldorf vermittelt.',
    heroBg:'assets/services/portfolio_webp_full_004-2.webp',
    heroAlt:'Viola und Geige beim klassischen Auftritt',
    heroCaption:'Empfang · Rheinland',
    ctaPrimary:'Musik anfragen',ctaSecondary:'Leistungen ansehen',
    overviewHead:'Anlass',overviewHeadEm:'leistungen.',
    overviewLead:'Eine ruhige musikalische Begleitung verändert einen Raum spürbar. Hier vermittelte Künstler:innen spielen klassisches Repertoire, sensibel und ohne Show.',
    cards:[
      {k:'01 / Hochzeit',t:'Trauung & Empfang',body:'Standesamt, kirchliche Trauung, freie Trauung und Sektempfang — mit klassischem Repertoire oder Pop-Arrangements.',list:['Solo Viola, Geige oder Duo','Repertoire abgestimmt vorab','Auf-/Abbau leise und unkompliziert']},
      {k:'02 / Trauer',t:'Trauerfeier',body:'Würdevolle musikalische Begleitung in Trauerhalle, Kirche oder am Grab — ruhig und einfühlsam.',list:['Ruhige Stückauswahl','Diskret im Hintergrund','Kurzfristig verfügbar']},
      {k:'03 / Privat',t:'Private Anlässe',body:'Geburtstag, Jubiläum, Firmenfeier, Galaempfang — klassische Musik als Atmosphäre, nicht als Hintergrundbeschallung.',list:['Sets von 30–90 Minuten','Mehrere Künstler verfügbar','Beleuchtung und Aufstellung beachtet']},
      {k:'04 / Studio',t:'Aufnahmen',body:'Für Filme, Imagefilme oder eigene Kompositionen entstehen Studio- und Live-Aufnahmen über das Musiknetzwerk.',list:['Studio-Aufnahmen in Düsseldorf','Live-Mitschnitt mit Multi-Mikro','Lizenzierung für Imagefilme']}
    ],
    featureKicker:'Vermittlung',
    featureHead:'Musik aus dem',featureHeadEm:'Netzwerk.',
    featureLead:'Wir spielen nicht selbst — wir vermitteln Künstler:innen aus dem direkten Umfeld. Erfahren, zuverlässig, im Rheinland verwurzelt.',
    featureItems:[
      {tag:'Repertoire',line:'Klassik, Filmmusik, Pop-Arrangements und individuelle Stücke nach Absprache.'},
      {tag:'Besetzung',line:'Solo Viola/Geige, Duo mit Klavier, kleines Streicher-Ensemble.'},
      {tag:'Anlass',line:'Trauung, Trauerfeier, Empfang, Galadinner, Privatkonzert.'},
      {tag:'Region',line:'Düsseldorf · Rheinland · NRW — auf Anfrage auch deutschlandweit.'}
    ],
    formSubject:'Musik-Anfrage — Matthias Ramahi',
    formHeadline:'Musik anfragen.',
    formLead:'Schreibe kurz Anlass, Ort, Datum und ungefähre Dauer. Wir vermitteln passende Künstler:innen und melden uns mit Vorschlag und Konditionen.'
  },
  {
    slug:'videografie-duesseldorf',
    nav:'leistungen',
    title:'Videografie Düsseldorf — Matthias Ramahi',
    meta:'Videografie in Düsseldorf: Imagefilm, Musikvideo, Eventfilm und redaktionelles Bewegtbild — über Sophia Ramahi und das Studio-Netzwerk aus dem Rheinland.',
    crumbText:'Videografie',
    heroKicker:'Motion · Düsseldorf',
    h1:'Video',h1Em:'grafie.',
    heroLead:'Bewegtbild aus Düsseldorf — Imagefilm, Musikvideo, Eventfilm und redaktionelles Bewegtbild. Aus einer Familie, aus einer Bildsprache: Foto und Video aus einem Guss.',
    heroBg:'assets/services/portfolio_webp_full_058-1.webp',
    heroAlt:'Filmstill aus einer Videografie-Produktion',
    heroCaption:'Set · Rheinland',
    ctaPrimary:'Video anfragen',ctaSecondary:'Leistungen ansehen',
    overviewHead:'Bewegtbild',overviewHeadEm:'leistungen.',
    overviewLead:'Bewegtbild verlangt eine andere Planung als Stand — aber dieselbe Bildsprache. Wir koordinieren beides parallel auf Set, damit nichts zweimal gefilmt werden muss.',
    cards:[
      {k:'01 / Marke',t:'Imagefilm',body:'Kurze, ruhige Imagefilme für Marken, Studios, Praxen und Handwerk — mit echtem Bildmaterial statt Stock.',list:['60–120 Sekunden Schnittfassung','Voice-Over oder reine Bildsprache','Vertikal- und Horizontalvariante']},
      {k:'02 / Musik',t:'Musikvideo',body:'Musikvideos für Soloartists, Bands und Klassiker — produziert von Sophia Ramahi in Düsseldorf.',list:['Konzeption mit Künstler:innen','Mehrtägige Drehs möglich','Color Grading editorial']},
      {k:'03 / Event',t:'Eventfilm',body:'Hochzeit, Konzert, Konferenz, Galaabend — diskrete Multi-Kamera-Aufzeichnung und cineastischer Schnitt.',list:['Multi-Kamera mit getrenntem Audio','Highlightfilm und Lang-Dokument','Lieferung in 14 Tagen']},
      {k:'04 / Redaktion',t:'Redaktionelles Bewegtbild',body:'Reportagen, Interviews, Behind-the-Scenes — für Pressekits, Social und Magazine.',list:['Interview-Setup mit Backdrop','Untertitel und Kapitelmarken','Vertikal-Version für Social']}
    ],
    featureKicker:'Foto + Video',
    featureHead:'Bewegung und',featureHeadEm:'Bild — gleichzeitig.',
    featureLead:'Wenn Foto und Video aus einer Hand kommen, gibt es weniger Termine, weniger Doppelarbeit und ein einheitliches Ergebnis. Sophia und ich planen Sets gemeinsam.',
    featureItems:[
      {tag:'Planung',line:'Ein Briefing für Foto und Video — abgestimmte Bildsprache und Shotlist.'},
      {tag:'Crew',line:'Sophia Ramahi (Video), Matthias Ramahi (Foto), Tonpartner aus NRW.'},
      {tag:'Lieferung',line:'Foto-Galerie + Schnittfassung Video parallel, 1–3 Wochen.'},
      {tag:'Netzwerk',line:'Imagefilm, Musikvideo, Eventfilm und redaktionelles Bewegtbild aus einem Studio.'}
    ],
    formSubject:'Video-Anfrage — Matthias Ramahi',
    formHeadline:'Video anfragen.',
    formLead:'Schreibe kurz Anlass, Format und gewünschten Termin. Wenn paralleles Foto gewünscht ist, einfach erwähnen — dann planen wir es gemeinsam mit Sophia.'
  },
  {
    slug:'drucke-sonderanfertigungen-duesseldorf',
    nav:'leistungen',
    title:'Drucke & Sonderanfertigungen Düsseldorf — Matthias Ramahi',
    meta:'Drucke und Sonderanfertigungen in Düsseldorf: individuelle Fotodrucke, Sonderformate, Materialtests, Interior-Präsentationen und hochwertige Objektlösungen.',
    crumbText:'Drucke & Sonderanfertigungen',
    heroKicker:'Object Lab · Düsseldorf',
    h1:'Drucke &',h1Em:'Sonderanfertigungen.',
    heroLead:'Wenn ein Motiv nicht in ein Standardformat passt — Sonderformate, Materialtests, Interior-Lösungen und objektartige Präsentationen für Wand, Raum und Anlass.',
    heroBg:'assets/services/fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp',
    heroAlt:'Sonderanfertigung — Print als Objekt',
    heroCaption:'Object · Düsseldorf',
    ctaPrimary:'Sonderanfertigung anfragen',ctaSecondary:'Leistungen ansehen',
    overviewHead:'Object',overviewHeadEm:'leistungen.',
    overviewLead:'Diese Seite bündelt alles, was nicht in Standardformate passt: besondere Materialien, kleine Serien, persönliche Geschenke und objektartige Präsentationen.',
    cards:[
      {k:'01 / Objekt',t:'Individuelle Fotodrucke',body:'Einzelmotive als hochwertiges Objekt geplant — Format, Material und Oberfläche passend zum Bild, nicht zur Lagerware.',list:['Portrait, Landschaft oder Fahrzeug','Rahmung und Präsentationsart','Materialberatung nach Einsatzort']},
      {k:'02 / Serie',t:'Kleine Serien & Editionen',body:'Für Ausstellungen, Geschenke oder Sammler entstehen abgestimmte Serien mit konsistenter Farbe und Präsentation.',list:['Signatur oder Editionsnummer','Mehrere Größen aus einer Serie','Verpackung und Übergabe']},
      {k:'03 / Raum',t:'Interior & Wand',body:'Motiv und Raum gemeinsam gedacht: Größe, Blickachse, Licht und Material bestimmen das Ergebnis.',list:['Wohnraum, Büro oder Showroom','Panoramen und Sonderformate','Wandcheck und Empfehlung']},
      {k:'04 / Test',t:'Materialtests & Sonderfinish',body:'Wenn das Motiv eine besondere Oberfläche braucht, werden Finish, Träger und Wirkung vorher sauber geprüft.',list:['Acryl, Dibond, Canvas, Papier','Matt, glänzend, metallic','Proof und Muster möglich']}
    ],
    featureKicker:'Materiallogik',
    featureHead:'Material verändert',featureHeadEm:'das Bild.',
    featureLead:'Ein Auto auf Metallic-Papier wirkt anders als ein Portrait auf mattem FineArt. Eine Landschaft auf Acrylglas hat eine andere Tiefe als auf Leinwand. Material ist Teil der Bildwirkung.',
    featureItems:[
      {tag:'Glanz',line:'Für Tiefe, Farbe und Reflexion — Auto, Studio, dunkle Motive.'},
      {tag:'Matt',line:'Für ruhige, galerieartige Bildwirkung — Portrait, Landschaft.'},
      {tag:'Objekt',line:'Für stabile, repräsentative Wandflächen — Acryl, Dibond.'},
      {tag:'Sonder',line:'Für haptische Editionen und Geschenke — Bütten, Holz, Metallpapier.'}
    ],
    formSubject:'Sonderanfertigung — Matthias Ramahi',
    formHeadline:'Sonderanfertigung anfragen.',
    formLead:'Schreib kurz Motiv, Format und Einsatzort. Wenn Größe, Material oder Menge noch offen sind, beschreibe einfach Raum, Anlass und gewünschte Wirkung — daraus lässt sich die passende Lösung ableiten.'
  }
];

const enc=v=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const topbar=(current)=>`<header class="topbar" id="topbar" data-current="${current}">
  <a class="brand" href="index.html">Matthias<br>Ramahi</a>
  <nav class="topbar__nav" aria-label="Hauptnavigation">
    <a href="index.html" data-nav="home">Home</a>
    <div class="topbar__group" data-nav="fotografie">
      <a href="fotografie-duesseldorf.html" class="topbar__group-toggle" aria-haspopup="true">Fotografie</a>
      <div class="topbar__submenu" role="menu">
        <a href="automobil-fotografie-duesseldorf.html">Automobil</a>
        <a href="sportwagen-fotografie-duesseldorf.html">Sportwagen</a>
        <a href="oldtimer-fotografie-duesseldorf.html">Oldtimer</a>
        <a href="motorrad-fotografie-duesseldorf.html">Motorrad</a>
        <a href="portraitfotografie-duesseldorf.html">Portrait</a>
        <a href="landschaftsfotografie-duesseldorf.html">Landschaft</a>
      </div>
    </div>
    <a href="portfolio.html" data-nav="portfolio">Portfolio</a>
    <a href="ueber-mich.html" data-nav="ueber-mich">Über mich</a>
    <a href="blog.html" data-nav="blog">Blog</a>
    <a href="leistungen.html" data-nav="leistungen"${current==='leistungen'?' aria-current="page"':''}>Weitere Dienstleistungen</a>
    <a href="contact.html" data-nav="kontakt">Kontakt</a>
  </nav>
  <a class="topbar__cta" href="#anfrage">Projekt anfragen</a>
  <button class="topbar__menu" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="mobile-menu"><span aria-hidden="true"></span><span aria-hidden="true"></span></button>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <div class="mobile-menu__inner">
    <a class="mobile-menu__brand" href="index.html">Matthias Ramahi</a>
    <nav class="mobile-menu__nav" aria-label="Hauptnavigation mobil">
      <a href="index.html" data-nav="home">Home</a>
      <div class="mobile-menu__group"><a class="mobile-menu__label" href="fotografie-duesseldorf.html">Fotografie</a><a href="automobil-fotografie-duesseldorf.html">Automobil</a><a href="sportwagen-fotografie-duesseldorf.html">Sportwagen</a><a href="oldtimer-fotografie-duesseldorf.html">Oldtimer</a><a href="motorrad-fotografie-duesseldorf.html">Motorrad</a><a href="portraitfotografie-duesseldorf.html">Portrait</a><a href="landschaftsfotografie-duesseldorf.html">Landschaft</a></div>
      <a href="portfolio.html" data-nav="portfolio">Portfolio</a><a href="ueber-mich.html" data-nav="ueber-mich">Über mich</a><a href="blog.html" data-nav="blog">Blog</a><a href="leistungen.html" data-nav="leistungen">Weitere Dienstleistungen</a><a href="contact.html" data-nav="kontakt">Kontakt</a>
    </nav>
    <a class="mobile-menu__cta" href="#anfrage">Projekt anfragen</a>
  </div>
</div>`;

const footer=()=>`<footer class="mr-footer" data-header-theme="dark" aria-label="Website Footer">
  <div class="mr-footer__hairline" aria-hidden="true"></div>
  <div class="mr-footer__inner">
    <section class="mr-footer__top" aria-label="Studio">
      <a class="mr-footer__mark" href="index.html" aria-label="Zurück zur Startseite">Matthias<span>Ramahi</span></a>
      <div class="mr-footer__claim">
        <p>Fotografie aus Düsseldorf — kuratiert für <em>Marke, Sammlung und Druck</em>. Editorial geführt, technisch ruhig, bereit für die nächste Ausgabe.</p>
        <div class="mr-footer__meta" aria-label="Studio"><a href="ueber-mich.html">Studio &nbsp;→</a></div>
      </div>
    </section>
    <nav class="mr-footer__cols" aria-label="Footer Sitemap">
      <div class="mr-footer__col" aria-labelledby="ftr-foto">
        <span class="mr-footer__col-label" id="ftr-foto">Fotografie</span>
        <div class="mr-footer__col-list">
          <a href="fotografie-duesseldorf.html">Übersicht</a>
          <a href="automobil-fotografie-duesseldorf.html">Automobil</a>
          <a href="sportwagen-fotografie-duesseldorf.html">Sportwagen</a>
          <a href="oldtimer-fotografie-duesseldorf.html">Oldtimer</a>
          <a href="motorrad-fotografie-duesseldorf.html">Motorrad</a>
          <a href="portraitfotografie-duesseldorf.html">Portrait</a>
          <a href="landschaftsfotografie-duesseldorf.html">Landschaft</a>
        </div>
      </div>
      <div class="mr-footer__col" aria-labelledby="ftr-studio">
        <span class="mr-footer__col-label" id="ftr-studio">Studio</span>
        <div class="mr-footer__col-list">
          <a href="index.html">Home</a>
          <a href="portfolio.html">Portfolio</a>
          <a href="ueber-mich.html">Über mich</a>
          <a href="blog.html">Journal</a>
          <a href="contact.html">Kontakt</a>
        </div>
      </div>
      <div class="mr-footer__col" aria-labelledby="ftr-services">
        <span class="mr-footer__col-label" id="ftr-services">Weitere Dienstleistungen</span>
        <div class="mr-footer__col-list">
          <a href="leistungen.html">Übersicht</a>
          <a href="fotolabor-druck-duesseldorf.html">Fotolabor &amp; Druck</a>
          <a href="webdesign-seo-duesseldorf.html">Webdesign &amp; SEO</a>
          <a href="videografie-duesseldorf.html">Videografie</a>
          <a href="drucke-sonderanfertigungen-duesseldorf.html">Drucke &amp; Sonderanfertigungen</a>
        </div>
      </div>
      <div class="mr-footer__col" aria-labelledby="ftr-kontakt">
        <span class="mr-footer__col-label" id="ftr-kontakt">Direkt</span>
        <div class="mr-footer__contact">
          <div class="mr-footer__contact-line"><span>E-Mail</span><a href="mailto:info@matthiasramahi.de">info@matthiasramahi.de</a></div>
          <div class="mr-footer__contact-line"><span>Telefon</span><a href="tel:+4917642449858">+49 176 42 44 98 58</a></div>
          <div class="mr-footer__contact-line"><span>Studio</span><strong>Düsseldorf · NRW</strong></div>
        </div>
      </div>
    </nav>
    <div class="mr-footer__base">
      <span class="mr-footer__base-left">© 2026 Matthias Ramahi</span>
      <span class="mr-footer__base-center"><a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">Instagram ↗</a></span>
      <span class="mr-footer__base-right"><a href="impressum.html">Impressum</a><a href="datenschutz.html">Datenschutz</a></span>
    </div>
  </div>
</footer>`;

const styles=()=>`<style>
:root{
  --ink:#0a0c11;--ink-2:#1a1d24;
  --paper:#f3f1ea;--paper-2:#ebe7dc;--paper-3:#e2dccd;
  --muted:#5b6068;--quiet:rgba(10,12,17,.42);
  --rule:rgba(10,12,17,.14);
  --accent:oklch(54% 0.13 36);--accent-2:oklch(62% 0.10 60);--accent-soft:oklch(82% 0.06 60);
  --mono:'JetBrains Mono','IBM Plex Mono','SFMono-Regular',ui-monospace,Menlo,monospace;
  --serif:'Iowan Old Style','Charter','Iowan',Georgia,'Times New Roman',serif;
  --sans:'Inter Tight','Inter','Söhne','Avenir Next','Helvetica Neue',Arial,system-ui,sans-serif;
  --ease:cubic-bezier(.23,1,.32,1);
}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:hidden}
main{display:block}
img{display:block;max-width:100%;height:auto}
.sp-eyebrow{font:11px var(--mono);letter-spacing:.32em;text-transform:uppercase;color:var(--muted);margin:0;display:inline-flex;align-items:center;gap:12px}
.sp-eyebrow::before{content:"";width:28px;height:1px;background:currentColor;opacity:.55}
[data-theme="dark"] .sp-eyebrow{color:rgba(243,241,234,.62)}

/* ===== HERO ===== */
.sp-hero{position:relative;min-height:100svh;display:flex;align-items:flex-end;padding:clamp(120px,14vw,180px) clamp(28px,5vw,84px) clamp(60px,7vw,96px);overflow:hidden;background:#0a0c11;color:#f3f1ea;isolation:isolate}
.sp-hero__bg{position:absolute;inset:0;z-index:0;overflow:hidden}
.sp-hero__bg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;filter:saturate(.94) contrast(1.02);animation:spKB 38s ease-in-out infinite alternate;transform:scale(1.06)}
@keyframes spKB{0%{transform:scale(1.06) translate3d(-.6%,.4%,0)}100%{transform:scale(1.14) translate3d(.6%,-.6%,0)}}
.sp-hero__bg::after{content:"";position:absolute;inset:0;pointer-events:none;background:
  linear-gradient(180deg,rgba(2,3,6,.62) 0%,rgba(2,3,6,.18) 32%,rgba(2,3,6,.42) 70%,rgba(2,3,6,.94) 100%),
  radial-gradient(ellipse at 22% 92%,color-mix(in oklch,var(--accent) 36%,transparent) 0%,transparent 56%),
  radial-gradient(ellipse at 78% 8%,rgba(243,241,234,.16) 0%,transparent 60%)}
.sp-hero__inner{position:relative;z-index:1;max-width:1320px;width:100%;margin:0 auto;display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,.85fr);gap:clamp(28px,4vw,72px);align-items:end}
.sp-hero__copy{min-width:0}
.sp-hero__crumb{font:11px var(--mono);letter-spacing:.22em;text-transform:uppercase;color:rgba(243,241,234,.62);margin:0 0 32px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.sp-hero__crumb a{color:inherit;text-decoration:none}.sp-hero__crumb a:hover{color:#fff}
.sp-hero__crumb span{opacity:.45}
.sp-hero__kicker{margin:0 0 24px;color:rgba(243,241,234,.7)}
.sp-hero__h1{margin:0;font-family:var(--serif);font-weight:600;font-size:clamp(58px,9vw,156px);line-height:.9;letter-spacing:-.026em;color:#f7f4ec;text-wrap:balance;text-shadow:0 1px 32px rgba(2,3,6,.42)}
.sp-hero__h1 em{font-style:italic;font-weight:500;color:color-mix(in oklch,var(--accent) 78%,#fff 22%)}
.sp-hero__lead{margin:32px 0 0;max-width:54ch;font-size:clamp(16px,1.22vw,20px);line-height:1.5;color:rgba(243,241,234,.82)}
.sp-hero__actions{margin:38px 0 0;display:flex;gap:14px;flex-wrap:wrap}
.sp-btn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:14px 22px;font:11px var(--mono);letter-spacing:.2em;text-transform:uppercase;text-decoration:none;border:1px solid #f3f1ea;color:#f3f1ea;background:transparent;transition:all .3s var(--ease)}
.sp-btn--primary{background:#f3f1ea;color:var(--ink)}
.sp-btn:hover{background:color-mix(in oklch,var(--accent) 60%,#fff 40%);color:var(--ink);border-color:transparent}
.sp-btn--primary:hover{background:color-mix(in oklch,var(--accent) 65%,#fff 35%);color:var(--ink)}
.sp-hero__side{font:11px var(--mono);letter-spacing:.24em;text-transform:uppercase;color:rgba(243,241,234,.7);display:grid;gap:18px;justify-self:end}
.sp-hero__side dt{opacity:.5;font-size:10px}
.sp-hero__side dd{margin:4px 0 0;color:rgba(243,241,234,.92);font-size:13px}

/* ===== OVERVIEW CARDS ===== */
.sp-over{padding:clamp(80px,10vw,140px) clamp(28px,5vw,84px);background:var(--paper)}
.sp-over__head{max-width:1320px;margin:0 auto clamp(48px,6vw,80px);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(28px,5vw,80px);align-items:end}
.sp-over__title{margin:18px 0 0;font-family:var(--serif);font-weight:600;font-size:clamp(40px,5.2vw,84px);line-height:.96;letter-spacing:-.024em}
.sp-over__title em{font-style:italic;font-weight:500;color:color-mix(in oklch,var(--accent) 76%,var(--ink) 24%)}
.sp-over__lead{margin:0;max-width:50ch;font-size:clamp(15px,1.14vw,18px);line-height:1.55;color:color-mix(in oklch,var(--ink) 75%,#fff 25%)}
.sp-over__grid{max-width:1320px;margin:0 auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.sp-card{position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:32px;padding:36px;background:#fff;border:1px solid var(--rule);transition:all .35s var(--ease);min-height:340px;text-decoration:none;color:inherit}
.sp-card:nth-child(2),.sp-card:nth-child(3){background:var(--ink);color:#f3f1ea;border-color:rgba(255,255,255,.08)}
.sp-card:hover{transform:translateY(-3px);border-color:color-mix(in oklch,var(--accent) 50%,transparent);box-shadow:0 28px 70px rgba(10,12,17,.14)}
.sp-card__kicker{font:11px var(--mono);letter-spacing:.24em;text-transform:uppercase;color:color-mix(in oklch,var(--accent) 75%,var(--ink) 25%);margin:0}
.sp-card:nth-child(2) .sp-card__kicker,.sp-card:nth-child(3) .sp-card__kicker{color:color-mix(in oklch,var(--accent) 78%,#fff 22%)}
.sp-card__title{margin:14px 0 0;font-family:var(--serif);font-weight:600;font-size:clamp(26px,2.4vw,36px);line-height:1;letter-spacing:-.02em}
.sp-card__body{margin:18px 0 0;font-size:14.5px;line-height:1.55;color:color-mix(in oklch,var(--ink) 70%,#fff 30%);max-width:46ch}
.sp-card:nth-child(2) .sp-card__body,.sp-card:nth-child(3) .sp-card__body{color:rgba(243,241,234,.72)}
.sp-card__list{margin:0;padding:0;list-style:none;display:grid;gap:10px;font-size:13.5px;line-height:1.45}
.sp-card__list li{position:relative;padding-left:18px;color:color-mix(in oklch,var(--ink) 65%,#fff 35%)}
.sp-card:nth-child(2) .sp-card__list li,.sp-card:nth-child(3) .sp-card__list li{color:rgba(243,241,234,.68)}
.sp-card__list li::before{content:"";position:absolute;left:0;top:.55em;width:6px;height:6px;background:var(--accent);transform:rotate(45deg)}

/* ===== FEATURE / MATERIAL ===== */
.sp-feature{padding:clamp(80px,10vw,140px) clamp(28px,5vw,84px);background:var(--ink);color:#f3f1ea}
.sp-feature__inner{max-width:1320px;margin:0 auto;display:grid;grid-template-columns:minmax(0,.78fr) minmax(0,1.22fr);gap:clamp(40px,6vw,100px);align-items:start}
.sp-feature__lead h2{margin:18px 0 0;font-family:var(--serif);font-weight:600;font-size:clamp(40px,5.2vw,80px);line-height:.96;letter-spacing:-.024em;color:#f7f4ec}
.sp-feature__lead h2 em{font-style:italic;font-weight:500;color:color-mix(in oklch,var(--accent) 78%,#fff 22%)}
.sp-feature__lead p{margin:28px 0 0;max-width:42ch;font-size:clamp(15px,1.14vw,18px);line-height:1.6;color:rgba(243,241,234,.72)}
.sp-feature__list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1)}
.sp-feature__item{padding:30px 28px;background:var(--ink);min-height:160px;display:flex;flex-direction:column;gap:14px}
.sp-feature__tag{font:11px var(--mono);letter-spacing:.24em;text-transform:uppercase;color:color-mix(in oklch,var(--accent) 75%,#fff 25%);margin:0}
.sp-feature__line{margin:0;font-size:15.5px;line-height:1.5;color:rgba(243,241,234,.84)}

/* ===== CTA STRIP ===== */
.sp-cta{padding:clamp(48px,6vw,80px) clamp(28px,5vw,84px);background:var(--paper-2)}
.sp-cta__inner{max-width:1320px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:clamp(24px,4vw,60px);align-items:center}
.sp-cta__head{margin:0;font-family:var(--serif);font-weight:600;font-size:clamp(28px,3.2vw,46px);line-height:1;letter-spacing:-.022em;color:var(--ink)}
.sp-cta__head em{font-style:italic;font-weight:500;color:color-mix(in oklch,var(--accent) 78%,var(--ink) 22%)}
.sp-cta__btn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:14px 24px;font:11px var(--mono);letter-spacing:.2em;text-transform:uppercase;text-decoration:none;border:1px solid var(--ink);color:var(--ink);background:transparent;transition:all .3s var(--ease)}
.sp-cta__btn:hover{background:var(--ink);color:#f3f1ea}

/* ===== RESPONSIVE ===== */
@media (max-width:980px){
  .sp-hero{padding:clamp(110px,18vw,150px) 22px 56px}
  .sp-hero__inner{grid-template-columns:1fr;gap:32px}
  .sp-hero__side{justify-self:start}
  .sp-hero__h1{font-size:clamp(48px,12vw,92px)}
  .sp-over__head{grid-template-columns:1fr;gap:24px}
  .sp-over__grid{grid-template-columns:1fr}
  .sp-feature__inner{grid-template-columns:1fr;gap:36px}
  .sp-feature__list{grid-template-columns:1fr}
  .sp-cta__inner{grid-template-columns:1fr;text-align:left}
}
@media (max-width:600px){
  .sp-card{padding:26px;min-height:auto}
  .sp-feature__item{padding:22px}
}

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion:reduce){
  .sp-hero__bg img{animation:none;transform:none}
  .sp-card{transition:none}
}
</style>`;

const renderPage=(s)=>`<!doctype html>
<html lang="de"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${enc(s.title)}</title>
<meta name="description" content="${enc(s.meta)}" />
<meta name="author" content="Matthias Ramahi" />
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
<meta name="theme-color" content="#0a0c11" />
<link rel="canonical" href="https://matthiasramahi.de/${s.slug}.html" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Matthias Ramahi" />
<meta property="og:locale" content="de_DE" />
<meta property="og:title" content="${enc(s.title)}" />
<meta property="og:description" content="${enc(s.meta)}" />
<meta property="og:url" content="https://matthiasramahi.de/${s.slug}.html" />
<meta property="og:image" content="https://matthiasramahi.de/${s.heroBg}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${enc(s.title)}" />
<meta name="twitter:description" content="${enc(s.meta)}" />
<meta name="twitter:image" content="https://matthiasramahi.de/${s.heroBg}" />
<link rel="preload" as="image" href="${s.heroBg}" fetchpriority="high" />
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Service","name":"${enc(s.crumbText)}","provider":{"@type":"Person","name":"Matthias Ramahi","address":{"@type":"PostalAddress","addressLocality":"Düsseldorf","addressRegion":"NRW","addressCountry":"DE"}},"areaServed":{"@type":"State","name":"Nordrhein-Westfalen"},"url":"https://matthiasramahi.de/${s.slug}.html","description":"${enc(s.meta)}"}</script>
<link rel="stylesheet" href="assets/site-chrome.css" />
${styles()}
</head>
<body class="has-mr-footer">

${topbar(s.nav)}

<main>

  <!-- HERO -->
  <section class="sp-hero" data-header-theme="dark" aria-label="${enc(s.crumbText)}">
    <div class="sp-hero__bg" aria-hidden="true">
      <img src="${s.heroBg}" alt="${enc(s.heroAlt)}" loading="eager" fetchpriority="high" />
    </div>
    <div class="sp-hero__inner">
      <div class="sp-hero__copy">
        <p class="sp-hero__crumb"><a href="leistungen.html">Weitere Dienstleistungen</a><span>/</span><span>${enc(s.crumbText)}</span></p>
        <p class="sp-eyebrow sp-hero__kicker">${enc(s.heroKicker)}</p>
        <h1 class="sp-hero__h1">${enc(s.h1)}<br><em>${enc(s.h1Em)}</em></h1>
        <p class="sp-hero__lead">${enc(s.heroLead)}</p>
        <div class="sp-hero__actions">
          <a class="sp-btn sp-btn--primary" href="#anfrage">${enc(s.ctaPrimary)} →</a>
          <a class="sp-btn" href="#leistungen">${enc(s.ctaSecondary)}</a>
        </div>
      </div>
      <dl class="sp-hero__side" aria-label="Eckdaten">
        <div><dt>Standort</dt><dd>Düsseldorf · NRW</dd></div>
        <div><dt>Bereich</dt><dd>${enc(s.crumbText)}</dd></div>
        <div><dt>Briefing</dt><dd>≤ 24 h Antwort</dd></div>
      </dl>
    </div>
  </section>

  <!-- OVERVIEW -->
  <section class="sp-over" id="leistungen" data-header-theme="light" aria-label="${enc(s.crumbText)} — Leistungen">
    <div class="sp-over__head">
      <div>
        <p class="sp-eyebrow">Leistungen im Überblick</p>
        <h2 class="sp-over__title">${enc(s.overviewHead)} <em>${enc(s.overviewHeadEm)}</em></h2>
      </div>
      <p class="sp-over__lead">${enc(s.overviewLead)}</p>
    </div>
    <div class="sp-over__grid">
      ${s.cards.map(c=>`<a class="sp-card" href="#anfrage">
        <div>
          <p class="sp-card__kicker">${enc(c.k)}</p>
          <h3 class="sp-card__title">${enc(c.t)}</h3>
          <p class="sp-card__body">${enc(c.body)}</p>
        </div>
        <ul class="sp-card__list">${c.list.map(li=>`<li>${enc(li)}</li>`).join('')}</ul>
      </a>`).join('\n      ')}
    </div>
  </section>

  <!-- FEATURE / MATERIAL -->
  <section class="sp-feature" data-header-theme="dark" aria-label="${enc(s.featureKicker)}">
    <div class="sp-feature__inner">
      <div class="sp-feature__lead">
        <p class="sp-eyebrow">${enc(s.featureKicker)}</p>
        <h2>${enc(s.featureHead)} <em>${enc(s.featureHeadEm)}</em></h2>
        <p>${enc(s.featureLead)}</p>
      </div>
      <div class="sp-feature__list">
        ${s.featureItems.map(it=>`<div class="sp-feature__item"><p class="sp-feature__tag">${enc(it.tag)}</p><p class="sp-feature__line">${enc(it.line)}</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <!-- CTA STRIP -->
  <section class="sp-cta" data-header-theme="light" aria-label="Anfrage">
    <div class="sp-cta__inner">
      <h2 class="sp-cta__head">Bereit für ein <em>${enc(s.crumbText)}-Briefing.</em></h2>
      <a class="sp-cta__btn" href="#anfrage">Anfrage starten →</a>
    </div>
  </section>

  <!-- CANONICAL CONTACT SLOT -->
  <section id="anfrage"
    data-contact-section
    data-contact-subject="${enc(s.formSubject)}"
    data-contact-headline="${enc(s.formHeadline)}"
    data-contact-lead="${enc(s.formLead)}"
    data-header-theme="dark"
    aria-label="Anfrage"></section>

</main>

${footer()}

<script src="assets/site-chrome.js" defer></script>
</body></html>
`;

for(const s of SERVICES){
  const out=resolve(root,`${s.slug}.html`);
  writeFileSync(out,renderPage(s),'utf8');
  console.log('wrote',s.slug+'.html');
}
console.log(`\n${SERVICES.length} service pages generated.`);
