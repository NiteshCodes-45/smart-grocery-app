import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from '@expo/vector-icons/Ionicons';
import Home from "../screens/Home";
import Settings from "../screens/Settings";
import IconButton from "../components/UI/IconButton";
import Profile from "../screens/Profile";
import { useTheme } from "../store/theme-context";
import ShoppingListScreen from "../components/ShoppingListScreen";

const BottomTabs = createBottomTabNavigator();

const categories = [
  { label: "All", value: "" },
  { label: "General", value: "general" },
  { label: "Dairy", value: "dairy" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Fruits", value: "fruits" },
  { label: "Snacks", value: "snacks" },
  { label: "Beverages", value: "beverages" },
];

export default function GroceryBottomTabs() {
  const {theme} = useTheme();
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
      }}
    >
      <BottomTabs.Screen
        name="HomeTab"
        options={({ navigation }) => ({
          title: "Smart Grocery",
          tabBarLabel: "Grocery",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="add-circle"
              size={25}
              color={tintColor}
              onPress={() => {
                navigation.navigate("AddGrocery");
              }}
            />
          ),
        })}
      >
        {(props) => <Home {...props} categories={categories} />}
      </BottomTabs.Screen>

      <BottomTabs.Screen
        name="ShoppingListTab"
        options={{
          title: "Shopping List",
          tabBarLabel: "Shopping List",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      >
        {(props) => <ShoppingListScreen {...props} /> }
      </BottomTabs.Screen>

      <BottomTabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      >
        {(props) => <Profile /> }
      </BottomTabs.Screen>

      <BottomTabs.Screen
        name="SettingsTab"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      >
        {(props) => <Settings />}
      </BottomTabs.Screen>
    </BottomTabs.Navigator>
  );
}