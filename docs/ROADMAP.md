# Project Roadmap

## Phase 1: Security & Stabilization (CURRENT)
- [ ] Commit `firestore.rules` to GitHub repo.
- [ ] Enable Firebase App Check (reCAPTCHA v3).
- [ ] Audit and fix empty `cart.js` and `checkout.js` (rebuild securely).
- [ ] Remove duplicate/orphan pages (`contact.html` vs `contact-us.html`).
- [ ] Create Project Bible documentation.

## Phase 2: Dynamic Products & Carts
- [ ] Migrate hardcoded products to Firestore `products` collection.
- [ ] Build Admin UI to add/edit products.
- [ ] Replace LocalStorage cart with Firestore-backed cart.

## Phase 3: Secure Orders & Cloud Functions
- [ ] Write `createOrder` Cloud Function (Zero Trust pricing).
- [ ] Update checkout flow to use Cloud Function.
- [ ] Implement OTP delivery verification in Cloud Functions.

## Phase 4: React Migration & Polish
- [ ] Rebuild frontend in Vite + React.
- [ ] Implement strict UI/UX guidelines (mobile-first).
- [ ] Optimize 41MB of images for performance.

## Phase 5: Deployment & Domain
- [ ] Set up Firebase Hosting (staging environment).
- [ ] Point GoDaddy domain to Firebase Hosting.
- [ ] Final security audit.
