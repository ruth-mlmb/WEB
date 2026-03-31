import mongoose from 'mongoose';

const sosServiceSchema = new mongoose.Schema(
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
      description: 'URL ou path de l image',
    },
    liste: {
      type: String,
      required: true,
      description: 'Nom de la liste CDP',
    },
  },
  { timestamps: true }
);

const SOSService = mongoose.models.SOSService || mongoose.model('SOSService', sosServiceSchema, 'SOS');

export default SOSService;
