const image = (url: string, alt: string) => ({
  image: url,
  caption: alt,
  role: 'sequence',
})

export const fallbackPortfolioProjects = [
  {
    id: 'fallback-portfolio-automobil',
    title: 'Portfolio-Auswahl Automobil',
    slug: 'portfolio-auswahl-automobil',
    category: 'Automobil',
    presentationMode: 'Serie',
    excerpt: 'Kuratierte Automobilserie mit Licht, Linien, Details und ruhiger Materialwirkung.',
    coverImage: '/assets/optimized/assets-photos-automobil-neon-1920.webp',
    gallery: [
      image('/assets/optimized/assets-photos-automobil-neon-1920.webp', 'Automobil'),
      image('/assets/optimized/assets-photos-automobil-sunset-1920.webp', 'Automobil'),
      image('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Automobil'),
      image('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Automobil'),
    ],
    seo: {
      title: 'Portfolio-Auswahl Automobil',
      description:
        'Portfolio-Auswahl Automobil: kuratierte Fahrzeugbilder von Matthias Ramahi mit Licht, Linien, Details und visueller Produktion in Duesseldorf / NRW.',
    },
  },
  {
    id: 'fallback-portfolio-sportwagen',
    title: 'Portfolio-Auswahl Sportwagen',
    slug: 'portfolio-auswahl-sportwagen',
    category: 'Sportwagen',
    presentationMode: 'Serie',
    excerpt: 'Sportwagenbilder mit praeziser Silhouette, Reflexkontrolle und klarer Dramaturgie.',
    coverImage: '/assets/optimized/assets-photos-automobil-sunset-1920.webp',
    gallery: [
      image('/assets/optimized/assets-photos-automobil-sunset-1920.webp', 'Sportwagen'),
      image('/assets/optimized/assets-portfolio-dsc3032-generase-2-1920.webp', 'Sportwagen'),
      image('/assets/optimized/assets-portfolio-dsc3982-1920.webp', 'Sportwagen'),
      image('/assets/optimized/assets-portfolio-dsc3879-1920.webp', 'Sportwagen'),
    ],
    seo: {
      title: 'Portfolio-Auswahl Sportwagen',
      description:
        'Portfolio-Auswahl Sportwagen: kuratierte Bildstrecke mit Silhouette, Material, Licht und klarer visueller Dramaturgie aus Duesseldorf / NRW.',
    },
  },
  {
    id: 'fallback-portfolio-oldtimer',
    title: 'Portfolio-Auswahl Oldtimer',
    slug: 'portfolio-auswahl-oldtimer',
    category: 'Oldtimer',
    presentationMode: 'Serie',
    excerpt: 'Oldtimer und Sammlerfahrzeuge als ruhige Serie aus Material, Patina und Form.',
    coverImage: '/assets/optimized/assets-photos-oldtimer-stage-1920.webp',
    gallery: [
      image('/assets/optimized/assets-photos-oldtimer-stage-1920.webp', 'Oldtimer'),
      image('/assets/optimized/assets-portfolio-dsc3892-1920.webp', 'Oldtimer'),
      image('/assets/optimized/assets-portfolio-dsc2986-1920.webp', 'Oldtimer'),
      image('/assets/optimized/assets-portfolio-dsc3032-generase-1-1920.webp', 'Oldtimer'),
    ],
    seo: {
      title: 'Portfolio-Auswahl Oldtimer',
      description:
        'Portfolio-Auswahl Oldtimer: kuratierte Serie von Matthias Ramahi mit Patina, Material, Details und ruhiger Fahrzeugfotografie in NRW.',
    },
  },
  {
    id: 'fallback-portfolio-motorrad',
    title: 'Portfolio-Auswahl Motorrad',
    slug: 'portfolio-auswahl-motorrad',
    category: 'Motorrad',
    presentationMode: 'Serie',
    excerpt: 'Motorradserie mit Linien, Metall, Haltung und reduzierter Standortwirkung.',
    coverImage: '/assets/optimized/assets-photos-motorrad-1920.webp',
    gallery: [
      image('/assets/optimized/assets-photos-motorrad-1920.webp', 'Motorrad'),
      image('/assets/optimized/assets-photos-motorrad-duke-1920.webp', 'Motorrad'),
      image('/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp', 'Motorrad'),
      image('/assets/optimized/assets-photos-motorrad-ninja-road-1920.webp', 'Motorrad'),
    ],
    seo: {
      title: 'Portfolio-Auswahl Motorrad',
      description:
        'Portfolio-Auswahl Motorrad: Linien, Metall, Haltung und kuratierte Motorradfotografie von Matthias Ramahi in Duesseldorf / NRW.',
    },
  },
  {
    id: 'fallback-portfolio-portrait',
    title: 'Portfolio-Auswahl Portrait',
    slug: 'portfolio-auswahl-portrait',
    category: 'Portrait',
    presentationMode: 'Serie',
    excerpt: 'Portraitserie mit ruhiger Fuehrung, Licht, Naehe und professioneller Praesenz.',
    coverImage: '/assets/optimized/assets-portraits-20250327-dsc01550-1920.webp',
    gallery: [
      image('/assets/optimized/assets-portraits-20250327-dsc01550-1920.webp', 'Portrait'),
      image('/assets/optimized/assets-portraits-dsc2310-1920.webp', 'Portrait'),
      image('/assets/optimized/assets-portraits-dsc2744-1920.webp', 'Portrait'),
      image('/assets/optimized/assets-portraits-dsc3908-1920.webp', 'Portrait'),
    ],
    seo: {
      title: 'Portfolio-Auswahl Portrait',
      description:
        'Portfolio-Auswahl Portrait: ruhige Portraitserie von Matthias Ramahi mit Licht, Naehe und professioneller Praesenz in Duesseldorf / NRW.',
    },
  },
  {
    id: 'fallback-portfolio-landschaft',
    title: 'Portfolio-Auswahl Landschaft',
    slug: 'portfolio-auswahl-landschaft',
    category: 'Landschaft',
    presentationMode: 'Serie',
    excerpt: 'Landschaftsmotive als kuratierte Serie aus Ruhe, Raum, Licht und Print-Potential.',
    coverImage: '/assets/optimized/assets-photos-landschaft-1920.webp',
    gallery: [
      image('/assets/optimized/assets-photos-landschaft-1920.webp', 'Landschaft'),
      image('/assets/optimized/assets-portfolio-20250605-dsc03756-1920.webp', 'Landschaft'),
      image('/assets/optimized/assets-portfolio-20250605-dsc03978-1920.webp', 'Landschaft'),
      image('/assets/optimized/assets-portfolio-wettberwerb-foto5-wunder-der-natur2-1920.webp', 'Landschaft'),
    ],
    seo: {
      title: 'Portfolio-Auswahl Landschaft',
      description:
        'Portfolio-Auswahl Landschaft: kuratierte Landschaftsbilder mit Ruhe, Raum, Licht und Print-Potential von Matthias Ramahi in NRW.',
    },
  },
]
