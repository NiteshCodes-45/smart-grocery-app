import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./auth-context";

/* ===================== CONSTANTS ===================== */

const GroceryContext = createContext(null);

function getStorageKey(email) {
  return `GROCERY_ITEMS_${encodeURIComponent(email.toLowerCase())}`;
}

/* ===================== PROVIDER ===================== */

export function GroceryContextProvider({ children }) {
  const {currentUser} = useAuth();
  const [groceryItems, setGroceryItems] = useState([]);

  /* ===================== LOAD GROCERIES (PER USER) ===================== */
  useEffect(() => {
    async function loadGroceries() {
      if (!currentUser?.email) {
        setGroceryItems([]);
        return;
      }

      const key = getStorageKey(currentUser.email);
      const stored = await AsyncStorage.getItem(key);

      setGroceryItems(stored ? JSON.parse(stored) : []);
    }

    loadGroceries();
  }, [currentUser]);

  /* ===================== SAVE GROCERIES (PER USER) ===================== */
  useEffect(() => {
    if (!currentUser?.email) return;

    const key = getStorageKey(currentUser.email);

    AsyncStorage.setItem(key, JSON.stringify(groceryItems));
  }, [groceryItems, currentUser]);

  /* ===================== GROCERY CRUD ===================== */
  function addGroceryItem({
    name,
    qty,
    unit,
    category,
    season,
    priority,
    frequency,
  }) {
    setGroceryItems((prev) => {
      const exists = prev.some(
        (item) => item.name.toLowerCase() === name.toLowerCase(),
      );

      if (exists) return prev;

      return [
        ...prev,
        {
          id: Date.now().toString(),
          name,
          unit,
          qty,
          category,
          season,
          priority,
          frequency,
          checked: false,
        },
      ];
    });
  }

  function updateGroceryItem(id, updatedItem) {
    setGroceryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)),
    );
  }

  function removeGroceryItem(id) {
    setGroceryItems((current) => current.filter((item) => item.id !== id));
  }

  function toggleBought(id) {
    setGroceryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  }

  function addToBroughtItem(id) {
    setGroceryItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  }

  function updateQuantity(id, type) {
    setGroceryItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) return item;

        const newQty =
          type === "inc"
            ? item.qty + 1
            : Math.max(1, item.qty - 1);

        return { ...item, qty: newQty };
      })
    );
  }

  function broughtItems() {
    setGroceryItems((current) =>
      current.map((item) =>
        // return only Item with checked true other not
        item.checked ? { ...item } : item,
      ),
    );
  }

  function setGroceryBoughtStatus(groceryId, isBought) {
    setGroceryItems(prev =>
      prev.map(item =>
        item.id === groceryId
          ? { ...item, checked: isBought }
          : item
      )
    );
  }

  /* ===================== DERIVED DATA (NO STATE) ===================== */

  function getBroughtItems() {
    return groceryItems.filter((item) => item.checked);
  }

  function getToBuyItems() {
    return groceryItems.filter((item) => !item.checked);
  }

  function groupByCategory() {
    return groceryItems.reduce((groups, item) => {
      const category = item.category || "Uncategorized";
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
      return groups;
    }, {});
  }

  /* ===================== PROVIDER ===================== */
  return (
    <GroceryContext.Provider
      value={{
        /* groceries */
        groceryItems,
        addGroceryItem,
        updateGroceryItem,
        updateQuantity,
        removeGroceryItem,
        toggleBought,
        setGroceryBoughtStatus,

        /* selectors */
        getBroughtItems,
        getToBuyItems,
        groupByCategory,
        addToBroughtItem,
        broughtItems,
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
}

/* ===================== HOOK ===================== */

export function useGrocery() {
  return useContext(GroceryContext);
}
