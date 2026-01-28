import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "./store/theme-context";
import { DefaultTheme, DarkTheme, NavigationContainer } from "@react-navigation/native";
import { StyleSheet, ImageBackground } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GroceryContextProvider } from "./store/grocery-context";
import RootNavigation from "./screens/RootNavigation";
import { AuthProvider } from "./store/auth-context";
import { SettingsProvider } from "./store/settings-context";

function NavigationWrapper() {
  const { themeMode, theme } = useTheme();

  const baseTheme =
    themeMode === "dark" ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.primary,
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootNavigation />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />

      <SafeAreaProvider>
        <AuthProvider>
          <SettingsProvider>
            <ThemeProvider>
              <ImageBackground
                source={require("./assets/images/GroceryBg.jpg")}
                resizeMode="cover"
                style={styles.mainContainer}
                imageStyle={{ opacity: 0.25 }}
              >
                <GroceryContextProvider>
                  <NavigationWrapper />
                </GroceryContextProvider>
              </ImageBackground>
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#8ba183ff",
  },
  person:{
    marginHorizontal:10
  }
});
