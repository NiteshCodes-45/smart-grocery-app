import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "./store/theme-context";
import { DefaultTheme, DarkTheme, NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, ImageBackground, View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GroceryContextProvider } from "./store/grocery-context";
import RootNavigation from "./screens/RootNavigation";
import { AuthProvider } from "./store/auth-context";
import { SettingsProvider } from "./store/settings-context";
import { ShoppingProvider } from "./store/shopping-context";
import { NetworkProvider } from "./store/network-context";
import { ErrorBoundary } from "./ErrorBoundary";

let baseTheme; 

function NavigationWrapper() {
  const { themeMode, theme } = useTheme();

  baseTheme = themeMode === "dark" ? DarkTheme : DefaultTheme;

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

function TestingComponent() {
  return(
    <View style={styles.person}>
      <Text>Testing Component</Text>
      <Text>Name: John Doe</Text>
      <Text>Age: 30</Text>
    </View>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <ErrorBoundary>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <NetworkProvider>
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
                        <ShoppingProvider>
                          <NavigationWrapper />
                        </ShoppingProvider>
                      </GroceryContextProvider>
                    </ImageBackground>
                  </ThemeProvider>
                </SettingsProvider>
              </AuthProvider>
            </NetworkProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ErrorBoundary>
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
