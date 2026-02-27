import { useEffect } from "react";
import LandingScreen from "../screens/LandingScreen";
import AppNavigator from "../screens/AppNavigator";
import { useAuth } from "../store/auth-context";
import * as SplashScreen from "expo-splash-screen";
//import SplashScreen from "../screens/SplashScreen";

export default function RootNavigation() {
  const { isSessionLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isSessionLoading) {
      SplashScreen.hideAsync();
    }
  }, [isSessionLoading]);

  if (isSessionLoading) {
    return null; // important: render nothing
  }

  return <AppNavigator />;
}
