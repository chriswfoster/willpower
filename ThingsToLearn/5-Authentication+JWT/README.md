# Module 5: Authentication + JWT

## What You'll Learn

In this module, you'll learn how to implement secure user authentication:

- **User Registration**: Creating user accounts safely
- **Password Hashing**: Why we NEVER store plain passwords (using bcrypt)
- **JWT Tokens**: JSON Web Tokens for stateless authentication
- **Login System**: Verifying credentials and issuing tokens
- **Protected Routes**: Middleware to require authentication
- **Security Best Practices**: Preventing common vulnerabilities

## Prerequisites

- Completed Modules 1-4
- Understanding of SQL (Module 4)
- Understanding of async/await (Module 3)
- Basic knowledge of HTTP headers

## Why Authentication Matters

**Authentication** answers: "Who are you?"
**Authorization** answers: "What are you allowed to do?"

This module focuses on authentication. Every real application needs:
- User accounts
- Login/logout functionality
- Protected resources (only logged-in users can access)
- Secure password storage

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `better-sqlite3` - SQLite database
- `bcrypt` - Password hashing library
- `jsonwebtoken` - JWT token generation/verification
- `cors` - Cross-origin requests

### 2. Start the Server

```bash
npm run dev
```

**What happens on first run**:
1. Creates `auth.db` database file
2. Creates `users` table with columns: id, username, email, password_hash
3. Starts server on port 3004

## Understanding the Flow

### Registration Flow
```
1. User sends username, email, password
2. Server validates the data
3. Server hashes the password with bcrypt
4. Server saves user to database (with hash, not plain password)
5. Server returns success message
```

### Login Flow
```
1. User sends username, password
2. Server finds user in database
3. Server compares password with stored hash using bcrypt
4. If match: Server generates JWT token
5. Server returns token to user
```

### Protected Route Flow
```
1. User sends request with token in Authorization header
2. Middleware verifies the token
3. If valid: Request proceeds to route handler
4. If invalid: Return 401 Unauthorized
```

## Testing with Postman

### Step 1: Register a New User

**Method**: POST
**URL**: http://localhost:3004/api/register
**Headers**:
- Content-Type: `application/json`

**Body** (raw JSON):
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "mypassword123"
}
```

**Expected Response (201 Created)**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "alice",
    "email": "alice@example.com"
  },
  "nextStep": "Login at /api/login to receive your token"
}
```

**Try creating a duplicate**:
Same username or email → 400 Bad Request

**Try a short password**:
Less than 6 characters → 400 Bad Request

### Step 2: Login to Get JWT Token

**Method**: POST
**URL**: http://localhost:3004/api/login
**Headers**:
- Content-Type: `application/json`

**Body** (raw JSON):
```json
{
  "username": "alice",
  "password": "mypassword123"
}
```

**Expected Response (200 OK)**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWxpY2UiLCJlbWFpbCI6ImFsaWNlQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA2MTIzNDU2LCJleHAiOjE3MDYyMDk4NTZ9.xYz...",
  "expiresIn": "24h",
  "user": {
    "id": 1,
    "username": "alice",
    "email": "alice@example.com"
  },
  "howToUse": "Include this token in the Authorization header: Bearer <token>"
}
```

**IMPORTANT**: Copy the token! You'll need it for the next steps.

**Try wrong password**:
Incorrect password → 401 Unauthorized

**Try non-existent user**:
Username doesn't exist → 401 Unauthorized

### Step 3: Access Protected Route (Profile)

**Method**: GET
**URL**: http://localhost:3004/api/profile
**Headers**:
- Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your actual token)

**How to set Authorization header in Postman**:
1. Go to the "Authorization" tab
2. Type: Select "Bearer Token"
3. Token: Paste your token

**Expected Response (200 OK)**:
```json
{
  "message": "Profile retrieved successfully",
  "note": "This is a protected route - only accessible with a valid token",
  "user": {
    "id": 1,
    "username": "alice",
    "email": "alice@example.com",
    "created_at": "2024-01-20 10:00:00"
  },
  "tokenInfo": {
    "userId": 1,
    "username": "alice",
    "tokenIssuedAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Try without token**:
No Authorization header → 401 Unauthorized

**Try with invalid token**:
Wrong/expired token → 401 Unauthorized

### Step 4: Access Another Protected Route (All Users)

**Method**: GET
**URL**: http://localhost:3004/api/users
**Headers**:
- Authorization: `Bearer <your-token>`

**Expected Response (200 OK)**:
```json
{
  "message": "All users retrieved (protected route)",
  "requestedBy": "alice",
  "count": 1,
  "users": [
    {
      "id": 1,
      "username": "alice",
      "email": "alice@example.com",
      "created_at": "2024-01-20 10:00:00"
    }
  ]
}
```

Notice: The response doesn't include password hashes (security!)

## Key Concepts

### 1. Password Hashing with bcrypt

**Why NEVER store plain passwords**:
- If database is compromised, all passwords are exposed
- Users often reuse passwords across sites
- It's illegal in many jurisdictions (GDPR, etc.)

**What bcrypt does**:
```javascript
const hash = await bcrypt.hash('mypassword123', 10);
// Returns: $2b$10$N9qo8uLOickgx2ZmmDmEDeQp/j6sR...
```

**Properties of bcrypt**:
- One-way function (can't reverse it to get the password)
- Includes a random salt (same password = different hashes)
- Slow on purpose (makes brute-force attacks harder)
- The number 10 is "salt rounds" - higher = more secure but slower

**Verifying passwords**:
```javascript
const match = await bcrypt.compare('mypassword123', hash);
// Returns: true or false
```

### 2. JWT (JSON Web Token)

**What is a JWT**:
A string containing three parts separated by dots:
```
header.payload.signature
```

**Example JWT**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWxpY2UifQ.xYz123...
```

**Part 1 - Header** (base64 encoded):
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
Describes the algorithm used to sign the token.

**Part 2 - Payload** (base64 encoded):
```json
{
  "userId": 1,
  "username": "alice",
  "email": "alice@example.com",
  "iat": 1706123456,
  "exp": 1706209856
}
```
Contains your data (claims).

**Part 3 - Signature**:
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```
Proves the token wasn't tampered with.

**Important JWT Properties**:
- **Stateless**: Server doesn't need to store sessions
- **Self-contained**: All needed info is in the token
- **Verifiable**: Signature proves authenticity
- **Decodable**: Anyone can read the payload (don't put secrets!)
- **Not encrypted**: Don't put sensitive data in tokens

### 3. Authentication Middleware

**What middleware does**:
```javascript
app.get('/api/profile', verifyToken, (req, res) => {
  // verifyToken runs FIRST
  // Only reaches here if token is valid
});
```

**How verifyToken works**:
1. Extract token from Authorization header
2. Verify signature with secret key
3. Check if token is expired
4. If valid: Add user info to req.user and call next()
5. If invalid: Return 401 error

### 4. Authorization Header Format

**Standard format**:
```
Authorization: Bearer <token>
```

**Why "Bearer"**:
It's the token type. Bearer tokens grant access to whoever "bears" (holds) them.

**In Postman**:
- Authorization tab → Type: Bearer Token → Paste token

**In code (fetch)**:
```javascript
fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Security Best Practices

### ✅ DO:
1. **Hash passwords** with bcrypt (never store plain text)
2. **Use HTTPS** in production (encrypts data in transit)
3. **Validate input** (check email format, password length)
4. **Use environment variables** for secrets (JWT_SECRET)
5. **Set token expiration** (24h is reasonable for most apps)
6. **Use parameterized queries** (prevents SQL injection)
7. **Rate limit** login attempts (prevents brute force)

### ❌ DON'T:
1. **Don't store passwords in plain text**
2. **Don't put sensitive data in JWT payload** (it's readable!)
3. **Don't commit secrets to Git** (use .env files)
4. **Don't use weak secrets** ("secret123" is terrible)
5. **Don't skip input validation**
6. **Don't reveal if username or password is wrong** (say "invalid credentials")
7. **Don't use MD5 or SHA for passwords** (use bcrypt/argon2)

## Understanding the Database

**Users table**:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,  -- Hashed password, not plain text!
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

**Example row**:
```
id: 1
username: alice
email: alice@example.com
password_hash: $2b$10$N9qo8uLOickgx2ZmmDmEDeQp/j6sR...
created_at: 2024-01-20 10:00:00
```

Notice: We never query or return the password_hash to clients!

## Complete Testing Workflow

1. **Register Alice**
   - POST /api/register
   - username: alice, password: password123

2. **Register Bob**
   - POST /api/register
   - username: bob, password: bobspassword

3. **Try duplicate** (should fail)
   - POST /api/register with same username

4. **Login as Alice**
   - POST /api/login
   - Copy the token

5. **View Alice's profile**
   - GET /api/profile with Alice's token

6. **View all users**
   - GET /api/users with Alice's token

7. **Try without token** (should fail)
   - GET /api/profile without Authorization header

8. **Login as Bob**
   - POST /api/login
   - Copy Bob's token

9. **View Bob's profile**
   - GET /api/profile with Bob's token

10. **See JWT structure**
    - GET /api/decode-demo (no auth needed)

## Common Issues

**bcrypt won't install**:
- Needs build tools on Windows
- Try: `npm install --global windows-build-tools`
- Or use Docker/WSL

**Token always invalid**:
- Check the Authorization header format: `Bearer <token>` (with space)
- Make sure you're copying the full token
- Check token hasn't expired (24h)

**Can't login after registration**:
- Make sure you're using the exact same password
- Check the username exists: GET /api/users (as admin)

**CORS errors in browser**:
- We use cors() middleware, should work
- Check the browser console for specific error

## Experiments to Try

1. **Add a Logout Route**:
   - Client-side: Delete the token
   - Server-side: Maintain a blacklist of revoked tokens

2. **Add Refresh Tokens**:
   - Short-lived access tokens (15min)
   - Long-lived refresh tokens (30 days)
   - Refresh endpoint to get new access token

3. **Add User Roles**:
   - Add a `role` column (admin, user, guest)
   - Create middleware to check roles
   - Only admins can access certain routes

4. **Password Reset**:
   - Generate a reset token
   - Send via email
   - Allow password change with valid token

5. **Email Verification**:
   - Send verification email on signup
   - User must click link to activate account

6. **Rate Limiting**:
   - Use `express-rate-limit` package
   - Limit login attempts to 5 per 15 minutes

## What's Next?

You've completed all 5 modules! You now understand:
1. Node.js + Express basics
2. REST APIs and CRUD
3. Async/await and promises
4. SQL databases and joins
5. Authentication with JWT

**Next steps for learning**:
- Build a complete project using all modules
- Learn about:
  - Environment variables (.env files)
  - Input validation libraries (Joi, express-validator)
  - ORMs (Sequelize, Prisma)
  - Testing (Jest, Supertest)
  - Deployment (Heroku, AWS, Docker)
  - WebSockets (real-time features)
  - File uploads (Multer)
  - Sending emails (Nodemailer)

## Additional Resources

- [JWT.io](https://jwt.io/) - Decode and verify JWT tokens
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OAuth 2.0 Overview](https://oauth.net/2/) - Industry standard for authorization
- [Passport.js](http://www.passportjs.org/) - Popular authentication middleware
