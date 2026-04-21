import { Router } from 'express';
import Movie from '../models/Movie.js';

const router = Router();

// GET /api/movies — list all movies, optionally filter by status
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const movies = await Movie.find(filter).sort({ featured: -1, score: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/movies/featured — get the featured movie for the hero banner
router.get('/featured', async (req, res) => {
  try {
    const movie = await Movie.findOne({ featured: true });
    if (!movie) return res.status(404).json({ error: 'No featured movie found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/movies/:id — get single movie by id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
