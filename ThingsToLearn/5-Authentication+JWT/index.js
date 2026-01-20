// ============================================
// AUTHENTICATION + JWT SERVER
// ============================================
// This server demonstrates:
// - User registration (signup) with password hashing
// - User login with JWT token generation
// - Protected routes that require authentication

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import database and auth middleware
const db = require('./database');
const { JWT_SECRET, verifyToken } = require('./auth');

const app = express();
const PORT = 3004;

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
    message: 'Authentication + JWT Learning Server',
    endpoints: {
      public: {
        'POST /api/register': 'Create a new user account (signup)',
        'POST /api/login': 'Login and receive JWT token'
      },
      protected: {
        'GET /api/profile': 'Get current user profile (requires token)',
        'GET /api/users': 'Get all users (requires token)'
      }
    },
    howToUse: {
      step1: 'POST to /api/register to create an account',
      step2: 'POST to /api/login to get a JWT token',
      step3: 'Use the token in Authorization header: Bearer <token>',
      step4: 'Access protected routes with the token'
    }
  });
});


// ============================================
// REGISTER (SIGNUP) - Create New User Account
// ============================================
// POST /api/register
// Body: { username, email, password }
// Response: Success message (no token yet - user must login)

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ============================================
    // STEP 1: VALIDATION
    // ============================================
    // Check that all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Username, email, and password are required'
      });
    }

    // Check password length (basic security)
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Password must be at least 6 characters long'
      });
    }

    // ============================================
    // STEP 2: CHECK IF USER ALREADY EXISTS
    // ============================================
    // We check both username and email for uniqueness
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, email);

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'Username or email is already taken'
      });
    }

    // ============================================
    // STEP 3: HASH THE PASSWORD
    // ============================================
    // NEVER store plain-text passwords!
    // bcrypt.hash() creates a secure hash of the password
    // The number 10 is the "salt rounds" - higher is more secure but slower
    // 10 is a good balance for most applications

    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // What bcrypt does:
    // 1. Generates a random "salt" (random data)
    // 2. Combines password + salt
    // 3. Runs it through a hashing algorithm multiple times
    // 4. Returns a string like: $2b$10$N9qo8uLOickgx2Z... (60 characters)

    // ============================================
    // STEP 4: SAVE USER TO DATABASE
    // ============================================
    // We store the hash, not the original password
    const result = db.prepare(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
    ).run(username, email, passwordHash);

    console.log('✓ User registered successfully');

    // Return success message
    // We don't automatically log them in - they must use /api/login
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.lastInsertRowid,
        username: username,
        email: email
      },
      nextStep: 'Login at /api/login to receive your token'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});


// ============================================
// LOGIN - Verify Credentials and Issue JWT Token
// ============================================
// POST /api/login
// Body: { username, password }
// Response: JWT token

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // ============================================
    // STEP 1: VALIDATION
    // ============================================
    if (!username || !password) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Username and password are required'
      });
    }

    // ============================================
    // STEP 2: FIND USER IN DATABASE
    // ============================================
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      // User doesn't exist
      // Security note: Don't reveal if username exists or password is wrong
      // Just say "invalid credentials"
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password'
      });
    }

    // ============================================
    // STEP 3: VERIFY PASSWORD
    // ============================================
    // bcrypt.compare() checks if the password matches the hash
    // It:
    // 1. Extracts the salt from the stored hash
    // 2. Hashes the provided password with that salt
    // 3. Compares the result with the stored hash
    // Returns true if they match, false otherwise

    console.log('Verifying password...');
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      // Password is wrong
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password'
      });
    }

    // ============================================
    // STEP 4: GENERATE JWT TOKEN
    // ============================================
    // The user authenticated successfully!
    // Now we create a JWT token to give them

    // The payload contains data we want to store in the token
    // Don't put sensitive data here - tokens can be decoded (but not modified)
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email
    };

    // jwt.sign() creates the token
    // Parameters:
    // 1. payload - the data to include
    // 2. secret - our secret key (used to sign the token)
    // 3. options - configuration like expiration time
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    // What jwt.sign() does:
    // 1. Creates a header: { "alg": "HS256", "typ": "JWT" }
    // 2. Base64 encodes the header
    // 3. Base64 encodes the payload
    // 4. Creates a signature using header + payload + secret
    // 5. Combines all three parts: header.payload.signature

    console.log('✓ Login successful, token generated');

    // Return the token to the client
    res.json({
      message: 'Login successful',
      token: token,
      expiresIn: '24h',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      howToUse: 'Include this token in the Authorization header: Bearer <token>'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});


// ============================================
// PROTECTED ROUTE - Get Current User Profile
// ============================================
// GET /api/profile
// Requires: Authorization header with valid JWT token
// The verifyToken middleware runs BEFORE this handler

app.get('/api/profile', verifyToken, (req, res) => {
  // If we reach this code, the token was valid!
  // verifyToken middleware added user info to req.user

  // Get full user details from database
  const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(req.user.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    message: 'Profile retrieved successfully',
    note: 'This is a protected route - only accessible with a valid token',
    user: user,
    tokenInfo: {
      userId: req.user.userId,
      username: req.user.username,
      tokenIssuedAt: new Date(req.user.iat * 1000).toISOString()
    }
  });
});


// ============================================
// PROTECTED ROUTE - Get All Users
// ============================================
// GET /api/users
// Requires: Authorization header with valid JWT token

app.get('/api/users', verifyToken, (req, res) => {
  // Only authenticated users can see the list of all users

  // Get all users, but DON'T return password hashes!
  const users = db.prepare('SELECT id, username, email, created_at FROM users').all();

  res.json({
    message: 'All users retrieved (protected route)',
    requestedBy: req.user.username, // From the token
    count: users.length,
    users: users
  });
});


// ============================================
// DEMO: What a JWT Token Looks Like
// ============================================
// GET /api/decode-demo
// This route shows what's inside a JWT token

app.get('/api/decode-demo', (req, res) => {
  // Create a demo token
  const demoPayload = {
    userId: 123,
    username: 'demo_user',
    role: 'admin'
  };

  const demoToken = jwt.sign(demoPayload, JWT_SECRET, { expiresIn: '1h' });

  // JWT tokens have 3 parts separated by dots
  const parts = demoToken.split('.');

  res.json({
    message: 'JWT Token Structure Demo',
    fullToken: demoToken,
    structure: {
      part1_header: {
        raw: parts[0],
        decoded: JSON.parse(Buffer.from(parts[0], 'base64').toString()),
        description: 'Contains the algorithm and token type'
      },
      part2_payload: {
        raw: parts[1],
        decoded: JSON.parse(Buffer.from(parts[1], 'base64').toString()),
        description: 'Contains your data (userId, username, etc.) and expiration'
      },
      part3_signature: {
        raw: parts[2],
        description: 'Cryptographic signature - proves the token wasn\'t tampered with'
      }
    },
    important: [
      'Anyone can decode parts 1 and 2 (they\'re just base64)',
      'But only someone with the secret key can create a valid signature',
      'If someone modifies the payload, the signature won\'t match',
      'Never put sensitive data in the payload (passwords, credit cards, etc.)'
    ]
  });
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
  console.log('Authentication + JWT Server is running!');
  console.log(`URL: http://localhost:${PORT}`);
  console.log('=================================');
  console.log('Database: auth.db (SQLite)');
  console.log('=================================');
  console.log('Try this workflow:');
  console.log('1. POST to /api/register (create account)');
  console.log('2. POST to /api/login (get token)');
  console.log('3. GET /api/profile with token (view profile)');
  console.log('=================================');
  console.log('Security features:');
  console.log('✓ Passwords hashed with bcrypt');
  console.log('✓ JWT tokens for authentication');
  console.log('✓ Protected routes with middleware');
  console.log('✓ Parameterized SQL queries');
  console.log('=================================\n');
});
