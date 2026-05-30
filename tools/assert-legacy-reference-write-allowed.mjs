const allowed = process.env.ALLOW_LEGACY_REFERENCE_WRITE === 'true'

if (!allowed) {
  console.error(
    [
      'Legacy reference write blocked.',
      '',
      'These tools mutate archived legacy HTML reference files and are no longer part of the Astro/Payload production workflow.',
      'Use CMS/native Astro content workflows for production changes.',
      '',
      'If you intentionally need to regenerate the frozen legacy reference, run with:',
      "  $env:ALLOW_LEGACY_REFERENCE_WRITE='true'",
      '  create a one-off archival maintenance script instead of using production commands',
      '  Remove-Item Env:ALLOW_LEGACY_REFERENCE_WRITE',
    ].join('\n'),
  )
  process.exit(1)
}
