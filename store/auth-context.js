import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as fbUpdateProfile,
} from "firebase/auth";

import { auth, db } from "../firebase/firebaseConfig";
import {
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  getDoc,
  getDocs,
  setDoc,
  query,
  collection,
  deleteDoc,
} from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [userProfile, setUserProfile] = useState();
  /* -------- Restore session (Firebase handles persistence) -------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsSessionLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsub = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (snap) => {
        if (snap.exists()) {
          setUserProfile(snap.data());
        }
      }
    );

    return unsub;
  }, [auth.currentUser]);

  /* -------- Auth actions -------- */

  async function signupUser({ name, email, password, location = "" }) {
    if (!email || !password) {
      return { success: false, message: "Email & password required" };
    }

    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (name) {
      await fbUpdateProfile(cred.user, { displayName: name });
    }

    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      email,
      location,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  }

  async function loginUser({ email, password }) {
    if (!email || !password) {
      return { success: false, message: "Email & password required" };
    }

    try {
      const loginSuccess = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (!loginSuccess) {
        return { success: false, message: "Invalid email or password" };
      }

      if (loginSuccess.user) {
        const userRef = doc(db, "users", loginSuccess.user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          // 🛠️ Existing auth user, missing profile doc
          await setDoc(userRef, {
            name: loginSuccess.user.displayName || "",
            email: loginSuccess.user.email,
            location: "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }

        if (loginSuccess.user) {
          return { success: true };
        }
      }
    } catch (err) {
      return { success: false, message: "User not found!!" };
    }
  }

  async function logoutUser() {
    await signOut(auth);
  }

  async function updateUserProfile({ name, location }) {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, message: "Not authenticated" };
    }

    if (name) {
      await fbUpdateProfile(user, { displayName: name });
    }

    await updateDoc(doc(db, "users", user.uid), {
      name,
      location,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  }
  
  //Delete Account
  async function deleteAccount() {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, message: "Not authenticated" };
    }

    try {
      const uid = user.uid;

      // 1️⃣ Delete user subcollections (example)
      const collectionsToDelete = [
        "shoppingItems",
        "groceryItems",
        "sessions",
        "settings",
      ];

      for (const col of collectionsToDelete) {
        const q = query(collection(db, "users", uid, col));
        const snap = await getDocs(q);
          
        for (const docSnap of snap.docs) {
          await deleteDoc(docSnap.ref);
        }
      }

      // 2️⃣ Delete user profile doc
      await deleteDoc(doc(db, "users", uid));

      // 3️⃣ Delete auth user
      await user.delete();

      return { success: true };
    } catch (err) {
      console.log("Delete account error:", err);

      // Firebase requires recent login
      if (err.code === "auth/requires-recent-login") {
        return {
          success: false,
          requiresReauth: true,
          message: "Please login again to delete your account",
        };
      }

      return { success: false, message: "Failed to delete account" };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile, // ✅ ADD THIS
        isAuthenticated: !!currentUser,
        isSessionLoading,

        signupUser,
        loginUser,
        logoutUser,
        updateProfile: updateUserProfile,

        deleteAccount,
      }}
    >
      {!isSessionLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
