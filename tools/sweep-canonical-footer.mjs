#!/usr/bin/env node
// Replace the OLD mr-footer variant (with __aperture/__glow/__rule) with the canonical 4-column footer.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const CANONICAL_FOOTER = `<footer class="mr-footer" data-header-theme="dark" aria-label="Website Footer">
  <div class="mr-footer__hairline" aria-hidden="true"></div>
  <div class="mr-footer__inner">

    <section class="mr-footer__top" aria-label="Fotograf">
      <a class="mr-footer__mark" href="index.html" aria-label="Zurück zur Startseite">
        Matthias<span>Ramahi</span>
      </a>
      <div class="mr-footer__claim">
        <p>Fotografie aus Düsseldorf — kuratiert für <em>Marke, Sammlung und Druck</em>. Editorial geführt, technisch ruhig, bereit für die nächste Ausgabe.</p>
        <div class="mr-footer__meta" aria-label="Fotograf">
          <a href="ueber-mich.html">Über mich &nbsp;→</a>
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

      <div class="mr-footer__col" aria-labelledby="ftr-about">
        <span class="mr-footer__col-label" id="ftr-about">Fotograf</span>
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
            <span>Fotograf</span>
            <strong>Düsseldorf · NRW</strong>
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
</footer>`;

// Locate the <footer class="mr-footer" ...> ... </footer> block. Use a tag-balance walk
// since the old footer contains nested <footer-like> div counts but no nested <footer>.
function replaceFooter(html) {
  const startMatch = html.match(/<footer[^>]*class="mr-footer"[\s\S]*?>/);
  if (!startMatch) return null;
  const startIdx = startMatch.index;
  const afterOpen = startIdx + startMatch[0].length;
  const closeIdx = html.indexOf('</footer>', afterOpen);
  if (closeIdx < 0) return null;
  const endIdx = closeIdx + '</footer>'.length;

  // Also strip the IO observer script that follows the old footer.
  let tailStart = endIdx;
  const tail = html.slice(endIdx);
  const scriptMatch = tail.match(/^\s*<script>[\s\S]*?footer\.classList\.add\('in-view'\)[\s\S]*?<\/script>/);
  let tailEnd = endIdx;
  if (scriptMatch) tailEnd = endIdx + scriptMatch[0].length;

  return html.slice(0, startIdx) + CANONICAL_FOOTER + html.slice(tailEnd);
}

const targets = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html'))
  .filter(f => {
    const c = fs.readFileSync(path.join(ROOT, f), 'utf8');
    return c.includes('mr-footer__aperture');
  });

let changed = 0;
for (const f of targets) {
  const p = path.join(ROOT, f);
  const before = fs.readFileSync(p, 'utf8');
  const after = replaceFooter(before);
  if (!after) { console.error('SKIP (no footer block):', f); continue; }
  if (after === before) continue;
  fs.writeFileSync(p, after);
  changed++;
  console.log('FOOTER:', f);
}
console.log(`\nReplaced footer in ${changed}/${targets.length} files.`);
