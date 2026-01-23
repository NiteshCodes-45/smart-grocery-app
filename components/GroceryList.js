import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { useMemo, useState } from "react";
import { useTheme } from "../store/theme-context";
import Checkbox from "expo-checkbox";
import Buttons from "./Buttons";
import CategoryDropdown from "./CategoryDrodown";
import { useGrocery } from "../store/grocery-context";
import NotFoundItem from "./NotFoundItem";
import { useNavigation } from "@react-navigation/native";

export default function GroceryList({
  groceryItems,
  categories,
}) {
  const { theme } = useTheme();
  const [category, setCategory] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const { removeGroceryItem, addToBroughtItem, getBroughtItems, getToBuyItems } = useGrocery();

  const [filter, setFilter] = useState("all"); // "all" | "brought" | "toBuy"

  const navigation = useNavigation();

  const filteredItems = useMemo(() => {
    let items = groceryItems;

    if (category && category !== "All") {
      items = items.filter(item => item.category === category);
    }

    if (filter === "brought") {
      items = getBroughtItems();
    }

    if (filter === "toBuy") {
      items = getToBuyItems();
    }

    return items;
  }, [groceryItems, category, filter]);

  // const options = useMemo(() => {
  //   const seen = new Set();
  //   return filteredItems.filter(item => {
  //     if (seen.has(item.name)) return false;
  //     seen.add(item.name);
  //     return true;
  //   });
  // }, [filteredItems]);

  const options = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
        if (!acc.find(opt => opt.label === item.name)) {
          acc.push({ id: item.id, label: item.name, qty:item.qty, category:item.category, checked: item.checked });
        }
        return acc;
      }, []);
  }, [filteredItems]);

  // function selectedToggleOption(id) {
  //   addToBroughtItem(id);
  //   setToggleOption((currentOptions) =>
  //     currentOptions.map((option) =>
  //       option.id === id
  //         ? { ...option, checked: !option.checked }
  //         : option
  //     )
  //   );
  // }

  function selectedToggleOption(id) {
    addToBroughtItem(id); // context updates groceryItems
  }

  function handleRemove(itemId) {
    const itemToRemove = options.find(item => item.id === itemId);
    if (itemToRemove) {
      removeGroceryItem(itemId);
    }
  }

  function editItemHandler(id) {
    const itemToEdit = groceryItems.find(item => item.id === id);
    if (itemToEdit) {
      navigation.navigate("Edit Grocery", { itemId: id });
    }
  }

  return (
    <>
      <View style={styles.filterCatContainer}>
        <View style={styles.dropdownWrapper}>
          <CategoryDropdown
            cats={categories}
            value={category}
            setCategory={setCategory}
            open={openDropdown === "category"}
            setOpen={(isOpen) => setOpenDropdown(isOpen ? "category" : null)}
            placeholder="Select Category"
            zIndex={3000}
            zIndexInverse={1000}
          />
        </View>
        <Text style={styles.labelText}>
          Showing {options.length} of {groceryItems.length} items
        </Text>
      </View>

      <View style={[styles.filterContainer, {backgroundColor:theme.colors.card}]}>
        <View style={styles.filterViewContainer}>
          <Buttons pressBtn={() => setFilter("all")}>All</Buttons>
          <Buttons pressBtn={() => setFilter("toBuy")}>To Buy</Buttons>
          <Buttons pressBtn={() => setFilter("brought")}>Brought</Buttons>
        </View>
      </View>

      {options.length === 0 && (
        <NotFoundItem>No grocery items found.</NotFoundItem>
      )}

      <View style={styles.checkTopContainer}>
        <FlatList
          data={options}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable android_ripple={{ color: "#ccc" }} onPress={() => editItemHandler(item.id)}>
              <View style={[styles.individualCheckContainer, {backgroundColor:theme.colors.card}]}>
                <View style={styles.checkContainer}>
                  <Checkbox
                    value={item.checked}
                    onValueChange={() => selectedToggleOption(item.id)}
                    color={item.checked ? "#4CAF50" : undefined}
                  />
                  <Text style={[styles.label, {color:theme.colors.text}]}>{item.label} (Qty: {item.qty})</Text>
                </View>
                <Buttons pressBtn={() => handleRemove(item.id)} color="#f31282">
                  Remove
                </Buttons>
              </View>
            </Pressable>
          )}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  checkTopContainer: {
    flex: 1,
  },
  individualCheckContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 25,
    borderRadius: 5,
  },
  checkContainer: {
    flexDirection: "row",
    gap: 16,
  },
  label: {
    fontSize: 13,
  },
  filterCatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  dropdownWrapper: {
    flex: 1,
    width: 350,
  },
  labelText: {
    color: "#fff",
    fontSize: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  filterContainer: {
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: "#afcfa3ff",
    elevation: 20,
  },
  filterViewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center",
    gap:16,
    padding:10,
  },
});
