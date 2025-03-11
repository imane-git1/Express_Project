import jwt from "jsonwebtoken";
import { connection } from "../config/database.js";

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(403).json({ message : "Access denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      next();
  }catch (err) {
    res.status(401).json({ message : "Invalid token." });
  }
}

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message : "Admin access denied." });
  }
  next();
}

export { verifyToken, isAdmin };