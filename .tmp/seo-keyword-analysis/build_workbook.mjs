import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = "C:\\Users\\matth\\Documents\\MatthiasRamahiDe";
const outputDir = path.join(root, "outputs", "seo-keyword-analysis-20260531");
const analysisPath = path.join(outputDir, "keyword_analysis.json");
const workbookPath = path.join(outputDir, "seo_keyword_analyse_matthias_ramahi_2026-05-31.xlsx");

const data = JSON.parse(await fs.readFile(analysisPath, "utf-8"));

function colLetter(n) {
  let s = "";
  let x = n + 1;
  while (x > 0) {
    const m = (x - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    x = Math.floor((x - m) / 26);
  }
  return s;
}

function rangeFor(rows, cols) {
  return `A1:${colLetter(cols - 1)}${rows}`;
}

function writeMatrix(sheet, startRow, startCol, matrix) {
  if (!matrix.length || !matrix[0].length) return;
  sheet.getRangeByIndexes(startRow, startCol, matrix.length, matrix[0].length).values = matrix;
}

function addTableSheet(workbook, name, headers, rows, tableName, widths = {}) {
  const sheet = workbook.worksheets.add(name);
  sheet.showGridLines = false;
  const matrix = [headers, ...rows];
  writeMatrix(sheet, 0, 0, matrix);
  const used = sheet.getRangeByIndexes(0, 0, matrix.length, headers.length);
  used.format = {
    font: { color: "#1F2937" },
    wrapText: true,
    verticalAlignment: "Top",
  };
  sheet.getRangeByIndexes(0, 0, 1, headers.length).format = {
    fill: "#1F2937",
    font: { bold: true, color: "#FFFFFF" },
    wrapText: true,
    verticalAlignment: "Center",
  };
  sheet.freezePanes.freezeRows(1);
  const table = sheet.tables.add(rangeFor(matrix.length, headers.length), true, tableName);
  table.style = "TableStyleMedium2";
  table.showFilterButton = true;

  headers.forEach((_, i) => {
    const px = widths[i] || 130;
    sheet.getRangeByIndexes(0, i, matrix.length, 1).format.columnWidthPx = px;
  });
  sheet.getRangeByIndexes(1, 0, Math.max(1, matrix.length - 1), headers.length).format = {
    verticalAlignment: "Top",
    wrapText: true,
  };
  return sheet;
}

function priorityRank(priority) {
  return { A: 1, B: 2, C: 3, D: 4 }[priority] || 9;
}

const workbook = Workbook.create();

// Executive summary
const summary = workbook.worksheets.add("Executive Summary");
summary.showGridLines = false;
summary.getRange("A1:H1").merge();
summary.getRange("A1").values = [["SEO Keyword-Analyse Matthias Ramahi"]];
summary.getRange("A1").format = {
  fill: "#111827",
  font: { bold: true, color: "#FFFFFF", size: 18 },
  horizontalAlignment: "Center",
  verticalAlignment: "Center",
};
summary.getRange("A1:H1").format.rowHeightPx = 36;

const metaRows = [
  ["Quelle", data.meta.source_csv],
  ["Stand", data.meta.generated_at],
  ["Keywords", data.meta.total_keywords],
  ["Kumuliertes Suchvolumen", data.meta.total_search_volume],
  ["Bestehende URL-/Slug-Abdeckung", data.meta.existing_slug_count],
  ["Scoring", data.meta.scoring_note],
];
writeMatrix(summary, 2, 0, metaRows);
summary.getRange("A3:A8").format = { fill: "#E5E7EB", font: { bold: true }, wrapText: true };
summary.getRange("B3:B8").format = { fill: "#F9FAFB", wrapText: true };
summary.getRange("A3:B8").format = { verticalAlignment: "Top" };
summary.getRange("A3:A8").format.columnWidthPx = 220;
summary.getRange("B3:B8").format.columnWidthPx = 580;

summary.getRange("A10:H10").merge();
summary.getRange("A10").values = [["Kurzfazit"]];
summary.getRange("A10").format = { fill: "#374151", font: { bold: true, color: "#FFFFFF" } };
const bullets = data.executive_summary.map((text) => [`- ${text}`]);
writeMatrix(summary, 10, 0, bullets);
summary.getRangeByIndexes(10, 0, bullets.length, 8).merge(true);
summary.getRangeByIndexes(10, 0, bullets.length, 8).format = {
  fill: "#F9FAFB",
  wrapText: true,
  verticalAlignment: "Top",
};

const topPlan = data.page_plan
  .slice()
  .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || b.cluster_volume - a.cluster_volume)
  .slice(0, 10);
const planHeaders = ["Prio", "Aktion", "Seite", "URL", "Suchvol.", "Wettb. %", "CPC EUR", "Warum"];
const planRows = topPlan.map((r) => [
  r.priority,
  r.action,
  r.page,
  r.url,
  r.cluster_volume,
  r.avg_competition_pct,
  r.avg_cpc_eur,
  r.why,
]);
writeMatrix(summary, 17, 0, [planHeaders, ...planRows]);
summary.getRange("A18:H18").format = { fill: "#1F2937", font: { bold: true, color: "#FFFFFF" }, wrapText: true };
summary.getRangeByIndexes(18, 0, planRows.length, planHeaders.length).format = { fill: "#FFFFFF", wrapText: true, verticalAlignment: "Top" };
[70, 160, 220, 220, 90, 90, 90, 420].forEach((px, i) => {
  summary.getRangeByIndexes(17, i, planRows.length + 1, 1).format.columnWidthPx = px;
});
summary.getRange("E19:G28").format.numberFormat = "#,##0.00";

// Chart helper and chart
const chartSource = data.cluster_summary
  .filter((r) => r.usable_volume > 0)
  .slice(0, 8)
  .map((r) => [r.cluster, r.usable_volume]);
writeMatrix(summary, 2, 9, [["Cluster", "Nutzbares Volumen"], ...chartSource]);
summary.getRange("J3:K3").format = { fill: "#374151", font: { bold: true, color: "#FFFFFF" } };
summary.getRange("J:K").format.columnWidthPx = 190;
const chart = summary.charts.add("bar", summary.getRangeByIndexes(2, 9, chartSource.length + 1, 2));
chart.title = "Nutzbares Suchvolumen nach Cluster";
chart.hasLegend = false;
chart.xAxis = { axisType: "textAxis" };
chart.yAxis = { numberFormatCode: "#,##0" };
chart.setPosition("J14", "Q31");

// Page plan
addTableSheet(
  workbook,
  "Seitenplan",
  [
    "Prioritaet",
    "Aktion",
    "Empfohlene Seite",
    "URL / Ziel",
    "Cluster-Keywords",
    "Keyword Count",
    "Suchvolumen",
    "Wettbewerb %",
    "CPC EUR",
    "Intent",
    "Warum lohnt es sich",
    "Umsetzungshinweis",
    "Abdeckung",
  ],
  data.page_plan.map((r) => [
    r.priority,
    r.action,
    r.page,
    r.url,
    r.cluster_keywords,
    r.keyword_count,
    r.cluster_volume,
    r.avg_competition_pct,
    r.avg_cpc_eur,
    r.intent,
    r.why,
    r.implementation,
    r.coverage,
  ]),
  "SeitenplanTable",
  {
    0: 80,
    1: 190,
    2: 240,
    3: 230,
    4: 430,
    5: 90,
    6: 100,
    7: 100,
    8: 90,
    9: 180,
    10: 390,
    11: 440,
    12: 230,
  },
);

// Full keyword analysis
const keywordHeaders = [
  "Keyword",
  "Suchvolumen",
  "Wettbewerb %",
  "CPC EUR",
  "Cluster",
  "Fit 0-5",
  "Intent",
  "Empfehlung",
  "Zielseite",
  "Abdeckung",
  "Vorhandene URL",
  "Prioritaet",
  "Opportunity Score",
  "Notiz",
];
addTableSheet(
  workbook,
  "Keyword Bewertung",
  keywordHeaders,
  data.keyword_analysis.map((r) => [
    r.keyword,
    r.volume,
    r.competition_pct,
    r.cpc_eur,
    r.cluster,
    r.fit_score_0_5,
    r.intent,
    r.recommended_action,
    r.target_page,
    r.coverage,
    r.covered_url,
    r.priority,
    r.opportunity_score,
    r.note,
  ]),
  "KeywordBewertungTable",
  {
    0: 260,
    1: 95,
    2: 95,
    3: 85,
    4: 170,
    5: 70,
    6: 180,
    7: 210,
    8: 250,
    9: 220,
    10: 220,
    11: 80,
    12: 110,
    13: 420,
  },
);

// Cluster summary
addTableSheet(
  workbook,
  "Cluster Summary",
  [
    "Cluster",
    "Keywords",
    "Nutzbare Keywords",
    "Gesamtvolumen",
    "Nutzbares Volumen",
    "Wettbewerb %",
    "CPC EUR",
    "Top Keywords",
  ],
  data.cluster_summary.map((r) => [
    r.cluster,
    r.keyword_count,
    r.usable_keywords,
    r.total_volume,
    r.usable_volume,
    r.avg_competition_pct,
    r.avg_cpc_eur,
    r.top_keywords,
  ]),
  "ClusterSummaryTable",
  {
    0: 230,
    1: 90,
    2: 120,
    3: 110,
    4: 120,
    5: 100,
    6: 90,
    7: 540,
  },
);

// No-go list
addTableSheet(
  workbook,
  "No-Go Keywords",
  ["Keyword", "Suchvolumen", "Wettbewerb %", "CPC EUR", "Ausschlussgrund", "Notiz"],
  data.no_go_keywords.map((r) => [r.keyword, r.volume, r.competition_pct, r.cpc_eur, r.note, "Nicht als SEO-Seite bauen."]),
  "NoGoKeywordsTable",
  {
    0: 290,
    1: 100,
    2: 100,
    3: 90,
    4: 340,
    5: 250,
  },
);

// Assumptions
const assumptions = workbook.worksheets.add("Annahmen");
assumptions.showGridLines = false;
assumptions.getRange("A1:F1").merge();
assumptions.getRange("A1").values = [["Annahmen und Bewertungslogik"]];
assumptions.getRange("A1").format = { fill: "#111827", font: { bold: true, color: "#FFFFFF", size: 16 }, horizontalAlignment: "Center" };
const assumptionRows = [
  ["Angebot", "Portrait-Shootings, Landschaftsfotografie, Hauptfokus Automotive/Sportwagen/Motorrad/Oldtimer."],
  ["Region", "NRW / DACH mit Schwerpunkt Duesseldorf, Koeln, Dortmund, Essen, Bochum, Krefeld, Leverkusen, Mettmann/Erkrath."],
  ["Nicht gewuenscht", "Keine Passfoto-Seiten, keine Hochzeit/Standesamt/Kita/Tierfotografie als SEO-Ziel, Gruppen eher zurueckhaltend."],
  ["Bewertung", "Opportunity Score kombiniert Angebotsfit, kommerziellen/lokalen Intent, Suchvolumen, niedrigere Konkurrenz und CPC-Signal."],
  ["Wichtiger SEO-Hinweis", "Neue Seiten nur bauen, wenn sie eindeutig anderen Intent bedienen. Bestehende Kernseiten lieber erweitern als duplizieren."],
  ["Quellen im Repo", "sitemap-local-seo.xml, local-seo-cluster-tracker.md, legacy-reference/html und die bereitgestellte CSV."],
  ["Live-Website-Pruefung", "Die oeffentliche Startseite zeigt noch aeltere Inhalte; diese Analyse priorisiert die lokale neue Zielstruktur im Repo."],
];
writeMatrix(assumptions, 2, 0, assumptionRows);
assumptions.getRange("A3:A9").format = { fill: "#E5E7EB", font: { bold: true }, wrapText: true, verticalAlignment: "Top" };
assumptions.getRange("B3:F9").merge(true);
assumptions.getRange("B3:F9").format = { fill: "#F9FAFB", wrapText: true, verticalAlignment: "Top" };
assumptions.getRange("A:A").format.columnWidthPx = 180;
assumptions.getRange("B:F").format.columnWidthPx = 180;

// Basic numeric formats
for (const sheetName of ["Seitenplan", "Keyword Bewertung", "Cluster Summary", "No-Go Keywords"]) {
  const sheet = workbook.worksheets.getItem(sheetName);
  const used = sheet.getUsedRange(true);
  used.format.verticalAlignment = "Top";
}

await fs.mkdir(outputDir, { recursive: true });

const previewRanges = {
  "Executive Summary": undefined,
  Seitenplan: undefined,
  "Keyword Bewertung": "A1:N35",
  "Cluster Summary": undefined,
  "No-Go Keywords": "A1:F45",
  Annahmen: undefined,
};

for (const sheetName of Object.keys(previewRanges)) {
  const preview = await workbook.render({
    sheetName,
    range: previewRanges[sheetName],
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(path.join(outputDir, `${sheetName.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}_preview.png`), new Uint8Array(await preview.arrayBuffer()));
}

const inspect = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 5000,
  tableMaxRows: 4,
  tableMaxCols: 6,
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 200 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(workbookPath);
console.log(JSON.stringify({ workbookPath }));
