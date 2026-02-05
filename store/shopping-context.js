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

const ShoppingContext = createContext(null);

export function ShoppingProvider({ children }) {
  const { currentUser } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [sessionItems, setSessionItems] = useState([]);

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

    if (exists) return;

    await addDoc(
      collection(db, "users", currentUser.uid, "shoppingItems"),
      {
        sessionId: session.id,
        groceryId: grocery.id,
        name: grocery.name,
        category: grocery.category,
        unit: grocery.unit,
        qty: grocery.defaultQty || 1,
        price: "",
        isBought: false,
        updatedAt: serverTimestamp(),
      }
    );
  }

  async function updateQuantity(itemId, type) {
    const item = sessionItems.find((i) => i.id === itemId);
    if (!item || item.isBought) return;

    const newQty =
      type === "inc" ? item.qty + 1 : Math.max(1, item.qty - 1);

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
    return sessionItems.filter(
      (item) =>
        item.sessionId === activeSession.id
    );
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
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShopping() {
  return useContext(ShoppingContext);
}
