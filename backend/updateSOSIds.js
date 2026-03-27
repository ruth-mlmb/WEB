import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Listes from './models/Listes.js';
import SOS from './models/SOS_service.js';

dotenv.config();

const updateListesWithSOSIds = async () => {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await connectDB();

    // D'abord, s'assurer que les services existent (si pas seedé)
    const existingSOS = await SOS.find({});
    if (existingSOS.length === 0) {
      console.log('⚠️ Aucun service SOS trouvé. Exécutez d\'abord seedDB.js');
      process.exit(1);
    }

    const listes = await Listes.find({});
    console.log(`📝 Trouvé ${listes.length} listes à mettre à jour`);

    for (const liste of listes) {
      // Trouver les services pour cette liste
      const services = await SOS.find({ listeId: liste._id }).select('id');
      const sosIds = services.map(s => s.id).sort((a,b) => a - b);

      if (sosIds.length > 0) {
        await Listes.updateOne(
          { _id: liste._id },
          { $set: { l_SOS_proposes: sosIds } }
        );
        console.log(`✅ ${liste.Nom}: l_SOS_proposes mis à jour avec ${sosIds.length} services: [${sosIds.join(', ')}]`);
      } else {
        console.log(`⚠️ ${liste.Nom}: Aucun service trouvé`);
      }
    }

    console.log('✅ Mise à jour terminée!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

updateListesWithSOSIds();