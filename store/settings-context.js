import { createContext, useContext, useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

import { useAuth } from "./auth-context";
import { db } from "../firebase/firebaseConfig";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { currentUser } = useAuth();

  const [settings, setSettings] = useState(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  /* -------- Load & sync settings -------- */
  useEffect(() => {
    if (!currentUser?.uid) {
      setSettings(null);
      setIsSettingsLoading(false);
      return;
    }

    const ref = doc(db, "users", currentUser.uid, "settings", "main");

    const unsubscribe = onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        setSettings(snap.data());
      } else {
        // First-time user → create defaults
        const defaults = getDefaultSettings();
        await setDoc(ref, {
          ...defaults,
          updatedAt: serverTimestamp(),
        });
        setSettings(defaults);
      }

      setIsSettingsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  /* -------- Update single setting -------- */
  async function updateSetting(key, value) {
    if (!currentUser?.uid || !settings) return;

    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    await updateDoc(
      doc(db, "users", currentUser.uid, "settings", "main"),
      {
        [key]: value,
        updatedAt: serverTimestamp(),
      }
    );
  }

  /* -------- Reset to defaults -------- */
  async function resetSettings() {
    if (!currentUser?.uid) return;

    const defaults = getDefaultSettings();
    setSettings(defaults);

    await setDoc(
      doc(db, "users", currentUser.uid, "settings", "main"),
      {
        ...defaults,
        updatedAt: serverTimestamp(),
      }
    );
  }

  function markOnboardingSeen() {
    updateSetting("hasSeenOnboarding", true);
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        isSettingsLoading,
        markOnboardingSeen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

/* -------- Defaults -------- */

function getDefaultSettings() {
  return {
    theme: "light",
    language: "en",
    currency: "inr",

    defaultCategory: "general",
    defaultQty: "1",
    showOutOfStock: true,

    notificationsEnabled: true,
    reminderTime: "08:00 AM",
    lowStockAlert: true,

    hasSeenOnboarding: false,
  };
}
