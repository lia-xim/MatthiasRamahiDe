export type JournalMarkdownOptions = {
  resolveRedirectTarget?: (fileName: string) => string | null
}

const canonicalInternalAliases: Record<string, string> = {
  '/about': '/ueber-mich.html',
  '/blog': '/blog.html',
  '/contact': '/contact.html',
  '/index': '/',
  '/index.html': '/',
  '/journal': '/blog.html',
  '/kontakt': '/contact.html',
  '/leistungen': '/leistungen.html',
  '/portfolio': '/portfolio.html',
  '/services': '/leistungen.html',
  '/ueber-mich': '/ueber-mich.html',
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

type ResolvedHref = {
  href: string
  external: boolean
}

function resolveJournalHref(
  rawHref: string,
  resolveRedirectTarget?: (fileName: string) => string | null,
): ResolvedHref | null {
  let candidate = rawHref.trim()
  if (candidate.startsWith('<') && candidate.endsWith('>')) {
    candidate = candidate.slice(1, -1).trim()
  }
  if (!candidate) return null

  const ownOriginMatch = candidate.match(/^https?:\/\/(?:www\.)?matthiasramahi\.de(\/.*)?$/i)
  if (ownOriginMatch) {
    candidate = ownOriginMatch[1] || '/'
  } else if (/^[a-z][a-z0-9+.-]*:/i.test(candidate)) {
    if (/^(?:https?:|mailto:|tel:)/i.test(candidate)) {
      return {
        href: candidate,
        external: /^https?:/i.test(candidate),
      }
    }
    return null
  }

  if (candidate.startsWith('#')) {
    return { href: candidate, external: false }
  }

  const [pathAndQuery, hash = ''] = candidate.split('#')
  const [rawPath, query = ''] = pathAndQuery.split('?')
  let pathname = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
  pathname = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')

  const lowerPathname = pathname.toLowerCase()
  if (canonicalInternalAliases[lowerPathname]) {
    pathname = canonicalInternalAliases[lowerPathname]
  } else if (/^\/[^/.]+$/i.test(pathname)) {
    pathname = `${pathname}.html`
  }

  if (resolveRedirectTarget && pathname !== '/') {
    let current = pathname.replace(/^\/+/, '').toLowerCase()
    const seen = new Set<string>([current])
    for (let hop = 0; hop < 4; hop += 1) {
      if (!current || current.includes('/')) break
      const target = resolveRedirectTarget(current)
      if (target === null) break
      if (target === '') {
        pathname = '/'
        break
      }
      const next = target.replace(/^\/+/, '')
      pathname = `/${next}`
      const nextLower = next.toLowerCase()
      if (seen.has(nextLower)) break
      seen.add(nextLower)
      current = nextLower
    }
  }

  const suffix = `${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`
  return {
    href: `${pathname || '/'}${suffix}`,
    external: false,
  }
}

function renderBoldHtml(text: string): string {
  const boldPattern = /\*\*([^\n]+?)\*\*/g
  let output = ''
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = boldPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      output += escapeHtml(text.slice(lastIndex, match.index))
    }
    output += `<strong>${escapeHtml(match[1])}</strong>`
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    output += escapeHtml(text.slice(lastIndex))
  }

  return output
}

function renderLinksAndBoldHtml(text: string, options: JournalMarkdownOptions): string {
  const linkPattern = /\[([^\]\n]+)\]\(([^()\s]*(?:\([^()\s]*\)[^()\s]*)*)\)/g
  let output = ''
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      output += renderBoldHtml(text.slice(lastIndex, match.index))
    }
    const labelHtml = renderBoldHtml(match[1])
    const resolved = resolveJournalHref(match[2], options.resolveRedirectTarget)
    if (resolved) {
      const attrs = resolved.external ? ' target="_blank" rel="noopener noreferrer"' : ''
      output += `<a href="${escapeHtml(resolved.href)}"${attrs}>${labelHtml}</a>`
    } else {
      output += labelHtml
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    output += renderBoldHtml(text.slice(lastIndex))
  }

  return output
}

export function renderJournalInlineHtml(text = '', options: JournalMarkdownOptions = {}): string {
  if (!text) return ''
  const codePattern = /`([^`\n]+)`/g
  let output = ''
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codePattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      output += renderLinksAndBoldHtml(text.slice(lastIndex, match.index), options)
    }
    output += `<code>${escapeHtml(match[1])}</code>`
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    output += renderLinksAndBoldHtml(text.slice(lastIndex), options)
  }

  return output
}

const bulletLinePattern = /^(?:-|\*)\s+(.+)$/
const orderedLinePattern = /^\d+\.\s+(.+)$/
const keyValueLinePattern = /^([^:\n]{2,48}):\s+(.+)$/
const tableSeparatorPattern = /^\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?$/

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

function isMarkdownTable(lines: string[]): boolean {
  if (lines.length < 3) return false
  if (!lines[0].includes('|') || !tableSeparatorPattern.test(lines[1])) return false
  const headerCount = parseTableRow(lines[0]).length
  return headerCount >= 2 && lines.slice(2).every((line) => line.includes('|'))
}

function renderMarkdownTableHtml(lines: string[], options: JournalMarkdownOptions): string {
  const headers = parseTableRow(lines[0])
  const rows = lines.slice(2).map((line) => {
    const cells = parseTableRow(line)
    return headers.map((_, index) => cells[index] || '')
  })
  const thead = `<thead><tr>${headers.map((header) => `<th scope="col">${renderJournalInlineHtml(header, options)}</th>`).join('')}</tr></thead>`
  const tbody = `<tbody>${rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${renderJournalInlineHtml(cell, options)}</td>`).join('')}</tr>`,
    )
    .join('')}</tbody>`
  return `<div class="journal-table-wrap"><table class="journal-table">${thead}${tbody}</table></div>`
}

type LineRun =
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'kv'; items: Array<{ label: string; value: string }> }
  | { kind: 'p'; lines: string[] }

function groupBlockLines(lines: string[]): LineRun[] {
  const runs: LineRun[] = []

  for (const line of lines) {
    const bullet = line.match(bulletLinePattern)
    if (bullet) {
      const prev = runs[runs.length - 1]
      if (prev && prev.kind === 'ul') prev.items.push(bullet[1])
      else runs.push({ kind: 'ul', items: [bullet[1]] })
      continue
    }

    const ordered = line.match(orderedLinePattern)
    if (ordered) {
      const prev = runs[runs.length - 1]
      if (prev && prev.kind === 'ol') prev.items.push(ordered[1])
      else runs.push({ kind: 'ol', items: [ordered[1]] })
      continue
    }

    const kv = line.match(keyValueLinePattern)
    if (kv && !/^https?$/i.test(kv[1].trim())) {
      const prev = runs[runs.length - 1]
      if (prev && prev.kind === 'kv') prev.items.push({ label: kv[1].trim(), value: kv[2].trim() })
      else runs.push({ kind: 'kv', items: [{ label: kv[1].trim(), value: kv[2].trim() }] })
      continue
    }

    const prev = runs[runs.length - 1]
    if (prev && prev.kind === 'p') prev.lines.push(line)
    else runs.push({ kind: 'p', lines: [line] })
  }

  // Merge fewer than 3 consecutive key-value lines into plain paragraphs so normal prose is preserved.
  const normalized: LineRun[] = []
  for (const run of runs) {
    if (run.kind === 'kv' && run.items.length < 3) {
      const plainLines = run.items.map((item) => `${item.label}: ${item.value}`)
      const prev = normalized[normalized.length - 1]
      if (prev && prev.kind === 'p') prev.lines.push(...plainLines)
      else normalized.push({ kind: 'p', lines: plainLines })
      continue
    }
    normalized.push(run)
  }

  return normalized
}

export function renderJournalBodyHtml(body?: string, options: JournalMarkdownOptions = {}): string {
  const blocks = (body || '')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  if (blocks.length === 0) return ''

  const htmlParts: string[] = []

  for (const block of blocks) {
    const lines = block
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    if (isMarkdownTable(lines)) {
      htmlParts.push(renderMarkdownTableHtml(lines, options))
      continue
    }

    for (const run of groupBlockLines(lines)) {
      if (run.kind === 'ul') {
        const items = run.items.map((item) => `<li>${renderJournalInlineHtml(item, options)}</li>`).join('')
        htmlParts.push(`<ul class="journal-list">${items}</ul>`)
      } else if (run.kind === 'ol') {
        const items = run.items.map((item) => `<li>${renderJournalInlineHtml(item, options)}</li>`).join('')
        htmlParts.push(`<ol class="journal-list">${items}</ol>`)
      } else if (run.kind === 'kv') {
        const items = run.items
          .map(
            (item) =>
              `<li><strong>${renderJournalInlineHtml(item.label, options)}:</strong> ${renderJournalInlineHtml(item.value, options)}</li>`,
          )
          .join('')
        htmlParts.push(`<ul class="journal-list journal-list--kv">${items}</ul>`)
      } else {
        htmlParts.push(`<p>${renderJournalInlineHtml(run.lines.join(' '), options)}</p>`)
      }
    }
  }

  return htmlParts.join('\n')
}
