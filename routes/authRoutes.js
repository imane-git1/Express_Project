import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { register, login, confirmEmail, getAllUsers, getUserById, getProfile, updateProfile, deleteUser, forgotPassword, resetPassword } from "../controllers/authController.js";
import { registerValidator, loginValidator, updateProfileValidator } from "../validators/authValidator.js";
import { loginlimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();


// Inscription
router.post("/register", registerValidator, register);

// Connexionloginlimiter
router.post("/login", loginlimiter, loginValidator, login);

//Confirm email
router.get("/confirm-email/:token", confirmEmail);

// Get all users
router.get("/users", getAllUsers);

// Get user by id
router.get("/user/:id", authMiddleware, isAdmin, getUserById);

// Get profile
router.get("/profile", authMiddleware, getProfile);

// Update profile
router.put("/user_profile", authMiddleware, updateProfileValidator, updateProfile);

// Delete user
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);

export default router;