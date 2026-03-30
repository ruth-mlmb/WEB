import mongoose from 'mongoose';

const bdeSchema = new mongoose.Schema({
  Login: { type: String, required: true },
  Mdp: { type: String, required: true },
}, { timestamps: true });

const BDE = mongoose.model('BDE', bdeSchema, 'BDE');
export default BDE;