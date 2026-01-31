# Smart Grocery App

A smart grocery management app built with React Native + Expo, designed to handle real-world grocery shopping workflows like quantity tracking, dynamic pricing, shopping sessions, and purchase history.

This app separates grocery master data from shopping sessions, making it scalable, reliable, and future-ready.

✨ Key Features
## Grocery Master

Add, edit, and delete grocery items
Assign category and unit (kg, pcs, litre, etc.)
Acts as a reusable master catalog

## Shopping Session

Start a shopping session automatically
Add selected groceries to an active session
Adjust quantity using + / − controls
Enter price per item (dynamic per session)
Mark items as bought
Prevent edits after item is marked bought
Require all items to be bought before finishing session

## Session History

View completed shopping sessions
Each session stores:
Date
Total amount
Purchased items
Read-only session detail screen (no accidental edits)

## Architecture Overview

The app is built around three clear layers:

1. Grocery Master (Static Data)
What items exist? _ Milk, Rice, Onion, Mango…

Name
Category
Unit
Default quantity

2. Shopping Session (Transactional Data)
What did I buy today?

Session date
Session status (ACTIVE / COMPLETED)
Session total (derived)

3. Session Items (Per Purchase)
Milk – 2 litre – ₹120 – Bought

Quantity
Price (changes per session)
Bought state
This separation ensures:
No price overwrites
Clean history
Accurate totals
Easy analytics later

## Folder Structure (Simplified)
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

## Data Integrity Rules

Price must be added before marking item as bought
Quantity & price are locked once bought
Shopping session can only be completed when all items are bought
Completed sessions are read-only
These rules ensure the app behaves like a real-world expense tracker.

## Tech Stack

React Native
Expo
Context API (state management)
expo-crypto (UUID generation)
React Navigation

## Getting Started
Install dependencies
npm install
Start the app
npx expo start

If you face cache or state issues:
npx expo start -c

## Future Enhancements

Firebase / Firestore persistence
Monthly & category-wise expense reports
Budget limits & alerts
Price trend analysis
Export / share shopping bills

## Author

Built as a real-world React Native practice project, focusing on:

Clean architecture
Correct state separation
Production-grade UX rules
