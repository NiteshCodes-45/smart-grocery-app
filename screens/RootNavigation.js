import LandingScreen from "../screens/LandingScreen";
import AppNavigator from "../screens/AppNavigator";
import SplashScreen from "../screens/SplashScreen";
import { useGrocery } from "../store/grocery-context";

export default function RootNavigation() {
  const { isSessionLoading, isAuthenticated } = useGrocery();

  //console.log("ROOT:", { isSessionLoading, isAuthenticated });

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
