/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PAYLOAD_PUBLIC_SERVER_URL?: string
  readonly ASTRO_PUBLIC_SITE_URL?: string
  readonly ASTRO_ENABLE_ADOPTED_ROUTES?: string
  readonly ASTRO_ENABLE_LOCAL_SEO_ADOPTED_ROUTES?: string
  readonly ASTRO_ENABLE_CMS_DYNAMIC_ROUTES?: string
  readonly ASTRO_ENABLE_JOURNAL_ROUTES?: string
  readonly ASTRO_ENABLE_CMS_JOURNAL_ROUTES?: string
  readonly ASTRO_ENABLE_CMS_SERVICE_ROUTES?: string
  readonly ASTRO_DISABLE_LEGACY_CMS_LOOKUP?: string
  readonly ASTRO_DISABLE_PAYLOAD_FETCH?: string
  readonly PREVIEW_SECRET?: string
  readonly PAYLOAD_PREVIEW_API_KEY?: string
  readonly PAYLOAD_FETCH_CACHE_MS?: string
  readonly PAYLOAD_FETCH_TIMEOUT_MS?: string
  readonly RESEND_API_KEY?: string
  readonly CONTACT_FROM_EMAIL?: string
  readonly CONTACT_TO_EMAIL?: string
  readonly CONTACT_ALERT_EMAIL?: string
  readonly CONTACT_QUEUE_DIR?: string
  readonly CONTACT_RETRY_SECRET?: string
  readonly CONTACT_IP_HASH_SALT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
