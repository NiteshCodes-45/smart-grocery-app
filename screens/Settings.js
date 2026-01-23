import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../store/theme-context";

import Section from "../components/settings/Section";
import InputRow from "../components/settings/InputRow";
import SwitchRow from "../components/settings/SwitchRow";
import PickerRow from "../components/settings/PickerRow";

/* ------------------ CONSTANTS ------------------ */

const SETTINGS_KEY = "APP_SETTINGS";

const categories = [
  { label: "General", value: "general" },
  { label: "Dairy", value: "dairy" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Fruits", value: "fruits" },
];

const themes = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

const languages = [
  { label: "English", value: "en" },
  { label: "Marathi", value: "mr" },
  { label: "Hindi", value: "hi" },
];

const currencies = [
  { label: "INR (₹)", value: "inr" },
  { label: "USD ($)", value: "usd" },
];

/* ------------------ SCREEN ------------------ */

export default function Settings() {
  /* Grocery Defaults */
  const [defaultCategory, setDefaultCategory] = useState("general");
  const [defaultQty, setDefaultQty] = useState("1");
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  /* App Preferences */
  const [selectedTheme, setSelectedTheme] = useState("light");
  const { themeMode, setThemeMode, theme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("inr");

  /* Notifications */
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("08:00 AM");
  const [lowStockAlert, setLowStockAlert] = useState(true);

  /* ------------------ LOAD SETTINGS ------------------ */

  useEffect(() => {
    async function loadSettings() {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_KEY);
        if (!stored) return;

        const s = JSON.parse(stored);

        setDefaultCategory(s.defaultCategory ?? "general");
        setDefaultQty(s.defaultQty ?? "1");
        setShowOutOfStock(s.showOutOfStock ?? true);

        setSelectedTheme(s.theme ?? "light");
        setLanguage(s.language ?? "en");
        setCurrency(s.currency ?? "inr");

        setNotificationsEnabled(s.notificationsEnabled ?? true);
        setReminderTime(s.reminderTime ?? "08:00 AM");
        setLowStockAlert(s.lowStockAlert ?? true);
      } catch (err) {
        console.log("Failed to load settings", err);
      }
    }

    loadSettings();
  }, []);

  /* ------------------ SAVE SETTINGS ------------------ */

  useEffect(() => {
    async function saveSettings() {
      try {
        const settings = {
          defaultCategory,
          defaultQty,
          showOutOfStock,
          selectedTheme,
          language,
          currency,
          notificationsEnabled,
          reminderTime,
          lowStockAlert,
        };

        await AsyncStorage.setItem(
          SETTINGS_KEY,
          JSON.stringify(settings)
        );
      } catch (err) {
        console.log("Failed to save settings", err);
      }
    }

    saveSettings();
  }, [
    defaultCategory,
    defaultQty,
    showOutOfStock,
    selectedTheme,
    language,
    currency,
    notificationsEnabled,
    reminderTime,
    lowStockAlert,
  ]);

  /* ------------------ UI ------------------ */

  return (
    <ScrollView style={[styles.container, {backgroundColor:theme.colors.background}]}>

      {/* Grocery Defaults */}
      <Section title="Grocery Defaults">
        <PickerRow
          label="Default Category"
          selectedValue={defaultCategory}
          onValueChange={setDefaultCategory}
          items={categories}
        />

        <InputRow
          label="Default Quantity"
          value={defaultQty}
          onChangeText={setDefaultQty}
          keyboardType="numeric"
        />

        {/* <SwitchRow
          label="Show Out of Stock"
          value={showOutOfStock}
          onValueChange={setShowOutOfStock}
        /> */}
      </Section>

      {/* App Preferences */}
      <Section title="App Preferences">
        <PickerRow
          label="Theme"
          selectedValue={themeMode}
          onValueChange={setThemeMode}
          items={themes}
        />

        <PickerRow
          label="Language"
          selectedValue={language}
          onValueChange={setLanguage}
          items={languages}
        />

        <PickerRow
          label="Currency"
          selectedValue={currency}
          onValueChange={setCurrency}
          items={currencies}
        />
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <SwitchRow
          label="Enable Notifications"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />

        <InputRow
          label="Reminder Time"
          value={reminderTime}
          onChangeText={setReminderTime}
        />

        {/* <SwitchRow
          label="Low Stock Alerts"
          value={lowStockAlert}
          onValueChange={setLowStockAlert}
        /> */}
      </Section>

    </ScrollView>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7F4",
    paddingBottom: 20,
  },
});
