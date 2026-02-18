import LandingScreen from "../screens/LandingScreen";
import AppNavigator from "../screens/AppNavigator";
//import SplashScreen from "../screens/SplashScreen";
import { useAuth } from "../store/auth-context";

import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

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

  // Only AFTER loading is finished
  if (!isAuthenticated) {
    return <LandingScreen />;
  }

  return <AppNavigator />;
}
