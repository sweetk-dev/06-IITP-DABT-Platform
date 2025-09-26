/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPEN_API_CENTER_URL: string
  readonly VITE_VISUAL_TOOL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
