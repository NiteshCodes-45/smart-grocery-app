import { View, StyleSheet } from "react-native";
import { useTheme } from "../../store/theme-context";

export default function ShoppingItemSkeleton() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.card },
      ]}
    >
      <View
        style={[
          styles.checkbox,
          { backgroundColor: theme.colors.border },
        ]}
      />

      <View style={styles.content}>
        <View
          style={[
            styles.line,
            { backgroundColor: theme.colors.border },
          ]}
        />
        <View
          style={[
            styles.lineSmall,
            { backgroundColor: theme.colors.border },
          ]}
        />
      </View>

      <View
        style={[
          styles.price,
          { backgroundColor: theme.colors.border },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  line: {
    height: 14,
    borderRadius: 7,
    width: "70%",
    marginBottom: 6,
  },
  lineSmall: {
    height: 12,
    borderRadius: 6,
    width: "40%",
  },
  price: {
    width: 40,
    height: 14,
    borderRadius: 6,
    marginLeft: 12,
  },
});
