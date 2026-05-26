#!/usr/bin/env node
// Inject <link rel="stylesheet" href="assets/site-chrome.css"> into the <head>
// of pages that have the canonical mr-footer markup but don't yet link the
// shared chrome CSS. Idempotent.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();
const CHROME_LINK = '<link rel="stylesheet" href="assets/site-chrome.css">';

const entries = await readdir(ROOT, { withFileTypes: true });
const pages = entries
  .filter(e => e.isFile() && e.name.endsWith('.html'))
  .map(e => e.name);

let changed = 0;
for (const file of pages) {
  const path = join(ROOT, file);
  const before = await readFile(path, 'utf8');
  if (before.includes('assets/site-chrome.css')) continue;
  if (!before.includes('mr-footer__hairline') && !before.includes('mr-footer__contact-line')) continue;

  // Inject right before </head>
  if (!before.includes('</head>')) {
    console.log(`  ${file}: no </head> — skipped`);
    continue;
  }
  const after = before.replace('</head>', `  ${CHROME_LINK}\n</head>`);
  await writeFile(path, after, 'utf8');
  changed++;
  console.log(`  ${file}: + chrome link`);
}

console.log(`\nDone — ${changed} pages updated`);
