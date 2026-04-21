import { Router } from 'express';
import Showtime from '../models/Showtime.js';

const router = Router();

// GET /api/showtimes?movie=<movieId>&date=<YYYY-MM-DD>
// Returns showtimes for a specific movie, optionally filtered by date, populated with theater info
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.movie) filter.movie = req.query.movie;
    if (req.query.date) {
      const d = new Date(req.query.date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    const showtimes = await Showtime.find(filter)
      .populate('theater', 'name location')
      .populate('movie', 'title poster')
      .sort({ time: 1 });

    res.json(showtimes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/showtimes/:id — single showtime with full details  
router.get('/:id', async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate('theater')
      .populate('movie');
    if (!showtime) return res.status(404).json({ error: 'Showtime not found' });
    res.json(showtime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
