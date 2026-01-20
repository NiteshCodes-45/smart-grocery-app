import React, { useEffect, useMemo, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet } from 'react-native';

function CategoryDropdown({
  cats,
  setCategory,
  placeholder,
  open,
  setOpen,
  zIndex,
  zIndexInverse,
  initialValue
}) {
  // const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(cats);
  
  useMemo(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  return (
    <View style={[styles.container, zIndex]}>
      <DropDownPicker
        open={open ? true : false}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={placeholder || "Select an option"}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        onChangeValue={(val) => setCategory(val)}
        showArrowIcon={false}
        showTickIcon={false}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 0.5,
  },
  dropdown: {
    borderColor: '#ccc',
  },
  dropdownContainer: {
    borderColor: '#ccc',
    zIndex: 1000,
  },
});

export default CategoryDropdown;