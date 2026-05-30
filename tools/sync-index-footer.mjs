#!/usr/bin/env node
// Historical helper for archived HTML pages; not part of the production Astro/Payload workflow.
// to the exact markup used on index.html (Home landing). Idempotent.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();

const CANONICAL = `<footer class="mr-footer" data-header-theme="dark" aria-label="Website Footer">
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

const FOOTER_RE = /<footer class="mr-footer"[\s\S]*?<\/footer>/;

const entries = await readdir(ROOT, { withFileTypes: true });
const pages = entries
  .filter(e => e.isFile() && e.name.endsWith('.html'))
  .map(e => e.name);

let changed = 0, skipped = 0, missing = 0;
for (const file of pages) {
  const path = join(ROOT, file);
  const before = await readFile(path, 'utf8');
  if (!FOOTER_RE.test(before)) { missing++; continue; }
  const after = before.replace(FOOTER_RE, CANONICAL);
  if (after === before) { skipped++; continue; }
  await writeFile(path, after, 'utf8');
  changed++;
}

console.log(`Sync complete — ${changed} updated, ${skipped} already canonical, ${missing} without mr-footer`);
