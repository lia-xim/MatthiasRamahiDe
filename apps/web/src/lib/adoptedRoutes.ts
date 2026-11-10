import { localSeoCityTokens, localSeoPrefixes } from './localSeoLayoutFamilies'

export const adoptedLegacyFiles = [
  'fotografie.html',
  'fotografie-duesseldorf.html',
  'fotografie-nrw.html',
  'fotografie-erkrath.html',
  'fotografie-deutschland.html',
  'automobil-fotografie.html',
  'sportwagen-fotografie.html',
  'oldtimer-fotografie.html',
  'motorrad-fotografie.html',
  'portraitfotografie.html',
  'landschaftsfotografie.html',
  'portfolio.html',
  'leistungen.html',
  'contact.html',
  'ueber-mich.html',
  'blog.html',
  'impressum.html',
  'datenschutz.html',
  'fotolabor-druck-duesseldorf.html',
  'grossformatdruck-duesseldorf.html',
  'werbetechnik-duesseldorf.html',
  'webdesign-seo-duesseldorf.html',
  'keyword-datenbank-seo.html',
  'videografie-duesseldorf.html',
  'viola-musik-duesseldorf.html',
  'drucke-sonderanfertigungen-duesseldorf.html',
  'blog-actioncam-motorrad.html',
  'blog-auto-fotoshooting-kostenfaktoren.html',
  'blog-auto-fotoshooting-verschenken.html',
  'blog-auto-im-winter-fotografieren.html',
  'blog-auto-nachts-fotografieren.html',
  'blog-automotive-fotografie-duesseldorf.html',
  'blog-automobilfotografie-im-regen.html',
  'blog-automobil-eventfotografie-beauftragen.html',
  'blog-automobilfotografie-fuer-redaktionen.html',
  'blog-autohaus-showroomlicht.html',
  'blog-autohaus-fotoanlage-oder-fotograf.html',
  'blog-fahrzeugfotos-mehrere-autohausstandorte-planen.html',
  'blog-autohaus-fahrzeugfotos-schlechtes-wetter.html',
  'blog-auto-shooting-briefing.html',
  'blog-autofotografie-briefing-vorlage.html',
  'blog-auto-fotoshooting-tagesplan.html',
  'blog-moodboard-auto-fotoshooting.html',
  'blog-automotive-markenstorytelling.html',
  'blog-autofotograf-finden.html',
  'blog-businessportraits-draussen.html',
  'blog-echte-fahrzeugfotos-oder-ki.html',
  'blog-ki-bilder-auto-inserat-erkennen.html',
  'blog-farbharmonie-fahrzeugfotografie.html',
  'blog-farbtheorie-fotografie.html',
  'blog-fahrzeugserie-konsistent-planen.html',
  'blog-fahrzeuguebergabe-fotodokumentation-fuhrpark.html',
  'blog-fine-art-druck.html',
  'blog-fotograf-autohaus-fahrzeugbestand.html',
  'blog-landschaftsbild-fine-art-print-auswaehlen.html',
  'blog-lichtformer-portraitfotografie.html',
  'blog-low-key-high-key-portraits.html',
  'blog-lightpainting-fahrzeuge.html',
  'blog-location-scouting-duesseldorf.html',
  'blog-motorrad-eventfotografie.html',
  'blog-motorrad-fuer-verkauf-fotografieren.html',
  'blog-motorradhaendler-bestandsfotos.html',
  'blog-motorrad-inseratsfotos-pruefen.html',
  'blog-motorrad-fotoshooting-sicherheit.html',
  'blog-motorrad-fotoshooting-checkliste.html',
  'blog-motorrad-fotoshooting-verschenken.html',
  'blog-motorrad-fotospots-nrw.html',
  'blog-motorrad-im-gegenlicht-fotografieren.html',
  'blog-motorrad-nachts-fotografieren.html',
  'blog-fotospots-autos-nrw.html',
  'blog-rolling-shots-auto.html',
  'blog-motorrad-studiofotografie.html',
  'blog-motorradfotografie-im-regen.html',
  'blog-motorradfotografie-linien.html',
  'blog-musiker-portraits.html',
  'blog-oldtimer-veranstaltungen.html',
  'blog-oldtimerfotograf-finden.html',
  'blog-oldtimer-wertobjekt.html',
  'blog-portraitshooting-wetter.html',
  'blog-portraits-offener-schatten.html',
  'blog-portraits-ohne-generische-posen.html',
  'blog-rolling-shots-motorrad.html',
  'blog-schwarz-weiss-portrait-licht.html',
  'blog-serie-kuratieren.html',
  'blog-sportwagen-foto-video-gemeinsam-planen.html',
  'blog-oldtimer-auf-film-fotografieren.html',
  'blog-sportwagen-vorbereitung.html',
  'blog-motorsportfotograf-beauftragen.html',
  'blog-nutzungsrechte-fahrzeugfotos.html',
  'blog-elektroauto-ladeinfrastruktur-fotografieren.html',
  'blog-oldtimer-restaurierung-fotodokumentation.html',
  'blog-motorsport-fotograf-akkreditierung.html',
  'blog-motorsport-fotos-fuer-sponsoren.html',
  'blog-motorsport-fahrerportraits.html',
  'blog-mobile-de-ki-qualitaetscheck-fahrzeugfotos.html',
  'blog-fahrzeugfolierung-fotografieren.html',
  'blog-fahrzeugfotos-google-bildersuche-ai-suche.html',
  'blog-fahrzeugfotos-kennzeichen-personen-datenschutz.html',
  'blog-fahrzeugfotografie-lkw-nutzfahrzeugflotte.html',
  'blog-fahrzeugaufbereitung-vorher-nachher-fotografieren.html',
  'blog-automotive-messefotografie-planen.html',
  'blog-wohnmobil-camper-fotografieren.html',
  'blog-oldtimer-sammlung-fotografisch-dokumentieren.html',
  'blog-oldtimer-concours-fotos-bewerbung.html',
  'blog-carsharing-fahrzeugfotos-stationen-fleet.html',
  'blog-autovermietung-fahrzeugbilder-fahrzeugklassen.html',
  'blog-autoteile-zubehoer-produktfotografie.html',
  'blog-autofoto-fine-art-print-auswaehlen.html',
  'blog-autofoto-fine-art-print-pflegen-aufbewahren.html',
  'blog-autofoto-druckgroesse-auflosung-ppi.html',
  'blog-auto-mit-drohne-fotografieren.html',
  'blog-trackday-fotos-eigenes-auto-finden.html',
  'blog-offroad-fahrzeugfotografie-planen.html',
  'blog-auto-innenraum-fotografieren-cockpit-displays.html',
  'blog-gebrauchtwagen-fuer-online-inserat-fotografieren.html',
  'blog-gebrauchtwagen-inseratsfotos-pruefen.html',
  'blog-unfallschaden-auto-fotografisch-dokumentieren.html',
  'blog-auto-mit-smartphone-fotografieren.html',
  'blog-kfz-werkstatt-fotografieren-fahrzeug-reparaturbilder.html',
  'blog-oldtimer-fuer-online-auktion-fotografieren.html',
  'blog-felgen-am-auto-fotografieren.html',
  'blog-autofotografie-kameraeinstellungen.html',
  'blog-kamera-fuer-autofotografie.html',
  'blog-auto-in-tiefgarage-fotografieren.html',
  'blog-schwarzes-auto-fotografieren.html',
  'blog-weisses-auto-fotografieren.html',
  'blog-polfilter-auto-fotografieren.html',
  'blog-tuning-umbau-fotografisch-dokumentieren.html',
  'blog-auto-zur-goldenen-stunde-fotografieren.html',
  'blog-auto-bei-bedecktem-himmel-fotografieren.html',
  'blog-autoreise-fotografieren-roadtrip-bildserie.html',
  'blog-auto-in-der-landschaft-fotografieren.html',
  'blog-360-grad-fahrzeugfotos-planen.html',
  'blog-auto-auf-messe-fotografieren.html',
  'blog-auto-durch-scheibe-fotografieren.html',
  'blog-auto-freistellen-produktbilder.html',
  'blog-auto-hochformat-fotografieren.html',
  'blog-auto-im-studio-oder-location-fotografieren.html',
  'blog-auto-mit-blitz-fotografieren.html',
  'blog-auto-vor-industriearchitektur-fotografieren.html',
  'blog-autofotografie-sommer-hitze-ausruestung.html',
  'blog-autofotos-farbmanagement-monitor-export.html',
  'blog-autofotos-in-lightroom-bearbeiten.html',
  'blog-autofotos-am-smartphone-bearbeiten.html',
  'blog-autofotos-fuer-website-planen.html',
  'blog-autofotos-instagram-karussell-bildfolge.html',
  'blog-autofotos-retuschieren-fahrzeugtreue.html',
  'blog-automotive-kampagne-fotograf-finden.html',
  'blog-basteibruecke-fotografieren-bildaufbau-standpunkt.html',
  'blog-belichtungsreihe-auto-fotografieren.html',
  'blog-carbon-am-auto-fotografieren.html',
  'blog-chrom-am-auto-fotografieren.html',
  'blog-dateiformate-fahrzeugfotografie-raw-jpeg-tiff.html',
  'blog-dauerlicht-autofotografie.html',
  'blog-fahrzeug-lichtsignatur-fotografieren.html',
  'blog-fahrzeugfotos-fuer-broschueren-und-kataloge-planen.html',
  'blog-fahrzeugfotos-onlinewerbung-planen.html',
  'blog-fahrzeugfotos-youtube-thumbnail.html',
  'blog-fahrzeugkonfigurator-fotos-planen.html',
  'blog-focus-stacking-auto.html',
  'blog-gps-daten-aus-autofotos-entfernen.html',
  'blog-herstellerbilder-oder-eigene-fahrzeugfotos.html',
  'blog-high-key-low-key-autofotografie.html',
  'blog-iptc-metadaten-fahrzeugfotos-urheberrechte.html',
  'blog-c2pa-content-credentials-fahrzeugfotos.html',
  'blog-landschaftsfotograf-finden-auftrag-auswahl.html',
  'blog-landschaftsfotografie-bedeckter-himmel.html',
  'blog-landschaftsfotografie-goldene-stunde.html',
  'blog-landschaftspanorama-fotografieren.html',
  'blog-brennweite-landschaftsfotografie.html',
  'blog-vordergrund-landschaftsfotografie-bildtiefe.html',
  'blog-nebel-landschaft-fotografieren.html',
  'blog-landschaftsfotos-bearbeiten.html',
  'blog-autofotobuch-gestalten-fahrzeugserie.html',
  'blog-auto-fotokalender-gestalten.html',
  'blog-led-banding-autohaus-hallenlicht.html',
  'blog-led-banding-auto-scheinwerfer-fotografieren.html',
  'blog-lichtstreifen-autolack-softboxen-positionieren.html',
  'blog-metalliclack-am-auto-fotografieren.html',
  'blog-moire-autofotos-vermeiden.html',
  'blog-motorrad-hintergrund-unscharf-fotografieren.html',
  'blog-motorrad-mit-fahrer-fotografieren.html',
  'blog-motorrad-mit-smartphone-fotografieren.html',
  'blog-motorradfotograf-finden.html',
  'blog-oldtimer-innenraum-fotografieren.html',
  'blog-oldtimer-motorraum-fotografieren.html',
  'blog-panorama-autofotografie-fahrzeug.html',
  'blog-portraitfotograf-finden.html',
  'blog-rolling-shutter-rolling-shots-auto.html',
  'blog-rotes-auto-fotografieren-farbtreue.html',
  'blog-schwarz-weiss-autofotografie-karosserieform.html',
  'blog-schwarze-flags-autofotografie.html',
  'blog-sportwagenfotograf-finden.html',
  'blog-suv-fotografieren-proportionen.html',
  'blog-stativ-autofotografie.html',
  'blog-teleobjektiv-autofotografie.html',
  'blog-tethered-shooting-autofotografie.html',
  'blog-tilt-shift-autofotografie-perspektive-fokus.html',
  'blog-wasserspiegelungen-landschaftsfotografie.html',
  'blog-weitwinkel-autofotografie-perspektive.html',
  'blog-zwei-autos-zusammen-fotografieren.html',
  'blog-auto-am-wasser-fotografieren.html',
  'blog-autoankauf-fotos-fernbewertung.html',
  'blog-custom-bike-details-fotografieren.html',
  'blog-fahrzeugfotos-fuer-webseiten-optimieren.html',
  'blog-firmenwagenflotte-geschaeftsbericht-fotografieren.html',
  'blog-inzahlungnahme-fahrzeugzustand-fotografieren.html',
  'blog-motorrad-reisefotografie-tour-bildserie.html',
  'blog-motorradhelm-visier-reflexe-fotografieren.html',
  'blog-fahrzeugfotos-mobile-de-autoscout24-aufbereiten.html',
  'blog-fahrzeugfotos-im-inserat-aktualisieren.html',
  'blog-fahrzeugfotos-google-vehicle-ads.html',
  'blog-autohaus-googleprofil-fotos.html',
  'blog-autoshooting-genehmigungen-location.html',
  'blog-mietwagen-bei-uebergabe-fotografieren.html',
  'blog-auspuff-endrohr-auto-fotografieren.html',
  'blog-fahrzeugvarianten-fotografisch-unterscheiden.html',
  'blog-im-automuseum-fotografieren.html',
  'blog-oldtimer-originallack-dokumentieren.html',
  'blog-oldtimer-fotos-fiva-id-card.html',
  'blog-oldtimer-versicherung-fotos.html',
  'blog-oldtimer-inseratsfotos-pruefen.html',
  'blog-saisonale-fahrzeugfotos-planen.html',
  'blog-vorserienfahrzeuge-fotografieren-geheimhaltung-embargo.html',
  'blog-motorrad-fuer-magazin-fotografieren-lassen.html',
  'blog-schwarzes-motorrad-draussen-fotografieren.html',
  'blog-auto-fuer-photogrammetrie-fotografieren.html',
  'blog-abstandsquadratgesetz-fotografie-lichtabfall.html',
  'blog-autofotografie-buecher-empfehlungen.html',
  'blog-belichtungsmesser-histogramm-testbild-fotografie.html',
  'blog-bildband-oder-fotografie-lehrbuch.html',
  'blog-blitzsynchronzeit-hss-high-speed-sync.html',
  'blog-die-kunst-der-fotografie-bruce-barnbaum-review.html',
  'blog-figur-grund-fotografie.html',
  'blog-fotografie-buecher-bildgestaltung.html',
  'blog-fotografie-buecher-empfehlungen.html',
  'blog-fotografie-buecher-licht.html',
  'blog-gerichtetes-diffuses-licht-fotografie.html',
  'blog-geschichte-der-fotografie-camera-obscura-bis-instagram.html',
  'blog-geschichte-digitale-fotografie-ccd-smartphone.html',
  'blog-hartes-weiches-licht-fotografie.html',
  'blog-lichtdiagramm-fotografie-setup-planen.html',
  'blog-light-science-magic-buchreview.html',
  'blog-lightroom-kontaktbogen-fotos-auswaehlen.html',
  'blog-linien-und-formen-fotografie.html',
  'blog-mischlicht-fotografieren-farbtemperatur-kontrollieren.html',
  'blog-negativraum-fotografie-bildgestaltung.html',
  'blog-polfilter-fotografie-funktion-anwendung.html',
  'blog-produktfotografie-buecher.html',
  'blog-schaerfentiefe-fotografie-gestaltung.html',
  'blog-the-photographers-eye-michael-freeman-review.html',
  'blog-the-photographers-mind-michael-freeman-review.html',
  'blog-understanding-exposure-bryan-peterson-review.html',
  'blog-wiederholung-rhythmus-fotografie.html',
  'experimental-lens.html',
  'floating-archive.html',
  'narrative-stage.html',
  'radikale-fotografie-portfolio-konzepte.html',
] as const

export type AdoptedLegacyFile = (typeof adoptedLegacyFiles)[number]

const adoptedLegacyFileSet = new Set<string>(adoptedLegacyFiles)

export const legacyRedirectTargets = {
  'automobil-fotografie-deutschland.html': 'automobil-fotografie-duesseldorf.html',
  'blog-journal.html': 'blog.html',
  'fotografie-deutschland.html': 'fotografie-duesseldorf.html',
  'fotografie-landing-experience.html': 'fotografie-duesseldorf.html',
  'index.html': '',
  'landschaftsfotografie-deutschland.html': 'landschaftsfotografie-duesseldorf.html',
  'matthias-ramahi-portfolio.html': 'portfolio.html',
  'motorrad-fotografie-deutschland.html': 'motorrad-fotografie-duesseldorf.html',
  'oldtimer-fotografie-deutschland.html': 'oldtimer-fotografie-duesseldorf.html',
  'portfolio-1-tunnel.html': 'portfolio.html',
  'portraitfotografie-deutschland.html': 'portraitfotografie-duesseldorf.html',
  'portraitfotografie-experience.html': 'portraitfotografie-duesseldorf.html',
  'sportwagen-fotografie-deutschland.html': 'sportwagen-fotografie-duesseldorf.html',
  'weitere-dienstleistungen.html': 'leistungen.html',
} as const

export type LegacyRedirectFile = keyof typeof legacyRedirectTargets

export const legacyPathRedirectTargets = {
  about: 'ueber-mich.html',
  'action-fotografie/motorrad-fotografie-mit-actioncams-und-gopros-leicht-gemacht': 'blog-actioncam-motorrad.html',
  'autofotografie': 'autofotografie.html',
  'autofotografie/autofotografie-duesseldorf': 'autofotografie-duesseldorf.html',
  'autofotografie/automobilfotografie-im-regen': 'blog-automobilfotografie-im-regen.html',
  'autofotografie/autohaus-fotografie-ohne-blitzpark-perfektes-showroomlicht': 'blog-autohaus-showroomlicht.html',
  'autofotografie/bts-auto-shoot-in-dortmund-mit-matthias-ramahi-fesselnd': 'automobil-fotografie-dortmund.html',
  'autofotografie/farbharmonie-mit-sportwagen-perfekte-komplementaere-folien':
    'blog-farbharmonie-fahrzeugfotografie.html',
  'autofotografie/fahrzeugfotografie-portfolio-erfolgreich-aufbauen': 'blog-serie-kuratieren.html',
  'autofotografie/fotografie-motorrad': 'motorrad-fotografie.html',
  'autofotografie/lightpainting-porsche-perfekt-und-sicher-umsetzen': 'blog-lightpainting-fahrzeuge.html',
  'autofotografie/luxusauto-fotografie': 'sportwagen-fotografie.html',
  'autofotografie/marken-storytelling-fuer-autokunden-mit-serien-die-verkaufen':
    'blog-automotive-markenstorytelling.html',
  'autofotografie/motorsport-fotografie': 'motorsport-fotografie.html',
  'autofotografie/offroad-fotografie': 'autofotografie.html',
  'autofotografie/oldtimer-professionell-fotografieren': 'oldtimer-fotografie.html',
  'autofotografie/sportwagen-detailpflege-30-minuten-checkliste-glanz-pur':
    'blog-sportwagen-vorbereitung.html',
  'autofotografie-bochum': 'automobil-fotografie-bochum.html',
  'autofotografie-dortmund': 'automobil-fotografie-dortmund.html',
  'autofotografie-duisburg': 'automobil-fotografie-duisburg.html',
  'autofotografie-duesseldorf': 'autofotografie-duesseldorf.html',
  'autofotografie-essen': 'automobil-fotografie-essen.html',
  'autofotografie-guide': 'autofotografie.html',
  'autofotografie-wuppertal': 'automobil-fotografie-wuppertal.html',
  'auto-fotograf-duesseldorf': 'autofotografie-duesseldorf.html',
  'automobilfotografie-im-regen': 'blog-automobilfotografie-im-regen.html',
  'automobilfotografie/automobilfotografie-im-regen': 'blog-automobilfotografie-im-regen.html',
  'bilder-mit-autos-fotograf-fuer-automobil-fotografie': 'bilder-mit-auto.html',
  'bildkomposition-fuer-portraits': 'portraitfotografie.html',
  'bildkomposition-gestaltung/bildkomposition-fuer-portraits': 'portraitfotografie.html',
  'business-portrait': 'business-portrait-duesseldorf.html',
  'charakterportrait-fotograf-duesseldorf': 'portraitfotografie-duesseldorf.html',
  'contact-us': 'contact.html',
  datenschutzerklaerung: 'datenschutz.html',
  'fahrzeugfotografie-duesseldorf': 'fahrzeugfotografie-duesseldorf.html',
  'fine-art-portraets-fotografie': 'portraitfotografie.html',
  'fotografie': 'fotografie.html',
  'fotografie-mann': 'fotoshooting-maenner.html',
  'fotograf-erkrath': 'fotografie-erkrath.html',
  'fotografie-matthias-ramahi': 'ueber-mich.html',
  'fotografie-motorrad': 'motorrad-fotografie.html',
  'fotografie-musiker': 'musikerfotografie.html',
  'fotoshooting-motorrad-wuppertal': 'motorrad-fotografie-wuppertal.html',
  'fotoshooting-mit-motorrad-duisburg-urbane-kulisse-industrielle-seele-echte-emotion':
    'motorrad-fotografie-duisburg.html',
  'front-page': '',
  'grundlagen-der-fotografie/portraetfotografie-mit-natuerlichem-licht': 'blog-portraits-offener-schatten.html',
  'gruppen-fotografie': 'portraitfotografie.html',
  'grossformatdruck-duesseldorf': 'grossformatdruck-duesseldorf.html',
  'grundlagen-der-fotografie/lichtformer-fuer-portraitfotografie': 'blog-lichtformer-portraitfotografie.html',
  'gutschein-fotoshooting': 'fotoshooting-gutschein.html',
  impressum: 'impressum.html',
  artikel: 'blog.html',
  'kompositionstechniken-fuer-fortgeschrittene-fotografie': 'portraitfotografie.html',
  kontakt: 'contact.html',
  'kreative-schattenfotografie-tipps-guide': 'blog-low-key-high-key-portraits.html',
  'low-key-fotografie-beleuchtung-und-high-key-fotografie': 'blog-low-key-high-key-portraits.html',
  'luxusauto-fotografie/luxusauto-fotografie': 'sportwagen-fotografie.html',
  'moody-portrait-fotografie': 'blog-low-key-high-key-portraits.html',
  'motorrad-fotografie': 'motorrad-fotografie.html',
  'motorrad-fotograf-dortmund': 'motorrad-fotografie-dortmund.html',
  'motorrad-fotografie-mit-actioncams-und-gopros-leicht-gemacht': 'blog-actioncam-motorrad.html',
  'motorrad-fotografie-rechtliche-aspekte': 'motorrad-fotografie.html',
  'motorrad-fotografie/motorrad-fotoshooting': 'motorrad-fotografie.html',
  'motorrad-fotografie/sicherheit-beim-motorrad-fotoshooting-alles-was-fotografen-beachten-muessen': 'blog-motorrad-fotoshooting-sicherheit.html',
  'motorrad-fotoshooting': 'motorrad-fotografie.html',
  'motorrad-fotoshooting-bochum': 'motorrad-fotografie-bochum.html',
  'motorrad-fotoshooting-essen': 'motorrad-fotografie-essen.html',
  'motorrad-fotoshooting-koeln': 'motorrad-fotografie-koeln.html',
  'motorradfotografie': 'motorrad-fotografie.html',
  'motorradfotografie/7-geniale-farblooks-und-bildstile-in-der-motorrad-fotografie': 'motorrad-fotografie.html',
  'motorradfotografie/custom-build-bike': 'custom-bike-fotografie.html',
  'motorradfotografie/extreme-perspektiven-motorrad-fotografie': 'blog-motorradfotografie-linien.html',
  'motorradfotografie/fotografie-motorrad': 'motorrad-fotografie.html',
  'motorradfotografie/geheime-motorrad-fotolocations-im-bergischen-mit-google-maps': 'motorrad-fotografie.html',
  'motorradfotografie/kommerzielle-motorrad-fotografie': 'motorrad-fotografie.html',
  'motorradfotografie/low-light-motorrad-fotografie': 'blog-motorrad-nachts-fotografieren.html',
  'motorradfotografie/motorrad-eventfotografie': 'blog-motorrad-eventfotografie.html',
  'motorradfotografie/motorrad-fahrer-fotografie': 'biker-portrait-duesseldorf.html',
  'motorradfotografie/motorrad-fotografie-checkliste': 'blog-motorrad-fotoshooting-checkliste.html',
  'motorradfotografie/motorrad-fotografie-mit-gopros': 'blog-actioncam-motorrad.html',
  'motorradfotografie/motorrad-fotografie-rechtliche-aspekte': 'motorrad-fotografie.html',
  'motorradfotografie/motorrad-fotografie-smartphone': 'blog-motorrad-mit-smartphone-fotografieren.html',
  'motorradfotografie/motorrad-fotografie-tipps': 'blog-motorrad-fotoshooting-checkliste.html',
  'motorradfotografie/motorrad-fotografie-trends-2025': 'motorrad-fotografie.html',
  'motorradfotografie/motorrad-fotoshooting': 'motorrad-shooting-duesseldorf.html',
  'motorradfotografie/offroad-fotografie-outdoor': 'motorrad-fotografie.html',
  'motorradfotografie/regenfotografie-tipps': 'blog-motorradfotografie-im-regen.html',
  'motorradfotografie/rennstrecke-und-trackday': 'motorsport-fotografie.html',
  'motorradfotografie/rolling-shots-bike-fotografie': 'blog-rolling-shots-motorrad.html',
  'motorradfotografie/sicherheit-motorrad-fotoshooting': 'blog-motorrad-fotoshooting-sicherheit.html',
  'motorradfotografie/studiofotografie-motorraeder': 'blog-motorrad-studiofotografie.html',
  'motorradfotografie/werkstatt-fotografie': 'blog-motorrad-studiofotografie.html',
  'motorradfotografie-guide': 'motorrad-fotografie.html',
  'motorradfotografie/wetter-und-jahreszeiten-motorrad-fotografie': 'blog-motorradfotografie-im-regen.html',
  'musiker-fotografie': 'musikerfotografie.html',
  'offroad-fotografie': 'autofotografie.html',
  'offroad-fotografie/offroad-fotografie': 'autofotografie.html',
  'oldtimer-fotografie': 'oldtimer-fotografie.html',
  'oldtimer-professionell-fotografieren': 'oldtimer-fotografie.html',
  'oldtimerfotograf-dortmund': 'oldtimer-fotografie-dortmund.html',
  oldtimerfotografie: 'oldtimer-fotografie.html',
  'oldtimerfotografie-wuppertal-klassische-eleganz-einzigartige-aufnahmen-bei-oldtimertreffen-und-classic-days':
    'oldtimer-fotografie-wuppertal.html',
  'oldtimerfotografie/classic-days-leise-dokumentieren-mit-herz-und-respekt': 'blog-oldtimer-veranstaltungen.html',
  'oldtimerfotografie/oldtimer-professionell-fotografieren': 'oldtimer-fotografie.html',
  'oldtimerfotografie/oldtimer-vorbereiten-makellos-fuer-perfekte-detailfotos': 'oldtimer-verkaufsfotos-duesseldorf.html',
  'oldtimerfotografie/youngtimer-vs-oldtimer-bilder-voller-zeitgeist-70er-90er': 'youngtimer-fotografie.html',
  'oldtimerfotografie-guide': 'oldtimer-fotografie.html',
  'outdoor-portrait-fotografie': 'blog-portraits-offener-schatten.html',
  'outdoor-portraitfotografie': 'portraitfotografie.html',
  'portfolio-dating': 'dating-fotoshooting.html',
  'portfolio_category/architecture': 'portfolio.html',
  'portraetfotografie-mit-natuerlichem-licht': 'blog-portraits-offener-schatten.html',
  'portrait-fotografie': 'portraitfotografie.html',
  'portrait-im-chateau': 'portraitfotografie.html',
  'portrait-von-frauen': 'portraitfotografie.html',
  'portrait-von-frauen-fotografie-fuer-frauen': 'portraitfotografie.html',
  'portrait/charakterportrait-fotograf-duesseldorf': 'portraitfotografie-duesseldorf.html',
  'portraitfotograf-duesseldorf': 'portraitfotografie-duesseldorf.html',
  'portraitfotografie-hub': 'portraitfotografie.html',
  'portraitfotografie/bandshootings-im-ruhrgebiet-episch-urban-zu-leeren-plaetzen': 'blog-musiker-portraits.html',
  'portraitfotografie/bildkomposition-fuer-portraits': 'portraitfotografie.html',
  'portraitfotografie/businessportraits-draussen-in-duesseldorf-im-besten-licht': 'blog-businessportraits-draussen.html',
  'portraitfotografie/charakterportrait-fotograf-duesseldorf': 'portraitfotografie-duesseldorf.html',
  'portraitfotografie/farbtheorie-in-der-fotografie': 'blog-farbtheorie-fotografie.html',
  'portraitfotografie/fuehrungslinien-meistern-fuer-kraftvolle-bildkomposition': 'portraitfotografie.html',
  'portraitfotografie/kompositionstechniken-fuer-fortgeschrittene-fotografie': 'portraitfotografie.html',
  'portraitfotografie/kreative-schattenfotografie-tipps-guide': 'blog-low-key-high-key-portraits.html',
  'portraitfotografie/lichtformer-fuer-portraitfotografie': 'blog-lichtformer-portraitfotografie.html',
  'portraitfotografie/location-scouting-in-duesseldorf-sichere-top-checkliste':
    'blog-location-scouting-duesseldorf.html',
  'portraitfotografie/low-key-fotografie-beleuchtung-und-high-key-fotografie': 'blog-low-key-high-key-portraits.html',
  'portraitfotografie/mikrogesten-und-haende-im-charakterportraet-fuer-mehr-wirkung':
    'blog-portraits-ohne-generische-posen.html',
  'portraitfotografie/moody-portrait-fotografie': 'blog-low-key-high-key-portraits.html',
  'portraitfotografie/moody-portrait-look-mit-flat-profile-sanft-unterbelichtet': 'blog-low-key-high-key-portraits.html',
  'portraitfotografie/musiker-fotos-perfekter-look-fine-art-vs-documentary': 'blog-musiker-portraits.html',
  'portraitfotografie/musikerportraits-on-location-authentisch-und-atmosphaerisch': 'blog-musiker-portraits.html',
  'portraitfotografie/natuerliche-portraits-im-offenen-schatten-perfekte-hauttoene':
    'blog-portraits-offener-schatten.html',
  'portraitfotografie/outdoor-shootings-wetterstrategien-fuer-magische-looks':
    'blog-portraitshooting-wetter.html',
  'portraitfotografie/portraetfotografie-mit-natuerlichem-licht': 'blog-portraits-offener-schatten.html',
  'portraitfotografie/retro-looks-in-der-digitalen-fotografie': 'vintage-fotoshooting.html',
  'portraitfotografie/schwarz-weiss-fotografie-lichtsetzung': 'blog-schwarz-weiss-portrait-licht.html',
  'portraitfotografie/schwarz-weiss-portraitfotografie': 'schwarz-weiss-portrait-fotografie.html',
  'portraitfotografie/sieben-sichere-grundposen-fuer-alle-koerpertypen-begeistern':
    'blog-portraits-ohne-generische-posen.html',
  'portraitfotografie-guide': 'portraitfotografie.html',
  portratifotografie: 'portraitfotografie.html',
  'oldtimer-koeln': 'oldtimer-fotografie-koeln.html',
  project: 'portfolio.html',
  projects: 'portfolio.html',
  'retro-looks-in-der-digitalen-fotografie': 'vintage-fotoshooting.html',
  'schwarz-weiss-fotografie-lichtsetzung': 'blog-schwarz-weiss-portrait-licht.html',
  'schwarz-weiss-portraitfotografie': 'schwarz-weiss-portrait-fotografie.html',
  'sicherheit-beim-motorrad-fotoshooting-alles-was-fotografen-beachten-muessen': 'blog-motorrad-fotoshooting-sicherheit.html',
  'tinder-fotograf': 'dating-fotoshooting.html',
  'uncategorized/extreme-perspektiven-motorrad-fotografie': 'blog-motorradfotografie-linien.html',
  'uncategorized/portrait-fotografie-beleuchtung': 'blog-lichtformer-portraitfotografie.html',
  'uncategorized/wetter-und-jahreszeiten-motorrad-fotografie': 'blog-motorradfotografie-im-regen.html',
  'viola-bratschenmusik-duesseldorf': 'viola-musik-duesseldorf.html',
  'vintage-portraets-fotografie': 'vintage-fotoshooting.html',
  'vintage-portraets-fotografie-in-duesseldorf-matthias-ramahi': 'vintage-fotoshooting.html',
  'webdesign-seo-duesseldorf': 'webdesign-seo-duesseldorf.html',
  'werbetechnik-duesseldorf': 'werbetechnik-duesseldorf.html',
  'weitere-dienstleistungen': 'leistungen.html',
} as const

export type LegacyPathRedirect = keyof typeof legacyPathRedirectTargets

const legacyGonePathPrefixes = [
  'author/',
  'category/',
  'portfolio-category/',
  'portfolio-item/',
  'product-category/',
  'shop-2',
  'shop-sidebar',
  'tag/',
  'wp-',
  'wp-content/',
] as const

const legacyGonePaths = new Set([
  'agb',
  'cookie-richtlinie-eu',
  'echtheit-von-bewertungen',
  'how-it-works',
  'kasse',
  'live-fotograf',
  'rechtliches',
  'stills',
  'versandarten',
  'widerrufsbelehrung',
])

const legacyRedirectFileSet = new Set<string>(Object.keys(legacyRedirectTargets))

const extensionlessHtmlAliases: Record<string, string> = {
  about: 'ueber-mich.html',
  blog: 'blog.html',
  contact: 'contact.html',
  fotografie: 'fotografie.html',
  journal: 'blog.html',
  kontakt: 'contact.html',
  leistungen: 'leistungen.html',
  portfolio: 'portfolio.html',
  services: 'leistungen.html',
  'ueber-mich': 'ueber-mich.html',
}

const fullScopeLocalSeoPrefixes = [
  'automobil-fotografie',
  'sportwagen-fotografie',
  'oldtimer-fotografie',
  'motorrad-fotografie',
  'portraitfotografie',
  'landschaftsfotografie',
] as const

const duesseldorfScopedKeywordPrefixes = [
  'auto-fotoshooting',
  'auto-fotografieren-tipps',
  'autofotografie',
  'autohaus-fotografie',
  'automotive-fotografie',
  'autoverkauf-fotos',
  'fahrzeugfotografie',
  'bilder-mit-auto',
  'bike-fotografie',
  'biker-portrait',
  'business-portrait',
  'classic-car-fotografie',
  'custom-bike-fotografie',
  'dating-fotoshooting',
  'exotic-car-fotografie',
  'fotoshooting-gutschein',
  'fotoshooting-mit-auto',
  'fotoshooting-preise',
  'headshot-fotograf',
  'motorsport-fotografie',
  'motorsport-sportwagen-fotografie',
  'motorrad-shooting',
  'motorrad-verkaufsfotos',
  'oldtimer-shooting',
  'oldtimer-verkaufsfotos',
  'paarshooting-familienshooting',
  'performance-car-fotografie',
  'personal-branding-fotografie',
  'portrait-fotoshooting',
  'portraitfotografie-beleuchtung',
  'pressefoto',
  'sammlerfahrzeug-fotografie',
  'schwarz-weiss-portrait-fotografie',
  'sportwagen-fotoshooting',
  'sportwagen-shooting',
  'supersportwagen-fotografie',
  'unternehmensportrait',
  'youngtimer-fotografie',
] as const

const standaloneKeywordFiles = [
  'auto-fotoshooting.html',
  'auto-fotografieren-tipps.html',
  'autofotografie.html',
  'autohaus-fotografie.html',
  'automotive-fotografie.html',
  'bilder-mit-auto.html',
  'bike-fotografie.html',
  'classic-car-fotografie.html',
  'custom-bike-fotografie.html',
  'dating-fotoshooting.html',
  'exotic-car-fotografie.html',
  'fahrzeugfotografie.html',
  'fine-art-prints-landschaft.html',
  'fotoshooting-gutschein.html',
  'fotoshooting-mit-auto.html',
  'fotoshooting-preise.html',
  'landschaftsbilder-kaufen.html',
  'motorsport-fotografie.html',
  'motorsport-sportwagen-fotografie.html',
  'naturfotografie-prints.html',
  'paarshooting-familienshooting.html',
  'performance-car-fotografie.html',
  'personal-branding-fotografie.html',
  'portrait-fotoshooting.html',
  'portraitfotografie-beleuchtung.html',
  'sammlerfahrzeug-fotografie.html',
  'schwarz-weiss-portrait-fotografie.html',
  'supersportwagen-fotografie.html',
  'fotoshooting-maenner.html',
  'musikerfotografie.html',
  'vintage-fotoshooting.html',
  'wandbilder-landschaftsfotografie.html',
  'youngtimer-fotografie.html',
] as const

const specialScopedKeywordFiles = ['landschaftsfotografie-print-deutschland.html'] as const

function generatedLocalSeoFiles() {
  const fullScopeFiles = fullScopeLocalSeoPrefixes.flatMap((prefix) => [
    `${prefix}.html`,
    ...localSeoCityTokens.map((scope) => `${prefix}-${scope}.html`),
  ])
  const duesseldorfFiles = duesseldorfScopedKeywordPrefixes.map((prefix) => `${prefix}-duesseldorf.html`)

  return [...fullScopeFiles, ...duesseldorfFiles, ...standaloneKeywordFiles, ...specialScopedKeywordFiles]
}

export function listNativeHtmlRouteFiles() {
  return [
    ...new Set([
      ...adoptedLegacyFiles,
      ...Object.keys(legacyRedirectTargets),
      ...generatedLocalSeoFiles(),
    ]),
  ].sort((a, b) => a.localeCompare(b))
}

const nativeHtmlRouteFileSet = new Set<string>(listNativeHtmlRouteFiles())

export function getLegacyRedirectTarget(fileName?: string | null) {
  const normalized = (fileName || '').replace(/^\/+/, '').toLowerCase()
  const target = legacyRedirectTargets[normalized as LegacyRedirectFile]
  return typeof target === 'string' ? target : null
}

export function normalizeLegacyPathRedirectPath(pathname?: string | null) {
  const withoutOrigin = decodeURIComponent(pathname || '')
    .split('?')[0]
    .split('#')[0]
    .replace(/^https?:\/\/[^/]+/i, '')

  return withoutOrigin.replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase()
}

export function getLegacyPathRedirectTarget(pathname?: string | null) {
  const normalized = normalizeLegacyPathRedirectPath(pathname)
  const explicitTarget = legacyPathRedirectTargets[normalized as LegacyPathRedirect]
  if (typeof explicitTarget === 'string') return explicitTarget

  const localSeoAliasTarget = getLocalSeoAliasRedirectTarget(normalized)
  if (localSeoAliasTarget) return localSeoAliasTarget

  return getLegacyArchiveRedirectTarget(normalized)
}

function getLocalSeoAliasRedirectTarget(normalized: string) {
  const city = localSeoCityTokens.find((token) => normalized.endsWith(`-${token}`))
  if (!city) return null

  if (normalized === `autofotografie-${city}`) {
    return city === 'duesseldorf' ? 'autofotografie-duesseldorf.html' : `automobil-fotografie-${city}.html`
  }

  if (normalized === `oldtimerfotografie-${city}`) return `oldtimer-fotografie-${city}.html`
  if (normalized === `motorrad-fotoshooting-${city}`) return `motorrad-fotografie-${city}.html`
  if (normalized === `fotoshooting-motorrad-${city}`) return `motorrad-fotografie-${city}.html`

  return null
}

function getLegacyArchiveRedirectTarget(normalized: string) {
  const archiveMatch = normalized.match(/^(?:tag|category)\/([^/]+)/)
  const archiveSlug = archiveMatch?.[1]
  if (!archiveSlug) return null

  if (/(motorrad|bike|biker)/.test(archiveSlug)) return 'motorrad-fotografie.html'
  if (/(oldtimer|youngtimer|classic|70er|80er)/.test(archiveSlug)) return 'oldtimer-fotografie.html'
  if (/(sportwagen|porsche|motorsport|performance|auto|automobil|car|lack|showroom)/.test(archiveSlug)) {
    return 'automobil-fotografie.html'
  }
  if (/(portrait|portraet|headshot|businessportrait|personal-branding|posing|model|koerpersprache|fensterlicht|low-key|high-key)/.test(archiveSlug)) {
    return 'portraitfotografie.html'
  }
  if (/(landschaft|natur|fine-art|wandbilder|prints)/.test(archiveSlug)) return 'landschaftsfotografie.html'

  return null
}

export function isLegacyGonePath(pathname?: string | null) {
  const normalized = normalizeLegacyPathRedirectPath(pathname)
  if (!normalized || getLegacyPathRedirectTarget(normalized)) return false

  if (legacyGonePaths.has(normalized)) return true

  return legacyGonePathPrefixes.some((prefix) => normalized === prefix.replace(/\/$/, '') || normalized.startsWith(prefix))
}

export function isLegacyRedirectFile(fileName?: string | null): fileName is LegacyRedirectFile {
  return Boolean(fileName && legacyRedirectFileSet.has(fileName))
}

export function normalizeHtmlRoutePath(pathname?: string | null) {
  const clean = decodeURIComponent(pathname || '')
    .split('?')[0]
    .split('#')[0]
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .toLowerCase()

  if (!clean || clean === 'index.html') return 'index.html'
  if (extensionlessHtmlAliases[clean]) return extensionlessHtmlAliases[clean]
  return clean.endsWith('.html') ? clean : `${clean}.html`
}

export function getNativeHtmlFileForPath(pathname?: string | null) {
  const fileName = normalizeHtmlRoutePath(pathname)
  return nativeHtmlRouteFileSet.has(fileName) ? fileName : null
}

export function isAdoptedLegacyFile(fileName?: string | null): fileName is AdoptedLegacyFile {
  return Boolean(fileName && adoptedLegacyFileSet.has(fileName))
}

export function isLocalSeoAdoptionCandidate(fileName?: string | null) {
  if (!fileName || !fileName.endsWith('.html') || isAdoptedLegacyFile(fileName)) return false

  const slug = fileName.replace(/\.html$/i, '')
  return localSeoPrefixes.some((prefix) => slug.startsWith(prefix))
}

export function isCmsAdoptedLegacyFile(fileName?: string | null, options: { includeLocalSeo?: boolean } = {}) {
  return isAdoptedLegacyFile(fileName) || Boolean(options.includeLocalSeo && isLocalSeoAdoptionCandidate(fileName))
}
