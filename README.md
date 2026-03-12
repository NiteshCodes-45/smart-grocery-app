# Smart Grocery App

A practical grocery management app built with **React Native + Expo** that mimics real-world grocery shopping workflows.

The app separates **grocery master data** from **shopping sessions**, ensuring accurate price tracking, clean purchase history, and scalable architecture.

# Features
## Grocery Master

Create and maintain your grocery catalog.

- Add new grocery items
- Edit or delete existing items
- Assign category and measurement unit (kg, pcs, litre, etc.)
- Reusable master list for all future shopping sessions

---

## Shopping Sessions

Track groceries purchased during a specific shopping trip.

- Automatically create an active shopping session
- Add items from grocery master
- Adjust quantities using `+ / −` controls
- Enter price per item for the current session
- Mark items as **Bought**
- Lock price and quantity once item is bought
- Prevent session completion until all items are purchased

---

## Session History

Keep a clean record of past purchases.

Each completed session stores:

- Date of purchase
- Total amount spent
- List of purchased items

Completed sessions are **read-only**, preventing accidental edits.

---

# Architecture Overview

The app follows a simple and scalable data separation approach.

## 1. Grocery Master (Static Data)

Defines available grocery items.

Example: Milk, Rice, Onion, Mango


Attributes:

- Name
- Category
- Unit
- Default quantity

---

## 2. Shopping Session (Transactional Data)

Represents a single shopping trip.

Data stored:

- Session date
- Session status (ACTIVE / COMPLETED)
- Total cost

---

## 3. Session Items (Per Purchase)

Tracks individual purchases inside a session.

Example: Milk — 2 litre — ₹120 — Bought


Attributes:

- Quantity
- Price
- Bought status

---

## Why This Architecture?

This separation ensures:

- Prices never overwrite previous purchases
- Clean historical records
- Accurate total calculations
- Easy future analytics

---

# Folder Structure

/screens
  ├─ GroceryListScreen.js
  ├─ ShoppingListScreen.js
  ├─ SessionHistoryScreen.js
  └─ SessionDetailScreen.js

/store
  ├─ grocery-context.js
  ├─ shopping-context.js
  └─ theme-context.js

/components
  ├─ QuantityButtons.js
  ├─ Buttons.js
  └─ NotFoundItem.js


---

# Data Integrity Rules

To maintain real-world behavior:

- Price must be entered before marking an item as **Bought**
- Quantity and price become **locked once purchased**
- A shopping session can only finish when **all items are bought**
- Completed sessions are **read-only**

---

# Tech Stack

- React Native
- Expo
- React Navigation
- Context API (State Management)
- expo-crypto (UUID generation)

---

# Getting Started

Install dependencies
npm install
Start the development server
npx expo start

If you face caching issues:
npx expo start -c


---

# Future Improvements

- Firebase / Firestore persistence
- Monthly expense analytics
- Category-wise spending reports
- Budget alerts
- Price trend tracking
- Export or share grocery bills

---

# Author

This project was built as a **real-world React Native architecture practice project** focusing on:

- Clean state management
- Realistic UX rules
- Scalable data structure
