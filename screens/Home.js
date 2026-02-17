import { View } from "react-native";
import { useTheme } from "../store/theme-context";
import { useGrocery } from "../grocery/grocery-context";
import GroceryList from "../components/GroceryList";
import OnboardingGuide from "../components/landingPages/OnboardingGuide";
import NotFoundItem from "../components/NotFoundItem";
import { useSettings } from "../store/settings-context";
import GroceryListSkeleton from "../components/skeletons/GroceryListSkeleton";

function Home({ categories, navigation }) {
  const { theme } = useTheme();
  const { settings, isSettingsLoading, markOnboardingSeen } = useSettings();
  const { groceryItems, isSyncing } = useGrocery();
  const groceryItemsCount = groceryItems.length;
  
  const isInitialLoading = isSyncing || isSettingsLoading;

  let content = null;

  if (
    settings?.hasSeenOnboarding === false &&
    groceryItems.length === 0
  ) {
    content = (
      <OnboardingGuide
        onFinish={(action) => {
          markOnboardingSeen();
          if (action === "ADD_GROCERY") {
            navigation.navigate("AddGrocery");
          }
        }}
      />
    );
  } else if (isInitialLoading) {
    content = <GroceryListSkeleton />;
  } else if (groceryItems.length > 0) {
    content = (
      <GroceryList
        groceryItems={groceryItems}
        categories={categories}
        groceryItemsCount={groceryItemsCount}
      />
    );
  } else {
    content = <NotFoundItem>No grocery items found</NotFoundItem>;
  }  

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* <GroceryHeader /> */}
      {content}
    </View>
  );
}

export default Home;
