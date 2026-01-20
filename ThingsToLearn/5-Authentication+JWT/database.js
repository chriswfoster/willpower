// ============================================
// DATABASE SETUP FOR AUTHENTICATION
// ============================================
// This file sets up a SQLite database for storing user accounts
// with hashed passwords

const Database = require('better-sqlite3');

// Create or open the database file
const db = new Database('auth.db', { verbose: console.log });

// ============================================
// CREATE USERS TABLE
// ============================================
function createTable() {
  console.log('Creating users table for authentication...');

  // SQL: CREATE TABLE for storing user accounts
  // password_hash: We NEVER store plain passwords!
  // We store a hashed version using bcrypt
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✓ Users table created successfully\n');
}

// Initialize the table
createTable();

// Export the database connection
module.exports = db;
