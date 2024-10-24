/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY?: string;
  readonly VITE_APP_ID?: string;
  readonly VITE_AUTH_DOMAIN?: string;
  readonly VITE_DOMAIN_PROD?: string;
  readonly VITE_MEASUREMENT_ID?: string;
  readonly VITE_MESSAGING_SENDER_ID?: string;
  readonly VITE_PROJECT_ID?: string;
  readonly VITE_STEAM_AUTH_API?: string;
  readonly VITE_USE_EMULATORS?: string;
  readonly VITE_VAPID_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
