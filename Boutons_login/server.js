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
    _id: String, // l'id de la liste
    Nom : String, // nom de la liste
    Mdp: String, // mot de passe de la liste
    l_SOS_proposes : [],
    l_SOS_commandes : [],
    points : Number

});
const Cdp = mongoose.model('Cdp', cdpSchema, 'Listes');

// Schéma du BDE
const bdeSchema = new mongoose.Schema({
    _id: String, // l'id du BDE
    Login : String, // login du BDE
    Mdp: String // mot de passe du BDE
});
const BDE = mongoose.model('BDE', bdeSchema, 'BDE');


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


app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});