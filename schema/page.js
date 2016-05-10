import mongoose from 'mongoose';

let pageSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  photos: [{
    filename: { type: String },
    name: { type: String },
    contentType: { type: String },
    size: { type: Number },
    tags: []
  }]
});
pageSchema.set('autoIndex', (process.env.NODE_ENV === 'development'));

mongoose.model('Page', pageSchema);
