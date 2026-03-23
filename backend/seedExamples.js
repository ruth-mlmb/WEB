import mongoose from 'mongoose';
import SOS from '../models/SOS.js';

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/sos_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    process.exit(1);
  }
};

// Exemples de SOS
const exemplesSOS = [
  {
    serviceId: 1,
    serviceName: 'Pop the ballon',
    listeId: 1,
    listeName: 'INSApocalypse',
    nomPote: 'Alice Dupont',
    numeroBat: 'A',
    numeroChambre: '101',
    horaire: 'Matin',
    jour: 'Lundi',
    etat: 1,
  },
  {
    serviceId: 2,
    serviceName: 'Pompiers',
    listeId: 2,
    listeName: 'INSAmerica',
    nomPote: 'Bob Martin',
    numeroBat: 'B',
    numeroChambre: '202',
    horaire: 'Après-midi',
    jour: 'Mardi',
    etat: 0,
  },
  {
    serviceId: 3,
    serviceName: 'Police',
    listeId: 3,
    listeName: 'INSAlorsLaZone',
    nomPote: 'Claire Bernard',
    numeroBat: 'C',
    numeroChambre: '303',
    horaire: 'Soir',
    jour: 'Mercredi',
    etat: 1,
  },
  {
    serviceId: 4,
    serviceName: 'Gendarmerie',
    listeId: 1,
    listeName: 'INSApocalypse',
    nomPote: 'David Petit',
    numeroBat: 'D',
    numeroChambre: '404',
    horaire: 'Matin',
    jour: 'Jeudi',
    etat: 0,
  },
  {
    serviceId: 5,
    serviceName: 'Dentiste SOS',
    listeId: 2,
    listeName: 'INSAmerica',
    nomPote: 'Emma Moreau',
    numeroBat: 'E',
    numeroChambre: '505',
    horaire: 'Après-midi',
    jour: 'Vendredi',
    etat: 1,
  },
  {
    serviceId: 6,
    serviceName: 'Vétérinaire',
    listeId: 4,
    listeName: 'INSAladdin',
    nomPote: 'François Durand',
    numeroBat: 'F',
    numeroChambre: '606',
    horaire: 'Soir',
    jour: 'Samedi',
    etat: 0,
  },
  {
    serviceId: 7,
    serviceName: 'Assistance Auto',
    listeId: 5,
    listeName: 'CDPunch',
    nomPote: 'Gabrielle Leroy',
    numeroBat: 'G',
    numeroChambre: '707',
    horaire: 'Matin',
    jour: 'Dimanche',
    etat: 1,
  },
  {
    serviceId: 8,
    serviceName: 'Électricien',
    listeId: 3,
    listeName: 'INSAlorsLaZone',
    nomPote: 'Henri Simon',
    numeroBat: 'H',
    numeroChambre: '808',
    horaire: 'Après-midi',
    jour: 'Lundi',
    etat: 0,
  },
];

// Fonction pour insérer les exemples
const insertExemples = async () => {
  try {
    // Vider la collection existante
    await SOS.deleteMany({});
    console.log('🗑️ Collection SOS vidée');

    // Insérer les exemples
    const inserted = await SOS.insertMany(exemplesSOS);
    console.log(`✅ ${inserted.length} exemples SOS insérés avec succès`);

    // Afficher les exemples insérés
    console.log('\n📋 Exemples insérés:');
    inserted.forEach((sos, index) => {
      const statusText = sos.etat === 1 ? 'confirmée' : 'en attente';
      console.log(`${index + 1}. ${sos.serviceName} - ${sos.nomPote} (${statusText})`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
};

// Exécuter le script
connectDB().then(() => {
  insertExemples();
});