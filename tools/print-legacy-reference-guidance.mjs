console.error(
  [
    'The legacy HTML reference is archived under legacy-reference/html and is not part of the active project routes.',
    '',
    'Use native Astro/Payload content tools for production changes.',
    'Do not run the old bulk HTML mutation pipeline unless you intentionally create a one-off archival maintenance script.',
  ].join('\n'),
)

process.exit(1)
