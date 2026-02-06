import { View } from "react-native";
import { useTheme } from "../store/theme-context";
import { useGrocery } from "../store/grocery-context";
import GroceryList from "../components/GroceryList";
import OnboardingGuide from "../components/landingPages/OnboardingGuide";
import NotFoundItem from "../components/NotFoundItem";
import { useSettings } from "../store/settings-context";

function Home({ categories, navigation }) {
  const { theme } = useTheme();
  const { settings, isSettingsLoading, markOnboardingSeen } = useSettings();
  const { groceryItems, isSyncing } = useGrocery();
  const groceryItemsCount = groceryItems.length;
  
  // if (__DEV__) console.log("Home groceryItems:", groceryItems);

  const shouldShowOnboarding =
    !isSyncing &&
    !isSettingsLoading &&
    settings?.hasSeenOnboarding === false &&
    groceryItems.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* <GroceryHeader /> */}
      {isSyncing && (
        <>
          <NotFoundItem>Loading grocery items...</NotFoundItem>
        </>
      )}
      {shouldShowOnboarding && (
        <OnboardingGuide
          onFinish={(action) => {
            markOnboardingSeen();

            if (action === "ADD_GROCERY") {
              navigation.navigate("AddGrocery"); // or open modal
            }
          }}
        />
      )}

      {!isSyncing && groceryItems.length > 0 && (
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
