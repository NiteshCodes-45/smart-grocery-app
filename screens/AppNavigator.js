import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../store/theme-context";
import { useAuth } from "../store/auth-context";
import GroceryBottomTabs from "./GroceryBottomTabs";
import { categories } from "../data/Constant";
import SessionHistoryScreen from "./SessionHistoryScreen";
import SessionDetailScreen from "./SessionDetailScreen";
import AboutSmartGrocery from "../components/settings/AboutSmartGrocery";
import AddGroceryForm from "../components/AddGroceryForm";
import Settings from "./Settings";
import HeroSection from "../components/landingPages/HeroSection";
import EachGrocerySessionDetailScreen from "../components/sessionHistory/EachGrocerySessionDetailScreen";
import Register from "../components/landingPages/Signup";
import LandingScreen from "./LandingScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={HeroSection} />
          <Stack.Screen name="Register" component={Register} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Smart Grocery"
            component={GroceryBottomTabs}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Edit Grocery"
            options={{
              headerStyle: { backgroundColor: "#2F6F4E" },
              headerTintColor: "#FFFFFF",
              tabBarStyle: { backgroundColor: "#2F6F4E" },
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#CFE3D6",
              sceneContainerStyle: {
                backgroundColor: "#F3F7F4",
              },
            }}
          >
            {(props) => (
              <AddGroceryForm
                {...props}
                categories={categories}
                isEditMode={true}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="AddGrocery"
            options={{
              title: "Add Grocery",
              headerStyle: { backgroundColor: "#2F6F4E" },
              headerTintColor: "#FFFFFF",
              tabBarStyle: { backgroundColor: "#2F6F4E" },
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#CFE3D6",
              sceneContainerStyle: {
                backgroundColor: "#F3F7F4",
              },
            }}
          >
            {(props) => <AddGroceryForm {...props} categories={categories} />}
          </Stack.Screen>

          <Stack.Screen name="Settings" component={Settings} />

          <Stack.Screen
            name="Shopping History"
            component={SessionHistoryScreen}
          />

          <Stack.Screen
            name="Session Details"
            component={SessionDetailScreen}
          />

          <Stack.Screen name="Grocery Session Details" component={EachGrocerySessionDetailScreen} />

          <Stack.Screen name="About" component={AboutSmartGrocery} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator;
