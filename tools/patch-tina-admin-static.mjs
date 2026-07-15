import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const adminDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(repoRoot, 'apps/web/public/admin')
const assetsDir = path.join(adminDir, 'assets')
const indexPath = path.join(adminDir, 'index.html')
const bridgePath = path.join(adminDir, 'bridge.js')
const latestVersionPath = path.join(adminDir, 'latest-version.json')
const publishButtonScriptPath = path.join(adminDir, 'publish-button.js')
const publishButtonStylePath = path.join(adminDir, 'publish-button.css')

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
const publishButtonScript = String.raw`
(() => {
  const endpoint = '/api/tina-publish'
  const pollMs = 2500
  let pollTimer = null

  const text = {
    idle: '\u00c4nderungen ver\u00f6ffentlichen',
    running: 'Ver\u00f6ffentliche...',
    success: 'Ver\u00f6ffentlicht. Vercel baut jetzt.',
    failed: 'Publish fehlgeschlagen.',
    noChanges: 'Keine neuen \u00c4nderungen.',
    disabled: 'Publish ist auf diesem Server nicht aktiv.',
  }

  const createWidget = () => {
    if (document.getElementById('mr-tina-publish')) return document.getElementById('mr-tina-publish')

    const widget = document.createElement('div')
    widget.id = 'mr-tina-publish'
    widget.innerHTML = [
      '<button type="button" class="mr-tina-publish__button" aria-live="polite">',
      '<span class="mr-tina-publish__dot" aria-hidden="true"></span>',
      '<span class="mr-tina-publish__label"></span>',
      '</button>',
      '<div class="mr-tina-publish__status" role="status"></div>',
    ].join('')
    document.body.appendChild(widget)
    return widget
  }

  const widget = createWidget()
  const button = widget.querySelector('.mr-tina-publish__button')
  const label = widget.querySelector('.mr-tina-publish__label')
  const status = widget.querySelector('.mr-tina-publish__status')

  const lastUsefulLine = (state) => {
    const lines = Array.isArray(state?.log) ? state.log : []
    return lines.slice().reverse().find((line) => line && !line.includes('Starting Tina publish')) || ''
  }

  const render = (state) => {
    const publishState = state?.status || 'idle'
    widget.dataset.state = publishState
    button.disabled = publishState === 'running'

    if (publishState === 'running') {
      label.textContent = text.running
      status.textContent = 'Bitte warten. Die Inhalte werden nach GitHub gepusht.'
      return
    }

    if (publishState === 'success') {
      label.textContent = text.idle
      const line = lastUsefulLine(state)
      status.textContent = line.includes('No Tina content changes') ? text.noChanges : text.success
      return
    }

    if (publishState === 'failed') {
      label.textContent = text.idle
      status.textContent = (text.failed + ' ' + lastUsefulLine(state)).trim()
      return
    }

    label.textContent = text.idle
    status.textContent = 'Nach dem Speichern klicken, um GitHub und Vercel anzustossen.'
  }

  const fetchStatus = async () => {
    const response = await fetch(endpoint, {
      credentials: 'same-origin',
      headers: { accept: 'application/json' },
    })
    if (response.status === 404) {
      widget.dataset.state = 'disabled'
      button.disabled = true
      label.textContent = text.idle
      status.textContent = text.disabled
      return null
    }
    if (!response.ok) throw new Error('Status ' + response.status)
    return response.json()
  }

  const poll = async () => {
    try {
      const state = await fetchStatus()
      if (!state) return
      render(state)
      if (state.running) {
        pollTimer = window.setTimeout(poll, pollMs)
      }
    } catch (error) {
      widget.dataset.state = 'failed'
      button.disabled = false
      status.textContent = 'Publish-Status konnte nicht gelesen werden: ' + error.message
    }
  }

  const publish = async () => {
    window.clearTimeout(pollTimer)
    widget.dataset.state = 'running'
    button.disabled = true
    label.textContent = text.running
    status.textContent = 'Publish wird gestartet...'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-tina-publish-request': '1',
        },
        body: '{}',
      })
      const state = await response.json().catch(() => ({}))
      render(state)
      pollTimer = window.setTimeout(poll, state.running ? pollMs : 800)
    } catch (error) {
      widget.dataset.state = 'failed'
      button.disabled = false
      label.textContent = text.idle
      status.textContent = 'Publish konnte nicht gestartet werden: ' + error.message
    }
  }

  button.addEventListener('click', publish)
  poll()
})()
`.trimStart()

const publishButtonStyle = String.raw`
#mr-tina-publish {
  bottom: 20px;
  color: #f8fafc;
  display: grid;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  gap: 8px;
  max-width: min(360px, calc(100vw - 32px));
  position: fixed;
  right: 20px;
  z-index: 2147483000;
}

.mr-tina-publish__button {
  align-items: center;
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  box-shadow: 0 14px 44px rgba(15, 23, 42, 0.26);
  color: #f8fafc;
  cursor: pointer;
  display: inline-flex;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  gap: 9px;
  justify-content: center;
  line-height: 1.2;
  min-height: 42px;
  padding: 11px 15px;
  text-align: left;
}

.mr-tina-publish__button:disabled {
  cursor: wait;
  opacity: 0.76;
}

.mr-tina-publish__dot {
  background: #22c55e;
  border-radius: 999px;
  flex: 0 0 auto;
  height: 9px;
  width: 9px;
}

#mr-tina-publish[data-state="running"] .mr-tina-publish__dot {
  animation: mr-tina-pulse 1s ease-in-out infinite;
  background: #f59e0b;
}

#mr-tina-publish[data-state="failed"] .mr-tina-publish__dot,
#mr-tina-publish[data-state="disabled"] .mr-tina-publish__dot {
  background: #ef4444;
}

.mr-tina-publish__status {
  background: rgba(17, 24, 39, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.22);
  color: #e5e7eb;
  font-size: 12px;
  line-height: 1.35;
  padding: 10px 12px;
}

@keyframes mr-tina-pulse {
  0%,
  100% {
    opacity: 0.48;
    transform: scale(0.82);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 560px) {
  #mr-tina-publish {
    bottom: 14px;
    left: 14px;
    max-width: none;
    right: 14px;
  }

  .mr-tina-publish__button {
    width: 100%;
  }
}
`.trimStart()

const writeIfChanged = (filePath, content) => {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : ''
  if (current === content) return
  fs.writeFileSync(filePath, content)
  patchedFiles += 1
}

const pnpmDir = path.resolve(repoRoot, 'node_modules/.pnpm')
const pnpmBridgeCandidates = fs.existsSync(pnpmDir)
  ? fs
      .readdirSync(pnpmDir)
      .filter((entry) => entry.startsWith('@tinacms+bridge@'))
      .map((entry) =>
        path.resolve(pnpmDir, entry, 'node_modules/@tinacms/bridge/dist/index.js'),
      )
  : []

const bridgeSourcePath = [
  path.resolve(repoRoot, 'node_modules/@tinacms/bridge/dist/index.js'),
  path.resolve(repoRoot, 'apps/web/node_modules/@tinacms/bridge/dist/index.js'),
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
  const publishButtonAssets =
    '<link rel="stylesheet" href="/admin/publish-button.css"><script defer src="/admin/publish-button.js"></script>'
  let next = source.replaceAll(' type="module" crossorigin src=', ' type="module" src=')

  next = next.includes('__tina_edit=1')
    ? next
    : next.includes('</head>')
      ? next.replace('</head>', `${editModeCookieScript}</head>`)
      : `${editModeCookieScript}${next}`

  if (!next.includes('/admin/publish-button.js')) {
    next = next.includes('</head>') ? next.replace('</head>', `${publishButtonAssets}</head>`) : `${publishButtonAssets}${next}`
  }

  if (next !== source) {
    fs.writeFileSync(indexPath, next)
    patchedFiles += 1
  }
}

writeIfChanged(publishButtonScriptPath, publishButtonScript)
writeIfChanged(publishButtonStylePath, publishButtonStyle)

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
  next = next.replaceAll('"http://[::1]:4001/graphql"', sameOriginGraphqlExpression)
  next = next.replaceAll('"http://localhost:4001/searchIndex"', sameOriginSearchExpression)
  next = next.replaceAll('"http://[::1]:4001/searchIndex"', sameOriginSearchExpression)
  next = next.replaceAll('"http://localhost:4001/v2/searchIndex"', sameOriginV2SearchExpression)
  next = next.replaceAll('"http://[::1]:4001/v2/searchIndex"', sameOriginV2SearchExpression)

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
