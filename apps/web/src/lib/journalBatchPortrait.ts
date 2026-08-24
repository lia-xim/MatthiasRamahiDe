import type { JournalArticle, JournalArticleSection } from './journalArticleContent'

import lichtformerDocument from '../../content/journal-posts/lichtformer-portraitfotografie.json'
import musikerDocument from '../../content/journal-posts/musiker-portraits.json'
import offenerSchattenDocument from '../../content/journal-posts/portraits-offener-schatten.json'
import schwarzWeissDocument from '../../content/journal-posts/schwarz-weiss-portrait-licht.json'
import wetterDocument from '../../content/journal-posts/portraitshooting-wetter.json'

type PortraitDocument = typeof offenerSchattenDocument

type PortraitArticleMetadata = {
  commercialHref: string
  dateLabel: string
  document: PortraitDocument
  heroImageAlt: string
  links: JournalArticle['links']
  tags: string[]
}

const toSections = (document: PortraitDocument): JournalArticleSection[] =>
  document.blocks.flatMap((block) => {
    if (block._template !== 'textBlock' || typeof block.body !== 'string') return []

    return [
      {
        id: `abschnitt-${block.eyebrow}`,
        kicker: block.eyebrow,
        title: block.headline,
        paragraphs: block.body.split('\n\n'),
      },
    ]
  })

const toFaq = (document: PortraitDocument): JournalArticle['faq'] => {
  const faqBlock = document.blocks.find((block) => block._template === 'faqBlock')
  return faqBlock?.items
}

const createArticle = ({
  commercialHref,
  dateLabel,
  document,
  heroImageAlt,
  links,
  tags,
}: PortraitArticleMetadata): JournalArticle => ({
  legacyFile: document.seo.legacyUrl,
  seoTitle: document.seo.title,
  title: document.title,
  description: document.excerpt,
  category: 'Portrait',
  categoryHref: 'portraitfotografie.html',
  commercialHref,
  tags,
  minutes: `${document.readingTime} Min`,
  dateLabel,
  dateTime: document.publishedAt.slice(0, 10),
  heroImage: document.coverImage.replace(/^\//, ''),
  heroImageAlt,
  links,
  sections: toSections(document),
  faq: toFaq(document),
})

export const portraitJournalArticles: JournalArticle[] = [
  createArticle({
    document: offenerSchattenDocument,
    dateLabel: '5. August 2026',
    heroImageAlt: 'Natürliches Männerportrait im offenen Schatten vor ruhigem urbanem Hintergrund',
    tags: ['Portrait', 'Licht', 'Location', 'Briefing'],
    commercialHref: 'portraitfotografie.html',
    links: [
      { label: 'Portraitfotografie', href: 'portraitfotografie.html' },
      { label: 'Portraitfotografie in Düsseldorf', href: 'portraitfotografie-duesseldorf.html' },
      { label: 'Businessportraits draußen planen', href: 'blog-businessportraits-draussen.html' },
    ],
  }),
  createArticle({
    document: lichtformerDocument,
    dateLabel: '6. August 2026',
    heroImageAlt: 'Inszeniertes Portrait einer Frau mit warmem, gerichtetem Studiolicht',
    tags: ['Portrait', 'Licht', 'Studio', 'Briefing'],
    commercialHref: 'portraitfotografie-beleuchtung.html',
    links: [
      { label: 'Portraitfotografie', href: 'portraitfotografie.html' },
      { label: 'Portraitfotografie Beleuchtung', href: 'portraitfotografie-beleuchtung.html' },
      { label: 'Schwarz-Weiß-Portraits und Licht', href: 'blog-schwarz-weiss-portrait-licht.html' },
    ],
  }),
  createArticle({
    document: schwarzWeissDocument,
    dateLabel: '7. August 2026',
    heroImageAlt: 'Enges Portrait eines lächelnden Mannes vor einem zurückhaltenden Hintergrund',
    tags: ['Portrait', 'Licht', 'Studio', 'Bildserie'],
    commercialHref: 'schwarz-weiss-portrait-duesseldorf.html',
    links: [
      { label: 'Portraitfotografie', href: 'portraitfotografie.html' },
      { label: 'Schwarz-Weiß-Portrait', href: 'schwarz-weiss-portrait-duesseldorf.html' },
      { label: 'Lichtformer für Portraitfotografie', href: 'blog-lichtformer-portraitfotografie.html' },
    ],
  }),
  createArticle({
    document: musikerDocument,
    dateLabel: '8. August 2026',
    heroImageAlt: 'Musikerin mit Violine in einer weit komponierten Outdoor-Aufnahme',
    tags: ['Portrait', 'Bildserie', 'Location', 'Briefing'],
    commercialHref: 'portraitfotografie.html',
    links: [
      { label: 'Portraitfotografie', href: 'portraitfotografie.html' },
      { label: 'Pressefoto in Düsseldorf', href: 'pressefoto-duesseldorf.html' },
      { label: 'Portraits ohne generische Posen', href: 'blog-portraits-ohne-generische-posen.html' },
    ],
  }),
  createArticle({
    document: wetterDocument,
    dateLabel: '9. August 2026',
    heroImageAlt: 'Outdoor-Portrait eines Mannes in einer urbanen Szene unter bedecktem Himmel',
    tags: ['Portrait', 'Wetter', 'Location', 'Briefing'],
    commercialHref: 'portraitfotografie-duesseldorf.html',
    links: [
      { label: 'Portraitfotografie', href: 'portraitfotografie.html' },
      { label: 'Portraitfotografie in Düsseldorf', href: 'portraitfotografie-duesseldorf.html' },
      { label: 'Location Scouting in Düsseldorf', href: 'blog-location-scouting-duesseldorf.html' },
    ],
  }),
]
