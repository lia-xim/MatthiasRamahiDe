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
      image('/assets/optimized/assets-photos-automobil-neon-960.webp', 'Automobil'),
      image('/assets/optimized/assets-photos-automobil-sunset-960.webp', 'Automobil'),
      image('/assets/portfolio/thumbs/_DSC3032_genErase (1).webp', 'Automobil'),
      image('/assets/portfolio/thumbs/_DSC3892.webp', 'Automobil'),
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
      image('/assets/optimized/assets-photos-automobil-sunset-960.webp', 'Sportwagen'),
      image('/assets/portfolio/thumbs/_DSC3032_genErase (2).webp', 'Sportwagen'),
      image('/assets/portfolio/thumbs/_DSC3982.webp', 'Sportwagen'),
      image('/assets/portfolio/thumbs/_DSC3879.webp', 'Sportwagen'),
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
      image('/assets/optimized/assets-photos-oldtimer-stage-960.webp', 'Oldtimer'),
      image('/assets/portfolio/thumbs/_DSC3892.webp', 'Oldtimer'),
      image('/assets/portfolio/thumbs/_DSC2986.webp', 'Oldtimer'),
      image('/assets/portfolio/thumbs/_DSC3032_genErase (1).webp', 'Oldtimer'),
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
      image('/assets/optimized/assets-photos-motorrad-720.webp', 'Motorrad'),
      image('/assets/optimized/assets-photos-motorrad-duke-720.webp', 'Motorrad'),
      image('/assets/optimized/assets-photos-motorrad-ninja-road-720.webp', 'Motorrad'),
      image('/assets/optimized/assets-photos-motorrad-ninja-road-720.webp', 'Motorrad'),
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
      image('/assets/portfolio/thumbs/20250327-DSC01550.webp', 'Portrait'),
      image('/assets/portfolio/thumbs/_DSC2310.webp', 'Portrait'),
      image('/assets/portfolio/thumbs/_DSC2744.webp', 'Portrait'),
      image('/assets/portfolio/thumbs/_DSC3908.webp', 'Portrait'),
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
      image('/assets/optimized/assets-photos-landschaft-720.webp', 'Landschaft'),
      image('/assets/portfolio/thumbs/20250605-DSC03756.webp', 'Landschaft'),
      image('/assets/portfolio/thumbs/20250605-DSC03978.webp', 'Landschaft'),
      image('/assets/portfolio/thumbs/Wettberwerb_Foto5_Wunder_der_Natur2.webp', 'Landschaft'),
    ],
    seo: {
      title: 'Portfolio-Auswahl Landschaft',
      description:
        'Portfolio-Auswahl Landschaft: kuratierte Landschaftsbilder mit Ruhe, Raum, Licht und Print-Potential von Matthias Ramahi in NRW.',
    },
  },
]
