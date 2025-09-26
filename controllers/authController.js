import { validationResult } from 'express-validator';
// import { db } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/prismaClient.js';
import { findUserWithEmail, findUserById } from '../services/auth_service.js';


const register = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        email_verification_token: token,
        email_verification_expires: expiry,
        isActive: false,
      }
    });

    console.log(`🔗 Confirme ton compte : http://localhost:3000/api/auth/confirm?token=${token}`);

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const login = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Please confirm your email before logging in." });
    }
    
    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({
       id: user.id, 
       name: user.name, 
       email : user.email, 
       role: user.role 
      }, 
      process.env.AUTH_JWT_SECRET, 
      {expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN}
    );
    
    res.status(200).json({ 
      message: 'Login successful',
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const confirmEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email_verification_token: token,
        email_verification_expires: {
          gte: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isActive: true,
        email_verification_token: null,
        email_verification_expires: null
      }
    });

    res.status(200).json({ message: 'Email confirmed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

}

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const getUserById = async (req, res) => { 
  const { id } = req.params;
  const authenticatedUser = req.user;

  if (authenticatedUser.role !== 'admin' && parseInt(id) !== authenticatedUser.id) {
    return res.status(403).json({ message: "Access denied: unauthorized access to this resource" });
  }

  try {
    const getuser = await findUserById(id);

    if (!getuser.exist) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(getuser.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const getProfile = async (req, res) => {
  console.log("User from request:", req.user);
  if (!req.user || !req.user.email) {
    return res.status(401).json({ message: "Unauthorized: Missing user data" });
  }

  const { email } = req.user;

  try {
    const user = await findUserWithEmail(email);

    if (!user.exist) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userData } = user.user;

    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Server error'
    });
  }
}

const updateProfile = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized: Missing user data" });
  }

  const { id } = req.user;
  const { name, email, password } = req.body; 

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {

    if (email) {
      const existingUser = await findUserWithEmail(email);
      if (existingUser.exist && existingUser.user.id !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    let hashedPassword = null;
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      hashedPassword = bcrypt.hashSync(password, salt);
    }

    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: hashedPassword || undefined
      }
    });
    
    res.status(200).json({ message: 'Profile updated successfuly' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const deleteUser = async (req, res) => {
  const idParam = req.params.id;
  const id = parseInt(idParam);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.id === id) {
      return res.status(403).json({ message: "You cannot delete your own account" });
    }

    await prisma.user.delete({ where: { id } });

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 15); 

    await prisma.user.update({
      where: { email },
      data: {
        password_reset_token: token,
        password_reset_expires: expiry
      }
    });

    console.log(`Reset password link: http://localhost:3000/auth/reset-password?token=${token}`);

    return res.status(200).json({ message: "Reset link sent to your email (simulated)" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        password_reset_token: token,
        password_reset_expires: {
          gte: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null
      }
    });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export { register, login, confirmEmail, getAllUsers, getUserById, getProfile, updateProfile, deleteUser, forgotPassword, resetPassword };
