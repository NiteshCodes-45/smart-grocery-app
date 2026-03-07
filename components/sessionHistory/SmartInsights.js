import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SmartInsights({
  theme,
  toDate,
  sessionItems,
  completedSessions,
  getSessionTotal,
  recurringItems,
}) {
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

  return (
    <View style={[styles.insightCard, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Smart Insights
      </Text>

      {consistentItem && (
        <Text style={[styles.insightText, { color: theme.colors.text }]}>
          <Text style={{ fontWeight: "bold" }}>
            {consistentItem.name.charAt(0).toUpperCase() +
              consistentItem.name.slice(1)}{" "}
          </Text>
          appears in {consistentItem.percentage}% of sessions.
        </Text>
      )}

      {dominantCategory && (
        <Text style={[styles.insightText, { color: theme.colors.text }]}>
          <Text style={{ fontWeight: "bold" }}>
            {dominantCategory.category.charAt(0).toUpperCase() +
              dominantCategory.category.slice(1)}{" "}
          </Text>
          accounts for {dominantCategory.percentage}% of total spend.
        </Text>
      )}

      {trendData?.insufficient && (
        <Text
          style={[styles.insightTextWithNoData, { color: theme.colors.text }]}
        >
          Not enough data to calculate monthly trend yet.
        </Text>
      )}
      {!trendData?.insufficient && trendData && (
        <Text style={[styles.insightText, { color: theme.colors.text }]}>
          Spending{" "}
          <Text style={{ fontWeight: "bold" }}>
            {trendData.increased ? "increased" : "decreased"}{" "}
          </Text>
          {Math.abs(trendData.percentage)}% compared to last month.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
});
