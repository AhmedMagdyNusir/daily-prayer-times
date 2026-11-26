/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DST_MODE?: string;
  readonly VITE_HIJRI_ADJUSTMENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
