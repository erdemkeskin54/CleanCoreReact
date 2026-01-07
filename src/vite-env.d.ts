/// <reference types="vite/client" />

// Custom env değişkenlerini strongly-typed yap — autocomplete + typo koruması.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
