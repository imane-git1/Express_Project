import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import { register, login, getAllUsers, getUserById, deleteUser } from "../controllers/authController.js";

const router = express.Router();

// Inscription
router.post("/register", register);

// Connexion
router.post("/login", login);

// Get all users
router.get("/", verifyToken, isAdmin, getAllUsers);

// Get user by id
router.get("/user/:id", verifyToken, getUserById);

// Delete user
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;