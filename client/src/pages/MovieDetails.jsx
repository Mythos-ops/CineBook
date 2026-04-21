import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { api } from '../data/api';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const setMovie = useBookingStore(state => state.setMovie);
  const setShowtime = useBookingStore(state => state.setShowtime);

  const [movie, setMovieData] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(0); // index into dates array
  const [loading, setLoading] = useState(true);

  // Generate next 7 days for date picker
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const formatDate = (d) => {
    const opts = { weekday: 'short', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-US', opts);
  };

  const formatISODate = (d) => d.toISOString().split('T')[0];

  // Load movie data
  useEffect(() => {
    async function loadMovie() {
      try {
        const m = await api.getMovie(id);
        setMovieData(m);
      } catch (err) {
        console.error('Failed to load movie:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [id]);

  // Load showtimes whenever the selected date changes
  useEffect(() => {
    if (!movie) return;
    async function loadShowtimes() {
      try {
        const date = formatISODate(dates[selectedDate]);
        const st = await api.getShowtimes(movie._id, date);
        setShowtimes(st);
      } catch (err) {
        console.error('Failed to load showtimes:', err);
      }
    }
    loadShowtimes();
  }, [movie, selectedDate]);

  const handleShowtimeSelect = (showtime) => {
    setMovie(movie);
    setShowtime(showtime);
    navigate(`/book/${movie._id}`);
  };

  if (loading) {
    return <div className="container" style={{ paddingTop: '6rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
  }

  if (!movie) return <div className="container" style={{ paddingTop: '6rem' }}>Movie not found</div>;

  // Group showtimes by theater
  const showtimesByTheater = showtimes.reduce((acc, st) => {
    const name = st.theater?.name || 'Unknown';
    if (!acc[name]) acc[name] = [];
    acc[name].push(st);
    return acc;
  }, {});

  return (
    <div className="details-page">
      {/* Hero Banner */}
      <section className="details-hero">
        <div className="hero-bg" style={{ backgroundImage: `url('${movie.backdrop}')` }}>
          <div className="hero-overlay-heavy"></div>
        </div>
        
        <div className="container hero-content-split">
          <div className="poster-col">
            <img src={movie.poster} alt={movie.title} className="poster-img" />
          </div>
          <div className="info-col">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="details-title"
            >
              {movie.title}
            </motion.h1>
            
            <div className="meta-row">
              <span className="meta-item">{movie.year}</span>
              <span className="meta-item"><Clock size={16} /> {movie.duration}</span>
              <span className="meta-badge">{movie.rating}</span>
              <span className="meta-score">⭐ {movie.score}</span>
            </div>

            <p className="synopsis">{movie.synopsis}</p>
            
            <div className="cast-row hide-scrollbar">
              {movie.cast.map(actor => (
                <div key={actor.name} className="cast-member">
                  <img src={actor.avatar} alt={actor.name} />
                  <span className="actor-name">{actor.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Showtime Selector */}
      <section className="showtimes-section container">
        <h2 className="section-title">Select Showtime</h2>
        
        <div className="date-picker hide-scrollbar">
          {dates.map((date, i) => (
            <button 
              key={i} 
              className={`date-pill ${i === selectedDate ? 'active' : ''}`}
              onClick={() => setSelectedDate(i)}
            >
              {i === 0 ? 'Today' : formatDate(date)}
            </button>
          ))}
        </div>

        {Object.keys(showtimesByTheater).length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', marginTop: '2rem' }}>No showtimes available for this date.</p>
        ) : (
          <div className="theaters-list">
            {Object.entries(showtimesByTheater).map(([theaterName, sts]) => (
              <div key={theaterName} className="theater-card glass-panel">
                <h3 className="theater-name">{theaterName}</h3>
                <div className="times-grid">
                  {sts.sort((a, b) => a.time.localeCompare(b.time)).map(st => (
                    <button 
                      key={st._id} 
                      className="time-btn"
                      onClick={() => handleShowtimeSelect(st)}
                    >
                      <span className="time-value">{st.time}</span>
                      <span className="time-price">${st.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MovieDetails;
