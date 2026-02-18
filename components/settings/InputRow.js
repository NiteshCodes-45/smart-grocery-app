import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../../store/theme-context";

export default function InputRow({ label, value, onChangeText, keyboardType, notEditable, secureTextEntry }) {
  const {theme} = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.label, {color:theme.colors.text}]}>{label}</Text>
      <TextInput
        style={[styles.input]}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={notEditable}
      />
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
  input: {
    backgroundColor: "#F3F7F4",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
});
