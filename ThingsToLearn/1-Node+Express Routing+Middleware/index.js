// ============================================
// WHAT IS EXPRESS?
// ============================================
// Express is a web framework for Node.js that makes it easier to:
// - Create web servers
// - Handle HTTP requests (GET, POST, PUT, DELETE)
// - Define routes (URLs that users can visit)
// - Use middleware (functions that process requests)

// First, we need to import (require) the express library
// Think of this like importing a tool from your toolbox
const express = require('express');

// Create an instance of an Express application
// This 'app' object will be our web server
const app = express();

// Define what port our server will listen on
// Port is like a door number - clients connect to this specific door
const PORT = 3000;


// ============================================
// WHAT IS MIDDLEWARE?
// ============================================
// Middleware are functions that run BEFORE your route handlers
// They have access to:
// - req (request) - information about the incoming request
// - res (response) - the object you use to send a response back
// - next - a function you call to move to the next middleware or route

// Middleware runs in the ORDER you define it
// Think of it like a pipeline: request -> middleware1 -> middleware2 -> route handler


// ============================================
// MIDDLEWARE #1: Request Logger
// ============================================
// This middleware logs every request that comes to our server
// It will run for EVERY route because we use app.use() without a path

// app.use() registers middleware globally (for all routes)
app.use((req, res, next) => {
  // req.method is the HTTP method (GET, POST, etc.)
  // req.url is the path the user is requesting (/hello, /about, etc.)
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} request to ${req.url}`);

  // next() tells Express "I'm done, move to the next middleware or route"
  // If you forget to call next(), the request will hang and never respond!
  next();
});


// ============================================
// MIDDLEWARE #2: Request Counter
// ============================================
// This middleware keeps track of how many requests we've received
// Variables outside the middleware persist across requests

let requestCount = 0;

app.use((req, res, next) => {
  // Increment the counter every time a request comes in
  requestCount++;
  console.log(`Total requests received: ${requestCount}`);

  // Move to the next middleware
  next();
});


// ============================================
// MIDDLEWARE #3: Add Timestamp to Request
// ============================================
// This middleware adds a custom property to the request object
// Any middleware or route handler after this can access req.timestamp

app.use((req, res, next) => {
  // You can add custom properties to the req object
  // This is useful for passing data between middleware
  req.timestamp = new Date().toISOString();

  next();
});


// ============================================
// ROUTE #1: Home/Root Route
// ============================================
// Routes define what happens when someone visits a specific URL
// app.get() handles GET requests (when you type a URL in your browser)

// The '/' path is the root - like visiting http://localhost:3000/
app.get('/', (req, res) => {
  // res.send() sends a response back to the client
  // This will show in their browser
  res.send('Welcome to the Node.js + Express Learning Server!');
});


// ============================================
// ROUTE #2: Hello Route
// ============================================
// This route is at http://localhost:3000/hello
app.get('/hello', (req, res) => {
  // We can access the timestamp that our middleware added
  res.send(`Hello! This request was made at ${req.timestamp}`);
});


// ============================================
// ROUTE #3: About Route
// ============================================
app.get('/about', (req, res) => {
  // You can send HTML in your response
  res.send('<h1>About Page</h1><p>This is a learning project for Node.js and Express</p>');
});


// ============================================
// ROUTE #4: Stats Route
// ============================================
// This route shows our request counter
app.get('/stats', (req, res) => {
  // res.json() sends a JSON response
  // JSON is the standard format for APIs
  res.json({
    message: 'Server Statistics',
    totalRequests: requestCount,
    serverUptime: process.uptime() + ' seconds'
  });
});


// ============================================
// ROUTE #5: POST Request Example
// ============================================
// app.post() handles POST requests (used for sending data to the server)
// You'll test this with Postman, not a browser

app.post('/data', (req, res) => {
  // In a real app, you would read the body of the request here
  // For now, we'll just acknowledge receiving the POST request
  res.json({
    message: 'POST request received!',
    timestamp: req.timestamp,
    note: 'In the next module, we will learn how to read data from the request body'
  });
});


// ============================================
// ROUTE-SPECIFIC MIDDLEWARE EXAMPLE
// ============================================
// You can also apply middleware to specific routes only
// This middleware will ONLY run for the /protected route

// Define a middleware function
const checkAccess = (req, res, next) => {
  console.log('Checking access for protected route...');

  // In a real app, you might check for authentication here
  // For now, we'll just log and allow access
  const hasAccess = true;

  if (hasAccess) {
    console.log('Access granted!');
    next(); // Allow the request to continue
  } else {
    // If access is denied, send an error response
    // Don't call next() - the request stops here
    res.status(403).send('Access Denied');
  }
};

// Apply the middleware ONLY to this route by passing it as the second argument
app.get('/protected', checkAccess, (req, res) => {
  res.send('You accessed a protected route!');
});


// ============================================
// 404 HANDLER (Catch-All Route)
// ============================================
// This must be AFTER all other routes
// If no other route matches, this one will catch the request

app.use((req, res) => {
  // res.status() sets the HTTP status code
  // 404 means "Not Found"
  res.status(404).send('404 - Page Not Found. Try visiting /, /hello, /about, /stats, or /protected');
});


// ============================================
// START THE SERVER
// ============================================
// app.listen() starts the server and makes it listen for requests

app.listen(PORT, () => {
  // This callback runs when the server successfully starts
  console.log('=================================');
  console.log('Server is running!');
  console.log(`Visit: http://localhost:${PORT}`);
  console.log('=================================');
  console.log('Available routes:');
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/hello`);
  console.log(`  GET  http://localhost:${PORT}/about`);
  console.log(`  GET  http://localhost:${PORT}/stats`);
  console.log(`  GET  http://localhost:${PORT}/protected`);
  console.log(`  POST http://localhost:${PORT}/data`);
  console.log('=================================');
});
