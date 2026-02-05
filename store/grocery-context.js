import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";
import { useAuth } from "./auth-context";

const GroceryContext = createContext(null);

export function GroceryContextProvider({ children }) {
  const { currentUser } = useAuth();
  const [groceryItems, setGroceryItems] = useState([]);
  const [isSyncing, setSyncing] = useState(true);

  /* ===================== REALTIME + OFFLINE SYNC ===================== */
  useEffect(() => {
    if (!currentUser?.uid) {
      setGroceryItems([]);
      return;
    }

    const q = query(
      collection(db, "users", currentUser.uid, "groceries"),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: true },
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGroceryItems(items);
        setSyncing(false)
      }
    );

    return () => unsubscribe();
    
  }, [currentUser]);

  /* ===================== CRUD ===================== */

  async function addGroceryItem(item) {
    if (!currentUser?.uid) return;

    await addDoc(
      collection(db, "users", currentUser.uid, "groceries"),
      {
        ...item,
        checked: false,
        updatedAt: serverTimestamp(),
      }
    );
  }

  async function updateGroceryItem(id, updatedItem) {
    await updateDoc(
      doc(db, "users", currentUser.uid, "groceries", id),
      {
        ...updatedItem,
        updatedAt: serverTimestamp(),
      }
    );
  }

  async function removeGroceryItem(id) {
    await deleteDoc(
      doc(db, "users", currentUser.uid, "groceries", id)
    );
  }

  async function toggleBought(id, checked) {
    await updateDoc(
      doc(db, "users", currentUser.uid, "groceries", id),
      {
        checked,
        updatedAt: serverTimestamp(),
      }
    );
  }

  async function updateQuantity(id, type) {
    const item = groceryItems.find((i) => i.id === id);
    if (!item) return;

    const newQty =
      type === "inc" ? item.qty + 1 : Math.max(1, item.qty - 1);

    await updateDoc(
      doc(db, "users", currentUser.uid, "groceries", id),
      {
        qty: newQty,
        updatedAt: serverTimestamp(),
      }
    );
  }

  function broughtItems() {
    return groceryItems.filter((item) => item.checked);
  }

  function setGroceryBoughtStatus(groceryId, isBought) {
    const item = groceryItems.find((i) => i.id === groceryId);
    if (!item) return;
    updateDoc(
      doc(db, "users", currentUser.uid, "groceries", groceryId),
      {
        checked: isBought,
        updatedAt: serverTimestamp(),
      }
    );
  }

  /* ===================== DERIVED DATA ===================== */

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
        groceryItems,
        addGroceryItem,
        updateGroceryItem,
        updateQuantity,
        removeGroceryItem,
        toggleBought,

        getBroughtItems,
        getToBuyItems,
        groupByCategory,
        broughtItems,
        setGroceryBoughtStatus,

        isSyncing,
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
}

export function useGrocery() {
  return useContext(GroceryContext);
}
