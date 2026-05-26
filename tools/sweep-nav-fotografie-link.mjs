/* Sweep all root-level HTML files and convert the topbar "Fotografie" entry
   from a <button> dropdown-toggle into an <a> linking to the overview page.
   Also removes any "Übersicht" entry from the dropdown / mobile submenu
   (the toggle itself now navigates to that page). */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = fs.readdirSync(root)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(root, f));

let changed = 0;

const desktopButtonRe =
  /<button\s+type="button"\s+class="topbar__group-toggle"\s+aria-haspopup="true"\s+aria-expanded="false"\s*>Fotografie<\/button>/g;
const desktopButtonReplacement =
  '<a href="fotografie-duesseldorf.html" class="topbar__group-toggle" aria-haspopup="true">Fotografie</a>';

const mobileLabelRe =
  /<span\s+class="mobile-menu__label"\s*>Fotografie<\/span>/g;
const mobileLabelReplacement =
  '<a class="mobile-menu__label" href="fotografie-duesseldorf.html">Fotografie</a>';

// Remove the "Übersicht" entry from the desktop submenu and mobile group
// (it duplicates the new toggle link).
const submenuUbersichtRe =
  /\s*<a\s+href="fotografie-duesseldorf\.html"\s*>Übersicht<\/a>/g;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  html = html.replace(desktopButtonRe, desktopButtonReplacement);
  html = html.replace(mobileLabelRe, mobileLabelReplacement);

  // Only strip "Übersicht" if it sits inside the topbar/mobile-menu blocks
  // (not the footer column list). The footer "Übersicht" links live inside
  // mr-footer__col-list and are kept intentionally.
  const topbarStart = html.indexOf('<header class="topbar"');
  const mobileEnd = html.indexOf('</div>\n</div>', html.indexOf('mobile-menu__inner'));
  if (topbarStart !== -1 && mobileEnd !== -1 && mobileEnd > topbarStart) {
    const navBlock = html.slice(topbarStart, mobileEnd);
    const cleaned = navBlock.replace(submenuUbersichtRe, '');
    html = html.slice(0, topbarStart) + cleaned + html.slice(mobileEnd);
  }

  if (html !== before) {
    fs.writeFileSync(file, html);
    changed++;
  }
}

console.log(`updated ${changed} files`);
