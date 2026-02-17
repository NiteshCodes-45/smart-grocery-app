import { View, Text, StyleSheet } from "react-native";

export default function EnvironmentBadge() {
  const ENV = process.env.EXPO_PUBLIC_ENV;

  if (ENV !== "staging") return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>STAGING</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    right: -40,
    backgroundColor: "#ff9800",
    paddingVertical: 4,
    paddingHorizontal: 60,
    transform: [{ rotate: "45deg" }],
    zIndex: 999,
    elevation: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
});