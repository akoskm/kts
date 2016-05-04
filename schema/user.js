import mongoose from 'mongoose';

let userSchema = new mongoose.Schema({
  username: { type: String, unique: true, index: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, index: true, required: true },
  status: { type: String, default: 'PENDING', required: true },
  token: { type: String, unique: true, index: true },
  photos: [{
    filename: { type: String },
    name: { type: String },
    contentType: { type: String },
    size: { type: Number }
  }]
});
userSchema.set('autoIndex', (process.env.NODE_ENV === 'development'));

mongoose.model('User', userSchema);
