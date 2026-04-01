import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  l_SOS: { type: Array, default: [] },
}, { timestamps: true });

const User = mongoose.model('User', userSchema, 'User_INSA');
export default User;