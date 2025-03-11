export const authQueries = () => {
  const GET_ALL_USERS = `SELECT * FROM users`;
  const GET_USER_BY_ID = `SELECT * FROM users WHERE id = ?`;
  const FIND_USER_BY_EMAIL = `SELECT * FROM users WHERE email = ?`;
  const CREATE_USER = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
  const DELETE_USER =  'DELETE FROM users WHERE id = ?';

  return {
    GET_ALL_USERS,
    GET_USER_BY_ID,
    FIND_USER_BY_EMAIL,
    CREATE_USER,
    DELETE_USER
  };

}
