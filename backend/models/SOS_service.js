import mongoose from 'mongoose';

const sosSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      description: 'ID du service (1-12/13 selon la liste)',
    },
    title: {
      type: String,
      required: true,
      description: 'Nom du service SOS',
    },
    description: {
      type: String,
      required: true,
      description: 'Description du service',
    },
    icon: {
      type: String,
      description: 'Emoji ou icône du service',
    },
    number: {
      type: String,
      description: 'Numéro à appeler',
    },
    color: {
      type: String,
      description: 'Couleur hexadécimale associée',
    },
    image: {
      type: String,
      default: null,
      description: 'URL ou path de l\'image (null au début)',
    },
    listeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listes',
      required: true,
      description: 'Référence à la liste CDP',
    },
  },
  { timestamps: true }
);

const SOS = mongoose.model('SOS', sosSchema, 'SOS');

export default SOS;
