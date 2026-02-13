import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const subscribeToGroceries = (uid, callback) => {
  const q = query(
    collection(db, "users", uid, "groceries"),
    orderBy("priorityOrder", "asc"),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(q, callback);
};

export const addGrocery = async (uid, item) => {
  return addDoc(
    collection(db, "users", uid, "groceries"),
    item
  );
};

export const updateGrocery = async (uid, id, updates) => {
  return updateDoc(
    doc(db, "users", uid, "groceries", id),
    {
      ...updates,
      updatedAt: serverTimestamp(),
    }
  );
};

export const deleteGrocery = async (uid, id) => {
  return deleteDoc(
    doc(db, "users", uid, "groceries", id)
  );
};
