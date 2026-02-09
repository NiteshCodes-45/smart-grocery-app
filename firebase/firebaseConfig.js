
import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  connectAuthEmulator,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });

// // AFTER auth & db are created
// if (USE_EMULATOR) {
//   console.log("🔥 Using Firebase Emulator");

//   connectAuthEmulator(auth, "http://localhost:9099");
//   connectFirestoreEmulator(db, "localhost", 8080);
//   // connectAuthEmulator(auth, "http://192.168.1.6:9099");
//   // connectFirestoreEmulator(db, "192.168.1.6", 8080);
// }else {
//   console.log("🌍 Using REAL Firebase");
// }

// ✅ App init (singleton-safe)
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// ✅ Auth MUST be initialized this way (NO getAuth)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// ✅ Firestore
const db = getFirestore(app);

// ✅ Emulator switch (ONLY place with env logic)
const USE_EMULATOR =
  process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === "true";

if (USE_EMULATOR) {
  console.log("🔥 Firebase Emulator ENABLED");

  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
} else {
  console.log("🌍 Using LIVE Firebase");
}

export { auth, db };