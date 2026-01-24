import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

const USERS_KEY = "APP_USERS";
const SESSION_KEY = "CURRENT_USER_SESSION";

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  /* -------- Load users -------- */
  useEffect(() => {
    async function loadUsers() {
      const stored = await AsyncStorage.getItem(USERS_KEY);
      if (stored) setUsers(JSON.parse(stored));
    }
    loadUsers();
  }, []);

  /* -------- Persist users -------- */
  useEffect(() => {
    AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  /* -------- Restore session -------- */
  useEffect(() => {
    async function restoreSession() {
      try {
        const storedUser = await AsyncStorage.getItem(SESSION_KEY);
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } finally {
        setIsSessionLoading(false);
      }
    }
    restoreSession();
  }, []);

  /* -------- Auth actions -------- */

  async function signupUser({ name, email, location }) {
    const exists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      return { success: false, message: "User already exists" };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      location: location || "",
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newUser));

    return { success: true };
  }

  async function loginUser({ email }) {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!foundUser) {
      return { success: false, message: "User not found" };
    }

    setCurrentUser(foundUser);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(foundUser));

    return { success: true };
  }

  async function logoutUser() {
    setCurrentUser(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  }

  function updateProfile({ name, email, location }) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, name, email, location } : u
      )
    );

    setCurrentUser((prev) => ({
      ...prev,
      name,
      email,
      location,
    }));
  }

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        isAuthenticated: !!currentUser,
        isSessionLoading,

        signupUser,
        loginUser,
        logoutUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
