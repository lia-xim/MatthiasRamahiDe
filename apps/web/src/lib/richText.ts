export type PlainRichText = {
  root?: {
    children?: Array<{
      children?: Array<{ text?: string }>
    }>
  }
}

export const richTextToParagraphs = (body?: PlainRichText) =>
  body?.root?.children
    ?.map((node) => node.children?.map((child) => child.text).filter(Boolean).join(' ').trim() || '')
    .filter(Boolean) || []

export const richTextToPlainText = (body?: PlainRichText) => richTextToParagraphs(body).join('\n\n')

