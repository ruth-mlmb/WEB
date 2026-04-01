import mongoose from 'mongoose';

const listeSchema = new mongoose.Schema(
  {
    serviceId: {
      type: Number,
      required: false,
      default: 0,
      description: 'ID du service émergency (1-13)',
    },
    serviceName: {
      type: String,
      required: false,
      default: 'Autre',
      description: 'Nom du service (ex: Pompiers, Police)',
    },
    // Legacy fields suport for old collection from WEB2/PageDeGarde
    Nom: {
      type: String,
      required: false,
      description: 'Nom de la liste (legacy)',
    },
    Mdp: {
      type: String,
      required: false,
      description: 'Mot de passe de la liste (legacy)',
    },
    id: {
      type: Number,
      required: false,
      description: 'ID de la liste (legacy)',
    },
    listeId: {
      type: Number,
      required: true,
      description: 'ID de la liste CDP (1-5)',
    },
    listeName: {
      type: String,
      required: true,
      description: 'Nom de la liste CDP (ex: INSApocalypse, INSAmerica)',
    },
    listeMDP: {
      type: String,
      required: true,
      description: 'Mot de passe de connexion de la liste (ex: Abc123)'
    },
    sosProposes: {
      type: Array,
      required: true,
      default: [],
      description: 'Liste des ID des SOS proposés par la liste'
    },
    sosCommandes: {
      type: Array,
      required: true,
      default: [],
      description: 'Liste des ID des SOS commandés par les utilisateur.ice.s à la liste'
    },
    logoListe: {
      type: String,
      required: false,
      default: '',
      description: 'URL ou path du logo de la liste',
    },
    ptsListe: {
      type: Number,
      required: true,
      default: 0,
      description: 'Nombre de points obtenus par la liste'
    }
  },
  { timestamps: true }
);

// To support existing WEB2 legacy collection name and new schema,
// we read from both if necessary. Default to legacy collection 'Listes'.
const LISTE = mongoose.model('LISTE', listeSchema, 'Listes');

export default LISTE;
