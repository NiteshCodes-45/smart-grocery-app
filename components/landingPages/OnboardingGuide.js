import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function OnboardingGuide() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Smart Grocery 👋</Text>
      <Text style={styles.subtitle}>
        Let’s get you started in just a few steps
      </Text>

      <GuideItem
        icon="add-circle-outline"
        title="Add Grocery Items"
        desc="Tap the + button in the header to add your daily grocery items."
      />

      <GuideItem
        icon="cart-outline"
        title="Shopping List"
        desc="Add groceries to your shopping list and track what you buy."
      />

      <GuideItem
        icon="person-outline"
        title="Profile & Settings"
        desc="Manage your profile, preferences and app settings anytime."
      />
    </View>
  );
}

function GuideItem({ icon, title, desc }) {
  return (
    <View style={styles.item}>
      <Ionicons name={icon} size={26} color="#2F6F4E" />
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDesc}>{desc}</Text>
      </View>
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1B4332",
  },
  itemDesc: {
    fontSize: 13,
    color: "#555",
  },
});
