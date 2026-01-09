import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, message, res) => {
  try {
    // Validate required environment variables
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    });

    const isProduction = process.env.NODE_ENV === "production";

    // Parse COOKIE_EXPIRES_IN - handle both "30d" format and number format
    let cookieExpiresDays = 30; // default
    if (process.env.COOKIE_EXPIRES_IN) {
      const expiresValue = process.env.COOKIE_EXPIRES_IN.toString().trim();
      // If it ends with 'd', extract the number
      if (expiresValue.endsWith('d')) {
        cookieExpiresDays = parseInt(expiresValue.replace('d', ''), 10) || 30;
      } else {
        // Otherwise, try to parse as number
        cookieExpiresDays = parseInt(expiresValue, 10) || 30;
      }
    }

    // Calculate expiration date
    const expirationDate = new Date(
      Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000
    );

    // Validate expiration date
    if (isNaN(expirationDate.getTime())) {
      throw new Error(`Invalid cookie expiration date: ${expirationDate}`);
    }

    const cookieOptions = {
      expires: expirationDate,
      httpOnly: true,
      // Cross-site cookies (Vercel → Vercel) require SameSite=None and Secure
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      // Add path to ensure cookie is sent with all requests
      path: "/",
      // Don't set domain - let browser handle it for better mobile compatibility
      // domain: undefined,
    };

    res
      .status(statusCode)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        user,
        message,
        token,
      });
  } catch (error) {
    console.error("Error in sendToken:", error);
    // Return error response instead of crashing
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate authentication token",
    });
  }
};