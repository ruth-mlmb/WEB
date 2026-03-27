import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Listes from './models/Listes.js';

dotenv.config();

const addImageManually = async () => {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await connectDB();

    // Ajouter image pour INSApocalypse
    const result = await Listes.updateOne(
      { Nom: 'INSApocalypse' },
      { $set: { image: '/assets/cdp1.jpeg' } }
    );

    console.log('✅ Mise à jour:', result.modifiedCount, 'document(s) modifié(s)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

addImageManually();