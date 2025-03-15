export const authQueries = () => {
  const GET_ALL_USERS = `SELECT * FROM users`;
  const FIND_USER_WITH_NAME = `SELECT * FROM users WHERE name = ?`;
  const FIND_USER_BY_ID = `SELECT * FROM users WHERE id = ?`;
  const FIND_USER_WITH_EMAIL = `SELECT * FROM users WHERE email = ?`;
  const GET_ROLE_NAME = `SELECT role FROM users WHERE id = ?`;
  const CREATE_USER = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
  const UPDATE_USER_PROFILE = `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`;
  const DELETE_USER_ACCOUNT_BY_ID = `DELETE FROM users WHERE id = ?`;


  return {
    GET_ALL_USERS,
    FIND_USER_WITH_NAME,
    FIND_USER_BY_ID,
    FIND_USER_WITH_EMAIL,
    GET_ROLE_NAME,
    CREATE_USER,
    UPDATE_USER_PROFILE,
    DELETE_USER_ACCOUNT_BY_ID
  };

}
