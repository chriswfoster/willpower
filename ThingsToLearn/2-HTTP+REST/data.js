// ============================================
// IN-MEMORY DATA STORE
// ============================================
// This file simulates a database using a simple JavaScript array
// In a real application, this data would be stored in a database (like PostgreSQL, MongoDB, etc.)
// But for learning, an array is perfect - it's simple and works the same way

// This is our "database" - an array of product objects
// Each product has an id, name, price, and inStock status
let products = [
  {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    inStock: true
  },
  {
    id: 2,
    name: 'Mouse',
    price: 29.99,
    inStock: true
  },
  {
    id: 3,
    name: 'Keyboard',
    price: 79.99,
    inStock: false
  },
  {
    id: 4,
    name: 'Monitor',
    price: 299.99,
    inStock: true
  }
];

// This variable keeps track of the next ID to assign
// When we add a new product, we'll use this number and then increment it
let nextId = 5;

// Export the data and functions so other files can use them
// In Node.js, module.exports is how you share code between files
module.exports = {
  // Export the products array
  products,

  // Export the nextId variable
  getNextId: () => {
    // Return the current ID and increment for next time
    return nextId++;
  }
};
