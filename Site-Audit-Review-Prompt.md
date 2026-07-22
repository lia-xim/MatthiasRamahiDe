# Agent-Prompt: Site-Audit-Report gegen die echte Website prüfen

> Kopiere alles ab „--- PROMPT ---" in den Agenten. Ersetze `VN` durch die zu prüfende Version.

---

## --- PROMPT ---

Du prüfst einen Report des Contextter Site-Audit-Tools gegen die reale Website und verbesserst daraufhin **den Crawler** — nicht die Website. Die Website ist dein Testobjekt mit bekannter Ground Truth.

### Ausgangslage

| | Pfad |
|---|---|
| Reports & Analysen | `C:\Users\matth\Documents\MatthiasRamahiDe\Site-Audit-V*.md`, `Site-Audit-Analyse-V*.md` |
| Zu prüfen | `Site-Audit-VN.md` (neueste Version) |
| Website (Astro + TinaCMS) | `C:\Users\matth\Documents\MatthiasRamahiDe\apps\web\src\` |
| Live-Site | `https://matthiasramahi.de` |
| **Crawler-Code** | `C:\Users\matth\Documents\SEOTool\contextter-5.0\` |

Crawler-Ebenen (wichtig zum Lokalisieren von Fehlern):

```
packages/ai/src/site-audit/http-fetcher/     HTML-Parsing, Link-/Resource-Discovery, DOM-Regionen
packages/jobs/src/functions/site-audit/      Regeln (platform-audit/findings/core-*.ts)
packages/db/convex/siteAuditV2/              Materialisierung, Projektionen, Health-Rule-Registry
apps/app/features/site-audit/lib/            Report-Generator (site-audit-agent-prompt.ts)
```

**Lies zuerst die vorhandenen `Site-Audit-Analyse-V*.md`.** Dort steht, was bereits verifiziert, behoben oder als offen markiert ist. Wiederhole keine erledigte Arbeit — aber übernimm auch kein Urteil ungeprüft, wenn du es billig gegenprüfen kannst.

---

### Phase 1 — Zuerst: Misst dieser Report überhaupt den aktuellen Code?

**Diese Prüfung kommt vor jeder inhaltlichen Bewertung.** In einer früheren Runde wurde eine komplette Analyse verschwendet, weil der Report von veraltetem Crawler-Code stammte.

1. Kopf des Reports lesen: `Run ID`, `Crawler build`, `Loaded findings included`.
2. **Run-ID mit dem Vorgänger vergleichen.** Gleiche ID = Re-Export desselben Crawls, keine neuen Daten. Dann sind nur Report-Ebenen-Änderungen bewertbar.
3. **Build-Kennung vergleichen.** Gleicher Build + anderes Ergebnis = Laufzeit-Effekt, kein Code-Effekt.
4. **Gegenprobe im Report:** `grep -c 'placement: head'` gegen `grep -c 'placement: body'`. Überwiegt `body` massiv, läuft alter Code (`<head>`-Ressourcen wurden früher als `body` gemeldet).

Wenn der Report nicht den aktuellen Code misst: **das ist dein Hauptbefund.** Schreibe ihn auf und bewerte die Regeln nicht so, als wären sie kaputt.

---

### Phase 2 — Strukturvergleich zum Vorgänger

Parse beide Reports und stelle je Code gegenüber: Vorkommen, Unique, Severity.

```
Für jeden Code:  V(N-1) → V(N), plus Status: unverändert | geändert | ENTFALLEN | NEU
```

Achte besonders auf **entfallene Codes**. Ein verschwundener Befund ist gefährlicher als ein Fehlalarm: Ein Fehlalarm wird beim Prüfen entdeckt, ein fehlender Befund nie.

Bei jedem entfallenen Code: **Ist das Problem auf der Website wirklich behoben, oder meldet der Crawler es nicht mehr?** Live nachmessen. Wenn die Website unverändert ist, ist es ein False Negative.

Prüfe außerdem das **Lane-Muster**: Wenn alle überlebenden Codes zur selben Lane gehören (`fetch`, `resource_fetch`, `resource_discovery`, `link_projection`, `metadata_projection`, `external_link_check`, `sitemap_discovery`), ist es ein Lane-Ausfall, kein Regelproblem.

---

### Phase 3 — Findings gegen die Live-Site verifizieren

Für jeden Issue-Code: Evidence lesen, betroffene URLs holen, **selbst nachmessen**.

```bash
curl -s --max-time 25 "https://matthiasramahi.de/<seite>.html" -o /tmp/p.html
```

Dann mit einem eigenen Skript auszählen (Python/Node) — nicht schätzen.

**Verdikt je Code:** `echt` · `Fehlalarm` · `echt, aber schlecht aggregiert` · `grenzwertig` · `nicht tief geprüft`.
Sei explizit, wenn du etwas **nicht** geprüft hast. Erfinde keine Gewissheit.

---

### Phase 4 — Gegenprobe mit dem aktuellen Crawler-Code

Der stärkste Beweis: dieselbe Seite durch den aktuellen Code schicken und mit dem Report vergleichen.

Fixtures aus echten Seiten bauen (nicht synthetisch — mehrere Defekte traten nur bei real geformtem Markup auf):

```
contextter-5.0/packages/jobs/src/functions/site-audit/platform-audit/findings/__tests__/fixtures/
```

Testmuster (bestehende Datei als Vorlage: `ground-truth-matthiasramahi.test.ts`):

```ts
const result = await crawlSiteAuditUrlWithHttp(url, {
  siteBaseUrl: "https://matthiasramahi.de/",
  fetchImpl: vi.fn(() => Promise.resolve(new Response(html, {
    status: 200, headers: { "content-type": "text/html; charset=utf-8" } }))),
  validateUrlSecurity: () => Promise.resolve({ resolvedIps: ["1.2.3.4"] }),
  now: () => 1_777_000_000_000,
});
const codes = buildCoreFindingsForFetchResult(result).map((f) => f.findingCode);
```

**Sichere jeden Test gegen Vakuum-Grün ab:** Prüfe, dass der Crawler aus der Fixture überhaupt etwas extrahiert (Ressourcen-, Link-, Bildzahlen) und dass diese Zahlen zu deiner manuellen Auszählung passen. Ein Test, der grün ist, weil nichts geparst wurde, ist wertlos.

**Beachte die Grenzen des Harness:** Selbst konstruierte `Response`-Objekte haben keine echten HTTP-Header, und aus Dateinamen abgeleitete URLs stimmen nicht mit den echten überein. Codes wie `security_headers_missing_or_weak`, `canonical_mismatch` oder `hreflang_self_reference_missing` sind dann **Artefakte deines Aufbaus**, keine Befunde. Sage das im Report ausdrücklich.

---

### Phase 5 — Fixes

Nur beheben, was du als echt verifiziert hast.

**Am richtigen Ort ansetzen.** Ein realer Fehlgriff aus einer früheren Runde: Eine Regel las nur `structuralRegion === "body"` und ignorierte `navigationRole`. Ich habe zuerst den *Klassifizierer* (`dom-context.ts`) geändert — und damit einen bestehenden Test gebrochen, der die Orthogonalität beider Dimensionen bewusst festschreibt. Richtig war die Korrektur im **Konsumenten** (`core-link-findings.ts`).

> Wenn dein Fix einen bestehenden Test bricht: **lies den Test, bevor du ihn änderst.** Er kodiert oft eine bewusste Designentscheidung. Meist sitzt der Fehler dann woanders.

**Neue Regel? Schwellenwert gegen die ganze Website kalibrieren**, nicht gegen zwei Seiten. Lade 15–20 repräsentative Seiten und miss die Verteilung. Ziel: maximale Treffer bei null Fehlalarmen. Dokumentiere die Tabelle im Report.

**Neuer Finding-Code?** In `packages/db/convex/siteAuditV2/domain/healthRuleRegistryData{AThroughH,IThroughR,SThroughZ}.ts` registrieren (Tupel-Format, alphabetisch). Es gibt eine Invariante „jede emittierte Regel ist genau einmal klassifiziert" — sie schlägt sonst fehl. Neue Regeln **nicht** in `SITE_AUDIT_HEALTH_SCORE_READY_RULE_CODES` aufnehmen, sonst verschieben sich bestehende Health-Scores still.

**Validierung:**

```bash
cd C:/Users/matth/Documents/SEOTool/contextter-5.0
corepack pnpm --filter @contextter/ai   exec vitest run src/site-audit
corepack pnpm --filter @contextter/jobs exec vitest run src/functions/site-audit
corepack pnpm --filter @contextter/db   exec vitest run convex/__tests__/siteAuditV2.healthRuleRegistry.test.ts
corepack pnpm --filter @contextter/jobs exec tsc --noEmit -p tsconfig.json
```

Hinweis: Die `siteAuditV2`-Suite in `packages/db` ist **flaky** (`test began while previous transaction was still open`, lastabhängig, schwankt zwischen 1 und 72 Fehlern). Wenn Tests fehlschlagen: prüfe durch temporäres Entfernen deiner Änderung, ob sie ursächlich ist — und stelle sie danach wieder her.

---

### Verifikationsdisziplin — nicht verhandelbar

1. **Pro Vorkommen prüfen, nicht pro Datei.** Ein Resource-Finding hängt an einem (Seite, Element)-Paar. Dieselbe Bilddatei kann auf Seite A `width`/`height` haben und auf Seite B nicht — und sogar zweimal auf derselben Seite unterschiedlich vorkommen. Ein früherer Fehlschluss („Fehlalarm") entstand genau so. Die betroffene Seite steht in der **Affected-Liste am Blockende**, nicht in der Evidence.
2. **Live gegenprüfen, bevor du „Fehlalarm" schreibst.** Externe Links mit Browser-User-Agent testen — Instagram, Google Maps und LinkedIn gaten Bots systematisch:
   ```bash
   curl -s -o /dev/null -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0" -w "%{http_code}" "<url>"
   ```
3. **Web-Standards kennen.** `alt=""` ist die *vorgeschriebene* Kennzeichnung dekorativer Bilder, kein Fehler. `preconnect`/`dns-prefetch` werden nie abgerufen. `srcset` wird an Kandidatengrenzen tokenisiert, nicht an jedem Komma (`data:`-URIs enthalten Kommas). Der Accessible Name kommt aus `aria-label` → `aria-labelledby` → Text → `alt` → `title`.
4. **Zähl-Invariante prüfen:** `Vorkommen ≥ unique ≥ Anzahl distinkter gelisteter URLs`. In acht Runden wurde diese Kennzahl viermal unterschiedlich falsch berechnet. Zähle die Evidence-Zeilen selbst nach und vergleiche mit der Kopfzahl.
5. **Ehrlich berichten.** Vorbestehende Testfehler als solche kennzeichnen (per Datei-Filter belegen, dass deine Dateien sauber sind). Eigene Fehleinschätzungen aus früheren Runden ausdrücklich korrigieren.

---

### Ergebnis

Schreibe `C:\Users\matth\Documents\MatthiasRamahiDe\Site-Audit-Analyse-VN.md` auf Deutsch mit dieser Struktur:

```
0. Das Wichtigste zuerst          Hauptbefund in 3–5 Sätzen, mit dem entscheidenden Beleg
1. Deployment-/Run-Status         Misst der Report den aktuellen Code?
2. Vergleich zum Vorgänger        Tabelle je Code: Vorkommen/Unique, Status
3. Verdikt je Issue-Code          echt / Fehlalarm / schlecht aggregiert / grenzwertig, mit Prüftiefe
4. Neue Befunde                   was keine Vorrunde geprüft hat, mit Live-Beleg
5. Regressionen                   verlorene True Positives — höchste Priorität
6. Was ich geändert habe          Dateien, Zeilen, Validierungsergebnis
7. Empfehlung für V(N+1)          priorisiert P0…P3, mit erwarteten Zahlen als Prüfliste
8. Fazit                          Bewertung der Problemerkennung, nicht des Prozesses
```

**Stil:** Belege statt Behauptungen. Jede Zahl, die du nennst, hast du gemessen. Tabellen für Vergleiche. Keine Marketing-Sprache. Wenn etwas gut ist, sage warum; wenn etwas schlecht ist, sage was es kostet.

**Immer eine Prüfliste für die nächste Runde angeben** — konkrete erwartete Zahlen pro Code. Damit ist beim nächsten Report in einer Minute entscheidbar, ob eine Änderung gewirkt hat.

### Grenzen

- **Nicht committen, nicht pushen.** Der Nutzer prüft den Diff selbst.
- Keine Änderungen an der Website, außer der Nutzer verlangt es ausdrücklich.
- Fremde uncommittete Änderungen im Working Tree unangetastet lassen.
- Bei mehrdeutiger Aufgabenstellung nachfragen, statt zu raten.

## --- ENDE PROMPT ---
