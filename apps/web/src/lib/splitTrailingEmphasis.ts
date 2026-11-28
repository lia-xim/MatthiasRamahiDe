const normalizeCopyToken = (value: string) =>
  value
    .normalize('NFKC')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[.,!?;:]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('de-DE')

export const splitTrailingEmphasis = (headline: string, emphasis: string) => {
  const cleanHeadline = headline.replace(/\s+/g, ' ').trim()
  const cleanEmphasis = emphasis.replace(/\s+/g, ' ').trim()
  const headlineWords = cleanHeadline.split(' ').filter(Boolean)
  const emphasisWords = cleanEmphasis.split(' ').filter(Boolean)
  if (!headlineWords.length || !emphasisWords.length || headlineWords.length < emphasisWords.length) {
    return { headline: cleanHeadline, emphasis: cleanEmphasis }
  }

  const tail = headlineWords.slice(-emphasisWords.length).join(' ')
  if (normalizeCopyToken(tail) !== normalizeCopyToken(cleanEmphasis)) {
    return { headline: cleanHeadline, emphasis: cleanEmphasis }
  }

  return {
    headline: headlineWords.slice(0, -emphasisWords.length).join(' '),
    emphasis: cleanEmphasis,
  }
}
