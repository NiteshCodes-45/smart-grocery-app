import { View, Text, Pressable, StyleSheet } from "react-native";

export default function QuantityButtons({
  qty,
  onIncrease,
  onDecrease,
  disabled = false,
}) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.btn, disabled && styles.disabled]}
        onPress={onDecrease}
        disabled={disabled}
      >
        <Text style={styles.text}>−</Text>
      </Pressable>

      <Text style={styles.qty}>{qty}</Text>

      <Pressable
        style={[styles.btn, disabled && styles.disabled]}
        onPress={onIncrease}
        disabled={disabled}
      >
        <Text style={styles.text}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  qty: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: "600",
  },
});
