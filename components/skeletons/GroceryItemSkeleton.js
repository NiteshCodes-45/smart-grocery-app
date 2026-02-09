import { View, StyleSheet } from "react-native";
import { useTheme } from "../../store/theme-context";

export default function GroceryItemSkeleton() {
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
          styles.circle,
          { backgroundColor: theme.colors.border },
        ]}
      />

      <View style={styles.textBlock}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: "center",
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
  },
  line: {
    height: 14,
    borderRadius: 7,
    marginBottom: 8,
    width: "70%",
  },
  lineSmall: {
    height: 12,
    borderRadius: 6,
    width: "40%",
  },
});
