import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { useShopping } from "../store/shopping-context";
import { useTheme } from "../store/theme-context";
import { useAuth } from "../store/auth-context";
import NotFoundItem from "../components/NotFoundItem";

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toDate(ts) {
  return ts?.toDate ? ts.toDate() : new Date(ts);
}

export default function SessionHistoryScreen({ navigation }) {
  const { theme } = useTheme();
  const { sessions, getSessionTotal } = useShopping();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <NotFoundItem>Please login to view your shopping history.</NotFoundItem>
      </View>
    );
  }

  const completedSessions = sessions
  .filter(s => s.status === "COMPLETED" && s.finishedAt)
  .sort(
    (a, b) => toDate(b.finishedAt) - toDate(a.finishedAt)
  );

  if (completedSessions.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <NotFoundItem>No shopping history yet 🧾</NotFoundItem>
      </View>
    );
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
              <Text style={[styles.date, { color: theme.colors.text }]}>
                🛒 {formatDate(toDate(item.finishedAt))}
              </Text>
              <Text style={[styles.total, {color: theme.colors.text}]}>₹ {total}</Text>
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
