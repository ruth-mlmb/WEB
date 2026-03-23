import express from 'express';
import SOS from '../models/SOS.js';

const router = express.Router();

// Donnée des services (même que dans le frontend)
const emergencyServices = [
  { id: 1, title: 'Pop the ballon' },
  { id: 2, title: 'Pompiers' },
  { id: 3, title: 'Police' },
  { id: 4, title: 'Gendarmerie' },
  { id: 5, title: 'Dentiste SOS' },
  { id: 6, title: 'Vétérinaire' },
  { id: 7, title: 'Assistance Auto' },
  { id: 8, title: 'Électricien' },
  { id: 9, title: 'Aide Juridique' },
  { id: 10, title: 'Soutien Mental' },
  { id: 11, title: "Gaz d'Urgence" },
  { id: 12, title: 'Aide à la Personne' },
  { id: 13, title: 'Anti-Poison' },
];

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
    const service = emergencyServices.find((s) => s.id === parseInt(serviceId));
    if (!service) {
      console.log('❌ Service invalide:', serviceId);
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
