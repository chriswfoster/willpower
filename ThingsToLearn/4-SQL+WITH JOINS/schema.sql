-- ============================================
-- DATABASE SCHEMA FOR LEARNING SQL
-- ============================================
-- This file shows the structure of our database
-- You don't need to run this file - database.js creates these tables automatically
-- This is just for reference!

-- ============================================
-- USERS TABLE
-- ============================================
-- Stores information about users

CREATE TABLE IF NOT EXISTS users (
  -- id: Primary key, auto-increments, unique identifier
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- name: User's full name, required (NOT NULL)
  name TEXT NOT NULL,

  -- email: User's email address, must be unique, required
  email TEXT NOT NULL UNIQUE,

  -- created_at: Timestamp when the user was created
  -- DATETIME defaults to current timestamp
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- POSTS TABLE
-- ============================================
-- Stores blog posts written by users
-- Each post belongs to one user (relationship via user_id)

CREATE TABLE IF NOT EXISTS posts (
  -- id: Primary key for posts
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- user_id: Foreign key linking to users table
  -- This creates a relationship: one user can have many posts
  user_id INTEGER NOT NULL,

  -- title: The post title, required
  title TEXT NOT NULL,

  -- content: The post body/content, required
  content TEXT NOT NULL,

  -- created_at: When the post was created
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Foreign key constraint
  -- This ensures user_id must reference a valid user.id
  -- ON DELETE CASCADE means: if a user is deleted, their posts are deleted too
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- RELATIONSHIPS
-- ============================================
-- This is a ONE-TO-MANY relationship:
-- - ONE user can have MANY posts
-- - MANY posts belong to ONE user
--
-- The user_id in posts is a FOREIGN KEY
-- It references the id in users
--
-- Example:
-- User (id=1, name="Alice")
--   -> Post (id=1, user_id=1, title="First Post")
--   -> Post (id=2, user_id=1, title="Second Post")
--
-- To get a user with their posts, we use a JOIN query!
