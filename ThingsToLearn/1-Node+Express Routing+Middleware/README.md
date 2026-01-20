# Module 1: Node.js + Express Routing & Middleware

## What You'll Learn

In this module, you'll learn the fundamentals of building a web server with Node.js and Express:

- **Express Framework**: What it is and why we use it
- **Routing**: How to handle different URLs and HTTP methods (GET, POST)
- **Middleware**: Functions that process requests before they reach your route handlers
- **Request/Response Cycle**: How data flows through your server
- **The `next()` Function**: How middleware chains work together

## Prerequisites

- Node.js installed on your computer (download from nodejs.org)
- Basic JavaScript knowledge
- Postman (or similar tool) for testing POST requests

## Setup Instructions

### 1. Install Dependencies

Open your terminal in this folder and run:

```bash
npm install
```

This will install:
- `express` - The web framework
- `nodemon` - Automatically restarts your server when you make changes (dev only)

### 2. Start the Server

For development (with auto-restart):
```bash
npm run dev
```

Or start normally:
```bash
npm start
```

You should see:
```
Server is running!
Visit: http://localhost:3000
```

## Testing the Routes

### In Your Browser

You can test GET requests directly in your browser:

1. **Home Route**: http://localhost:3000/
   - **Expected**: "Welcome to the Node.js + Express Learning Server!"

2. **Hello Route**: http://localhost:3000/hello
   - **Expected**: "Hello! This request was made at [timestamp]"

3. **About Route**: http://localhost:3000/about
   - **Expected**: HTML page with an "About" heading

4. **Stats Route**: http://localhost:3000/stats
   - **Expected**: JSON with request count and server uptime
   ```json
   {
     "message": "Server Statistics",
     "totalRequests": 5,
     "serverUptime": "23.456 seconds"
   }
   ```

5. **Protected Route**: http://localhost:3000/protected
   - **Expected**: "You accessed a protected route!"
   - Check the terminal - you'll see the middleware logging

6. **404 Error**: http://localhost:3000/nonexistent
   - **Expected**: "404 - Page Not Found..."

### In Postman

For the POST request, you'll need Postman:

1. **Create a new request** in Postman
2. **Method**: POST
3. **URL**: http://localhost:3000/data
4. **Click Send**

**Expected Response**:
```json
{
  "message": "POST request received!",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "note": "In the next module, we will learn how to read data from the request body"
}
```

## What's Happening Behind the Scenes

### The Request Flow

When you visit http://localhost:3000/hello, here's what happens:

```
1. Request arrives at server
2. ↓
3. Logger Middleware (logs the request)
4. ↓
5. Counter Middleware (increments request count)
6. ↓
7. Timestamp Middleware (adds timestamp to request object)
8. ↓
9. Route Handler for /hello (sends response)
10. ↓
11. Response sent back to browser
```

### Middleware Order Matters!

The middleware runs in the order you define it with `app.use()`. If you need the timestamp in your route, the timestamp middleware must come before the route.

### Key Concepts

**1. What is Express?**
- A framework that simplifies creating web servers in Node.js
- Handles routing, middleware, and HTTP requests/responses

**2. What is Middleware?**
- Functions that run BEFORE your route handlers
- Can modify the request/response objects
- Must call `next()` to pass control to the next middleware/route
- Used for: logging, authentication, parsing data, etc.

**3. What are Routes?**
- Define what happens when someone visits a URL
- `app.get()` for GET requests (viewing pages)
- `app.post()` for POST requests (submitting data)
- Can have route-specific middleware

**4. The Request Object (`req`)**
- Contains information about the incoming request
- `req.method` - HTTP method (GET, POST, etc.)
- `req.url` - The path (/hello, /about)
- `req.params` - URL parameters (covered in next module)
- `req.body` - Request body data (covered in next module)

**5. The Response Object (`res`)**
- Used to send data back to the client
- `res.send()` - Send text or HTML
- `res.json()` - Send JSON data
- `res.status()` - Set HTTP status code

**6. The `next()` Function**
- Passes control to the next middleware or route
- If you don't call `next()`, the request will hang
- Don't call `next()` if you're sending a response

## Experiments to Try

1. **Change Middleware Order**: Move the timestamp middleware AFTER a route. What happens?

2. **Create Your Own Middleware**: Add a middleware that adds `req.customMessage = "Hello from middleware!"` and use it in a route

3. **Add a New Route**: Create a `/contact` route that returns your contact information as JSON

4. **Modify the Counter**: Make the counter reset to 0 after reaching 10 requests

5. **Break It**: Remove `next()` from a middleware. What happens when you visit a route?

## Common Issues

**Server won't start**:
- Make sure no other program is using port 3000
- Check that you ran `npm install` first

**Changes not showing**:
- If using `npm start`, you need to restart manually (Ctrl+C, then `npm start`)
- With `npm run dev`, nodemon should auto-restart
- Try refreshing your browser with Ctrl+Shift+R (hard refresh)

**404 on all routes**:
- Make sure the server is running (check terminal)
- Check you're using the right port (3000)
- Try http://localhost:3000/ with the trailing slash

## Next Steps

Once you're comfortable with routing and middleware, move on to:

**Module 2: HTTP + REST** - Learn about CRUD operations, HTTP methods, and building proper REST APIs

## Additional Resources

- [Express Official Documentation](https://expressjs.com/)
- [Understanding Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
