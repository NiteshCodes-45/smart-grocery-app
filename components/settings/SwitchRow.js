import { View, Text, Switch, StyleSheet } from "react-native";
import { useTheme } from "../../store/theme-context";

export default function SwitchRow({ label, value, onValueChange }) {
  const {theme} = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.label, {color:theme.colors.text}]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: "#4CAF50" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: "#555",
  },
});
