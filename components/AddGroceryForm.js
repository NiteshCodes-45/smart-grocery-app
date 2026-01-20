import { use, useEffect, useState } from "react";
import { View, Alert, StyleSheet, TextInput } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Buttons from "./Buttons";
import CategoryDropdown from "./CategoryDrodown";
import { useGrocery } from "../store/grocery-context";
import PickerRow from "./settings/PickerRow";

function AddGroceryForm({
  categories,
  route,
  navigation,
  isEditMode,
}) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [category, setCategory] = useState("General");
  const [season, setSeason] = useState("All");
  const [priority, setPriority] = useState("Medium");
  const [frequency, setFrequency] = useState("Occasionally"); 
  const [openDropdown, setOpenDropdown] = useState(null);
  const { groceryItems } = useGrocery();

  //get itemId while in edit mode
  const itemId = isEditMode ? route.params.itemId : null;
  
  useEffect(() => {
    if (isEditMode && itemId) {
      const itemToEdit = groceryItems.find(item => item.id === itemId);
      if (itemToEdit) {
        setName(itemToEdit.name);
        setQty(itemToEdit.qty.toString());
        setCategory(itemToEdit.category);
        // set other fields if they exist
      }
    }
  }, [isEditMode, itemId]);
  
  //season: "summer" | "winter" | "monsoon" | "all"
  const seasons = [
    { label: "All", value: "all" },
    { label: "Summer", value: "summer" },
    { label: "Winter", value: "winter" },
    { label: "Monsoon", value: "monsoon" },  
  ]

  //priority: "high" | "medium" | "low"
  const priorities = [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },  
  ]

  //frequency: "weekly" | "monthly" | "occasionally"
  const frequencies = [
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Occasionally", value: "occasionally" },  
  ]

  const { addGroceryItem } = useGrocery();

  function addGroceryItemHandler() {
    if (name.trim().length === 0) {
      Alert.alert("Invalid Input", "Please enter a grocery item name.");
      return;
    }
    addGroceryItem({ name, qty, category });
    setTimeout(() => {
      isEditMode ? Alert.alert("Success", "Grocery updated!!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]) :
      Alert.alert("Success", "Grocery added!!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    }, 100);
    setName("");
    setQty(1);
    setCategory("General");
  }

  return (
    <>
      <SafeAreaProvider style={styles.centeredView}>
        <View style={styles.addFormContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.formInput, styles.additem]}
              placeholder="Grocery name (e.g Milk)"
              onChangeText={(e) => setName(e)}
              value={name}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.formInput, styles.additem]}
              placeholder="Number of Item"
              maxLength={2}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(e) => setQty(e)}
              value={qty}
            />
          </View>
          <View style={styles.selectContainer}>
            <View style={styles.dropdownWrapper}>
              <CategoryDropdown
                cats={categories}
                initialValue={category}
                setCategory={setCategory}
                open={openDropdown === "category"}
                setOpen={(isOpen) =>
                  setOpenDropdown(isOpen ? "category" : null)
                }
                placeholder="Select Category"
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>
          </View>
          {/* <View style={styles.selectContainer}>
            <View style={styles.dropdownWrapper}>
              <CategoryDropdown
                cats={seasons}
                value={season}
                setCategory={setSeason}
                open={openDropdown === "season"}
                setOpen={(isOpen) =>
                  setOpenDropdown(isOpen ? "season" : null)
                }
                placeholder="Select Season"
                zIndex={2000}
                zIndexInverse={2000}
              />
            </View>
          </View> */}
          {/* <View style={styles.selectContainer}>
            <View style={styles.dropdownWrapper}>
              <CategoryDropdown
                cats={priorities}
                //value={priority}
                setCategory={setPriority}
                open={openDropdown === "priority"}
                setOpen={(isOpen) =>
                  setOpenDropdown(isOpen ? "priority" : null)
                }
                placeholder="Select Priority"
                zIndex={1000}
                zIndexInverse={3000}
              />
            </View>
          </View> */}
          {/* <View style={styles.selectContainer}>
            <View style={styles.dropdownWrapper}>
              <CategoryDropdown
                cats={frequencies}
                value={frequency}
                setCategory={setFrequency}
                open={openDropdown === "frequency"}
                setOpen={(isOpen) =>
                  setOpenDropdown(isOpen ? "frequency" : null)
                }
                placeholder="Select Frequency"
                zIndex={500}
                zIndexInverse={3500}
              />
            </View>
          </View> */}
          <View style={styles.buttonContainer}>
            {/* <View style={styles.button}>
                  <Buttons pressBtn={closeGroceryModal} color="#f31282">
                    CANCEL
                  </Buttons>
                </View> */}
            <View style={styles.button}>
              {isEditMode ? (
                <Buttons pressBtn={addGroceryItemHandler} color="#5e0acc">
                  UPDATE GROCERY
                </Buttons>
              ) : (
              <Buttons pressBtn={addGroceryItemHandler} color="#5e0acc">
                ADD GROCERY
              </Buttons>
              )}
            </View>
          </View>
        </View>
      </SafeAreaProvider>
    </>
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
    paddingVertical: 25,
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
    gap: 10,
    marginBottom: 15,
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 10,
    marginBottom: 15,
  },
  formInput: {
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  dropdownWrapper: {
    flex: 1, // dropdown takes remaining space
    justifyContent: "center",
    alignItems: "center",
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
