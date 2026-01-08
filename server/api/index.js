// Vercel Serverless Function Entry Point
import app from "../app.js";

// Export the Express app - Vercel will handle it automatically
// Wrap in try-catch to prevent crashes
export default (req, res) => {
  try {
    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

