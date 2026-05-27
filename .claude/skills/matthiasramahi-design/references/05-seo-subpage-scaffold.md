# 05 — SEO Subpage Scaffold (Topic × City)

This site lives or dies on its local-SEO cluster: ~22 cities × 6 photography topics = ~130 templated pages. They share 95% of their structure and only differ in city-specific paragraphs. This reference is the canonical template for creating, updating, or auditing one.

**Critical rule:** SEO subpages are *not* creative writing. They are mechanical. If you "improve" one page's prose without applying it to all siblings, you've broken the cluster's coherence and made future bulk updates exponentially harder. Be templated.

## Cities array (memorize this order)

The cities grid on every SEO subpage uses this exact list, in this exact order:

```
Düsseldorf · Köln · Essen · Dortmund · Duisburg · Bochum · Wuppertal · Leverkusen ·
Oberhausen · Krefeld · Mönchengladbach · Moers · Gelsenkirchen · Bergisch Gladbach ·
Solingen · Remscheid · Mettmann · Hilden · Dormagen · Neuss · NRW · Deutschland
```

20 cities + NRW (regional macro) + Deutschland (national macro) = 22 entries. Filename slugs:

| Display | Slug |
| --- | --- |
| Düsseldorf | `duesseldorf` |
| Köln | `koeln` |
| Essen | `essen` |
| Dortmund | `dortmund` |
| Duisburg | `duisburg` |
| Bochum | `bochum` |
| Wuppertal | `wuppertal` |
| Leverkusen | `leverkusen` |
| Oberhausen | `oberhausen` |
| Krefeld | `krefeld` |
| Mönchengladbach | `moenchengladbach` |
| Moers | `moers` |
| Gelsenkirchen | `gelsenkirchen` |
| Bergisch Gladbach | `bergisch-gladbach` |
| Solingen | `solingen` |
| Remscheid | `remscheid` |
| Mettmann | `mettmann` |
| Hilden | `hilden` |
| Dormagen | `dormagen` |
| Neuss | `neuss` |
| NRW | `nrw` |
| Deutschland | `deutschland` |

## Topics

| Topic | Display label | Filename slug |
| --- | --- | --- |
| Automobil | `Automobil Fotografie` | `automobil-fotografie` |
| Sportwagen | `Sportwagen Fotografie` | `sportwagen-fotografie` |
| Oldtimer | `Oldtimer Fotografie` | `oldtimer-fotografie` |
| Motorrad | `Motorrad Fotografie` | `motorrad-fotografie` |
| Portrait | `Portrait Fotografie` | `portraitfotografie` *(no hyphen!)* |
| Landschaft | `Landschaftsfotografie` | `landschaftsfotografie` *(no hyphen!)* |

Note the asymmetry: automotive/motorrad/oldtimer/sportwagen use `{topic}-fotografie-{city}.html`, while portrait/landschaft use `{topic}fotografie-{city}.html` (no hyphen between topic and "fotografie"). Don't normalize this — it would break thousands of inbound links and existing canonical references.

## Page filename convention

```
{{topic_slug}}-{{city_slug}}.html
```

Examples:
- `motorrad-fotografie-koeln.html`
- `automobil-fotografie-essen.html`
- `portraitfotografie-duesseldorf.html`  ← no hyphen between "portrait" and "fotografie"
- `landschaftsfotografie-nrw.html`        ← no hyphen
- `oldtimer-fotografie-deutschland.html`

## Universal anatomy

Every SEO subpage has these sections in this order:

1. **Header chrome** — same as everywhere
2. **Hero** — topic-specific style (motorrad: wipe; portrait: iris; others: Ken-Burns)
3. **Statement** — topic-fixed copy (same across all cities for a given topic)
4. **Modules / mechanics grid** — topic-fixed (3–6 cards depending on topic)
5. **Portfolio gallery** — topic-fixed image set (6–8 tiles)
6. **Audience grid** — topic-fixed ("Für wen ich arbeite", 4–5 cards)
7. **Related topics** — topic-fixed (3–4 sibling topics)
8. **Cities grid** — universal (22 cities + active state for current page)
9. **Search keywords grid** — topic-fixed (5 long-tail variants)
10. **Contact CTA** — universal layout, city-specific subject and lead
11. **Footer chrome** — same as everywhere

## What varies between two siblings (e.g., motorrad-koeln vs. motorrad-essen)

These are the ONLY pieces that differ. Everything else is byte-for-byte identical.

| Slot | Example: motorrad-koeln | Example: motorrad-essen |
| --- | --- | --- |
| `<title>` | `Motorrad Fotografie Köln — Matthias Ramahi` | `Motorrad Fotografie Essen — Matthias Ramahi` |
| Meta description | `Motorrad Fotografie Köln: Bildserien… Rhein, Innenstadt…` | `Motorrad Fotografie Essen: Bildserien… Ruhrgebiet, Zollverein…` |
| Canonical URL | `https://matthiasramahi.de/motorrad-fotografie-koeln.html` | `https://matthiasramahi.de/motorrad-fotografie-essen.html` |
| OG URL + alt text | Same as canonical | Same as canonical |
| H1 line 2 | `Köln` | `Essen` |
| Hero lede paragraph | 2 sentences referencing Rhein, Innenstadt, Rheinauhafen | 2 sentences referencing Ruhrgebiet, Zollverein, Messe |
| JSON-LD `areaServed` | `["Köln", "NRW", "Deutschland"]` | `["Essen", "NRW", "Deutschland"]` |
| JSON-LD BreadcrumbList item 2 name + item | "Motorrad Fotografie Köln — Matthias Ramahi" | "Motorrad Fotografie Essen — Matthias Ramahi" |
| Contact CTA `data-contact-subject` | `Motorrad Fotografie Köln Anfrage` | `Motorrad Fotografie Essen Anfrage` |
| Contact CTA `data-contact-lead` | "Schreibe kurz, welches Bike in Köln…" | "Schreibe kurz, welches Bike in Essen…" |
| Cities grid `.is-active` class | on the Köln cell | on the Essen cell |

**Everything else is identical** — hero images, statement copy, module cards, gallery tiles, audience cards, related-topics cards, search-keywords. This is intentional. The cluster's SEO strength comes from a coherent topic page with city-specific anchors, not from city-specific content rewrites.

## Step-by-step: create a new SEO subpage

Suppose the user asks for `sportwagen-fotografie-bottrop.html` (a city not yet in the cluster). Here's the procedure.

### 1. Pick the closest existing sibling

Find the most similar existing file. For a new city in the same topic, copy any existing topic+city file:

```
cp sportwagen-fotografie-essen.html sportwagen-fotografie-bottrop.html
```

### 2. Change the city-specific variables

Open the new file and modify only:

- `<title>`: replace "Essen" with "Bottrop"
- `<meta name="description">`: same — and tailor the city character clause
- `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:url">`: same swaps
- `<link rel="canonical">`: new URL
- JSON-LD `BreadcrumbList.itemListElement[1].name` and `.item`
- JSON-LD `Service.name`, `.serviceType`, `.description`, `.areaServed` (add Bottrop, keep NRW + Deutschland), `.url`
- `<h1>` line 2 span text: "Bottrop"
- Hero lede paragraph: keep the structural sentence but swap city-specific geography phrase (e.g., "Rhein, Innenstadt, Rheinauhafen" → "Ruhrgebiet, Innenstadt-Zentrum, Tetraeder-Berg, Halde Haniel")
- Contact CTA `data-contact-subject`: "Sportwagen Fotografie Bottrop Anfrage"
- Contact CTA `data-contact-lead`: swap city in the lead text
- Cities grid: add `class="mr-cities__cell is-active"` to the Bottrop cell, remove `is-active` from any other cell

### 3. **Add the new city to the cities grid on every sibling page**

This is the step that gets forgotten. Every sibling SEO page for this topic (and arguably every other topic too, if Bottrop is being added across the whole cluster) needs a new `<a class="mr-cities__cell" href="sportwagen-fotografie-bottrop.html">Bottrop</a>` inserted in the cities grid.

Use `tools/link-local-seo-clusters.mjs` (or a similar tool) if it covers this — otherwise it's a careful find-and-update across all topic siblings.

### 4. Update the sitemap

`sitemap-local-seo.xml` is the canonical sitemap for the SEO cluster. Add:

```xml
<url>
  <loc>https://matthiasramahi.de/sportwagen-fotografie-bottrop.html</loc>
  <lastmod>{{today}}</lastmod>
  <priority>0.6</priority>
</url>
```

### 5. Verify

Open `sportwagen-fotografie-essen.html` and `sportwagen-fotografie-bottrop.html` side by side and confirm:

- Section count matches.
- Section order matches.
- Hero images are identical.
- All copy outside the city-specific slots is byte-identical.
- Cities grid has the same cells, in the same order, with active state moved to Bottrop.
- JSON-LD is well-formed (no trailing commas, no unescaped quotes).
- New page added to cities grid on all siblings.

### 6. (Astro mirror)

If the Astro mirror is being kept in sync, also create a `LocalSeoPages` collection entry in Payload CMS with the same fields. Set `priority: "high"` if this is being prioritized, otherwise `"later"`. Set `canonicalServicePage` to the parent service-page (`sportwagen-fotografie`). The Astro page won't auto-route until a corresponding template exists (currently legacy serves these via the catch-all bridge — see `06-astro-cms-bridge.md`).

## Page-level scaffold (legacy HTML)

This is the structural skeleton — fill in topic-fixed content from the closest sibling.

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{{topic_label_de}} {{city_name}} — Matthias Ramahi</title>
  <meta name="description" content="{{topic_label_de}} {{city_name}}: {{service_pitch_with_city_character}}">
  <meta property="og:title"       content="{{topic_label_de}} {{city_name}} — Matthias Ramahi">
  <meta property="og:description" content="{{meta_description}}">
  <meta property="og:url"         content="https://matthiasramahi.de/{{topic_slug}}-{{city_slug}}.html">
  <meta property="og:image"       content="https://matthiasramahi.de/{{hero_image_url}}">
  <meta property="og:image:alt"   content="{{topic_label_de}} {{city_name}} — Matthias Ramahi">
  <link rel="canonical" href="https://matthiasramahi.de/{{topic_slug}}-{{city_slug}}.html">

  <link rel="preload" as="image" href="assets/optimized/{{hero_image_1}}" fetchpriority="high">
  <link rel="preload" as="image" href="assets/optimized/{{hero_image_2}}">
  <link rel="preload" as="image" href="assets/optimized/{{hero_image_3}}">

  <link rel="stylesheet" href="assets/site-chrome.css">
  <link rel="stylesheet" href="assets/local-seo.css">
  <link rel="stylesheet" href="assets/photo-main-service.css">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": "https://matthiasramahi.de/#website",
        "url": "https://matthiasramahi.de/", "name": "Matthias Ramahi Fotografie" },
      { "@type": "Person", "@id": "https://matthiasramahi.de/#person",
        "name": "Matthias Ramahi", "url": "https://matthiasramahi.de/",
        "email": "info@matthiasramahi.de" },
      { "@type": "BreadcrumbList",
        "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "Startseite",
           "item": "https://matthiasramahi.de/"},
          {"@type": "ListItem", "position": 2,
           "name": "{{topic_label_de}} {{city_name}} — Matthias Ramahi",
           "item": "https://matthiasramahi.de/{{topic_slug}}-{{city_slug}}.html"}
        ]
      },
      { "@type": "WebPage",
        "@id": "https://matthiasramahi.de/{{topic_slug}}-{{city_slug}}.html#webpage",
        "url": "https://matthiasramahi.de/{{topic_slug}}-{{city_slug}}.html",
        "description": "{{meta_description}}" },
      { "@type": "Service",
        "@id": "https://matthiasramahi.de/{{topic_slug}}-{{city_slug}}.html#service",
        "serviceType": "{{topic_label_de}} {{city_name}}",
        "name": "{{topic_label_de}} {{city_name}}",
        "description": "{{service_pitch_full}}",
        "areaServed": ["{{city_name}}", "NRW", "Deutschland"],
        "provider": { "@id": "https://matthiasramahi.de/#person" } }
    ]
  }
  </script>
</head>
<body class="{{topic_body_class}}">  <!-- e.g. service-mr, service-pt, service-auto -->

  <!-- 1. Header (auto-injected by site-chrome.js) -->
  <div id="mr-topbar-mount"></div>

  <!-- 2. Hero -->
  <section class="hero-{{topic_class}}" data-theme="dark" data-header-theme="dark"
           aria-label="{{topic_label_de}} {{city_name}}">
    <!-- topic-specific hero structure — see 03-hero-formulas.md -->
    <h1 class="hero-{{topic_class}}__title">
      <span class="line"><span class="word">{{topic_label_de}}</span></span>
      <span class="line"><span class="word">{{city_name}}</span></span>
    </h1>
    <p class="hero-{{topic_class}}__lede">{{city_intro_lede}}</p>
    <div class="hero-{{topic_class}}__actions">
      <a href="#anfrage" class="btn btn-accent">{{cta_primary}} →</a>
      <a href="portfolio.html" class="btn btn-ghost">Portfolio</a>
    </div>
  </section>

  <!-- 3. Statement (topic-fixed) -->
  <section class="statement" data-theme="light" data-header-theme="light">
    <div class="statement__inner container">
      <h2 class="statement__title">{{statement_headline}}</h2>
      <div class="statement__body">
        <p class="lead">{{statement_p1}}</p>
        <p>{{statement_p2}}</p>
        <a href="#anfrage" class="btn btn-ink">{{cta_primary}} →</a>
      </div>
    </div>
  </section>

  <!-- 4. Modules grid (topic-fixed cards) -->
  <section class="mk" data-theme="dark" data-header-theme="dark">…</section>

  <!-- 5. Portfolio gallery (topic-fixed tiles) -->
  <section class="gallery-{{topic_class}}" data-theme="dark" data-header-theme="dark">…</section>

  <!-- 6. Audience (topic-fixed) -->
  <section class="audience" data-theme="light" data-header-theme="light">…</section>

  <!-- 7. Related topics (topic-fixed) -->
  <section class="related" data-theme="dark" data-header-theme="dark">…</section>

  <!-- 8. Cities grid (universal, 22 cells, active = current city) -->
  <section class="mr-cities" data-theme="light" data-header-theme="light"
           aria-label="{{topic_label_de}} vor Ort">…</section>

  <!-- 9. Search keywords grid (topic-fixed, 5 cells) -->
  <section class="mr-cities" data-theme="light" data-header-theme="light"
           aria-label="{{topic_label_de}} Suchbegriffe">…</section>

  <!-- 10. Contact CTA (universal layout, city-specific subject + lead) -->
  <section id="anfrage" class="contact-cta"
           data-contact-section data-theme="light" data-header-theme="light"
           data-contact-subject="{{topic_label_de}} {{city_name}} Anfrage"
           data-contact-headline="{{topic_label_de}} <em>{{city_name}} anfragen.</em>"
           data-contact-lead="{{contact_lead_text}}">
  </section>

  <!-- 11. Footer (auto-injected) -->
  <div id="mr-footer-mount"></div>

  <script src="assets/site-chrome.js"></script>
  <script src="assets/photo-main-service.js"></script>
</body>
</html>
```

## City character snippets (cheatsheet)

When writing the city-specific hero lede, the geographic clause should reference real local character. Quick lookup:

| City | Geography/character clause |
| --- | --- |
| Düsseldorf | Rhein, Königsallee, Hafen, Medienhafen, Altstadt |
| Köln | Rhein, Innenstadt, Rheinauhafen, Messeumfeld, urbane Hinterhöfe |
| Essen | Ruhrgebiet, Messe, Zeche Zollverein, sachliche Industriearchitektur |
| Dortmund | Ruhrgebiet, Phoenix-See, Westfalenpark, Hafen |
| Duisburg | Hafen, Landschaftspark, Innenhafen, Industriekulisse |
| Bochum | Bermuda3eck, Jahrhunderthalle, Ruhrstadion-Umfeld |
| Wuppertal | Schwebebahn, Wupper-Tal, Talsenken-Architektur |
| Leverkusen | Rhein, Bayer-Werk, BayArena, Schlebusch |
| Oberhausen | Gasometer, CentrO, Industrielandschaft |
| Krefeld | Rhein, Seide-Architektur, Hülser Berg |
| Mönchengladbach | Schloss Rheydt, Hardter Wald, Hockeypark |
| Moers | Niederrhein, Schlosspark, alte Stadt |
| Gelsenkirchen | Schalke-Arena, Nordstern-Park, Zoom |
| Bergisch Gladbach | Bergisches Land, Forsbach, Bensberg |
| Solingen | Schloss Burg, Müngstener Brücke, Wupperhänge |
| Remscheid | Bergisches Land, Müngstener Brücke, Talsperren |
| Mettmann | Bergisches Land, Neandertal, ruhige Lage zwischen Düsseldorf und Wuppertal |
| Hilden | Itter, Stadtwald, Düsseldorf-nahe Lage |
| Dormagen | Rhein, Chempark, ländliche Außenbereiche |
| Neuss | Rhein, Hafen, Quirinus-Kirche, Düsseldorf-nahe Lage |
| NRW | Rheinland, Ruhrgebiet, Niederrhein, Bergisches Land — bundeslandweit |
| Deutschland | bundesweit — vom Rheinland bis München, Hamburg, Berlin |

Keep the clause to ~6–10 words. Don't list all features; pick 2–3 that fit the topic (e.g., for motorrad in Köln: "Rhein, Innenstadt, Rheinauhafen und urbane Hinterhöfe"; for landschaft in Essen: "Ruhrgebiet, Zollverein und sachliche Industriearchitektur").

## Topic-fixed copy reference

These don't change per city. Pull the exact wording from any existing sibling — don't paraphrase.

| Topic | Statement headline | Modules headline | Audience headline |
| --- | --- | --- | --- |
| Motorrad | "Geschwindigkeit und Leidenschaft auf Bildern." | "Vom Detail bis zur Kurve." | "Für wen ich arbeite." |
| Automobil | "Fahrzeuge als Bildsystem." | "Vier Bildpakete pro Fahrzeug." | "Für wen geeignet." |
| Sportwagen | "Speed ohne Klischee." | "Vier Module pro Sportwagen-Serie." | "Für wen geeignet." |
| Oldtimer | "Der Oldtimer als Exponat." | "Vier Module pro Sammlerfahrzeug." | "Für wen geeignet." |
| Portrait | "Nähe ohne Beliebigkeit." | "Verschiedene Perspektiven." | "Für wen ich arbeite." |
| Landschaft | "Landschaft als Bildraum." | "Vier Module pro Landschaftsserie." | "Für wen geeignet." |

## Acceptance criteria for a "done" SEO subpage

A new SEO subpage is done when:

1. File created in project root with correct kebab-case slug.
2. All city-specific slots filled (title, meta, canonical, H1 line 2, lede, contact CTA subject/lead, breadcrumb, areaServed).
3. All topic-fixed slots match the closest sibling byte-for-byte (statement, modules, gallery, audience, related, search keywords).
4. Cities grid lists 22 entries, in order, with `.is-active` on the current city.
5. Cities grid on **every other sibling** for this topic updated to include the new city link.
6. `sitemap-local-seo.xml` updated.
7. JSON-LD validates (use `https://search.google.com/test/rich-results` or Schema Markup Validator).
8. Page renders correctly at 390px, 820px, and 1440px.
9. Sticky header tints correctly when scrolling through dark/light sections.
10. Contact form pre-fills with the right subject when clicking the CTA.
