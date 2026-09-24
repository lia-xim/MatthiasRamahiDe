# Portfolio-Medienlogik

Die bestehenden sechs Portfolio-Kategorien bleiben die oeffentlichen Einstiege. Ein Shooting mit nur drei oder vier sehr starken Bildern benoetigt keine kuenstlich verlaengerte Projektseite. Stattdessen werden zusammengehoerige Bilder in der Medien-Registry ueber dieselbe `seriesId` als kurze Serie verbunden.

## Verbindliche Felder

- `image`: kanonischer, oeffentlicher Bildpfad
- `assignedCategory`: fachliche Hauptkategorie
- `seriesId`: stabile ID fuer ein Shooting oder eine zusammengehoerige Serie
- `subject`: Fahrzeug, Person, Ort oder Motiv
- `orientation`: Hochformat, Querformat oder Quadrat
- `rightsStatus` und `rightsNotes`: dokumentierter Freigabestatus
- `allowedSurfaces`: freigegebene Einsatzbereiche
- `allowCrossCategory`: bewusste Freigabe fuer mehrere Kategorien

`usageCategories`, `sourceProjects` und `usageSummary` werden aus den Portfolio-Dateien abgeleitet. Sie duerfen nicht als redaktionelle Quelle gepflegt werden.

## Arbeitsablauf

1. Bilder in der passenden Portfolio-Auswahl eintragen.
2. `corepack pnpm media:registry:sync` ausfuehren.
3. Neue Registry-Eintraege in Tina unter **Medien-Registry** ergaenzen: Serie, Motiv, Rechte und erlaubte Bereiche.
4. `corepack pnpm media:audit` prueft Dateipfade, Dubletten, Kategorien und einen synchronen Registry-Stand.
5. `corepack pnpm media:audit:metadata` ist der strengere Freigabecheck. Er bleibt rot, solange Serien, Rechte, Motive oder kategorienuebergreifende Nutzungen ungeprueft sind.

Der normale Web-Build fuehrt den strukturellen Audit automatisch aus. Eine neue oder geaenderte Portfolio-Zuordnung kann daher nicht unbemerkt an der Registry vorbeigehen.

## Kuratierungsregel

- Drei bis vier Spitzenbilder eines Shootings duerfen eine vollwertige Serie bilden.
- Eine Portfolio-Kategorie kann mehrere solcher Serien enthalten.
- Bilder werden nicht nur zum Auffuellen einer Seite aufgenommen.
- Kategorienuebergreifende Wiederverwendung ist eine dokumentierte Ausnahme, kein Standard.
- Rechtestatus und Freigabe muessen aus echten Unterlagen oder eigener Urheberschaft stammen; sie werden nicht automatisch behauptet.
