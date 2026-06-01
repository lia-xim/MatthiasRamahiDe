const photographySuffix = 'fotografie'

const normalizeKey = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()

const compoundOverrides: Record<string, string[]> = {
  automobilfotografie: ['Automobil', 'Fotografie'],
  landschaftsfotografie: ['Landschaft', 'Fotografie'],
  motorradfotografie: ['Motorrad', 'Fotografie'],
  oldtimerfotografie: ['Oldtimer', 'Fotografie'],
  portraitfotografie: ['Portrait', 'Fotografie'],
  sportwagenfotografie: ['Sportwagen', 'Fotografie'],
}

const splitLongPhrase = (value: string, maxLineLength = 16) => {
  const tokens = value
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)

  const lines: string[] = []
  let current = ''

  for (const token of tokens) {
    const candidate = current ? `${current} ${token}` : token
    if (current && candidate.length > maxLineLength) {
      lines.push(current)
      current = token
    } else {
      current = candidate
    }
  }

  if (current) lines.push(current)
  return lines
}

export const splitHeroTitleLines = (value: string | null | undefined) => {
  const clean = typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''
  if (!clean) return []

  const override = compoundOverrides[normalizeKey(clean)]
  if (override) return override

  const spacedPhotography = clean.match(new RegExp(`^(.*?)\\s+${photographySuffix}$`, 'i'))
  if (spacedPhotography?.[1]) {
    return [...splitLongPhrase(spacedPhotography[1]), 'Fotografie']
  }

  const hyphenPhotography = clean.match(new RegExp(`^(.*?)-${photographySuffix}$`, 'i'))
  if (hyphenPhotography?.[1]) {
    return [...splitLongPhrase(hyphenPhotography[1]), 'Fotografie']
  }

  if (clean.toLowerCase().endsWith(photographySuffix)) {
    const stem = clean.slice(0, -photographySuffix.length).replace(/schafts$/i, 'schaft').trim()
    if (stem) return [...splitLongPhrase(stem), 'Fotografie']
  }

  return splitLongPhrase(clean)
}
