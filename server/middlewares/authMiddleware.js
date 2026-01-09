import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import database from "../database/db.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies?.token;
  if (!token && req.headers?.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource.", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await database.query(
      "SELECT * FROM users WHERE id = $1 LIMIT 1",
      [decoded.id]
    );
    req.user = user.rows[0];
    next();
  } catch (err) {
    return next(new ErrorHandler("Please login to access this resource.", 401));
  }

});

export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};

