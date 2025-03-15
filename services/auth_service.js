import jwt from "jsonwebtoken";
import { db } from '../config/database.js';
import { authQueries } from '../database/queries/authQueries.js';

const { GET_ROLE_NAME, FIND_USER_WITH_EMAIL, FIND_USER_WITH_NAME, FIND_USER_BY_ID } = 
await authQueries();

const getUserRole = async (userId) => {
  const [data] = await db.execute(GET_ROLE_NAME, [userId]);

  if (data.length === 0) {
      return {
          exist: false,
      };
  } else {
      return {
          exist: true,
          role: data[0].role
      };
  }
};

const findUserWithName = async (name) => {
  const [data] = await db.execute(FIND_USER_WITH_NAME, [name]);
  if (data.length === 0) {
    return {
      exist: false,
    };
  } else {
    return {
      exist: true,
      user: data[0]
    };
  }
};

const findUserWithEmail = async (email) => {
  if (!email) {
    throw new Error('Email is undefined or empty');
  }

  const [data] = await db.execute(FIND_USER_WITH_EMAIL, [email]);

  if (data.length === 0) {
    return {
      exist: false,
    };
  } else {
    return {
      exist: true,
      user: data[0]
    };
  }
};

const findUserById = async (id) => {
  const [data] = await db.execute(FIND_USER_BY_ID, [id]);
  if (data.length === 0) {
    return {
      exist: false,
    };
  } else {
    return {
      exist: true,
      user: data[0],
    };
  }
};

/**
 * This function take a token in params an decode it
 */
const decodeToken = async (token) => {
	try {
		const decoded = await jwt.verify(token, process.env.AUTH_JWT_SECRET);
    console.log(decoded);
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

