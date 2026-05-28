/**
 * Removes the <section class="mr-conversion-pack">…</section> block
 * from every legacy topic HTML file. The block opens with
 * `<section class="mr-conversion-pack"` and closes at the matching
 * </section> (no nested <section> inside).
 *
 * Files: 6 topic-main pages.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const files = [
  'automobil-fotografie-duesseldorf.html',
  'sportwagen-fotografie-duesseldorf.html',
  'oldtimer-fotografie-duesseldorf.html',
  'motorrad-fotografie-duesseldorf.html',
  'portraitfotografie-duesseldorf.html',
  'landschaftsfotografie-duesseldorf.html',
];

const summary = [];

for (const file of files) {
  const full = resolve(root, file);
  let html = readFileSync(full, 'utf8');

  // Find the opening tag of the section
  const openMatch = html.match(/[ \t]*<section[^>]*class="mr-conversion-pack"[^>]*>/);
  if (!openMatch) { summary.push({ file, status: 'no-section-found' }); continue; }

  const openIdx = openMatch.index;
  // From here, scan forward to find the FIRST top-level </section> close.
  // mr-conversion-pack has no nested <section> inside, so the first close is ours.
  const closeRel = html.slice(openIdx + openMatch[0].length).search(/<\/section>/);
  if (closeRel === -1) { summary.push({ file, status: 'no-closing-section' }); continue; }
  const closeIdx = openIdx + openMatch[0].length + closeRel + '</section>'.length;

  // Also gobble trailing newline(s) so we don't leave blank lines
  let after = closeIdx;
  while (after < html.length && (html[after] === '\n' || html[after] === '\r')) after++;

  const removed = html.slice(openIdx, closeIdx);
  const headlineMatch = removed.match(/<h2[^>]*>([^<]+)<\/h2>/);
  const headline = headlineMatch ? headlineMatch[1].trim() : '(no h2)';

  const next = html.slice(0, openIdx) + html.slice(after);
  writeFileSync(full, next, 'utf8');

  summary.push({
    file,
    status: 'removed',
    headline,
    removedBytes: removed.length,
    newSize: next.length,
  });
}

console.log(JSON.stringify(summary, null, 2));
