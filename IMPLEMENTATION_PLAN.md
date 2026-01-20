# MVP implementation plan and deliverables

## Phase 1: Core platform

### Deliverables
- Firebase project with Firestore/Storage enabled.
- Cloud Functions for session creation and role enforcement.
- Firestore rules enforcing vendor isolation.
- Storage rules limiting uploads to vendor namespaces.

### Tasks
- Define Firestore schema and indexes.
- Implement PIN hashing and verification.
- Device registry approval flow.

## Phase 2: Vendor Dashboard

### Deliverables
- Vendor branding setup (logo upload).
- Staff management (roles, PIN reset, activation).
- Device registry management.
- Product categories and products (image upload).
- Excel import/export.
- Analytics pages: sales summary, top products, orders list.

### Tasks
- Dashboard UI with role guards.
- CRUD for categories/products.
- Storage integration for images.
- CSV/Excel import parser with validation.

## Phase 3: POS

### Deliverables
- Order creation and editing.
- Permission-based discounts and voids.
- Payment method capture (cash/card/wallet).
- Receipt rendering and print styles.
- Offline queue with sync.

### Tasks
- Cart and order state management.
- Payments capture UI.
- Receipt route and print CSS.
- Offline persistence + conflict resolution.

## Phase 4: Kitchen

### Deliverables
- Live order feed filtered by status.
- Status updates (new → in progress → ready).
- Sound alert toggle.

### Tasks
- Real-time subscriptions.
- Status transitions with audit logging.
- Audio toggle preference stored per device.

## Phase 5: Customer Display

### Deliverables
- Full-screen order display.
- Live status updates.
- Split-screen layout for current order + summary queue.

### Tasks
- Read-only feed with minimal UI.
- Display optimizations for large screens.

## Phase 6: Hardening

### Deliverables
- Audit logging coverage for sensitive actions.
- Monitoring and error reporting.
- Backup/retention policy.

### Tasks
- Cloud Logging setup.
- Firestore export schedule.
