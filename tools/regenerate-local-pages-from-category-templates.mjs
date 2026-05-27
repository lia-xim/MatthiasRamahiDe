import fs from 'node:fs';

const SITE = 'https://matthiasramahi.de/';

const cities = [
  ['Düsseldorf','duesseldorf'],
  ['Köln','koeln'],
  ['Essen','essen'],
  ['Dortmund','dortmund'],
  ['Duisburg','duisburg'],
  ['Bochum','bochum'],
  ['Wuppertal','wuppertal'],
  ['Leverkusen','leverkusen'],
  ['Oberhausen','oberhausen'],
  ['Krefeld','krefeld'],
  ['Mönchengladbach','moenchengladbach'],
  ['Moers','moers'],
  ['Gelsenkirchen','gelsenkirchen'],
  ['Bergisch Gladbach','bergisch-gladbach'],
  ['Solingen','solingen'],
  ['Remscheid','remscheid'],
  ['Mettmann','mettmann'],
  ['Hilden','hilden'],
  ['Dormagen','dormagen'],
  ['Neuss','neuss']
];

const regionNotes = {
  koeln: 'Rhein, Innenstadt, Rheinauhafen, Messeumfeld und urbane Hinterhöfe liefern starke Kontraste, ohne die Serie in Kulissen-Kitsch zu ziehen.',
  essen: 'Essen bringt Ruhrgebiet, Messe, Zeche Zollverein und sachliche Industriearchitektur zusammen — gut für klare, wertige Serien.',
  dortmund: 'Dortmund funktioniert für Serien mit urbaner Kante, Industrieflächen, Werkstattnähe und viel Raum für ruhige Bildachsen.',
  duisburg: 'Duisburg bringt Hafen, Stahl, Rhein und robuste Flächen ins Bild — besonders stark, wenn Materialität sichtbar bleiben soll.',
  bochum: 'Bochum liefert dichte Ruhrgebietsatmosphäre, Kulturorte und Werkstattnähe, ohne die Bildserie zu glatt wirken zu lassen.',
  wuppertal: 'Wuppertal bietet Topografie, Brücken, Schwebebahn und historische Industrie — gut für Bilder mit Tiefe und Richtung.',
  leverkusen: 'Leverkusen liegt zwischen Köln und Düsseldorf und eignet sich für kompakte Produktionen mit kurzen Wegen und klarer Planung.',
  oberhausen: 'Oberhausen bietet Ruhrgebietsflächen, Centro-Umfeld und Industriekultur für kräftige, praktische Bildserien.',
  krefeld: 'Krefeld verbindet Niederrhein, Villen, Parks und Gewerbeflächen — geeignet für reduzierte, hochwertige Produktionen.',
  moenchengladbach: 'Mönchengladbach bringt niederrheinische Ruhe, Stadtkanten und private Standorte für unaufgeregte, wertige Bildsprache.',
  moers: 'Moers ist ruhig, gut erreichbar und nahe an Duisburg/Krefeld — sinnvoll für Sammler, Unternehmen und private Auftraggeber.',
  gelsenkirchen: 'Gelsenkirchen liefert Ruhrgebietskanten, Arena-Umfeld und Industriekultur für ehrliche, nicht zu glatte Bildserien.',
  'bergisch-gladbach': 'Bergisch Gladbach liegt nah an Köln und eignet sich für diskrete, hochwertige Serien in Unternehmens- und Privatkontexten.',
  solingen: 'Solingen bringt Werkstätten, bergische Höhen und Materialnähe — gut für handwerkliche, fahrzeugnahe und portraitartige Serien.',
  remscheid: 'Remscheid steht für bergische Industrie, Werkstattnähe und Höhenlagen — stark für sachliche Serien mit Herkunft.',
  mettmann: 'Mettmann liegt direkt bei Düsseldorf und funktioniert für kompakte Produktionen mit schneller Abstimmung und ruhiger Planung.',
  hilden: 'Hilden verbindet Düsseldorf, Solingen und Köln — praktisch für effiziente Termine ohne Abstriche in der Bildführung.',
  dormagen: 'Dormagen liegt auf der Rheinachse zwischen Düsseldorf und Köln und eignet sich für Fahrzeug-, Unternehmens- und Portraitproduktionen.',
  neuss: 'Neuss liegt direkt am Düsseldorfer Westen, mit Hafen, Rhein und Gewerbeflächen — nah, lokal relevant und gut planbar.'
};

const keywordPages = {
  automobil: [
    ['automotive-fotografie-duesseldorf.html','Automotive Fotografie'],
    ['autofotografie-duesseldorf.html','Autofotografie'],
    ['fahrzeugfotografie-duesseldorf.html','Fahrzeugfotografie'],
    ['autohaus-fotografie-duesseldorf.html','Autohaus Fotografie'],
    ['autoverkauf-fotos-duesseldorf.html','Autoverkauf Fotos']
  ],
  sportwagen: [
    ['sportwagen-shooting-duesseldorf.html','Sportwagen Shooting'],
    ['sportwagen-fotoshooting-duesseldorf.html','Sportwagen Fotoshooting'],
    ['performance-car-fotografie-duesseldorf.html','Performance Car Fotografie'],
    ['exotic-car-fotografie-duesseldorf.html','Exotic Car Fotografie'],
    ['supersportwagen-fotografie-duesseldorf.html','Supersportwagen Fotografie']
  ],
  oldtimer: [
    ['classic-car-fotografie-duesseldorf.html','Classic Car Fotografie'],
    ['oldtimer-shooting-duesseldorf.html','Oldtimer Shooting'],
    ['youngtimer-fotografie-duesseldorf.html','Youngtimer Fotografie'],
    ['sammlerfahrzeug-fotografie-duesseldorf.html','Sammlerfahrzeug Fotografie'],
    ['oldtimer-verkaufsfotos-duesseldorf.html','Oldtimer Verkaufsfotos']
  ],
  motorrad: [
    ['motorrad-shooting-duesseldorf.html','Motorrad Shooting'],
    ['bike-fotografie-duesseldorf.html','Bike Fotografie'],
    ['custom-bike-fotografie-duesseldorf.html','Custom Bike Fotografie'],
    ['motorrad-verkaufsfotos-duesseldorf.html','Motorrad Verkaufsfotos'],
    ['biker-portrait-duesseldorf.html','Biker Portrait']
  ],
  portrait: [
    ['business-portrait-duesseldorf.html','Business Portrait'],
    ['headshot-fotograf-duesseldorf.html','Headshot Fotograf'],
    ['personal-branding-fotografie-duesseldorf.html','Personal Branding Fotografie'],
    ['unternehmensportrait-duesseldorf.html','Unternehmensportrait'],
    ['pressefoto-duesseldorf.html','Pressefoto']
  ],
  landschaft: [
    ['landschaftsbilder-kaufen.html','Landschaftsbilder kaufen'],
    ['fine-art-prints-landschaft.html','Fine-Art-Prints Landschaft'],
    ['wandbilder-landschaftsfotografie.html','Wandbilder Landschaftsfotografie'],
    ['naturfotografie-prints.html','Naturfotografie Prints'],
    ['landschaftsfotografie-print-deutschland.html','Landschaftsfotografie Print']
  ]
};

const categories = {
  automobil: {
    label: 'Automobil Fotografie', short: 'Automobil', slug: 'automobil-fotografie', template: 'automobil-fotografie-duesseldorf.html',
    intent: 'Automobil Fotografie', seoTitle: 'Automobilfotografie',
    desc: place => `Automobilfotografie ${place}: Exterieur, Interieur, Details und cineastische Bildserien für Marke, Showroom, Verkauf und Kampagne — geplant aus Düsseldorf / NRW.`,
    hero: place => `Automobil Fotografie in ${place}: Exterieur, Interieur, Details und Cinematic werden zu einer kuratierten Serie geführt — mit kontrollierter Lichtführung, ruhigen Reflexionen und Dateien für Web, Print, Verkauf oder Kampagne.`,
    lead: place => `Schreibe kurz, welches Fahrzeug in ${place} fotografiert werden soll, wo es steht, welche Wirkung die Bilder tragen sollen und ob die Serie privat, kommerziell oder als Kampagne genutzt wird. Wir klären Location, Licht und Ablauf gemeinsam vor dem ersten Klick.`
  },
  sportwagen: {
    label: 'Sportwagen Fotografie', short: 'Sportwagen', slug: 'sportwagen-fotografie', template: 'sportwagen-fotografie-duesseldorf.html',
    intent: 'Sportwagen Fotografie', seoTitle: 'Sportwagenfotografie',
    desc: place => `Sportwagenfotografie ${place}: hochwertige Serien für Performance Cars, Sammlerfahrzeuge, Händler und Marken — Exterieur, Interieur, Details und Druckqualität.`,
    hero: place => `Sportwagen Fotografie in ${place}: kontrollierte Reflexe, klare Winkel, Interieur-Details und ein Bildsatz, der Druck hat, ohne in Showeffekte zu kippen.`,
    lead: place => `Schreibe kurz, welcher Sportwagen in ${place} fotografiert werden soll, ob die Bilder für Verkauf, Sammlung, Marke oder Social genutzt werden und welches Zeitfenster möglich ist. Wir planen Licht, Ort und Ablauf gemeinsam.`
  },
  oldtimer: {
    label: 'Oldtimer Fotografie', short: 'Oldtimer', slug: 'oldtimer-fotografie', template: 'oldtimer-fotografie-duesseldorf.html',
    intent: 'Oldtimer Fotografie', seoTitle: 'Oldtimer-Fotografie',
    desc: place => `Oldtimer-Fotografie ${place}: Bildserien für Sammlung, Verkauf, Auktion und Ausstellung — Karosserie, Lack, Chrom, Leder, Patina und Herkunft.`,
    hero: place => `Oldtimer Fotografie in ${place}: Form, Herkunft und Material werden ruhig geführt — für Sammlung, Verkauf, Auktion oder Ausstellung, mit Charakter und Nostalgie statt austauschbarer Fahrzeugbilder.`,
    lead: place => `Schreibe kurz, welcher Oldtimer in ${place} fotografiert werden soll — Modell, Baujahr, Standort und ob die Bilder für Sammlung, Auktion, Verkauf oder privat genutzt werden. Wir klären Raum, Licht und Ablauf gemeinsam.`
  },
  motorrad: {
    label: 'Motorrad Fotografie', short: 'Motorrad', slug: 'motorrad-fotografie', template: 'motorrad-fotografie-duesseldorf.html',
    intent: 'Motorrad Fotografie', seoTitle: 'Motorradfotografie',
    desc: place => `Motorradfotografie ${place}: Bildserien für Custom Bikes, Werkstätten, Händler und private Maschinen — Silhouette, Mechanik, Haltung und Detail.`,
    hero: place => `Motorrad Fotografie in ${place}: Schärfe auf Maschine und Haltung — Silhouette, Mechanik, Details und Fahrerbilder werden als kraftvolle Serie geplant, nicht als beliebiges Bike-Foto.`,
    lead: place => `Schreibe kurz, welches Bike in ${place} fotografiert werden soll — Modell, Standort, ob Fahrerbilder gewünscht sind und wofür die Bilder genutzt werden. Wir klären Licht, Location und Ablauf gemeinsam.`
  },
  portrait: {
    label: 'Portrait Fotografie', short: 'Portrait', slug: 'portraitfotografie', template: 'portraitfotografie-duesseldorf.html',
    intent: 'Portrait Fotografie', seoTitle: 'Portraitfotografie',
    desc: place => `Portraitfotografie ${place}: Personal Branding, Business Portraits, Editorial, Team und Presse — professionell, ruhig, nahbar und nicht glattgebügelt.`,
    hero: place => `Portrait Fotografie in ${place}: Blick, Distanz und Licht werden so geführt, dass ein Bild professionell wirkt, ohne den Menschen dahinter glattzubügeln — für Personal Branding, Presse, Team oder Editorial.`,
    lead: place => `Schreibe kurz, wofür die Portraits in ${place} gedacht sind — Personal Branding, Editorial, Team, Presse oder Bewerbung. Wichtig sind Person/Team, gewünschte Wirkung, Ort und Zeitraum. Stil und Licht klären wir vor dem ersten Klick.`
  },
  landschaft: {
    label: 'Landschaftsfotografie', short: 'Landschaft', slug: 'landschaftsfotografie', template: 'landschaftsfotografie-duesseldorf.html',
    intent: 'Landschaftsfotografie', seoTitle: 'Landschaftsfotografie',
    desc: place => `Landschaftsfotografie ${place}: Fine-Art-Prints, Wandbilder, Editionen und großformatige Arbeiten für private Räume, Praxen, Hotels und Sammlungen.`,
    hero: place => `Landschaftsfotografie für ${place}: Bildräume aus Geduld, Licht und Atmosphäre — als Fine-Art-Print, Wandbild, Edition oder Großformat für Räume, die Ruhe statt Spektakel brauchen.`,
    lead: place => `Schreibe kurz, wofür die Landschaftsbilder in ${place} eingesetzt werden — Fine-Art-Print, Innenraum, Editorial, Website oder Markenbild. Wichtig sind gewünschte Atmosphäre, Format, Material und Zeitraum.`
  }
};

const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const text = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const canonical = file => SITE + file;

function setAttrMeta(html, name, content) {
  const escaped = attr(content);
  html = html.replace(new RegExp(`<meta name="${name}" content="[^"]*" \/>`), `<meta name="${name}" content="${escaped}" />`);
  html = html.replace(new RegExp(`<meta property="${name}" content="[^"]*" \/>`), `<meta property="${name}" content="${escaped}" />`);
  return html;
}

function replaceHead(html, {file, title, desc, schema}) {
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${text(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${attr(desc)}" />`);
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical(file)}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${attr(title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${attr(desc)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical(file)}" />`);
  html = html.replace(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${attr(title)}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${attr(title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${attr(desc)}" />`);
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
  return html;
}

function schema(file, title, desc, place) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonical(file)}#service`,
    serviceType: title,
    name: title,
    description: desc,
    areaServed: place,
    provider: {'@type':'Person', name:'Matthias Ramahi', url:SITE, email:'info@matthiasramahi.de'}
  };
}

function placeDescriptor(place, slug, categoryKey) {
  if (slug === 'nrw') return categoryKey === 'landschaft'
    ? 'NRW ist hier der regionale Suchraum für Fine-Art-Prints, Wandbilder und Editionen — Auswahl, Material und Lieferung werden passend zum Raum geplant.'
    : 'NRW verbindet Rheinland, Ruhrgebiet, Niederrhein und Bergisches Land — sinnvoll für Produktionen, die lokal gesucht, aber professionell geplant werden müssen.';
  if (slug === 'deutschland') return categoryKey === 'landschaft'
    ? 'Deutschlandweit steht nicht der Shooting-Ort im Vordergrund, sondern die Auswahl des Motivs, die Druckqualität, das Format und die Wirkung im Raum.'
    : 'Deutschlandweite Produktionen werden über Motiv, Nutzung, Reise, Lichtfenster und Output geplant — mit Düsseldorf als ruhigem organisatorischem Ausgangspunkt.';
  return regionNotes[slug] || `${place} wird als lokaler Suchraum mit klarer Planung, Lichtfenster und passender Nutzung der Bildserie verstanden.`;
}

function h1For(categoryKey, place) {
  const p = text(place);
  switch (categoryKey) {
    case 'automobil': return `<h1 class="pd-title">\n          <span class="line"><span class="word">Automobil</span></span>\n          <span class="line"><span class="word">Fotografie ${p}.</span></span>\n        </h1>`;
    case 'sportwagen': return `<h1 class="tri-title">\n        <span class="line"><span class="word">Sportwagen</span></span>\n        <span class="line"><span class="word">Fotografie ${p}.</span></span>\n      </h1>`;
    case 'oldtimer': return `<h1 class="hero-mp__title"><span>Oldtimer-Fotografie</span><em>${p}.</em></h1>`;
    case 'motorrad': return `<h1 class="hero-mr__title" id="heroMrTitle">\n        <span class="line"><span class="word">Motorrad</span></span>\n        <span class="line"><span class="word">Fotografie ${p}</span></span>\n      </h1>`;
    case 'portrait': return `<h1 class="hero-pt__title">Portraitfotografie <em>${p}.</em></h1>`;
    case 'landschaft': return `<h1 class="hero-ls__title">\n        <span class="l"><span class="w">Landschaft</span></span>\n        <span class="l"><span class="w">Fotografie ${p}.</span></span>\n      </h1>`;
    default: throw new Error(`No H1 for ${categoryKey}`);
  }
}

function replaceHeroText(html, categoryKey, c, place, slug) {
  const localHero = `${c.hero(place)} ${placeDescriptor(place, slug, categoryKey)}`;
  const safe = text(localHero);
  const h1 = h1For(categoryKey, place);
  switch (categoryKey) {
    case 'automobil':
      html = html.replace(/<h1 class="pd-title">[\s\S]*?<\/h1>/, h1);
      html = html.replace(/<p class="pd-sub">[\s\S]*?<\/p>/, `<p class="pd-sub">${safe}</p>`);
      break;
    case 'sportwagen':
      html = html.replace(/<h1 class="tri-title">[\s\S]*?<\/h1>/, h1);
      html = html.replace(/<p class="tri-sub">[\s\S]*?<\/p>/, `<p class="tri-sub">${safe}</p>`);
      break;
    case 'oldtimer':
      html = html.replace(/<h1 class="hero-mp__title">[\s\S]*?<\/h1>/, h1);
      html = html.replace(/<p class="hero-mp__sub">[\s\S]*?<\/p>/, `<p class="hero-mp__sub">${safe}</p>`);
      break;
    case 'motorrad':
      html = html.replace(/<h1 class="hero-mr__title" id="heroMrTitle">[\s\S]*?<\/h1>/, h1);
      html = html.replace(/<p class="hero-mr__lede">[\s\S]*?<\/p>/, `<p class="hero-mr__lede">${safe}</p>`);
      break;
    case 'portrait':
      html = html.replace(/<h1 class="hero-pt__title">[\s\S]*?<\/h1>/, h1);
      html = html.replace(/<p class="hero-pt__sub">[\s\S]*?<\/p>/, `<p class="hero-pt__sub">${safe}</p>`);
      break;
    case 'landschaft':
      html = html.replace(/<h1 class="hero-ls__title">[\s\S]*?<\/h1>/, h1);
      html = html.replace(/<p class="hero-ls__sub">[\s\S]*?<\/p>/, `<p class="hero-ls__sub">${safe}</p>`);
      break;
  }
  return html;
}

function replaceContacts(html, c, place) {
  const subject = `${c.label} ${place} Anfrage`;
  const headline = `${c.short} ${place} <em>anfragen.</em>`;
  html = html.replace(/mailto:info@matthiasramahi\.de\?subject=[^"]*"/g, `mailto:info@matthiasramahi.de?subject=${encodeURIComponent(subject)}"`);
  html = html.replace(/data-contact-subject="[^"]*"/, `data-contact-subject="${attr(subject)}"`);
  html = html.replace(/data-contact-headline="[^"]*"/, `data-contact-headline="${attr(headline)}"`);
  html = html.replace(/data-contact-lead="[^"]*"/, `data-contact-lead="${attr(c.lead(place))}"`);
  return html;
}

function replaceLocalStructuredBits(html, c, place, slug) {
  const label = `${c.label} ${place}`;
  html = html.replace(/aria-label="[^"]*Fotografie[^"]*"/, `aria-label="${attr(label)}"`);
  html = html.replace(/<a href="#anfrage">Serie anfragen →<\/a>/, `<a href="#anfrage">Shooting buchen →</a>`);
  html = html.replace(/<a href="#anfrage">Landschafts-Serie anfragen →<\/a>/, `<a href="#anfrage">Print anfragen →</a>`);
  html = html.replace(/<a href="#anfrage">Shooting anfragen →<\/a>/, `<a href="#anfrage">Shooting buchen →</a>`);
  return html;
}

function pageFile(c, slug) {
  if (slug === 'duesseldorf') return c.template;
  if (slug === 'nrw' || slug === 'deutschland') return `${c.slug}-${slug}.html`;
  return `${c.slug}-${slug}.html`;
}

function clonePage(categoryKey, c, place, slug) {
  const file = pageFile(c, slug);
  if (slug === 'duesseldorf') return null;
  let html = fs.readFileSync(c.template, 'utf8');
  const title = `${c.seoTitle || c.label} ${place} — Matthias Ramahi`;
  const desc = c.desc(place);
  html = replaceHead(html, {file, title, desc, schema: schema(file, `${c.seoTitle || c.label} ${place}`, desc, place)});
  html = replaceHeroText(html, categoryKey, c, place, slug);
  html = replaceContacts(html, c, place);
  html = replaceLocalStructuredBits(html, c, place, slug);
  fs.writeFileSync(file, html, 'utf8');
  return file;
}

function cloneKeywordPage(categoryKey, c, file, keyword) {
  let html = fs.readFileSync(c.template, 'utf8');
  const place = 'Düsseldorf';
  const title = `${keyword} Düsseldorf — Matthias Ramahi`;
  const desc = `${keyword} Düsseldorf: eigenständiger Einstieg in den ${c.label}-Cluster — gleiche Art Direction, gleiche Bildsprache, gezielt auf diese Suchintention formuliert.`;
  html = replaceHead(html, {file, title, desc, schema: schema(file, `${keyword} Düsseldorf`, desc, place)});
  html = replaceHeroText(html, categoryKey, {...c, hero: () => `${keyword} in Düsseldorf: ${c.hero(place)}`}, place, 'duesseldorf');
  html = replaceContacts(html, {...c, label: keyword, short: keyword, lead: () => `Schreibe kurz, wofür ${keyword} gebraucht wird, welches Motiv oder Fahrzeug im Mittelpunkt steht und welche Nutzung geplant ist. Wir klären Ort, Licht, Umfang und Ausgabe gemeinsam.`}, place);
  fs.writeFileSync(file, html, 'utf8');
  return file;
}

function neutralHub(scope, place) {
  const file = `fotografie-${scope}.html`;
  const title = `Fotografie ${place} — Matthias Ramahi`;
  const desc = `Fotografie ${place}: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft — hochwertige Bildserien für Web, Print, Verkauf, Marke und Räume.`;
  const links = Object.values(categories).map(c => {
    const href = scope === 'duesseldorf' ? c.template : `${c.slug}-${scope}.html`;
    return `<a href="${href}">${text(c.label)} ${text(place)} →</a>`;
  }).join('\n          ');
  const cityCloud = cities.map(([name, slug]) => `<a href="fotografie-${slug}.html">${text(name)}</a>`).join('\n          ');
  const body = `<!doctype html>
<html lang="de"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${text(title)}</title><meta name="description" content="${attr(desc)}" /><meta name="author" content="Matthias Ramahi" /><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" /><meta name="theme-color" content="#020306" /><link rel="canonical" href="${canonical(file)}" /><link rel="stylesheet" href="assets/site-chrome.css" /><link rel="stylesheet" href="assets/local-seo.css" /></head><body><header class="topbar" id="topbar"><a class="brand" href="index.html">Matthias<br>Ramahi</a><nav class="topbar__nav" aria-label="Hauptnavigation"><a href="index.html" data-nav="home">Home</a><a href="portfolio.html" data-nav="portfolio">Portfolio</a><a href="leistungen.html" data-nav="leistungen">Weitere Dienstleistungen</a><a href="contact.html" data-nav="kontakt">Kontakt</a></nav><a class="topbar__cta" href="#anfrage">Anfrage</a><button class="topbar__menu" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="mobile-menu"><span aria-hidden="true"></span><span aria-hidden="true"></span></button></header><main><section class="local-hero" data-theme="dark" style="--hero-image:url('assets/optimized/assets-photos-automobil-neon-1920.webp')"><div class="local-hero__grain" aria-hidden="true"></div><div class="local-hero__inner"><div><p class="kicker">Fotografie · ${text(place)}</p><h1 class="local-title">Fotografie <em>${text(place)}.</em></h1><p class="local-lead"><strong>Neutrale Übersicht für alle sechs Fotografie-Bereiche.</strong> Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft werden als getrennte Topical Cluster geführt, damit Suchmaschinen und Nutzer schnell in die richtige Abteilung finden.</p><div class="local-actions"><a class="btn" href="#bereiche">Bereiche ansehen →</a><a class="btn ghost" href="#anfrage">Anfragen</a></div></div><aside class="local-panel"><h2>Topical Cluster</h2><p>Düsseldorf bleibt Studio- und Markenanker; NRW und Deutschland bilden regionale beziehungsweise überregionale Nachfrage ab.</p><div class="fact-grid"><span>6 Kategorien</span><span>20 Städte</span><span>NRW + Deutschland</span><span>Keyword-Cluster</span></div></aside></div></section><section class="section" id="bereiche" data-theme="light"><div class="section__inner split"><div><p class="kicker dark">Übersicht</p><h2>Sechs Bereiche, <em>ein System.</em></h2></div><div class="copy"><p>Diese Seite ist bewusst neutral: sie verteilt die Suchintention auf passende Hauptseiten statt alles in eine generische Fotografie-Seite zu pressen.</p><p>Jede Kategorie besitzt eine eigenständige Art Direction und lokale Varianten, die die gleiche Hauptseite als Vorlage verwenden.</p></div></div><div class="section__inner link-cloud">${links}</div></section><section class="section dark" data-theme="dark"><div class="section__inner split"><div><p class="kicker">Region</p><h2>Lokale Suche <em>geordnet.</em></h2></div><div class="copy"><p>Stadtseiten, NRW-Hubs und Deutschland-Seiten werden miteinander verbunden, damit die Cluster nicht als isolierte Doorway Pages funktionieren.</p></div></div><div class="section__inner link-cloud">${cityCloud}</div></section><section id="anfrage" data-contact-section data-theme="light" data-contact-subject="Fotografie ${attr(place)} Anfrage" data-contact-headline="Fotografie ${attr(place)} <em>anfragen.</em>"></section></main><script src="assets/site-chrome.js" defer></script></body></html>\n`;
  fs.writeFileSync(file, body, 'utf8');
  return file;
}

const written = [];
for (const [categoryKey, c] of Object.entries(categories)) {
  for (const [place, slug] of cities) {
    const file = clonePage(categoryKey, c, place, slug);
    if (file) written.push(file);
  }
  for (const [place, slug] of [['NRW','nrw'], ['Deutschland','deutschland']]) {
    written.push(clonePage(categoryKey, c, place, slug));
  }
  for (const [file, keyword] of keywordPages[categoryKey]) {
    written.push(cloneKeywordPage(categoryKey, c, file, keyword));
  }
}
for (const [scope, place] of [['duesseldorf','Düsseldorf'], ['nrw','NRW'], ['deutschland','Deutschland']]) {
  written.push(neutralHub(scope, place));
}

const allClusterFiles = [];
for (const c of Object.values(categories)) {
  allClusterFiles.push(c.template);
  for (const [, slug] of cities) if (slug !== 'duesseldorf') allClusterFiles.push(`${c.slug}-${slug}.html`);
  allClusterFiles.push(`${c.slug}-nrw.html`, `${c.slug}-deutschland.html`);
}
for (const pages of Object.values(keywordPages)) for (const [file] of pages) allClusterFiles.push(file);
allClusterFiles.push('fotografie-duesseldorf.html', 'fotografie-nrw.html', 'fotografie-deutschland.html');

const tracker = [];
tracker.push('# Local SEO Cluster Tracker — Matthias Ramahi Fotografie', '', 'Stand: 2026-05-25', '', '## Wichtiges Architektur-Update', '', '- Lokale Kategorie-Seiten sind keine generischen `local-seo.css`-Landingpages mehr.', '- Jede lokale Seite wird aus der jeweiligen Haupt-Landingpage geklont: gleiche CSS-, DOM-, Motion- und Section-Struktur wie die Hauptseite.', '- Nur SEO-kritische Inhalte werden lokalisiert: Title, Description, Canonical, Open Graph, JSON-LD, Hero-H1, Hero-Lead, Anfrage-Subject/Headline/Lead.', '- Düsseldorf bleibt die kanonische Hauptseite je Kategorie; Stadt-, NRW- und Deutschlandseiten sind regionale Varianten derselben Art Direction.', '- Keyword-/Synonym-Seiten verwenden ebenfalls die übergeordnete Kategorie als visuelle Vorlage.', '- Die neutralen Übersichtsseiten `fotografie-duesseldorf.html`, `fotografie-nrw.html` und `fotografie-deutschland.html` sind echte Fotografie-Landingpages mit globalem Standard-Header, Portfolio-artigem Hero und sechs eigenständigen Themen-Sektionen.', '', '## Kategorien');
for (const [key, c] of Object.entries(categories)) {
  tracker.push('', `### ${c.label}`, '', `- Hauptseite / Template: [${c.template}](${c.template})`, `- NRW: [${c.slug}-nrw.html](${c.slug}-nrw.html)`, `- Deutschland: [${c.slug}-deutschland.html](${c.slug}-deutschland.html)`, '- Stadtseiten:');
  for (const [place, slug] of cities) tracker.push(`  - [${place}](${slug === 'duesseldorf' ? c.template : `${c.slug}-${slug}.html`})`);
  tracker.push('- Suchvarianten:');
  for (const [file, keyword] of keywordPages[key]) tracker.push(`  - [${keyword}](${file})`);
}
tracker.push('', '## Generierungslogik', '', '- Script: `tools/regenerate-local-pages-from-category-templates.mjs`', `- Geschriebene Dateien in diesem Lauf: ${written.length}`, `- Dateien im Cluster: ${allClusterFiles.length}`, '', '## Qualitätsregel', '', '- Wenn eine Hauptseite visuell verbessert wird, danach dieses Script erneut ausführen, damit alle lokalen Varianten dieselbe Art Direction behalten.', '- Lokale Seiten dürfen nicht zurück auf generische Karten-/Local-SEO-Templates fallen.');
fs.writeFileSync('local-seo-cluster-tracker.md', tracker.join('\n') + '\n', 'utf8');

const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
for (const file of [...new Set(allClusterFiles)].sort()) sitemap.push(`  <url><loc>${canonical(file)}</loc><changefreq>monthly</changefreq><priority>${file.includes('-duesseldorf') ? '0.72' : file.startsWith('fotografie-') ? '0.8' : '0.64'}</priority></url>`);
sitemap.push('</urlset>');
fs.writeFileSync('sitemap-local-seo.xml', sitemap.join('\n') + '\n', 'utf8');

// The category-local generator still builds sitemap/tracker. The neutral overview
// pages are rendered last so they never fall back to the old generic local-SEO layout.
await import('./render-fotografie-overviews.mjs');

console.log(JSON.stringify({written: written.length, clusterFiles: new Set(allClusterFiles).size, tracker: 'local-seo-cluster-tracker.md', sitemap: 'sitemap-local-seo.xml', overviews: ['fotografie-duesseldorf.html', 'fotografie-nrw.html', 'fotografie-deutschland.html']}, null, 2));
