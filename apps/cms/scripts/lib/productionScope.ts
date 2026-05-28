export type ProductionCollectionSlug =
  | 'site-pages'
  | 'service-pages'
  | 'journal-posts'
  | 'local-seo-pages'
  | 'portfolio-projects'
  | 'portfolio-categories'

export type ProductionPageScope = {
  collection: ProductionCollectionSlug
  slug: string
  sourceFile: string
  label: string
}

export const reviewedMigrationStatuses = ['reviewed', 'componentized', 'live'] as const

export const adoptedProductionPages: ProductionPageScope[] = [
  { collection: 'site-pages', slug: 'home', sourceFile: 'index.html', label: 'Startseite' },
  { collection: 'site-pages', slug: 'fotografie', sourceFile: 'fotografie.html', label: 'Fotografie-Uebersicht' },
  { collection: 'service-pages', slug: 'automobil-fotografie', sourceFile: 'automobil-fotografie.html', label: 'Automobil' },
  { collection: 'service-pages', slug: 'sportwagen-fotografie', sourceFile: 'sportwagen-fotografie.html', label: 'Sportwagen' },
  { collection: 'service-pages', slug: 'oldtimer-fotografie', sourceFile: 'oldtimer-fotografie.html', label: 'Oldtimer' },
  { collection: 'service-pages', slug: 'motorrad-fotografie', sourceFile: 'motorrad-fotografie.html', label: 'Motorrad' },
  { collection: 'service-pages', slug: 'portraitfotografie', sourceFile: 'portraitfotografie.html', label: 'Portrait' },
  { collection: 'service-pages', slug: 'landschaftsfotografie', sourceFile: 'landschaftsfotografie.html', label: 'Landschaft' },
  { collection: 'site-pages', slug: 'portfolio', sourceFile: 'portfolio.html', label: 'Portfolio-Uebersicht' },
  { collection: 'site-pages', slug: 'leistungen', sourceFile: 'leistungen.html', label: 'Leistungsuebersicht' },
  { collection: 'site-pages', slug: 'contact', sourceFile: 'contact.html', label: 'Kontakt' },
  { collection: 'site-pages', slug: 'ueber-mich', sourceFile: 'ueber-mich.html', label: 'Ueber mich' },
  { collection: 'site-pages', slug: 'blog', sourceFile: 'blog.html', label: 'Journal-Uebersicht' },
  { collection: 'site-pages', slug: 'impressum', sourceFile: 'impressum.html', label: 'Impressum' },
  { collection: 'site-pages', slug: 'datenschutz', sourceFile: 'datenschutz.html', label: 'Datenschutz' },
  { collection: 'service-pages', slug: 'fotolabor-druck-duesseldorf', sourceFile: 'fotolabor-druck-duesseldorf.html', label: 'Fotolabor & Druck' },
  { collection: 'service-pages', slug: 'grossformatdruck-duesseldorf', sourceFile: 'grossformatdruck-duesseldorf.html', label: 'Grossformatdruck' },
  { collection: 'service-pages', slug: 'werbetechnik-duesseldorf', sourceFile: 'werbetechnik-duesseldorf.html', label: 'Werbetechnik' },
  { collection: 'service-pages', slug: 'webdesign-seo-duesseldorf', sourceFile: 'webdesign-seo-duesseldorf.html', label: 'Webdesign & SEO' },
  { collection: 'service-pages', slug: 'videografie-duesseldorf', sourceFile: 'videografie-duesseldorf.html', label: 'Videografie' },
  { collection: 'service-pages', slug: 'viola-musik-duesseldorf', sourceFile: 'viola-musik-duesseldorf.html', label: 'Viola Musik' },
  {
    collection: 'service-pages',
    slug: 'drucke-sonderanfertigungen-duesseldorf',
    sourceFile: 'drucke-sonderanfertigungen-duesseldorf.html',
    label: 'Drucke & Sonderanfertigungen',
  },
  {
    collection: 'journal-posts',
    slug: 'automotive-fotografie-duesseldorf',
    sourceFile: 'blog-automotive-fotografie-duesseldorf.html',
    label: 'Journal: Automotive Fotografie',
  },
  {
    collection: 'journal-posts',
    slug: 'fine-art-druck',
    sourceFile: 'blog-fine-art-druck.html',
    label: 'Journal: Fine Art Druck',
  },
  {
    collection: 'journal-posts',
    slug: 'location-scouting-duesseldorf',
    sourceFile: 'blog-location-scouting-duesseldorf.html',
    label: 'Journal: Location Scouting',
  },
  {
    collection: 'journal-posts',
    slug: 'motorradfotografie-linien',
    sourceFile: 'blog-motorradfotografie-linien.html',
    label: 'Journal: Motorradfotografie Linien',
  },
  {
    collection: 'journal-posts',
    slug: 'oldtimer-wertobjekt',
    sourceFile: 'blog-oldtimer-wertobjekt.html',
    label: 'Journal: Oldtimer Wertobjekt',
  },
  {
    collection: 'journal-posts',
    slug: 'portraits-ohne-generische-posen',
    sourceFile: 'blog-portraits-ohne-generische-posen.html',
    label: 'Journal: Portraits',
  },
  {
    collection: 'journal-posts',
    slug: 'serie-kuratieren',
    sourceFile: 'blog-serie-kuratieren.html',
    label: 'Journal: Serie kuratieren',
  },
]
