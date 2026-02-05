import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as fbUpdateProfile,
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  /* -------- Restore session (Firebase handles persistence) -------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsSessionLoading(false);
    });

    return unsubscribe;
  }, []);

  /* -------- Auth actions -------- */

  async function signupUser({ name, email, password, location = "" }) {
    if (!email || !password) {
      return { success: false, message: "Email & password required" };
    }

    // Create auth user
    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    //Update auth user profile
    if (name) {
      await fbUpdateProfile(cred.user, { displayName: name });
    }

    //Create Firestore profile doc (ONCE)
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

    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  }

  async function logoutUser() {
    await signOut(auth);
  }

  async function updateUserProfile({ name, location }) {
    const user = auth.currentUser;
    if (!user) return;

    // Update Auth profile
    if (name) {
      await fbUpdateProfile(user, { displayName: name });
    }

    // Update Firestore profile
    await updateDoc(doc(db, "users", user.uid), {
      name,
      location,
      updatedAt: serverTimestamp(),
    });
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isSessionLoading,

        signupUser,
        loginUser,
        logoutUser,
        updateProfile: updateUserProfile,
      }}
    >
      {!isSessionLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
