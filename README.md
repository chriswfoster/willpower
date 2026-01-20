# Backend JavaScript Learning Path

A comprehensive, hands-on learning resource for new backend JavaScript developers. This repository contains 5 progressive modules that teach the fundamentals of backend development with Node.js, Express, SQL, and authentication.

## Overview

Each module is a standalone project with:
- Working, testable code
- Very detailed comments explaining every concept
- Comprehensive README with setup instructions
- Examples you can test with Postman
- Experiments to try on your own

## Learning Path

### Module 1: Node.js + Express Routing & Middleware
**Location**: `ThingsToLearn/1-Node+Express Routing+Middleware/`

Learn the fundamentals of building web servers with Express:
- Setting up an Express server
- Creating routes (GET, POST)
- Understanding middleware and the request/response cycle
- How `next()` works
- Global and route-specific middleware

**Key Files**:
- `index.js` - Server with multiple routes and middleware examples
- `README.md` - Complete guide with testing instructions

**Port**: 3000

---

### Module 2: HTTP + REST
**Location**: `ThingsToLearn/2-HTTP+REST/`

Build a proper REST API with full CRUD operations:
- REST principles and conventions
- HTTP methods (GET, POST, PUT, DELETE)
- HTTP status codes (200, 201, 404, 400, 500)
- Request body, URL parameters, and query strings
- CORS middleware
- In-memory data storage

**Key Files**:
- `index.js` - REST API with CRUD endpoints
- `data.js` - In-memory data store
- `README.md` - REST concepts and API documentation

**Port**: 3001

---

### Module 3: Async/Await
**Location**: `ThingsToLearn/3-Async+Await/`

Master asynchronous JavaScript for backend development:
- Why async matters in backend (I/O operations)
- Callbacks vs Promises vs Async/Await
- Error handling with try/catch
- Sequential vs parallel async operations
- Working with external APIs
- Common async mistakes and how to avoid them

**Key Files**:
- `examples.js` - Standalone async/await examples (run with `npm run examples`)
- `index.js` - Express server with async route handlers
- `README.md` - Complete async guide with real-world examples

**Port**: 3002

---

### Module 4: SQL + WITH JOINS
**Location**: `ThingsToLearn/4-SQL+WITH JOINS/`

Learn SQL and relational databases with SQLite:
- SQL basics (SELECT, INSERT, UPDATE, DELETE)
- Database relationships (one-to-many)
- Foreign keys
- JOIN queries (INNER JOIN, LEFT JOIN)
- GROUP BY and aggregate functions
- SQL injection prevention with parameterized queries

**Key Files**:
- `database.js` - Database setup and initialization
- `index.js` - Express API with SQL queries
- `schema.sql` - Database schema reference
- `README.md` - SQL concepts and query examples

**Port**: 3003

**Database**: SQLite (file-based, no installation needed)

---

### Module 5: Authentication + JWT
**Location**: `ThingsToLearn/5-Authentication+JWT/`

Implement secure user authentication:
- User registration (signup)
- Password hashing with bcrypt
- Login system
- JWT token generation and verification
- Protected routes with authentication middleware
- Security best practices

**Key Files**:
- `database.js` - User account database
- `auth.js` - Authentication middleware
- `index.js` - Registration, login, and protected routes
- `README.md` - Authentication guide with security tips

**Port**: 3004

---

## Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Postman** or similar API testing tool - [Download](https://www.postman.com/)
- Basic JavaScript knowledge

## Quick Start

### For All Modules

Each module follows the same setup pattern:

1. **Navigate to the module folder**:
   ```bash
   cd "ThingsToLearn/1-Node+Express Routing+Middleware"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm run dev
   ```

4. **Test the endpoints**:
   - Open your browser or Postman
   - Follow the instructions in the module's README.md

### Recommended Learning Order

Complete the modules in order (1 → 2 → 3 → 4 → 5):
1. Each module builds on concepts from previous ones
2. Difficulty increases progressively
3. Later modules combine concepts from earlier ones

## What You'll Build

By the end of these modules, you'll understand how to:
- Build a web server with Express
- Create RESTful APIs
- Handle async operations properly
- Work with SQL databases
- Implement user authentication
- Secure your applications

## Running Multiple Modules Simultaneously

Each module runs on a different port, so you can run them all at once:
- Module 1: http://localhost:3000
- Module 2: http://localhost:3001
- Module 3: http://localhost:3002
- Module 4: http://localhost:3003
- Module 5: http://localhost:3004

## Project Structure

```
4Will/
├── README.md (this file)
├── .gitignore
└── ThingsToLearn/
    ├── 1-Node+Express Routing+Middleware/
    │   ├── package.json
    │   ├── index.js
    │   └── README.md
    ├── 2-HTTP+REST/
    │   ├── package.json
    │   ├── index.js
    │   ├── data.js
    │   └── README.md
    ├── 3-Async+Await/
    │   ├── package.json
    │   ├── index.js
    │   ├── examples.js
    │   └── README.md
    ├── 4-SQL+WITH JOINS/
    │   ├── package.json
    │   ├── database.js
    │   ├── index.js
    │   ├── schema.sql
    │   └── README.md
    └── 5-Authentication+JWT/
        ├── package.json
        ├── database.js
        ├── auth.js
        ├── index.js
        └── README.md
```

## Key Concepts Covered

### Backend Fundamentals
- Node.js runtime
- Express framework
- Middleware pattern
- Request/response cycle
- Routing

### HTTP & APIs
- REST architecture
- CRUD operations
- HTTP methods & status codes
- Request body, params, query strings
- CORS

### Asynchronous JavaScript
- Callbacks
- Promises
- Async/await
- Error handling
- Sequential vs parallel operations

### Databases
- SQL queries
- CRUD with SQL
- Table relationships
- Foreign keys
- JOINs
- GROUP BY

### Security
- Password hashing
- JWT tokens
- Authentication middleware
- Protected routes
- SQL injection prevention
- Security best practices

## Tips for Learning

1. **Read the code comments**: Every file has detailed explanations
2. **Test everything**: Use Postman to try all endpoints
3. **Experiment**: Modify the code and see what happens
4. **Break things**: Remove code and see what fails (great way to learn)
5. **Build something**: After completing all modules, build your own project

## Common Issues & Solutions

### Port Already in Use
If you get "Port already in use" errors:
- Make sure you're not running multiple instances of the same module
- Each module uses a different port (3000-3004)

### npm install Fails
Try:
```bash
npm install --legacy-peer-deps
```

### bcrypt Won't Install (Windows)
bcrypt needs build tools:
```bash
npm install --global windows-build-tools
```

### Changes Not Showing
If using `npm start`:
- Manually restart the server (Ctrl+C, then `npm start`)

If using `npm run dev`:
- Nodemon should auto-restart
- If not, check the terminal for errors

## What's Next?

After completing all 5 modules, you're ready for:

### Intermediate Topics
- Environment variables with dotenv
- Input validation (Joi, express-validator)
- Error handling patterns
- Logging (Winston, Morgan)
- ORMs (Sequelize, Prisma)
- API documentation (Swagger)

### Testing
- Unit testing (Jest)
- Integration testing (Supertest)
- Test-driven development (TDD)

### Deployment
- Heroku
- AWS (EC2, Lambda)
- Docker
- CI/CD pipelines

### Advanced Topics
- WebSockets for real-time features
- GraphQL
- Microservices architecture
- Caching (Redis)
- Message queues
- Performance optimization

## Resources

### Documentation
- [Node.js Docs](https://nodejs.org/docs/)
- [Express Documentation](https://expressjs.com/)
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [DB Browser for SQLite](https://sqlitebrowser.org/) - View SQLite databases
- [JWT.io](https://jwt.io/) - Decode JWT tokens
- [JSON Formatter](https://jsonformatter.org/) - Format JSON

### Learning Resources
- [MDN Web Docs](https://developer.mozilla.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Tutorial](https://restfulapi.net/)
- [SQL Tutorial](https://www.w3schools.com/sql/)

## Contributing

This is a learning project. Feel free to:
- Experiment with the code
- Add your own modules
- Improve the examples
- Share what you've learned

## License

This project is created for educational purposes. Feel free to use it for learning and teaching.

---

**Happy Learning! 🚀**

Start with Module 1 and work your way through. Take your time, experiment, and most importantly - have fun building!
