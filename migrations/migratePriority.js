import {
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function migratePriority(uid) {
  const snapshot = await getDocs(
    collection(db, "users", uid, "groceries")
  );

  const batch = writeBatch(db);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    //if (data.priorityOrder !== undefined) return; // skip if already migrated

    let priorityOrder = 2;

    if (data.priority === "high") priorityOrder = 0;
    if (data.priority === "medium") priorityOrder = 1;
    if (data.priority === "low") priorityOrder = 2;

    batch.update(docSnap.ref, { priorityOrder });
  });

  await batch.commit();

  console.log("✅ Migration complete");
}
