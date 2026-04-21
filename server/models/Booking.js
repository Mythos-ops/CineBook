import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  showtime:  { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  seats:     { type: [String], required: true },                  // e.g. ["A1", "A2"]
  totalPrice:{ type: Number, required: true },
  status:    { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  bookingCode: { type: String, unique: true }                     // auto-generated ticket code
}, { timestamps: true });

// Generate a random booking code before saving
bookingSchema.pre('save', function () {
  if (!this.bookingCode) {
    this.bookingCode = 'CB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
});

export default mongoose.model('Booking', bookingSchema);
