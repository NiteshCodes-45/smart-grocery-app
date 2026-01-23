import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../store/theme-context";

export default function Section({ title, children }) {
  const {theme} = useTheme();
  return (
    <View style={[styles.card, {backgroundColor:theme.colors.card}]}>
      {title && 
        <Text style={[styles.title, {color:theme.colors.text}]}>{title}</Text>
      }
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2, // Android shadow
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
});
