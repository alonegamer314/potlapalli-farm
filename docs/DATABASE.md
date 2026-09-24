# Firestore Database Schema

## Collection: `users`
- `uid` (string, auto) - Firebase Auth UID
- `email` (string)
- `name` (string)
- `phone` (string)
- `role` (string) - "customer" | "admin" | "driver"
- `address` (string)
- `createdAt` (timestamp)

## Collection: `products` (Target Phase 2)
- `id` (string, auto)
- `name` (string)
- `price` (number)
- `unit` (string) - "/kg", "/dozen", etc.
- `category` (string) - "Meat", "Eggs", "Live Birds"
- `isMeat` (boolean)
- `isLive` (boolean)
- `stock` (number)
- `image` (string - URL)

## Collection: `orders`
- `orderId` (string, auto)
- `userId` (string) - Reference to users.uid
- `items` (array) - [{ productId, name, price, quantity, unit }]
- `totalAmount` (number) - Calculated by backend ONLY
- `customerName` (string)
- `phone` (string)
- `address` (string)
- `paymentMethod` (string) - "COD" | "UPI"
- `status` (string) - "Pending" | "Confirmed" | "Out for Delivery" | "Delivered" | "Cancelled"
- `deliveryOTP` (string) - 6 digit code for delivery verification
- `otpExpiry` (timestamp)
- `assignedDriverId` (string) - Reference to users.uid
- `orderDate` (timestamp)
