// ============================================
// ASYNC/AWAIT IN EXPRESS - Practical Examples
// ============================================
// This server demonstrates how to use async/await in real backend scenarios
// We'll fetch data from an external API (JSONPlaceholder - a fake REST API for testing)

const express = require('express');
// node-fetch allows us to make HTTP requests from Node.js (like fetch in the browser)
const fetch = require('node-fetch');

const app = express();
const PORT = 3002; // Using 3002 to avoid conflicts

app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});


// ============================================
// ROUTE 1: Basic Async Route
// ============================================
// This route simulates an async database query

// You can mark a route handler as 'async'
// This allows you to use 'await' inside it
app.get('/api/basic', async (req, res) => {
  try {
    console.log('Simulating a database query...');

    // Simulate a delay (like a database query)
    // In real code, this might be: await db.query('SELECT * FROM users')
    const result = await new Promise(resolve => {
      setTimeout(() => {
        resolve({ message: 'Data from async operation', timestamp: new Date() });
      }, 1000);
    });

    // Send the result
    res.json(result);
  } catch (error) {
    // If anything goes wrong, catch the error
    console.error('Error in /api/basic:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


// ============================================
// ROUTE 2: Fetch from External API
// ============================================
// This route fetches real data from JSONPlaceholder (a fake REST API)
// JSONPlaceholder URL: https://jsonplaceholder.typicode.com/

app.get('/api/posts', async (req, res) => {
  try {
    console.log('Fetching posts from JSONPlaceholder...');

    // fetch() is asynchronous - it returns a Promise
    // We use 'await' to wait for the response
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');

    // Check if the request was successful
    if (!response.ok) {
      // response.ok is false for status codes like 404, 500, etc.
      throw new Error(`API responded with status ${response.status}`);
    }

    // Parse the JSON body (also async)
    // response.json() returns a Promise, so we await it too
    const posts = await response.json();

    // Return only the first 5 posts to keep it simple
    res.json({
      message: 'Posts fetched successfully from external API',
      count: posts.length,
      posts: posts.slice(0, 5) // First 5 posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({
      error: 'Failed to fetch posts',
      details: error.message
    });
  }
});


// ============================================
// ROUTE 3: Fetch Single Item by ID
// ============================================
// This demonstrates using route parameters with async/await

app.get('/api/posts/:id', async (req, res) => {
  try {
    // Get the ID from the URL
    const postId = req.params.id;

    console.log(`Fetching post ${postId} from external API...`);

    // Fetch a specific post
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);

    if (!response.ok) {
      // If the post doesn't exist, JSONPlaceholder returns 404
      return res.status(404).json({
        error: 'Post not found',
        postId: postId
      });
    }

    const post = await response.json();

    res.json({
      message: 'Post fetched successfully',
      post: post
    });
  } catch (error) {
    console.error('Error fetching post:', error.message);
    res.status(500).json({
      error: 'Failed to fetch post',
      details: error.message
    });
  }
});


// ============================================
// ROUTE 4: Sequential Async Operations
// ============================================
// Sometimes you need to do multiple async operations in sequence
// Example: Fetch a user, then fetch their posts

app.get('/api/user/:id/with-posts', async (req, res) => {
  try {
    const userId = req.params.id;

    console.log(`Step 1: Fetching user ${userId}...`);

    // First, fetch the user
    const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!userResponse.ok) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = await userResponse.json();

    console.log(`Step 2: Fetching posts for user ${userId}...`);

    // Then, fetch their posts
    // This depends on the first request, so it must be sequential
    const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const posts = await postsResponse.json();

    console.log('✓ Both operations completed');

    // Return combined data
    res.json({
      message: 'User and posts fetched successfully (sequential)',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      postsCount: posts.length,
      posts: posts.slice(0, 3) // First 3 posts
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


// ============================================
// ROUTE 5: Parallel Async Operations
// ============================================
// When operations don't depend on each other, run them in PARALLEL
// This is much faster!

app.get('/api/dashboard', async (req, res) => {
  try {
    console.log('Fetching dashboard data in parallel...');

    // Promise.all runs all these requests at the same time
    // It waits for ALL of them to complete before continuing
    const [postsResponse, usersResponse, commentsResponse] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts'),
      fetch('https://jsonplaceholder.typicode.com/users'),
      fetch('https://jsonplaceholder.typicode.com/comments')
    ]);

    // Check all responses
    if (!postsResponse.ok || !usersResponse.ok || !commentsResponse.ok) {
      throw new Error('One or more requests failed');
    }

    // Parse all responses (also in parallel)
    const [posts, users, comments] = await Promise.all([
      postsResponse.json(),
      usersResponse.json(),
      commentsResponse.json()
    ]);

    console.log('✓ All parallel operations completed');

    // Return summary data
    res.json({
      message: 'Dashboard data fetched successfully (parallel)',
      stats: {
        totalPosts: posts.length,
        totalUsers: users.length,
        totalComments: comments.length
      },
      note: 'All 3 requests ran at the same time - much faster than sequential!'
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});


// ============================================
// ROUTE 6: Error Handling Example
// ============================================
// This route demonstrates different error scenarios

app.get('/api/error-demo/:type', async (req, res) => {
  try {
    const errorType = req.params.type;

    if (errorType === 'timeout') {
      // Simulate a timeout
      console.log('Simulating a timeout error...');
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 1000);
      });
    } else if (errorType === 'invalid') {
      // Simulate an invalid response
      console.log('Simulating an invalid URL error...');
      await fetch('https://jsonplaceholder.typicode.com/invalid-endpoint');
      // This won't throw an error, but we can check response.ok
    } else {
      res.json({ message: 'No error triggered. Try /api/error-demo/timeout or /api/error-demo/invalid' });
    }
  } catch (error) {
    // All errors are caught here
    console.error('✗ Caught error:', error.message);
    res.status(500).json({
      error: 'An error occurred',
      details: error.message,
      tip: 'This is how you handle errors in async/await code'
    });
  }
});


// ============================================
// ROUTE 7: Without Async/Await (Comparison)
// ============================================
// This shows how the same code looks with .then() chains
// Compare this to the async/await version above!

app.get('/api/old-way', (req, res) => {
  console.log('Fetching data the old way with .then() chains...');

  // This is harder to read and maintain
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json();
    })
    .then(posts => {
      res.json({
        message: 'Fetched with .then() chains (the old way)',
        count: posts.length,
        note: 'Compare this code to the async/await version - which is easier to read?'
      });
    })
    .catch(error => {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Failed to fetch data' });
    });

  // Notice: No 'await', no try/catch, just .then() chains
});


// ============================================
// Home Route
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'Async/Await Learning Server',
    note: 'Run "npm run examples" to see standalone async/await examples',
    endpoints: {
      'GET /api/basic': 'Basic async example with simulated delay',
      'GET /api/posts': 'Fetch posts from external API',
      'GET /api/posts/:id': 'Fetch single post by ID',
      'GET /api/user/:id/with-posts': 'Sequential operations - fetch user then posts',
      'GET /api/dashboard': 'Parallel operations - fetch multiple resources at once',
      'GET /api/error-demo/:type': 'Error handling examples (try "timeout" or "invalid")',
      'GET /api/old-way': 'Same code without async/await for comparison'
    }
  });
});


// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    tip: 'Visit / to see available endpoints'
  });
});


// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log('=================================');
  console.log('Async/Await Server is running!');
  console.log(`URL: http://localhost:${PORT}`);
  console.log('=================================');
  console.log('Try these routes:');
  console.log(`  http://localhost:${PORT}/api/posts`);
  console.log(`  http://localhost:${PORT}/api/user/1/with-posts`);
  console.log(`  http://localhost:${PORT}/api/dashboard`);
  console.log('=================================');
  console.log('Also run: npm run examples');
  console.log('(to see standalone async/await examples)');
  console.log('=================================');
});
