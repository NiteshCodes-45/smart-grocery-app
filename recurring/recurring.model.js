import { serverTimestamp } from "firebase/firestore";

export const createRecurringModel = (data) => {
  return {
    groceryId: data.groceryId || null,
    name: data.name?.trim() || "",
    pricePerUnit: data.pricePerUnit ?? 0,
    startDate: data.startDate || new Date().toISOString().split("T")[0],
    skippedDates: data.skippedDates || [],
    active: data.active ?? true,
    updatedAt: serverTimestamp(),
  };
};