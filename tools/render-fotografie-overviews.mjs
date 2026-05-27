import fs from 'node:fs';

const categories = [
  ['automobil','01','Automobil','Automobil Fotografie','automobil-fotografie','assets/optimized/assets-photos-automobil-neon-1920.webp','Automobil im kontrollierten Neonlicht',
    p=>`Für Fahrzeuge, Marken, Händler und private Verkäufe in ${p}: Exterieur, Interieur, Details und Lichtführung werden so geplant, dass aus einem Auto eine verwertbare Bildserie wird — für Website, Inserat, Social, Print und Kampagne.`,
    'Keine generischen Fahrzeugbilder: kontrollierte Reflexe, ruhige Linien und ein Bildsatz, der technisch sauber weiterverwendet werden kann.'],
  ['sportwagen','02','Sportwagen','Sportwagen Fotografie','sportwagen-fotografie','assets/optimized/assets-photos-automobil-sunset-1920.webp','Sportwagen im warmen Streiflicht',
    p=>`Sportwagen in ${p} brauchen Präzision statt Effektfeuerwerk: niedrige Blickachsen, saubere Spiegelungen, Innenraumdetails und eine Dramaturgie, die Leistung sichtbar macht, ohne ins Plakative zu kippen.`,
    'Für Sammler, Händler, Performance-Projekte und hochwertige Verkaufsserien mit Bildwirkung über den ersten Blick hinaus.'],
  ['oldtimer','03','Oldtimer','Oldtimer Fotografie','oldtimer-fotografie','assets/optimized/assets-photos-oldtimer-stage-1920.webp','Oldtimer als ruhige Studio-Inszenierung',
    p=>`Oldtimer Fotografie in ${p} erzählt Wert, Herkunft und Material. Lack, Chrom, Leder und Patina werden nicht nostalgisch überhöht, sondern mit Charakter und Nostalgie präzise dokumentiert.`,
    'Ideal für Sammlung, Auktion, Verkauf, Ausstellung und Fahrzeuge, deren Geschichte sichtbar bleiben soll.'],
  ['motorrad','04','Motorrad','Motorrad Fotografie','motorrad-fotografie','assets/optimized/assets-photos-motorrad-1920.webp','Motorrad mit dunkler Studio-Atmosphäre',
    p=>`Motorräder in ${p} funktionieren über Haltung, Mechanik und Silhouette. Die Serie kann Maschine, Details, Fahrer und Werkstattbezug verbinden — stärker als ein einzelnes Verkaufsfoto.`,
    'Für Custom Bikes, Händler, private Maschinen, Werkstätten und dokumentarische Serien mit Druck.'],
  ['portrait','05','Portrait','Portrait Fotografie','portraitfotografie','assets/photos/portrait-blue.webp','Editoriales Portrait mit blauem Licht',
    p=>`Portraits in ${p} sollen professionell wirken, ohne Menschen glattzubügeln. Licht, Distanz und Blickführung werden auf Nutzung und Persönlichkeit abgestimmt — für Branding, Presse, Team und Editorial.`,
    'Kein Passbild-Look, kein austauschbares LinkedIn-Template — sondern klare Bilder mit Haltung und Wiedererkennung.'],
  ['landschaft','06','Landschaft','Landschaftsfotografie','landschaftsfotografie','assets/optimized/assets-photos-landschaft-1920.webp','Atmosphärische Landschaftsfotografie',
    p=>`Landschaftsfotografie ist für ${p} weniger lokales Shooting als kuratierter Bildkauf: Fine-Art-Prints, Wandbilder, Editionen und große Formate werden nach Raum, Material und Wirkung ausgewählt.`,
    'Deutschlandweit sinnvoll für private Räume, Praxen, Hotels, Büros und Sammlungen, die Ruhe statt Dekoration suchen.']
].map(([id,no,label,title,slug,image,alt,copy,note]) => ({id,no,label,title,slug,image,alt,copy,note,
  mainHref: `${slug}-duesseldorf.html`
}));

const pages = [
  ['fotografie-duesseldorf.html','Düsseldorf',
    'Fotografie Düsseldorf | Übersicht | Matthias Ramahi',
    'Fotografie Düsseldorf als klare Übersicht: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft — sechs spezialisierte Bereiche mit eigenem Einstieg.',
    'Sechs Fotografie-Bereiche, eine Adresse in Düsseldorf — von Automobil, Sportwagen, Oldtimer und Motorrad bis Portrait und Fine-Art-Landschaft. Jede Kategorie mit eigener Bildsprache und eigenem Einstieg.',
    'Düsseldorf ist der Studio- und Planungsanker. Von hier aus werden Fahrzeugserien, Portraits und Prints so geführt, dass Nutzer und Suchmaschinen sofort verstehen, welcher Bereich wohin gehört.',
    'Fotografie Düsseldorf Anfrage',
    'mpik8b82-_DSC3879.webp'],
  ['fotografie-nrw.html','NRW',
    'Fotografie NRW | Übersicht | Matthias Ramahi',
    'Fotografie NRW als klare Übersicht: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft — sechs spezialisierte Bereiche für Rheinland und Ruhrgebiet.',
    'Sechs Fotografie-Bereiche für ganz NRW — Rheinland, Ruhrgebiet, Niederrhein und Bergisches Land. Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Fine-Art-Landschaft auf einer Adresse.',
    'NRW bündelt Rheinland, Ruhrgebiet, Niederrhein und Bergisches Land. Die Seite führt nicht in eine generische Galerie, sondern in die passende Kategorie mit regionalem Bezug.',
    'Fotografie NRW Anfrage',
    'assets/optimized/assets-photos-automobil-sunset-1920.webp'],
  ['fotografie-deutschland.html','Deutschland',
    'Fotografie Deutschland | Übersicht | Matthias Ramahi',
    'Fotografie Deutschland als klare Übersicht: Automobil, Sportwagen, Oldtimer, Motorrad, Portrait und Landschaft — sechs spezialisierte Bereiche mit eigenem Einstieg.',
    'Sechs Fotografie-Bereiche, deutschlandweit denkbar — Fahrzeugserien, Portraits und Landschafts-Prints über eine zentrale Adresse zugänglich.',
    'Deutschlandweit zählt nicht eine einzelne Stadt, sondern die richtige Einordnung der Suchintention: Produktion, Nutzung, Bildstil, Lieferung und Kategorie müssen sofort klar sein.',
    'Fotografie Deutschland Anfrage',
    'assets/optimized/assets-photos-landschaft-1920.webp']
].map(([file,place,title,desc,heroLead,context,contactSubject,heroImage]) => ({file,place,title,desc,heroLead,context,contactSubject,heroImage}));

const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const attr=s=>esc(s).replace(/"/g,'&quot;');
const mail=subject=>`mailto:info@matthiasramahi.de?subject=${encodeURIComponent(subject)}`;

function header(subject){const m=mail(subject);return `<header class="topbar" id="topbar" data-current="fotografie">
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
    <a href="leistungen.html" data-nav="leistungen">Weitere Dienstleistungen</a>
    <a href="contact.html" data-nav="kontakt">Kontakt</a>
  </nav>
  <a class="topbar__cta" href="contact.html#anfrage">Projekt anfragen</a>
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
    <a class="mobile-menu__cta" href="contact.html#anfrage">Projekt anfragen</a>
  </div>
</div>`;}

function footer(place){return `<footer class="mr-footer" data-header-theme="dark" aria-label="Website Footer">
  <div class="mr-footer__hairline" aria-hidden="true"></div>
  <div class="mr-footer__inner">

    <section class="mr-footer__top" aria-label="Studio">
      <a class="mr-footer__mark" href="index.html" aria-label="Zurück zur Startseite">
        Matthias<span>Ramahi</span>
      </a>
      <div class="mr-footer__claim">
        <p>Fotografie aus Düsseldorf — kuratiert für <em>Marke, Sammlung und Druck</em>. Editorial geführt, technisch ruhig, bereit für die nächste Ausgabe.</p>
        <div class="mr-footer__meta" aria-label="Studio">
          <a href="ueber-mich.html">Studio &nbsp;→</a>
        </div>
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
          <div class="mr-footer__contact-line">
            <span>E-Mail</span>
            <a href="mailto:info@matthiasramahi.de">info@matthiasramahi.de</a>
          </div>
          <div class="mr-footer__contact-line">
            <span>Telefon</span>
            <a href="tel:+4917642449858">+49 176 42 44 98 58</a>
          </div>
          <div class="mr-footer__contact-line">
            <span>Studio</span>
            <strong>${esc(place)} · NRW</strong>
          </div>
        </div>
      </div>

    </nav>

    <div class="mr-footer__base">
      <span class="mr-footer__base-left">© 2026 Matthias Ramahi</span>
      <span class="mr-footer__base-center">
        <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">Instagram ↗</a>
      </span>
      <span class="mr-footer__base-right">
        <a href="impressum.html">Impressum</a>
        <a href="datenschutz.html">Datenschutz</a>
      </span>
    </div>

  </div>
</footer>`;}

// Inline cinematic hero CSS — port of the index.html .hero (no WebGL, no custom cursor).
// Uses a single full-bleed photo, gradient overlays, aperture sweep, glow, and animated title.
const heroCSS = `
<style>
  .ovh{position:relative;height:100svh;min-height:600px;max-height:100svh;display:grid;align-items:end;padding:clamp(120px,14vw,180px) clamp(22px,5vw,76px) clamp(64px,8vw,112px);overflow:hidden;isolation:isolate;background:#05070b;color:#f3f5ef}
  .ovh__photo{position:absolute;inset:0;z-index:0;background-size:cover;background-position:center;transform:scale(1.06);will-change:transform;animation:ovhKB 28s ease-out forwards}
  @keyframes ovhKB{0%{transform:scale(1.12) translate3d(-1.4%,1.2%,0)}100%{transform:scale(1.03) translate3d(.8%,-.4%,0)}}
  .ovh::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(2,3,6,.42) 0%,rgba(2,3,6,0) 22%,rgba(2,3,6,0) 52%,rgba(2,3,6,.62) 84%,rgba(2,3,6,.86) 100%)}
  .ovh::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(95% 60% at 50% 100%,rgba(2,3,6,.48) 0%,rgba(2,3,6,0) 60%)}
  .ovh__aperture{position:absolute;z-index:2;left:-15vw;right:-15vw;top:42%;height:96px;pointer-events:none;opacity:.28;transform:rotate(-4deg) translateX(-18vw);background:linear-gradient(90deg,transparent 0%,rgba(243,245,239,.08) 36%,rgba(220,226,223,.44) 49%,rgba(220,226,223,.16) 55%,rgba(42,78,118,.16) 62%,transparent 82%);filter:blur(.2px);-webkit-mask-image:linear-gradient(180deg,transparent,black 44%,black 56%,transparent);mask-image:linear-gradient(180deg,transparent,black 44%,black 56%,transparent);animation:ovhAperture 11s cubic-bezier(.23,1,.32,1) infinite}
  @keyframes ovhAperture{0%,10%{transform:rotate(-4deg) translateX(-30vw);opacity:0}28%{opacity:.42}58%{transform:rotate(-4deg) translateX(22vw);opacity:.24}100%{transform:rotate(-4deg) translateX(30vw);opacity:0}}
  .ovh__glow{position:absolute;inset:-30% -18%;z-index:2;pointer-events:none;background:radial-gradient(circle at 22% 28%,rgba(220,226,223,.07),transparent 30%),radial-gradient(circle at 84% 70%,rgba(42,78,118,.16),transparent 36%);filter:blur(38px);opacity:.55;animation:ovhGlow 18s cubic-bezier(.23,1,.32,1) infinite alternate}
  @keyframes ovhGlow{0%{transform:translate3d(-1.6%,1.2%,0) scale(1)}100%{transform:translate3d(2.2%,-1.2%,0) scale(1.04)}}
  .ovh__grid{position:relative;z-index:3;width:100%;max-width:1540px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(20px,2.4vw,34px)}
  .ovh__kicker{font:11px 'JetBrains Mono','IBM Plex Mono','SFMono-Regular',ui-monospace,Menlo,monospace;letter-spacing:.34em;text-transform:uppercase;color:rgba(243,245,239,.62);margin:0;display:flex;align-items:center;gap:14px}
  .ovh__kicker::before{content:"";width:38px;height:1px;background:currentColor;opacity:.55}
  .ovh__title{position:relative;margin:0;font-family:'Neue Haas Grotesk Display','Söhne','Avenir Next','Helvetica Neue',Arial,system-ui,sans-serif;font-size:clamp(56px,10.6vw,168px);line-height:.86;letter-spacing:-.058em;text-transform:uppercase;font-weight:900;color:#f6f7f2;-webkit-mask-image:linear-gradient(180deg,#000 0%,#000 76%,rgba(0,0,0,.55) 100%);mask-image:linear-gradient(180deg,#000 0%,#000 76%,rgba(0,0,0,.55) 100%);text-shadow:0 24px 80px rgba(0,0,0,.55),0 2px 18px rgba(0,0,0,.55)}
  .ovh__title .line{display:block;overflow:hidden;padding:.04em 0 .06em}
  .ovh__title .word{display:inline-block;transform:translate3d(-110%,0,0);opacity:0;will-change:transform,opacity;transition:transform 1.05s cubic-bezier(.18,.78,.24,1),opacity .82s cubic-bezier(.23,1,.32,1)}
  .ovh__title.is-in .word{transform:translate3d(0,0,0);opacity:1}
  .ovh__title .line:nth-child(2) .word{transition-delay:.10s;color:rgba(243,245,239,.86)}
  .ovh__lead{max-width:62ch;margin:0;font-size:clamp(16px,1.3vw,21px);line-height:1.55;color:rgba(243,245,239,.78);text-wrap:pretty;opacity:0;transform:translateY(14px);transition:opacity .9s cubic-bezier(.23,1,.32,1) .35s,transform .9s cubic-bezier(.23,1,.32,1) .35s}
  .ovh.is-in .ovh__lead{opacity:1;transform:translateY(0)}
  .ovh__actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:6px;opacity:0;transform:translateY(14px);transition:opacity .9s cubic-bezier(.23,1,.32,1) .55s,transform .9s cubic-bezier(.23,1,.32,1) .55s}
  .ovh.is-in .ovh__actions{opacity:1;transform:translateY(0)}
  .ovh__btn{display:inline-flex;align-items:center;gap:10px;padding:14px 22px;border:1px solid rgba(243,245,239,.42);font:11px 'JetBrains Mono','IBM Plex Mono',ui-monospace,Menlo,monospace;letter-spacing:.24em;text-transform:uppercase;color:#f3f5ef;background:transparent;transition:background .25s cubic-bezier(.23,1,.32,1),border-color .25s cubic-bezier(.23,1,.32,1),color .25s cubic-bezier(.23,1,.32,1)}
  .ovh__btn:hover{background:rgba(243,245,239,.96);color:#0a0c11;border-color:rgba(243,245,239,.96)}
  .ovh__btn--ghost{border-color:rgba(243,245,239,.22);color:rgba(243,245,239,.78)}
  .ovh__btn--ghost:hover{background:transparent;color:#fff;border-color:rgba(243,245,239,.62)}
  @media(max-width:780px){
    .ovh{padding:120px 20px 64px;min-height:560px}
    .ovh__title{font-size:clamp(46px,13vw,82px);letter-spacing:-.05em}
  }
  @media(prefers-reduced-motion:reduce){
    .ovh__photo{animation:none;transform:scale(1.03)}
    .ovh__aperture,.ovh__glow{animation:none;opacity:.18}
    .ovh__title .word{transition:none;transform:none;opacity:1}
    .ovh__lead,.ovh__actions{transition:none;opacity:1;transform:none}
  }
</style>`;

const heroJS = `
<script>
(function(){
  var h=document.querySelector('.ovh');if(!h)return;
  var t=h.querySelector('.ovh__title');
  function start(){h.classList.add('is-in');if(t)t.classList.add('is-in')}
  if(matchMedia('(prefers-reduced-motion:reduce)').matches){start();return}
  requestAnimationFrame(function(){requestAnimationFrame(start)});
})();
</script>`;

function hero(p){return `<section class="ovh" data-theme="dark" aria-label="Fotografie Übersicht ${esc(p.place)}">
  <div class="ovh__photo" style="background-image:url('${p.heroImage}')" aria-hidden="true"></div>
  <div class="ovh__glow" aria-hidden="true"></div>
  <div class="ovh__aperture" aria-hidden="true"></div>
  <div class="ovh__grid">
    <h1 class="ovh__title"><span class="line"><span class="word">Fotografie ${esc(p.place)}.</span></span><span class="line"><span class="word">Sechs Bereiche.</span></span></h1>
    <p class="ovh__lead">${esc(p.heroLead)}</p>
    <div class="ovh__actions">
      <a class="ovh__btn" href="#automobil">Bereiche ansehen →</a>
      <a class="ovh__btn ovh__btn--ghost" href="#anfrage">Fotografie anfragen</a>
    </div>
  </div>
</section>`;}

function topic(c,p,i){const mode=i%2===0?'dark':'light';return `<section class="topic ${mode} topic--${c.id}" id="${c.id}" data-theme="${mode}" data-no="${c.no} / ${c.label.toUpperCase()}">
  <div class="topic-grid"><div class="topic-copy"><p class="kicker ${mode==='light'?'dark':''}">${c.no} · ${esc(c.label)}</p><h2><span>${esc(c.label)}.</span><em>Fotografie.</em></h2><p>${esc(c.copy(p.place))}</p><p class="topic-note">${esc(c.note)}</p><a class="topic-link" href="${c.mainHref}">Zur ${esc(c.title)} →</a></div>
  <div class="topic-media" aria-hidden="true"><figure class="topic-frame"><img src="${c.image}" alt="${attr(c.alt)}" loading="lazy"></figure></div></div>
</section>`;}

function render(p){
  const schema={'@context':'https://schema.org','@type':'CollectionPage','@id':`https://matthiasramahi.de/${p.file}#collection`,name:p.title,description:p.desc,url:`https://matthiasramahi.de/${p.file}`,inLanguage:'de-DE',about:categories.map(c=>c.title),mainEntity:{'@type':'ItemList',itemListElement:categories.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.title,url:`https://matthiasramahi.de/${c.mainHref}`}))},publisher:{'@type':'Person',name:'Matthias Ramahi',url:'https://matthiasramahi.de/'}};
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>${esc(p.title)}</title><meta name="description" content="${attr(p.desc)}" /><meta name="author" content="Matthias Ramahi" /><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" /><meta name="theme-color" content="#020306" /><meta name="format-detection" content="telephone=no" /><link rel="canonical" href="https://matthiasramahi.de/${p.file}" /><meta property="og:type" content="website" /><meta property="og:site_name" content="Matthias Ramahi" /><meta property="og:locale" content="de_DE" /><meta property="og:title" content="${attr(p.title)}" /><meta property="og:description" content="${attr(p.desc)}" /><meta property="og:url" content="https://matthiasramahi.de/${p.file}" /><meta property="og:image" content="https://matthiasramahi.de/${p.heroImage}" /><meta property="og:image:alt" content="Fotografie Übersicht — Matthias Ramahi" /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${attr(p.title)}" /><meta name="twitter:description" content="${attr(p.desc)}" /><meta name="twitter:image" content="https://matthiasramahi.de/${p.heroImage}" /><link rel="preload" as="image" href="${p.heroImage}" fetchpriority="high" /><script type="application/ld+json">${JSON.stringify(schema)}</script><link rel="stylesheet" href="assets/site-chrome.css" /><link rel="stylesheet" href="assets/fotografie-overview.css" />${heroCSS}</head><body>
${header(p.contactSubject)}
<main>${hero(p)}
${categories.map((c,i)=>topic(c,p,i)).join('\n')}
<section class="cluster" data-theme="light" aria-label="Topical Cluster"><div class="section-inner cluster-grid"><div><p class="kicker dark">SEO-Struktur</p><h2>Ein Einstieg, <em>sechs Cluster.</em></h2></div><div class="cluster-copy"><p>${esc(p.context)}</p><p>Die Übersicht dient als zentrale Landingpage: Nutzer wählen nicht aus einem generischen Portfolio, sondern steigen direkt in Automobil, Sportwagen, Oldtimer, Motorrad, Portrait oder Landschaft ein. Jede Kategorie führt weiter in lokale Varianten, NRW-/Deutschland-Hubs und die jeweiligen Keyword-Seiten.</p><div class="cluster-links">${categories.map(c=>`<a href="${c.mainHref}">${esc(c.title)}</a>`).join('')}</div></div></div></section>
<section id="anfrage" data-contact-section data-theme="light" data-contact-subject="${attr(p.contactSubject)}" data-contact-headline="Fotografie ${esc(p.place)} <em>anfragen.</em>" data-contact-lead="Beschreibe kurz, welcher Bereich passt — Automobil, Sportwagen, Oldtimer, Motorrad, Portrait oder Landschaft — und wofür die Bilder genutzt werden sollen. Dann klären wir Stil, Umfang, Ort, Rechte und Ausgabeformat sauber vor der Produktion."></section></main>
${footer(p.place)}
${heroJS}<script src="assets/site-chrome.js" defer></script></body></html>`;
}

for(const p of pages){fs.writeFileSync(p.file, render(p)); console.log('wrote '+p.file);}
