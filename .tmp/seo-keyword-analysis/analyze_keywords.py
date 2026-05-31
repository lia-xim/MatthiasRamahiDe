from __future__ import annotations

import json
import math
import re
import unicodedata
from pathlib import Path
from statistics import mean
from typing import Callable

import pandas as pd


ROOT = Path(r"C:\Users\matth\Documents\MatthiasRamahiDe")
SOURCE_CSV = Path(r"C:\Users\matth\Downloads\2025-12-20_listkeywords_download_11a08 - Worksheet.csv")
OUT_DIR = ROOT / "outputs" / "seo-keyword-analysis-20260531"
ANALYSIS_JSON = OUT_DIR / "keyword_analysis.json"


def ascii_fold(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return value.replace("ß", "ss")


def slugify(value: str) -> str:
    value = ascii_fold(str(value).lower())
    value = value.replace("&", " und ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return re.sub(r"-+", "-", value).strip("-")


def compact(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", slugify(value))


def contains_any(text: str, patterns: list[str]) -> bool:
    return any(re.search(pattern, text) for pattern in patterns)


def cpc_to_float(value: str) -> float:
    value = str(value).replace("EUR", "").replace(" ", "").replace(",", ".")
    try:
        return float(value)
    except ValueError:
        return 0.0


def competition_to_int(value: str) -> int:
    value = str(value).replace("%", "").strip()
    try:
        return int(float(value))
    except ValueError:
        return 0


def load_existing_slugs() -> set[str]:
    slugs: set[str] = set()

    sitemap = ROOT / "sitemap-local-seo.xml"
    if sitemap.exists():
        text = sitemap.read_text(encoding="utf-8")
        for loc in re.findall(r"<loc>https?://[^/]+/([^<]+)</loc>", text):
            slugs.add(loc.replace(".html", "").strip("/"))

    legacy_dir = ROOT / "legacy-reference" / "html"
    if legacy_dir.exists():
        for html in legacy_dir.glob("*.html"):
            slugs.add(html.stem)

    exact_files = [
        "index",
        "fotografie",
        "fotografie-duesseldorf",
        "fotografie-nrw",
        "fotografie-deutschland",
        "portfolio",
        "blog",
        "leistungen",
        "contact",
        "ueber-mich",
        "fotolabor-druck-duesseldorf",
        "grossformatdruck-duesseldorf",
        "werbetechnik-duesseldorf",
        "webdesign-seo-duesseldorf",
        "videografie-duesseldorf",
        "viola-musik-duesseldorf",
    ]
    slugs.update(exact_files)
    return slugs


EXISTING_SLUGS = load_existing_slugs()
EXISTING_COMPACT = {compact(slug): slug for slug in EXISTING_SLUGS}


BAD_RULES: list[tuple[str, list[str]]] = [
    ("Tattoo / Zeichnung statt Fotografie", [r"tattoo", r"taetow", r"stencil", r"scherenschnitt"]),
    ("Tiere / Wildlife statt aktuelles Angebot", [r"\bkatze\b", r"\bkatzen\b", r"\bhund\b", r"\bhunde\b", r"\bhunden\b", r"\bpferd\b", r"\bpferde\b", r"\bfuchs\b", r"\btiere\b", r"wildlife", r"tierfotografie"]),
    ("Hochzeit / Standesamt / Feier", [r"hochzeit", r"standesamt", r"taufe", r"kommunion", r"konfirmation", r"jugendweihe", r"abschlussfeier", r"familienfeier", r"event"]),
    ("Passfoto / Kita / Schule", [r"passfoto", r"biometr", r"kita", r"kindergarten", r"grundschule", r"schulfoto"]),
    ("Ausbildung / Job / Gehalt", [r"ausbildung", r"studium", r"gehalt", r"beruf", r"stellen", r"stepstone", r"freiberufler", r"arbeitsorte", r"arbeitsmittel", r"verdient"]),
    ("Lexikon / Geschichte / Promis", [r"erfind", r"seit wann", r"19 jahrhundert", r"wikipedia", r"zitate", r"sprueche", r"beruehm", r"teuerster", r"raetsel"]),
    ("Iris / Augenstudio", [r"iris", r"augen fotograf"]),
    ("Fremde lokale Suche", [r"wien", r"mailand", r"japan", r"sylt", r"barleben", r"wolfen", r"aichach", r"bad cannstatt", r"bad wildbad", r"weisswasser", r"viernheim", r"rodgau", r"lichtenfels", r"hennef", r"kamp lintfort"]),
    ("Recht / Randthema", [r"privatgrundstueck", r"bildrechte", r"agb", r"stimmzettel", r"rassistisch", r"eiffelturm"]),
    ("Shop / Produkt / Gastronomie nicht Kernangebot", [r"restaurant", r"online-shop", r"online shop", r"produkt", r"logo fotograf"]),
]


CAT_RULES: list[dict] = [
    {
        "cluster": "Lokal / Near-me",
        "fit": 5,
        "patterns": [r"fotograf in meiner (nahe|naehe)", r"fotograf .*mettmann", r"fotograf .*erkrath", r"fotograf .*duesseldorf", r"fotografie (bochum|dortmund|essen)", r"fotograf (koeln|dortmund|wuppertal)", r"near me"],
        "target": "Google Business Profile + lokale Hubseiten",
        "action": "Lokale Optimierung",
    },
    {
        "cluster": "Gutschein / Geschenk",
        "fit": 4,
        "patterns": [r"gutschein", r"geschenk"],
        "target": "fotoshooting-gutschein.html",
        "action": "Neue Seite",
    },
    {
        "cluster": "Business / Corporate Portrait",
        "fit": 5,
        "patterns": [r"business", r"corporate", r"unternehmen", r"personal brand", r"personal branding", r"headshot", r"bewerbungsbild"],
        "target": "business-portrait-duesseldorf.html",
        "action": "Bestehende Seite optimieren",
    },
    {
        "cluster": "Dating / Personal Portrait",
        "fit": 4,
        "patterns": [r"tinder", r"dating"],
        "target": "dating-fotoshooting-duesseldorf.html",
        "action": "Neue Seite",
    },
    {
        "cluster": "Oldtimer / Youngtimer",
        "fit": 5,
        "patterns": [r"oldtimer", r"youngtimer", r"classic car", r"sammlerfahrzeug"],
        "target": "oldtimer-fotografie-duesseldorf.html",
        "action": "Bestehende Seite optimieren",
    },
    {
        "cluster": "Motorrad / Bike",
        "fit": 5,
        "patterns": [r"motorrad", r"bike", r"biker", r"custom bike", r"kawasaki", r"harley", r"ducati"],
        "target": "motorrad-fotografie-duesseldorf.html",
        "action": "Bestehende Seite optimieren",
    },
    {
        "cluster": "Auto / Automotive",
        "fit": 5,
        "patterns": [r"\bauto\b", r"\bautos\b", r"autofotografie", r"automobil", r"automotive", r"fahrzeug", r"car", r"sportwagen", r"porsche", r"bmw", r"wagen"],
        "target": "auto-fotoshooting-duesseldorf.html",
        "action": "Neue Seite oder starke Unterseite",
    },
    {
        "cluster": "Portrait Shooting",
        "fit": 4,
        "patterns": [r"portrait", r"portraet", r"portraets", r"people fotografie", r"fotografie mann", r"fotografie frauen"],
        "target": "portraitfotografie-duesseldorf.html",
        "action": "Bestehende Seite optimieren",
    },
    {
        "cluster": "Paar / Familie / Gruppen",
        "fit": 3,
        "patterns": [r"paar", r"paerchen", r"familie", r"family", r"gruppe"],
        "target": "portraitfotografie-duesseldorf.html",
        "action": "Als Abschnitt/FAQ statt eigene Seite",
    },
    {
        "cluster": "Fotoshooting allgemein",
        "fit": 4,
        "patterns": [r"fotoshooting", r"fotoshoot", r"fotoshoting", r"photo shoot", r"photo shooting", r"professionelles shooting", r"fotograf studio near me"],
        "target": "fotoshooting-duesseldorf.html",
        "action": "Neue Hub-Seite",
    },
    {
        "cluster": "Landschaft / Prints",
        "fit": 3,
        "patterns": [r"landschaft", r"naturfotografie", r"wandbild", r"leinwand", r"print", r"drucken lassen"],
        "target": "landschaftsbilder-kaufen.html",
        "action": "Bestehende Seite optimieren",
    },
    {
        "cluster": "Fotografie Wissen",
        "fit": 2,
        "patterns": [r"blende", r"belichtung", r"tiefenschaerfe", r"blaue stunde", r"goldene schnitt", r"perspektiven", r"spiegelung", r"minimalismus", r"regen fotografie", r"sonnenaufgang", r"sonne fotografieren", r"fotografieren technik", r"fotografieren lernen", r"lost places", r"deep sky", r"stacken", r"optische taeuschung", r"tilt-shift", r"wasserfall", r"bewegungen fotografieren"],
        "target": "journal/support-artikel",
        "action": "Support-Artikel selektiv",
    },
    {
        "cluster": "Weitere Dienstleistungen",
        "fit": 2,
        "patterns": [r"werbetechnik", r"webdesign", r"seo", r"fotografie website", r"web fotograf", r"fotograf design", r"fotograf designer"],
        "target": "leistungen.html",
        "action": "Nur falls Service aktiv bleibt",
    },
]


INFO_PATTERNS = [r"tipps", r"wie ", r"was ", r"wann", r"einstellungen", r"beleuchtung", r"format", r"formate", r"technik", r"fotografieren", r"ideen", r"lernen"]
COMMERCIAL_PATTERNS = [r"fotograf", r"shoot", r"fotoshooting", r"fotoshoting", r"preise", r"kosten", r"gutschein", r"near me", r"in meiner (nahe|naehe)", r"unternehmen", r"business", r"corporate", r"portrait fotos", r"auto fotos"]
LOCAL_PATTERNS = [r"duesseldorf", r"dusseldorf", r"koeln", r"koln", r"essen", r"dortmund", r"bochum", r"krefeld", r"mettmann", r"erkrath", r"nrw", r"neuss", r"duisburg", r"wuppertal", r"leverkusen", r"ratingen", r"hilden"]


def classify(text: str) -> dict:
    text_norm = ascii_fold(text.lower())

    for reason, patterns in BAD_RULES:
        if contains_any(text_norm, patterns):
            return {
                "cluster": "Nicht passend",
                "fit": 0,
                "target": "",
                "action": "Nicht verfolgen",
                "reason": reason,
            }

    for rule in CAT_RULES:
        if contains_any(text_norm, rule["patterns"]):
            return {
                "cluster": rule["cluster"],
                "fit": rule["fit"],
                "target": rule["target"],
                "action": rule["action"],
                "reason": "",
            }

    if "fotograf" in text_norm or "fotografie" in text_norm:
        return {
            "cluster": "Generische Fotografie",
            "fit": 1,
            "target": "fotografie-duesseldorf.html",
            "action": "Beobachten / nur falls guter Spin",
            "reason": "Zu generisch oder unklarer Intent",
        }

    return {
        "cluster": "Nicht passend",
        "fit": 0,
        "target": "",
        "action": "Nicht verfolgen",
        "reason": "Kein klarer Bezug zum Angebot",
    }


def infer_intent(text: str, classified: dict) -> tuple[str, int]:
    text_norm = ascii_fold(text.lower())
    if classified["fit"] == 0:
        return "Falscher Intent", 0
    commercial = contains_any(text_norm, COMMERCIAL_PATTERNS)
    info = contains_any(text_norm, INFO_PATTERNS)
    local = contains_any(text_norm, LOCAL_PATTERNS)
    if commercial and local:
        return "Lokal-kommerziell", 5
    if commercial:
        return "Kommerziell", 5
    if info and classified["fit"] >= 4:
        return "Informational mit Conversion-Nahe", 3
    if info:
        return "Informational", 2
    if local:
        return "Lokal", 4
    return "Gemischt / unklar", 2


def existing_coverage(keyword: str, target: str) -> tuple[str, str]:
    kw_slug = slugify(keyword)
    kw_compact = compact(keyword)
    target_slug = target.replace(".html", "").strip("/") if target else ""

    if target_slug in EXISTING_SLUGS:
        return "Bestehende Zielseite", target_slug + ".html"
    if kw_slug in EXISTING_SLUGS:
        return "Exact Keyword-URL vorhanden", kw_slug + ".html"
    if kw_compact in EXISTING_COMPACT:
        return "Semantisch/kompakt vorhanden", EXISTING_COMPACT[kw_compact] + ".html"

    # common semantic coverages
    if "business" in kw_slug and "business-portrait-duesseldorf" in EXISTING_SLUGS:
        return "Semantisch vorhanden", "business-portrait-duesseldorf.html"
    if "personal-brand" in kw_slug and "personal-branding-fotografie" in EXISTING_SLUGS:
        return "Semantisch vorhanden", "personal-branding-fotografie.html"
    if "auto" in kw_slug and "autofotografie" in EXISTING_SLUGS:
        return "Teilweise vorhanden", "autofotografie.html"
    if "portrait" in kw_slug and "portraitfotografie" in EXISTING_SLUGS:
        return "Teilweise vorhanden", "portraitfotografie.html"
    return "Fehlt / nicht sauber abgedeckt", ""


def score_keyword(volume: int, competition: int, cpc: float, fit: int, intent_score: int) -> int:
    volume_score = min(25.0, math.log1p(max(volume, 0)) / math.log1p(12400) * 25.0)
    comp_score = (100 - competition) / 100 * 15.0
    cpc_score = min(cpc, 6.0) / 6.0 * 10.0
    raw = fit * 8.0 + intent_score * 6.0 + volume_score + comp_score + cpc_score
    return max(0, min(100, round(raw / 1.2)))


def priority_for(score: int, action: str, fit: int, volume: int) -> str:
    if action == "Nicht verfolgen" or fit == 0:
        return "D"
    if score >= 70 or (fit >= 5 and volume >= 100):
        return "A"
    if score >= 55:
        return "B"
    if score >= 40:
        return "C"
    return "D"


def row_note(row: pd.Series, classified: dict, coverage: str) -> str:
    if classified["action"] == "Nicht verfolgen":
        return classified["reason"]
    if classified["cluster"] == "Auto / Automotive":
        return "Sehr nah am Hauptfokus; private Auto-Shootings und Automotive-Fotografie sauber trennen."
    if classified["cluster"] == "Gutschein / Geschenk":
        return "Kommerzieller Gutschein-Intent; gut als saisonale Conversion-Seite."
    if classified["cluster"] == "Lokal / Near-me":
        return "Nicht nur per Landingpage loesen: Google Business, NAP, interne lokale Links und Standortsignale."
    if classified["cluster"] == "Portrait Shooting":
        return "Passt, aber nur auf echte Shootings ausrichten; Pass-/Massenfoto-Intent vermeiden."
    if classified["cluster"] == "Fotografie Wissen":
        return "Nur als Support-Artikel, wenn er intern auf eine passende Leistungsseite verlinkt."
    if "Bestehend" in coverage or "vorhanden" in coverage.lower():
        return "Nicht zwingend neue Seite; vorhandene Seite gezielt mit Keyword-Abschnitt/FAQ staerken."
    return "Potenzial vorhanden; Content nur bauen, wenn Bildmaterial und klare Anfragefuehrung moeglich sind."


def metrics_for(df: pd.DataFrame, predicate: Callable[[pd.Series], bool]) -> dict:
    sub = df[df.apply(predicate, axis=1)].copy()
    if sub.empty:
        return {"keywords": "", "volume": 0, "avg_comp": 0, "avg_cpc": 0.0, "count": 0}
    keywords = ", ".join(sub.sort_values("Suchvolumen", ascending=False)["Keyword"].head(10).tolist())
    return {
        "keywords": keywords,
        "volume": int(sub["Suchvolumen"].sum()),
        "avg_comp": round(float(sub["competition"].mean()), 1),
        "avg_cpc": round(float(sub["cpc"].mean()), 2),
        "count": int(len(sub)),
    }


def is_bad_for_page_plan(text_norm: str) -> bool:
    allowed = []
    return any(contains_any(text_norm, patterns) for _, patterns in BAD_RULES if patterns not in allowed)


def build_page_plan(df: pd.DataFrame) -> list[dict]:
    norm = df["kw_norm"]
    clean = ~norm.map(is_bad_for_page_plan)

    def has(pattern: str) -> pd.Series:
        return norm.str.contains(pattern, regex=True, na=False) & clean

    def has_raw(pattern: str) -> pd.Series:
        return norm.str.contains(pattern, regex=True, na=False)

    plans = [
        {
            "priority": "A",
            "action": "Neue Hub-Seite",
            "page": "Fotoshooting Duesseldorf / NRW",
            "url": "fotoshooting-duesseldorf.html",
            "metric": has(r"fotoshooting|fotoshoot|fotoshoting|photo shoot|photo shooting|professionelles fotoshooting|fotograf studio near me"),
            "intent": "Breiter kommerzieller Einstieg",
            "why": "Faengt sehr viel generischen Shooting-Traffic ab und kann auf Portrait, Auto, Motorrad und Gutschein verteilen.",
            "implementation": "Als echte Verteilerseite bauen: Portrait, Auto, Motorrad, Oldtimer, Paar/Outdoor, Gutschein, Preise/FAQ; keine duenne Textseite.",
            "coverage": "Fehlt als klare Keyword-Hubseite",
        },
        {
            "priority": "A",
            "action": "Neue Seite oder starke Unterseite",
            "page": "Auto Fotoshooting / Bilder mit Auto",
            "url": "auto-fotoshooting-duesseldorf.html",
            "metric": has(r"bilder mit auto|bilder mit autos|bilder von autos|auto fotos|auto fotoshooting|fotoshooting auto|fotoshooting mit auto|fotograf autos|fotograf auto|auto fotograf"),
            "intent": "Privater Automotive-Shooting-Intent",
            "why": "Passt perfekt zu deinem Kernfokus und ist anders als Autohaus-/Verkaufsfotos: Menschen, Besitzer, Auto als Objekt.",
            "implementation": "Eigene Seite mit Varianten: Auto alleine, Besitzer mit Auto, Paarshooting Auto, Details, Location in NRW; intern von Automobil/Sportwagen verlinken.",
            "coverage": "Teilweise durch Autofotografie/Automobil abgedeckt, aber Intent ist spezieller",
        },
        {
            "priority": "A",
            "action": "Lokale Optimierung + neue lokale Hubseite",
            "page": "Fotograf Mettmann / Erkrath",
            "url": "fotograf-erkrath-mettmann.html",
            "metric": has(r"fotograf in meiner (nahe|naehe)|fotograf mettmann|fotograf erkrath|fotograf .*duesseldorf|fotografie bochum|fotografie dortmund|fotografie essen"),
            "intent": "Near-me / lokale Suche",
            "why": "Near-me-Volumen ist riesig; die beste Wirkung kommt aus Standortsignalen plus einer glaubwuerdigen lokalen Seite.",
            "implementation": "Kein Keyword-Spam: Google Business Profile, LocalBusiness-Schema, Kontaktseite mit Mettmann/Erkrath, lokale Referenzen, Anfahrt/Arbeitsradius, interne Links.",
            "coverage": "Mettmann-Service-Seiten vorhanden, Erkrath/generischer Fotograf-Hub fehlt",
        },
        {
            "priority": "A",
            "action": "Bestehende Seite optimieren",
            "page": "Business Portrait / Personal Branding",
            "url": "business-portrait-duesseldorf.html",
            "metric": has(r"business|corporate|unternehmen|personal brand|personal branding|headshot|bewerbungsbild"),
            "intent": "B2B / hochwertige Portrait-Anfrage",
            "why": "Hoher CPC und guter Fit; kann hochwertige Einzel- und Unternehmensportraits bringen.",
            "implementation": "Business Portrait, Corporate Fotografie, Personal Brand Fotograf, Headshots als Cluster aufbauen; klare Abgrenzung zu Passbildern.",
            "coverage": "Vorhanden, aber Keyword-Set erweitern",
        },
        {
            "priority": "A",
            "action": "Neue Conversion-Seite",
            "page": "Fotoshooting Gutschein",
            "url": "fotoshooting-gutschein.html",
            "metric": has(r"gutschein|geschenk"),
            "intent": "Kauf-/Geschenkintent",
            "why": "Sauberer kommerzieller Intent, saisonal stark, und gut fuer Portrait, Auto, Motorrad oder Paarshooting kombinierbar.",
            "implementation": "Voucher-Seite mit Varianten, Ablauf, Preisrahmen/Anfrage, Geschenk-FAQ und internen Links zu passenden Shooting-Arten.",
            "coverage": "Fehlt",
        },
        {
            "priority": "A",
            "action": "Bestehende Seite optimieren",
            "page": "Portrait Fotoshooting",
            "url": "portraitfotografie-duesseldorf.html",
            "metric": has(r"portrait fotos|foto portrait|fotos portrait|portrait-fotoshooting|portrait fotoshooting|portrait shooting|portrait photo|photography portrait|fotograf portrait|portrait outdoor|portrait von frauen|fotografie frauen|fotografie mann"),
            "intent": "Portrait-Shooting",
            "why": "Viel relevanter Traffic; passt zu echten Shootings, solange Tattoo/Passfoto sauber ausgeschlossen wird.",
            "implementation": "Title/H1/FAQ um Portrait Fotoshooting, Outdoor, Schwarz-Weiss, Frauen/Maenner, Ablauf und Bildauswahl erweitern.",
            "coverage": "Vorhanden",
        },
        {
            "priority": "B",
            "action": "Support-Artikel",
            "page": "Portraitfotografie Beleuchtung",
            "url": "journal/portraitfotografie-beleuchtung.html",
            "metric": has(r"portrait fotografie beleuchtung|portrait hintergrund|portrait in der daemmerung|dokumentarisches portrait"),
            "intent": "Informational mit Portrait-Nahe",
            "why": "Hoher Info-Traffic mit sehr niedriger Konkurrenz; gut fuer topical authority und interne Links zur Portraitseite.",
            "implementation": "Praxisnah schreiben, mit eigenen Bildern; CTA zu Portrait-Shooting und Business Portrait einbauen.",
            "coverage": "Fehlt als gezielter Artikel",
        },
        {
            "priority": "B",
            "action": "Neue Nischenseite",
            "page": "Dating / Tinder Fotoshooting",
            "url": "dating-fotoshooting-duesseldorf.html",
            "metric": has(r"tinder|dating"),
            "intent": "Persoenliches Portrait mit klarem Nutzungsziel",
            "why": "Kleiner, aber klarer kommerzieller Intent; kann gut als modernes Outdoor-/Lifestyle-Portrait positioniert werden.",
            "implementation": "Nicht billig wirken lassen: Dating-Profil, natuerliche Portraits, Outfit/Location, keine generischen Posen.",
            "coverage": "Fehlt",
        },
        {
            "priority": "B",
            "action": "Neue Seite oder Artikel",
            "page": "Schwarz-Weiss / Fine-Art Portrait",
            "url": "schwarz-weiss-portrait-fotografie.html",
            "metric": has(r"portrait schwarz|black and white portrait|schwarz-weiss portrait|portrait frau schwarz|fine art portrait|historisches portrait|vintage"),
            "intent": "Stil-/Portfolio-Intent",
            "why": "Passt zu kuenstlerischen Portraits und kann Premium-Stil statt Standardfoto betonen.",
            "implementation": "Mit Vintage/Fine-Art/Schwarz-Weiss als Stilcluster arbeiten; nur eine starke Seite statt drei duenne Seiten.",
            "coverage": "Teilweise durch Portrait vorhanden",
        },
        {
            "priority": "B",
            "action": "Support-Artikel",
            "page": "Auto fotografieren Tipps",
            "url": "journal/auto-fotografieren-tipps.html",
            "metric": has(r"auto fotografieren|autos fotografieren|autos fotografieren tipps|oldtimer fotografieren|oldtimer richtig fotografieren|professionelle auto fotografie|studio autofotografie"),
            "intent": "Informational mit Automotive-Nahe",
            "why": "Kleineres Volumen, aber extrem passend fuer deinen Kernbereich und als Trust-Signal gut.",
            "implementation": "Mit eigenen Beispielen: Location, Licht, Reflexe, Interieur, Verkauf vs. Editorial; Links zu Auto-/Oldtimer-Shooting.",
            "coverage": "Fehlt als Artikel",
        },
        {
            "priority": "B",
            "action": "Bestehende Seite optimieren",
            "page": "Oldtimer Fotografie",
            "url": "oldtimer-fotografie-duesseldorf.html",
            "metric": has(r"oldtimer"),
            "intent": "Kernangebot, niedriges Suchvolumen",
            "why": "Auch bei niedrigem Volumen hoher Angebotsfit; eher Conversion- und Portfolioseite als Traffic-Magnet.",
            "implementation": "Verkaufsfotos, Sammlerfahrzeug, Zustand/Patina, Interieur/Details und Auktion/Inserat staerker herausarbeiten.",
            "coverage": "Vorhanden",
        },
        {
            "priority": "B",
            "action": "Bestehende Seite optimieren",
            "page": "Motorrad Fotografie",
            "url": "motorrad-fotografie-duesseldorf.html",
            "metric": has(r"motorrad|bike|biker|custom bike"),
            "intent": "Kernangebot, Nischenvolumen",
            "why": "Sehr nah am Angebot; Suchvolumen in dieser Datei klein, aber Differenzierung stark.",
            "implementation": "Motorradfotografie ohne Bindestrich, Motorrad Shooting, Paarshooting Motorrad und Biker Portrait als Begriffe integrieren.",
            "coverage": "Vorhanden",
        },
        {
            "priority": "C",
            "action": "Abschnitt/FAQ statt eigene Seite",
            "page": "Paarshooting mit Auto/Motorrad",
            "url": "portraitfotografie-duesseldorf.html#paarshooting",
            "metric": has(r"paerchenbilder auto|paarshooting motorrad|paarshooting|paar fotoshooting"),
            "intent": "Nische mit gutem Angebotsfit",
            "why": "Sehr passend zu dir, aber aus der Datei zu klein fuer eine sofortige eigene Seite.",
            "implementation": "Als Abschnitt in Auto-Fotoshooting und Portraitseite einbauen; spaeter bei Anfragen/Impressionen ausbauen.",
            "coverage": "Fehlt als spezifischer Abschnitt",
        },
        {
            "priority": "C",
            "action": "Bestehende Print-/Landschaftsseiten optimieren",
            "page": "Landschaft / Leinwand / Print",
            "url": "landschaftsbilder-kaufen.html",
            "metric": has(r"landschaft|leinwand|wandbild|drucken lassen|fotografie leinwand|naturfotografie"),
            "intent": "Print-/Inspirationsintent",
            "why": "Nicht Hauptumsatz, aber gut fuer Autoritaet und Shop/Prints.",
            "implementation": "Print, Wandbild, Leinwand, Fine-Art-Papier und Formate als Cluster staerken; keine generische Landschaftsratgeber-Flut.",
            "coverage": "Vorhanden",
        },
        {
            "priority": "C",
            "action": "FAQ/Artikel",
            "page": "Fotoshooting Preise / Was kostet ein Fotograf?",
            "url": "journal/fotoshooting-preise-fotograf-kosten.html",
            "metric": has(r"fotograf kosten|was kostet ein fotograf|fotograf preise|tagessatz fotograf|stundenlohn fotograf"),
            "intent": "Preis-Recherche",
            "why": "Kommerziell interessant, aber heikel: nur bauen, wenn du Preislogik transparent, aber nicht billig formulierst.",
            "implementation": "Mit Paketen/Einflussfaktoren statt fixer Dumpingpreise; klare Weiterleitung zu Anfrage.",
            "coverage": "Fehlt",
        },
        {
            "priority": "D",
            "action": "Nicht verfolgen",
            "page": "Tattoo / Tiere / Hochzeit / Passfoto / Ausbildung",
            "url": "",
            "metric": has_raw(r".*") & ~clean,
            "intent": "Falsches Angebot",
            "why": "Kann Traffic bringen, aber falsche Signale, falsche Anfragen und duennere Positionierung.",
            "implementation": "Nicht als eigene Seiten bauen; hoechstens in FAQ bewusst abgrenzen, wenn Anfragen stoeren.",
            "coverage": "Nicht relevant",
        },
    ]

    result: list[dict] = []
    for item in plans:
        metric_mask = item.pop("metric")
        sub = df[metric_mask].copy()
        if sub.empty:
            volume = avg_comp = avg_cpc = count = 0
            keywords = ""
        else:
            volume = int(sub["Suchvolumen"].sum())
            avg_comp = round(float(sub["competition"].mean()), 1)
            avg_cpc = round(float(sub["cpc"].mean()), 2)
            count = int(len(sub))
            keywords = ", ".join(sub.sort_values("Suchvolumen", ascending=False)["Keyword"].head(12).tolist())
        result.append(
            {
                **item,
                "cluster_keywords": keywords,
                "keyword_count": count,
                "cluster_volume": volume,
                "avg_competition_pct": avg_comp,
                "avg_cpc_eur": avg_cpc,
            }
        )
    return result


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    df = pd.read_csv(SOURCE_CSV, encoding="utf-8-sig")
    df["competition"] = df["Wettbewerber"].map(competition_to_int)
    df["cpc"] = df["CPC"].map(cpc_to_float)
    df["kw_norm"] = df["Keyword"].map(lambda value: ascii_fold(str(value).lower()))

    analysis_rows = []
    for _, row in df.iterrows():
        keyword = str(row["Keyword"])
        classified = classify(keyword)
        intent, intent_score = infer_intent(keyword, classified)
        coverage, covered_url = existing_coverage(keyword, classified.get("target", ""))
        score = score_keyword(int(row["Suchvolumen"]), int(row["competition"]), float(row["cpc"]), int(classified["fit"]), intent_score)
        priority = priority_for(score, classified["action"], int(classified["fit"]), int(row["Suchvolumen"]))

        # Make high-volume informational topics useful, but not over-promoted.
        if classified["cluster"] == "Fotografie Wissen" and int(row["Suchvolumen"]) >= 150 and classified["action"] != "Nicht verfolgen":
            priority = "C"
        if classified["cluster"] == "Portrait Shooting" and "tattoo" in row["kw_norm"]:
            priority = "D"

        analysis_rows.append(
            {
                "keyword": keyword,
                "volume": int(row["Suchvolumen"]),
                "competition_pct": int(row["competition"]),
                "cpc_eur": round(float(row["cpc"]), 2),
                "cluster": classified["cluster"],
                "fit_score_0_5": int(classified["fit"]),
                "intent": intent,
                "recommended_action": classified["action"],
                "target_page": classified["target"],
                "coverage": coverage,
                "covered_url": covered_url,
                "priority": priority,
                "opportunity_score": score,
                "note": row_note(row, classified, coverage),
            }
        )

    scored = pd.DataFrame(analysis_rows)
    page_plan = build_page_plan(df)

    cluster_summary = []
    for cluster, group in scored.groupby("cluster"):
        good = group[group["recommended_action"] != "Nicht verfolgen"]
        cluster_summary.append(
            {
                "cluster": cluster,
                "keyword_count": int(len(group)),
                "usable_keywords": int(len(good)),
                "total_volume": int(group["volume"].sum()),
                "usable_volume": int(good["volume"].sum()),
                "avg_competition_pct": round(float(group["competition_pct"].mean()), 1),
                "avg_cpc_eur": round(float(group["cpc_eur"].mean()), 2),
                "top_keywords": ", ".join(group.sort_values("volume", ascending=False)["keyword"].head(8).tolist()),
            }
        )

    no_go = scored[scored["recommended_action"] == "Nicht verfolgen"].sort_values(["volume", "opportunity_score"], ascending=False)
    top_keywords = scored[scored["recommended_action"] != "Nicht verfolgen"].sort_values(["priority", "opportunity_score", "volume"], ascending=[True, False, False])

    payload = {
        "meta": {
            "generated_at": "2026-05-31",
            "source_csv": str(SOURCE_CSV),
            "total_keywords": int(len(df)),
            "total_search_volume": int(df["Suchvolumen"].sum()),
            "existing_slug_count": len(EXISTING_SLUGS),
            "scoring_note": "Score combines offer fit, commercial/local intent, log search volume, lower competition, and CPC signal.",
        },
        "executive_summary": [
            "Die Datei enthaelt viel generischen Foto- und Portrait-Traffic; Automotive/Motorrad ist kleiner, aber strategisch deutlich naeher am Angebot.",
            "Nicht jedes hohe Volumen lohnt sich: Tattoo, Hochzeit, Passfoto, Kita, Tierfotografie, Ausbildung/Gehalt und reine Lexikon-Suchen sollten nicht als Seiten gebaut werden.",
            "Groesste Hebel: Fotoshooting-Hub, Auto-Fotoshooting/Bilder-mit-Auto, lokale Mettmann/Erkrath/Near-me-Signale, Business Portrait, Gutschein-Seite und gezielte Support-Artikel.",
            "Viele Kernseiten existieren bereits. Fuer diese ist meist Optimierung/Keyword-Erweiterung sinnvoller als noch mehr fast gleiche Landingpages.",
        ],
        "page_plan": page_plan,
        "cluster_summary": sorted(cluster_summary, key=lambda item: item["usable_volume"], reverse=True),
        "keyword_analysis": scored.sort_values(["priority", "opportunity_score", "volume"], ascending=[True, False, False]).to_dict(orient="records"),
        "top_keywords": top_keywords.head(120).to_dict(orient="records"),
        "no_go_keywords": no_go.head(180).to_dict(orient="records"),
    }

    ANALYSIS_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "output": str(ANALYSIS_JSON),
        "keywords": payload["meta"]["total_keywords"],
        "total_volume": payload["meta"]["total_search_volume"],
        "page_plan_rows": len(page_plan),
        "usable_keywords": int((scored["recommended_action"] != "Nicht verfolgen").sum()),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
