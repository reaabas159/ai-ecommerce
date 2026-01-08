// Vercel Serverless Function Entry Point
import app from "../app.js";

// Export the Express app directly - Vercel's @vercel/node handles it automatically
// This is the recommended way for Express apps on Vercel
export default app;

