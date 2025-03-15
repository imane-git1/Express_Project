import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 60000,
	waitForConnections: true,
	connectionLimit: 10,
});

const connect = async () => {
	try {
		const pool = await connection.getConnection();
		console.log("✅ Connected successfuly !");
		pool.release();
	} catch (error) {
		console.error("❌ Connection failed:", error);
	}
};

export { db, connect };