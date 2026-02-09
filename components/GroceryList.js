import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert
} from "react-native";
import { useMemo, useState, useRef } from "react";

import { useTheme } from "../store/theme-context";
import { useNetwork } from "../store/network-context";
import { useGrocery } from "../store/grocery-context";
import { useShopping } from "../store/shopping-context";
import { useAuth } from "../store/auth-context";
import NotFoundItem from "../components/NotFoundItem";
import FilterGrocery from "../components/FilterGrocery";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Swipeable } from "react-native-gesture-handler";

export default function GroceryListScreen({ groceryItems, categories }) {
  const { theme } = useTheme();
  const { isOnline } = useNetwork();
  const { removeGroceryItem, isSyncing } = useGrocery();
  const { addItemToSession, isItemInActiveSession } = useShopping();
  const navigation = useNavigation();
  const { currentUser } = useAuth();

  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filter, setFilter] = useState("all"); // all | toBuy | brought
  const swipeableRefs = useRef({});
  const lastOpenedRef = useRef(null);

  if (!currentUser?.uid) {
    return <NotFoundItem>Session expired. Please login again.</NotFoundItem>;
  }

  const filteredItems = useMemo(() => {
    if (!groceryItems) return [];

    let items = [...groceryItems];

    // 1️⃣ Status filter
    if (filter === "toBuy") {
      items = items.filter((i) => !i.isBought);
    }

    if (filter === "brought") {
      items = items.filter((i) => i.isBought);
    }

    // 2️⃣ Category filter
    if (category && category !== "All") {
      items = items.filter((i) => i.category === category);
    }

    // 3️⃣ Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(query));
    }

    return items;
  }, [groceryItems, filter, category, searchQuery]);

  function editItemHandler(id) {
    navigation.navigate("Edit Grocery", { itemId: id });
  }

  function addItemToSessionHandler(item) {
    addItemToSession(item);
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
          swipeableRefs.current[id]?.close();
          removeGroceryItemHandler(id);
        }}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    );
  }

  {
    !isOnline && <Text style={{ color: "orange" }}>Offline mode</Text>;
  }

  {
    isSyncing && <Text style={{ color: "blue" }}>Syncing…</Text>;
  }

  if (groceryItems.length === 0) {
    return (
      <NotFoundItem>
        No groceries yet 🛒
        {"\n"}Tap + to add your first item
      </NotFoundItem>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => renderRightActions(item.id)}
            ref={(ref) => {
              if (ref) {
                swipeableRefs.current[item.id] = ref;
              }
            }}
          >
            {/* <Pressable onLongPress={() => {Alert.alert("Quick actions","",[{ text: "Edit", onPress: () => editItemHandler(item.id) },{ text: "Add to Shopping", onPress: () => addItemToSessionHandler(item) },]);}}></Pressable> */}
            <View style={[styles.item, { backgroundColor: theme.colors.card }]}>
              <View style={styles.left}>
                <View>
                  <Text style={{ color: theme.colors.text, fontWeight:600, fontSize:14 }}>{item.name}</Text>
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
                  style={[
                    styles.iconBtn,
                    isItemInActiveSession(item.id) && styles.addedChip,
                  ]}
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
                  <Text style={styles.addText}>
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
        ListHeaderComponent={
          <FilterGrocery 
            theme={theme}
            categories={categories}
            category={category}
            setCategory={setCategory}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filter={filter}
            setFilter={setFilter}
            filteredCount={filteredItems.length}
            totalCount={groceryItems.length}
          />
        }
        stickyHeaderIndices={[0]}
      />
      {filteredItems.length === 0 && (
        <View style={styles.notFoundWrapper}>
          <NotFoundItem>No grocery items found</NotFoundItem>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  notFoundWrapper: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    alignItems: "center",
    transform: [{ translateY: "-50%" }],
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
    flexDirection: "row",
    alignItems: "center",
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
  addedChip: {
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
});
