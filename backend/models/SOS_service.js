import mongoose from 'mongoose';

const sosSchema = new mongoose.Schema(
  {
    serviceId: {
      type: Number,
      required: true,
      description: 'ID du service SOS',
    },
    name: {
      type: String,
      required: true,
      description: 'Nom du service SOS',
    },
    Description: {
      type: String,
      required: true,
      description: 'Description du service',
    },
    image: {
      type: String,
      default: null,
      description: 'URL ou path de l\'image',
    },
    liste: {
      type: String,
      required: true,
      description: 'Nom de la liste CDP (ex: INSAPOCALYPSE)',
    },
  },
  { timestamps: true }
);

const SOS = mongoose.model('SOS', sosSchema, 'SOS');

export default SOS;
