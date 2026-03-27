import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import SOS from './models/SOS_service.js';
import Listes from './models/Listes.js';

dotenv.config();

const addManualSOS = async () => {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await connectDB();

    // Trouver la liste INSApocalypse
    const liste = await Listes.findOne({ Nom: 'INSApocalypse' });
    if (!liste) {
      console.log('❌ Liste INSApocalypse non trouvée');
      process.exit(1);
    }

    console.log('📝 Ajout de services SOS manuels...');

    const manualSOS = [
      {
        id: 1,
        title: 'Minute de silence',
        description: 'Spectacle chaotique',
        icon: '🎪',
        number: '15',
        color: '#FF6B6B',
        image: null,
        listeId: liste._id
      },
      {
        id: 2,
        title: 'Ration de survie',
        description: 'Évacuation urgente',
        icon: '🚀',
        number: '18',
        color: '#FF4444',
        image: null,
        listeId: liste._id
      },
      {
        id: 3,
        title: 'Arrestation du patient 0',
        description: 'Refuge protégé',
        icon: '🛡️',
        number: '17',
        color: '#4169E1',
        image: null,
        listeId: liste._id
      }
    ];

    const inserted = await SOS.insertMany(manualSOS);
    console.log(`✅ ${inserted.length} services SOS ajoutés pour ${liste.Nom}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

addManualSOS();