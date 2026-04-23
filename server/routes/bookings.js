import { Router } from 'express';
import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Showtime from '../models/Showtime.js';
import { acquireLock, releaseLock } from '../lib/redis.js';

const router = Router();

// POST /api/bookings — create a new booking (with distributed lock)
router.post('/', async (req, res) => {
  const { showtimeId, seats } = req.body;

  if (!showtimeId || !seats || !seats.length) {
    return res.status(400).json({ error: 'showtimeId and seats are required' });
  }

  // Generate a unique ID for this booking attempt (used as lock owner identity)
  const requestId = crypto.randomUUID();
  let lockAcquired = false;

  try {
    // ─── Step 1: Acquire distributed lock on the showtime ───
    // This prevents two concurrent requests from both reading the same
    // bookedSeats state and both thinking the seats are available.
    lockAcquired = await acquireLock(showtimeId, requestId, 10);

    if (!lockAcquired) {
      return res.status(423).json({ 
        error: 'Another booking is being processed for this showtime. Please try again in a moment.' 
      });
    }

    // ─── Step 2: Fetch showtime and check availability ───
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

    const alreadyBooked = seats.filter(s => showtime.bookedSeats.includes(s));
    if (alreadyBooked.length > 0) {
      return res.status(409).json({ 
        error: 'Seats already booked', 
        seats: alreadyBooked 
      });
    }

    // ─── Step 3: Atomic MongoDB update ───
    // Even with Redis lock, we use $addToSet as a safety net.
    // The condition ensures no other request snuck seats in between.
    const updateResult = await Showtime.updateOne(
      { 
        _id: showtimeId, 
        // Only update if NONE of the requested seats are in bookedSeats yet
        bookedSeats: { $nin: seats } 
      },
      { $addToSet: { bookedSeats: { $each: seats } } }
    );

    if (updateResult.matchedCount === 0) {
      // The atomic condition failed — seats were taken between lock acquire and now
      return res.status(409).json({ 
        error: 'Seats were just booked by someone else. Please select different seats.' 
      });
    }

    // ─── Step 4: Create the booking record ───
    const totalPrice = seats.length * showtime.price;
    const booking = new Booking({
      showtime: showtimeId,
      seats,
      totalPrice
    });
    await booking.save();

    // ─── Step 5: Return populated booking ───
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
  } finally {
    // ─── Always release the lock ───
    if (lockAcquired) {
      await releaseLock(showtimeId, requestId);
    }
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
