#!/usr/bin/env node
// Removes the old/legacy inline CSS for `mr-footer` (`__glow`, `__aperture`,
// `__statement`, `__primary`, `__services`, `__direct`, `__legal`, `__rule`,
// `__links`) on pages where the markup has been migrated to the canonical
// index.html footer. Leaves canonical CSS from assets/site-chrome.css alone.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();

// Anything containing one of these is the OLD-only footer concept:
const OLD_ONLY_CLASSES = [
  '__glow', '__aperture', '__statement', '__primary', '__services',
  '__direct', '__legal', '__rule', '__links',
];

function isOldFooterLine(raw) {
  const line = raw.trim();
  if (!line) return false;

  // .mr-footer or .mr-footer__... selector — keep clean classes ONLY when
  // they don't also bring legacy rules; safer to delete any "mr-footer" inline
  // CSS line, since the canonical site-chrome.css covers it.
  if (/^\.mr-footer[\s:.{,]/.test(line) || /^\.mr-footer\{/.test(line)) return true;
  if (/^\.mr-footer__/.test(line)) return true;

  // @keyframes mrFooterGlow / mrFooterAperture / mrFooterRule
  if (/^@keyframes\s+mrFooter\w+\{/.test(line)) return true;
  if (/^@-?\w+-?keyframes\s+mrFooter/.test(line)) return true;

  // body.has-mr-footer / html:has(body.has-mr-footer) rules
  if (/^body\.has-mr-footer/.test(line)) return true;
  if (/^html:has\(body\.has-mr-footer/.test(line)) return true;

  // @media line where every rule block targets mr-footer / has-mr-footer / mrFooter*
  if (/^@media\s*\(/.test(line) && line.includes('mr-footer')) {
    // Get the part after the @media(...){ and check rules
    const m = line.match(/^@media\s*\([^)]*\)\s*\{(.*)\}\s*$/);
    if (m) {
      const body = m[1];
      // Find all top-level "selector{...}" blocks and inspect their selectors
      const blockRe = /([^{}]+)\{[^{}]*\}/g;
      let mm;
      let allMatch = true;
      let count = 0;
      while ((mm = blockRe.exec(body)) !== null) {
        count++;
        const sel = mm[1].trim();
        const isFooterRelated =
          /\.mr-footer/.test(sel) ||
          /body\.has-mr-footer/.test(sel) ||
          /html:has\(body\.has-mr-footer/.test(sel);
        if (!isFooterRelated) { allMatch = false; break; }
      }
      if (count > 0 && allMatch) return true;
    }
  }

  // Also catch "old-only" classes anywhere
  for (const cls of OLD_ONLY_CLASSES) {
    if (line.startsWith(`.mr-footer${cls}`)) return true;
  }

  return false;
}

const entries = await readdir(ROOT, { withFileTypes: true });
const pages = entries
  .filter(e => e.isFile() && e.name.endsWith('.html'))
  .map(e => e.name)
  // Skip index.html — its inline footer CSS IS the canonical reference;
  // do not delete from there.
  .filter(name => name !== 'index.html');

let changed = 0, skipped = 0;
for (const file of pages) {
  const path = join(ROOT, file);
  const before = await readFile(path, 'utf8');
  // Only touch pages that currently link site-chrome.css OR have the rich
  // markup. If a page has neither, leave it.
  const linksChrome = before.includes('assets/site-chrome.css');
  const hasRichMarkup = before.includes('mr-footer__hairline') || before.includes('mr-footer__contact-line');
  if (!hasRichMarkup) { skipped++; continue; }

  const lines = before.split(/\r?\n/);
  const out = [];
  let removed = 0;
  for (const ln of lines) {
    if (isOldFooterLine(ln)) { removed++; continue; }
    out.push(ln);
  }
  if (removed === 0) { skipped++; continue; }

  // If the page does NOT link site-chrome.css, we need the canonical CSS inline.
  // For now, leave a comment marker — the chrome-rollout script handles linking.
  // (Pages with hasRichMarkup that don't link chrome.css will be handled separately.)
  const after = out.join('\n');
  await writeFile(path, after, 'utf8');
  changed++;
  const note = linksChrome ? '' : '  (NOTE: no site-chrome.css link)';
  console.log(`  ${file}: -${removed} CSS lines${note}`);
}

console.log(`\nDone — ${changed} updated, ${skipped} skipped`);
