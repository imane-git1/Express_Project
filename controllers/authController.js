import { authQueries } from '../database/queries/authQueries.js';
import { connection } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { 
  GET_ALL_USERS,
  GET_USER_BY_ID,
  FIND_USER_BY_EMAIL,
  CREATE_USER,
  DELETE_USER 
} = authQueries();

// console.log("✅ FIND_USER_BY_EMAIL:", FIND_USER_BY_EMAIL);
// console.log("✅ CREATE_USER:", CREATE_USER);

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // console.log("🔍 Requête SQL FIND_USER_BY_EMAIL:", FIND_USER_BY_EMAIL);
  // console.log("🔍 Requête SQL CREATE_USER:", CREATE_USER);

  try {
    // console.log("🔍 Vérification de l'utilisateur avec l'email:", email);
    const [users] = await connection.execute(FIND_USER_BY_EMAIL, [email]);

    if (users.length) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // console.log("✅ Ajout de l'utilisateur avec :", name, email, hashedPassword, role);
    await connection.execute(CREATE_USER, [name, email, hashedPassword, role]);

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const [users] = await connection.execute(FIND_USER_BY_EMAIL, [email]);

    if (!users.length) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.AUTH_JWT_SECRET, 
      { 
        expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN 
      });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const [users] = await connection.execute(GET_ALL_USERS);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

const getUserById = async (req, res) => { 
  const { id } = req.params;

  try {
    const [users] = await connection.execute(GET_USER_BY_ID, [id]);

    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(users[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await connection.execute(DELETE_USER, [id]);

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

export { register, login, getAllUsers, getUserById, deleteUser };
