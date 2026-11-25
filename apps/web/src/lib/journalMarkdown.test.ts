import assert from 'node:assert/strict'
import test from 'node:test'

import { renderJournalBodyHtml, renderJournalInlineHtml } from './journalMarkdown.ts'

test('renders internal and external Markdown links, bold emphasis and inline code', () => {
  const html = renderJournalInlineHtml(
    'Mehr im [Leitfaden](/auto-fotografieren-tipps.html), auf [Relativ](automobil-fotografie.html), im [Kontakt](/kontakt) und bei [Extern](https://example.com/guide?a=1&b=2) mit **wichtiger Praxis** sowie `f/2.8` und `[literal](https://skip.me)`.',
  )

  assert.match(html, /<a href="\/auto-fotografieren-tipps\.html">Leitfaden<\/a>/)
  assert.match(html, /<a href="\/automobil-fotografie\.html">Relativ<\/a>/)
  assert.match(html, /<a href="\/contact\.html">Kontakt<\/a>/)
  assert.match(
    html,
    /<a href="https:\/\/example\.com\/guide\?a=1&amp;b=2" target="_blank" rel="noopener noreferrer">Extern<\/a>/,
  )
  assert.match(html, /<strong>wichtiger Praxis<\/strong>/)
  assert.match(html, /<code>f\/2\.8<\/code>/)
  assert.match(html, /<code>\[literal\]\(https:\/\/skip\.me\)<\/code>/)
})

test('resolves own-domain links and legacy redirects while preserving fragments', () => {
  const resolveRedirect = (fileName: string) => {
    const map: Record<string, string> = {
      'fotoshooting-preise.html': 'leistungen.html',
      'alt-ziel.html': 'blog-auto-fotoshooting-kostenfaktoren.html',
      'zur-startseite.html': '',
    }
    return fileName in map ? map[fileName] : null
  }

  const html = renderJournalInlineHtml(
    '[Preise](https://matthiasramahi.de/fotoshooting-preise.html#pakete) und [Alt](/alt-ziel.html) und [Start](/zur-startseite.html)',
    { resolveRedirectTarget: resolveRedirect },
  )

  assert.equal(
    html,
    '<a href="/leistungen.html#pakete">Preise</a> und <a href="/blog-auto-fotoshooting-kostenfaktoren.html">Alt</a> und <a href="/">Start</a>',
  )
})

test('renders unordered, ordered and 3+ key-value lists cleanly while keeping 2-line colons as paragraphs', () => {
  const body = [
    'Vorlauf:',
    '- Stativ prüfen',
    '* Polfilter **richtig** drehen',
    '',
    '1. Spot wählen',
    '2. Belichtung messen',
    '',
    'Startpreis: Ab 250 EUR inkl. MwSt.',
    'Region: Erkrath, Düsseldorf & NRW',
    'Lieferzeit: Innerhalb von [5 Werktagen](/leistungen.html)',
    '',
    'Hinweis: Kurzer Merksatz.',
    'Tipp: Zweite Zeile.',
  ].join('\n')

  const html = renderJournalBodyHtml(body)

  assert.match(
    html,
    /<p>Vorlauf:<\/p>\n<ul class="journal-list"><li>Stativ prüfen<\/li><li>Polfilter <strong>richtig<\/strong> drehen<\/li><\/ul>/,
  )
  assert.match(html, /<ol class="journal-list"><li>Spot wählen<\/li><li>Belichtung messen<\/li><\/ol>/)
  assert.match(
    html,
    /<ul class="journal-list journal-list--kv"><li><strong>Startpreis:<\/strong> Ab 250 EUR inkl\. MwSt\.<\/li><li><strong>Region:<\/strong> Erkrath, Düsseldorf &amp; NRW<\/li><li><strong>Lieferzeit:<\/strong> Innerhalb von <a href="\/leistungen\.html">5 Werktagen<\/a><\/li><\/ul>/,
  )
  assert.match(html, /<p>Hinweis: Kurzer Merksatz\. Tipp: Zweite Zeile\.<\/p>/)
})

test('escapes raw HTML and strips unsafe link schemes', () => {
  const html = renderJournalBodyHtml(
    '<script>alert(1)</script> **<b>fett</b>** `<img src=x>` [Klick](javascript:alert(1)) [Mail](mailto:hi@example.com)',
  )

  assert.doesNotMatch(html, /<script>/)
  assert.doesNotMatch(html, /<b>/)
  assert.doesNotMatch(html, /<img /)
  assert.doesNotMatch(html, /javascript:/)
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
  assert.match(html, /<strong>&lt;b&gt;fett&lt;\/b&gt;<\/strong>/)
  assert.match(html, /<code>&lt;img src=x&gt;<\/code>/)
  assert.match(html, />Klick<\/p>|Klick <a href="mailto:hi@example\.com">Mail<\/a>/)
})
