# Firestore schema (MVP)

> All collections are **multi-tenant** and **scoped by `vendorId`**.
> Every write is recorded in `auditLogs` for sensitive operations.

## Collections

### `vendors/{vendorId}`

```json
{
  "name": "string",
  "status": "active|suspended",
  "branding": {
    "logoUrl": "string",
    "primaryColor": "string",
    "secondaryColor": "string"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `staff/{staffId}`

```json
{
  "vendorId": "string",
  "username": "string",
  "pinHash": "string",
  "role": "owner|manager|cashier|kitchen|viewer",
  "permissions": {
    "refunds": true,
    "discounts": true
  },
  "isActive": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `sessions/{sessionId}`

```json
{
  "vendorId": "string",
  "staffId": "string",
  "deviceId": "string",
  "deviceType": "pos|kitchen|customer|dashboard",
  "createdAt": "timestamp",
  "expiresAt": "timestamp",
  "revokedAt": "timestamp|null"
}
```

### `devices/{deviceId}`

```json
{
  "vendorId": "string",
  "label": "string",
  "deviceType": "pos|kitchen|customer|dashboard",
  "approved": true,
  "registeredAt": "timestamp",
  "lastSeenAt": "timestamp"
}
```

### `categories/{categoryId}`

```json
{
  "vendorId": "string",
  "name": "string",
  "sortOrder": 0,
  "isActive": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `products/{productId}`

```json
{
  "vendorId": "string",
  "categoryId": "string",
  "name": "string",
  "price": 9.99,
  "imageUrl": "string",
  "isAvailable": true,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `orders/{orderId}`

```json
{
  "vendorId": "string",
  "orderNumber": 1001,
  "status": "new|in_progress|ready|completed|voided",
  "items": [
    {
      "productId": "string",
      "name": "string",
      "price": 9.99,
      "quantity": 2,
      "notes": "string"
    }
  ],
  "discount": {
    "type": "percent|fixed",
    "value": 10
  },
  "totals": {
    "subtotal": 19.98,
    "discount": 2.0,
    "tax": 1.6,
    "total": 19.58
  },
  "payment": {
    "method": "cash|card|wallet",
    "received": 20.0,
    "change": 0.42
  },
  "createdBy": "staffId",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `auditLogs/{logId}`

```json
{
  "vendorId": "string",
  "staffId": "string",
  "action": "string",
  "resource": "string",
  "resourceId": "string",
  "meta": {},
  "createdAt": "timestamp"
}
```

### `shifts/{shiftId}`

```json
{
  "vendorId": "string",
  "openedBy": "staffId",
  "openedAt": "timestamp",
  "closedAt": "timestamp|null",
  "openingCash": 100,
  "closingCash": 120
}
```

### `imports/{importId}`

```json
{
  "vendorId": "string",
  "type": "products",
  "fileUrl": "string",
  "status": "queued|processing|completed|failed",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Storage paths

```
/vendorAssets/{vendorId}/branding/{fileName}
/vendorAssets/{vendorId}/products/{productId}/{fileName}
```
