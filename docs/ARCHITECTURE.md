# Potlapalli Farms Architecture

## Tech Stack
- **Frontend:** HTML, CSS, Vanilla JS (Current) → Vite + React (Target Phase 3)
- **Backend:** Firebase (Auth, Firestore, Cloud Functions, Hosting)
- **Database:** Cloud Firestore (NoSQL)
- **Domain:** GoDaddy → GitHub Pages (Current) → Firebase Hosting (Target)
- **Version Control:** GitHub

## Core Principles
1. **Zero Trust Frontend:** Never calculate prices or trust totals from the browser.
2. **Role-Based Access Control (RBAC):** Users are `customer`, `admin`, or `driver`. Permissions are enforced by Firestore Rules.
3. **Atomic Orders:** Orders are created via a Cloud Function that verifies stock and prices.

## Data Flow
1. Customer adds items to cart (LocalStorage → Firestore Cart in Phase 2).
2. Customer checks out → Cloud Function `createOrder` is called.
3. Function fetches real prices, calculates total, creates Order document.
4. Admin dashboard updates order status → Driver notified.
5. Driver marks as delivered (OTP verified) → Order complete.

## Folder Structure (Target)
/docs
/public (images, assets)
/src (React app, components, pages)
/functions (Cloud Functions)
firestore.rules
firebase.json
