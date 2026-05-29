import './assert-legacy-reference-write-allowed.mjs'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://matthiasramahi.de'
const AUTHOR = 'Matthias Ramahi'

const articles = [
  {
    file: 'blog-portraits-ohne-generische-posen.html',
    title: 'Portraits ohne generische Posen',
    metaTitle: 'Portraits ohne generische Posen | Matthias Ramahi',
    description:
      'Wie ruhige Portraitfotografie in Duesseldorf mehr Wirkung erzeugt als ueberinszenierte Posen: Licht, Distanz, Haltung und Bildauswahl bewusst fuehren.',
    category: 'Portrait',
    minutes: '4 Min',
    image: 'assets/photos/portrait-warm.webp',
    links: [
      ['Portraitfotografie Duesseldorf', 'portraitfotografie-duesseldorf.html'],
      ['Business Portrait', 'business-portrait-duesseldorf.html'],
      ['Headshot Fotograf', 'headshot-fotograf-duesseldorf.html'],
    ],
    sections: [
      ['Der ruhige Raum wirkt staerker', 'Gute Portraits muessen nicht laut sein. Entscheidend ist, ob der Bildraum der Person hilft, praesent zu bleiben. Wenn Pose, Licht und Hintergrund zu viel erklaeren, verschwindet oft genau das, was ein Portrait tragen soll: Haltung, Blick und eine glaubwuerdige Naehe.'],
      ['Fuehrung statt Posing-Katalog', 'Im Shooting geht es nicht darum, eine Liste bekannter Posen abzuhaken. Sinnvoller ist eine klare Fuehrung: kleine Veraenderungen in Schulterlinie, Blickrichtung, Abstand zur Kamera und Atemtempo. Dadurch entsteht Varianz, ohne dass die Person in eine Rolle gedrueckt wird.'],
      ['Licht als Tonfall', 'Portraitlicht darf praezise sein, ohne steril zu wirken. Weiches Seitenlicht, kontrollierte Schatten und ein ruhiger Hintergrund geben dem Gesicht Struktur. Fuer Business, Editorial und Personal Branding ist diese Balance wichtiger als ein Effekt, der nur auf den ersten Blick auffaellt.'],
      ['Auswahl ist Teil der Fotografie', 'Die finale Serie entsteht in der Auswahl. Ein gutes Set braucht nicht moeglichst viele Motive, sondern eine nachvollziehbare Reihenfolge: ein starkes Hauptportrait, Varianten fuer Website und Social, Details fuer redaktionische Nutzung und Bilder, die auch in kleiner Groesse funktionieren.'],
    ],
    faq: [
      ['Wie viele Portraits braucht man wirklich?', 'Fuer die meisten Anwendungen reichen wenige starke Motive mit klarer Variation. Wichtiger als Menge ist, dass jedes Bild eine eigene Funktion erfuellt.'],
      ['Ist eine bestimmte Location notwendig?', 'Nicht zwingend. Ein ruhiger Raum, gutes Fensterlicht oder ein passender Arbeitskontext koennen oft glaubwuerdiger wirken als ein neutraler Hintergrund.'],
    ],
  },
  {
    file: 'blog-serie-kuratieren.html',
    title: 'Wie eine fotografische Serie kuratiert wird',
    metaTitle: 'Wie eine fotografische Serie kuratiert wird | Matthias Ramahi',
    description:
      'Von der ersten Bildauswahl bis zur finalen Reihenfolge: Warum kuratierte Fotografie-Serien staerker wirken als lose Einzelbilder.',
    category: 'Prozess',
    minutes: '6 Min',
    image: 'assets/optimized/assets-photos-oldtimer-stage-1920.webp',
    links: [
      ['Portfolio ansehen', 'portfolio.html'],
      ['Automobil Fotografie', 'automobil-fotografie-duesseldorf.html'],
      ['Oldtimer Fotografie', 'oldtimer-fotografie-duesseldorf.html'],
    ],
    sections: [
      ['Eine Serie braucht Richtung', 'Einzelbilder koennen stark sein, aber eine Serie muss fuehren. Sie braucht Anfang, Verdichtung und Abschluss. Gerade bei Fahrzeugen, Portraits oder Landschaften entscheidet die Reihenfolge darueber, ob ein Betrachter bleibt oder nur schnell durchscrollt.'],
      ['Erst Funktion, dann Geschmack', 'Vor der Auswahl steht die Frage nach der Nutzung: Verkauf, Portfolio, Website, Print, Kampagne oder interne Praesentation. Erst wenn diese Funktion klar ist, laesst sich entscheiden, welche Bilder tragen und welche nur Varianten sind.'],
      ['Reduktion macht wertiger', 'Eine gute Auswahl laesst Luft. Aehnliche Motive konkurrieren miteinander und schwaechen oft den Eindruck. Besser ist eine knappe Serie mit klaren Rollen: Einstieg, Totale, Detail, Atmosphaere, Mensch oder Kontext und ein starkes Schlussbild.'],
      ['Technische Konsistenz zaehlt', 'Farbe, Kontrast, Beschnitt und Helligkeit muessen zusammenarbeiten. Eine Serie wirkt hochwertig, wenn jedes Bild eigenstaendig bleibt und trotzdem dieselbe visuelle Sprache spricht.'],
    ],
    faq: [
      ['Wie viele Bilder gehoeren in eine Serie?', 'Das haengt vom Einsatz ab. Fuer eine Website reichen oft 8 bis 16 Bilder, fuer eine Kampagne oder ein Portfolio koennen mehr Varianten sinnvoll sein.'],
      ['Wer entscheidet die finale Auswahl?', 'Die Auswahl entsteht idealerweise gemeinsam: fotografische Kuratierung trifft auf den realen Einsatz der Bilder.'],
    ],
  },
  {
    file: 'blog-oldtimer-wertobjekt.html',
    title: 'Oldtimer als Wertobjekt fotografieren',
    metaTitle: 'Oldtimer als Wertobjekt fotografieren | Matthias Ramahi',
    description:
      'Warum Oldtimer-Fotografie fuer Verkauf, Sammlung und Auktion von Zurueckhaltung, Materialtreue und klarer Dokumentation profitiert.',
    category: 'Oldtimer',
    minutes: '3 Min',
    image: 'assets/optimized/assets-photos-oldtimer-stage-1920.webp',
    links: [
      ['Oldtimer Fotografie Duesseldorf', 'oldtimer-fotografie-duesseldorf.html'],
      ['Classic Car Fotografie', 'classic-car-fotografie-duesseldorf.html'],
      ['Oldtimer Verkaufsfotos', 'oldtimer-verkaufsfotos-duesseldorf.html'],
    ],
    sections: [
      ['Wert braucht Ruhe', 'Ein Oldtimer ist selten nur ein Fahrzeug. Zustand, Herkunft, Material und Pflegegeschichte sind Teil des Bildes. Zu viel Drama kann diesen Wert verdecken. Ruhige Perspektiven, kontrollierte Reflexe und ehrliche Details wirken oft hochwertiger.'],
      ['Dokumentation und Atmosphaere verbinden', 'Fuer Verkauf oder Auktion muss Fotografie klar zeigen, was vorhanden ist: Karosserie, Innenraum, Lack, Chrom, Leder, Instrumente und Gebrauchsspuren. Gleichzeitig darf die Serie nicht wie ein technischer Zustandsbericht wirken.'],
      ['Patina nicht verstecken', 'Patina kann Charakter sein. Sie sollte nicht platt retuschiert werden, sondern sauber sichtbar bleiben. Entscheidend ist, ob Gebrauchsspuren als Mangel oder als Geschichte gelesen werden. Die Bildfuehrung hilft bei dieser Einordnung.'],
      ['Kontext macht Vertrauen', 'Ein neutraler, ordentlicher Standort, nachvollziehbare Details und konsistente Farbe schaffen Vertrauen. Gerade bei hochwertigen Fahrzeugen sind Bilder Teil der Verkaufsargumentation.'],
    ],
    faq: [
      ['Sind Detailbilder wichtig?', 'Ja. Details wie Leder, Instrumente, Chrom, Felgen und Lack geben Kauefern und Sammlern Orientierung.'],
      ['Soll ein Oldtimer dramatisch inszeniert werden?', 'Nur wenn es zur Nutzung passt. Fuer Verkauf und Sammlung ist eine kontrollierte, ruhige Bildsprache meist staerker.'],
    ],
  },
  {
    file: 'blog-fine-art-druck.html',
    title: 'Vom Bild zum Fine-Art-Druck',
    metaTitle: 'Vom Bild zum Fine-Art-Druck | Matthias Ramahi',
    description:
      'Warum Material, Papier, Farbmanagement und Format Teil der fotografischen Wirkung sind, wenn Bilder als Fine-Art-Print oder Wandbild funktionieren sollen.',
    category: 'Druck',
    minutes: '5 Min',
    image: 'assets/services/fea8218e-7546-48ef-8581-2b99bb3cdefe_centered_reduced.webp',
    links: [
      ['Fotolabor und Druck', 'fotolabor-druck-duesseldorf.html'],
      ['Landschaftsbilder kaufen', 'landschaftsbilder-kaufen.html'],
      ['Wandbilder Landschaftsfotografie', 'wandbilder-landschaftsfotografie.html'],
    ],
    sections: [
      ['Druck ist kein Export-Klick', 'Ein Bild veraendert sich, sobald es den Bildschirm verlaesst. Papierstruktur, Format, Betrachtungsabstand und Licht im Raum bestimmen, ob ein Motiv ruhig, dicht oder flach wirkt. Deshalb gehoert Druckplanung zur fotografischen Entscheidung.'],
      ['Material traegt die Stimmung', 'Matte Papiere nehmen Glanz zurueck und betonen Flaeche und Tiefe. Glattere Oberflaechen koennen Details und Kontrast praesenter machen. Die Wahl des Materials sollte zur Stimmung des Motivs und zum Raum passen.'],
      ['Farbmanagement schafft Verlaesslichkeit', 'Fine-Art-Druck braucht kontrollierte Daten: Profil, Tonwerte, Schaerfung und Probedrucke. Ein starker Print entsteht nicht durch maximale Saettigung, sondern durch eine stimmige Uebersetzung des Bildes in Material.'],
      ['Format ist Wirkung', 'Ein kleines Format fordert Naehe. Ein grosses Format veraendert einen Raum. Vor dem Druck sollte klar sein, ob das Bild Blickfang, Ruhepunkt oder Teil einer Serie sein soll.'],
    ],
    faq: [
      ['Welche Groesse ist sinnvoll?', 'Das haengt vom Raum und Betrachtungsabstand ab. Ein groesseres Bild braucht nicht immer mehr Motiv, sondern mehr Ruhe in der Komposition.'],
      ['Kann jedes Foto als Fine-Art-Print funktionieren?', 'Nicht jedes. Aufloesung, Tonwerte, Motivruhe und Material muessen zusammenpassen.'],
    ],
  },
  {
    file: 'blog-location-scouting-duesseldorf.html',
    title: 'Location Scouting fuer starke Motive',
    metaTitle: 'Location Scouting in Duesseldorf | Matthias Ramahi',
    description:
      'Wie Orte fuer Automotive-, Portrait- und Landschaftsfotografie ausgewaehlt werden: Licht, Zugang, Hintergrund, Ruhe und Nutzungsziel.',
    category: 'Location',
    minutes: '4 Min',
    image: 'assets/optimized/assets-photos-landschaft-1920.webp',
    links: [
      ['Fotografie Duesseldorf', 'fotografie-duesseldorf.html'],
      ['Automobil Fotografie Duesseldorf', 'automobil-fotografie-duesseldorf.html'],
      ['Portraitfotografie Duesseldorf', 'portraitfotografie-duesseldorf.html'],
    ],
    sections: [
      ['Ein Ort muss arbeiten', 'Eine Location ist nicht nur Kulisse. Sie bestimmt Licht, Linien, Abstand, Ruhe und organisatorischen Ablauf. Gute Orte helfen dem Motiv, statt sich davorzudraengen.'],
      ['Lichtfenster zuerst', 'Der gleiche Ort kann morgens weich, mittags flach und abends cineastisch wirken. Deshalb beginnt Scouting mit Sonnenstand, Schatten, Reflexionsflaechen und der Frage, wann ein Motiv wirklich atmen kann.'],
      ['Zugang und Stoerungen planen', 'Parken, Publikumsverkehr, Genehmigungen und Wetteroptionen sind technische SEO-fremde, aber fotografisch entscheidende Faktoren. Eine starke Serie entsteht leichter, wenn diese Reibung vorher geloest ist.'],
      ['Ort und Suchintention verbinden', 'Fuer lokale SEO-Seiten ist Location nicht nur ein Keyword. Sie muss zeigen, warum ein Auftrag in Duesseldorf, NRW oder einer konkreten Stadt sinnvoll geplant werden kann. Ein guter Ort ergaenzt deshalb die Suchintention: Er macht sichtbar, ob es um Verkauf, Markenwirkung, persoenliche Praesenz oder eine ruhige redaktionelle Serie geht.'],
    ],
    faq: [
      ['Wird die Location vorab festgelegt?', 'Ja, zumindest die Richtung. Je nach Wetter und Motiv koennen Alternativen vorbereitet werden.'],
      ['Sind urbane Orte immer besser?', 'Nein. Ein ruhiger, reduzierter Ort kann fuer Portraits oder Fahrzeuge oft hochwertiger wirken als ein auffaelliger Hintergrund.'],
    ],
  },
  {
    file: 'blog-motorradfotografie-linien.html',
    title: 'Linien, Metall, Haltung',
    metaTitle: 'Motorradfotografie: Linien, Metall, Haltung | Matthias Ramahi',
    description:
      'Warum starke Motorradfotografie ueber Silhouette, Naehe, Material, Fahrerhaltung und klare Linien funktioniert.',
    category: 'Motorrad',
    minutes: '4 Min',
    image: 'assets/optimized/assets-photos-motorrad-1920.webp',
    links: [
      ['Motorrad Fotografie Duesseldorf', 'motorrad-fotografie-duesseldorf.html'],
      ['Custom Bike Fotografie', 'custom-bike-fotografie-duesseldorf.html'],
      ['Motorrad Verkaufsfotos', 'motorrad-verkaufsfotos-duesseldorf.html'],
    ],
    sections: [
      ['Motorradbilder brauchen Spannung', 'Bei Motorradern geht es um Linien, Material und Haltung. Ein gutes Bild zeigt nicht nur ein Objekt, sondern Energie: Tanklinie, Lenker, Reifen, Stand, Details und die Beziehung zum Fahrer oder zur Werkstatt.'],
      ['Silhouette vor Detailflut', 'Wenn alles gleich wichtig ist, verliert das Bike seine Form. Erst die klare Silhouette, dann die Details. Eine Serie sollte zeigen, wie die Maschine steht, wie sie gebaut ist und welche Stimmung sie traegt.'],
      ['Metall und Lack kontrollieren', 'Reflexe sind bei Motorradern besonders sensibel. Chrom, Lack, Carbon und Gummi brauchen Lichtfuehrung, die Material zeigt, ohne alles zu ueberstrahlen.'],
      ['Fahrerbilder sparsam einsetzen', 'Mit Fahrer entsteht Haltung. Ohne Fahrer entsteht Objektpraesenz. Beide Varianten koennen stark sein, wenn sie bewusst getrennt und nicht zufaellig gemischt werden.'],
    ],
    faq: [
      ['Sind Fahrerportraits sinnvoll?', 'Ja, wenn die Person Teil der Geschichte ist. Fuer reine Verkaufsbilder kann das Motorrad allein klarer sein.'],
      ['Welche Location passt zu einem Custom Bike?', 'Das haengt von Material und Stil ab. Werkstatt, Architektur oder ruhige Strassenkante funktionieren besser als beliebige Kulissen.'],
    ],
  },
]

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const attr = (value) => esc(value).replace(/"/g, '&quot;')
const canonical = (file) => `${SITE}/${file}`

function graphFor(article) {
  const url = canonical(article.file)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE}/blog.html` },
          { '@type': 'ListItem', position: 3, name: article.title, item: url },
        ],
      },
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        headline: article.title,
        description: article.description,
        image: [`${SITE}/${article.image}`],
        datePublished: '2026-05-26T09:00:00+02:00',
        dateModified: '2026-05-27T01:45:00+02:00',
        inLanguage: 'de-DE',
        articleSection: article.category,
        author: { '@type': 'Person', name: AUTHOR, url: `${SITE}/ueber-mich.html` },
        publisher: { '@type': 'Person', name: AUTHOR, url: `${SITE}/` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: article.faq.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  }
}

function render(article) {
  const url = canonical(article.file)
  const bodySections = article.sections
    .map(
      ([heading, copy], index) => `
        <section id="abschnitt-${index + 1}">
          <p class="kicker">${String(index + 1).padStart(2, '0')}</p>
          <h2>${esc(heading)}</h2>
          <p>${esc(copy)}</p>
        </section>`,
    )
    .join('\n')
  const related = article.links.map(([label, href]) => `<a href="${href}">${esc(label)}</a>`).join('\n          ')
  const faq = article.faq
    .map(([question, answer]) => `<article><h3>${esc(question)}</h3><p>${esc(answer)}</p></article>`)
    .join('\n          ')

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(article.metaTitle)}</title>
  <meta name="description" content="${attr(article.description)}" />
  <meta name="author" content="${AUTHOR}" />
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
  <meta name="theme-color" content="#020306" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="${AUTHOR}" />
  <meta property="og:locale" content="de_DE" />
  <meta property="og:title" content="${attr(article.title)}" />
  <meta property="og:description" content="${attr(article.description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE}/${article.image}" />
  <meta property="og:image:alt" content="${attr(article.title)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${attr(article.title)}" />
  <meta name="twitter:description" content="${attr(article.description)}" />
  <meta name="twitter:image" content="${SITE}/${article.image}" />
  <link rel="preload" as="image" href="${article.image}" fetchpriority="high" />
  <script type="application/ld+json">${JSON.stringify(graphFor(article))}</script>
  <link rel="stylesheet" href="assets/site-chrome.css" />
  <style>
    :root{--black:#020306;--ink:#101217;--paper:#f2f3ee;--white:#f8faf4;--red:#c93a31;--line:rgba(16,18,23,.13);--font:'Neue Haas Grotesk Display','Inter Tight','Avenir Next','Helvetica Neue',Arial,system-ui,sans-serif;--mono:'JetBrains Mono','IBM Plex Mono',ui-monospace,Menlo,monospace}
    *{box-sizing:border-box}html{scroll-behavior:smooth;background:var(--paper)}body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--font);-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}img{display:block;max-width:100%;height:auto}.kicker{font:10px/1.6 var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--red)}
    .article-hero{min-height:78svh;display:grid;align-items:end;padding:140px 5vw 64px;color:#fff;background:linear-gradient(180deg,rgba(2,3,6,.42),rgba(2,3,6,.92)),url('${article.image}') center/cover}.article-hero__inner{width:min(1120px,100%);margin:0 auto}.breadcrumb{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 28px;color:rgba(255,255,255,.68);font:10px var(--mono);letter-spacing:.16em;text-transform:uppercase}.article-hero h1{margin:16px 0 0;max-width:12ch;font-size:clamp(46px,8vw,112px);line-height:.86;letter-spacing:-.06em}.article-hero p.lead{max-width:56ch;margin:26px 0 0;color:rgba(255,255,255,.78);font-size:clamp(17px,1.4vw,22px);line-height:1.45}.meta{display:flex;gap:16px;flex-wrap:wrap;margin-top:28px;color:rgba(255,255,255,.7);font:10px var(--mono);letter-spacing:.16em;text-transform:uppercase}
    .article-body{padding:76px 5vw}.article-grid{width:min(1120px,100%);margin:0 auto;display:grid;grid-template-columns:minmax(180px,260px) minmax(0,1fr);gap:clamp(34px,6vw,90px)}aside{position:sticky;top:110px;align-self:start;border-left:1px solid var(--line);padding-left:18px;color:rgba(16,18,23,.62);font-size:14px;line-height:1.5}aside a{display:block;margin-top:10px;color:var(--ink)}section{padding-bottom:42px;border-bottom:1px solid var(--line);margin-bottom:42px}section h2{margin:8px 0 0;font-size:clamp(30px,4vw,58px);line-height:.95;letter-spacing:-.04em}section p{max-width:68ch;color:rgba(16,18,23,.72);font-size:18px;line-height:1.62}.related,.faq{width:min(1120px,100%);margin:0 auto;padding:0 0 70px}.related h2,.faq h2{font-size:clamp(32px,4vw,64px);letter-spacing:-.04em}.related nav{display:flex;flex-wrap:wrap;gap:10px}.related a{border:1px solid var(--line);padding:12px 14px;background:#fff}.faq-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.faq article{border:1px solid var(--line);background:#fff;padding:22px}.faq h3{margin:0;font-size:21px}.faq p{margin:12px 0 0;color:rgba(16,18,23,.7);line-height:1.5}
    .simple-footer{padding:28px 5vw;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;font:10px var(--mono);letter-spacing:.16em;text-transform:uppercase;color:rgba(16,18,23,.56)}
    @media(max-width:820px){.article-hero{padding:112px 20px 44px}.article-grid{grid-template-columns:1fr}.article-body{padding:54px 20px}aside{position:static}.faq-grid{grid-template-columns:1fr}.related,.faq{padding-left:20px;padding-right:20px}.article-hero h1{font-size:clamp(42px,14vw,78px)}}
  </style>
</head>
<body>
  <header class="topbar" id="topbar">
    <a class="brand" href="index.html">Matthias<br>Ramahi</a>
    <nav class="topbar__nav" aria-label="Hauptnavigation">
      <a href="index.html">Home</a><a href="fotografie-duesseldorf.html">Fotografie</a><a href="portfolio.html">Portfolio</a><a href="blog.html">Blog</a><a href="contact.html">Kontakt</a>
    </nav>
    <a class="topbar__cta" href="contact.html#anfrage">Projekt anfragen</a>
  </header>
  <main>
    <article>
      <header class="article-hero">
        <div class="article-hero__inner">
          <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="blog.html">Journal</a><span>/</span><span>${esc(article.category)}</span></nav>
          <p class="kicker">${esc(article.category)} · ${esc(article.minutes)}</p>
          <h1>${esc(article.title)}</h1>
          <p class="lead">${esc(article.description)}</p>
          <div class="meta"><span>Matthias Ramahi</span><span>Aktualisiert 27.05.2026</span></div>
        </div>
      </header>
      <div class="article-body">
        <div class="article-grid">
          <aside>
            <p>Dieser Beitrag stuetzt die SEO-Cluster der Fotografie-Seiten und fuehrt zu passenden Leistungs- und Standortseiten weiter.</p>
            ${related}
          </aside>
          <div>${bodySections}</div>
        </div>
      </div>
      <section class="faq" aria-label="FAQ">
        <h2>Kurze Fragen.</h2>
        <div class="faq-grid">${faq}</div>
      </section>
      <section class="related" aria-label="Verwandte Seiten">
        <h2>Weiter im Cluster.</h2>
        <nav>${related}</nav>
      </section>
    </article>
  </main>
  <footer class="mr-footer simple-footer"><span>© 2026 Matthias Ramahi</span><span><a href="impressum.html">Impressum</a> · <a href="datenschutz.html">Datenschutz</a></span></footer>
  <script src="assets/site-chrome.js" defer></script>
</body>
</html>
`
}

let written = 0
for (const article of articles) {
  fs.writeFileSync(path.join(ROOT, article.file), render(article), 'utf8')
  written += 1
}

console.log(JSON.stringify({ written, files: articles.map((article) => article.file) }, null, 2))
