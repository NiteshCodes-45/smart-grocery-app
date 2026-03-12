
import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  connectAuthEmulator,
} from "firebase/auth";

import {
  initializeFirestore,
  persistentLocalCache,
  connectFirestoreEmulator,
} from "firebase/firestore";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
};

if (!process.env.EXPO_PUBLIC_FIREBASE_API_KEY) {
  console.warn("Firebase config missing!");
}
console.log("ENV:", process.env.EXPO_PUBLIC_ENV);
console.log("Firebase Project:", process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);

//App init (singleton-safe)
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

//Auth MUST be initialized this way (NO getAuth)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

//Firestore
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

//Emulator switch (ONLY place with env logic)
const USE_EMULATOR =
  process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === "true";

if (__DEV__ && USE_EMULATOR) {
  console.log("Firebase Emulator ENABLED");
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
} else {
  console.log("Using LIVE Firebase");
}

export { auth, db };