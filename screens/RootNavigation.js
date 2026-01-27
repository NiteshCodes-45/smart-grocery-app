import LandingScreen from "../screens/LandingScreen";
import AppNavigator from "../screens/AppNavigator";
import SplashScreen from "../screens/SplashScreen";
import { useAuth } from "../store/auth-context";

export default function RootNavigation() {
  const { isSessionLoading, isAuthenticated } = useAuth();

  //ABSOLUTE BLOCK
  if (isSessionLoading) {
    return <SplashScreen />;
  }

  // Only AFTER loading is finished
  if (!isAuthenticated) {
    return <LandingScreen />;
  }

  return <AppNavigator />;
}
