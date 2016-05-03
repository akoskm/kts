import mongoose from 'mongoose';

let tokenSchema = new mongoose.Schema({
  tokenString: { type: String, unique: true, index: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  status: { type: String }
});
tokenSchema.set('autoIndex', (process.env.NODE_ENV === 'development'));

mongoose.model('Token', tokenSchema);
