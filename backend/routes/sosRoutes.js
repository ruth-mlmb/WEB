import express from 'express';
import SOS from '../models/SOS.js';

const router = express.Router();

// Listes de SOS pour chaque catégorie (même qu'en frontend)
const sosPerCategory = {
  1: [ // INSApocalypse
    { id: 1, title: 'Cirque Apocalyptique' },
    { id: 2, title: 'Fusée de Secours' },
    { id: 3, title: 'Bunker Sûr' },
    { id: 4, title: 'Déminage Express' },
    { id: 5, title: 'Pompiers Extrêmes' },
    { id: 6, title: 'Refuge Glacé' },
    { id: 7, title: 'Électricien Fou' },
    { id: 8, title: 'Tempête Contrôle' },
    { id: 9, title: 'Scientifique SOS' },
    { id: 10, title: 'Robot Salvateur' },
    { id: 11, title: 'Explosion Control' },
    { id: 12, title: 'Réalisateur SOS' },
  ],
  2: [ // INSAmerica
    { id: 1, title: 'Cowboy Rescue' },
    { id: 2, title: 'Eagle Air Force' },
    { id: 3, title: 'Super Bowl SOS' },
    { id: 4, title: 'Statue Liberté' },
    { id: 5, title: 'Fast Food Doctor' },
    { id: 6, title: 'Pickup Truck' },
    { id: 7, title: 'Rock Band SOS' },
    { id: 8, title: 'Camping Shelter' },
    { id: 9, title: 'BBQ Master' },
    { id: 10, title: 'Parc Aventure' },
    { id: 11, title: 'Money Maker' },
  ],
  3: [ // INSAlorsLaZone
    { id: 1, title: 'Désert SOS' },
    { id: 2, title: 'Caravane Express' },
    { id: 3, title: 'Bateau Zone' },
    { id: 4, title: 'Île Refuge' },
    { id: 5, title: 'Lampe Torche SOS' },
    { id: 6, title: 'Navigateur Zone' },
    { id: 7, title: 'Tente Camping' },
    { id: 8, title: 'Explorateur SOS' },
    { id: 9, title: 'Signal Relay' },
    { id: 10, title: 'Trek Randonnée' },
    { id: 11, title: 'Escalade Rescue' },
  ],
  4: [ // INSAladdin
    { id: 1, title: 'Génie Magique' },
    { id: 2, title: 'Tapis Volant SOS' },
    { id: 3, title: 'Sabre Protecteur' },
    { id: 4, title: 'Palais d\'Urgence' },
    { id: 5, title: 'Bijoux de Chance' },
    { id: 6, title: 'Spectacle Magie' },
    { id: 7, title: 'Rose Éternelle' },
    { id: 8, title: 'Couronne Royale' },
    { id: 9, title: 'Temple Caché' },
    { id: 10, title: 'Nuit Mystique' },
    { id: 11, title: 'Étincelles SOS' },
  ],
  5: [ // CDPunch
    { id: 1, title: 'Punch Ultime' },
    { id: 2, title: 'Maître Karaté' },
    { id: 3, title: 'Musclé Super' },
    { id: 4, title: 'Champion SOS' },
    { id: 5, title: 'Football Action' },
    { id: 6, title: 'Médaille Honneur' },
    { id: 7, title: 'Boxeur Pro' },
    { id: 8, title: 'Premier Podium' },
    { id: 9, title: 'Basketteur SOS' },
    { id: 10, title: 'Tir Précis' },
    { id: 11, title: 'Cycliste Express' },
  ],
};

// Fonction pour obtenir un service par catégorie et ID
const getServiceByIdAndCategory = (categoryId, serviceId) => {
  const services = sosPerCategory[categoryId];
  if (!services) return null;
  return services.find((s) => s.id === parseInt(serviceId));
};

// ✅ POST - Créer un nouveau SOS
router.post('/commande', async (req, res) => {
  try {
    const { serviceId, listeId, listeName, nomPote, numeroBat, numeroChambre, horaire, jour } = req.body;

    // LOG: Voir ce qui est reçu
    console.log('📨 Données reçues:', { serviceId, listeId, listeName, nomPote, numeroBat, numeroChambre, horaire, jour });

    // Validation des données
    if (!serviceId || !listeId || !listeName || !nomPote || !numeroBat || !numeroChambre || !horaire || !jour) {
      console.log('❌ Validation échouée: champs manquants');
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Trouver le nom du service
    const service = getServiceByIdAndCategory(parseInt(listeId), serviceId);
    if (!service) {
      console.log('❌ Service invalide:', serviceId, 'pour la catégorie:', listeId);
      return res.status(400).json({ error: 'Service invalide' });
    }

    // Créer le nouveau SOS
    const newSOS = new SOS({
      serviceId,
      serviceName: service.title,
      listeId: parseInt(listeId),
      listeName,
      nomPote,
      numeroBat,
      numeroChambre,
      horaire,
      jour,
    });

    console.log('💾 Sauvegarde en base de données...');
    await newSOS.save();

    console.log('✅ SOS sauvegardé avec ID:', newSOS._id);
    res.status(201).json({
      message: '✅ SOS commandé avec succès!',
      data: newSOS,
    });
  } catch (error) {
    console.error('❌ Erreur lors de la commande SOS:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// ✅ GET - Récupérer tous les SOS
router.get('/tous', async (req, res) => {
  try {
    const tous = await SOS.find().sort({ dateCommande: -1 });
    res.json(tous);
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ GET - SOS par jour et horaire
router.get('/par-jour-horaire', async (req, res) => {
  try {
    const { jour, horaire } = req.query;

    if (!jour || !horaire) {
      return res.status(400).json({ error: 'Jour et horaire requis' });
    }

    const sos = await SOS.find({ jour, horaire }).sort({ dateCommande: -1 });
    res.json(sos);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ GET - Détails d'un SOS
router.get('/:id', async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.id);
    if (!sos) {
      return res.status(404).json({ error: 'SOS non trouvé' });
    }
    res.json(sos);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ PUT - Mettre à jour le statut
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const sos = await SOS.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(sos);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ DELETE - Annuler (supprimer) un SOS
router.delete('/:id', async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.id);
    if (!sos) {
      return res.status(404).json({ error: 'SOS non trouvé' });
    }

    if (sos.etat === 1) {
      return res.status(400).json({ error: 'Ce SOS est déjà confirmé et ne peut pas être annulé.' });
    }

    const now = new Date();
    const dateCommande = new Date(sos.dateCommande);
    const diffMinutes = (now - dateCommande) / (1000 * 60);

    if (diffMinutes > 30) {
      return res.status(400).json({ error: 'Délai d\'annulation dépassé (30 minutes).' });
    }

    // Suppression définitive
    await SOS.findByIdAndDelete(req.params.id);

    res.json({ message: 'SOS annulé avec succès.' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

export default router;
