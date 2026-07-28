# GSC Page-Query Export

`example-page-query.csv` enthaelt ausschliesslich synthetische Daten fuer den Parser-Test.
Es ist keine Messquelle und darf nicht fuer SEO-Entscheidungen verwendet werden.

Der echte Export benoetigt eine Zeile je Kombination aus Landingpage und Suchanfrage:

```csv
page,query,clicks,impressions,ctr,position
https://matthiasramahi.de/beispiel.html,beispiel suchanfrage,1,20,5%,8.4
```

Akzeptierte deutsche Header sind `Seite`, `Suchanfrage`, `Klicks`, `Impressionen`,
`CTR` und `Position`. Komma, Semikolon und Tab werden als Trennzeichen erkannt.

Aufruf:

```powershell
corepack pnpm seo:analyze:gsc-overlap -- --input C:\Pfad\zum\page-query.csv
```
