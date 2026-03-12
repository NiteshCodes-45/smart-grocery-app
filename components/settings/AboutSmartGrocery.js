import { View, Text, StyleSheet } from "react-native";

export default function AboutSmartGrocery() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Grocery</Text>

      <Text style={styles.text}>
        Smart Grocery is a simple and practical app designed to help you manage
        your everyday grocery shopping.
      </Text>

      <Text style={styles.text}>
        Create a master list of grocery items, add them to a shopping session,
        track quantities and prices, and maintain a history of your purchases.
      </Text>

      <Text style={styles.text}>
        The app is designed to reflect real household shopping habits while
        keeping the experience clean, fast, and easy to use.
      </Text>

      <Text style={styles.text}>
        All data works locally, so the app can be used completely offline.
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
    fontSize: 22,
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