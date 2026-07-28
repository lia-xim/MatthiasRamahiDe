import assert from 'node:assert/strict'
import test from 'node:test'

import { pageAnalyticsDimensions } from './pageAnalyticsDimensions.ts'

test('classifies commercial pillars and their hub roles', () => {
  assert.deepEqual(pageAnalyticsDimensions('/automobil-fotografie.html'), {
    pageFamily: 'automobil',
    pageRole: 'pillar',
  })
  assert.deepEqual(pageAnalyticsDimensions('/portraitfotografie-duesseldorf.html'), {
    pageFamily: 'portrait',
    pageRole: 'local-hub',
  })
  assert.deepEqual(pageAnalyticsDimensions('/motorrad-fotografie-nrw.html'), {
    pageFamily: 'motorrad',
    pageRole: 'regional-hub',
  })
})

test('classifies all intent prefixes through the central family taxonomy', () => {
  const examples = [
    ['/automotive-fotografie.html', 'automobil'],
    ['/performance-car-fotografie-duesseldorf.html', 'sportwagen'],
    ['/classic-car-fotografie.html', 'oldtimer'],
    ['/custom-bike-fotografie-duesseldorf.html', 'motorrad'],
    ['/business-portrait-duesseldorf.html', 'portrait'],
    ['/fine-art-prints-landschaft.html', 'landschaft'],
  ] as const

  for (const [path, pageFamily] of examples) {
    assert.deepEqual(pageAnalyticsDimensions(path), {
      pageFamily,
      pageRole: 'child',
    })
  }
})

test('keeps guides, proof and the Contextter case study distinct', () => {
  assert.deepEqual(pageAnalyticsDimensions('/auto-fotografieren-tipps.html'), {
    pageFamily: 'automobil',
    pageRole: 'guide',
  })
  assert.deepEqual(pageAnalyticsDimensions('/portfolio/portfolio-auswahl-portrait'), {
    pageFamily: 'portrait',
    pageRole: 'proof',
  })
  assert.deepEqual(pageAnalyticsDimensions('/keyword-datenbank-seo.html'), {
    pageFamily: 'contextter',
    pageRole: 'case-study',
  })
})
