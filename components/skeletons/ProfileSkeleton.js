import { View, StyleSheet } from "react-native";
import { useTheme } from "../../store/theme-context";

export default function ProfileSkeleton() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.avatar,
          { backgroundColor: theme.colors.border },
        ]}
      />

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

      <View
        style={[
          styles.button,
          { backgroundColor: theme.colors.border },
        ]}
      />
      <View
        style={[
          styles.button,
          { backgroundColor: theme.colors.border },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 24,
  },
  line: {
    height: 14,
    borderRadius: 7,
    width: "60%",
    marginBottom: 10,
  },
  lineSmall: {
    height: 12,
    borderRadius: 6,
    width: "40%",
    marginBottom: 24,
  },
  button: {
    height: 44,
    width: "80%",
    borderRadius: 10,
    marginBottom: 12,
  },
});
