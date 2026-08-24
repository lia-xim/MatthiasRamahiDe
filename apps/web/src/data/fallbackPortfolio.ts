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
    coverImage: 'https://cms.matthiasramahi.de/uploads/payload/_DSC2831%20(1).webp',
    gallery: [
      image('https://cms.matthiasramahi.de/uploads/payload/_DSC2831%20(1).webp', 'Automobil'),
      image('https://cms.matthiasramahi.de/uploads/payload/_DSC3032_genErase.webp', 'Automobil'),
      image('https://cms.matthiasramahi.de/uploads/payload/_DSC2983.webp', 'Automobil Interieur'),
      image('https://cms.matthiasramahi.de/uploads/payload/_DSC3023.webp', 'Automobil Detail'),
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
    coverImage: 'https://cms.matthiasramahi.de/uploads/payload/_DSC3982.webp',
    gallery: [
      image('https://cms.matthiasramahi.de/uploads/payload/_DSC3982.webp', 'Sportwagen'),
      image('https://cms.matthiasramahi.de/uploads/payload/_DSC3908-1.webp', 'Sportwagen Interieur'),
      image('https://cms.matthiasramahi.de/uploads/payload/_DSC3892-1.webp', 'Sportwagen Detail'),
      image('https://cms.matthiasramahi.de/uploads/payload/_DSC2345-2.webp', 'Sportwagen'),
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
    coverImage: 'https://cms.matthiasramahi.de/uploads/payload/20250418-DSC006552.webp',
    gallery: [
      image('https://cms.matthiasramahi.de/uploads/payload/20250418-DSC006552.webp', 'Oldtimer'),
      image('https://cms.matthiasramahi.de/uploads/payload/20250418-DSC00638.webp', 'Oldtimer Sammlung'),
      image('https://cms.matthiasramahi.de/uploads/payload/20250423-DSC02271.webp', 'Oldtimer Interieur'),
      image('https://cms.matthiasramahi.de/uploads/payload/20250426-DSC02651.webp', 'Oldtimer Detail'),
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
    coverImage: 'https://cms.matthiasramahi.de/uploads/payload/_DSC6968.webp',
    gallery: [
      image('https://cms.matthiasramahi.de/uploads/payload/_DSC6968.webp', 'Motorrad'),
      image('https://cms.matthiasramahi.de/uploads/payload/_DSC7026.webp', 'Motorrad'),
      image('https://cms.matthiasramahi.de/uploads/payload/_DSC6982-1.webp', 'Motorrad'),
      image('https://cms.matthiasramahi.de/uploads/payload/_DSC6979.webp', 'Motorrad Detail'),
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
    coverImage: '/assets/portraits/20260823-khan-levi-dsc8759.webp',
    gallery: [
      image('/assets/portraits/20260823-khan-levi-dsc8759.webp', 'Portrait'),
      image('/assets/portraits/20260823-khan-levi-dsc8733.webp', 'Portrait'),
      image('/assets/portraits/20260823-khan-levi-dsc8571.webp', 'Portrait'),
      image('/assets/portraits/20260823-khan-levi-dsc8557.webp', 'Portrait'),
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
