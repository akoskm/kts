import mongoose from 'mongoose';

let userSchema = new mongoose.Schema({
  username: { type: String, unique: true, index: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, index: true, required: true },
  status: { type: String, default: 'PENDING', required: true }
});
userSchema.set('autoIndex', (process.env.NODE_ENV === 'development'));

mongoose.model('User', userSchema);
