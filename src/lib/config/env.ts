/**
 * Centralized Environment & Runtime Configuration
 * 
 * Provides type-safe access to application settings across Local, Vercel, and Firebase environments.
 * Ensures no private secrets or Admin keys are exposed to the client bundle.
 */

export type AppEnvironment = "development" | "preview" | "production";
export type DataProviderType = "local" | "firebase";

export interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export interface AppConfig {
  env: AppEnvironment;
  isProduction: boolean;
  isDevelopment: boolean;
  appUrl: string;
  dataProvider: DataProviderType;
  firebase: FirebaseClientConfig;
  isFirebaseConfigured: boolean;
}

function resolveAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  // Vercel deployment automatic URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // Client-side fallback to current origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Local fallback
  return "http://localhost:3000";
}

function resolveEnvironment(): AppEnvironment {
  const customEnv = process.env.NEXT_PUBLIC_APP_ENV;
  if (customEnv === "production" || customEnv === "preview" || customEnv === "development") {
    return customEnv;
  }
  if (process.env.NODE_ENV === "production") {
    return "production";
  }
  return "development";
}

const firebaseConfig: FirebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes("MockKey")
);

const dataProvider: DataProviderType = 
  process.env.NEXT_PUBLIC_DATA_PROVIDER === "firebase" && isFirebaseConfigured
    ? "firebase"
    : "local";

export const appConfig: AppConfig = {
  env: resolveEnvironment(),
  isProduction: resolveEnvironment() === "production",
  isDevelopment: resolveEnvironment() === "development",
  appUrl: resolveAppUrl(),
  dataProvider,
  firebase: firebaseConfig,
  isFirebaseConfigured,
};

export default appConfig;
