import jwt from "jsonwebtoken";
import prisma from '../config/prismaClient.js'; // import Prisma client

// Trouver un utilisateur avec son nom
const findUserWithName = async (name) => {
  const user = await prisma.user.findUnique({
    where: { name }
  });

  return {
    exist: !!user,
    user: user || null
  };
};

// Trouver un utilisateur avec son email
const findUserWithEmail = async (email) => {
  if (!email) {
    throw new Error('Email is undefined or empty');
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  return {
    exist: !!user,
    user: user || null
  };
};

// Trouver un utilisateur par ID
const findUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) }
  });

  return {
    exist: !!user,
    user: user || null
  };
};

// Récupérer le rôle d'un utilisateur (si tu as une table Role liée)
const getUserRole = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: { role: true }
  });

  if (!user) {
    return {
      exist: false
    };
  }

  return {
    exist: true,
    role: user.role
  };
};

// Décoder le token JWT
const decodeToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.AUTH_JWT_SECRET);
    return {
      isError: false,
      data: decoded,
    };
  } catch (error) {
    return {
      isError: true,
      message: error.message
    };
  }
};

export { getUserRole, findUserWithName, findUserWithEmail, findUserById, decodeToken };