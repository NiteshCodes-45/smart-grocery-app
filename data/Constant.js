//category: "general" | "dairy" | "vegetables" | "fruits" | "snacks" | "beverages"
const categories = [
  { label: "All", value: "" },
  { label: "General", value: "general" },
  { label: "Dairy", value: "dairy" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Fruits", value: "fruits" },
  { label: "Snacks", value: "snacks" },
  { label: "Beverages", value: "beverages" },
];

//season: "summer" | "winter" | "monsoon" | "all"
const seasons = [
  { label: "All", value: "all" },
  { label: "Summer", value: "summer" },
  { label: "Winter", value: "winter" },
  { label: "Monsoon", value: "monsoon" },
];

//unit: "kg" | "g" | "litre" | "ml" | "pcs" | "dozen"
const UNITS = [
  { label: "Kilogram (kg)", value: "kg" },
  { label: "Gram (g)", value: "gm" },
  { label: "Litre (L)", value: "litre" },
  { label: "Millilitre (ml)", value: "ml" },
  { label: "Pieces (pcs)", value: "pcs" },
  { label: "Dozen", value: "dozen" },
];

//priority: "high" | "medium" | "low"
const priorities = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

//frequency: "weekly" | "monthly" | "occasionally"
const frequencies = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Occasionally", value: "occasionally" },
];

const themes = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

const languages = [
  { label: "English", value: "en" },
  // { label: "Marathi", value: "mr" },
  // { label: "Hindi", value: "hi" },
];

const currencies = [
  { label: "INR (₹)", value: "inr", symbol: "₹" },
  { label: "USD ($)", value: "usd", symbol: "$" },
  { label: "EUR (€)", value: "eur", symbol: "€" },
//   { label: "GBP (£)", value: "gbp", symbol: "£" },
//   { label: "JPY (¥)", value: "jpy", symbol: "¥" },
];


const UNIT_TYPE_MAP = {
  pcs: "COUNT",
  piece: "COUNT",

  gm: "WEIGHT",
  kg: "WEIGHT",

  ml: "VOLUME",
  ltr: "VOLUME",
};

function getUnitType(unit) {
  return UNIT_TYPE_MAP[unit] || "COUNT";
}

function getQuantityStep(unit, unitType) {
  if (unitType === "COUNT") return 1;

  if (unitType === "WEIGHT") {
    return unit === "gm" ? 50 : 0.25;
  }

  if (unitType === "VOLUME") {
    return unit === "ml" ? 50 : 0.25;
  }

  return 1;
}

export {
  seasons,
  UNITS,
  priorities,
  frequencies,
  categories,
  themes,
  languages,
  currencies,
  UNIT_TYPE_MAP,
  getUnitType,
  getQuantityStep,
};
