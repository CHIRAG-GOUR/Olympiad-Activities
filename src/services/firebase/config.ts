import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

/**
 * Firebase client initialisation.
 *
 * Everything is read from the environment; the literals below are only fallbacks so a
 * developer without a .env.local still gets a coherent (and inert) configuration.
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "olympiad-dashboard.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "olympiad-dashboard",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "olympiad-dashboard.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * The Olympiad has its OWN Firestore database inside this project.
 *
 * The project's `(default)` database belongs to the Minty Finance app. Naming the
 * database here is what keeps the two apart — `getFirestore(app)` without it would
 * silently read and write Minty Finance's data.
 */
export const FIRESTORE_DATABASE_ID =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || "olympiad";

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;
let isRealFirebaseConfigured = false;

try {
  if (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  ) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app, FIRESTORE_DATABASE_ID);
    storage = getStorage(app);
    auth = getAuth(app);
    isRealFirebaseConfigured = true;

    if (typeof window !== "undefined" && firebaseConfig.measurementId) {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch(() => {});
    }
  }
} catch (err) {
  console.warn("Firebase not initialized in real mode, utilizing local-first Olympiad store layer.", err);
}

export { app, db, storage, auth, analytics, isRealFirebaseConfigured };
