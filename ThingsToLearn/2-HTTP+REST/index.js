// ============================================
// WHAT IS REST?
// ============================================
// REST stands for REpresentational State Transfer
// It's a set of rules/conventions for building APIs
//
// REST uses HTTP methods to perform CRUD operations:
// - CREATE  -> POST    (Create new data)
// - READ    -> GET     (Retrieve/read data)
// - UPDATE  -> PUT     (Update existing data)
// - DELETE  -> DELETE  (Remove data)
//
// REST APIs use proper HTTP status codes:
// - 200 OK          - Request succeeded
// - 201 Created     - New resource created successfully
// - 404 Not Found   - Resource doesn't exist
// - 400 Bad Request - Invalid data sent
// - 500 Server Error - Something went wrong on the server

const express = require('express');
const cors = require('cors');

// Import our data from the data.js file
// In Node.js, require('./filename') imports code from another file
const { products, getNextId } = require('./data');

const app = express();
const PORT = 3001; // Using 3001 so it doesn't conflict with Module 1


// ============================================
// MIDDLEWARE SETUP
// ============================================

// CORS (Cross-Origin Resource Sharing) Middleware
// Allows your API to be accessed from web browsers on different domains
// Without this, browsers would block requests from websites to your API
// This is important for security but needs to be explicitly enabled
app.use(cors());

// express.json() Middleware
// This middleware parses JSON data from the request body
// When someone sends JSON data in a POST or PUT request,
// this middleware converts it from a string into a JavaScript object
// and makes it available in req.body
app.use(express.json());

// Logger Middleware (same as Module 1)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});


// ============================================
// REST API ROUTES
// ============================================

// Info Route - Shows API information
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API Learning Server',
    endpoints: {
      'GET /api/products': 'Get all products',
      'GET /api/products/:id': 'Get a specific product by ID',
      'POST /api/products': 'Create a new product',
      'PUT /api/products/:id': 'Update a product',
      'DELETE /api/products/:id': 'Delete a product'
    }
  });
});


// ============================================
// READ (GET) - Get All Products
// ============================================
// HTTP Method: GET
// URL: /api/products
// Purpose: Retrieve a list of all products
// Response Status: 200 OK

app.get('/api/products', (req, res) => {
  // Simply return the entire products array as JSON
  // res.json() automatically:
  // 1. Converts the JavaScript object/array to JSON string
  // 2. Sets the Content-Type header to 'application/json'
  // 3. Sends the response
  res.json(products);
});


// ============================================
// READ (GET) - Get Single Product by ID
// ============================================
// HTTP Method: GET
// URL: /api/products/:id (example: /api/products/1)
// Purpose: Retrieve ONE specific product
// Response Status: 200 OK if found, 404 Not Found if not found

// :id is a URL parameter - it's a variable in the URL
// If someone visits /api/products/1, then req.params.id will be "1"
// If someone visits /api/products/42, then req.params.id will be "42"
app.get('/api/products/:id', (req, res) => {
  // req.params contains all the URL parameters
  // Note: URL parameters are always STRINGS, so we convert to a number
  const id = parseInt(req.params.id);

  // Array.find() searches through the array and returns the first item that matches
  // It returns undefined if no match is found
  const product = products.find(p => p.id === id);

  // Check if we found the product
  if (product) {
    // Product found! Return it with 200 OK status (default)
    res.json(product);
  } else {
    // Product not found! Return 404 error
    // res.status(404) sets the status code
    // .json() sends the JSON response
    res.status(404).json({
      error: 'Product not found',
      message: `No product exists with ID ${id}`
    });
  }
});


// ============================================
// CREATE (POST) - Create a New Product
// ============================================
// HTTP Method: POST
// URL: /api/products
// Purpose: Add a new product to our collection
// Request Body: JSON with name, price, inStock
// Response Status: 201 Created

app.post('/api/products', (req, res) => {
  // req.body contains the data sent in the request
  // The express.json() middleware parsed it for us
  // Example: { "name": "Headphones", "price": 59.99, "inStock": true }

  // Extract the data from the request body
  const { name, price, inStock } = req.body;

  // VALIDATION: Check if required fields are provided
  // In a real app, you'd use a validation library like Joi or express-validator
  if (!name || price === undefined) {
    // Return 400 Bad Request if validation fails
    return res.status(400).json({
      error: 'Invalid data',
      message: 'Name and price are required fields'
    });
  }

  // Create a new product object
  const newProduct = {
    id: getNextId(),        // Get the next available ID from our data.js file
    name: name,             // Could also write just "name," (ES6 shorthand)
    price: parseFloat(price), // Convert to number if it's a string
    inStock: inStock !== undefined ? inStock : true // Default to true if not provided
  };

  // Add the new product to our products array
  products.push(newProduct);

  // Return 201 Created status with the new product
  // 201 means "successfully created a new resource"
  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct
  });
});


// ============================================
// UPDATE (PUT) - Update an Existing Product
// ============================================
// HTTP Method: PUT
// URL: /api/products/:id (example: /api/products/1)
// Purpose: Update an existing product's information
// Request Body: JSON with fields to update
// Response Status: 200 OK if updated, 404 Not Found if product doesn't exist

app.put('/api/products/:id', (req, res) => {
  // Get the ID from the URL
  const id = parseInt(req.params.id);

  // Get the update data from the request body
  const { name, price, inStock } = req.body;

  // Find the index of the product in our array
  // findIndex() returns -1 if no match is found
  const index = products.findIndex(p => p.id === id);

  // Check if product exists
  if (index === -1) {
    // Product not found
    return res.status(404).json({
      error: 'Product not found',
      message: `No product exists with ID ${id}`
    });
  }

  // Update the product
  // We only update the fields that were provided in the request
  // If a field wasn't sent, we keep the old value
  if (name !== undefined) {
    products[index].name = name;
  }
  if (price !== undefined) {
    products[index].price = parseFloat(price);
  }
  if (inStock !== undefined) {
    products[index].inStock = inStock;
  }

  // Return the updated product with 200 OK status
  res.json({
    message: 'Product updated successfully',
    product: products[index]
  });
});


// ============================================
// DELETE - Remove a Product
// ============================================
// HTTP Method: DELETE
// URL: /api/products/:id (example: /api/products/1)
// Purpose: Remove a product from our collection
// Response Status: 200 OK if deleted, 404 Not Found if product doesn't exist

app.delete('/api/products/:id', (req, res) => {
  // Get the ID from the URL
  const id = parseInt(req.params.id);

  // Find the index of the product
  const index = products.findIndex(p => p.id === id);

  // Check if product exists
  if (index === -1) {
    return res.status(404).json({
      error: 'Product not found',
      message: `No product exists with ID ${id}`
    });
  }

  // Remove the product from the array
  // Array.splice(index, 1) removes 1 item at the specified index
  // It returns an array of removed items
  const deletedProduct = products.splice(index, 1)[0];

  // Return success message with the deleted product info
  res.json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
});


// ============================================
// 404 HANDLER
// ============================================
// If no route matches, return 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.url}. Check the API documentation at /`
  });
});


// ============================================
// START THE SERVER
// ============================================
app.listen(PORT, () => {
  console.log('=================================');
  console.log('REST API Server is running!');
  console.log(`URL: http://localhost:${PORT}`);
  console.log('=================================');
  console.log('Available Endpoints:');
  console.log(`  GET    http://localhost:${PORT}/api/products`);
  console.log(`  GET    http://localhost:${PORT}/api/products/:id`);
  console.log(`  POST   http://localhost:${PORT}/api/products`);
  console.log(`  PUT    http://localhost:${PORT}/api/products/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/products/:id`);
  console.log('=================================');
  console.log('Use Postman or similar tool to test the API');
  console.log('Initial products:', products.length);
  console.log('=================================');
});
