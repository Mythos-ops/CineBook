import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
  movie:     { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theater:   { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  date:      { type: Date, required: true },
  time:      { type: String, required: true },           // e.g. "19:00"
  screen:    { type: Number, default: 1 },
  price:     { type: Number, default: 19.00 },
  bookedSeats: [String]                                   // e.g. ["D4", "D5"]
}, { timestamps: true });

// Index to quickly look up showtimes for a movie
showtimeSchema.index({ movie: 1, date: 1 });

export default mongoose.model('Showtime', showtimeSchema);
