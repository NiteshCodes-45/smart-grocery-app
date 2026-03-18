import React from "react";
import { View, Text, Settings, StyleSheet, ScrollView } from "react-native";
import { useSettings } from "../../store/settings-context";
import { currencies } from "../../data/Constant";

export default function EachGrocerySessionDetailScreen({ route }) {
  const { groceryName, data } = route.params;
  const { settings } = useSettings();
  const totalPrice = data.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0,
  );
  const currencySymbol =
    currencies.find((c) => c.value === settings.currency)?.symbol || "₹";

  return (
    <ScrollView style={{ flex: 1, marginBottom: 20 }}> 
      <View style={{ padding: 20 }}>
        <View
          style={[
            styles.card, {alignItems: "center"}
          ]}
        >
          <Text style={styles.cardTitle}>{groceryName} - Session Details</Text>
        </View>
        <Text style={styles.cardTitle}>
            Total Spent: {currencySymbol}{totalPrice}
        </Text>
        {data.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardText}>
              Session Date:{" "}
              {new Date(item.updatedAt.seconds * 1000).toLocaleDateString()}
            </Text>
            <Text style={styles.cardText}>
              Price: {currencySymbol}
              {item.price}
            </Text>
            <Text style={styles.cardText}>
              Qty: {item.qty}{" "}{item.unit}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#555",
  },
});