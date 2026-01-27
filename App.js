import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "./store/theme-context";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, ImageBackground } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GroceryContextProvider } from "./store/grocery-context";
import RootNavigation from "./screens/RootNavigation";
import { AuthProvider } from "./store/auth-context";
import { SettingsProvider } from "./store/settings-context";

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
                  <NavigationContainer>
                    <RootNavigation />
                  </NavigationContainer>
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
