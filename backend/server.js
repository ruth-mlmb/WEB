import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cdpRoutes from './routes/cdpRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
connectDB();

// Routes
app.use('/api/cdp', cdpRoutes);

// Route test
app.get('/api/health', (req, res) => {
  res.json({ message: '✅ Serveur OK', timestamp: new Date() });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  console.log(`📊 API CDP: http://localhost:${PORT}/api/cdp`);
});