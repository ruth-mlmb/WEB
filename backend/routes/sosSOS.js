import express from 'express';
import SOS from '../models/SOS.js';

const router = express.Router();

// ========== POST: Créer une nouvelle commande SOS ==========
router.post('/commande', async (req, res) => {
  try {
    const { serviceId, serviceName, nomPote, numeroBat, numeroChambre, jour, horaire } = req.body;

    // Vérification des champs obligatoires
    if (!serviceId || !serviceName || !nomPote || !numeroBat || !numeroChambre || !jour || !horaire) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    // Création de la commande
    const newSOS = new SOS({
      serviceId,
      serviceName,
      nomPote,
      numeroBat,
      numeroChambre,
      jour,
      horaire
    });

    // Sauvegarde en base de données
    const savedSOS = await newSOS.save();

    console.log('✅ SOS créé:', savedSOS);
    res.status(201).json({
      message: 'SOS commandé avec succès!',
      data: savedSOS
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création du SOS:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création du SOS' });
  }
});

// ========== GET: Récupérer toutes les commandes SOS ==========
router.get('/tous', async (req, res) => {
  try {
    const sosCommandes = await SOS.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: 'Toutes les commandes SOS',
      count: sosCommandes.length,
      data: sosCommandes
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des SOS:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========== GET: Récupérer une commande SOS par ID ==========
router.get('/:id', async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.id);
    if (!sos) {
      return res.status(404).json({ error: 'SOS introuvable' });
    }
    res.status(200).json({
      message: 'Commande SOS trouvée',
      data: sos
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du SOS:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========== PUT: Mettre à jour une commande SOS ==========
router.put('/:id', async (req, res) => {
  try {
    const { statut } = req.body;

    const updatedSOS = await SOS.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true, runValidators: true }
    );

    if (!updatedSOS) {
      return res.status(404).json({ error: 'SOS introuvable' });
    }

    console.log('✅ SOS mis à jour:', updatedSOS);
    res.status(200).json({
      message: 'SOS mis à jour avec succès',
      data: updatedSOS
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du SOS:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour' });
  }
});

// ========== DELETE: Supprimer une commande SOS ==========
router.delete('/:id', async (req, res) => {
  try {
    const deletedSOS = await SOS.findByIdAndDelete(req.params.id);

    if (!deletedSOS) {
      return res.status(404).json({ error: 'SOS introuvable' });
    }

    console.log('✅ SOS supprimé:', deletedSOS);
    res.status(200).json({
      message: 'SOS supprimé avec succès',
      data: deletedSOS
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du SOS:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression' });
  }
});

export default router;
