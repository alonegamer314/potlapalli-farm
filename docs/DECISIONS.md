# Decision Log

## [2026-09-24] Rebuild codebase in React
- **Context:** Current site uses 15 separate HTML files with duplicated CSS/JS. Adding new features (admin dashboard, driver tracking) would require copy-pasting code everywhere.
- **Decision:** Migrate to Vite + React for a single-page application (SPA) architecture.
- **Consequence:** Steeper learning curve initially, but 10x easier to maintain and scale.

## [2026-09-24] Zero Trust Frontend for Pricing
- **Context:** Hackers can manipulate DevTools to change prices before checkout.
- **Decision:** All price calculations will be done via Cloud Functions on the backend. Frontend only sends `productId` and `quantity`.
- **Consequence:** Slightly more complex checkout flow, but completely unhackable prices.
