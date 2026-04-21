import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  year:     { type: Number, required: true },
  duration: { type: String, required: true },
  rating:   { type: String, required: true },  // e.g. PG-13, R
  score:    { type: Number, required: true },
  genre:    [String],
  poster:   { type: String, required: true },
  backdrop: { type: String, required: true },
  synopsis: { type: String, required: true },
  cast: [{
    name:   String,
    role:   String,
    avatar: String
  }],
  status: {
    type: String,
    enum: ['now_showing', 'coming_soon'],
    default: 'now_showing'
  },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);
