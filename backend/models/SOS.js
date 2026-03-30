import mongoose from 'mongoose';

const sosSchema = new mongoose.Schema(
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
    nomPote: {
      type: String,
      required: true,
      trim: true,
      description: 'Nom de la personne qui a commandé le SOS',
    },
    numeroBat: {
      type: String,
      required: true,
      trim: true,
      description: 'Numéro du bâtiment',
    },
    numeroChambre: {
      type: String,
      required: true,
      trim: true,
      description: 'Numéro de la chambre',
    },
    horaire: {
      type: String,
      enum: ['Matin', 'Après-midi', 'Soir'],
      required: true,
      description: 'Tranche horaire du SOS',
    },
    jour: {
      type: String,
      enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      required: true,
      description: 'Jour de la semaine',
    },
    dateCommande: {
      type: Date,
      default: Date.now,
      description: 'Timestamp exact de la commande',
    },
    etat: {
      type: Number,
      enum: [0, 1, 2], // 0 = en cours, 1 = confirmée
      default: 0,
      description: 'État numérique : 0=en cours, 1=confirmée, 2=expirée',
    },
  },
  { timestamps: true }
);

const SOS = mongoose.model('SOS', sosSchema, 'SOS_commandes');

export default SOS;
