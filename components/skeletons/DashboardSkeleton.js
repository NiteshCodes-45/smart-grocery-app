import { View, StyleSheet } from "react-native";
import { useTheme } from "../../store/theme-context";

export default function DashboardSkeleton() {
  const { theme } = useTheme();

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.line, { backgroundColor: theme.colors.skeletonBase }]} />
      </View>
      
      <View style={[styles.semiContainer, { backgroundColor: theme.colors.skeletonBase }]}>
        <View style={[styles.line, { backgroundColor: theme.colors.skeletonHighlight }]} />
        <View
          style={[styles.button, { backgroundColor: theme.colors.skeletonHighlight }]}
        />
      </View>
      
      <View style={[styles.semiContainer, { backgroundColor: theme.colors.skeletonBase }]}>
        <View style={[styles.line, { backgroundColor: theme.colors.skeletonHighlight }]} />
        <View style={[styles.line, { backgroundColor: theme.colors.skeletonHighlight }]} />
      </View>

      <View style={[styles.semiContainer, { backgroundColor: theme.colors.skeletonBase }]}>
        <View style={[styles.line, { backgroundColor: theme.colors.skeletonHighlight }]} />
        <View style={[styles.line, { backgroundColor: theme.colors.skeletonHighlight }]} />
      </View>

      <View style={[styles.semiContainer, { backgroundColor: theme.colors.skeletonBase }]}>
        <View style={[styles.line, { backgroundColor: theme.colors.skeletonHighlight }]} />
        <View
          style={[styles.button, { backgroundColor: theme.colors.skeletonHighlight }]}
        />
        <View
          style={[styles.button, { backgroundColor: theme.colors.skeletonHighlight }]}
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
