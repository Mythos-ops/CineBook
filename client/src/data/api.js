const API_BASE = import.meta.env.PROD
  ? 'https://cinebook-pf6o.onrender.com'
  : 'http://localhost:5000/api';

export const api = {
  // Movies
  async getMovies(status) {
    const url = status ? `${API_BASE}/movies?status=${status}` : `${API_BASE}/movies`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch movies');
    return res.json();
  },

  async getFeaturedMovie() {
    const res = await fetch(`${API_BASE}/movies/featured`);
    if (!res.ok) throw new Error('Failed to fetch featured movie');
    return res.json();
  },

  async getMovie(id) {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    if (!res.ok) throw new Error('Failed to fetch movie');
    return res.json();
  },

  // Showtimes
  async getShowtimes(movieId, date) {
    let url = `${API_BASE}/showtimes?movie=${movieId}`;
    if (date) url += `&date=${date}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch showtimes');
    return res.json();
  },

  async getShowtime(id) {
    const res = await fetch(`${API_BASE}/showtimes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch showtime');
    return res.json();
  },

  // Bookings
  async createBooking(showtimeId, seats) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showtimeId, seats })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Booking failed');
    }
    return res.json();
  },

  async getBooking(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    if (!res.ok) throw new Error('Failed to fetch booking');
    return res.json();
  }
};
