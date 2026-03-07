import React, { useMemo, useState, useEffect } from "react";
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
import { useRecurring } from "../recurring/recurring-context";
import {
  getItemMonthlyTotal,
  getMonthlyRecurringTotal,
  getRecurringLifetimeTotal,
} from "../components/recurring/recurring.utils";
import { currencies } from "../data/Constant";
import NotFoundItem from "../components/NotFoundItem";
import SmartInsights from "../components/sessionHistory/SmartInsights";
import SessionHistoryListSkeleton from "../components/skeletons/SessionHistoryListSkeleton";
import Ionicons from "@expo/vector-icons/Ionicons";

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
  const { recurringItems } = useRecurring();

  const [expandedSections, setExpandedSections] = useState({});

  const curr =
    currencies.find((c) => c.value === settings.currency)?.symbol || "₹";

  const monthlyRecurringTotal = useMemo(
    () => getMonthlyRecurringTotal(recurringItems),
    [recurringItems],
  );

  const recurringLifetimeTotal = useMemo(
    () => getRecurringLifetimeTotal(recurringItems),
    [recurringItems],
  );

  const completedSessions = useMemo(() => {
    return sessions
      .filter((s) => s.status === "COMPLETED" && s.finishedAt)
      .sort((a, b) => toDate(b.finishedAt) - toDate(a.finishedAt));
  }, [sessions]);

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

  if (completedSessions.length === 0 && recurringItems.length === 0) {
    return (
      <View style={styles.center}>
        <NotFoundItem>No shopping history yet 🧾</NotFoundItem>
      </View>
    );
  }

  const totalSessions = completedSessions.length;

  const totalSessionSpent = completedSessions.reduce(
    (sum, s) => sum + getSessionTotal(s.id),
    0,
  );

  const totalSpent = totalSessionSpent + parseInt(recurringLifetimeTotal);

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

  const now = new Date();
  const thisMonthEachSessionSpent = completedSessions
    .filter((s) => {
      const d = toDate(s.finishedAt);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, s) => sum + getSessionTotal(s.id), 0);

  const thisMonthSpent = thisMonthEachSessionSpent + monthlyRecurringTotal;

  const avgPerSession =
    totalSessions > 0 ? (totalSpent / totalSessions).toFixed(2) : 0;

  const itemFrequency = sessionItems.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {});

  const topItems = Object.entries(itemFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const visibleSections = sections.map((section) => ({
    ...section,
    data: expandedSections[section.title] ? section.data : [],
  }));

  useEffect(() => {
    if (sections.length > 0) {
      setExpandedSections({
        [sections[0].title]: true,
      });
    }
  }, [sections]);

  /* ================= RENDER ================= */

  return (
    <>
      <View style={styles.headerTitleContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Your Shopping History
        </Text>
        <Text style={styles.subtitle}>Track your shopping insights</Text>
      </View>

      {/* Smart Insights */}
      <SmartInsights
        theme={theme}
        toDate={toDate}
        completedSessions={completedSessions}
        sessionItems={sessionItems}  
        recurringItems={recurringItems}
      />

      {/* END */}
      <SectionList
        sections={visibleSections}
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
            recurringItems={recurringItems}
          />
        }
        renderSectionHeader={({ section }) => {
          const isExpanded = expandedSections[section.title];

          const monthTotal = section.data.reduce(
            (sum, s) => sum + getSessionTotal(s.id),
            0,
          );

          return (
            <Pressable
              onPress={() => toggleSection(section.title)}
              style={styles.sectionHeader}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.sectionHeaderText,
                    { color: theme.colors.text },
                  ]}
                >
                  {section.title.toUpperCase()}
                </Text>

                {isExpanded && (
                  <Text
                    style={[styles.sectionTotal, { color: theme.colors.text }]}
                  >
                    {curr} {monthTotal.toFixed(2)}
                  </Text>
                )}
              </View>

              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.colors.text}
              />
            </Pressable>
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
  recurringItems,
}) {
  return (
    <View style={{ padding: 20 }}>
      {/* Stat Cards */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[
          {
            label: "Total Spent",
            subLabel: "Since you started using the app",
            value: `${curr} ${totalSpent.toFixed(2)}`,
          },
          {
            label: "This Month",
            subLabel: "Includes recurring expenses",
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
            <Text style={[styles.statSubLabel, { color: theme.colors.text }]}>
              {item.subLabel}
            </Text>
          </View>
        )}
      />

      {/* Top Items */}
      <View
        style={[styles.topItemsCard, { backgroundColor: theme.colors.card }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Top Purchased
        </Text>

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

      {/* Recurring Items */}
      <View
        style={[styles.topItemsCard, { backgroundColor: theme.colors.card }]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Recurring Items
        </Text>
        {recurringItems.length === 0 ? (
          <Text style={styles.emptyText}>No recurring items yet.</Text>
        ) : (
          recurringItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={[styles.itemName, { color: theme.colors.text }]}>
                {item.name}{" "}
                <Text style={{ fontSize: 11 }}>
                  ({curr} {item.pricePerUnit}/Day)
                </Text>
              </Text>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {curr} {getItemMonthlyTotal(item).toFixed(2)}
                </Text>
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
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 14,
    minWidth: 150,
    elevation: 2,
    flex: 1,
    verticalAlign: "top",
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
    fontSize: 12,
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
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
    marginBottom: 5,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  sectionHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#504c4c",
  },

  headerTitleContainer: {
    paddingHorizontal: 25,
    marginTop: 20,
  },

  recurringRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  recurringTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  emptyText: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#504c4c",
  },

  statSubLabel: {
    fontSize: 10,
    color: "#777",
    marginTop: 4,
  },

});
