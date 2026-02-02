import { View, Text, StyleSheet } from "react-native";

export default function AboutSmartGrocery() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Smart Grocery</Text>

      <Text style={styles.text}>
        Smart Grocery helps you manage your daily grocery needs in a simple
        and organized way.
      </Text>

      <Text style={styles.text}>
        You can create a master list of groceries, add items to your shopping
        list, track prices, and keep a history of what you buy.
      </Text>

      <Text style={styles.text}>
        Everything works offline and is designed for real household usage.
      </Text>

      <Text style={styles.footer}>
        Version 1.0.0
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: "#777",
  },
});
