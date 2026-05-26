import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

const callRebuildHook = async (source: string) => {
  const url = process.env.ASTRO_REBUILD_WEBHOOK_URL
  if (!url) return

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(process.env.ASTRO_REBUILD_WEBHOOK_SECRET
          ? { authorization: `Bearer ${process.env.ASTRO_REBUILD_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify({ source, at: new Date().toISOString() }),
    })
  } catch (error) {
    console.warn(`Astro rebuild hook failed for ${source}`, error)
  }
}

export const triggerAstroRebuildAfterChange: CollectionAfterChangeHook = async ({ collection, doc }) => {
  await callRebuildHook(collection.slug)
  return doc
}

export const triggerAstroRebuildAfterDelete: CollectionAfterDeleteHook = async ({ collection, doc }) => {
  await callRebuildHook(collection.slug)
  return doc
}

export const triggerAstroRebuildAfterGlobalChange: GlobalAfterChangeHook = async ({ global, doc }) => {
  await callRebuildHook(global.slug)
  return doc
}
