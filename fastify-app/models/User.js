import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  passwordHash: String, // if you're handling auth yourself
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);