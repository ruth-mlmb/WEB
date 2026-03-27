import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Listes from './models/Listes.js';

dotenv.config();

const updateListesWithImages = async () => {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await connectDB();

    const imageMap = {
      'INSApocalypse': '/assets/cdp1.jpeg',
      'INSAmerica': '/assets/cdp2.jpeg',
      'INSAlorsLaZone': '/assets/cdp3.jpeg',
      'INSAladdin': '/assets/cdp4.jpeg',
      'CDPunch': '/assets/cdp5.jpeg',
    };

    const listes = await Listes.find({});
    console.log(`📝 Trouvé ${listes.length} listes à mettre à jour`);

    for (const liste of listes) {
      const image = imageMap[liste.Nom];
      if (image) {
        await Listes.updateOne({ _id: liste._id }, { $set: { image } });
        console.log(`✅ Image ajoutée pour ${liste.Nom}: ${image}`);
      }
    }

    console.log('✅ Mise à jour terminée!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

updateListesWithImages();