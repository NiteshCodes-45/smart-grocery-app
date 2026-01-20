import { View, Text, StyleSheet } from "react-native";

export default function Section({ title, children }) {
  return (
    <View style={styles.card}>
      {title && 
        <Text style={styles.title}>{title}</Text>
      }
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2, // Android shadow
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2F6F4E",
  },
});
