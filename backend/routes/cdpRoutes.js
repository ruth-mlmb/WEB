import express from 'express';
import SOS from '../models/SOS.js';
import LISTE from '../models/LISTE.js';

const router = express.Router();

/* ---------------------------------------------------------
   1.Récupérer tous les SOS commandés à une liste
   GET /api/cdp/sos?listeId=2
--------------------------------------------------------- */
router.get('/sos', async (req, res) => {
  try {
    const { listeId } = req.query;

    if (!listeId) {
      return res.status(400).json({ error: 'listeId requis' });
    }

    const sos = await SOS.find({ listeId }).sort({ dateCommande: -1 });

    res.json(sos);
  } catch (error) {
    console.error('Erreur récupération SOS:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ---------------------------------------------------------
   2️.Récupérer le nombre de points d’une liste
   GET /api/cdp/points?listeId=2
--------------------------------------------------------- */
router.get('/points', async (req, res) => {
  try {
    const { listeId } = req.query;

    if (!listeId) {
      return res.status(400).json({ error: 'listeId requis' });
    }

    const liste = await LISTE.findOne({ listeId });

    if (!liste) {
      return res.status(404).json({ error: 'Liste non trouvée' });
    }

    res.json({ listeId, ptsListe: liste.ptsListe });
  } catch (error) {
    console.error('Erreur récupération points:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ---------------------------------------------------------
   3️.Récupérer les points de toutes les listes (classement)
   GET /api/cdp/classement
--------------------------------------------------------- */
router.get('/classement', async (req, res) => {
  try {
    const listes = await LISTE.find({}, { listeName: 1, ptsListe: 1, listeId: 1 })
      .sort({ ptsListe: -1 });

    res.json(listes);
  } catch (error) {
    console.error('Erreur classement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ---------------------------------------------------------
   4️.Modifier le statut d’un SOS
   PUT /api/cdp/sos/:id/status
   Body : { etat: 1 }
--------------------------------------------------------- */
router.put('/sos/:id/status', async (req, res) => {
  try {
    const { etat } = req.body;

    if (![0, 1, 2].includes(etat)) {
      return res.status(400).json({ error: 'État invalide (0,1,2)' });
    }

    const sos = await SOS.findByIdAndUpdate(
      req.params.id,
      { etat },
      { new: true }
    );

    if (!sos) {
      return res.status(404).json({ error: 'SOS non trouvé' });
    }

    res.json(sos);
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
