import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { register, login, getAllUsers, getUserById, getProfile, updateProfile, deleteUser } from "../controllers/authController.js";
import { registerValidator, loginValidator, updateProfileValidator } from "../validators/authValidator.js";

const router = express.Router();

// Inscription
router.post("/register", registerValidator, register);

// Connexion
router.post("/login", loginValidator, login);

// Get all users
router.get("/users", getAllUsers);

// Get user by id
router.get("/user/:id", getUserById);

// Get profile
router.get("/profile", authMiddleware, getProfile);

// Update profile
router.put("/user_profile", authMiddleware, updateProfileValidator, updateProfile);

// Delete user
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

export default router;