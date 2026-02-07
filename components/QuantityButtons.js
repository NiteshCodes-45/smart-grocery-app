import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../store/theme-context";
import { getQuantityStep } from "../data/Constant";
export default function QuantityButtons({
  qty,
  unit,
  unitType,
  onIncrease,
  onDecrease,
  disabled = false,
}) {
  const { theme } = useTheme();
  const step = getQuantityStep(unit, unitType);
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.btn, disabled && styles.disabled]}
        onPress={onDecrease}
        disabled={disabled}
      >
        <Text style={styles.text}>−{step}</Text>
      </Pressable>

      <Text style={[styles.qty, {color:theme.colors.text}]}>{qty}{unit}</Text>

      <Pressable
        style={[styles.btn, disabled && styles.disabled]}
        onPress={onIncrease}
        disabled={disabled}
      >
        <Text style={styles.text}>+{step}</Text>
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
    fontSize: 10,
    fontWeight: "bold",
  },
  qty: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: "600",
    fontSize:12
  },
});
