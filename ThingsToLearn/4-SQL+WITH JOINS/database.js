// ============================================
// DATABASE SETUP AND INITIALIZATION
// ============================================
// This file sets up the SQLite database and creates sample data

// better-sqlite3 is a SQLite library for Node.js
// SQLite is a file-based database - no server needed!
// The database is stored in a file called 'database.db'
const Database = require('better-sqlite3');

// Create or open the database file
// If 'database.db' doesn't exist, it will be created
// verbose: console.log prints SQL statements for learning
const db = new Database('database.db', { verbose: console.log });

// ============================================
// CREATE TABLES
// ============================================
// This function creates our database tables if they don't exist

function createTables() {
  console.log('Creating database tables...');

  // SQL: CREATE TABLE IF NOT EXISTS
  // This creates the table only if it doesn't already exist
  // If the table exists, nothing happens (safe to run multiple times)

  // USERS TABLE
  // INTEGER PRIMARY KEY AUTOINCREMENT: Automatically assigns unique IDs
  // TEXT: String data type
  // NOT NULL: Field is required
  // UNIQUE: No two users can have the same email
  // DEFAULT CURRENT_TIMESTAMP: Automatically sets the current date/time
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // POSTS TABLE
  // FOREIGN KEY: Links user_id to users.id
  // ON DELETE CASCADE: If a user is deleted, their posts are deleted too
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('✓ Tables created successfully\n');
}

// ============================================
// INSERT SAMPLE DATA
// ============================================
// This function adds example users and posts to the database
// We only run this if the database is empty

function insertSampleData() {
  // Check if we already have data
  // SQL: SELECT COUNT(*) counts how many rows exist
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();

  // If we already have users, don't insert sample data
  if (userCount.count > 0) {
    console.log('Database already has data, skipping sample data insertion\n');
    return;
  }

  console.log('Inserting sample data...');

  // INSERT sample users
  // SQL: INSERT INTO table (columns) VALUES (values)
  // The ? are placeholders for parameters (prevents SQL injection)

  // db.prepare() compiles the SQL statement
  // .run() executes the INSERT and returns info about the operation
  const insertUser = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');

  // Insert 3 sample users
  insertUser.run('Alice Johnson', 'alice@example.com');
  insertUser.run('Bob Smith', 'bob@example.com');
  insertUser.run('Charlie Brown', 'charlie@example.com');

  console.log('✓ Inserted 3 users');

  // INSERT sample posts
  // Each post is linked to a user via user_id
  const insertPost = db.prepare('INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)');

  // Alice's posts (user_id = 1)
  insertPost.run(1, 'Getting Started with Node.js', 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine...');
  insertPost.run(1, 'Understanding Async/Await', 'Async/await makes asynchronous code look synchronous...');

  // Bob's posts (user_id = 2)
  insertPost.run(2, 'Introduction to SQL', 'SQL stands for Structured Query Language...');
  insertPost.run(2, 'Database Normalization', 'Normalization is the process of organizing data...');
  insertPost.run(2, 'SQL Joins Explained', 'JOIN clauses are used to combine rows from two or more tables...');

  // Charlie's posts (user_id = 3)
  insertPost.run(3, 'REST API Best Practices', 'RESTful APIs should follow these principles...');

  console.log('✓ Inserted 6 posts');
  console.log('✓ Sample data inserted successfully\n');
}

// ============================================
// INITIALIZE DATABASE
// ============================================
// Run the setup functions
createTables();
insertSampleData();

// ============================================
// EXPORT DATABASE
// ============================================
// Export the database connection so other files can use it
// In index.js, we'll do: const db = require('./database.js')
module.exports = db;
