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
  const settingsCtx = useSettings();
  const systemTheme = Appearance.getColorScheme();

  const [themeMode, setThemeMode] = useState("light");
  const [theme, setTheme] = useState(LightTheme);

  // Apply user setting when it arrives
  useEffect(() => {
    if (settingsCtx?.settings?.theme) {
      setThemeMode(settingsCtx.settings.theme);
    }
  }, [settingsCtx?.settings?.theme]);

  // Resolve actual theme
  useEffect(() => {
    let resolvedTheme = LightTheme;

    if (themeMode === "dark") {
      resolvedTheme = DarkTheme;
    } else if (themeMode === "system") {
      resolvedTheme =
        systemTheme === "dark" ? DarkTheme : LightTheme;
    }

    setTheme(resolvedTheme);
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
