import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useMemo } from "react";
import { useTheme } from "../store/theme-context";
import { useGrocery } from "../store/grocery-context";
import NotFoundItem from "../components/NotFoundItem";
import Buttons from "../components/Buttons";
import QuantityButtons from "./QuantityButtons";

export default function ShoppingListScreen() {
  const { theme } = useTheme();
  const { getToBuyItems, addToBroughtItem, updateQuantity } = useGrocery();

  const items = getToBuyItems();

  const grouped = useMemo(() => {
    return items.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [items]);

  if (items.length === 0) {
    return <NotFoundItem>Your shopping list is empty 🛒</NotFoundItem>;
  }

  return (
    <FlatList
      data={Object.keys(grouped)}
      keyExtractor={(cat) => cat}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item: category }) => (
        <View>
          <Text style={[styles.category, {color:theme.colors.text}]}>{category}</Text>

          {grouped[category].map(item => (
            <View
              key={item.id}
              style={[styles.row, { backgroundColor: theme.colors.card }]}
            >
              <Checkbox
                value={item.checked}
                onValueChange={() => addToBroughtItem(item.id)}
                color={item.checked ? "#4CAF50" : undefined}
              />

              <View style={styles.details}>
                <Text style={{ color: theme.colors.text }}>
                  {item.name}
                </Text>
                <Text style={styles.qty}>
                  Qty: {item.qty} {item.unit ? item.unit : "pcs"}
                </Text>
              </View>

              <QuantityButtons
                qty={item.qty}
                onIncrease={() => updateQuantity(item.id, "inc")}
                onDecrease={() => updateQuantity(item.id, "dec")}
              />
            </View> 
          ))}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  category: {
    marginTop: 20,
    marginLeft: 20,
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "capitalize",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  details: {
    flex: 1,
  },
  qty: {
    fontSize: 12,
    color: "#aaa",
  },
});
