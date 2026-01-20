import LandingScreen from "../screens/LandingScreen";
import AppNavigator from "../screens/AppNavigator";
import { useGrocery } from "../store/grocery-context";

export default function RootNavigation() {
  const {isAuthenticated} = useGrocery();

  return isAuthenticated ? <AppNavigator /> : <LandingScreen />;
}
