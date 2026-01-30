import { createContext, useContext, useState } from "react";
import * as Crypto from "expo-crypto";

const ShoppingContext = createContext();

export function ShoppingProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [sessionItems, setSessionItems] = useState([]);

  // ---------- HELPERS ----------

  const activeSession = sessions.find(
    (s) => s.status === "ACTIVE"
  );

  function generateId() {
    return Crypto.randomUUID();
  }

  function getItemsBySession(sessionId) {
    return sessionItems.filter(
      (item) => item.sessionId === sessionId
    );
  }

  // ---------- SESSION LOGIC ----------

  function startSession() {
    if (activeSession) return activeSession;

    const newSession = {
      id: generateId(),
      startedAt: new Date(),
      finishedAt: null,
      status: "ACTIVE",
    };

    setSessions((prev) => [...prev, newSession]);
    return newSession;
  }

  function completeSession(sessionId) {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: "COMPLETED",
              finishedAt: new Date(),
            }
          : s
      )
    );
  }

  // ---------- ITEM LOGIC ----------

  function addItemToSession(grocery) {
    const session = activeSession || startSession();

    // 🚨 Guard: prevent duplicates
    const exists = sessionItems.some(
        (item) =>
        item.sessionId === session.id &&
        item.groceryId === grocery.id
    );

    if (exists) return;

    const newItem = {
      id: generateId(),
      sessionId: session.id,
      groceryId: grocery.id,
      name: grocery.name,
      category: grocery.category,
      unit: grocery.unit,
      qty: grocery.defaultQty || 1,
      price: "",
      isBought: false,
    };

    setSessionItems((prev) => [...prev, newItem]);
  }

  function updateQuantity(itemId, type) {
    setSessionItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        const newQty =
          type === "inc"
            ? item.qty + 1
            : Math.max(1, item.qty - 1);

        return { ...item, qty: newQty };
      })
    );
  }

  function updatePrice(itemId, value) {
    setSessionItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, price: value }
          : item
      )
    );
  }

  function toggleBought(itemId) {
    setSessionItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, isBought: !item.isBought }
          : item
      )
    );
  }

  function removeItem(itemId) {
    setSessionItems((prev) =>
      prev.filter((item) => item.id !== itemId)
    );
  }

  // ---------- DERIVED DATA ----------

  function getActiveSessionItems() {
    if (!activeSession) return [];
    return getItemsBySession(activeSession.id);
  }

  function getSessionTotal(sessionId) {
    return getItemsBySession(sessionId).reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0),
      0
    );
  }

  function isItemInActiveSession(groceryId) {
    if (!activeSession) return false;
    return sessionItems.some(
        (item) =>
        item.sessionId === activeSession.id &&
        item.groceryId === groceryId
    );
  }

  // ---------- CONTEXT VALUE ----------

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
