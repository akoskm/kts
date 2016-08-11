import mongoose from 'mongoose';
import URLSlugs from 'mongoose-url-slugs';

let photoSchema = new mongoose.Schema({
  originalFilename: { type: String },
  filename: { type: String },
  name: { type: String },
  contentType: { type: String },
  size: { type: Number },
  tags: [],
    // ability to publis photos and/or albums
  published: { type: Boolean, required: true, default: false },
  page: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' }
});
photoSchema.set('autoIndex', (process.env.NODE_ENV === 'development'));
photoSchema.plugin(URLSlugs('name', { field: 'nameslug' }));

mongoose.model('Photo', photoSchema);
