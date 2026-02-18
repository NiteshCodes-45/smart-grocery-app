import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useMemo } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGrocery } from "../grocery/grocery-context";
import { useShopping } from "../store/shopping-context";
import { useTheme } from "../store/theme-context";
import { useSettings } from "../store/settings-context";
import OnboardingGuide from "../components/landingPages/OnboardingGuide";
import NotFoundItem from "../components/NotFoundItem";
import { useAuth } from "../store/auth-context";
import { useNavigation } from "@react-navigation/native";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";

function Dashboard() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const { settings, isSettingsLoading, markOnboardingSeen } = useSettings();
  const { groceryItems, isSyncing } = useGrocery();
  const { activeSession, getActiveSessionItems, sessionItems } = useShopping();

  const isInitialLoading = isSettingsLoading || isSyncing;

  // Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // Active session data
  const activeItems = getActiveSessionItems?.() || [];
  const boughtCount = activeItems.filter((i) => i.isBought).length;
  const totalCount = activeItems.length;

  const sessionTotal = activeItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0,
  );

  // Monthly total
  const monthlyTotal = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    return sessionItems.reduce((sum, item) => {
      if (!item.updatedAt) return sum;

      const date = item.updatedAt.toDate
        ? item.updatedAt.toDate()
        : new Date(item.updatedAt);

      if (date.getMonth() === month && date.getFullYear() === year) {
        return sum + Number(item.price || 0);
      }
      return sum;
    }, 0);
  }, [sessionItems]);

  // High priority groceries
  const highPriorityItems = useMemo(() => {
    return groceryItems
      .filter(item => item.priorityOrder === 0)
      .slice(0, 3);
  }, [groceryItems]);

  // 🟢 Onboarding condition (moved from Home)
  if (settings?.hasSeenOnboarding === false && groceryItems.length === 0) {
    return (
      <OnboardingGuide
        onFinish={(action) => {
          markOnboardingSeen();
          if (action === "ADD_GROCERY") {
            navigation.navigate("AddGrocery");
          }
        }}
      />
    );
  }

  if (isInitialLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.greeting, { color: theme.colors.text }]}>
        {greeting}, {currentUser?.displayName || "User"}{" "}
      </Text>

      {/* Active Session Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Active Shopping Session</Text>

        {activeSession ? (
          <>
            <Text style={styles.cardText}>
              {boughtCount} / {totalCount} items purchased
            </Text>

            <Text style={styles.cardAmount}>₹ {sessionTotal.toFixed(2)}</Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("HomeTab")}
            >
              <Text style={styles.primaryButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.cardText}>No active shopping session</Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("HomeTab")}
            >
              <Text style={styles.primaryButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Monthly Overview */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Month</Text>
        <Text style={styles.cardAmount}>₹ {monthlyTotal.toFixed(2)}</Text>
      </View>

      {/* High Priority Items */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>High Priority Items</Text>

        {highPriorityItems.length === 0 ? (
          <Text style={styles.cardText}>No high priority items 🎉</Text>
        ) : (
          highPriorityItems.map((item) => (
            <Text key={item.id} style={styles.listItem}>
              • {item.name}
            </Text>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={[styles.card]}>
        <Text style={styles.cardTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("AddGrocery")}
        >
          <Text style={styles.secondaryButtonText}>
            <Ionicons name="add" size={16} /> Add Grocery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Shopping History")}
        >
          <Text style={styles.secondaryButtonText}>
            <Ionicons name="analytics" size={16} /> View History
          </Text>
        </TouchableOpacity>
      </View>

      {/* If no groceries */}
      <View style={{marginBottom:30}}>
        {groceryItems.length === 0 && (
            <NotFoundItem>No grocery items found</NotFoundItem>
        )}
      </View>
    </ScrollView>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#555",
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 6,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop:10
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontWeight: "600",
  },
});
