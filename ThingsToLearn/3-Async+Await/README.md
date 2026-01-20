# Module 3: Async/Await

## What You'll Learn

In this module, you'll master asynchronous JavaScript - one of the most important concepts in backend development:

- **Why Async Matters**: Why backend code must be asynchronous
- **Callbacks**: The old way (and why we moved away from it)
- **Promises**: The foundation of modern async JavaScript
- **Async/Await**: The modern, readable way to write async code
- **Error Handling**: Using try/catch with async code
- **Sequential vs Parallel**: When to wait and when to run operations simultaneously
- **External APIs**: Fetching data from other services

## Prerequisites

- Completed Module 1 & 2
- Understanding of JavaScript functions
- Basic knowledge of APIs and HTTP requests

## Why Async is Critical for Backend

Backend operations are **I/O heavy** (Input/Output):
- Database queries
- Reading/writing files
- API calls to other services
- Network requests

These operations take time (milliseconds to seconds). If we waited for each one to complete before doing anything else, our server would be **extremely slow** and could only handle one request at a time.

**Async/await allows**:
- Non-blocking code - server can handle many requests simultaneously
- Better performance - operations run in parallel when possible
- Cleaner code - async code looks like synchronous code

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `node-fetch` - Make HTTP requests from Node.js
- `nodemon` - Auto-restart during development

### 2. Run the Standalone Examples

Start here to understand the basics:

```bash
npm run examples
```

This runs `examples.js` which demonstrates:
- Synchronous vs asynchronous code
- Callbacks, Promises, and Async/Await
- Error handling
- Sequential vs parallel operations
- Common mistakes

Watch the console output carefully!

### 3. Start the Express Server

```bash
npm run dev
```

The server starts on port 3002 and demonstrates async/await in real routes.

## Understanding the Examples

### Standalone Examples (examples.js)

Run `npm run examples` and watch the console. You'll see 8 examples that progressively teach async concepts:

1. **Synchronous Code** - How code normally runs (line by line)
2. **Callbacks** - The old way with callback functions
3. **Promises** - Better, but still verbose with `.then()` chains
4. **Async/Await** - Modern and readable
5. **Error Handling** - Using try/catch
6. **Sequential Operations** - Waiting for one thing before starting another
7. **Parallel Operations** - Running multiple things at once (faster!)
8. **Common Mistakes** - What happens when you forget `await`

**Key Takeaway**: Watch how the same operation looks with callbacks, promises, and async/await. Async/await is the clearest!

## Testing the Server Routes

### 1. Basic Async Route

**URL**: http://localhost:3002/api/basic

This simulates a database query with a 1-second delay.

**Response**:
```json
{
  "message": "Data from async operation",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

### 2. Fetch from External API

**URL**: http://localhost:3002/api/posts

Fetches real data from JSONPlaceholder (a free fake API for testing).

**Response**:
```json
{
  "message": "Posts fetched successfully from external API",
  "count": 100,
  "posts": [
    {
      "userId": 1,
      "id": 1,
      "title": "sunt aut facere...",
      "body": "quia et suscipit..."
    }
    // ... 4 more posts
  ]
}
```

### 3. Fetch Single Post

**URL**: http://localhost:3002/api/posts/5

Gets one specific post by ID.

**Try a non-existent ID**: http://localhost:3002/api/posts/999

**Response (404)**:
```json
{
  "error": "Post not found",
  "postId": "999"
}
```

### 4. Sequential Operations

**URL**: http://localhost:3002/api/user/1/with-posts

1. First fetches user data
2. Then fetches that user's posts

Watch the console - you'll see each step happen in order.

**Response**:
```json
{
  "message": "User and posts fetched successfully (sequential)",
  "user": {
    "id": 1,
    "name": "Leanne Graham",
    "email": "Sincere@april.biz"
  },
  "postsCount": 10,
  "posts": [...]
}
```

**Timing**: Takes ~2 seconds (1s for user + 1s for posts)

### 5. Parallel Operations

**URL**: http://localhost:3002/api/dashboard

Fetches posts, users, and comments **all at the same time** using `Promise.all()`.

**Response**:
```json
{
  "message": "Dashboard data fetched successfully (parallel)",
  "stats": {
    "totalPosts": 100,
    "totalUsers": 10,
    "totalComments": 500
  },
  "note": "All 3 requests ran at the same time..."
}
```

**Timing**: Takes ~1 second (all run simultaneously)

**Compare to Sequential**:
- Sequential: 1s + 1s + 1s = 3 seconds
- Parallel: Max(1s, 1s, 1s) = 1 second

### 6. Error Handling Demo

**URL**: http://localhost:3002/api/error-demo/timeout

Simulates an error to show try/catch in action.

**Response**:
```json
{
  "error": "An error occurred",
  "details": "Request timed out",
  "tip": "This is how you handle errors in async/await code"
}
```

### 7. Old Way (Without Async/Await)

**URL**: http://localhost:3002/api/old-way

Shows the same code written with `.then()` chains instead of async/await.

Compare the code in `index.js` - which is easier to read?

## Key Concepts

### 1. The `async` Keyword

```javascript
async function fetchData() {
  // This function now returns a Promise
  return 'data';
}
```

- Marks a function as asynchronous
- Makes the function return a Promise automatically
- Allows you to use `await` inside

### 2. The `await` Keyword

```javascript
const data = await fetchData();
```

- Pauses the function until the Promise resolves
- Returns the resolved value (not the Promise)
- Can only be used inside `async` functions
- **Doesn't block the entire program** - other code can still run

### 3. Promises

A Promise represents a future value:

```javascript
const promise = fetch('https://api.example.com/data');
// promise is "pending"

const data = await promise;
// promise is now "fulfilled" with data
```

States:
- **Pending**: Operation in progress
- **Fulfilled**: Operation succeeded (resolved)
- **Rejected**: Operation failed (error)

### 4. Try/Catch Error Handling

```javascript
try {
  const data = await riskyOperation();
  // Use data
} catch (error) {
  // Handle error
  console.error(error.message);
}
```

Always wrap `await` calls in try/catch to handle errors gracefully.

### 5. Sequential vs Parallel

**Sequential** (one after another):
```javascript
const user = await fetchUser();      // Wait 1s
const posts = await fetchPosts();    // Wait 1s
// Total: 2s
```

**Parallel** (simultaneously):
```javascript
const [user, posts] = await Promise.all([
  fetchUser(),    // Start both
  fetchPosts()    // at the same time
]);
// Total: 1s (max of the two)
```

**Rule**: Use parallel when operations are **independent**. Use sequential when one operation **depends on** another.

## Common Mistakes

### 1. Forgetting `await`

```javascript
// WRONG ❌
const data = fetchData(); // Returns a Promise, not data!

// CORRECT ✅
const data = await fetchData();
```

### 2. Forgetting `async`

```javascript
// WRONG ❌
function getData() {
  const data = await fetchData(); // Error! await needs async
}

// CORRECT ✅
async function getData() {
  const data = await fetchData();
}
```

### 3. Not Handling Errors

```javascript
// WRONG ❌ - Error crashes the server
const data = await riskyOperation();

// CORRECT ✅
try {
  const data = await riskyOperation();
} catch (error) {
  console.error('Handled:', error);
}
```

### 4. Unnecessary Sequential Operations

```javascript
// SLOW ❌ - 2 seconds total
const users = await fetchUsers();
const posts = await fetchPosts();

// FAST ✅ - 1 second total (if independent)
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);
```

## Experiments to Try

1. **Modify Delays**: In `examples.js`, change the `setTimeout` delays. What happens?

2. **Break Promise.all**: In the dashboard route, make one URL invalid. Does the whole request fail?

3. **Sequential to Parallel**: Convert the `/api/user/:id/with-posts` route to use `Promise.all()`. Is it faster?

4. **Add Your Own Route**: Create a route that fetches data from a different API endpoint on JSONPlaceholder

5. **Error Recovery**: Modify an error handler to retry failed requests

6. **Race Condition**: Research `Promise.race()` and create a route that uses it

## Common Issues

**Examples run too fast to see**:
- The examples use `setTimeout` - watch the console timestamps
- Some operations run in parallel, so they overlap

**fetch is not defined**:
- Make sure you installed dependencies: `npm install`
- We use `node-fetch` v2 for Node.js compatibility

**All routes return immediately**:
- Check that you're using `await` before async operations
- Look at the console logs to see when operations complete

**Promise.all fails with one error**:
- That's expected! Promise.all fails if ANY promise rejects
- Use `Promise.allSettled()` if you want all to complete regardless

## Real-World Applications

When you'll use async/await in real backend development:

1. **Database Queries**:
```javascript
const users = await db.query('SELECT * FROM users');
```

2. **File Operations**:
```javascript
const content = await fs.readFile('data.txt', 'utf-8');
```

3. **External APIs**:
```javascript
const weather = await fetch('https://api.weather.com/...');
```

4. **Authentication**:
```javascript
const hash = await bcrypt.hash(password, 10);
```

5. **Image Processing**:
```javascript
const thumbnail = await sharp(image).resize(200, 200).toBuffer();
```

Basically: **any I/O operation** should be async!

## Next Steps

Once you understand async/await, move on to:

**Module 4: SQL + WITH JOINS** - Apply async/await to real database operations with SQLite

## Additional Resources

- [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) - Free fake API for testing
- [Promise.all vs Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
