import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

/* ===================== CONSTANTS ===================== */

const GroceryContext = createContext(null);
const USERS_KEY = "APP_USERS";
const SESSION_KEY = "CURRENT_USER_SESSION";

function getStorageKey(email) {
  return `GROCERY_ITEMS_${encodeURIComponent(email.toLowerCase())}`;
}

/* ===================== PROVIDER ===================== */

export function GroceryContextProvider({ children }) {
  //   { id: "g1", name: "Milk", qty: 2, category: "Dairy", checked: false },
  //   { id: "g2", name: "Bread", qty: 1, category: "General", checked: false },
  //   { id: "g3", name: "Apples", qty: 6, category: "Fruits", checked: true },
  //   { id: "g4", name: "Carrots", qty: 4, category: "Vegetables", checked: false },
  //   { id: "g5", name: "Chips", qty: 3, category: "Snacks", checked: true },

  /* ---------- USERS ---------- */
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [groceryItems, setGroceryItems] = useState([]);

  /* =============== Load Session on app start ============== */

  useEffect(() => {
    async function loadSession() {
      try {
        const storedUser = await AsyncStorage.getItem(SESSION_KEY);
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.log("Failed to restore session", err);
      }
    }

    loadSession();
  }, []);

  /* ===================== LOAD USERS ===================== */
  useEffect(() => {
    async function loadUsers() {
      const stored = await AsyncStorage.getItem(USERS_KEY);
      if (stored) {
        setUsers(JSON.parse(stored));
      }
    }
    loadUsers();
  }, []);

  /* ===================== SAVE USERS ===================== */
  useEffect(() => {
    AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  /* ===================== LOAD GROCERIES (PER USER) ===================== */
  useEffect(() => {
    async function loadGroceries() {
      if (!currentUser?.email) return;

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

  /* ===================== AUTH ===================== */
  async function signupUser({ name, email, location }) {
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (exists) {
      return { success: false, message: "User already exists" };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      location: location || "",
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify(newUser)
    );

    return { success: true };
  }

  async function loginUser({ email }) {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (!foundUser) {
      return { success: false, message: "User not found" };
    }

    setCurrentUser(foundUser);
    
    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify(foundUser)
    );
    
    return { success: true };
  }

  async function logoutUser() {
    setCurrentUser(null);
    setGroceryItems([]); // clear in-memory only

    await AsyncStorage.removeItem(SESSION_KEY);
  }

  /* ===================== PROFILE ===================== */
  function updateProfile({ name, email, location }) {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === currentUser.id ? { ...user, name, email, location } : user,
      ),
    );

    setCurrentUser((prev) => ({
      ...prev,
      name,
      email,
      location,
    }));
  }

  /* ===================== GROCERY CRUD ===================== */
  function addGroceryItem({
    name,
    qty,
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
    //Alert.alert("Success", "Grocery item removed!");
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

  function broughtItems() {
    setGroceryItems((current) =>
      current.map((item) =>
        // return only Item with checked true other not
        item.checked ? { ...item } : item,
      ),
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
        /* auth */
        users,
        currentUser,
        signupUser,
        loginUser,
        logoutUser,
        isAuthenticated: !!currentUser,

        /* profile */
        updateProfile,

        /* groceries */
        groceryItems,
        addGroceryItem,
        updateGroceryItem,
        removeGroceryItem,
        toggleBought,

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
