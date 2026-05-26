# Brand Spec — Matthias Ramahi Fotografie

Derived from the existing project files (`assets/photo-main-service.css`, current photography/service pages, footer/header system) on 2026-05-23.

## Core visual system

```css
:root {
  --bg:      oklch(14% 0.012 255);
  --surface: oklch(18% 0.014 255);
  --fg:      oklch(96% 0.012 110);
  --muted:   oklch(80% 0.012 110 / 0.66);
  --border:  oklch(92% 0.010 110 / 0.14);
  --accent:  oklch(57% 0.185 31);

  --font-display: 'Neue Haas Grotesk Display', 'Söhne', 'Avenir Next', 'Helvetica Neue', Arial, system-ui, sans-serif;
  --font-body:    'Neue Haas Grotesk Display', 'Söhne', 'Avenir Next', 'Helvetica Neue', Arial, system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'IBM Plex Mono', 'SFMono-Regular', ui-monospace, Menlo, monospace;
}
```

## Observed real values

- Dominant dark base: `#020306`, `#07090d`, `#090b10`, `#101217`.
- Light ink/paper: `#f5f7f1`, `#f3f5ef`, `#f2f4ef`, `#eff1ec`.
- Primary accent family: oxidized red `#cf392e`, `#c93a31`, `#c63b31`, `#a9342b`.
- Secondary atmosphere: steel blue/grey `#6d8da1`, `#dce2df`, `#d4c9bd`.

## Layout posture rules

1. Build from cinematic dark canvases with off-white editorial typography and a single oxidized-red accent, not from generic white card grids.
2. Use fixed shared header/footer everywhere: compact uppercase brand mark, mono navigation, same footer link taxonomy, same legal links.
3. Heroes should be image-led and immersive, but the text block must stay readable with strong dark overlays, large compressed uppercase type, and one direct CTA.
4. Page bodies should alternate between dark atmospheric sections and light paper sections to create rhythm, proof, and SEO-readable content.
5. Avoid Masonry/Card-template portfolio clichés; use curated sequences, chapters, comparison strips, contact sheets, stage/lens/archive metaphors, and clear project pathways.
6. Motion should feel photographic: slow focus shifts, soft light sweeps, crop marks, aperture/glass/film-grain details; no playful bounce or generic gradient animation.
