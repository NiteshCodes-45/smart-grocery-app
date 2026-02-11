import { serverTimestamp } from "firebase/firestore";

const priorityMap = {
  high: 0,
  medium: 1,
  low: 2,
};

export const createGroceryModel = (data) => {
  const priority = (data.priority || "high").toLowerCase();

  return {
    name: data.name?.trim() || "",
    category: data.category?.toLowerCase() || "",
    qty: data.qty ?? 1,
    unit: data.unit || "",
    frequency: data.frequency?.toLowerCase() || "weekly",
    season: data.season?.toLowerCase() || "all",
    checked: data.checked ?? false,

    priority,
    priorityOrder: priorityMap[priority] ?? 0,

    sortOrder: data.sortOrder ?? 0,
    updatedAt: serverTimestamp(),
  };
};

