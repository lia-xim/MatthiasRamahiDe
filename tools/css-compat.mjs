// Shared CSS compatibility step for the hand-written stylesheets in /assets.
//
// Those files never pass through Vite, so without this step they reached the
// browser without vendor prefixes or fallbacks. Safari up to version 17, for
// example, ignores `backdrop-filter` without `-webkit-backdrop-filter`, which
// silently removed every glass/blur effect on older iPhones and Macs.
//
// esbuild (already part of the toolchain) adds the missing prefixes
// (backdrop-filter, mask-*, hyphens, user-select, text-size-adjust, ...) and
// lowers colour syntax such as oklch() for the browsers listed below.
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// Oldest browsers we actively support. Safari/iOS 15.4 is the first release
// with svh/dvh units, :has() and overflow-wrap:anywhere, all of which the
// stylesheets rely on.
export const CSS_BROWSER_TARGETS = ['chrome100', 'edge100', 'firefox100', 'safari15.4', 'ios15.4']

let esbuildPromise

async function loadEsbuild() {
  if (!esbuildPromise) {
    esbuildPromise = import('esbuild').catch(() => {
      const fallback = path.join(repoRoot, 'node_modules', '.pnpm', 'node_modules', 'esbuild', 'lib', 'main.js')
      return import(pathToFileURL(fallback).href)
    })
  }
  const mod = await esbuildPromise
  return mod.default ?? mod
}

/**
 * Adds vendor prefixes and syntax fallbacks. Returns the original code when
 * esbuild cannot parse the file, so a broken stylesheet never breaks the build.
 */
export async function makeCssCompatible(code, { minify = false, sourcefile = 'style.css' } = {}) {
  const esbuild = await loadEsbuild()
  try {
    const result = await esbuild.transform(code, {
      loader: 'css',
      target: CSS_BROWSER_TARGETS,
      minify,
      legalComments: 'none',
      sourcefile,
      logLevel: 'silent',
    })
    return result.code
  } catch (error) {
    console.warn(`[css-compat] ${sourcefile}: ${error?.message?.split('\n')[0] || error}`)
    return code
  }
}
