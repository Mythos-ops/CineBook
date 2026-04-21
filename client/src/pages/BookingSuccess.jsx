import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Download } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const { bookingResult, selectedMovie, selectedShowtime, clearBooking } = useBookingStore();

  useEffect(() => {
    if (!bookingResult) {
      navigate('/');
    }
  }, [bookingResult, navigate]);

  if (!bookingResult) return null;

  // Extract data from the populated booking result
  const movie = bookingResult.showtime?.movie || selectedMovie || {};
  const theater = bookingResult.showtime?.theater || {};
  const showtime = bookingResult.showtime || selectedShowtime || {};

  return (
    <div className="success-page container">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="success-header"
      >
        <div className="success-icon-wrapper">
          <CheckCircle2 size={64} className="success-icon" />
        </div>
        <h1 className="success-title">Booking Confirmed!</h1>
        <p className="success-subtitle">Your digital ticket is ready.</p>
      </motion.div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="digital-ticket"
      >
        <div className="ticket-bg" style={{ backgroundImage: `url('${movie.backdrop || movie.poster}')` }}></div>
        <div className="ticket-overlay"></div>
        
        <div className="ticket-content">
          <div className="ticket-top">
            <h2 className="t-movie-title">{movie.title}</h2>
            <span className="t-rating">{movie.rating}</span>
          </div>

          <div className="ticket-grid">
            <div className="t-box">
              <span className="t-label">Date</span>
              <span className="t-value">
                {showtime.date ? new Date(showtime.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
              </span>
            </div>
            <div className="t-box">
              <span className="t-label">Time</span>
              <span className="t-value">{showtime.time}</span>
            </div>
            <div className="t-box full-w">
              <span className="t-label">Cinema</span>
              <span className="t-value">{theater.name} • Screen {showtime.screen || 1}</span>
            </div>
            <div className="t-box full-w">
              <span className="t-label">Seats</span>
              <span className="t-value highlight-seats">{bookingResult.seats.join(', ')}</span>
            </div>
            <div className="t-box">
              <span className="t-label">Total Paid</span>
              <span className="t-value">${bookingResult.totalPrice.toFixed(2)}</span>
            </div>
            <div className="t-box">
              <span className="t-label">Booking Code</span>
              <span className="t-value highlight-seats">{bookingResult.bookingCode}</span>
            </div>
          </div>

          <div className="ticket-barcode-area">
            <div className="mock-qr"></div>
            <p className="qr-hint">Scan at entrance</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="success-actions"
      >
        <button className="btn-ghost dl-btn">
          <Download size={20} /> Download Ticket
        </button>
        <button 
          className="btn-primary" 
          onClick={() => {
            clearBooking();
            navigate('/');
          }}
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;
