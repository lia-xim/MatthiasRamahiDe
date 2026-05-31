const sitemapXsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sitemap | Matthias Ramahi</title>
        <style>
          :root {
            color-scheme: light;
            --ink: #181716;
            --muted: #6f6a63;
            --line: #ded8cf;
            --paper: #f7f3ed;
            --panel: #fffaf2;
            --accent: #b6542e;
            --accent-soft: #f1d5c4;
            --shadow: 0 18px 50px rgba(24, 23, 22, .10);
          }

          * { box-sizing: border-box; }

          body {
            margin: 0;
            background: var(--paper);
            color: var(--ink);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.5;
          }

          main {
            width: min(1120px, calc(100% - 32px));
            margin: 0 auto;
            padding: 56px 0 72px;
          }

          .hero {
            display: grid;
            gap: 18px;
            padding-bottom: 30px;
            border-bottom: 1px solid var(--line);
          }

          .kicker {
            margin: 0;
            color: var(--accent);
            font-size: 13px;
            font-weight: 800;
            letter-spacing: .08em;
            text-transform: uppercase;
          }

          h1 {
            max-width: 760px;
            margin: 0;
            font-family: Georgia, "Times New Roman", serif;
            font-size: clamp(42px, 7vw, 84px);
            line-height: .92;
            letter-spacing: 0;
          }

          .lede {
            max-width: 760px;
            margin: 0;
            color: var(--muted);
            font-size: clamp(17px, 2vw, 21px);
          }

          .stats {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }

          .stat {
            display: inline-flex;
            gap: 8px;
            align-items: baseline;
            border: 1px solid var(--line);
            border-radius: 999px;
            background: rgba(255, 250, 242, .7);
            padding: 9px 13px;
            box-shadow: 0 8px 24px rgba(24, 23, 22, .05);
          }

          .stat strong { font-size: 18px; }
          .stat span { color: var(--muted); font-size: 13px; }

          .panel {
            margin-top: 28px;
            overflow: hidden;
            border: 1px solid var(--line);
            border-radius: 8px;
            background: var(--panel);
            box-shadow: var(--shadow);
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 16px 18px;
            border-bottom: 1px solid var(--line);
            text-align: left;
            vertical-align: top;
          }

          th {
            background: #fff3e7;
            color: #4b4640;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: .08em;
            text-transform: uppercase;
          }

          tr:last-child td { border-bottom: 0; }

          a {
            color: var(--ink);
            font-weight: 750;
            text-decoration-color: var(--accent-soft);
            text-decoration-thickness: 2px;
            text-underline-offset: 4px;
            word-break: break-word;
          }

          a:hover { color: var(--accent); }

          .muted {
            color: var(--muted);
            font-size: 14px;
          }

          .count {
            display: inline-flex;
            min-width: 34px;
            justify-content: center;
            border-radius: 999px;
            background: var(--accent-soft);
            padding: 4px 9px;
            font-weight: 800;
          }

          .foot {
            margin-top: 18px;
            color: var(--muted);
            font-size: 14px;
          }

          @media (max-width: 720px) {
            main { width: min(100% - 20px, 1120px); padding-top: 32px; }
            .panel { overflow-x: auto; }
            table { min-width: 680px; }
            th, td { padding: 13px 14px; }
          }
        </style>
      </head>
      <body>
        <main>
          <section class="hero">
            <p class="kicker">Sitemap</p>
            <h1>Matthias Ramahi Seitenuebersicht.</h1>
            <xsl:choose>
              <xsl:when test="s:sitemapindex">
                <p class="lede">Das ist der Sitemap-Index. Google liest diese Datei als technische Karte der Website; im Browser ist sie hier lesbar aufbereitet.</p>
                <div class="stats">
                  <span class="stat"><strong><xsl:value-of select="count(s:sitemapindex/s:sitemap)" /></strong><span>Teil-Sitemaps</span></span>
                </div>
              </xsl:when>
              <xsl:otherwise>
                <p class="lede">Das ist eine URL-Sitemap. Jede Zeile ist eine indexierbare Seite; Bilddaten werden separat fuer Google mitgegeben.</p>
                <div class="stats">
                  <span class="stat"><strong><xsl:value-of select="count(s:urlset/s:url)" /></strong><span>URLs</span></span>
                  <span class="stat"><strong><xsl:value-of select="count(s:urlset/s:url/image:image)" /></strong><span>Bilder</span></span>
                </div>
              </xsl:otherwise>
            </xsl:choose>
          </section>

          <xsl:choose>
            <xsl:when test="s:sitemapindex">
              <section class="panel" aria-label="Teil-Sitemaps">
                <table>
                  <thead>
                    <tr>
                      <th>Sitemap</th>
                      <th>Geaendert</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="s:sitemapindex/s:sitemap">
                      <tr>
                        <td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td>
                        <td class="muted"><xsl:value-of select="s:lastmod" /></td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </section>
            </xsl:when>
            <xsl:otherwise>
              <section class="panel" aria-label="URLs">
                <table>
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th>Geaendert</th>
                      <th>Bilder</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="s:urlset/s:url">
                      <tr>
                        <td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td>
                        <td class="muted"><xsl:value-of select="s:lastmod" /></td>
                        <td><span class="count"><xsl:value-of select="count(image:image)" /></span></td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </section>
            </xsl:otherwise>
          </xsl:choose>

          <p class="foot">Hinweis: Die Darstellung kommt aus einem XSL-Stylesheet. Der XML-Inhalt bleibt unveraendert maschinenlesbar.</p>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`

export const prerender = true

export function GET() {
  return new Response(sitemapXsl, {
    headers: {
      'content-type': 'application/xslt+xml; charset=utf-8',
      'cache-control': 'public, max-age=86400',
    },
  })
}
