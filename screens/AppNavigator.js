import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Ionicons from '@expo/vector-icons/Ionicons';

import Home from "../screens/Home";
import AddGroceryForm from "../components/AddGroceryForm";
import Settings from "../screens/Settings";
import IconButton from "../components/UI/IconButton";
import Profile from "../screens/Profile";

const Stack = createNativeStackNavigator();
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

function GroceryOverview() {
  return (
    <BottomTabs.Navigator
      screenOptions={{
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

function AppNavigator() {
  return (
    <Stack.Navigator
    // screenOptions={{
    //   headerStyle: { backgroundColor: "#4a7c59ff" },
    //   headerTintColor: "white",
    //   contentStyle: { backgroundColor: "#8ba183ff" },
    // }}
    >
      <Stack.Screen
        name="Smart Grocery"
        component={GroceryOverview}
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
          title:"Add Grocery",
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
    </Stack.Navigator>
  );
}

export default AppNavigator;
