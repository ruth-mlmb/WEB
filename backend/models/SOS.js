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
    status: {
      type: String,
      enum: ['en attente', 'confirmée', 'annulée'],
      default: 'en attente',
      description: 'Statut de la commande',
    },
  },
  { timestamps: true }
);

const SOS = mongoose.model('SOS', sosSchema);

export default SOS;
