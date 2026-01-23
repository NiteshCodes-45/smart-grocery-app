import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { LightTheme, DarkTheme } from "../theme/themes";

const ThemeContext = createContext({
  theme: LightTheme,
  themeMode: "light",
  setThemeMode: () => {},
});

const STORAGE_KEY = "APP_THEME";

export function ThemeProvider({ children }) {
  const systemTheme = Appearance.getColorScheme();
  const [themeMode, setThemeMode] = useState("light");
  const [theme, setTheme] = useState(LightTheme);

  /* Load saved theme */
  useEffect(() => {
    async function loadTheme() {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const mode = saved || "light";
      applyTheme(mode);
    }
    loadTheme();
  }, []);

  function applyTheme(mode) {
    setThemeMode(mode);

    if (mode === "dark") {
      setTheme(DarkTheme);
    } else if (mode === "system") {
      setTheme(systemTheme === "dark" ? DarkTheme : LightTheme);
    } else {
      setTheme(LightTheme);
    }

    AsyncStorage.setItem(STORAGE_KEY, mode);
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode: applyTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
