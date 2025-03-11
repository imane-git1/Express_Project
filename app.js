import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', authRoutes);

export default app;