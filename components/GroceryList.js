import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useMemo, useState, useRef } from "react";

import { useTheme } from "../store/theme-context";
import { useNetwork } from "../store/network-context";
import { useGrocery } from "../store/grocery-context";
import { useShopping } from "../store/shopping-context";
import { useAuth } from "../store/auth-context";
import CategoryDropdown from "../components/CategoryDrodown";
import Buttons from "../components/Buttons";
import NotFoundItem from "../components/NotFoundItem";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Swipeable } from "react-native-gesture-handler";

export default function GroceryListScreen({ groceryItems, categories }) {
  const { theme } = useTheme();
  const { isOnline } = useNetwork();
  const { removeGroceryItem, getToBuyItems, getBroughtItems, isSyncing } =
    useGrocery();
  const { addItemToSession, isItemInActiveSession } = useShopping();
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  const [category, setCategory] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filter, setFilter] = useState("all"); // all | toBuy | brought
  const swipeableRef = useRef(null);

  if (!currentUser?.uid) {
    return <NotFoundItem>Session expired. Please login again.</NotFoundItem>;
  }

  const filteredItems = useMemo(() => {
    let items = groceryItems;

    if (category && category !== "All") {
      items = items.filter((i) => i.category === category);
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
    if (isItemInActiveSession(itemId)) {
      Alert.alert(
        "Cannot Delete",
        "This item is used in an active shopping session.",
      );
      return;
    }
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
      ],
    );
  }

  function renderRightActions(id) {
    return (
      <Pressable
        style={styles.deleteBox}
        onPress={() => {
          swipeableRef?.current?.close();
          removeGroceryItemHandler(id);
        }}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    );
  }

  if (!isOnline) {
    return <Text style={{ color: "orange" }}>Offline mode</Text>;
  }

  if (isSyncing) {
    return <Text style={{ color: "blue" }}>Syncing…</Text>;
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
        <Buttons pressBtn={() => setFilter("brought")}>Bought</Buttons>
      </View>

      {filteredItems.length === 0 && (
        <NotFoundItem>No grocery items found</NotFoundItem>
      )}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => renderRightActions(item.id)}
            ref={swipeableRef}
          >
            <View style={[styles.item, { backgroundColor: theme.colors.card }]}>
              <View style={styles.left}>
                <View>
                  <Text style={{ color: theme.colors.text }}>{item.name}</Text>
                  <Text
                    style={{
                      color: theme.colors.text,
                      fontSize: 12,
                      textTransform: "capitalize",
                    }}
                  >
                    Qty: {item.qty} {item.unit ? item.unit : "pcs"} ~{" "}
                    {item.category}
                  </Text>
                </View>
              </View>
              <View style={styles.shoppingBtn}>
                <Pressable
                  onPress={() => addItemToSessionHandler(item)}
                  style={styles.iconBtn}
                >
                  <Ionicons
                    name={
                      isItemInActiveSession(item.id)
                        ? "checkmark-circle"
                        : "add-circle-outline"
                    }
                    size={24}
                    color={
                      isItemInActiveSession(item.id) ? "#4CAF50" : "#4CAF50"
                    }
                  />
                  <Text style={[styles.addText, { color: theme.colors.text }]}>
                    {isItemInActiveSession(item.id) ? "Added" : "Add"}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.iconBtn}
                  onPress={() => editItemHandler(item.id)}
                >
                  <Ionicons name="pencil-outline" size={24} color="#4CAF50" />
                  <Text style={[styles.addText, { color: theme.colors.text }]}>
                    Edit
                  </Text>
                </Pressable>
              </View>
            </View>
          </Swipeable>
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
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
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
    fontWeight: "600",
  },
  deleteBox: {
    backgroundColor: "#E63946",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginVertical: 8,
    marginHorizontal: 18,
    borderRadius: 12,
  },
  deleteText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});
