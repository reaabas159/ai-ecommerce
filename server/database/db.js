import pkg from "pg";
const { Pool } = pkg;
import { config } from "dotenv";

// Load config only in development (Vercel uses environment variables)
if (process.env.NODE_ENV !== "production") {
  config({ path: "./config/config.env" });
}

// Use Pool instead of Client for better serverless performance
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase connections to work reliably
  },
  // Connection pool settings for serverless
  max:20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
});

// Handle pool errors
db.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// Test connection (non-blocking for serverless)
const connectDatabase = async () => {
  try {
    const client = await db.connect();
    console.log("Connected to Supabase PostgreSQL (Transaction Pooler) successfully");
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error("Database connection failed:", error);
    // Don't exit in serverless - just log the error
    // The connection will be retried on the next request
  }
};

// Execute connection (non-blocking)
// In serverless, don't connect on module load - connect on first query
// This prevents cold start issues
if (process.env.NODE_ENV !== "production") {
  // In development, connect immediately
  connectDatabase().catch(console.error);
} else {
  // In production (Vercel), don't connect on module load
  // Connection will happen automatically on first query
  // This prevents function crashes during cold start
}

export default db;