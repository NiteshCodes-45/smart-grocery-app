import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Buttons from "./Buttons";
import { useGrocery } from "../store/grocery-context";
import { useSettings } from "../store/settings-context";
import PickerRow from "./settings/PickerRow";
import InputRow from "./settings/InputRow";
import { useTheme } from "../store/theme-context";
import { seasons, UNITS, priorities, frequencies } from "../data/Constant";
import { getUnitType } from "../data/Constant";
import { useNotification } from "../notifications/NotificationProvider";

function AddGroceryForm({
  categories,
  route,
  navigation,
  isEditMode,
}) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [category, setCategory] = useState("");
  const [season, setSeason] = useState("");
  const [priority, setPriority] = useState("");
  const [frequency, setFrequency] = useState(""); 
  //const [openDropdown, setOpenDropdown] = useState(null);
  const { groceryItems } = useGrocery();
  const { settings } = useSettings();
  const { theme } = useTheme();
  const notify = useNotification();

  //get itemId while in edit mode
  const itemId = isEditMode ? route.params.itemId : null;
  
  useEffect(() => {
    if (!isEditMode || !itemId) return;

    const itemToEdit = groceryItems.find(item => item.id === itemId);
    if (!itemToEdit) return;

    const unitType = itemToEdit.unitType || getUnitType(itemToEdit.unit);
    setName(itemToEdit.name);
    setQty(itemToEdit.qty.toString());
    setUnit(itemToEdit.unit ?? "pcs");
    setCategory(itemToEdit.category);
    setSeason(itemToEdit.season ?? "all");
    setPriority(itemToEdit.priority ?? "medium");
    setFrequency(itemToEdit.frequency ?? "occasionally");
  }, [isEditMode, itemId, groceryItems]);
  
  const { addGroceryItem, updateGroceryItem } = useGrocery();

  function saveGroceryHandler() {
    if (name.trim().length === 0) {
      notify.info('"Invalid Input", "Please enter a grocery item name."');
      return;
    }

    const groceryData = {
      name: name.trim(),
      qty: Number(qty),
      unit,
      unitType: getUnitType(unit),
      category,
      season,
      priority,
      frequency,
    };

    if (isEditMode && itemId) {
      updateGroceryItem(itemId, groceryData);
      notify.success('Grocery updated!');
      navigation.goBack();
    } else {
      addGroceryItem(groceryData);
      notify.success('Grocery added!');
      navigation.goBack();
      
      // clear only after ADD
      setName("");
      setQty("1");
      setUnit("pcs");
      setCategory("General");
      setSeason("all");
      setPriority("medium");
      setFrequency("occasionally");
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaProvider style={styles.centeredView}>
        <View
          style={[
            styles.addFormContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.inputContainer}>
            <View style={styles.dropdownWrapper}>
              <InputRow
                label="Grocery name (e.g Milk)"
                value={name}
                onChangeText={setName}
                keyboardType="text"
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.dropdownWrapper}>
              <InputRow
                label="Number of Item"
                value={qty}
                onChangeText={setQty}
                keyboardType="number-pad"
              />
            </View>
          </View>
          <View style={styles.selectContainer}>
            <View style={styles.dropdownWrapper}>
              <PickerRow
                label="Unit"
                selectedValue={unit}
                onValueChange={setUnit}
                items={UNITS}
              />
            </View>
          </View>
          <View style={styles.selectContainer}>
            <View style={styles.dropdownWrapper}>
              <PickerRow
                label="Category"
                selectedValue={category ? category : settings.defaultCategory}
                onValueChange={setCategory}
                items={categories}
              />
            </View>
          </View>
          <View style={styles.selectContainer}>
            <View style={styles.dropdownWrapper}>
              <PickerRow
                label="Season"
                selectedValue={season}
                onValueChange={setSeason}
                items={seasons}
              />
            </View>
          </View>
          <View style={styles.selectContainer}>
            <View style={styles.dropdownWrapper}>
              <PickerRow
                label="Priority"
                selectedValue={priority}
                onValueChange={setPriority}
                items={priorities}
              />
            </View>
          </View>
          <View style={styles.selectContainer}>
            <View style={styles.dropdownWrapper}>
              <PickerRow
                label="Frequency"
                selectedValue={frequency}
                onValueChange={setFrequency}
                items={frequencies}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Buttons pressBtn={saveGroceryHandler} color="#5e0acc">
                {isEditMode ? "UPDATE GROCERY" : "ADD GROCERY"}
              </Buttons>
            </View>
          </View>
        </View>
      </SafeAreaProvider>
      </ScrollView>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addFormContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#c3d0beff",
    paddingHorizontal: 35,
    paddingTop: 20,
    paddingBottom: 65,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 10,
  },
  formInput: {
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  dropdownWrapper: {
    flex: 1,
  },
  additem: {
    flex: 2, // input takes twice the space
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginHorizontal: 8,
  },
});
export default AddGroceryForm;
