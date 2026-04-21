import { Router } from 'express';
import Theater from '../models/Theater.js';

const router = Router();

// GET /api/theaters
router.get('/', async (req, res) => {
  try {
    const theaters = await Theater.find().sort({ name: 1 });
    res.json(theaters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
