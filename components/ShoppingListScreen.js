import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useEffect } from "react";
import { useTheme } from "../store/theme-context";
import { useShopping } from "../store/shopping-context";
import QuantityButtons from "../components/QuantityButtons";
import NotFoundItem from "../components/NotFoundItem";

export default function ShoppingListScreen() {
  const { theme } = useTheme();

  const {
    activeSession,
    startSession,
    getActiveSessionItems,
    updateQuantity,
    updatePrice,
    toggleBought,
    completeSession,
    getSessionTotal,
    removeItem
  } = useShopping();

  // Auto-start session
  useEffect(() => {
    if (!activeSession) {
      startSession();
    }
  }, []);

  if (!activeSession) return null;

  const items = getActiveSessionItems();
  const total = getSessionTotal(activeSession.id);

  console.log("ITEM", items);

  function finishShopping() {
    if (items.length === 0) {
      Alert.alert("Nothing to finish", "Your shopping list is empty");
      return;
    }

    completeSession(activeSession.id);
    Alert.alert("Done", "Shopping session completed ✅");
  }

  function removeItemHandler(itemId) {
    Alert.alert(
      "Confirm Remove",
      "Are you sure you want to remove this item from the shopping list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeItem(itemId),
        },
      ]
    );
  }

  if (items.length === 0) {
    return (
      <NotFoundItem>
        No items added yet.  
        Go to Grocery list and add items 🛒
      </NotFoundItem>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            {/* Row 1 */}
            <View style={styles.row}>
              <Checkbox
                value={item.isBought}
                onValueChange={() => toggleBought(item.id)}
                color={item.isBought ? "#4CAF50" : undefined}
              />

              <View style={styles.details}>
                <Text style={[styles.name, { color: theme.colors.text }]}>
                  {item.name}
                </Text>
                <Text style={styles.unit}>
                  {item.qty} {item.unit}
                </Text>
              </View>

              <QuantityButtons
                qty={item.qty}
                onIncrease={() => updateQuantity(item.id, "inc")}
                onDecrease={() => updateQuantity(item.id, "dec")}
              />
            </View>

            {/* Row 2 – Price */}
            <View style={styles.priceRow}>
              <Text style={styles.currency}>₹</Text>
              <TextInput
                value={item.price}
                onChangeText={(val) => updatePrice(item.id, val)}
                keyboardType="numeric"
                placeholder="Enter price"
                style={[styles.priceInput, { color: theme.colors.text }]}
              />
              <Pressable
                onPress={() => removeItemHandler(item.id)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.colors.card }]}>
        <Text style={styles.total}>Total: ₹ {total}</Text>

        <Pressable style={styles.finishBtn} onPress={finishShopping}>
          <Text style={styles.finishText}>Finish Shopping</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
  },
  unit: {
    fontSize: 12,
    color: "#aaa",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingLeft: 32,
    gap: 6,
  },
  currency: {
    fontSize: 16,
    fontWeight: "bold",
  },
  priceInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    fontSize: 14,
    paddingVertical: 2,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
  },
  finishBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  finishText: {
    color: "#fff",
    fontWeight: "bold",
  },
  removeBtn: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
  removeText: {
    color: "#f31282",
    fontSize: 12,
    fontWeight: "600",
  },
});
