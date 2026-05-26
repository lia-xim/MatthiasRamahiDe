// Rollout canonical header/footer chrome across all active site pages.
// - Inject <link rel="stylesheet" href="assets/site-chrome.css"> in <head>
// - Replace any <header class="topbar" id="topbar">...</header> with canonical block
// - Insert canonical mobile-menu overlay right after the header
// - Insert <script src="assets/site-chrome.js" defer></script> before </body>
// - Concept-only studies are skipped (see CONCEPT_ONLY)

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

const CANONICAL_PAGES = [
  'automobil-fotografie-duesseldorf.html',
  'oldtimer-fotografie-duesseldorf.html',
  'motorrad-fotografie-duesseldorf.html',
  'portraitfotografie-duesseldorf.html',
  'landschaftsfotografie-duesseldorf.html',
  'portfolio.html',
  'blog.html',
  'leistungen.html',
  'weitere-dienstleistungen.html',
  'contact.html',
  'fotolabor-druck-duesseldorf.html',
  'videografie-duesseldorf.html',
  'webdesign-seo-duesseldorf.html',
  'drucke-sonderanfertigungen-duesseldorf.html',
  'impressum.html',
  'datenschutz.html',
  'fotografie-landing-experience.html',
];

const CANONICAL_HEADER = `<header class="topbar" id="topbar">
  <a class="brand" href="index.html">Matthias<br>Ramahi</a>
  <nav class="topbar__nav" aria-label="Hauptnavigation">
    <a href="index.html" data-nav="home">Home</a>
    <div class="topbar__group" data-nav="fotografie">
      <button type="button" class="topbar__group-toggle" aria-haspopup="true" aria-expanded="false">Fotografie</button>
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
  <a class="topbar__cta" href="mailto:info@matthiasramahi.de?subject=Projektanfrage">Anfrage</a>
  <button class="topbar__menu" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="mobile-menu">
    <span aria-hidden="true"></span><span aria-hidden="true"></span>
  </button>
</header>

<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <div class="mobile-menu__inner">
    <a class="mobile-menu__brand" href="index.html">Matthias Ramahi</a>
    <nav class="mobile-menu__nav" aria-label="Hauptnavigation mobil">
      <a href="index.html" data-nav="home">Home</a>
      <div class="mobile-menu__group">
        <span class="mobile-menu__label">Fotografie</span>
        <a href="automobil-fotografie-duesseldorf.html">Automobil</a>
        <a href="sportwagen-fotografie-duesseldorf.html">Sportwagen</a>
        <a href="oldtimer-fotografie-duesseldorf.html">Oldtimer</a>
        <a href="motorrad-fotografie-duesseldorf.html">Motorrad</a>
        <a href="portraitfotografie-duesseldorf.html">Portrait</a>
        <a href="landschaftsfotografie-duesseldorf.html">Landschaft</a>
      </div>
      <a href="portfolio.html" data-nav="portfolio">Portfolio</a>
      <a href="ueber-mich.html" data-nav="ueber-mich">Über mich</a>
      <a href="blog.html" data-nav="blog">Blog</a>
      <a href="leistungen.html" data-nav="leistungen">Weitere Dienstleistungen</a>
      <a href="contact.html" data-nav="kontakt">Kontakt</a>
    </nav>
    <a class="mobile-menu__cta" href="mailto:info@matthiasramahi.de?subject=Projektanfrage">Anfrage senden</a>
  </div>
</div>`;

const LINK_TAG = '<link rel="stylesheet" href="assets/site-chrome.css" />';
const SCRIPT_TAG = '<script src="assets/site-chrome.js" defer></script>';

function updateFile(file) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) return { file, skipped: 'missing' };
  let src = fs.readFileSync(abs, 'utf8');
  const before = src;
  const report = { file, changes: [] };

  // 1) Inject CSS link in <head> if not already present
  if (!src.includes('assets/site-chrome.css')) {
    if (/<\/head>/i.test(src)) {
      src = src.replace(/<\/head>/i, `  ${LINK_TAG}\n</head>`);
      report.changes.push('+link');
    }
  }

  // 2) Replace existing <header class="topbar"...>...</header> (greedy across newlines, lazy on inner)
  //    There can also be a separate top-level <div class="mobile-menu" id="mobile-menu">
  //    block left over from a previous run. Remove it so we can re-emit a fresh one.
  src = src.replace(
    /<div class="mobile-menu" id="mobile-menu"[\s\S]*?<\/div>\s*<\/div>/gi,
    ''
  );
  const headerRe = /<header[^>]*class="[^"]*\btopbar\b[^"]*"[^>]*>[\s\S]*?<\/header>/i;
  if (headerRe.test(src)) {
    src = src.replace(headerRe, CANONICAL_HEADER);
    report.changes.push('=header+overlay');
  } else {
    // Insert after <body> if no existing topbar
    if (/<body[^>]*>/i.test(src)) {
      src = src.replace(/<body[^>]*>/i, (m) => `${m}\n${CANONICAL_HEADER}\n`);
      report.changes.push('+header (no existing)');
    }
  }

  // 3) Inject site-chrome.js before </body>
  if (!src.includes('assets/site-chrome.js')) {
    if (/<\/body>/i.test(src)) {
      src = src.replace(/<\/body>/i, `${SCRIPT_TAG}\n</body>`);
      report.changes.push('+script');
    } else {
      // No </body>? append at end
      src = src.replace(/<\/html>/i, `${SCRIPT_TAG}\n</html>`);
      report.changes.push('+script(no body)');
    }
  }

  if (src !== before) {
    fs.writeFileSync(abs, src, 'utf8');
    report.written = true;
  } else {
    report.written = false;
  }
  return report;
}

const results = CANONICAL_PAGES.map(updateFile);
console.log(JSON.stringify(results, null, 2));
