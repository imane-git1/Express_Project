import { validationResult } from 'express-validator';
// import { db } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prismaClient.js';
import { findUserWithName, findUserWithEmail, findUserById } from '../services/auth_service.js';


// console.log("✅ FIND_USER_BY_EMAIL:", FIND_USER_BY_EMAIL);
// console.log("✅ CREATE_USER:", CREATE_USER);

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

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });

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
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export { register, login, getAllUsers, getUserById, getProfile, updateProfile, deleteUser };
