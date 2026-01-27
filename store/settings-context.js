import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./auth-context";

const SettingsContext = createContext(null);

function getSettingsKey(email) {
  return `USER_SETTINGS_${encodeURIComponent(email.toLowerCase())}`;
}

export function SettingsProvider({ children }) {
  const { currentUser } = useAuth();

  const [settings, setSettings] = useState(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);

  /* -------- Load settings per user -------- */
  useEffect(() => {
    async function loadSettings() {
      if (!currentUser?.email) {
        setSettings(null);
        return;
      }

      setIsSettingsLoading(true);

      const key = getSettingsKey(currentUser.email);
      const stored = await AsyncStorage.getItem(key);

      setSettings(stored ? JSON.parse(stored) : getDefaultSettings());
      setIsSettingsLoading(false);
    }

    loadSettings();
  }, [currentUser]);

  /* -------- Persist settings -------- */
  useEffect(() => {
    if (!currentUser?.email || !settings) return;

    const key = getSettingsKey(currentUser.email);
    AsyncStorage.setItem(key, JSON.stringify(settings));
  }, [settings, currentUser]);

  function updateSetting(key, value) {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function resetSettings() {
    setSettings(getDefaultSettings());
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        isSettingsLoading,
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
  };
}
