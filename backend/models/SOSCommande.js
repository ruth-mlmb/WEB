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
      enum: [0, 1, 2],
      default: 0,
      description: 'Etat numerique : 0=en cours, 1=confirmee, 2=expiree',
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
        // Champs ajoutés pour compatibilité avec la vue "Liste"
    listeName: {
      type: String,
      default: '',
      description: 'Nom de la liste pour affichage frontend liste',
    },
    liste: {
      type: String,
      default: '',
      description: 'Alias de listeName pour compatibilité frontend',
    },
    serviceId: {
      type: Number,
      description: 'Identifiant numérique du service côté frontend liste',
    },
    serviceName: {
      type: String,
      default: '',
      description: 'Nom technique/service du SOS',
    },
    nom_SOS: {
      type: String,
      default: '',
      description: 'Nom affiché du SOS côté vue liste',
    },
    description: {
      type: String,
      default: '',
      description: 'Description du SOS',
    },
    imageUrl: {
      type: String,
      default: '',
      description: 'Image du SOS pour la vue liste',
    },
    pointValeur: {
      type: Number,
      default: 0,
      description: 'Valeur en points du SOS',
    },
    pnom_commande: {
      type: String,
      default: '',
      description: 'Nom de la personne ayant passé la commande',
    },
    key: {
      type: String,
      default: '',
      description: 'Clé frontend legacy',
    },
  },
  { timestamps: true }
);

const SOSCommande = mongoose.models.SOSCommande || mongoose.model('SOSCommande', sosCommandeSchema, 'SOS_commandes');

export default SOSCommande;
