import express from 'express';
import SOSCommande from '../models/SOSCommande.js';
import SOS from '../models/SOS_service.js';
import Listes from '../models/Listes.js';

const router = express.Router();

// ✅ GET - Récupérer toutes les listes depuis la base de données
router.get('/listes', async (req, res) => {
  try {
    const listes = await Listes.find().sort({ id: 1 });
    res.json(listes);
  } catch (error) {
    console.error('Erreur récupération listes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ GET - Récupérer tous les services pour une liste (query listeId numérique ou ObjectId)
router.get('/services', async (req, res) => {
  const { listeId } = req.query;
  if (!listeId) {
    return res.status(400).json({ error: 'listeId requis' });
  }

  try {
    let liste = null;
    if (/^[0-9]+$/.test(listeId)) {
      liste = await Listes.findOne({ id: parseInt(listeId, 10) });
    }
    if (!liste) {
      liste = await Listes.findById(listeId);
    }

    if (!liste) {
      return res.status(404).json({ error: 'Liste introuvable' });
    }

    const services = await SOS.find({ listeId: liste._id }).sort({ id: 1 });
    res.json(services);
  } catch (error) {
    console.error('Erreur récupération services:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ POST - Créer un nouveau SOS commandé
router.post('/commande', async (req, res) => {
  try {
    const { serviceId, listeId, nomPote, numeroBat, numeroChambre, horaire, jour } = req.body;

    // LOG: Voir ce qui est reçu
    console.log('📨 Données reçues:', { serviceId, listeId, nomPote, numeroBat, numeroChambre, horaire, jour });

    // Validation des données
    if (!serviceId || !listeId || !nomPote || !numeroBat || !numeroChambre || !horaire || !jour) {
      console.log('❌ Validation échouée: champs manquants');
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Vérifier que la liste existe
    const liste = await Listes.findOne({ id: parseInt(listeId) });
    if (!liste) {
      console.log('❌ Liste invalide:', listeId);
      return res.status(400).json({ error: 'Liste invalide' });
    }

    // Vérifier que le service existe et appartient à la liste
    const sos = await SOS.findOne({ 
      id: parseInt(serviceId), 
      listeId: liste._id 
    });
    if (!sos) {
      console.log('❌ Service invalide:', serviceId, 'pour la liste:', listeId);
      return res.status(400).json({ error: 'Service invalide' });
    }

    // Créer la nouvelle commande de SOS
    const newSOSCommande = new SOSCommande({
      nomPote,
      numeroBat,
      numeroChambre: parseInt(numeroChambre),
      listeId: liste._id,
      sosId: sos._id,
      horaire,
      jour,
    });

    console.log('💾 Sauvegarde en base de données...');
    await newSOSCommande.save();

    // Populer les références pour la réponse
    await newSOSCommande.populate('listeId sosId');

    console.log('✅ SOS commandé avec ID:', newSOSCommande._id);
    res.status(201).json({
      message: '✅ SOS commandé avec succès!',
      data: newSOSCommande,
    });
  } catch (error) {
    console.error('❌ Erreur lors de la commande SOS:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// ✅ GET - Récupérer tous les SOS commandés
router.get('/tous', async (req, res) => {
  try {
    const tous = await SOSCommande.find()
      .populate('listeId')
      .populate('sosId')
      .sort({ dateCommande: -1 });
    res.json(tous);
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ GET - SOS commandés par jour et horaire
router.get('/par-jour-horaire', async (req, res) => {
  try {
    const { jour, horaire } = req.query;

    if (!jour || !horaire) {
      return res.status(400).json({ error: 'Jour et horaire requis' });
    }

    const sos = await SOSCommande.find({ jour, horaire })
      .populate('listeId')
      .populate('sosId')
      .sort({ dateCommande: -1 });
    res.json(sos);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ GET - Détails d'un SOS commandé
router.get('/:id', async (req, res) => {
  try {
    const sos = await SOSCommande.findById(req.params.id)
      .populate('listeId')
      .populate('sosId');
    if (!sos) {
      return res.status(404).json({ error: 'SOS commandé non trouvé' });
    }
    res.json(sos);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ PUT - Mettre à jour l'état du SOS commandé
router.put('/:id/status', async (req, res) => {
  try {
    const { etat } = req.body;
    const sos = await SOSCommande.findByIdAndUpdate(
      req.params.id,
      { etat },
      { new: true }
    ).populate('listeId').populate('sosId');
    res.json(sos);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ DELETE - Annuler (supprimer) un SOS commandé
router.delete('/:id', async (req, res) => {
  try {
    const sos = await SOSCommande.findById(req.params.id);
    if (!sos) {
      return res.status(404).json({ error: 'SOS commandé non trouvé' });
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
    await SOSCommande.findByIdAndDelete(req.params.id);

    res.json({ message: 'SOS annulé avec succès.' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

export default router;
