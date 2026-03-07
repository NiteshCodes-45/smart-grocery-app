import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { getTodayString, getItemMonthlyTotal } from "./recurring.utils";

export default function RecurringItemRow({
  item,
  currency,
  toggleSkipDate,
  theme,
}) {
  const today = getTodayString();
  const isSkippedToday = item.skippedDates?.includes(today);
  const total = getItemMonthlyTotal(item);

  const daysFromStart = Math.floor((new Date(today) - new Date(item.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  const effectiveDays = isSkippedToday ? daysFromStart - 1 : daysFromStart;
  const effectiveTotal = (item.pricePerUnit * effectiveDays).toFixed(2);

  return (
    <View style={styles.row}>
      <View>
        <Text style={[styles.name, { color: theme.colors.text }]}>
          {item.name}{" "} 
          <Text style={{ fontSize: 11 }}>
            ({currency} {item.pricePerUnit}/Day)
          </Text>
        </Text>
        <Text style={styles.meta}>
          Started on {item.startDate}
        </Text>
        <Text style={styles.meta}>
          {effectiveDays} day{effectiveDays !== 1 ? "s" : ""} this month
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={[styles.total, { color: theme.colors.text }]}>
          {currency} {total}
        </Text>

        <Pressable
          onPress={() => toggleSkipDate(item.id, today)}
          style={[
            styles.skipBtn,
            isSkippedToday && styles.skipBtnActive,
          ]}
        >
          <Text style={styles.skipText}>
            {isSkippedToday ? "Undo Skip" : "Skip Today"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
  },
  meta: {
    fontSize: 12,
    color: "#777",
  },
  total: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  skipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#E8F0FE",
  },
  skipBtnActive: {
    backgroundColor: "#FFE0E0",
  },
  skipText: {
    fontSize: 12,
    fontWeight: "600",
  },
});