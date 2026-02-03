import { View } from "react-native";
import { useTheme } from "../store/theme-context";
import { useGrocery } from "../store/grocery-context";
import GroceryList from "../components/GroceryList";
import OnboardingGuide from "../components/landingPages/OnboardingGuide";

function Home({ categories }) {
  const { theme } = useTheme();
  const { groceryItems } = useGrocery();
  const groceryItemsCount = groceryItems.length;
  
  // if (__DEV__) console.log("Home groceryItems:", groceryItems);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* <GroceryHeader /> */}
      {groceryItems.length == 0 && (
        <>
          <OnboardingGuide />
          {/* <NotFoundItem>No grocery items added yet. Please add some.</NotFoundItem> */}
        </>
      )}
      {groceryItems.length > 0 && (
        <GroceryList
          groceryItems={groceryItems}
          categories={categories}
          groceryItemsCount={groceryItemsCount}
        />
      )}
    </View>
  );
}

export default Home;
