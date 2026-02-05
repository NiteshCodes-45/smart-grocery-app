import { useEffect } from "react";
import { ScrollView, StyleSheet, Pressable, Text, View } from "react-native";
import { useTheme } from "../store/theme-context";
import { useSettings } from "../store/settings-context";
import { useNavigation } from "@react-navigation/native";

import Section from "../components/settings/Section";
import InputRow from "../components/settings/InputRow";
import SwitchRow from "../components/settings/SwitchRow";
import PickerRow from "../components/settings/PickerRow";
import { categories, themes, languages, currencies } from "../data/Constant";

/* ------------------ SCREEN ------------------ */

export default function Settings() {
  const navigation = useNavigation();
  const { settings, updateSetting } = useSettings();
  const { themeMode, setThemeMode, theme } = useTheme();
  
  /* ------------------ LOAD THEME ------------------ */
  useEffect(() => {
    if (!settings) return;
    setThemeMode(settings.theme);
  }, [settings?.theme]);

  /* ------------------ UI ------------------ */

  return (
    <ScrollView style={[styles.container, {backgroundColor:theme.colors.background}]}>
      <View style={{marginBottom:20}}>
      {/* Grocery Defaults */}
      <Section title="Grocery Defaults">
        <PickerRow
          label="Default Category"
          selectedValue={settings.defaultCategory}
          onValueChange={(value) => updateSetting("defaultCategory", value)}
          items={categories}
        />

        <InputRow
          label="Default Quantity"
          value={settings.defaultQty}
          onChangeText={(value) => updateSetting("defaultQty", value)}
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
          selectedValue={settings.theme}
          onValueChange={(value) => updateSetting("theme", value)}
          items={themes}
        />

        <PickerRow
          label="Language"
          selectedValue={settings.language}
          onValueChange={(value) => updateSetting("language", value)}
          items={languages}
        />

        <PickerRow
          label="Currency"
          selectedValue={settings.currency}
          onValueChange={(value) => updateSetting("currency", value)}
          items={currencies}
        />
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <SwitchRow
          label="Enable Notifications"
          value={settings.notificationsEnabled}
          onValueChange={(value) => updateSetting("notificationsEnabled", value)}
        />

        <InputRow
          label="Reminder Time"
          value={settings.reminderTime}
          onChangeText={(value) => updateSetting("setReminderTime", value)}
        />

        {/* <SwitchRow
          label="Low Stock Alerts"
          value={lowStockAlert}
          onValueChange={setLowStockAlert}
        /> */}
      </Section>
      <Section title="General">
        <Pressable style={styles.aboutSection} onPress={() => navigation.navigate("About")}>
          <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: "500" }}>
            About Smart Grocery
          </Text>
        </Pressable>  
      </Section>
      </View>
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
  aboutSection:{
    paddingVertical:5,
  }
});
