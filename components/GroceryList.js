import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  LayoutAnimation,
} from "react-native";
import { useMemo, useState, useRef, useCallback } from "react";

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
import { not } from "firebase/firestore/pipelines";

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
          swipeableRefs?.current?.close();
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

  const FiltersUI = useCallback(
    () => (
      <View
        style={[styles.filtersWrapper, { backgroundColor: theme.colors.card }]}
      >
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
          <Text style={[styles.labelText, { color: theme.colors.text }]}>
            Showing {filteredItems.length} of {groceryItems.length} items
          </Text>
        </View>
        <View style={styles.filterTop}>
          <TextInput
            placeholder="Search Grocery Items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                padding: 10,
                borderRadius: 8,
                borderColor: theme.colors.border,
                placeholderTextColor: theme.colors.text,
              },
            ]}
            placeholderTextColor={theme.colors.text}
          />
        </View>

        <View
          style={[
            styles.filterRow,
            {
              backgroundColor: theme.colors.background,
              borderBottomColor: theme.colors.border,
            },
          ]}
        >
          <Buttons
            active={filter === "all"}
            pressBtn={() => {
              LayoutAnimation.easeInEaseOut();
              setFilter("all");
            }}
          >
            All
          </Buttons>
          <Buttons
            active={filter === "toBuy"}
            pressBtn={() => {
              LayoutAnimation.easeInEaseOut();
              setFilter("toBuy");
            }}
          >
            To Buy
          </Buttons>
          <Buttons
            active={filter === "brought"}
            pressBtn={() => {
              LayoutAnimation.easeInEaseOut();
              setFilter("brought");
            }}
          >
            Bought
          </Buttons>
        </View>
      </View>
    ),
    [filter, category, searchQuery],
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => renderRightActions(item.id)}
            ref={(ref) => (swipeableRefs.current[item.id] = ref)}
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
        ListHeaderComponent={FiltersUI}
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
  filtersWrapper: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    paddingBottom: 14,
    marginBottom: 4,
    zIndex: 10,
  },
  notFoundWrapper: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    alignItems: "center",
    transform: [{ translateY: "-50%" }],
  },
  filterCatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    marginBottom: 10,
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
  searchInput: {
    fontSize: 14,
    borderWidth: 1,
  },
});
