import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useAuth } from "./auth-context";
import { db } from "../firebase/firebaseConfig";
import { getQuantityStep, getUnitType } from "../data/Constant";

const ShoppingContext = createContext(null);

export function ShoppingProvider({ children }) {
  const { currentUser } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [sessionItems, setSessionItems] = useState([]);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  /* ---------- ACTIVE SESSION ---------- */

  const activeSession = useMemo(
    () => sessions.find((s) => s.status === "ACTIVE"),
    [sessions]
  );

  /* ---------- SESSIONS LISTENER ---------- */
  useEffect(() => {
    if (!currentUser?.uid) {
      setSessions([]);
      return;
    }

    const q = query(
      collection(db, "users", currentUser.uid, "shoppingSessions")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setSessions(data);
      setIsLoadingSession(false);
    });

    return () => unsub();
  }, [currentUser?.uid]);

  /* ---------- ITEMS LISTENER ---------- */
  useEffect(() => {
    if (!currentUser?.uid) {
      setSessionItems([]);
      return;
    }

    const q = query(
      collection(db, "users", currentUser.uid, "shoppingItems")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setSessionItems(data);
    });

    return () => unsub();
  }, [currentUser?.uid]);

  /* ---------- SESSION LOGIC ---------- */

  async function startSession() {
    if (activeSession) return activeSession;

    const ref = await addDoc(
      collection(db, "users", currentUser.uid, "shoppingSessions"),
      {
        status: "ACTIVE",
        startedAt: serverTimestamp(),
        finishedAt: null,
      }
    );

    return { id: ref.id, status: "ACTIVE" };
  }

  async function completeSession(sessionId) {
    await updateDoc(
      doc(db, "users", currentUser.uid, "shoppingSessions", sessionId),
      {
        status: "COMPLETED",
        finishedAt: serverTimestamp(),
      }
    );
  }

  /* ---------- ITEM LOGIC ---------- */

  async function addItemToSession(grocery) {
    const session = activeSession || (await startSession());

    const exists = sessionItems.some(
      (item) =>
        item.sessionId === session.id &&
        item.groceryId === grocery.id
    );

    const lastItem = sessionItems
      .filter(i => i.groceryId === grocery.id && i.price)
      .sort((a, b) => {
        const aDate = a.updatedAt?.toDate?.() || 0;
        const bDate = b.updatedAt?.toDate?.() || 0;
        return bDate - aDate;
      })[0];

    const lastPrice = lastItem ? lastItem.price : "";  

    if (exists) return;

    await addDoc(
      collection(db, "users", currentUser.uid, "shoppingItems"),
      {
        sessionId: session.id,
        groceryId: grocery.id,
        name: grocery.name,
        category: grocery.category,
        unit: grocery.unit,
        qty: grocery.qty || 1,
        price: lastPrice,
        isBought: false,
        updatedAt: serverTimestamp(),
      }
    );
  }

  async function updateQuantity(itemId, type) {
    const item = sessionItems.find((i) => i.id === itemId);
    if (!item || item.isBought) return;

    const unitType = item.unitType || getUnitType(item.unit);
    const step = getQuantityStep(item.unit, unitType);

    let newQty = item.qty;

    // ✅ Case 1: Picker provides direct number
    if (typeof type === "number") {
      newQty = Math.max(step, type);
    }

    // ✅ Case 2: Increment
    else if (type === "inc") {
      newQty = item.qty + step;
    }

    // ✅ Case 3: Decrement
    else if (type === "dec") {
      newQty = Math.max(step, item.qty - step);
    }

    // 🚨 Safety guard (optional but good)
    if (newQty === item.qty) return;

    await updateDoc(
      doc(db, "users", currentUser.uid, "shoppingItems", itemId),
      {
        qty: newQty,
        updatedAt: serverTimestamp(),
      }
    );
  }

  async function updatePrice(itemId, value) {
    await updateDoc(
      doc(db, "users", currentUser.uid, "shoppingItems", itemId),
      {
        price: value,
        updatedAt: serverTimestamp(),
      }
    );
  }

  async function toggleBought(itemId) {
    const item = sessionItems.find((i) => i.id === itemId);
    if (!item) return;

    await updateDoc(
      doc(db, "users", currentUser.uid, "shoppingItems", itemId),
      {
        isBought: !item.isBought,
        updatedAt: serverTimestamp(),
      }
    );
  }

  async function removeItem(itemId) {
    await deleteDoc(
      doc(db, "users", currentUser.uid, "shoppingItems", itemId)
    );
  }

  /* ---------- DERIVED DATA ---------- */

  function getActiveSessionItems() {
    if (!activeSession) return [];

    return sessionItems
      .filter((i) => i.sessionId === activeSession.id)
      .sort((a, b) => {
        // Rule 1: Bought items go to bottom
        if (a.isBought !== b.isBought) {
          return a.isBought ? 1 : -1;
        }
      });
  }

  function getEachGrocerySessionData(groceryName) {
    const data = sessionItems
      .filter((i) => i.name === groceryName && i.price);
    return data;
  }

  function getSessionTotal(sessionId) {
    return sessionItems
      .filter((i) => i.sessionId === sessionId)
      .reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }

  function isItemInActiveSession(groceryId) {
    if (!activeSession) return false;
    return sessionItems.some(
      (item) =>
        item.sessionId === activeSession.id &&
        item.groceryId === groceryId
    );
  }

  /* ---------- CONTEXT ---------- */

  return (
    <ShoppingContext.Provider
      value={{
        sessions,
        activeSession,
        sessionItems,

        startSession,
        completeSession,

        addItemToSession,
        updateQuantity,
        updatePrice,
        toggleBought,
        removeItem,

        getActiveSessionItems,
        getSessionTotal,
        isItemInActiveSession,
        getEachGrocerySessionData,

        isLoadingSession,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShopping() {
  return useContext(ShoppingContext);
}
