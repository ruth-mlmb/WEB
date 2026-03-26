import mongoose from 'mongoose';

const listeSchema = new mongoose.Schema(
  {
    serviceId: {
      type: Number,
      required: true,
      description: 'ID du service émergency (1-13)',
    },
    serviceName: {
      type: String,
      required: true,
      description: 'Nom du service (ex: Pompiers, Police)',
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
      type: Array, //Idk
      required: true,
      description: 'Logo de la liste',
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

const LISTE = mongoose.model('LISTE', listeSchema, 'LISTE');

export default LISTE;