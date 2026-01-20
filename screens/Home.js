import { View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useGrocery } from "../store/grocery-context";
import GroceryHeader from "../screens/GroceryHeader";
import FilterGrocery from "../components/FilterGrocery";
import GroceryList from "../components/GroceryList";
import NotFoundItem from "../components/NotFoundItem";

function Home({ navigation, categories }) {
  const { groceryItems } = useGrocery();
  const groceryItemsCount = groceryItems.length;

  useEffect(() => {
    console.log("Home groceryItems:", groceryItems);
  }, [groceryItems]);

  return (
    <View style={{ flex: 1, backgroundColor: "#8ba183ff" }}>
      {/* <GroceryHeader /> */}
      {groceryItems.length == 0 && (
        <NotFoundItem>No grocery items added yet. Please add some.</NotFoundItem>
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

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#8ba183ff",
  },
});

export default Home;
