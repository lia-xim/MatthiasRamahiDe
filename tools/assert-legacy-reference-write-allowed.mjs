const allowed = process.env.ALLOW_LEGACY_REFERENCE_WRITE === 'true'

if (!allowed) {
  console.error(
    [
      'Legacy reference write blocked.',
      '',
      'These tools mutate frozen root HTML reference files and are no longer part of the Astro/Payload production workflow.',
      'Use CMS/native Astro content workflows for production changes.',
      '',
      'If you intentionally need to regenerate the frozen legacy reference, run with:',
      "  $env:ALLOW_LEGACY_REFERENCE_WRITE='true'",
      '  corepack pnpm legacy:seo:fix',
      '  Remove-Item Env:ALLOW_LEGACY_REFERENCE_WRITE',
    ].join('\n'),
  )
  process.exit(1)
}
