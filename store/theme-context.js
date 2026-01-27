import { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import { LightTheme, DarkTheme } from "../theme/themes";
import { useSettings } from "./settings-context";

const ThemeContext = createContext({
  theme: LightTheme,
  themeMode: "light",
  setThemeMode: () => {},
});

export function ThemeProvider({ children }) {
  const { settings } = useSettings();
  const systemTheme = Appearance.getColorScheme();

  const [themeMode, setThemeMode] = useState("light");
  const [theme, setTheme] = useState(LightTheme);

  useEffect(() => {
    if (!settings?.theme) return;
    setThemeMode(settings.theme);
  }, [settings?.theme]);

  useEffect(() => {
    if (themeMode === "dark") {
      setTheme(DarkTheme);
    } else if (themeMode === "system") {
      setTheme(systemTheme === "dark" ? DarkTheme : LightTheme);
    } else {
      setTheme(LightTheme);
    }
  }, [themeMode, systemTheme]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
