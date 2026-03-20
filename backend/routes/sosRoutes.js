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
    const { serviceId, nomPote, numeroBat, numeroChambre, horaire, jour } = req.body;

    // LOG: Voir ce qui est reçu
    console.log('📨 Données reçues:', { serviceId, nomPote, numeroBat, numeroChambre, horaire, jour });

    // Validation des données
    if (!serviceId || !nomPote || !numeroBat || !numeroChambre || !horaire || !jour) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Trouver le nom du service
    const service = emergencyServices.find((s) => s.id === parseInt(serviceId));
    if (!service) {
      return res.status(400).json({ error: 'Service invalide' });
    }

    // Créer le nouveau SOS
    const newSOS = new SOS({
      serviceId,
      serviceName: service.title,
      nomPote,
      numeroBat,
      numeroChambre,
      horaire,
      jour,
    });

    await newSOS.save();

    res.status(201).json({
      message: '✅ SOS commandé avec succès!',
      data: newSOS,
    });
  } catch (error) {
    console.error('Erreur lors de la commande SOS:', error);
    res.status(500).json({ error: 'Erreur serveur' });
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

// ✅ GET - SOS groupés par jour et horaire (statistiques)
router.get('/statistiques', async (req, res) => {
  try {
    const stats = await SOS.aggregate([
      {
        $group: {
          _id: {
            jour: '$jour',
            horaire: '$horaire',
          },
          count: { $sum: 1 },
          services: { $push: '$serviceName' },
        },
      },
      {
        $sort: { '_id.jour': 1, '_id.horaire': 1 },
      },
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ GET - Un SOS par ID
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

// ✅ UPDATE - Modifier le statut d'un SOS
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['En attente', 'En cours', 'Résolu'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const sos = await SOS.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!sos) {
      return res.status(404).json({ error: 'SOS non trouvé' });
    }

    res.json({
      message: 'Statut mis à jour',
      data: sos,
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ DELETE - Supprimer un SOS
router.delete('/:id', async (req, res) => {
  try {
    const sos = await SOS.findByIdAndDelete(req.params.id);
    if (!sos) {
      return res.status(404).json({ error: 'SOS non trouvé' });
    }
    res.json({ message: '✅ SOS supprimé' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
