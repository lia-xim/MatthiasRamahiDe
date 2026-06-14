console.error(
  [
    '`seo:fix` no longer mutates archived legacy HTML files.',
    '',
    'Production SEO changes now belong in Tina content, Astro native templates, sitemap/robots code, or the typed content sources.',
    '',
    'Useful checks:',
    '  corepack pnpm seo:audit:deep:strict',
    '  corepack pnpm web:audit:tina-seo',
    '  corepack pnpm production:check',
    '',
    'The archived HTML reference under legacy-reference/html is for QA only and is not a production content-editing target.',
  ].join('\n'),
)

process.exit(1)
