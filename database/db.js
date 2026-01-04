import pkg from "pg";
const { Client } = pkg;
import { config } from "dotenv";

// Load config to access DATABASE_URL from .env
config({ path: "./config/config.env" });

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase connections to work reliably
  },
});

const connectDatabase = async () => {
    try {
        await db.connect();
        console.log("Connected to Supabase PostgreSQL (Transaction Pooler) successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Stop the app if DB fails
    }
};

// Execute connection
connectDatabase();

export default db;