import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { useShopping } from "../store/shopping-context";
import { useTheme } from "../store/theme-context";

export default function SessionDetailScreen({ route }) {
  const { sessionId } = route.params;
  const { theme } = useTheme();
  const { sessionItems } = useShopping();

  const items = sessionItems.filter(
    item => item.sessionId === sessionId
  );

  return (
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingBottom: 60 }}
      renderItem={({ item }) => (
        <View style={[styles.row, { backgroundColor: theme.colors.card }]}>
          <View>
            <Text style={[styles.name, {color: theme.colors.text}]}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.qty} {item.unit}
            </Text>
          </View>
          <Text style={[styles.price, {color:theme.colors.text}]}>₹ {item.price}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontWeight: "600",
  },
  meta: {
    fontSize: 12,
    color: "#777",
  },
  price: {
    fontWeight: "bold",
  },
});
