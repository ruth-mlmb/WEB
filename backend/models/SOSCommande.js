import mongoose from 'mongoose';

const sosCommandeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      description: '_id de l\'utilisateur INSA',
    },
    nomPote: {
      type: String,
      required: true,
      trim: true,
      description: 'Nom de la personne qui a commandé le SOS',
    },
    numeroBat: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: true,
      description: 'Bâtiment : A, B, C ou D',
    },
    numeroChambre: {
      type: Number,
      required: true,
      description: 'Numéro de la chambre',
    },
    listeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listes',
      required: true,
      description: 'Référence à la liste CDP',
    },
    sosId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SOS',
      required: true,
      description: 'Référence au service SOS',
    },
    etat: {
      type: Number,
      enum: [0, 1], // 0 = en cours, 1 = confirmée
      default: 0,
      description: 'État numérique : 0=en cours, 1=confirmée',
    },
    dateCommande: {
      type: Date,
      default: Date.now,
      description: 'Timestamp exact de la commande',
    },
    horaire: {
      type: String,
      enum: ['Matin', 'Après-midi', 'Soir'],
      required: true,
      description: 'Tranche horaire de livraison',
    },
    jour: {
      type: String,
      enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      required: true,
      description: 'Jour de livraison',
    },
  },
  { timestamps: true }
);

const SOSCommande = mongoose.model('SOSCommande', sosCommandeSchema, 'SOS_commandes');

export default SOSCommande;
