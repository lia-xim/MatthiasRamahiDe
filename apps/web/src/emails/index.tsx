/** @jsxImportSource react */
import * as React from 'react'
import { render } from '@react-email/render'

// Keep React in scope for direct TSX execution outside Astro's JSX transform.
void React

import InquiryAdminEmail from './InquiryAdminEmail'
import InquiryConfirmationEmail from './InquiryConfirmationEmail'
import type { InquiryEmailData } from './types'

export type { InquiryEmailData } from './types'

// Rendert HTML + Plaintext aus derselben Komponente, damit beide Varianten nie
// auseinanderlaufen. Wird serverseitig im Contact-Flow aufgerufen.
export async function renderAdminEmail(data: InquiryEmailData, delayed = false) {
  const node = <InquiryAdminEmail data={data} delayed={delayed} />
  const [html, text] = await Promise.all([render(node), render(node, { plainText: true })])
  return { html, text }
}

export async function renderConfirmationEmail(data: InquiryEmailData) {
  const node = <InquiryConfirmationEmail data={data} />
  const [html, text] = await Promise.all([render(node), render(node, { plainText: true })])
  return { html, text }
}
