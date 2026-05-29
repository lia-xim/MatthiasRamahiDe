console.error(
  [
    '`seo:fix` no longer mutates frozen root HTML files.',
    '',
    'Production SEO changes now belong in Payload content, Astro native templates, sitemap/robots code, or the typed content sources.',
    '',
    'Useful checks:',
    '  corepack pnpm seo:audit:deep:strict',
    '  corepack pnpm cms:audit-seo -- --strict',
    '  corepack pnpm production:check',
    '',
    'For the archived root HTML reference only, use the explicit legacy command with ALLOW_LEGACY_REFERENCE_WRITE=true.',
  ].join('\n'),
)

process.exit(1)
