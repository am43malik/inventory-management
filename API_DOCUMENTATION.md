# API Documentation

Complete API reference for the Retail Inventory Management System.

## Base URL
```
http://localhost:3000/api
```

## Authentication

All endpoints (except auth) require a JWT token in the Cookie:
```
Cookie: token=your_jwt_token
```

Or as Authorization header:
```
Authorization: Bearer your_jwt_token
```

---

## Authentication Endpoints

### 1. Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "cashier"
  },
  "token": "jwt_token"
}
```

### 2. Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  },
  "token": "jwt_token"
}
```

### 3. Verify Token
```
GET /auth/verify
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "userId": "user_id",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### 4. Logout
```
POST /auth/logout
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Products Endpoints

### 1. List Products
```
GET /products?page=1&limit=20&category=category_id&search=query
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `category` (optional): Filter by category ID
- `search` (optional): Search term

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "sku": "SKU123",
      "category": "category_id",
      "costPrice": 10,
      "salePrice": 15,
      "unit": "pcs",
      "minStock": 5,
      "batches": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### 2. Get Product Details
```
GET /products/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "Product Name",
    "sku": "SKU123",
    "category": "category_id",
    "costPrice": 10,
    "salePrice": 15,
    "unit": "pcs",
    "batches": [
      {
        "batchNumber": "BATCH001",
        "quantity": 100,
        "costPrice": 10,
        "expiryDate": "2025-12-31"
      }
    ]
  }
}
```

### 3. Create Product (Admin Only)
```
POST /products
```

**Request Body:**
```json
{
  "name": "Product Name",
  "sku": "SKU123",
  "category": "category_id",
  "description": "Product description",
  "costPrice": 10,
  "salePrice": 15,
  "unit": "pcs",
  "minStock": 5
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { /* product data */ }
}
```

### 4. Update Product (Admin Only)
```
PUT /products/:id
```

**Request Body:** (partial update allowed)
```json
{
  "name": "Updated Name",
  "salePrice": 20
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { /* updated product data */ }
}
```

### 5. Delete Product (Admin Only)
```
DELETE /products/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Categories Endpoints

### 1. List Categories
```
GET /categories
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "Electronics",
      "description": "Electronic products",
      "isActive": true
    }
  ]
}
```

### 2. Create Category (Admin Only)
```
POST /categories
```

**Request Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic products"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": { /* category data */ }
}
```

---

## Inventory Endpoints

### 1. Adjust Inventory (Admin Only)
```
POST /inventory/adjust
```

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 50,
  "costPrice": 10,
  "batchNumber": "BATCH001",
  "type": "purchase",
  "expiryDate": "2025-12-31",
  "reason": "Stock purchase"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Inventory adjusted successfully",
  "data": {
    "product": { /* product data */ },
    "log": { /* inventory log */ }
  }
}
```

### 2. Get Inventory Summary
```
GET /inventory/summary
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": [
      {
        "productId": "product_id",
        "name": "Product Name",
        "sku": "SKU123",
        "currentStock": 50,
        "minStock": 5,
        "isLowStock": false,
        "batches": []
      }
    ],
    "lowStockCount": 3,
    "lowStockProducts": [],
    "totalProducts": 10
  }
}
```

### 3. Get Inventory Logs
```
GET /inventory/adjust?page=1&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "log_id",
      "productId": { "name": "Product", "sku": "SKU" },
      "type": "purchase",
      "quantity": 50,
      "previousQuantity": 0,
      "newQuantity": 50,
      "reason": "Stock purchase",
      "performedBy": { "name": "Admin" }
    }
  ],
  "pagination": { /* pagination data */ }
}
```

---

## Sales Endpoints

### 1. Create Sale
```
POST /sales
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "salePrice": 15
    }
  ],
  "taxPercentage": 5,
  "discount": 0,
  "paymentMethod": "cash",
  "notes": "Regular sale"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Sale created successfully",
  "data": {
    "_id": "sale_id",
    "items": [],
    "subtotal": 30,
    "taxAmount": 1.5,
    "total": 31.5,
    "paymentMethod": "cash",
    "cashier": { "name": "Cashier Name" }
  }
}
```

### 2. Get Sales History
```
GET /sales?page=1&limit=20&startDate=2025-01-01&endDate=2025-12-31
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)

**Response (200):**
```json
{
  "success": true,
  "data": [ /* sales array */ ],
  "pagination": { /* pagination data */ }
}
```

---

## Reports Endpoints

### 1. Daily Report
```
GET /reports/daily?days=1
```

**Query Parameters:**
- `days` (optional): Number of days back (default: 1)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "date": "2025-11-29",
    "periodDays": 1,
    "totalSales": 10,
    "totalRevenue": 500,
    "totalCost": 300,
    "totalProfit": 200,
    "totalTax": 25,
    "totalDiscount": 0,
    "totalUnitsSold": 50,
    "productBreakdown": []
  }
}
```

### 2. Period Report
```
GET /reports/period?period=30
```

**Query Parameters:**
- `period` (optional): Days (7, 30, 90)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "30 days",
    "startDate": "2025-10-30",
    "endDate": "2025-11-29",
    "totalRevenue": 15000,
    "totalCost": 9000,
    "totalProfit": 6000,
    "profitMargin": "40.00",
    "dailyBreakdown": [
      {
        "date": "2025-11-29",
        "totalRevenue": 500,
        "totalProfit": 200,
        "transactionCount": 10
      }
    ]
  }
}
```

### 3. Top Products
```
GET /reports/top-products?limit=10
```

**Query Parameters:**
- `limit` (optional): Number of products (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "topProducts": [
      {
        "productId": "product_id",
        "productName": "Product Name",
        "sku": "SKU123",
        "unitsSold": 100,
        "revenue": 1500,
        "cost": 1000,
        "profit": 500
      }
    ],
    "totalUnique": 25
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "number",
      "path": ["quantity"]
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

### 409 Conflict
```json
{
  "error": "SKU already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Common Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful GET/PUT request |
| 201 | Created | Successful POST request |
| 400 | Bad Request | Invalid input parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

No rate limiting implemented by default. Consider adding for production:
- 100 requests per minute per user
- 1000 requests per minute per IP

---

## Pagination

All list endpoints support pagination:
```
GET /api/endpoint?page=1&limit=20
```

Response includes:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "pages": 25
  }
}
```

---

## Sorting

For reports and lists, data is sorted by:
- Products: Created date (descending)
- Sales: Created date (descending)
- Inventory Logs: Created date (descending)

---

## Version

**API Version**: 1.0.0
**Last Updated**: November 29, 2025
