// Import the mongoose library, which will be used to interact with MongoDB.
import mongoose from 'mongoose';

// Get the MongoDB connection string from the environment variables.
// The 'as string' part ensures TypeScript knows this variable is a string.
const MONGODB_URI = process.env.MONGODB_URI as string;

// If the MONGODB_URI is not provided, throw an error to inform the developer.
// This ensures the app doesn't run without the proper database configuration.
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * Otherwise, connections in dev will be reset on every reload, causing unnecessary reconnections.
 *
 * Explanation:
 * - In development, Next.js frequently reloads the app when changes are made.
 * - Without caching, this would create new database connections with each reload, which can lead to performance issues.
 * - By using 'global.mongoose', we ensure that we reuse the same connection.
 */
let cached = global.mongoose;

// If there is no cached connection, initialize an object to hold the connection and promise.
// The connection is initially set to null, and the promise will be created when we attempt to connect.
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// This async function establishes a connection to the MongoDB database.
async function connectToDatabase() {
  // If a cached connection already exists (from a previous reload), return that connection immediately.
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, we create one here.
  // This promise will resolve when the connection to the database is successful.
  if (!cached.promise) {
    const opts = {
      // Disable command buffering, meaning that if the connection is down, Mongoose won't buffer commands for retry.
      bufferCommands: false,
    };

    // Attempt to connect to MongoDB using the MONGODB_URI and the specified options.
    // The promise resolves with the connected mongoose instance.
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  // Once the promise resolves and we have a connection, store it in 'cached.conn'.
  cached.conn = await cached.promise;
  return cached.conn; // Return the connection object for use elsewhere in the app.
}

// Export the connectToDatabase function for use in other parts of the application.
// This ensures that the rest of the app can call this function to get a connection to MongoDB.
export default connectToDatabase;
