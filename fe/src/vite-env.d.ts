/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT: string
  readonly VITE_BASE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_VISUAL_TOOL: string
  readonly VITE_EMPLOYMENT_SITE_URL: string
  readonly VITE_OPEN_API_CENTER_URL: string
  readonly VITE_OPEN_API_CENTER_ABOUT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
