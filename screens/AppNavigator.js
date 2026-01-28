import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddGroceryForm from "../components/AddGroceryForm";
import { useTheme } from "../store/theme-context";
import GroceryBottomTabs from "./GroceryBottomTabs";

const Stack = createNativeStackNavigator();

const categories = [
  { label: "All", value: "" },
  { label: "General", value: "general" },
  { label: "Dairy", value: "dairy" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Fruits", value: "fruits" },
  { label: "Snacks", value: "snacks" },
  { label: "Beverages", value: "beverages" },
];

function AppNavigator() {
  const { theme } = useTheme();
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
