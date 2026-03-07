import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../store/auth-context";

const priorityMap = {
  high: 0,
  medium: 1,
  low: 2,
};

const RecurringContext = createContext();

export function RecurringProvider({ children }) {
  const { currentUser } = useAuth();
  const [recurringItems, setRecurringItems] = useState([]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsub = onSnapshot(
      collection(db, "users", currentUser.uid, "recurringItems"),
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setRecurringItems(data);
      }
    );

    return () => unsub();
  }, [currentUser?.uid]);

  async function addRecurringItem(item) {
    await addDoc(
      collection(db, "users", currentUser.uid, "recurringItems"),
      item
    );
  }

  async function toggleSkipDate(itemId, dateString) {
    const item = recurringItems.find(i => i.id === itemId);
    if (!item) return;

    const exists = item.skippedDates?.includes(dateString);

    const updated = exists
      ? item.skippedDates.filter(d => d !== dateString)
      : [...(item.skippedDates || []), dateString];

    await updateDoc(
      doc(db, "users", currentUser.uid, "recurringItems", itemId),
      { skippedDates: updated }
    );
  }

  async function createRecurringFromGrocery(grocery, groceryId) {
    const exists = recurringItems.find(
      item => item.groceryId === groceryId || item.name.toLowerCase() === grocery.name.toLowerCase()
    );

    if (exists) return;

    await addDoc(collection(db, "users", currentUser.uid, "recurringItems"), {
      groceryId: groceryId,
      name: grocery.name,
      pricePerUnit: grocery.pricePerUnit ?? 0,
      startDate: new Date().toISOString().split("T")[0],
      skippedDates: [],
      active: true,
      updatedAt: serverTimestamp(),
    });
  }

  async function deleteRecurringById(id) {
    const item = recurringItems.find(
      r => r.groceryId === id || r.id === id
    );
    if (!item) return;
    await deleteDoc(
      doc(db, "users", currentUser.uid, "recurringItems", item.id)
    );
  }

  return (
    <RecurringContext.Provider
      value={{
        recurringItems,
        addRecurringItem,
        toggleSkipDate,
        createRecurringFromGrocery,
        deleteRecurringById, 
      }}
    >
      {children}
    </RecurringContext.Provider>
  );
}

export function useRecurring() {
  return useContext(RecurringContext);
}