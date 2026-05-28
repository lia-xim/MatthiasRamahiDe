# 01 — Tokens & Typography

This is the canonical token system. SKILL.md already shows the minimum set; this reference documents everything, including the *coexistence problem* (red vs chrome) that you must understand before changing tokens.

## Color token system

### Canonical (Astro + most legacy)

```css
:root {
  /* Backgrounds */
  --bg:      oklch(14% 0.012 255);   /* #020306  dark canvas */
  --surface: oklch(18% 0.014 255);   /* #07090d  slightly lifted surface */
  --panel:   #0c0f15;                /* dark panel/card on dark */
  --paper:   oklch(96% 0.012 100);   /* #f3f5ef  off-white editorial section */

  /* Text */
  --fg:        oklch(96% 0.012 110);            /* #f3f5ef  on dark */
  --paper-ink: oklch(16% 0.012 255);            /* near-black on paper */
  --muted:     oklch(80% 0.012 110 / 0.66);     /* secondary text on dark */
  --quiet:     rgba(243,245,239,.42);           /* tertiary text on dark */
  --paper-muted: color-mix(in oklch, var(--paper-ink) 64%, transparent);

  /* Lines */
  --border: oklch(92% 0.010 110 / 0.14);  /* faint light line on dark */
  --rule:   rgba(13,12,10,.14);           /* faint dark line on paper */

  /* Accent — the only chromatic color in canonical use */
  --accent:   oklch(57% 0.185 31);  /* #cf392e  oxidized red */
  --accent-2: #6d8da1;              /* steel blue, atmosphere only */

  /* Semantic */
  --success: oklch(63% 0.13 150);
  --warning: oklch(72% 0.14 78);  /* used for preview banner only */
  --danger:  oklch(57% 0.185 31);  /* same as accent */
}
```

### Hex equivalents observed across the codebase

These are what you'll grep for. The site never picks one canonical hex per role — different files spell the same intent slightly differently. Don't "normalize" these without the user's say-so; some variation is intentional (warmer red on motorrad, cooler red on accents).

| Role | Observed hex |
| --- | --- |
| Dark base | `#020306` · `#07090d` · `#090b10` · `#101217` |
| Light paper | `#f5f7f1` · `#f3f5ef` · `#f2f4ef` · `#eff1ec` · `#f1ede4` (warmer cream variant in portfolio-page.css) |
| Off-white text | `#f3f5ef` · `#f5f7f1` |
| Near-black ink | `#0a0c11` · `#090b10` · `#0d0c0a` |
| **Oxidized red accent** | `#cf392e` · `#c93a31` · `#c63b31` · `#c83a31` · `#cf3d31` · `#a9342b` |
| Steel/atmosphere | `#6d8da1` · `#7f95a0` · `#647f91` · `#718a99` |
| Warm chrome (newer overview pages) | `#c8ccc6` · `#dce2df` · `#d4c9bd` |
| Cool steel (newer overview pages) | `#7a8a86` |
| Warm cream (portfolio-page.css) | `#f1ede4` · `#eae4d6` |
| Ochre/warm-red accent (portfolio-page.css) | `oklch(54% 0.13 36)` |

### Two-tier accent system (corrected against rendered screenshots)

The codebase has *token-name* inconsistency, but the **rendered site** is consistent. Here's what's actually visible:

**Tier 1 — The visible accent: steel-grey / sage** (`#c8ccc6` · `#7a8a86` · `#dce2df`, oklch ~78% 0.02 130-230)

This is the dominant accent across the rendered site. Used on:
- H2 em-words (`<em>` inside `<h2>`) — "VERÄNDERN." in the manifesto, "EINE LINSE." in the chapters headline, "KAMERA." in the about section. **Every** headline em-word on the landing page uses this color, not red.
- Secondary navigation underlines and inactive markers.
- Atmospheric overlays in heroes (faint chrome glows in the aperture beam, lens cursor).
- Hover color for the second-line em-text of section headers.

Where it lives: `assets/fotografie-overview.css` declares `--accent:#c8ccc6` (this file calls it the primary accent), and most landing/topic-hub pages reference `var(--accent-2)` with the same intent.

**Tier 2 — The minor-punctuation accent: oxidized red** (`#cf392e` · `#c63b31`, `oklch(57% 0.185 31)`)

Used very sparingly. Quiet at scan distance. Roles:
- Leading 1px×24px bar `::before` on mono kickers.
- `::selection` background.
- Link underline-on-hover and hover-edge-color on ghost buttons.
- Focus rings on inputs.
- Active-state markers in subtle micro-UI.
- Filmstrip-wipe glowing edge on motorrad heroes (rare, topic-specific).

It is **not** used for: filled CTAs, headline em-words, hero backgrounds, gradient washes, or anywhere it would dominate scanning.

Where it lives: `apps/web/src/styles/tokens.css` declares `--accent` as red, and `assets/local-seo.css` + `assets/photo-main-service.css` use red as their topic-specific accent. The token name is the same as the steel variant in fotografie-overview.css — that's the inconsistency. Pay attention to which file you're in.

**Tier 3 — Warm ochre** (`oklch(54% 0.13 36)`)

Used on light/paper portfolio surfaces only (`assets/portfolio-page.css`, `matthias-ramahi-portfolio.html`). Don't bring it into dark sections or default flows.

### CTAs do not use accent fill — ever

Looking at the rendered site:
- **Primary CTA on a light/paper section** = ink-filled (dark `--paper-ink` background, paper-cream text). Examples: `MEHR ÜBER MICH`, `BEREICHE ANSEHEN` (filled variant).
- **Primary CTA on a dark section** = off-white/`--fg`-filled (light background, dark text). Examples: `MEHR ÜBER MICH` on Hinter-der-Kamera.
- **Secondary CTA anywhere** = ghost outline (1px border matching surrounding `--fg` or `--paper-ink`, transparent fill, text in foreground color).
- **Top-right header CTA** = ghost outline with a small bracket character or arrow. Quiet, never colored.

If you've written a `background: var(--accent)` filled button, that's wrong unless it's a very specific case the user explicitly approved.

### When the user asks for a change to "the accent"

- Ask which one: the **visible steel** (the H2 em-color) or the **punctuation red** (kicker bars, selection, focus).
- If you change the visible accent project-wide, grep for `#c8ccc6`, `#7a8a86`, `#dce2df`.
- If you change the punctuation accent, grep for `#c[6-9][0-9a-f]{4}`, `#a9342b`, `oklch(57% 0.185 31)` across `*.html` and `assets/*.css`. Many references are hardcoded, not via `var(--accent)`.

### Accent usage rules

- **Steel/sage is for headline em-words.** Inside `<h2>` and `<h1>`, wrap one word per heading in `<em>` and color it steel. This is the dominant visible accent. One em per heading, never two.
- **Red is for micro-punctuation only.** Kicker bars (`::before` 24px×1px), `::selection` bg, link hover underline, focus rings, small active-state marks. Quiet, discrete, never dominant.
- **CTAs never use red fill.** Primary CTA is ink-fill (paper-ink on paper, fg on dark). Secondary CTA is ghost outline. The accent token defined as red exists for the punctuation roles above, not for buttons.
- **Reds vary slightly by topic** in `photo-main-service.css` (e.g., automotive uses `#c63b31`, slightly warmer-cooler than the canonical `#cf392e`). This is intentional and you can keep it when extending those pages.

## Typography system

### Type stacks

```css
--font-display: 'Neue Haas Grotesk Display','Söhne','Avenir Next','Helvetica Neue',Arial,system-ui,sans-serif;
--font-body:    same as display (no separate body face in canonical system);
--font-mono:    'JetBrains Mono','IBM Plex Mono','SFMono-Regular',ui-monospace,Menlo,monospace;
```

**Exception — portfolio-page.css and some portrait pages** use Inter Tight or Iowan Old Style serif on display, paired with an italic serif `<em>` inside H2s. This is deliberate (a more editorial flavor for portrait/portfolio surfaces).

### Type scale — every size you'll need

All sizes use `clamp(min, fluid, max)` so the system stays fluid between 360px and ~2560px viewports.

| Role | clamp() | line-height | letter-spacing | weight | case |
| --- | --- | --- | --- | --- | --- |
| Hero display (landing) | `clamp(56px, 10.6vw, 168px)` | `.86` | `-.058em` | 900 (or 500 on portfolio pages) | UPPERCASE |
| Hero display (topic hub) | `clamp(56px, 9.2vw, 148px)` | `.9` | `-.038em` | 500 | UPPERCASE |
| Section H2 — chapters | `clamp(50px, 8.4vw, 148px)` | `.88` | `-.06em` | 700 | UPPERCASE |
| Section H2 — standard | `clamp(44px, 6.4vw, 108px)` | `.92` | `-.045em` | 600 | UPPERCASE |
| Sub-display / card H3 | `clamp(28px, 3.4vw, 52px)` | `.94` | `-.02em` | 600 | Title case |
| Lead paragraph | `clamp(16px, 1.3vw, 21px)` | `1.5` | `-.005em` | 480 | sentence |
| Body | `clamp(14px, 1.05vw, 16.5px)` | `1.6` | 0 | 400 | sentence |
| Mono kicker | `font: 700 10px/1 var(--font-mono)` | `1` | `.26em` | 700 | UPPERCASE |
| Mono label / metadata | `font: 9–11px var(--font-mono)` | `1.3–1.7` | `.2–.28em` | 700 | UPPERCASE |

### Editorial italic serif accent

A signature move: inside an H2, a single word wrapped in `<em>` switches to a serif italic, in the secondary accent color (`--accent-2` or muted ink). Use it sparingly — once per heading, never multiple ems.

```html
<h2>Verwandte <em>Bereiche.</em></h2>
```

```css
h2 em {
  font-family: 'Iowan Old Style','Charter',Georgia,serif;
  font-weight: 400;
  font-style: italic;
  letter-spacing: -.045em;
  text-transform: none;
  color: var(--accent-2);
}
```

### Mono is the editorial spice

Monospace is used everywhere there's metadata: kickers, section numbers (01, 02…), file-style labels ("Location · Location · Detail"), breadcrumbs, footer column headers, eyebrow tags, contact-form field labels, FAQ "Q:"/"A:" markers. It signals *editorial / curatorial / archive*, not "code." Never use mono for body copy or display.

The wide `letter-spacing: .26em` is non-negotiable for kickers — it's what makes them feel like photo credits or archive tags.

## Spacing system

There is no formal spacing scale. Everything uses `clamp()` for fluid spacing, anchored on common values:

```css
/* Section padding (vertical) */
padding: clamp(58px, 8vw, 120px) 0;     /* standard */
padding: clamp(76px, 10vw, 150px) 0;    /* hero / contact CTA */
padding: clamp(34px, 5vw, 72px) 0;      /* compact / between-sections */

/* Gutters between columns */
gap: clamp(28px, 6vw, 88px);            /* two-column features */
gap: clamp(36px, 8vw, 120px);           /* hero grid gap */
gap: clamp(18px, 4vw, 64px);            /* stack-list rows */

/* Inline page padding */
width: min(100% - clamp(32px, 8vw, 128px), 1640px);  /* the canonical container */
```

Container max width is `1640px` (Astro) or `1540px` (legacy `--maxw`). The 1640 number is the newer canonical; if you're in legacy HTML, `--maxw: 1540px;` is fine.

## Easing and motion

The one easing curve used across the entire site:

```css
--ease: cubic-bezier(0.23, 1, 0.32, 1);
```

This is a quick-then-settle ease. **Don't introduce other curves** unless you have a deliberate reason. The site's coherence depends on motion having a single voice.

Duration ranges:

- **UI micro:** `.22–.35s` (buttons, focus rings)
- **Reveal:** `.6–.9s` (scroll-into-view fades)
- **Hover image:** `.9–1.4s` (slow grow / desaturate shifts)
- **Hero / cinematic:** `11s` (aperture beam), `18s` (atmospheric glow), `28–32s` (Ken-Burns)

## Radii and shadows

The site is **almost flat**. Radii used: `0` (the default), `2px` (form inputs only). No card-style 12px rounded corners. Shadows are reserved for:
- **Photo frames** (within stage/chapter sections): `box-shadow: 0 54px 80px -28px rgba(0,0,0,.55);`
- **Vignettes inside images** (via gradient overlay, not CSS shadow).
- **No drop shadows on UI** (buttons, cards, headers).

## Token mapping cheatsheet

When porting a legacy hex into the Astro token system or vice versa:

| Legacy hex | Token | Notes |
| --- | --- | --- |
| `#020306` | `var(--bg)` | dark canvas |
| `#07090d` | `var(--surface)` | lifted dark |
| `#0c0f15` | `var(--panel)` | dark panel (rare) |
| `#f3f5ef` | `var(--fg)` (on dark) or `var(--paper)` (as bg) | the off-white |
| `#cf392e` / `#c63b31` | `var(--accent)` | red, use the token |
| `rgba(243,245,239,.62)` | `var(--muted)` | secondary text on dark |
| `rgba(13,12,10,.14)` | `var(--rule)` / `var(--border)` | line on paper |
| `cubic-bezier(.23,1,.32,1)` | `var(--ease)` | always |

## What to do when tokens disagree

If `apps/web/src/styles/tokens.css` and `brand-spec.md` give different values for the same role: trust **tokens.css** — it's the live source. Update `brand-spec.md` to match.

If `assets/site-chrome.css` and a topic-specific CSS (`photo-main-service.css`) disagree: trust the topic CSS *within that topic's pages*, and trust `site-chrome.css` for the shared header/footer. Topic-specific overrides via inline `<style>` in HTML files are also intentional and can stay.
