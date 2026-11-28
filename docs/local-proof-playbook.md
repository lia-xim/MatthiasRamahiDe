# Local-Proof & Regional Power-Hub Playbook (`matthiasramahi.de`)

Dieses Playbook definiert die verbindliche **Lokal-Beweis-Regel** für lokale Fotografie-Landingpages sowie den redaktionellen Workflow, mit dem reale Shoot-Logs (Case Studies) auf den **3 Regional Power-Hubs** eingepflegt und neue Stadtseiten erst bei echtem Nachweis freigeschaltet werden.

---

## 1. Aktuelle Architektur: 3 Regional Power-Hubs (kein Scaled-Content-Footprint)

Statt 20+ austauschbarer Stadt-Doorways mit identischem DOM und identischen Fotos bündelt `matthiasramahi.de` die gesamte regionale Automobil-Sichtbarkeit auf **3 kanonische Regional Power-Hubs**:

| Power-Hub | Kanonische URL | Regionaler Fokus (realer Einsatzraum) |
|---|---|---|
| **Düsseldorf & Erkrath** | `/autofotografie-duesseldorf.html` | Standort-Basis Erkrath, Düsseldorf (Medienhafen, Rheinufer, Süden/Reisholz), Neuss, Ratingen, Hilden, Mettmann |
| **Köln & Rheinland** | `/automobil-fotografie-koeln.html` | Köln (Rheinauhafen, ruhige Gewerbehöfe), Leverkusen, Bergisch Gladbach, Dormagen |
| **NRW & Ruhrgebiet** | `/automobil-fotografie-nrw.html` | **Dortmund & Marl**, **Duisburg**, **Krefeld**, Essen (Zeche Zollverein), Bochum, Bergisches Land |

Alle weiteren sub-lokalen Stadt-URLs werden sauber per `308 Permanent Redirect` auf den zuständigen Regional Power-Hub konsolidiert.

---

## 2. Die Lokal-Beweis-Regel (Gate vor jeder neuen Stadtseite)

Eine eigenständige, indexierbare Stadtseite (`200 OK` + Sitemap-Aufnahme) — z. B. für **Dortmund / Marl**, **Duisburg** oder **Krefeld** — darf **erst dann** wieder aktiviert oder neu angelegt werden, wenn **alle vier Kriterien** erfüllt sind:

1. **Mindestens 4 verifizierte, stadt-spezifische Fotos**:
   - Tatsächlich in dieser Stadt fotografiert (keine recycelten Düsseldorf-Medienhafen-Bilder).
   - Rechtegeklärt, im Medien-Bestand registriert (`pnpm media:audit:metadata` = 0 Fehler) und mit motiv-/ortsspezifischem Alt-Text versehen.
2. **Mindestens 3 reale lokale Spots / Settings**:
   - Konkrete, aus eigener Praxis bekannte Orte oder Spot-Typen (inkl. Lichtfenster, Zufahrt/Bodenfreiheit oder Genehmigungshinweis — keine generischen Wikipedia-Floskeln).
3. **Mindestens 1–2 echte Shoot-Logs (`verified: true`)**:
   - Dokumentiert über `apps/web/src/data/shootLogs.ts` mit echtem Fahrzeugtyp, realer Licht-/Location-Situation, konkreter fotografischer Herausforderung & Lösung sowie den tatsächlichen Deliverables.
4. **Eigenständiger lokaler Kontext**:
   - Keine Text-Schablonen mit ausgetauschtem Stadtnamen; klare Differenzierung zu den 3 bestehenden Power-Hubs.

**Solange diese 4 Kriterien noch nicht vollständig vorliegen**, werden echte Shoot-Logs aus Dortmund, Marl, Duisburg oder Krefeld direkt auf dem zuständigen Regional Power-Hub (`/automobil-fotografie-nrw.html`) ausgespielt — dort stärken sie sofort die regionale Autorität ohne Thin-Content-Risiko.

---

## 3. Ready-to-Fill Shoot-Log Template (`apps/web/src/data/shootLogs.ts`)

Sobald Matthias die echten Projektdaten für **Düsseldorf**, **Köln**, **Dortmund / Marl**, **Duisburg** oder **Krefeld** bereitstellt, werden sie in `verifiedShootLogs` in `apps/web/src/data/shootLogs.ts` eingetragen. `NativeShootLogSection.astro` rendert **ausschließlich** Einträge mit `verified: true` und mindestens einem verifizierten Bild.

```ts
// Vorlage für apps/web/src/data/shootLogs.ts -> verifiedShootLogs
{
  id: 'duesseldorf-medienhafen-2026-01', // eindeutig: <stadt>-<kurzslug>
  city: 'Düsseldorf',                    // z. B. 'Düsseldorf' | 'Köln' | 'Dortmund / Marl' | 'Duisburg' | 'Krefeld'
  regionHub: 'duesseldorf',              // 'duesseldorf' | 'koeln' | 'nrw-ruhrgebiet'
  title: 'Kurzer, konkreter Projekttitel (ohne erfundene Kundennamen)',
  vehicleCategory: 'Automobil',          // 'Automobil' | 'Sportwagen' | 'Oldtimer' | 'Motorrad'
  locationContext: 'Konkreter Ort / Setting (z. B. Medienhafen, ruhige Industriefläche in Dortmund/Marl, Hafenareal in Duisburg)',
  lightingWindow: 'Tageszeit & Licht (z. B. Spätnachmittag bis blaue Stunde, bedeckter Himmel)',
  challengeAndApproach: 'Konkrete fotografische Aufgabe & Lösung (z. B. Reflexkontrolle auf dunklem Lack, mobiles Licht im Innenraum, Zufahrt für tiefergelegtes Fahrzeug).',
  deliverables: [
    'Exterieur-Serie (Quer- & Hochformat)',
    'Interieur & Detailaufnahmen',
    'Online-Galerie in Web- & Druckauflösung',
  ],
  images: [
    {
      src: '/assets/optimized/<registriertes-bild>.webp',
      alt: 'Beschreibender, orts- und motivspezifischer Alt-Text',
      width: 1920,
      height: 1280,
      caption: 'Kurze, sachliche Bildunterschrift',
    },
  ],
  ctaHref: '#anfrage',
  verified: true,
}
```

### Geplante Start-Slots für Matthias' reale Shoot-Logs

| Priorität | Stadt / Region | Ziel-Hub (`regionHub`) | Benötigte Inputs von Matthias |
|---|---|---|---|
| **1** | **Düsseldorf** | `'duesseldorf'` | 2–4 reale Bilder (Medienhafen / Rhein / Süden), Fahrzeugtyp, Lichtzeit, gelöste Aufgabe |
| **2** | **Köln** | `'koeln'` | 2–4 reale Bilder (Rheinauhafen / Gewerbehof), Fahrzeugtyp, Lichtzeit, gelöste Aufgabe |
| **3** | **Dortmund / Marl** | `'nrw-ruhrgebiet'` | 2–4 reale Bilder aus Dortmund/Marl, Spot-Kontext, Fahrzeugtyp, Lichtzeit |
| **4** | **Duisburg** | `'nrw-ruhrgebiet'` | 2–4 reale Bilder aus Duisburg, Spot-Kontext, Fahrzeugtyp, Lichtzeit |
| **5** | **Krefeld** | `'nrw-ruhrgebiet'` | 2–4 reale Bilder aus Krefeld, Spot-Kontext, Fahrzeugtyp, Lichtzeit |

---

## 4. Prüf-Checkliste nach jedem neuen Shoot-Log

1. Bilder in `apps/web/public/assets/` (bzw. Media Registry) ablegen und `corepack pnpm media:audit:metadata` ohne Fehler bestehen.
2. `corepack pnpm --filter @matthias-ramahi/web exec astro check` mit **0 Fehlern** bestehen.
3. `corepack pnpm web:build && corepack pnpm seo:audit:strict && corepack pnpm seo:audit:cluster-contract` ausführen.
4. Erst wenn eine Einzelstadt die 4 Kriterien der **Lokal-Beweis-Regel** vollständig erfüllt, darf ihre 308-Weiterleitung in `adoptedRoutes.ts` / `vercel.json` entfernt und die Seite als eigenständiger Hub in die Sitemap aufgenommen werden.
