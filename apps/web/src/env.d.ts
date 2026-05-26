/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PAYLOAD_PUBLIC_SERVER_URL?: string
  readonly ASTRO_PUBLIC_SITE_URL?: string
  readonly PREVIEW_SECRET?: string
  readonly PAYLOAD_PREVIEW_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
