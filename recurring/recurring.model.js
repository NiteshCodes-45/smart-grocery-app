export const createRecurringModel = (data) => {
  return {
    name: data.name?.trim() || "Untitled List",
    pricePerUnit: data.pricePerUnit ?? 0,
    unit: data.unit || "",
    startDate: data.startDate ?? new Date(),
    skippedDates: data.skippedDates || [],
    active: data.active ?? true,
  }
};