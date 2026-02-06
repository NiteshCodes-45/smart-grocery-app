import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Logo from "../../assets/logo.png";

export default function OnboardingGuide({ onFinish }) {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Image
          source={Logo}
          style={{ width: 55, height: 55, marginBottom: 20 }}
        />
      </View>

      <Text style={styles.title}>Welcome to Smart Grocery</Text>
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

      <GuideItem
        icon="time-outline"
        title="Session History"
        desc="Review your past grocery sessions and shopping history."
      />

      <Pressable
        style={styles.primaryBtn}
        onPress={() => onFinish("ADD_GROCERY")}
      >
        <Text style={styles.primaryBtnText}>
          Add my first grocery
        </Text>
      </Pressable>
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
    alignItems: "center",
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
  /* BUTTON */
  primaryBtn: {
    flexDirection: "row",
    justifyContent:"center",
    gap: 8,
    borderWidth:1,
    borderColor:"#2F6F4E",
    backgroundColor: "#2F6F4E",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
