// ============================================
// ASYNC/AWAIT STANDALONE EXAMPLES
// ============================================
// Run this file with: node examples.js
// Or: npm run examples

console.log('========================================');
console.log('ASYNC/AWAIT LEARNING EXAMPLES');
console.log('========================================\n');


// ============================================
// EXAMPLE 1: The Problem - Synchronous Code
// ============================================
// JavaScript is single-threaded - it can only do one thing at a time
// If you have slow operations (like reading files, calling APIs, database queries),
// synchronous code would BLOCK everything until it's done

console.log('--- EXAMPLE 1: Synchronous Code ---');

function synchronousExample() {
  console.log('Step 1: Start');

  // Imagine this is a slow operation (like reading a file)
  // In real synchronous code, this would block the entire program
  console.log('Step 2: Doing something that takes time...');

  console.log('Step 3: Done');
}

synchronousExample();
console.log('✓ Synchronous code runs line by line, blocking until each step finishes\n');


// ============================================
// EXAMPLE 2: Callbacks - The Old Way
// ============================================
// Before Promises and async/await, we used callbacks
// A callback is a function you pass to another function
// The callback gets called when the async operation completes

console.log('--- EXAMPLE 2: Callbacks (The Old Way) ---');

// Simulate an async operation with setTimeout
// setTimeout runs code AFTER a delay without blocking
function fetchUserWithCallback(userId, callback) {
  console.log(`Fetching user ${userId}...`);

  // setTimeout simulates a delay (like a network request)
  // After 1000ms (1 second), it calls the callback function
  setTimeout(() => {
    // This is the "result" of our async operation
    const user = { id: userId, name: 'John Doe' };

    // Call the callback function with the result
    callback(user);
  }, 1000);
}

// Use the callback function
fetchUserWithCallback(1, (user) => {
  console.log('✓ User fetched:', user);
  console.log('✓ Callbacks work but can lead to "callback hell" when nested\n');
});

// Notice: This runs BEFORE the callback!
// That's because setTimeout is asynchronous - it doesn't block
console.log('(This runs immediately while waiting for the callback)\n');


// ============================================
// EXAMPLE 3: Promises - The Better Way
// ============================================
// Promises were introduced to solve "callback hell"
// A Promise is an object representing a future value
// It can be: pending, fulfilled (resolved), or rejected (error)

console.log('--- EXAMPLE 3: Promises (The Better Way) ---');

// A function that returns a Promise
function fetchUserWithPromise(userId) {
  console.log(`Fetching user ${userId} with Promise...`);

  // Create and return a new Promise
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if the user exists (simple validation)
      if (userId > 0) {
        const user = { id: userId, name: 'Jane Doe' };
        // resolve() means "success" - fulfills the promise with a value
        resolve(user);
      } else {
        // reject() means "error" - rejects the promise with an error
        reject(new Error('Invalid user ID'));
      }
    }, 1000);
  });
}

// Use the Promise with .then() and .catch()
fetchUserWithPromise(2)
  .then((user) => {
    // .then() handles successful results
    console.log('✓ User fetched with Promise:', user);
  })
  .catch((error) => {
    // .catch() handles errors
    console.log('✗ Error:', error.message);
  })
  .finally(() => {
    // .finally() runs whether success or error
    console.log('✓ Promise completed\n');
  });


// ============================================
// EXAMPLE 4: Async/Await - The Modern Way
// ============================================
// async/await is syntactic sugar over Promises
// It makes async code LOOK like synchronous code
// But it still runs asynchronously (doesn't block)

console.log('--- EXAMPLE 4: Async/Await (The Modern Way) ---');

// The 'async' keyword makes a function return a Promise
async function fetchUserWithAsyncAwait(userId) {
  console.log(`Fetching user ${userId} with async/await...`);

  // We can use the same Promise-based function
  // 'await' pauses THIS function until the Promise resolves
  // But it doesn't block the entire program!
  const user = await fetchUserWithPromise(userId);

  // This line runs AFTER the Promise resolves
  return user;
}

// Call an async function
// Async functions always return a Promise, so we still use .then()
fetchUserWithAsyncAwait(3)
  .then((user) => {
    console.log('✓ User fetched with async/await:', user);
    console.log('✓ async/await is cleaner and easier to read than .then() chains\n');
  });


// ============================================
// EXAMPLE 5: Error Handling with Try/Catch
// ============================================
// With async/await, we can use try/catch for errors
// This is more familiar than .catch() for many developers

console.log('--- EXAMPLE 5: Error Handling with Try/Catch ---');

async function fetchUserSafely(userId) {
  try {
    console.log(`Trying to fetch user ${userId}...`);

    // This will reject because userId is -1 (invalid)
    const user = await fetchUserWithPromise(userId);

    console.log('User fetched:', user);
    return user;
  } catch (error) {
    // If the Promise rejects, we catch the error here
    console.log('✗ Caught an error:', error.message);
    return null; // Return a default value
  }
}

// Call with an invalid ID to trigger the error
fetchUserSafely(-1).then(() => {
  console.log('✓ Error was handled gracefully\n');
});


// ============================================
// EXAMPLE 6: Multiple Async Operations - Sequential
// ============================================
// Sometimes you need to wait for one operation before starting the next

console.log('--- EXAMPLE 6: Sequential Async Operations ---');

async function fetchUserAndPosts(userId) {
  try {
    console.log('Fetching user first...');

    // Step 1: Wait for user
    const user = await fetchUserWithPromise(userId);
    console.log('✓ Got user:', user.name);

    console.log('Now fetching posts for this user...');

    // Step 2: Wait for posts (simulated)
    const posts = await new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, title: 'First Post' },
          { id: 2, title: 'Second Post' }
        ]);
      }, 1000);
    });

    console.log('✓ Got posts:', posts.length);

    return { user, posts };
  } catch (error) {
    console.log('Error:', error.message);
  }
}

// This will take 2 seconds total (1s for user + 1s for posts)
fetchUserAndPosts(4).then(() => {
  console.log('✓ Sequential operations completed\n');
});


// ============================================
// EXAMPLE 7: Multiple Async Operations - Parallel
// ============================================
// When operations don't depend on each other, run them in parallel!
// This is much faster

console.log('--- EXAMPLE 7: Parallel Async Operations with Promise.all ---');

async function fetchMultipleUsers() {
  try {
    console.log('Fetching 3 users in parallel...');

    // Promise.all runs all promises at the same time
    // It waits for ALL of them to complete
    // If any reject, the whole thing rejects
    const [user1, user2, user3] = await Promise.all([
      fetchUserWithPromise(5),
      fetchUserWithPromise(6),
      fetchUserWithPromise(7)
    ]);

    console.log('✓ Got all 3 users:', user1.name, user2.name, user3.name);

    return [user1, user2, user3];
  } catch (error) {
    console.log('Error:', error.message);
  }
}

// This will take only 1 second (all run at the same time)
fetchMultipleUsers().then(() => {
  console.log('✓ Parallel operations completed');
  console.log('✓ This is MUCH faster than sequential!\n');
});


// ============================================
// EXAMPLE 8: Common Mistake - Forgetting Await
// ============================================
console.log('--- EXAMPLE 8: Common Mistake - Forgetting Await ---');

async function commonMistake() {
  console.log('Making a common mistake...');

  // WRONG: Forgot 'await'
  // This returns a Promise, not the actual user!
  const user = fetchUserWithPromise(8); // Missing 'await'!

  console.log('✗ Without await, we get a Promise object:', user);

  // CORRECT: With 'await'
  const userCorrect = await fetchUserWithPromise(9);
  console.log('✓ With await, we get the actual user:', userCorrect);
}

commonMistake().then(() => {
  console.log('✓ Always remember to use "await" with async functions!\n');
});


// ============================================
// SUMMARY
// ============================================
setTimeout(() => {
  console.log('\n========================================');
  console.log('SUMMARY');
  console.log('========================================');
  console.log('1. Callbacks: The old way, can lead to callback hell');
  console.log('2. Promises: Better, but .then() chains can be messy');
  console.log('3. Async/Await: The modern way, looks like sync code');
  console.log('4. Always use try/catch with async/await');
  console.log('5. Use Promise.all() for parallel operations');
  console.log('6. Don\'t forget the "await" keyword!');
  console.log('========================================\n');
}, 7000); // Wait for all examples to complete
