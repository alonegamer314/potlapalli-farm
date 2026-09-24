# Security Rules Overview

## Current Status
- App Check: DISABLED (To be enabled in Phase 1)
- Rules Version: v2

## Role Definitions
- `admin`: Full read/write access to all collections.
- `driver` / `maps`: Can read all orders, update status to "Delivered" or "Cancelled".
- `customer`: Can read/write their own user profile. Can create orders. Can read their own orders. Can only cancel their own orders.

## Key Rules (Current)
*(Paste the exact rules from your `rules_version = '2';` file here)*

## Backend Validation Rules (Target)
- Prices and totals will be validated by Cloud Functions, not client-side.
- Order status transitions will be strictly controlled (e.g., cannot go from "Pending" to "Delivered" without passing through "Out for Delivery").
