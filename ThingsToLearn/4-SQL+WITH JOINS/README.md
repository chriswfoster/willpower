# Module 4: SQL + WITH JOINS

## What You'll Learn

In this module, you'll learn SQL (Structured Query Language) and how to work with relational databases:

- **SQL Basics**: What SQL is and why databases are essential
- **CRUD with SQL**: SELECT, INSERT, UPDATE, DELETE queries
- **WHERE Clauses**: Filtering data
- **Relationships**: How tables relate to each other (Foreign Keys)
- **JOINS**: Combining data from multiple tables
  - INNER JOIN
  - LEFT JOIN
- **GROUP BY**: Aggregating data
- **SQL Injection Prevention**: Using parameterized queries

## Prerequisites

- Completed Modules 1-3
- Understanding of async/await (Module 3)
- Basic knowledge of data relationships (one-to-many)

## What is SQL?

**SQL** (Structured Query Language) is the standard language for working with relational databases.

**Why Use a Database?**
- **Persistence**: Data survives server restarts (unlike in-memory arrays)
- **Relationships**: Connect related data (users and their posts)
- **Querying**: Powerful filtering, sorting, and searching
- **Concurrency**: Multiple users can access data simultaneously
- **ACID Properties**: Atomicity, Consistency, Isolation, Durability

**SQLite**:
- File-based database (no server needed)
- Perfect for learning and small applications
- Same SQL syntax as larger databases (PostgreSQL, MySQL)
- The database is stored in `database.db` file

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `better-sqlite3` - SQLite database library
- `cors` - Cross-origin requests
- `nodemon` - Auto-restart

### 2. Start the Server

```bash
npm run dev
```

**What happens on first run**:
1. Creates `database.db` file
2. Creates `users` and `posts` tables
3. Inserts sample data (3 users, 6 posts)
4. Starts the server on port 3003

You'll see SQL statements in the console (thanks to `verbose` mode).

### 3. Explore the Database

The database file `database.db` is created in this folder. You can:
- View it with DB Browser for SQLite (free tool)
- Or just use the API endpoints to interact with it

## Database Schema

Our database has two tables with a relationship:

### Users Table
```
┌────┬───────────────┬──────────────────┬─────────────────────┐
│ id │ name          │ email            │ created_at          │
├────┼───────────────┼──────────────────┼─────────────────────┤
│ 1  │ Alice Johnson │ alice@example... │ 2024-01-20 10:00:00 │
│ 2  │ Bob Smith     │ bob@example.com  │ 2024-01-20 10:00:01 │
│ 3  │ Charlie Brown │ charlie@exampl...│ 2024-01-20 10:00:02 │
└────┴───────────────┴──────────────────┴─────────────────────┘
```

### Posts Table
```
┌────┬─────────┬──────────────────┬────────────┬─────────────────────┐
│ id │ user_id │ title            │ content    │ created_at          │
├────┼─────────┼──────────────────┼────────────┼─────────────────────┤
│ 1  │ 1       │ Getting Started..│ Node.js... │ 2024-01-20 10:00:03 │
│ 2  │ 1       │ Understanding ...│ Async/a... │ 2024-01-20 10:00:04 │
│ 3  │ 2       │ Introduction t...│ SQL sta... │ 2024-01-20 10:00:05 │
└────┴─────────┴──────────────────┴────────────┴─────────────────────┘
```

**Relationship**: `posts.user_id` → `users.id` (Foreign Key)
- Alice (id=1) has 2 posts
- Bob (id=2) has 3 posts
- Charlie (id=3) has 1 post

## SQL CRUD Operations

### 1. SELECT (Read All Users)

**URL**: http://localhost:3003/api/users

**SQL Query**:
```sql
SELECT * FROM users
```

**Breakdown**:
- `SELECT` - The command to read data
- `*` - All columns (id, name, email, created_at)
- `FROM users` - From the users table

**Response**:
```json
{
  "message": "All users retrieved",
  "count": 3,
  "users": [...]
}
```

### 2. SELECT with WHERE (Read Single User)

**URL**: http://localhost:3003/api/users/1

**SQL Query**:
```sql
SELECT * FROM users WHERE id = ?
```

**Breakdown**:
- `WHERE id = ?` - Filter to only rows where id matches
- `?` - Placeholder for parameter (prevents SQL injection)

### 3. INSERT (Create New User)

**Method**: POST
**URL**: http://localhost:3003/api/users
**Body**:
```json
{
  "name": "David Lee",
  "email": "david@example.com"
}
```

**SQL Query**:
```sql
INSERT INTO users (name, email) VALUES (?, ?)
```

**Breakdown**:
- `INSERT INTO users` - Add to users table
- `(name, email)` - Columns we're setting
- `VALUES (?, ?)` - The actual values (parameters)
- `id` and `created_at` are auto-generated

**Response (201 Created)**:
```json
{
  "message": "User created successfully",
  "user": {
    "id": 4,
    "name": "David Lee",
    "email": "david@example.com",
    "created_at": "2024-01-20T..."
  }
}
```

### 4. UPDATE (Modify User)

**Method**: PUT
**URL**: http://localhost:3003/api/users/1
**Body**:
```json
{
  "name": "Alice Williams",
  "email": "alice.williams@example.com"
}
```

**SQL Query**:
```sql
UPDATE users SET name = ?, email = ? WHERE id = ?
```

**Breakdown**:
- `UPDATE users` - Modify the users table
- `SET name = ?, email = ?` - What to change
- `WHERE id = ?` - Which row(s) to update (CRITICAL!)

**Without WHERE**: Would update ALL users (dangerous!)

### 5. DELETE (Remove User)

**Method**: DELETE
**URL**: http://localhost:3003/api/users/3

**SQL Query**:
```sql
DELETE FROM users WHERE id = ?
```

**Breakdown**:
- `DELETE FROM users` - Remove from users table
- `WHERE id = ?` - Which row(s) to delete

**Note**: Because of `ON DELETE CASCADE`, this also deletes all of Charlie's posts!

## JOIN Queries

JOINs combine data from multiple tables based on a relationship.

### INNER JOIN - Posts with User Information

**URL**: http://localhost:3003/api/posts-with-users

**SQL Query**:
```sql
SELECT
  posts.*,
  users.name as author_name,
  users.email as author_email
FROM posts
INNER JOIN users ON posts.user_id = users.id
```

**Breakdown**:
- `posts.*` - All columns from posts table
- `users.name as author_name` - Rename column in result
- `INNER JOIN users` - Join with users table
- `ON posts.user_id = users.id` - Join condition (how tables relate)

**Result**: Each post with author information:
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Getting Started with Node.js",
  "content": "...",
  "created_at": "...",
  "author_name": "Alice Johnson",
  "author_email": "alice@example.com"
}
```

**What INNER JOIN Does**:
- Only returns rows that have matches in BOTH tables
- If a post has no user, it's excluded (orphaned data)
- If a user has no posts, they're excluded

### LEFT JOIN - User with Their Posts

**URL**: http://localhost:3003/api/users/1/posts

**SQL Query**:
```sql
SELECT * FROM posts WHERE user_id = ?
```

This is simpler than a join, but demonstrates one-to-many relationships.

**Result**: User object with array of their posts:
```json
{
  "user": {
    "id": 1,
    "name": "Alice Johnson",
    ...
  },
  "posts_count": 2,
  "posts": [...]
}
```

### GROUP BY + COUNT - Post Counts per User

**URL**: http://localhost:3003/api/users-post-count

**SQL Query**:
```sql
SELECT
  users.*,
  COUNT(posts.id) as post_count
FROM users
LEFT JOIN posts ON users.id = posts.user_id
GROUP BY users.id
```

**Breakdown**:
- `COUNT(posts.id)` - Count how many posts per user
- `LEFT JOIN` - Include users even with 0 posts
- `GROUP BY users.id` - Group results by user

**Result**: Each user with their post count:
```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "post_count": 2
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "email": "bob@example.com",
      "post_count": 3
    }
  ]
}
```

## Understanding JOIN Types

### INNER JOIN
```
Users:  [1, 2, 3]
Posts:  [user_id: 1, 1, 2, 2, 2]

INNER JOIN Result: Only users 1 and 2 (they have posts)
```

### LEFT JOIN
```
Users:  [1, 2, 3]
Posts:  [user_id: 1, 1, 2, 2, 2]

LEFT JOIN Result: Users 1, 2, and 3 (even though 3 has no posts)
```

### Analogy
Think of a party:
- **INNER JOIN**: Only people who brought a guest
- **LEFT JOIN**: Everyone invited, whether they brought a guest or not

## SQL Injection Prevention

**BAD** (Vulnerable to SQL Injection):
```javascript
// ❌ NEVER DO THIS
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.prepare(query).get();
```

**GOOD** (Parameterized Query):
```javascript
// ✅ ALWAYS DO THIS
const query = 'SELECT * FROM users WHERE id = ?';
db.prepare(query).get(userId);
```

**Why?**
If userId is `"1 OR 1=1"`, the first version becomes:
```sql
SELECT * FROM users WHERE id = 1 OR 1=1
```
This returns ALL users (security breach)!

Parameterized queries treat values as data, not code.

## Complete Testing Workflow

1. **GET all users** - See the 3 initial users
2. **POST new user** - Create "David Lee"
3. **GET all users** - Now 4 users
4. **GET user 1** - See Alice's details
5. **GET user 1's posts** - See Alice's 2 posts
6. **PUT update user 1** - Change Alice's name
7. **GET posts-with-users** - See all posts with author names
8. **GET users-post-count** - See who wrote how many posts
9. **DELETE user 3** - Remove Charlie
10. **GET users-post-count** - Charlie is gone, his post too

## Key Concepts

### 1. Primary Key
- Unique identifier for each row
- Usually `id INTEGER PRIMARY KEY AUTOINCREMENT`
- No two rows can have the same primary key

### 2. Foreign Key
- A column that references another table's primary key
- Creates relationships between tables
- `posts.user_id` → `users.id`

### 3. ON DELETE CASCADE
- When a user is deleted, automatically delete their posts
- Maintains referential integrity
- Alternative: `ON DELETE SET NULL` (set user_id to null)

### 4. Relationships
- **One-to-Many**: One user → many posts
- **Many-to-One**: Many posts → one user
- **Many-to-Many**: Requires a junction table (not in this module)

### 5. Database Normalization
- Don't store author name in every post (duplication)
- Store it once in users table
- Reference it with user_id (foreign key)

## Common Issues

**Database file locked**:
- Only one process can write at a time with SQLite
- Close other connections to database.db

**UNIQUE constraint failed**:
- Trying to insert a user with an email that already exists
- This is expected behavior!

**Foreign key constraint failed**:
- Trying to create a post with user_id that doesn't exist
- Trying to delete a user without CASCADE

**Changes not persisting**:
- They should! SQLite writes to database.db file
- Check that file exists and is being updated

## Experiments to Try

1. **Add a Post**: Create a new post for user 1:
```json
POST /api/posts
{
  "user_id": 1,
  "title": "My New Post",
  "content": "Learning SQL is fun!"
}
```

2. **Add More Columns**: Add a `bio` column to users table

3. **Add a New Table**: Create a `comments` table that references posts

4. **Complex JOIN**: Join all three tables (users, posts, comments)

5. **Search**: Add a route to search posts by title:
```sql
SELECT * FROM posts WHERE title LIKE '%Node%'
```

6. **Pagination**: Limit results with `LIMIT` and `OFFSET`:
```sql
SELECT * FROM posts LIMIT 5 OFFSET 0
```

## Next Steps

Once you're comfortable with SQL and joins, move on to:

**Module 5: Authentication + JWT** - Apply your SQL knowledge to store user accounts with hashed passwords

## Additional Resources

- [SQL Tutorial](https://www.w3schools.com/sql/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Visual JOIN Explanation](https://www.codeproject.com/Articles/33052/Visual-Representation-of-SQL-Joins)
- [DB Browser for SQLite](https://sqlitebrowser.org/) - Visual database tool
- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
