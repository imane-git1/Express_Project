import app from './app.js';
import dotenv from 'dotenv';
import prisma from './config/prismaClient.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect(); 
    console.log("✅ Connected to the database");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1); 
  }
};

startServer();

