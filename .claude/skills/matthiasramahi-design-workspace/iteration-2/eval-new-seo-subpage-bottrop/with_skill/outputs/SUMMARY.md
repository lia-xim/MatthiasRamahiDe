# motorrad-fotografie-bottrop.html — Build Summary

Cloned `motorrad-fotografie-koeln.html` byte-for-byte and changed only the city-specific slots per the SEO subpage scaffold (references/05). Topic-fixed content (statement, modules, gallery, audience, related, search keywords, footer, hero CSS, JS controllers) is untouched.

Bottrop-specific edits:
- `<title>`, meta description, OG/Twitter titles + URL + alt, canonical URL — all swapped to Bottrop.
- Inline Service JSON-LD (top) and the technical @graph JSON-LD (BreadcrumbList, WebPage, Service `areaServed: ["Bottrop","NRW","Deutschland"]`, all `#service`/`#webpage`/`#breadcrumb` IDs) — Bottrop URLs.
- Hero `aria-label`, H1 line 2 (`Bottrop`), and hero lede — geography clause "Ruhrgebiet, Tetraeder, Halde Haniel und industrielle Hinterhöfe" (Bottrop character, ~6-10 words per scaffold rule).
- Contact CTA `data-contact-subject`, `data-contact-headline`, `data-contact-lead` — Bottrop.
- Cities grid: inserted a new `Bottrop` cell with `is-active` between Bochum and Wuppertal (logical Ruhr cluster placement). All 22 canonical cells preserved.

Not touched (per task instructions): sibling pages' cities grids, `sitemap-local-seo.xml`. The cluster cross-link asymmetry is intentional and acknowledged.
