# Schriftgröße und Browserprüfung – 10. September 2026

## Änderungen

Die gemeinsame Datei `assets/site-readability.css` wird von beiden öffentlichen Layouts geladen. Fließtexte, Formularfelder, Navigation, Buttons, Metadaten und Footer-Beschriftungen skalieren mit der Fensterbreite; rem-Anteile berücksichtigen die eingestellte Textgröße.

| Bereich | Neue Größe bei Standard-Textgröße |
| --- | --- |
| Desktop-Navigation, vorher 10 px | 18–32 px; rund 20,5 px bei 1920 und 28,2 px bei 3840 CSS px |
| Mobiles Hauptmenü | mindestens 18 px |
| Fließtext und Formularfelder | 18–32 px |
| Kleine Beschriftungen | 14–26 px |

Die Navigation wechselt unter 1600 CSS px ins Menü. Die bestehenden Touch-Regeln bleiben zusätzlich wirksam. Das Menü kann bis zum letzten Button gescrollt werden.

Behoben wurden intrinsische Breitenprobleme bei rechtlichen Inhalten, Journal-Karten und lokalen Seitentiteln, lange Journal-Überschriften sowie ein Umbruchproblem bei den optionalen Formularangaben. In WebKit konnten Oldtimer- und Sportwagen-Bildkarten durch die Kombination aus Prozenthöhe, Flexbox und Seitenverhältnis wiederholt wachsen. Die Bilder werden jetzt innerhalb ihrer fest proportionierten Bildflächen positioniert. Die Shader-Hero-Komponente liefert eine stabile semantische Hauptüberschrift aus dem vorhandenen Titeltext.

## Geprüfter Umfang

| Prüfung | Ergebnis |
| --- | --- |
| Abschließender Astro-Check und vollständiger Web-Build unter Node 22.23.2 | Bestanden; 124 geprüfte Dateien, 0 Fehler, 0 Warnungen, 0 Hinweise |
| 267 eindeutige öffentliche URLs aus allen Sitemaps, je 390 und 1920 CSS px, Chromium/Firefox/WebKit | 1602 Kombinationen, nach gezielten Nachtests keine offenen Befunde |
| Startseite, Leistungen, Kontakt, Datenschutz und Portfolio bei 320, 768, 1240, 1241, 1599, 1600, 2560, 3840, 5120 und 6016 CSS px | 150 Kombinationen bestanden |
| Installierte Chrome- und Edge-Versionen, dieselben fünf Seiten bei 390, 1920 und 3840 CSS px | 30 Kombinationen bestanden |
| Nachtest aller 28 Journal-URLs nach der gezielten Titelkorrektur | 168 Kombinationen bestanden |
| Biker-Portrait nach der gezielten Grid-Korrektur, 320/390/1920 CSS px | 9 Kombinationen bestanden |
| Fotografie-Dropdown mit Pfeiltasten, Escape und Fokus-Rückgabe | Chromium, Firefox und WebKit bestanden |
| Mobiles Menü bis zum letzten CTA, Bildvorschau öffnen/schließen, Pflichtfeldprüfung des Kontaktformulars | Chromium, Firefox und WebKit bestanden; keine Anfrage versendet |
| 200 % Root-Textgröße, 960 × 540 CSS px und DPR 2 | Fließtext 36 px, Hero-Text innerhalb des Fensters, Menüende erreichbar in allen drei Engines |

Versionen: Chromium 149.0.7827.55, Firefox 151.0, WebKit 26.5, Chrome 152.0.7977.83, Edge 152.0.4191.66.

Der automatisierte Test prüft HTTP-Status, Hauptüberschrift, gemeinsame Schriftdatei, Header-Überlappungen, Textüberläufe, horizontales Seiten-Overflow, JavaScript-Ausnahmen, Erreichbarkeit des Seitenendes, mobiles Menü und das Ende horizontaler Galerien. Screenreader-exklusive Elemente und absichtlich zunächst außerhalb des Fensters liegende Galerie-Karten werden getrennt behandelt.

Die vollständige Rohprüfung und die gezielten Nachtests bleiben separat erhalten. `apps/web/.site-quality/compatibility-verified.json` führt die 1602 ursprünglichen Kombinationen mit ihren jeweils erneuerten Nachtests zusammen. Weitere Nachweise liegen in `compatibility-wide-final`, `compatibility-installed-final`, `compatibility-biker` und `compatibility-journal-final` unter demselben Verzeichnis; dort liegen auch Screenshots. Diese Laufartefakte sind durch Git ignoriert.

## Wiederholen

Bei laufendem lokalen Server aus dem Repository-Root:

```powershell
corepack pnpm --filter @matthias-ramahi/web exec node scripts/browser-compatibility-audit.mjs
```

Optionale Umgebungsvariablen: `COMPAT_URL`, `COMPAT_ROUTES` (kommagetrennte Pfade), `COMPAT_WIDTHS`, `COMPAT_ENGINES` (`chromium,firefox,webkit,chrome,edge`) und `COMPAT_OUTPUT`. Die Parallelität ist auf sechs Browser begrenzt.

## Grenzen und weitere Checks

Die Browserprüfung lief lokal unter Windows. WebKit ist ein Engine-Test; echtes Safari auf macOS/iOS, ältere Browser, sämtliche Geräte-/OS-Kombinationen, alle Animationen, vollständige Bild-/Video-Ladevorgänge und der Versand/Empfang von Kontaktanfragen sind damit nicht bewiesen. Die automatisierte Matrix verwendet reduzierte Bewegung. 4K/5K/6K bezeichnen die getestete CSS-Fensterbreite; Betriebssystem-Skalierung kann diese gegenüber der physischen Monitorauflösung reduzieren.

Der zusätzliche ältere Native-Route-Guard meldet 20 Journal-URLs außerhalb des eingefrorenen Legacy-Manifests. Der Guard und das Archiv wurden in dieser Aufgabe nicht geändert; dies ist kein fehlgeschlagener HTTP-/Browser-Test. Die aktuellen Journal-URLs sind in der Sitemap-Matrix enthalten.

Die Prüfungen wurden vor dem Commit im vorhandenen lokalen Checkout durchgeführt, der weitere, nicht zu dieser Aufgabe gehörende Änderungen enthält. Für den separaten Commit wird die semantische Hero-Überschrift aus dem vorhandenen ersten Folientitel gebildet; die noch uncommitteten zusätzlichen Hero-Optionen bleiben im Checkout. Die große Browsermatrix ist daher ein Nachweis für den geprüften lokalen Stand, nicht für eine Veröffentlichung des isolierten Commits. Vorhandene Änderungen bleiben erhalten. Ein Deployment ist nicht Bestandteil dieser Prüfung.
