import express from "express";
import {
  register,
//   login,
//   getUser,
//   logout,
} from "../controllers/authController.js";
 

const router = express.Router();

router.post("/register", register);
// router.post("/login", login);
// router.get("/me", isAuthenticated, getUser);
// router.get("/logout", isAuthenticated, logout);


export default router;