import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  SectionList,
} from "react-native";
import { useShopping } from "../store/shopping-context";
import { useTheme } from "../store/theme-context";
import { useAuth } from "../store/auth-context";
import { useSettings } from "../store/settings-context";
import { currencies } from "../data/Constant";
import NotFoundItem from "../components/NotFoundItem";
import SessionHistoryListSkeleton from "../components/skeletons/SessionHistoryListSkeleton";

/* ------------------ Helpers ------------------ */

function toDate(ts) {
  return ts?.toDate ? ts.toDate() : new Date(ts);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ================= SCREEN ================= */

export default function SessionHistoryScreen({ navigation }) {
  const { theme } = useTheme();
  const { sessions, getSessionTotal, sessionItems, isLoadingSession } =
    useShopping();
  const { settings, isSettingsLoading } = useSettings();
  const { currentUser } = useAuth();

  const curr =
    currencies.find((c) => c.value === settings.currency)?.symbol || "₹";

  /* ---------- Guard ---------- */

  if (!currentUser) {
    return (
      <View style={styles.center}>
        <NotFoundItem>Please login to view your shopping history.</NotFoundItem>
      </View>
    );
  }

  if (isLoadingSession || isSettingsLoading) {
    return <SessionHistoryListSkeleton />;
  }

  /* ---------- Derived Data ---------- */

  const completedSessions = useMemo(() => {
    return sessions
      .filter((s) => s.status === "COMPLETED" && s.finishedAt)
      .sort((a, b) => toDate(b.finishedAt) - toDate(a.finishedAt));
  }, [sessions]);

  if (completedSessions.length === 0) {
    return (
      <View style={styles.center}>
        <NotFoundItem>No shopping history yet 🧾</NotFoundItem>
      </View>
    );
  }

  const totalSessions = completedSessions.length;

  const totalSpent = completedSessions.reduce(
    (sum, s) => sum + getSessionTotal(s.id),
    0,
  );

  const sections = useMemo(() => {
    if (!Array.isArray(completedSessions) || completedSessions.length === 0)
      return [];

    const grouped = {};

    completedSessions.forEach((session) => {
      const date = toDate(session.finishedAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          title: date.toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
          }),
          monthDate: new Date(date.getFullYear(), date.getMonth(), 1),
          data: [],
        };
      }

      grouped[monthKey].data.push(session);
    });

    return Object.values(grouped).sort((a, b) => b.monthDate - a.monthDate);
  }, [completedSessions]);

  const monthlyTotalsMap = useMemo(() => {
    const map = {};

    completedSessions.forEach((session) => {
      const date = toDate(session.finishedAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!map[key]) map[key] = 0;

      map[key] += getSessionTotal(session.id);
    });

    return map;
  }, [completedSessions]);

  const trendData = useMemo(() => {
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${now.getMonth()}`;

    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const prevKey = `${prevDate.getFullYear()}-${prevDate.getMonth()}`;

    const currentTotal = monthlyTotalsMap[currentKey] || 0;
    const previousTotal = monthlyTotalsMap[prevKey] || 0;

    if (!previousTotal) {
      return {
        insufficient: true,
      };
    }

    const change = ((currentTotal - previousTotal) / previousTotal) * 100;

    return {
      insufficient: false,
      percentage: change.toFixed(1),
      increased: change > 0,
    };
  }, [monthlyTotalsMap]);

  const consistentItem = useMemo(() => {
    if (completedSessions.length === 0) return null;

    const frequency = {};

    completedSessions.forEach((session) => {
      const itemsInSession = sessionItems.filter(
        (item) => item.sessionId === session.id,
      );

      const uniqueItems = new Set(itemsInSession.map((i) => i.name));

      uniqueItems.forEach((name) => {
        frequency[name] = (frequency[name] || 0) + 1;
      });
    });

    const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) return null;

    const [name, count] = sorted[0];

    const percentage = ((count / completedSessions.length) * 100).toFixed(0);

    return { name, percentage };
  }, [completedSessions, sessionItems]);

  const dominantCategory = useMemo(() => {
    const categoryTotals = {};

    sessionItems.forEach((item) => {
      if (!item.price) return;

      categoryTotals[item.category] =
        (categoryTotals[item.category] || 0) + Number(item.price);
    });

    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) return null;

    const [category, total] = sorted[0];

    const overallTotal = Object.values(categoryTotals).reduce(
      (sum, val) => sum + val,
      0,
    );

    const percentage = ((total / overallTotal) * 100).toFixed(0);

    return { category, percentage };
  }, [sessionItems]);

  const now = new Date();
  const thisMonthSpent = completedSessions
    .filter((s) => {
      const d = toDate(s.finishedAt);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, s) => sum + getSessionTotal(s.id), 0);

  const avgPerSession =
    totalSessions > 0 ? (totalSpent / totalSessions).toFixed(2) : 0;

  const itemFrequency = sessionItems.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {});

  const topItems = Object.entries(itemFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  /* ================= RENDER ================= */

  return (
    <>
      <View style={styles.headerTitleContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Your Shopping History
        </Text>
        <Text style={styles.subtitle}>Track your shopping insights</Text>
      </View>
      <View
        style={[styles.insightCard, { backgroundColor: theme.colors.card }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Smart Insights</Text>

        {consistentItem && (
          <Text style={[styles.insightText, { color: theme.colors.text }]}>
            {consistentItem.name.charAt(0).toUpperCase() +
              consistentItem.name.slice(1)}{" "}
            appears in {consistentItem.percentage}% of sessions.
          </Text>
        )}

        {dominantCategory && (
          <Text style={[styles.insightText, { color: theme.colors.text }]}>
            {dominantCategory.category.charAt(0).toUpperCase() +
              dominantCategory.category.slice(1)}{" "}
            accounts for {dominantCategory.percentage}% of total spend.
          </Text>
        )}

        {trendData?.insufficient && (
          <Text style={[styles.insightTextWithNoData, { color: theme.colors.text }]}>
            Not enough data to calculate monthly trend yet.
          </Text>
        )}
        {!trendData?.insufficient && trendData && (
          <Text style={[styles.insightText, { color: theme.colors.text }]}>
            Spending {trendData.increased ? "increased" : "decreased"}{" "}
            {Math.abs(trendData.percentage)}% compared to last month.
          </Text>
        )}
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <HistoryHeader
            theme={theme}
            curr={curr}
            totalSpent={totalSpent}
            thisMonthSpent={thisMonthSpent}
            totalSessions={totalSessions}
            avgPerSession={avgPerSession}
            topItems={topItems}
          />
        }
        renderSectionHeader={({ section }) => {
          const monthTotal = section.data.reduce(
            (sum, s) => sum + getSessionTotal(s.id),
            0,
          );

          return (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionHeaderText, { color: theme.colors.text }]}>
                {section.title.toUpperCase()}
              </Text>
              <Text style={[styles.sectionTotal, { color: theme.colors.text }]}>
                {curr} {monthTotal.toFixed(2)}
              </Text>
            </View>
          );
        }}
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
              <View
                style={[
                  styles.sessionCard,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <Text
                  style={[styles.sessionDate, { color: theme.colors.text }]}
                >
                  {formatDate(toDate(item.finishedAt))}
                </Text>

                <Text
                  style={[styles.sessionAmount, { color: theme.colors.text }]}
                >
                  {curr} {total.toFixed(2)}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </>
  );
}

function HistoryHeader({
  theme,
  curr,
  totalSpent,
  thisMonthSpent,
  totalSessions,
  avgPerSession,
  topItems,
}) {
  return (
    <View style={{ padding: 20 }}>
      {/* Stat Cards */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[
          { label: "Total Spent", value: `${curr} ${totalSpent.toFixed(2)}` },
          {
            label: "This Month",
            value: `${curr} ${thisMonthSpent.toFixed(2)}`,
          },
          { label: "Sessions", value: totalSessions },
          { label: "Avg / Session", value: `${curr} ${avgPerSession}` },
        ]}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <View
            style={[styles.statCard, { backgroundColor: theme.colors.card }]}
          >
            <Text style={styles.statLabel}>{item.label}</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {item.value}
            </Text>
          </View>
        )}
      />

      {/* Top Items */}
      <View
        style={[styles.topItemsCard, { backgroundColor: theme.colors.card }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Top Purchased</Text>

        {topItems.length === 0 ? (
          <Text style={styles.emptyText}>No items purchased yet.</Text>
        ) : (
          topItems.map(([name, count]) => (
            <View key={name} style={styles.itemRow}>
              <Text style={[styles.itemName, { color: theme.colors.text }]}>
                {name}
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count}x</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 13,
    color: "#504c4c",
    marginBottom: 20,
  },

  statCard: {
    padding: 18,
    borderRadius: 10,
    marginRight: 14,
    minWidth: 150,
    elevation: 2,
  },

  statLabel: {
    fontSize: 12,
    color: "#504c4c",
    marginBottom: 6,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },

  topItemsCard: {
    padding: 18,
    borderRadius: 10,
    marginTop: 25,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },

  sectionTotal: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  itemName: {
    fontSize: 14,
    fontWeight: "500",
  },

  badge: {
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  sessionCard: {
    marginHorizontal: 20,
    padding: 18,
    marginTop: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },

  sessionDate: {
    fontSize: 14,
    fontWeight: "600",
  },

  sessionAmount: {
    fontSize: 16,
    fontWeight: "700",
  },

  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 10,
  },

  sectionHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#504c4c",
  },

  insightCard: {
    padding: 18,
    borderRadius: 18,
    marginHorizontal: 20,
    elevation: 2,
    marginBottom: 15,
    borderBottomWidth: 4,
    borderColor: "#4CAF50",
  },

  insightText: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },

  headerTitleContainer: {
    paddingHorizontal: 25,
    marginTop: 20,
  },

  insightTextWithNoData: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#504c4c",
  },
});
