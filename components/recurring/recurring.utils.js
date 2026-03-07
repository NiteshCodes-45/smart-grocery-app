export const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

export const getMonthlyRecurringTotal = (items) => {
  if (!Array.isArray(items)) return 0;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  let total = 0;

  items.forEach((item) => {
    if (!item.active) return;

    const startDate = toDate(item.startDate);
    if (!startDate) return;

    // active period inside this month
    const start = startDate > monthStart ? startDate : monthStart;
    const end = now < monthEnd ? now : monthEnd;

    if (start > end) return;

    const diffDays =
      Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const skippedThisMonth =
      item.skippedDates?.filter((d) => {
        const date = new Date(d);
        return date >= start && date <= end;
      }).length || 0;

    const billableDays = Math.max(diffDays - skippedThisMonth, 0);

    total += billableDays * item.pricePerUnit;
  });

  return total;
};

export const getItemMonthlyTotal = (item) => {
  if (!item || !item.active) return 0;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  const startDate = toDate(item.startDate);

  // determine active range inside this month
  const start = startDate > monthStart ? startDate : monthStart;
  const end = now < monthEnd ? now : monthEnd;

  // item not active in this month
  if (start > end) return 0;

  const diffDays =
    Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const skippedThisMonth =
    item.skippedDates?.filter((d) => {
      const skip = new Date(d);
      return skip >= start && skip <= end;
    }).length || 0;

  const billableDays = Math.max(diffDays - skippedThisMonth, 0);

  return billableDays * item.pricePerUnit;
};

export const getRecurringLifetimeTotal = (recurringItems) => {
  if (!Array.isArray(recurringItems)) return 0;

  const today = new Date();
  let total = 0;

  recurringItems.forEach((item) => {
    if (!item.active) return;

    const start = toDate(item.startDate);
    if (!start) return;

    const diffDays =
      Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;

    // count skipped only inside active range
    const skipped =
      item.skippedDates?.filter((d) => {
        const skipDate = new Date(d);
        return skipDate >= start && skipDate <= today;
      }).length || 0;

    const billableDays = Math.max(diffDays - skipped, 0);

    total += billableDays * item.pricePerUnit;
  });

  return total;
};

const toDate = (date) => {
  if (!date) return null;

  if (date instanceof Date) return date;

  // Firestore Timestamp
  if (typeof date?.toDate === "function") {
    return date.toDate();
  }

  if (typeof date === "string") {
    return new Date(date);
  }

  return new Date(date);
};