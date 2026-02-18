import { View, StyleSheet } from "react-native";
import { useTheme } from "../../store/theme-context";

export default function DashboardSkeleton() {
  const { theme } = useTheme();

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
      </View>
      
      <View style={[styles.semiContainer, { backgroundColor: theme.colors.border }]}>
        <View style={[styles.line, { backgroundColor: theme.colors.background }]} />
        <View
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        />
      </View>
      
      <View style={[styles.semiContainer, { backgroundColor: theme.colors.border }]}>
        <View style={[styles.line, { backgroundColor: theme.colors.background }]} />
        <View style={[styles.line, { backgroundColor: theme.colors.background }]} />
      </View>

      <View style={[styles.semiContainer, { backgroundColor: theme.colors.border }]}>
        <View style={[styles.line, { backgroundColor: theme.colors.background }]} />
        <View style={[styles.line, { backgroundColor: theme.colors.background }]} />
      </View>

      <View style={[styles.semiContainer, { backgroundColor: theme.colors.border }]}>
        <View style={[styles.line, { backgroundColor: theme.colors.background }]} />
        <View
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        />
        <View
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 20,
  },
  semiContainer:{
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal:20,
    marginTop:15,
    borderRadius:6
  },
  line: {
    height: 14,
    borderRadius: 7,
    width: "90%",
    marginBottom: 10,
  },
  lineSmall: {
    height: 12,
    borderRadius: 6,
    width: "40%",
  },
  button: {
    height: 44,
    width: "80%",
    borderRadius: 10,
    marginBottom: 12,
  },  
});
