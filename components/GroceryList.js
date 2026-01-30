import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useMemo, useState } from "react";
import Checkbox from "expo-checkbox";
import { useTheme } from "../store/theme-context";
import { useGrocery } from "../store/grocery-context";
import { useShopping } from "../store/shopping-context";
import CategoryDropdown from "../components/CategoryDrodown";
import Buttons from "../components/Buttons";
import NotFoundItem from "../components/NotFoundItem";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function GroceryListScreen({ groceryItems, categories }) {
  const { theme } = useTheme();
  const { addItemToSession, isItemInActiveSession } = useShopping();
  const navigation = useNavigation();

  const [category, setCategory] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filter, setFilter] = useState("all"); // all | toBuy | brought

  const {
    removeGroceryItem,
    addToBroughtItem,
    getToBuyItems,
    getBroughtItems,
  } = useGrocery();

  const filteredItems = useMemo(() => {
    let items = groceryItems;

    if (category && category !== "All") {
      items = items.filter(i => i.category === category);
    }

    if (filter === "toBuy") items = getToBuyItems();
    if (filter === "brought") items = getBroughtItems();

    return items;
  }, [groceryItems, category, filter]);

  function editItemHandler(id) {
    navigation.navigate("Edit Grocery", { itemId: id });
  }

  function addItemToSessionHandler(item) {
    addItemToSession(item);
    Alert.alert("Added", `${item.name} added to shopping list ✅`);
  }

  function removeGroceryItemHandler(itemId) {
    Alert.alert(
      "Confirm Remove",
      "Are you sure you want to remove this item from the grocery list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove", 
          style: "destructive",
          onPress: () => removeGroceryItem(itemId),
        },
      ]
    );
  }

  return (
    <View style={{ flex: 1 }}>
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
          Showing {filteredItems.length} of {groceryItems.length} items
        </Text>
      </View>

      <View style={[styles.filterRow, { backgroundColor: theme.colors.card }]}>
        <Buttons pressBtn={() => setFilter("all")}>All</Buttons>
        <Buttons pressBtn={() => setFilter("toBuy")}>To Buy</Buttons>
        <Buttons pressBtn={() => setFilter("brought")}>Brought</Buttons>
      </View>

      {filteredItems.length === 0 && (
        <NotFoundItem>No grocery items found</NotFoundItem>
      )}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => editItemHandler(item.id)}>
            <View style={[styles.item, { backgroundColor: theme.colors.card }]}>
              <View style={styles.left}>
                <Checkbox
                  value={item.checked}
                  onValueChange={() => addToBroughtItem(item.id)}
                  color={item.checked ? "#4CAF50" : undefined}
                />
                <View>
                  <Text style={{ color: theme.colors.text }}>{item.name}</Text>
                  <Text style={{ color: theme.colors.text }}>
                    Qty: {item.qty} {item.unit ? item.unit : "pcs"}
                  </Text>
                </View>
              </View>
              <View style={styles.shoppingBtn}>
                <Pressable
                  onPress={() => addItemToSessionHandler(item)}
                  style={styles.iconBtn}
                >
                  <Ionicons
                    name={isItemInActiveSession(item.id) ? "checkmark-circle" : "add-circle-outline"}
                    size={26}
                    color={isItemInActiveSession(item.id) ? "#4CAF50" : "#4CAF50"}
                  />
                  <Text style={styles.addText}>{isItemInActiveSession(item.id) ? "Added" : "Add"}</Text>
                </Pressable>
                <Pressable
                  onPress={() => removeGroceryItemHandler(item.id)}
                  style={styles.removeBtn}
                >
                  {/* <Text style={styles.removeText}>Remove</Text> */}
                  <Ionicons name="trash-outline" size={20} color="#f31282" />
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterCatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
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
  filterTop: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  count: {
    marginTop: 8,
    fontSize: 12,
    color: "#aaa",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  item: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  shoppingBtn: {
    flexDirection: "row",    alignItems: "center",
    gap: 25,
  },
  iconBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  removeBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: {
    color: "#f31282",
    fontSize: 12,
    fontWeight: "600",
  },
  addText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
});
