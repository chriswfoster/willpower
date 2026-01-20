# Module 2: HTTP + REST API

## What You'll Learn

In this module, you'll learn how to build a proper REST API with full CRUD operations:

- **REST Principles**: What REST is and why it's the standard for APIs
- **HTTP Methods**: GET, POST, PUT, DELETE and when to use each
- **CRUD Operations**: Create, Read, Update, Delete
- **HTTP Status Codes**: 200, 201, 404, 400, 500 and what they mean
- **Request Data**: Body, params, and query parameters
- **CORS**: Allowing browsers to access your API
- **JSON**: The standard data format for APIs

## Prerequisites

- Completed Module 1 (Node+Express Routing+Middleware)
- Postman or similar API testing tool installed
- Basic understanding of JavaScript objects and arrays

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `cors` - Enables cross-origin requests
- `nodemon` - Auto-restart during development

### 2. Start the Server

```bash
npm run dev
```

You should see:
```
REST API Server is running!
URL: http://localhost:3001
Initial products: 4
```

## Understanding REST

### What is REST?

REST (REpresentational State Transfer) is a set of conventions for building APIs. It uses:
- **Resources**: Things like users, products, posts (nouns, not verbs)
- **HTTP Methods**: To perform actions on resources
- **Standard URLs**: Predictable patterns like `/api/products`
- **Status Codes**: To indicate success or failure

### REST URL Patterns

```
GET    /api/products     → Get all products (Collection)
GET    /api/products/1   → Get product with ID 1 (Single item)
POST   /api/products     → Create a new product
PUT    /api/products/1   → Update product with ID 1
DELETE /api/products/1   → Delete product with ID 1
```

### HTTP Methods = CRUD Operations

| HTTP Method | CRUD Operation | Purpose | Status Code |
|-------------|----------------|---------|-------------|
| POST        | Create         | Add new item | 201 Created |
| GET         | Read           | Get item(s) | 200 OK |
| PUT         | Update         | Modify item | 200 OK |
| DELETE      | Delete         | Remove item | 200 OK |

## Testing with Postman

### 1. READ All Products (GET)

**Method**: GET
**URL**: `http://localhost:3001/api/products`
**Body**: None

**Expected Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 999.99,
    "inStock": true
  },
  {
    "id": 2,
    "name": "Mouse",
    "price": 29.99,
    "inStock": true
  },
  ...
]
```

### 2. READ Single Product (GET)

**Method**: GET
**URL**: `http://localhost:3001/api/products/1`
**Body**: None

**Expected Response (200 OK)**:
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 999.99,
  "inStock": true
}
```

**Try a non-existent ID**: `http://localhost:3001/api/products/999`

**Expected Response (404 Not Found)**:
```json
{
  "error": "Product not found",
  "message": "No product exists with ID 999"
}
```

### 3. CREATE New Product (POST)

**Method**: POST
**URL**: `http://localhost:3001/api/products`
**Headers**:
- Content-Type: `application/json`

**Body** (raw JSON):
```json
{
  "name": "Webcam",
  "price": 89.99,
  "inStock": true
}
```

**Expected Response (201 Created)**:
```json
{
  "message": "Product created successfully",
  "product": {
    "id": 5,
    "name": "Webcam",
    "price": 89.99,
    "inStock": true
  }
}
```

**Test Validation** - Try sending incomplete data:
```json
{
  "name": "Test"
}
```

**Expected Response (400 Bad Request)**:
```json
{
  "error": "Invalid data",
  "message": "Name and price are required fields"
}
```

### 4. UPDATE Product (PUT)

**Method**: PUT
**URL**: `http://localhost:3001/api/products/1`
**Headers**:
- Content-Type: `application/json`

**Body** (raw JSON):
```json
{
  "name": "Gaming Laptop",
  "price": 1299.99
}
```

**Expected Response (200 OK)**:
```json
{
  "message": "Product updated successfully",
  "product": {
    "id": 1,
    "name": "Gaming Laptop",
    "price": 1299.99,
    "inStock": true
  }
}
```

Note: You can update just one field:
```json
{
  "price": 899.99
}
```

### 5. DELETE Product (DELETE)

**Method**: DELETE
**URL**: `http://localhost:3001/api/products/2`
**Body**: None

**Expected Response (200 OK)**:
```json
{
  "message": "Product deleted successfully",
  "product": {
    "id": 2,
    "name": "Mouse",
    "price": 29.99,
    "inStock": true
  }
}
```

Now if you GET all products, you'll see product with ID 2 is gone.

## Complete Testing Workflow

Try this sequence to see how everything works together:

1. **GET all products** - See the initial 4 products
2. **POST a new product** - Add "Headphones" for $59.99
3. **GET all products again** - Now you should see 5 products
4. **GET the new product by ID** - Use the ID from step 2
5. **PUT to update it** - Change the price to $49.99
6. **GET it again** - Confirm the price changed
7. **DELETE it** - Remove the product
8. **GET all products** - Back to 4 products
9. **Try to GET the deleted product** - Should get 404

## HTTP Status Codes

Common status codes you'll see:

**Success Codes (2xx)**:
- `200 OK` - Request succeeded (GET, PUT, DELETE)
- `201 Created` - New resource created (POST)

**Client Error Codes (4xx)**:
- `400 Bad Request` - Invalid data sent
- `404 Not Found` - Resource doesn't exist

**Server Error Codes (5xx)**:
- `500 Internal Server Error` - Something broke on the server

## Key Concepts

### 1. Request Body vs URL Params

**Request Body** (req.body):
- Used with POST and PUT requests
- Contains the data you're sending (JSON format)
- Needs `express.json()` middleware to parse

**URL Parameters** (req.params):
- Part of the URL path: `/api/products/:id`
- Used to identify which resource to act on
- Example: In `/api/products/5`, the `5` is in `req.params.id`

### 2. CORS (Cross-Origin Resource Sharing)

CORS allows your API to be accessed from web browsers on different domains. Without CORS:
- Your API works in Postman ✅
- But fails in browser ❌

With `app.use(cors())`:
- Works everywhere ✅

### 3. JSON (JavaScript Object Notation)

JSON is the universal format for APIs:
```json
{
  "name": "John",
  "age": 30,
  "active": true
}
```

- Keys must be in double quotes
- Values can be strings, numbers, booleans, arrays, or objects
- No trailing commas allowed

### 4. In-Memory Storage

In this module, we store data in a JavaScript array (`products`). This means:
- ✅ Simple to understand
- ✅ No database setup needed
- ❌ Data is lost when server restarts
- ❌ Not suitable for production

In Module 4, we'll use a real database (SQLite).

## Common Issues

**Port already in use**:
- Module 1 uses port 3000, this uses 3001
- Make sure you're not running multiple servers on the same port

**Can't send JSON in Postman**:
1. Select "Body" tab
2. Choose "raw"
3. Select "JSON" from the dropdown
4. Enter your JSON data

**404 on POST/PUT requests**:
- Check the URL carefully: `/api/products` (not `/products`)
- Check the HTTP method is correct

**400 Bad Request on POST**:
- Make sure you're sending valid JSON
- Check you included required fields (name and price)

**Changes not persisting**:
- Data is in memory - restarting the server resets everything
- This is normal! Real databases persist data.

## Experiments to Try

1. **Add Validation**: Add a check that price must be greater than 0

2. **Add a New Field**: Add a `category` field to products (e.g., "Electronics")

3. **Query Parameters**: Add filtering like `/api/products?inStock=true` to show only products in stock

4. **Pagination**: Limit results to 2 per page: `/api/products?page=1&limit=2`

5. **Search**: Add a search endpoint: `/api/products/search?name=laptop`

## Next Steps

Once you're comfortable with REST APIs and CRUD operations, move on to:

**Module 3: Async/Await** - Learn how to handle asynchronous operations like database queries and external API calls

## Additional Resources

- [REST API Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [Postman Learning Center](https://learning.postman.com/)
- [JSON Validator](https://jsonlint.com/)
