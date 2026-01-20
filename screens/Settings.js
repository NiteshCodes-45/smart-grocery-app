import { useState } from "react";
import { ScrollView, StyleSheet, Input } from "react-native";
import Section from "../components/settings/Section";
import InputRow from "../components/settings/InputRow";
import SwitchRow from "../components/settings/SwitchRow";
import PickerRow from "../components/settings/PickerRow";

const categories = [
  { label: "General", value: "general" },
  { label: "Dairy", value: "dairy" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Fruits", value: "fruits" },
];

export default function SettingsScreen() {
  const [defaultCategory, setDefaultCategory] = useState("general");
  const [defaultQty, setDefaultQty] = useState("1");
  const [showOutOfStock, setShowOutOfStock] = useState(true);

  return (
    <ScrollView style={styles.container}>
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

        <SwitchRow
          label="Show Out of Stock"
          value={showOutOfStock}
          onValueChange={setShowOutOfStock}
        />
      </Section>

      {/* App Preferences */}
      {/* <Section title="App Preferences">
        <PickerRow label="Theme" />
        <PickerRow label="Language" />
        <PickerRow label="Currency" />
      </Section> */}

      {/* Grocery Defaults */}
      {/* <Section title="Grocery Defaults">
        <PickerRow label="Default Category" />
        <Input label="Default Quantity" keyboardType="numeric" />
        <SwitchRow label="Show Out of Stock" />
      </Section> */}

      {/* Notifications */}
      {/* <Section title="Notifications">
        <SwitchRow label="Enable Notifications" />
        <Input label="Reminder Time" />
        <SwitchRow label="Low Stock Alerts" />
      </Section>   */}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F7F4",
        paddingBottom:10
    }
});
