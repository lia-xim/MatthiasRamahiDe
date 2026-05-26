import fs from 'node:fs';

const cities = [
  ['Düsseldorf','duesseldorf'],['Köln','koeln'],['Essen','essen'],['Dortmund','dortmund'],['Duisburg','duisburg'],['Bochum','bochum'],['Wuppertal','wuppertal'],['Leverkusen','leverkusen'],['Oberhausen','oberhausen'],['Krefeld','krefeld'],['Mönchengladbach','moenchengladbach'],['Moers','moers'],['Gelsenkirchen','gelsenkirchen'],['Bergisch Gladbach','bergisch-gladbach'],['Solingen','solingen'],['Remscheid','remscheid'],['Mettmann','mettmann'],['Hilden','hilden'],['Dormagen','dormagen'],['Neuss','neuss']
];
const cats = [
  {file:'automobil-fotografie-duesseldorf.html', slug:'automobil-fotografie', title:'Automobil Fotografie', keywords:[['Automotive Fotografie','automotive-fotografie-duesseldorf.html'],['Autofotografie','autofotografie-duesseldorf.html'],['Fahrzeugfotografie','fahrzeugfotografie-duesseldorf.html'],['Autohaus Fotografie','autohaus-fotografie-duesseldorf.html'],['Autoverkauf Fotos','autoverkauf-fotos-duesseldorf.html']]},
  {file:'sportwagen-fotografie-duesseldorf.html', slug:'sportwagen-fotografie', title:'Sportwagen Fotografie', keywords:[['Sportwagen Shooting','sportwagen-shooting-duesseldorf.html'],['Sportwagen Fotoshooting','sportwagen-fotoshooting-duesseldorf.html'],['Performance Car Fotografie','performance-car-fotografie-duesseldorf.html'],['Exotic Car Fotografie','exotic-car-fotografie-duesseldorf.html'],['Supersportwagen Fotografie','supersportwagen-fotografie-duesseldorf.html']]},
  {file:'oldtimer-fotografie-duesseldorf.html', slug:'oldtimer-fotografie', title:'Oldtimer Fotografie', keywords:[['Classic Car Fotografie','classic-car-fotografie-duesseldorf.html'],['Oldtimer Shooting','oldtimer-shooting-duesseldorf.html'],['Youngtimer Fotografie','youngtimer-fotografie-duesseldorf.html'],['Sammlerfahrzeug Fotografie','sammlerfahrzeug-fotografie-duesseldorf.html'],['Oldtimer Verkaufsfotos','oldtimer-verkaufsfotos-duesseldorf.html']]},
  {file:'motorrad-fotografie-duesseldorf.html', slug:'motorrad-fotografie', title:'Motorrad Fotografie', keywords:[['Motorrad Shooting','motorrad-shooting-duesseldorf.html'],['Bike Fotografie','bike-fotografie-duesseldorf.html'],['Custom Bike Fotografie','custom-bike-fotografie-duesseldorf.html'],['Motorrad Verkaufsfotos','motorrad-verkaufsfotos-duesseldorf.html'],['Biker Portrait','biker-portrait-duesseldorf.html']]},
  {file:'portraitfotografie-duesseldorf.html', slug:'portraitfotografie', title:'Portrait Fotografie', keywords:[['Business Portrait','business-portrait-duesseldorf.html'],['Headshot Fotograf','headshot-fotograf-duesseldorf.html'],['Personal Branding Fotografie','personal-branding-fotografie-duesseldorf.html'],['Unternehmensportrait','unternehmensportrait-duesseldorf.html'],['Pressefoto','pressefoto-duesseldorf.html']]},
  {file:'landschaftsfotografie-duesseldorf.html', slug:'landschaftsfotografie', title:'Landschaftsfotografie', keywords:[['Landschaftsbilder kaufen','landschaftsbilder-kaufen.html'],['Fine Art Prints Landschaft','fine-art-prints-landschaft.html'],['Wandbilder Landschaftsfotografie','wandbilder-landschaftsfotografie.html'],['Naturfotografie Prints','naturfotografie-prints.html'],['Landschaftsfotografie Print Deutschland','landschaftsfotografie-print-deutschland.html']]}
];
function cityHref(slug, citySlug, parent){ return citySlug === 'duesseldorf' ? parent : `${slug}-${citySlug}.html`; }
function cityGrid(cat){
  const links = cities.map(([name,city]) => `        <a class="mr-cities__cell" href="${cityHref(cat.slug,city,cat.file)}">${name}</a>`).join('\n');
  return `<nav class="mr-cities__grid" aria-label="Städte">\n${links}\n        <a class="mr-cities__cell" href="${cat.slug}-nrw.html">NRW</a>\n        <a class="mr-cities__cell" href="${cat.slug}-deutschland.html">Deutschland</a>\n      </nav>`;
}
function keywordSection(cat){
  const links = cat.keywords.map(([name,href]) => `        <a class="mr-cities__cell" href="${href}">${name}</a>`).join('\n');
  return `\n\n  <section class="mr-cities" data-header-theme="light" data-theme="light" aria-label="${cat.title} Suchbegriffe">\n    <div class="mr-cities__inner">\n      <div class="mr-cities__head">\n        <h2>${cat.title} <em>Suchbegriffe.</em></h2>\n      </div>\n      <nav class="mr-cities__grid" aria-label="Suchvarianten">\n${links}\n      </nav>\n    </div>\n  </section>`;
}
for (const cat of cats) {
  let s = fs.readFileSync(cat.file, 'utf8');
  s = s.replace(/<nav class="mr-cities__grid" aria-label="Städte">[\s\S]*?<\/nav>/, cityGrid(cat));
  if (!s.includes(`aria-label="${cat.title} Suchbegriffe"`)) {
    s = s.replace(/(\n\s*<section\s+id="anfrage")/, keywordSection(cat) + '$1');
  }
  // Add data-theme where the shared header probe expects it, without disturbing existing data-header-theme.
  s = s.replace(/<section class="mr-cities" data-header-theme="light"(?![^>]*data-theme)/g, '<section class="mr-cities" data-header-theme="light" data-theme="light"');
  fs.writeFileSync(cat.file, s, 'utf8');
}
console.log(JSON.stringify({updated: cats.map(c=>c.file)}, null, 2));
