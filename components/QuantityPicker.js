import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../store/theme-context";

export default function QuantityPicker({
  visible,
  options,
  unit,
  selected,
  onSelect,
  onClose,
}) {
  const { theme } = useTheme();

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Text style={styles.title}>Select Quantity</Text>

          {options.map((opt) => (
            <Pressable
              key={opt}
              style={[
                styles.option,
                selected === opt && styles.selected,
              ]}
              onPress={() => {
                onSelect(opt);
                onClose();
              }}
            >
              <Text>
                {opt} {unit}
              </Text>
            </Pressable>
          ))}

          <Pressable onPress={onClose} style={styles.cancel}>
            <Text style={{ color: "red" }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  option: {
    paddingVertical: 12,
  },
  selected: {
    opacity: 0.6,
  },
  cancel: {
    marginTop: 12,
    alignItems: "center",
  },
});
