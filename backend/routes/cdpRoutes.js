import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import SOS from '../models/SOS.js';
import LISTE from '../models/LISTE.js';
import User from '../models/User.js';
import BDE from '../models/BDE.js';
import SOSCommande from '../models/SOSCommande.js';

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

// Pour trouver les listes :
async function resolveListe(input) {
  if (!input) return null;

  // 1. ObjectId direct
  if (/^[0-9a-fA-F]{24}$/.test(String(input))) {
    const byId = await LISTE.findById(input);
    if (byId) return byId;
  }

  // 2. Numérique
  const numeric = Number(input);
  if (!Number.isNaN(numeric)) {
    const byNumeric = await LISTE.findOne({
      $or: [
        { listeId: numeric },
        { id: numeric },
      ],
    });

    if (byNumeric) return byNumeric;
  }

  // 3. Mapping fallback (CRUCIAL)
  const mappingListe = {
    1: 'INSApocalypse',
    2: 'INSAMERICA',
    3: 'INSAlorsLaZone',
    4: 'INSAladdin',
    5: 'CDPunch',
  };

  if (mappingListe[input]) {
    const byName = await LISTE.findOne({
      $or: [
        { listeName: mappingListe[input] },
        { Nom: mappingListe[input] },
      ],
    });

    if (byName) return byName;
  }

  // 4. Nom direct
  const byName = await LISTE.findOne({
    $or: [
      { listeName: input },
      { Nom: input },
    ],
  });

  return byName;
}

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
    const mongoFilter = { etat: 0 };

    if (listeId) {
      const liste = await resolveListe(listeId);

      if (!liste) {
        console.log('[sos-en-attente] liste introuvable pour:', listeId);
        return res.json([]);
      }

      mongoFilter.listeId = liste._id;
    }

    const sos = await SOSCommande.find(mongoFilter)
      .populate('sosId')
      .populate('listeId')
      .sort({ dateCommande: -1 });

    console.log('[sos-en-attente] req listeId =', listeId);
    console.log('[sos-en-attente] mongoFilter =', mongoFilter);
    console.log('[sos-en-attente] result count =', sos.length);

    res.json(sos);
  } catch (error) {
    console.error('Erreur récupération SOS en attente:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

router.get('/sos-valides', async (req, res) => {
  try {
    const { listeId } = req.query;
    const mongoFilter = { etat: 1 };

    if (listeId) {
      const liste = await resolveListe(listeId);

      if (!liste) {
        console.log('[sos-valides] liste introuvable pour:', listeId);
        return res.json([]);
      }

      mongoFilter.listeId = liste._id;
    }

    const sos = await SOSCommande.find(mongoFilter)
      .populate('sosId')
      .populate('listeId')
      .sort({ dateCommande: -1 });

    console.log('[sos-valides] req listeId =', listeId);
    console.log('[sos-valides] mongoFilter =', mongoFilter);
    console.log('[sos-valides] result count =', sos.length);

    res.json(sos);
  } catch (error) {
    console.error('Erreur récupération SOS validés:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

router.get('/sos-expires', async (req, res) => {
  try {
    const { listeId } = req.query;
    const mongoFilter = { etat: 2 };

    if (listeId) {
      const liste = await resolveListe(listeId);

      if (!liste) {
        console.log('[sos-expires] liste introuvable pour:', listeId);
        return res.json([]);
      }

      mongoFilter.listeId = liste._id;
    }

    const sos = await SOSCommande.find(mongoFilter)
      .populate('sosId')
      .populate('listeId')
      .sort({ dateCommande: -1 });

    console.log('[sos-expires] req listeId =', listeId);
    console.log('[sos-expires] mongoFilter =', mongoFilter);
    console.log('[sos-expires] result count =', sos.length);

    res.json(sos);
  } catch (error) {
    console.error('Erreur récupération SOS expirés:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
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
    const sos = await SOSCommande.findById(req.params.id);

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

    await sos.save();

    const deltaPoints = 10;

    const updatedListe = await LISTE.findByIdAndUpdate(
      sos.listeId, // ✅ ObjectId direct
      {
        $inc: { ptsListe: deltaPoints, points: deltaPoints },
        $addToSet: { sosCommandes: sos._id.toString() },
      },
      { new: true }
    );

    if (!updatedListe) {
      console.error('[CDP] Liste non trouvée pour:', sos.listeId);
      return res.status(500).json({ error: 'Liste non trouvée' });
    }

    res.json({
      message: 'SOS validé',
      data: sos,
      pointsAjoutes: deltaPoints,
      nouvelleListe: updatedListe,
    });

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

    const liste_bis = await LISTE.findOne({ listeId: Number(listeId) });
      if (!liste_bis) {
        return res.status(400).json({ error: 'Liste introuvable' });
      }

      const service = await SOS.findOne({ serviceId: Number(serviceId) });
      if (!service) {
        return res.status(400).json({ error: 'Service introuvable' });
      }

    if (!listeId || !listeName || !nomPote || !jour || !horaire) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    const generatedKey = key || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || '');

    const newSOS = new SOSCommande({
      userId: pnom_commande || 'cdp',

      nomPote,
      numeroBat: batiment,
      numeroChambre: Number(chambre),

      listeId: liste_bis._id,
      sosId: service._id,

      horaire,
      jour,

      etat: 0,
      dateCommande: new Date(),

      listeName,
      liste: listeName,

      serviceId: service.serviceId,
      serviceName: service.serviceName || '',

      nom_SOS: nom_SOS || service.name || '',
      description: description || '',
      imageUrl,

      pointValeur: Number(pointValeur || 10),

      pnom_commande,
      key: generatedKey
    });

    const savedSOS = await newSOS.save();

    const liste = liste_bis;
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
