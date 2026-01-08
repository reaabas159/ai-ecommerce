import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { createTables } from "./utils/createTables.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./router/authRoutes.js";
import productRouter from "./router/productRoutes.js";
import adminRouter from "./router/adminRoutes.js";
import orderRouter from "./router/orderRoutes.js";
import Stripe from "stripe";
import database from "./database/db.js";

const app = express();

// Load config only in development (Vercel uses environment variables)
if (process.env.NODE_ENV !== "production") {
  config({ path: "./config/config.env" });
}

// CORS configuration - Explicitly handle all CORS including preflight
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow all Vercel domains
  const isVercelDomain = origin && /^https:\/\/.*\.vercel\.app$/.test(origin);
  
  // Allow configured origins
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.DASHBOARD_URL,
  ].filter(Boolean);
  
  const isAllowed = !origin || isVercelDomain || allowedOrigins.includes(origin);
  
  if (isAllowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Cookie");
  res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours
  
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  
  next();
});

app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = Stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return res.status(400).send(`Webhook Error: ${error.message || error}`);
    }

    // Handling the Event

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent_client_secret = event.data.object.client_secret;
      try {
        // FINDING AND UPDATED PAYMENT
        const updatedPaymentStatus = "Paid";
        const paymentTableUpdateResult = await database.query(
          `UPDATE payments SET payment_status = $1 WHERE payment_intent_id = $2 RETURNING *`,
          [updatedPaymentStatus, paymentIntent_client_secret]
        );
        await database.query(
          `UPDATE orders SET paid_at = NOW() WHERE id = $1 RETURNING *`,
          [paymentTableUpdateResult.rows[0].order_id]
        );

        // Reduce Stock For Each Product
        const orderId = paymentTableUpdateResult.rows[0].order_id;

        const { rows: orderedItems } = await database.query(
          `
            SELECT product_id, quantity FROM order_items WHERE order_id = $1
          `,
          [orderId]
        );

        // For each ordered item, reduce the product stock
        for (const item of orderedItems) {
          await database.query(
            `UPDATE products SET stock = stock - $1 WHERE id = $2`,
            [item.quantity, item.product_id]
          );
        }
      } catch (error) {
        return res
          .status(500)
          .send(`Error updating paid_at timestamp in orders table.`);
      }
    }
    res.status(200).send({ received: true });
  }
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    tempFileDir: "./uploads",
    useTempFiles: true,
  })
);

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/order", orderRouter);

// Explicit OPTIONS handler for all routes (backup - catches any missed OPTIONS)
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  const isVercelDomain = origin && /^https:\/\/.*\.vercel\.app$/.test(origin);
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.DASHBOARD_URL,
  ].filter(Boolean);
  
  if (origin && (isVercelDomain || allowedOrigins.includes(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Cookie");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(204).end();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API is working" });
});

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", message: "API is healthy" });
});

// Test CORS endpoint
app.get("/api/v1/test-cors", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "CORS test successful",
    origin: req.headers.origin 
  });
});

// Create tables only once (check if tables exist first)
// In Vercel serverless, this runs on cold start but won't recreate tables if they exist
// Wrap in try-catch to prevent crashes
try {
  if (process.env.NODE_ENV !== "production") {
    // In development, create tables immediately
    createTables().catch((err) => {
      console.log("Tables creation error (dev):", err.message);
    });
  } else {
    // In production, create tables on first request (idempotent - won't recreate if exist)
    createTables().catch((err) => {
      console.log("Tables may already exist:", err.message);
    });
  }
} catch (error) {
  console.error("Error initializing tables:", error);
  // Don't crash - tables might already exist
}

// 404 handler for undefined routes
// Note: In Express 5, using "*" as a path causes a path-to-regexp error.
// We use a handler without a path so it matches any method/URL.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorMiddleware);

export default app;
