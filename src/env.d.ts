/// <reference types="@ngx-env/core" />

interface ImportMeta {
  readonly env: {
    NG_APP_FIREBASE_API_KEY: string;
    NG_APP_FIREBASE_AUTH_DOMAIN: string;
    NG_APP_FIREBASE_PROJECT_ID: string;
    NG_APP_FIREBASE_STORAGE_BUCKET: string;
    NG_APP_FIREBASE_MESSAGING_SENDER: string;
    NG_APP_FIREBASE_APP_ID: string;
    NG_APP_FIREBASE_MEASUREMENT_ID: string;
    [key: string]: string;
  };
}
