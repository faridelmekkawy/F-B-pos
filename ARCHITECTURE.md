# MVP application architecture

This repository currently contains single-file HTML prototypes. The production path below describes how to implement the MVP using a React + Vite + TypeScript + Tailwind UI while preserving the five-device app model. The plan assumes Firebase Hosting + Firestore + Storage and a custom session flow via Cloud Functions that mints custom auth tokens.

## App routes and device bindings

| App | Route | Device type | Primary roles |
| --- | --- | --- | --- |
| Vendor Dashboard | `/dashboard` | `dashboard` | owner, manager, viewer |
| POS | `/pos` | `pos` | owner, manager, cashier |
| Kitchen | `/kitchen` | `kitchen` | kitchen |
| Customer Display | `/customer` | `customer` | system-only |
| Receipt | `/receipt/:orderId` | `pos` | owner, manager, cashier |

## Session model

1. Staff logs in with `username + PIN`.
2. Cloud Function validates PIN hash, device approval, and role.
3. Cloud Function mints a Firebase custom token with claims: `vendorId`, `staffId`, `role`, `deviceType`.
4. Frontend exchanges token for Firebase session, stores `sessionId` and `deviceId` in local storage.
5. All app routes enforce session and device type.

## Offline behavior

- POS uses Firestore offline persistence for order draft queue.
- Kitchen display subscribes to `orders` by `status` with real-time updates.
- Customer display uses a subset of the live order feed.

## Security requirements

- Firestore rules enforce `vendorId` isolation.
- Devices must be pre-approved in `devices` before sessions can be issued.
- Sensitive operations (discounts/refunds/voids/staff changes) require audit logs.

## Firebase Hosting

- Single deployment hosting all routes.
- Use rewrites to `index.html` for SPA routing.
- Use environment-specific Firebase config.
