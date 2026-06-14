import fs from 'node:fs'
import path from 'node:path'

const adminDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve('apps/web/public/admin')
const assetsDir = path.join(adminDir, 'assets')
const indexPath = path.join(adminDir, 'index.html')
const bridgePath = path.join(adminDir, 'bridge.js')
const latestVersionPath = path.join(adminDir, 'latest-version.json')

const replacements = [
  {
    from: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
    to: '',
  },
]

const sameOriginGraphqlExpression =
  '(typeof window!=="undefined"&&window.location&&window.location.origin?window.location.origin+"/graphql":"/graphql")'
const sameOriginSearchExpression =
  '(typeof window!=="undefined"&&window.location&&window.location.origin?window.location.origin+"/searchIndex":"/searchIndex")'
const sameOriginV2SearchExpression =
  '(typeof window!=="undefined"&&window.location&&window.location.origin?window.location.origin+"/v2/searchIndex":"/v2/searchIndex")'

let patchedFiles = 0
const pnpmBridgeCandidates = fs.existsSync(path.resolve('node_modules/.pnpm'))
  ? fs
      .readdirSync(path.resolve('node_modules/.pnpm'))
      .filter((entry) => entry.startsWith('@tinacms+bridge@'))
      .map((entry) =>
        path.resolve('node_modules/.pnpm', entry, 'node_modules/@tinacms/bridge/dist/index.js'),
      )
  : []

const bridgeSourcePath = [
  path.resolve('node_modules/@tinacms/bridge/dist/index.js'),
  path.resolve('apps/web/node_modules/@tinacms/bridge/dist/index.js'),
  ...pnpmBridgeCandidates,
].find((candidate) => fs.existsSync(candidate))

if (bridgeSourcePath) {
  const source = fs.readFileSync(bridgeSourcePath, 'utf8')
  const current = fs.existsSync(bridgePath) ? fs.readFileSync(bridgePath, 'utf8') : ''
  if (current !== source) {
    fs.writeFileSync(bridgePath, source)
    patchedFiles += 1
  }
} else {
  throw new Error('Could not find @tinacms/bridge/dist/index.js')
}

if (fs.existsSync(indexPath)) {
  const source = fs.readFileSync(indexPath, 'utf8')
  const editModeCookieScript =
    '<script>try{document.cookie="__tina_edit=1; Path=/; SameSite=Strict; Max-Age=3600"}catch(e){}</script>'
  const next = source.includes('__tina_edit=1')
    ? source
    : source.includes('</head>')
      ? source.replace('</head>', `${editModeCookieScript}</head>`)
      : `${editModeCookieScript}${source}`

  if (next !== source) {
    fs.writeFileSync(indexPath, next)
    patchedFiles += 1
  }
}

for (const entry of fs.readdirSync(assetsDir, { withFileTypes: true })) {
  if (!entry.isFile() || !/\.(js|css|html)$/.test(entry.name)) continue
  const filePath = path.join(assetsDir, entry.name)
  let source = fs.readFileSync(filePath, 'utf8')
  let next = source
  for (const { from, to } of replacements) {
    next = next.split(from).join(to)
  }

  const contentApiUrlMatch = next.match(
    /,([A-Za-z_$][\w$]*)=\(\(([A-Za-z_$][\w$]*)=new Object\(\{NODE_ENV:"development"\}\)\.TINA_CONTENT_API_URL\)==null\?void 0:\2\.trim\(\)\)\|\|"\/graphql"/,
  )

  if (contentApiUrlMatch) {
    const contentApiUrlVarName = contentApiUrlMatch[1]
    next = next.replace(contentApiUrlMatch[0], `,${contentApiUrlVarName}=${sameOriginGraphqlExpression}`)
    next = next.replaceAll('client:{apiUrl:"/graphql"}', `client:{apiUrl:${contentApiUrlVarName}}`)
  }

  const runtimeContentApiUrlMatch = next.match(
    /,([A-Za-z_$][\w$]*)=[A-Za-z_$][\w$]*\("TINA_CONTENT_API_URL"\)\|\|[A-Za-z_$][\w$]*\(\),/,
  )

  if (runtimeContentApiUrlMatch) {
    const contentApiUrlVarName = runtimeContentApiUrlMatch[1]
    next = next.replaceAll('client:{apiUrl:"/graphql"}', `client:{apiUrl:${contentApiUrlVarName}}`)
    next = next.replaceAll(
      'client:{apiUrl:"http://localhost:4001/graphql"}',
      `client:{apiUrl:${contentApiUrlVarName}}`,
    )
  }

  next = next.replaceAll(
    'e.api.tina.contentApiUrl||"http://localhost:4001/graphql"',
    'e.api.tina.contentApiUrl||window.location.origin+"/graphql"',
  )
  next = next.replaceAll('"http://localhost:4001/graphql"', sameOriginGraphqlExpression)
  next = next.replaceAll('"http://localhost:4001/searchIndex"', sameOriginSearchExpression)
  next = next.replaceAll('"http://localhost:4001/v2/searchIndex"', sameOriginV2SearchExpression)

  if (next !== source) {
    fs.writeFileSync(filePath, next)
    patchedFiles += 1
  }
}

fs.writeFileSync(
  latestVersionPath,
  `${JSON.stringify({ tinacms: { version: '3.9.1', publishedAt: '2026-06-13T00:00:00.000Z' } })}\n`,
)

console.log(JSON.stringify({ adminDir, patchedFiles, latestVersionPath }, null, 2))
