import { View, Text, StyleSheet, TextInput, LayoutAnimation, TouchableOpacity } from "react-native";
import Buttons from "./Buttons";
import CategoryDropdown from "./CategoryDrodown";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function GroceryFilters({
  theme,
  categories,
  category,
  setCategory,
  openDropdown,
  setOpenDropdown,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  filteredCount,
  totalCount,
}) {
  return (
    <View
      style={[styles.filtersWrapper, { backgroundColor: theme.colors.card }]}
    >
      {/* Category */}
      <View style={styles.filterCatContainer}>
        <View style={styles.dropdownWrapper}>
          <CategoryDropdown
            cats={categories}
            value={category}
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

        <Text style={[styles.labelText, { color: theme.colors.text }]}>
          Showing {filteredCount} of {totalCount} items
        </Text>
      </View>

      {/* Search */}
      <View style={styles.filterTop}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search Grocery Items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.text}
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Ionicons name="close-circle" size={19} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter buttons */}
      <View
        style={[
          styles.filterRow,
          {
            backgroundColor: theme.colors.background,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <Buttons
          active={filter === "all"}
          pressBtn={() => {
            LayoutAnimation.easeInEaseOut();
            setFilter("all");
          }}
        >
          All
        </Buttons>

        <Buttons
          active={filter === "toBuy"}
          pressBtn={() => {
            LayoutAnimation.easeInEaseOut();
            setFilter("toBuy");
          }}
        >
          To Buy
        </Buttons>

        <Buttons
          active={filter === "brought"}
          pressBtn={() => {
            LayoutAnimation.easeInEaseOut();
            setFilter("brought");
          }}
        >
          Bought
        </Buttons>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersWrapper: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    paddingBottom: 14,
    marginBottom: 4,
    zIndex: 10,
  },
  filterCatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dropdownWrapper: {
    flex: 1,
    width: 350,
  },
  labelText: {
    color: "#fff",
    fontSize: 12,
  },
  filterTop: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  count: {
    marginTop: 8,
    fontSize: 12,
    color: "#aaa",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  searchContainer: {
    position: "relative",
    justifyContent: "center",
  },

  searchInput: {
    fontSize: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 40,
    borderRadius: 8,
  },

  clearButton: {
    position: "absolute",
    right: 10,
    height: 26,
    width: 26,
    justifyContent: "center",
    alignItems: "center",
  },
});
