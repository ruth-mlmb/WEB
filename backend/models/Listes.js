import mongoose from 'mongoose';

const listesSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      description: 'ID de la liste (1-5)',
    },
    name: {
      type: String,
      required: true,
      description: 'Nom de la liste CDP',
    },
    image: {
      type: String,
      description: 'URL ou path de l\'image de la liste',
    },
  },
  { timestamps: true }
);

const Listes = mongoose.model('Listes', listesSchema, 'Listes');

export default Listes;
