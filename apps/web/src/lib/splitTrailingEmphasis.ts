const normalizeCopyToken = (value: string) =>
  value
    .normalize('NFKC')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[.,!?;:]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('de-DE')

export const splitTrailingEmphasis = (headline: string, emphasis: string) => {
  const headlineWords = headline.split(/\s+/).filter(Boolean)
  const emphasisWords = emphasis.split(/\s+/).filter(Boolean)
  if (!headlineWords.length || !emphasisWords.length || headlineWords.length < emphasisWords.length) {
    return { headline, emphasis }
  }

  const tail = headlineWords.slice(-emphasisWords.length).join(' ')
  if (normalizeCopyToken(tail) !== normalizeCopyToken(emphasis)) return { headline, emphasis }

  return {
    headline: headlineWords.slice(0, -emphasisWords.length).join(' '),
    emphasis,
  }
}
