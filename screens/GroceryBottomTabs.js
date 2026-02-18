import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from "../store/theme-context";
import { useGrocery } from "../grocery/grocery-context";
import Settings from "../screens/Settings";
import IconButton from "../components/UI/IconButton";
import Profile from "../screens/Profile";
import GroceryList from "../components/GroceryList";
import ShoppingListScreen from "../components/ShoppingListScreen";
import Dashboard from "./Dashboard";
import { Image } from "react-native";

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
  const { groceryItems } = useGrocery();
  const groceryItemsCount = groceryItems.length;

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
        name="DashboardTab"
        options={({ navigation }) => ({
          title: "Smart Grocery",
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerLeft: ({ tintColor }) => (
            <Image
              source={require("../assets/logo/logo-48.png")}
              style={{height:28, marginHorizontal:3}}
              resizeMode="contain"
            />
          ),
        })}
      >
        {(props) => <Dashboard />}
      </BottomTabs.Screen>
      <BottomTabs.Screen
        name="HomeTab"
        options={({ navigation }) => ({
          title: "Grocery",
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
        {(props) => (
          <GroceryList
            groceryItems={groceryItems}
            categories={categories}
            groceryItemsCount={groceryItemsCount}
          />
        )}
      </BottomTabs.Screen>

      <BottomTabs.Screen
        name="ShoppingListTab"
        options={{
          title: "Shopping List",
          tabBarLabel: "Shopping",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      >
        {(props) => <ShoppingListScreen {...props} />}
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
        {(props) => <Profile />}
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