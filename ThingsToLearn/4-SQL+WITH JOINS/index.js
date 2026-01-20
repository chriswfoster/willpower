// ============================================
// SQL + JOINS LEARNING SERVER
// ============================================
// This server demonstrates SQL queries, CRUD operations, and JOIN statements
// We're using SQLite with the better-sqlite3 library

const express = require('express');
const cors = require('cors');

// Import the database connection from database.js
// This also creates the tables and sample data on first run
const db = require('./database');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});


// ============================================
// HOME ROUTE - API Documentation
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'SQL + Joins Learning Server',
    database: 'SQLite (database.db file)',
    tables: ['users', 'posts'],
    endpoints: {
      users: {
        'GET /api/users': 'Get all users (SELECT)',
        'GET /api/users/:id': 'Get single user (SELECT with WHERE)',
        'POST /api/users': 'Create new user (INSERT)',
        'PUT /api/users/:id': 'Update user (UPDATE)',
        'DELETE /api/users/:id': 'Delete user (DELETE)'
      },
      posts: {
        'GET /api/posts': 'Get all posts',
        'GET /api/posts/:id': 'Get single post'
      },
      joins: {
        'GET /api/posts-with-users': 'Get all posts with user info (INNER JOIN)',
        'GET /api/users/:id/posts': 'Get user with their posts (LEFT JOIN)',
        'GET /api/users-post-count': 'Get users with post counts (GROUP BY + JOIN)'
      }
    }
  });
});


// ============================================
// READ (SELECT) - Get All Users
// ============================================
// SQL: SELECT * FROM users
// The * means "all columns"
// This returns every user in the users table

app.get('/api/users', (req, res) => {
  try {
    // db.prepare() compiles the SQL statement
    // .all() executes it and returns ALL matching rows as an array
    const users = db.prepare('SELECT * FROM users').all();

    // SQL: SELECT column1, column2 FROM table
    // SELECT * means select all columns
    // FROM users means get data from the users table

    res.json({
      message: 'All users retrieved',
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


// ============================================
// READ (SELECT) - Get Single User by ID
// ============================================
// SQL: SELECT * FROM users WHERE id = ?
// WHERE is a filter - only return rows that match the condition
// The ? is a placeholder for the parameter (prevents SQL injection)

app.get('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // .get() returns ONE row (or undefined if not found)
    // The userId is passed as a parameter (replaces the ?)
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    // SQL: WHERE id = ?
    // WHERE is like an if statement
    // Only return rows where the id column equals our userId

    if (user) {
      res.json({
        message: 'User found',
        user: user
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});


// ============================================
// CREATE (INSERT) - Add a New User
// ============================================
// SQL: INSERT INTO users (name, email) VALUES (?, ?)
// INSERT INTO adds a new row to the table
// We specify which columns we're setting
// VALUES provides the actual data

app.post('/api/users', (req, res) => {
  try {
    const { name, email } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required'
      });
    }

    // SQL: INSERT INTO table (columns) VALUES (values)
    // The database automatically generates the id (AUTOINCREMENT)
    // and created_at (DEFAULT CURRENT_TIMESTAMP)
    const result = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run(name, email);

    // result.lastInsertRowid is the ID of the newly created user
    // We can use it to fetch the complete user record
    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    // If email is not unique, SQLite throws an error
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        error: 'Email already exists'
      });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


// ============================================
// UPDATE - Modify an Existing User
// ============================================
// SQL: UPDATE users SET name = ?, email = ? WHERE id = ?
// UPDATE modifies existing rows
// SET specifies which columns to change
// WHERE specifies which rows to update

app.put('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;

    // Check if user exists first
    const existingUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // SQL: UPDATE table SET column1 = value1, column2 = value2 WHERE condition
    // WHERE is CRITICAL! Without it, ALL rows would be updated!
    const result = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(
      name || existingUser.name,     // Use new name or keep existing
      email || existingUser.email,   // Use new email or keep existing
      userId
    );

    // result.changes tells us how many rows were updated
    // Should be 1 if successful
    if (result.changes > 0) {
      // Fetch the updated user
      const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

      res.json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } else {
      res.status(500).json({ error: 'Update failed' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});


// ============================================
// DELETE - Remove a User
// ============================================
// SQL: DELETE FROM users WHERE id = ?
// DELETE removes rows from the table
// WHERE specifies which rows to delete
// WARNING: Without WHERE, it deletes ALL rows!

app.delete('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Get the user first so we can return it
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // SQL: DELETE FROM table WHERE condition
    // This will also delete all posts by this user (CASCADE)
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(userId);

    // result.changes tells us how many rows were deleted
    if (result.changes > 0) {
      res.json({
        message: 'User deleted successfully',
        user: user,
        note: 'All posts by this user were also deleted (CASCADE)'
      });
    } else {
      res.status(500).json({ error: 'Delete failed' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


// ============================================
// POSTS - Get All Posts
// ============================================
app.get('/api/posts', (req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM posts').all();

    res.json({
      message: 'All posts retrieved',
      count: posts.length,
      posts: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});


// ============================================
// INNER JOIN - Posts with User Information
// ============================================
// SQL: SELECT ... FROM posts INNER JOIN users
// JOIN combines data from two tables
// INNER JOIN only returns rows that have matches in BOTH tables

app.get('/api/posts-with-users', (req, res) => {
  try {
    // SQL BREAKDOWN:
    // SELECT posts.*, users.name, users.email
    //   - posts.* means all columns from posts table
    //   - users.name means the name column from users table
    //   - users.email means the email column from users table
    //
    // FROM posts
    //   - Start with the posts table
    //
    // INNER JOIN users ON posts.user_id = users.id
    //   - Join with the users table
    //   - ON specifies the join condition
    //   - Match rows where posts.user_id equals users.id
    //
    // Result: Each post with its author's name and email

    const query = `
      SELECT
        posts.*,
        users.name as author_name,
        users.email as author_email
      FROM posts
      INNER JOIN users ON posts.user_id = users.id
    `;

    const posts = db.prepare(query).all();

    res.json({
      message: 'Posts with user information (INNER JOIN)',
      explanation: 'Each post includes the author\'s name and email',
      count: posts.length,
      posts: posts
    });
  } catch (error) {
    console.error('Error fetching posts with users:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});


// ============================================
// LEFT JOIN - User with All Their Posts
// ============================================
// SQL: LEFT JOIN
// Returns ALL rows from the left table (users)
// Even if there's no match in the right table (posts)

app.get('/api/users/:id/posts', (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Get the user
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all posts by this user
    // SQL: WHERE user_id = ?
    // Filter posts to only those written by this user
    const posts = db.prepare('SELECT * FROM posts WHERE user_id = ?').all(userId);

    res.json({
      message: 'User with all their posts',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      },
      posts_count: posts.length,
      posts: posts
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});


// ============================================
// GROUP BY + JOIN - Users with Post Counts
// ============================================
// SQL: GROUP BY aggregates rows
// COUNT() counts how many rows in each group

app.get('/api/users-post-count', (req, res) => {
  try {
    // SQL BREAKDOWN:
    // SELECT users.*, COUNT(posts.id) as post_count
    //   - users.* = all user columns
    //   - COUNT(posts.id) = count how many posts
    //   - as post_count = name this column "post_count"
    //
    // FROM users
    //   - Start with users table
    //
    // LEFT JOIN posts ON users.id = posts.user_id
    //   - Join with posts
    //   - LEFT JOIN includes users even if they have 0 posts
    //
    // GROUP BY users.id
    //   - Group results by user
    //   - This makes COUNT work per user, not for all users

    const query = `
      SELECT
        users.*,
        COUNT(posts.id) as post_count
      FROM users
      LEFT JOIN posts ON users.id = posts.user_id
      GROUP BY users.id
    `;

    const users = db.prepare(query).all();

    res.json({
      message: 'Users with post counts (GROUP BY + JOIN)',
      explanation: 'Shows each user and how many posts they have written',
      users: users
    });
  } catch (error) {
    console.error('Error fetching user post counts:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


// ============================================
// 404 HANDLER
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
  console.log('SQL + Joins Server is running!');
  console.log(`URL: http://localhost:${PORT}`);
  console.log('=================================');
  console.log('Database: database.db (SQLite)');
  console.log('Tables: users, posts');
  console.log('=================================');
  console.log('Try these endpoints:');
  console.log(`  GET  http://localhost:${PORT}/api/users`);
  console.log(`  GET  http://localhost:${PORT}/api/posts-with-users`);
  console.log(`  GET  http://localhost:${PORT}/api/users/1/posts`);
  console.log(`  GET  http://localhost:${PORT}/api/users-post-count`);
  console.log('=================================');
  console.log('Use Postman to test POST, PUT, DELETE');
  console.log('=================================\n');
});
