import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import SOS from '../models/SOS.js';
import LISTE from '../models/LISTE.js';
import User from '../models/User.js';
import BDE from '../models/BDE.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    cb(null, safeName);
  },
});

const upload = multer({ storage });
const router = express.Router();

// ---- WEB2 auth endpoints ----
router.post('/login_user', async (req, res) => {
  try {
    const login = req.body.login;
    if (!login) return res.status(400).json({ error: 'login requis' });

    let user = await User.findById(login);
    if (!user) {
      user = await User.create({ _id: login, l_SOS: [] });
    }

    res.json({ pnom: user._id });
  } catch (error) {
    console.error('Erreur login_user :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/login_cdp', async (req, res) => {
  try {
    const { nom, mdp } = req.body;
    if (!nom || !mdp) return res.status(400).json({ error: 'nom+mdp requis' });

    const cdp = await LISTE.findOne({
      $or: [
        { listeName: nom, listeMDP: mdp },
        { Nom: nom, Mdp: mdp }
      ]
    }).lean();

    if (cdp) {
      const backListId = cdp.listeId ?? cdp.id;
      const numericListId = Number.isFinite(Number(backListId)) ? Number(backListId) : undefined;
      const mappingListe = {
        INSApocalypse: 1,
        INSAMERICA: 2,
        INSAlorsLaZone: 3,
        INSAladdin: 4,
        CDPunch: 5,
      };
      const listeId = numericListId ?? mappingListe[cdp.listeName ?? cdp.Nom] ?? null;
      const listeName = cdp.listeName ?? cdp.Nom ?? 'Liste inconnue';
      res.json({
        id_liste: cdp._id.toString(),
        listeId,
        listeName,
      });
    } else {
      res.json({ id_liste: 'erreur' });
    }
  } catch (error) {
    console.error('Erreur login_cdp :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/login_bde', async (req, res) => {
  try {
    const { nom, mdp } = req.body;
    if (!nom || !mdp) return res.status(400).json({ error: 'nom+mdp requis' });

    const bde = await BDE.findOne({ Login: nom, Mdp: mdp });
    if (bde) {
      res.json({ id_bde: bde._id.toString() });
    } else {
      res.json({ id_bde: 'erreur' });
    }
  } catch (error) {
    console.error('Erreur login_bde :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/candidates', async (req, res) => {
  try {
    const listes = await LISTE.find().lean();
    const classement = listes.map(liste => {
      return {
        id: liste.listeId ?? liste.id ?? liste._id,
        name: liste.listeName ?? liste.Nom ?? String(liste.listeId ?? liste.id ?? liste._id),
        score: liste.ptsListe ?? 0,
        logo: liste.logoListe ?? liste.image ?? '',
      };
    }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    res.json(classement);
  } catch (error) {
    console.error('Erreur /candidates :', error, error.stack);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

/* ---------------------------------------------------------
   1.Récupérer tous les SOS commandés (filter by listeId optional)
   GET /api/cdp/sos-en-attente?listeId=2
--------------------------------------------------------- */
router.get('/sos-en-attente', async (req, res) => {
  try {
    const { listeId } = req.query;
    const filter = { etat: 0 };
    if (listeId) filter.listeId = Number(listeId);

    const sos = await SOS.find(filter).sort({ dateCommande: -1 });
    res.json(sos);
  } catch (error) {
    console.error('Erreur récupération SOS en attente:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/sos-valides', async (req, res) => {
  try {
    const { listeId } = req.query;
    const filter = { etat: 1 };
    if (listeId) filter.listeId = Number(listeId);

    const sos = await SOS.find(filter).sort({ dateCommande: -1 });
    res.json(sos);
  } catch (error) {
    console.error('Erreur récupération SOS validés:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/sos-expires', async (req, res) => {
  try {
    const { listeId } = req.query;
    const filter = { etat: 2 };
    if (listeId) filter.listeId = Number(listeId);

    const sos = await SOS.find(filter).sort({ dateCommande: -1 });
    res.json(sos);
  } catch (error) {
    console.error('Erreur récupération SOS expirés:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/score', async (req, res) => {
  try {
    const { listeId, listeName } = req.query;
    if (listeId || listeName) {
      const numericId = Number(listeId);
      const queryConditions = [];

      if (listeId) {
        if (!Number.isNaN(numericId)) {
          queryConditions.push({ listeId: numericId });
          queryConditions.push({ id: numericId });
        }
        if (/^[0-9a-fA-F]{24}$/.test(String(listeId))) {
          queryConditions.push({ _id: listeId });
        }
      }

      // Ajoute une recherche par nom de liste (fallback pour legacy)
      if (listeName) {
        queryConditions.push({ listeName });
        queryConditions.push({ Nom: listeName });
      }

      let liste = queryConditions.length
        ? await LISTE.findOne({ $or: queryConditions }).lean()
        : null;

      if (!liste) {
        return res.json({ listeId: numericId || 0, ptsListe: 0, points: 0 });
      }

      const score = liste.ptsListe ?? 0;
      return res.json({ listeId: liste.listeId ?? liste.id ?? numericId, ptsListe: score, points: score });
    }

    const listes = await LISTE.find().lean();
    const totalPoints = listes.reduce((acc, l) => acc + (l.ptsListe ?? 0), 0);
    res.json({ totalPoints, points: totalPoints });
  } catch (error) {
    console.error('Erreur récupération score:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ---------------------------------------------------------
   GET /api/cdp/listes
--------------------------------------------------------- */
router.get('/listes', async (req, res) => {
  try {
    const listes = await LISTE.find().lean();

    const normalized = listes
      .map((liste) => {
        const score = typeof liste.points === 'number' ? liste.points : (liste.ptsListe ?? 0);
        return {
          _id: liste._id,
          listeId: liste.listeId ?? liste.id,
          listeName: liste.listeName ?? liste.Nom,
          listeMDP: liste.listeMDP ?? liste.Mdp,
          ptsListe: score,
          points: score,
          serviceId: liste.serviceId ?? 0,
          serviceName: liste.serviceName ?? 'Autre',
          sosProposes: liste.sosProposes ?? liste.l_SOS_proposes ?? [],
          sosCommandes: liste.sosCommandes ?? liste.l_SOS_commandes ?? [],
          logoListe: liste.logoListe ?? liste.image ?? '',
        };
      })
      .sort((a, b) => (b.ptsListe ?? 0) - (a.ptsListe ?? 0));

    res.json(normalized);
  } catch (error) {
    console.error('Erreur récupération listes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ---------------------------------------------------------
   POST /api/cdp/listes
--------------------------------------------------------- */
router.post('/listes', async (req, res) => {
  try {
    const { listeId, listeName, listeMDP, logoListe } = req.body;
    if (!listeId || !listeName || !listeMDP) {
      return res.status(400).json({ error: 'Champs listeId/listeName/listeMDP obligatoires' });
    }

    const existing = await LISTE.findOne({ listeId: Number(listeId) });
    if (existing) {
      return res.status(409).json({ error: 'Liste déjà existante' });
    }

    const liste = new LISTE({
      serviceId: 0,
      serviceName: 'Autre',
      listeId: Number(listeId),
      listeName,
      listeMDP,
      sosProposes: [],
      sosCommandes: [],
      logoListe: logoListe || '',
      ptsListe: 0,
    });

    await liste.save();
    res.status(201).json({ message: 'Liste créée', data: liste });
  } catch (error) {
    console.error('Erreur création liste:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ---------------------------------------------------------
   5️.Valider un SOS (envois photo, points, état)
   POST /api/cdp/valider/:id
   body multipart/form-data: cdpNom, photo
--------------------------------------------------------- */
router.post('/valider/:id', upload.single('photo'), async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.id);
    if (!sos) return res.status(404).json({ error: 'SOS non trouvé' });
    if (sos.etat === 1) return res.status(400).json({ error: 'SOS déjà validé' });

    let validationPhotoUrl = '';
    if (req.file) {
      validationPhotoUrl = `/uploads/${req.file.filename}`;
    }

    sos.etat = 1;
    sos.photoValidation = validationPhotoUrl;
    sos.cdpNom = req.body.cdpNom || sos.cdpNom;
    sos.dateValidation = new Date();

    await sos.save({ validateBeforeSave: false });

    // Correction : forcer le typage de listeId en Number
    const listeIdNum = Number(sos.listeId);
    const deltaPoints = 10;
    // Recherche d'abord par id/listeId, puis fallback par Nom/listeName
    let updatedListe = await LISTE.findOneAndUpdate(
      {
        $or: [
          { listeId: listeIdNum },
          { id: listeIdNum }
        ],
      },
      {
        $inc: { ptsListe: deltaPoints, points: deltaPoints },
        $addToSet: { sosCommandes: sos._id.toString() },
      },
      { returnDocument: 'after' }
    );

    // Si pas trouvé, tente par Nom/listeName
    if (!updatedListe && sos.listeName) {
      updatedListe = await LISTE.findOneAndUpdate(
        {
          $or: [
            { listeName: sos.listeName },
            { Nom: sos.listeName }
          ]
        },
        {
          $inc: { ptsListe: deltaPoints, points: deltaPoints },
          $addToSet: { sosCommandes: sos._id.toString() },
        },
        { returnDocument: 'after' }
      );
    }

    if (!updatedListe) {
      console.error('[CDP] ERREUR: Liste non trouvée pour ajout de points', { listeId: sos.listeId, listeName: sos.listeName, sosId: sos._id });
      return res.status(500).json({ error: 'Liste non trouvée pour ajout de points', listeId: sos.listeId, listeName: sos.listeName });
    }

    res.json({ message: 'SOS validé', data: sos, pointsAjoutes: deltaPoints, nouvelleListe: updatedListe });
  } catch (error) {
    console.error('Erreur validation SOS:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ---------------------------------------------------------
   POST /api/cdp/sos (commande ou proposition)
   body multipart/form-data ou json
--------------------------------------------------------- */
router.post('/sos', upload.single('image'), async (req, res) => {
  try {
    const {
      serviceId,
      serviceName,
      listeId,
      listeName,
      nomPote,
      nom_SOS,
      description,
      pnom_commande,
      batiment,
      chambre,
      jour,
      horaire,
      pointValeur,
      key,
    } = req.body;

    if (!listeId || !listeName || !nomPote || !jour || !horaire) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    const generatedKey = key || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || '');

    const newSOS = new SOS({
      serviceId: serviceId || 0,
      serviceName: serviceName || '',
      listeId: Number(listeId),
      listeName,
      nomPote,
      pnom_commande: pnom_commande || '',
      numeroBat: batiment || '',
      numeroChambre: chambre || '',
      jour,
      horaire,
      nom_SOS: nom_SOS || '',
      description: description || '',
      imageUrl,
      key: generatedKey,
      liste: listeName,
      pointValeur: Number(pointValeur || 10),
      etat: 0,
      dateCommande: new Date(),
    });

    const savedSOS = await newSOS.save();

    const liste = await LISTE.findOne({ listeId: Number(listeId) });
    if (liste) {
      if (!liste.sosProposes) liste.sosProposes = [];
      if (!liste.sosProposes.includes(savedSOS._id.toString())) liste.sosProposes.push(savedSOS._id.toString());
      if (!liste.sosCommandes) liste.sosCommandes = [];
      if (!liste.sosCommandes.includes(savedSOS._id.toString())) liste.sosCommandes.push(savedSOS._id.toString());
      await liste.save();
    }

    res.status(201).json({ message: 'SOS enregistré', data: savedSOS });
  } catch (error) {
    console.error('Erreur création SOS:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ---------------------------------------------------------
   GET /api/cdp/sos/:id
--------------------------------------------------------- */
router.get('/sos/:id', async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.id);
    if (!sos) return res.status(404).json({ error: 'SOS introuvable' });
    res.json(sos);
  } catch (error) {
    console.error('Erreur récupération SOS ID:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/* ---------------------------------------------------------
   PUT /api/cdp/sos/:id/status
--------------------------------------------------------- */
router.put('/sos/:id/status', async (req, res) => {
  try {
    const { etat } = req.body;
    if (![0, 1, 2].includes(Number(etat))) {
      return res.status(400).json({ error: 'État invalide (0,1,2)' });
    }

    const sos = await SOS.findByIdAndUpdate(
      req.params.id,
      { etat: Number(etat) },
      { new: true }
    );

    if (!sos) return res.status(404).json({ error: 'SOS non trouvé' });
    res.json(sos);
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

console.log('cdpRoutes routes:', router.stack
  .filter(layer => layer.route)
  .map(layer => ({ method: Object.keys(layer.route.methods)[0], path: layer.route.path }))
);

export default router;
