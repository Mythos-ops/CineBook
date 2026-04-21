import { Router } from 'express';
import Booking from '../models/Booking.js';
import Showtime from '../models/Showtime.js';

const router = Router();

// POST /api/bookings — create a new booking
router.post('/', async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;

    if (!showtimeId || !seats || !seats.length) {
      return res.status(400).json({ error: 'showtimeId and seats are required' });
    }

    // 1. Fetch the showtime
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

    // 2. Check seat availability
    const alreadyBooked = seats.filter(s => showtime.bookedSeats.includes(s));
    if (alreadyBooked.length > 0) {
      return res.status(409).json({ 
        error: 'Seats already booked', 
        seats: alreadyBooked 
      });
    }

    // 3. Calculate total price
    const totalPrice = seats.length * showtime.price;

    // 4. Create booking
    const booking = new Booking({
      showtime: showtimeId,
      seats,
      totalPrice
    });
    await booking.save();

    // 5. Update the showtime's booked seats
    showtime.bookedSeats.push(...seats);
    await showtime.save();

    // 6. Return the booking with populated references
    const populated = await Booking.findById(booking._id)
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title poster backdrop rating' },
          { path: 'theater', select: 'name' }
        ]
      });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/:id — retrieve a booking by id
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title poster backdrop rating duration' },
          { path: 'theater', select: 'name' }
        ]
      });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/code/:code — retrieve a booking by its booking code
router.get('/code/:code', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingCode: req.params.code })
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title poster backdrop rating duration' },
          { path: 'theater', select: 'name' }
        ]
      });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
