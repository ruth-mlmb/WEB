import mongoose from 'mongoose';

const listesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      description: 'Nom de la liste CDP (nouveau champ)',
    },
    Nom: {
      type: String,
      description: 'Nom de la liste CDP (ancien champ)',
    },
    image: {
      type: String,
      description: 'URL ou path de l image de la liste',
    },
  },
  { timestamps: true }
);

const Listes = mongoose.models.Listes || mongoose.model('Listes', listesSchema, 'Listes');

export default Listes;
