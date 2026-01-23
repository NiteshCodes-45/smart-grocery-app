import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../../store/theme-context";

export default function PickerRow({ label, selectedValue, onValueChange, items }) {
  const {theme} = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.label, {color:theme.colors.text}]}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
        >
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  pickerWrapper: {
    backgroundColor: "#F3F7F4",
    borderRadius: 8,
  },
});
