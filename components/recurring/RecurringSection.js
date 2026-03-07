import { View, Text, StyleSheet } from "react-native";
import RecurringItemRow from "./RecurringItemRow";

export default function RecurringSection({
  recurringItems,
  monthlyTotal,
  currency,
  toggleSkipDate,
  theme,
}) {

  if (!recurringItems || recurringItems.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.card },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: theme.colors.text },
        ]}
      >
        Recurring Monthly Expenses
      </Text>

      {recurringItems.map((item) => (
        <RecurringItemRow
          key={item.id}
          item={item}
          currency={currency}
          toggleSkipDate={toggleSkipDate}
          theme={theme}
        />
      ))}

      <View style={styles.totalRow}>
        <Text style={{ fontWeight: "700" }}>
          Total
        </Text>
        <Text style={{ fontWeight: "700" }}>
          {currency} {monthlyTotal}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});