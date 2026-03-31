import mongoose from 'mongoose';

const sosCommandeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      description: 'Identifiant utilisateur',
    },
    nomPote: {
      type: String,
      required: true,
      trim: true,
      description: 'Nom de la personne qui a commande le SOS',
    },
    numeroBat: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: true,
      description: 'Batiment : A, B, C ou D',
    },
    numeroChambre: {
      type: Number,
      required: true,
      description: 'Numero de la chambre',
    },
    listeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listes',
      required: true,
      description: 'Reference a la liste CDP',
    },
    sosId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SOSService',
      required: true,
      description: 'Reference au service SOS',
    },
    etat: {
      type: Number,
      enum: [0, 1],
      default: 0,
      description: 'Etat numerique : 0=en cours, 1=confirmee',
    },
    dateCommande: {
      type: Date,
      default: Date.now,
      description: 'Timestamp exact de la commande',
    },
    horaire: {
      type: String,
      enum: ['Matin', 'Apres-midi', 'Après-midi', 'Soir'],
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

const SOSCommande = mongoose.models.SOSCommande || mongoose.model('SOSCommande', sosCommandeSchema, 'SOS_commandes');

export default SOSCommande;
