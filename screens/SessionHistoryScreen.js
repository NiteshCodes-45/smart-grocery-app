import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { useShopping } from "../store/shopping-context";
import { useTheme } from "../store/theme-context";
import NotFoundItem from "../components/NotFoundItem";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SessionHistoryScreen({ navigation }) {
  const { theme } = useTheme();
  const { sessions, getSessionTotal } = useShopping();

  const completedSessions = sessions
    .filter(s => s.status === "COMPLETED")
    .sort((a, b) => new Date(b.finishedAt) - new Date(a.finishedAt));

  if (completedSessions.length === 0) {
    return <NotFoundItem>No shopping history yet 🧾</NotFoundItem>;
  }

  return (
    <FlatList
      data={completedSessions}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item }) => {
        const total = getSessionTotal(item.id);

        return (
          <Pressable
            onPress={() =>
              navigation.navigate("Session Details", {
                sessionId: item.id,
              })
            }
          >
            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              <Text style={styles.date}>
                🛒 {formatDate(item.finishedAt)}
              </Text>
              <Text style={styles.total}>₹ {total}</Text>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
