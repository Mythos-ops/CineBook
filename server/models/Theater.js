import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  screens:   { type: Number, default: 5 },
  location:  { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Theater', theaterSchema);
