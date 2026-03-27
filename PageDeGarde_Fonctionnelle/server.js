import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

dotenv.config({ path: './routes/.env' });



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // permet de lire le JSON envoyé par React

// Connexion à MongoDB
connectDB();


// Schéma utilisateur
const userSchema = new mongoose.Schema({
    _id: String, // le login de l'utilisateur
    l_SOS : [] // liste des SOS envoyés par l'utilisateur
});
const User = mongoose.model('User', userSchema, 'User_INSA');

// Schéma liste de CDP
const cdpSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId, // l'id de la liste
    Nom : String, // nom de la liste
    Mdp: String, // mot de passe de la liste
    l_SOS_proposes : [],
    l_SOS_commandes : [],
    points : Number

});
const Cdp = mongoose.model('Cdp', cdpSchema, 'Listes');

// Schéma du BDE
const bdeSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId, // l'id du BDE
    Login : String, // login du BDE
    Mdp: String // mot de passe du BDE
});
const BDE = mongoose.model('BDE', bdeSchema, 'BDE');

// Schéma des SOS commandés 
const sosCommandesSchema = new mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    nomPote : String,
    numeroBat : String,
    numeroChambre : String,
    listeId : String,
    sosId : String,
    etat : Number,
    horaire : String,
    jour : String,
    dateCommande : Date,
    createdAt : Date,
    updatedAt : Date
});
const SOSCOMMANDE = mongoose.model('SOSCOMMANDE', sosCommandesSchema, 'SOS_commandes');




// Route POST /login_user
app.post('/login_user', async (req, res) => {
    const login = req.body.login;

    // On cherche l'utilisateur dans la base de données :
    const user = await User.findOne({ _id: login });

    if (user) {
        res.json({"pnom" : user._id});
        console.log("pnom:", user._id);

    } else {
        console.log("User non trouvé, création d'un nouvel user.");
        const newUser = new User({ _id : login , "l_SOS" : []});
        await newUser.save();
        res.json({"pnom" : newUser._id});
        console.log("Nouvel utilisateur créé:", newUser._id);

    }
});

// Route POST /login_cdp
app.post('/login_cdp', async (req, res) => {
    const nom = req.body.nom;
    const mdp = req.body.mdp;
    // On cherche la liste dans la base de données :
    const cdp = await Cdp.findOne({ Nom: nom, Mdp: mdp });

    if (cdp) {
        res.json({"id_liste" : cdp._id});
        console.log("id_liste:", cdp._id);

    } else {
        res.json({"id_liste" : "erreur"});
        console.log("Erreur de connexion pour la liste:", nom);

    }
});

// Route POST /login_bde
app.post('/login_bde', async (req, res) => {
    const nom = req.body.nom;
    const mdp = req.body.mdp;
    // On cherche la liste dans la base de données :
    const bde = await BDE.findOne({ Login: nom, Mdp: mdp });

    if (bde) {
        res.json({"id_bde" : bde._id});
        console.log("id_bde:", bde._id);

    } else {
        res.json({"id_bde" : "erreur"});
        console.log("Erreur de connexion pour le BDE:", nom);

    }

});

// ── GET /api/candidates ───────────────────────────────────────
// Regroupe les SOS_Commandes par listeId
// et compte ceux dont etat === 1 (terminé)
app.get("/api/candidates", async (req, res) => {
  try {
    const results = await SOSCOMMANDE.aggregate([
    {
        $group: {
            _id: "$listeId",
            score: {
                $sum: {
                    $cond: [{ $eq: ["$etat", 1] }, 1, 0]
                }
            }
        }
    },
    {
        $sort: { score: -1 }
    },
    {
        $project: {
            _id: 0,
            id: "$_id",
            score: 1
        }
    }
]);

    // Pour chaque résultat, on cherche le nom de la liste
    const enriched = await Promise.all(
        results.map(async (result) => {
            const liste = await Cdp.findById(result.id);
            return {
                id: result.id,
                // Si la liste est trouvée on prend son nom, sinon on garde l'id
                name: liste ? liste.Nom : result.id,
                score: result.score
            };
        })
    );

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});