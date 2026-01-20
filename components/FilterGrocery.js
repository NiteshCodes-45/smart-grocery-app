import { View, Text, StyleSheet } from "react-native";
import Buttons from "./Buttons";
import Checkbox from "expo-checkbox";
import { useMemo, useState } from "react";

export default function FilterGrocery({categories, groceryItemsCount, filterBy}) {
  const [groupByCats, setGroupByCats] = useState(false);
  const [autoLoad, setAutoLoad] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useMemo(() => {
    if (selectedCategory) {
      filterBy(selectedCategory);
    }
  }, [selectedCategory, groupByCats]);

  return (
    <>
    <View style={styles.filterContainer}>
      {/* <View style={styles.filterViewContainer}>
        <Buttons>ALL</Buttons>
        <Buttons>To Buy</Buttons>
        <Buttons>Bought</Buttons>
      </View> */}
      <View style={styles.filterViewContainer}>
        <View style={styles.checkContainer}>
            <Checkbox
                value={groupByCats}
                onValueChange={() => setGroupByCats(!groupByCats)}
                color={groupByCategory ? '#4CAF50' : undefined}
            />
            <Text style={styles.label}>Group By Category</Text>
        </View>
        <View style={styles.checkContainer}>
            <Checkbox
                value={autoLoad}
                onValueChange={setAutoLoad}
                color={autoLoad ? '#4CAF50' : undefined}
            />
            <Text style={styles.label}>Auto-Load On Scroll</Text>
        </View>
      </View>
    </View> 
    </>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#c3d0beff",
    borderColor: "#afcfa3ff",
    elevation: 20,
  },
  filterViewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center",
    gap:16,
    padding:10,
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownWrapper: {
    flex: 1, 
    width:300
  },
  label: {
    fontSize: 13,
  },
  labelText:{
    color:"#fff",
    fontSize:15
  },
  filterCatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center",
    gap:16,
    padding:25,
  },
});
