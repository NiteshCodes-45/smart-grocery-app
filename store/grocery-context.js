import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

const GroceryContext = createContext(null);

export function GroceryContextProvider({ children }) {

  const [groceryItems, setGroceryItems] = useState([
    { id: "g1", name: "Milk", qty: 2, category: "Dairy", checked: false },
    { id: "g2", name: "Bread", qty: 1, category: "General", checked: false },
    { id: "g3", name: "Apples", qty: 6, category: "Fruits", checked: true },
    { id: "g4", name: "Carrots", qty: 4, category: "Vegetables", checked: false },
    { id: "g5", name: "Chips", qty: 3, category: "Snacks", checked: true },
  ]);

  const [users, setUsers] = useState([
    { id: "p1", name: "Nitesh", email: "nitesh@gmail.com", location: "Pune" },
  ]);

  const [currentUser, setCurrentUser] = useState(null);

  function signupUser({ name, email, location }) {
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      location,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
  }


  function loginUser({ email }) {
    const foundUser = users.find((user) => user.email === email);

    if (foundUser) {
      Alert.alert("Success", "Login Successful!!");
      setCurrentUser(foundUser);
      return true;
    }

    Alert.alert("Error", "Login Unsuccessful. Try again");
    return false;
  }

  function logoutUser() {
    setCurrentUser(null);
  }

  // function addUser({name, email, location}){
  //   setUsers((currentUser) =>[
  //     ...currentUser,
  //     {
  //       id: Math.random().toString(),
  //       name,
  //       email,
  //       location
  //     },
  //   ]);
  // }

  function addGroceryItem({ name, qty, category }) {
    setGroceryItems((current) => [
      ...current,
      {
        id: Math.random().toString(),
        name,
        qty,
        category,
        checked: false,
      },
    ]);
  }

  function removeGroceryItem(id) {
    setGroceryItems((current) => current.filter((item) => item.id !== id));
    Alert.alert("Success", "Grocery item removed!");
  }

  function groupByCategory() {
    return groceryItems.reduce((groups, item) => {
      const category = item.category || "Uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {});
  }

  function addToBroughtItem(id) {
    setGroceryItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked }
          : item
      )
    )
  }

  function broughtItems(){
    setGroceryItems((current) => current.map((item) =>
      // return only Item with checked true other not
      item.checked ? { ...item } : item
    ));
  }

  return (
    <GroceryContext.Provider
      value={{
        users,
        currentUser,
        signupUser,
        loginUser,
        logoutUser,
        isAuthenticated: !!currentUser,

        groceryItems,
        addGroceryItem,
        removeGroceryItem,
        addToBroughtItem,
        broughtItems,
        //groupByCategory,
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
}

export function useGrocery() {
  return useContext(GroceryContext);
}
