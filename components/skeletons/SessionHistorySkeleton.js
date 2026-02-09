import { View, StyleSheet } from "react-native";
import { useTheme } from "../../store/theme-context";

export default function SessionHistorySkeleton() {
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  line: {
    height: 14,
    borderRadius: 7,
    width: "60%",
    marginBottom: 8,
  },
  lineSmall: {
    height: 12,
    borderRadius: 6,
    width: "40%",
  },
});
