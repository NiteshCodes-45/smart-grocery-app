import { createContext, useContext, useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  subscribeToGroceries,
  addGrocery,
  updateGrocery,
  deleteGrocery,
} from "./grocery.service";

import { createGroceryModel } from "./grocery.model";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../store/auth-context";
import { migratePriority } from "../migrations/migratePriority";

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

    //Auto-Migrate Once on Login(Remove after done)
    migratePriority(currentUser.uid);

    const unsubscribe = subscribeToGroceries(
      currentUser.uid,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setGroceryItems(items);
        setSyncing(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  /* ===================== CRUD ===================== */

  async function addGroceryItem(item) {
    if (!currentUser?.uid) return;
    const model = createGroceryModel(item);
    await addGrocery(currentUser.uid, model);
    // await addDoc(
    //   collection(db, "users", currentUser.uid, "groceries"),
    //   {
    //     ...item,
    //     checked: false,
    //     updatedAt: serverTimestamp(),
    //   }
    // );
  }

  async function updateGroceryItem(id, updatedItem) {
    await updateGrocery(currentUser.uid, id, updatedItem);
    // await updateDoc(
    //   doc(db, "users", currentUser.uid, "groceries", id),
    //   {
    //     ...updatedItem,
    //     updatedAt: serverTimestamp(),
    //   }
    // );
  }

  async function removeGroceryItem(id) {
    await deleteGrocery(currentUser.uid, id);
    // await deleteDoc(
    //   doc(db, "users", currentUser.uid, "groceries", id)
    // );
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
