import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/db.js';
import cdpRoutes from './routes/cdpRoutes.js';
import sosRoutes from './routes/sosRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsPath));

// Connexion à MongoDB
connectDB();

// Routes
app.use('/api/cdp', cdpRoutes);
app.use('/cdp', cdpRoutes); // alias support if frontend sends /cdp/*
app.use('/api/sos', sosRoutes);
app.use('/sos', sosRoutes); // alias support if needed

// Route test
app.get('/api/health', (req, res) => {
  res.json({ message: '✅ Serveur OK', timestamp: new Date() });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  console.log(`📊 API CDP: http://localhost:${PORT}/api/cdp`);
});
