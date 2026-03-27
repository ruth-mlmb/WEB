import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Listes from './models/Listes.js';
import SOS from './models/SOS_service.js';

dotenv.config();

// Données des listes
const listesData = [
  { id: 1, name: 'INSApocalypse', image: '/assets/cdp1.jpeg' },
  { id: 2, name: 'INSAmerica', image: '/assets/cdp2.jpeg' },
  { id: 3, name: 'INSAlorsLaZone', image: '/assets/cdp3.jpeg' },
  { id: 4, name: 'INSAladdin', image: '/assets/cdp4.jpeg' },
  { id: 5, name: 'CDPunch', image: '/assets/cdp5.jpeg' },
];

// Données des SOS par liste
const sosDataByListe = {
  1: [ // INSApocalypse
    { id: 1, title: 'Minute de silence', description: 'Spectacle chaotique', icon: '🎪', number: '15', color: '#FF6B6B' },
    { id: 2, title: 'Ration de survie', description: 'Évacuation urgente', icon: '🚀', number: '18', color: '#FF4444' },
    { id: 3, title: 'Arrestation du patient 0', description: 'Refuge protégé', icon: '🛡️', number: '17', color: '#4169E1' },
    { id: 4, title: 'Réveil en beauté', description: 'Enlèvement dangers', icon: '💣', number: '17', color: '#1E90FF' },
    { id: 5, title: 'Discours fin du monde', description: 'Cas critiques', icon: '🔥', number: '112', color: '#9B59B6' },
    { id: 6, title: 'Quarantaine', description: 'Zone cool', icon: '❄️', number: '112', color: '#E74C3C' },
    { id: 7, title: 'Alerte fin du monde', description: 'Réparation rapide', icon: '⚡', number: '112', color: '#F39C12' },
    { id: 8, title: 'Tempête Contrôle', description: 'Stabilisation', icon: '🌪️', number: '112', color: '#F1C40F' },
    { id: 9, title: 'Opération zone toxique', description: 'Aide technologique', icon: '🧬', number: '112', color: '#34495E' },
    { id: 10, title: 'Réveil musclé', description: 'Assistance mécanique', icon: '🤖', number: '3114', color: '#16A085' },
    { id: 11, title: 'Leçon de tir', description: 'Gestion crises', icon: '💥', number: '0800555555', color: '#7F8C8D' },
    { id: 12, title: 'Réalisateur SOS', description: 'Production urgente', icon: '🎬', number: '112', color: '#C0392B' },
  ],
  2: [ // INSAmerica
    { id: 1, title: 'Cowboy Rescue', description: 'Western urgence', icon: '🤠', number: '15', color: '#FF6B6B' },
    { id: 2, title: 'Eagle Air Force', description: 'Intervention aérienne', icon: '🦅', number: '18', color: '#FF4444' },
    { id: 3, title: 'Super Bowl SOS', description: 'Match urgence', icon: '🏈', number: '17', color: '#4169E1' },
    { id: 4, title: 'Statue Liberté', description: 'Assistance NYC', icon: '🗽', number: '17', color: '#1E90FF' },
    { id: 5, title: 'Fast Food Doctor', description: 'Nutrition rush', icon: '🍔', number: '112', color: '#9B59B6' },
    { id: 6, title: 'Pickup Truck', description: 'Transport rapide', icon: '🚙', number: '112', color: '#E74C3C' },
    { id: 7, title: 'Rock Band SOS', description: 'Orchestre urgence', icon: '🎸', number: '112', color: '#F39C12' },
    { id: 8, title: 'Camping Shelter', description: 'Bivouac secours', icon: '⛺', number: '112', color: '#F1C40F' },
    { id: 9, title: 'BBQ Master', description: 'Cuisine urgence', icon: '🌭', number: '112', color: '#34495E' },
    { id: 10, title: 'Parc Aventure', description: 'Attraction SOS', icon: '🎡', number: '3114', color: '#16A085' },
    { id: 11, title: 'Money Maker', description: 'Conseil financier', icon: '💰', number: '0800555555', color: '#7F8C8D' },
  ],
  3: [ // INSAlorsLaZone
    { id: 1, title: 'Désert SOS', description: 'Survie zone aride', icon: '🏜️', number: '15', color: '#FF6B6B' },
    { id: 2, title: 'Caravane Express', description: 'Transport dunes', icon: '🐪', number: '18', color: '#FF4444' },
    { id: 3, title: 'Bateau Zone', description: 'Navigation urgence', icon: '⛵', number: '17', color: '#4169E1' },
    { id: 4, title: 'Île Refuge', description: 'Abri paradis', icon: '🏝️', number: '17', color: '#1E90FF' },
    { id: 5, title: 'Lampe Torche SOS', description: 'Lumière urgence', icon: '🔦', number: '112', color: '#9B59B6' },
    { id: 6, title: 'Navigateur Zone', description: 'Orientation GPS', icon: '🧭', number: '112', color: '#E74C3C' },
    { id: 7, title: 'Tente Camping', description: 'Abri mobile', icon: '⛺', number: '112', color: '#F39C12' },
    { id: 8, title: 'Explorateur SOS', description: 'Expédition urgence', icon: '🌍', number: '112', color: '#F1C40F' },
    { id: 9, title: 'Signal Relay', description: 'Communication zone', icon: '📡', number: '112', color: '#34495E' },
    { id: 10, title: 'Trek Randonnée', description: 'Marche urgence', icon: '🥾', number: '3114', color: '#16A085' },
    { id: 11, title: 'Escalade Rescue', description: 'Descente urgence', icon: '🪨', number: '0800555555', color: '#7F8C8D' },
  ],
  4: [ // INSAladdin
    { id: 1, title: 'Génie Magique', description: '3 vœux urgents', icon: '🧞', number: '15', color: '#FF6B6B' },
    { id: 2, title: 'Tapis Volant SOS', description: 'Transport aérien', icon: '🐪', number: '18', color: '#FF4444' },
    { id: 3, title: 'Sabre Protecteur', description: 'Protection royale', icon: '⚔️', number: '17', color: '#4169E1' },
    { id: 4, title: 'Palais d\'Urgence', description: 'Refuge princier', icon: '🏰', number: '17', color: '#1E90FF' },
    { id: 5, title: 'Bijoux de Chance', description: 'Trésor sauveur', icon: '💎', number: '112', color: '#9B59B6' },
    { id: 6, title: 'Spectacle Magie', description: 'Illusion salvatrice', icon: '🎭', number: '112', color: '#E74C3C' },
    { id: 7, title: 'Rose Éternelle', description: 'Beauté curieuse', icon: '🌹', number: '112', color: '#F39C12' },
    { id: 8, title: 'Couronne Royale', description: 'Pouvoir urgent', icon: '👑', number: '112', color: '#F1C40F' },
    { id: 9, title: 'Temple Caché', description: 'Sanctuaire secret', icon: '🕌', number: '112', color: '#34495E' },
    { id: 10, title: 'Nuit Mystique', description: 'Magie nocturne', icon: '🌙', number: '3114', color: '#16A085' },
    { id: 11, title: 'Étincelles SOS', description: 'Lumière magique', icon: '✨', number: '0800555555', color: '#7F8C8D' },
  ],
  5: [ // CDPunch
    { id: 1, title: 'Punch Ultime', description: 'Combat SOS', icon: '👊', number: '15', color: '#FF6B6B' },
    { id: 2, title: 'Maître Karaté', description: 'Arts martiaux', icon: '🥋', number: '18', color: '#FF4444' },
    { id: 3, title: 'Musclé Super', description: 'Renfort physique', icon: '💪', number: '17', color: '#4169E1' },
    { id: 4, title: 'Champion SOS', description: 'Victoire urgente', icon: '🏆', number: '17', color: '#1E90FF' },
    { id: 5, title: 'Football Action', description: 'Match urgence', icon: '⚽', number: '112', color: '#9B59B6' },
    { id: 6, title: 'Médaille Honneur', description: 'Reconnaissance SOS', icon: '🎖️', number: '112', color: '#E74C3C' },
    { id: 7, title: 'Boxeur Pro', description: 'Combat pro urgence', icon: '🥊', number: '112', color: '#F39C12' },
    { id: 8, title: 'Premier Podium', description: 'Victoire urgente', icon: '🏅', number: '112', color: '#F1C40F' },
    { id: 9, title: 'Basketteur SOS', description: 'Slam dunk urgence', icon: '⛹️', number: '112', color: '#34495E' },
    { id: 10, title: 'Tir Précis', description: 'Cible urgence', icon: '🎯', number: '3114', color: '#16A085' },
    { id: 11, title: 'Cycliste Express', description: 'Vitesse urgence', icon: '🚴', number: '0800555555', color: '#7F8C8D' },
  ],
};

const seedDB = async () => {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await connectDB();

    console.log('🧹 Nettoyage des collections existantes...');
    await Listes.deleteMany({});
    await SOS.deleteMany({});

    console.log('📝 Création des listes...');
    const createdListes = await Listes.insertMany(listesData);
    console.log(`✅ ${createdListes.length} listes créées`);

    console.log('📝 Création des services SOS...');
    let totalSOS = 0;
    for (const liste of createdListes) {
      const sosForThisListe = sosDataByListe[liste.id];
      if (sosForThisListe) {
        const sosWithListeRef = sosForThisListe.map(sos => ({
          ...sos,
          listeId: liste._id,
        }));
        await SOS.insertMany(sosWithListeRef);
        totalSOS += sosForThisListe.length;
      }
    }
    console.log(`✅ ${totalSOS} services SOS créés`);

    console.log('✅ Base de données initialisée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

seedDB();
