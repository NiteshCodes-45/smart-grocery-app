import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../store/auth-context";

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

  return (
    <RecurringContext.Provider
      value={{
        recurringItems,
        addRecurringItem,
        toggleSkipDate,
      }}
    >
      {children}
    </RecurringContext.Provider>
  );
}

export function useRecurring() {
  return useContext(RecurringContext);
}