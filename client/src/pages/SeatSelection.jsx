import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { api } from '../data/api';
import './SeatSelection.css';

const SeatSelection = () => {
  const navigate = useNavigate();
  const { 
    selectedMovie, 
    selectedShowtime, 
    selectedSeats, 
    toggleSeat, 
    setBookingResult 
  } = useBookingStore();
  
  const [showModal, setShowModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!selectedMovie || !selectedShowtime) {
    return (
      <div className="container" style={{ paddingTop: '6rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Please select a movie and showtime first.</p>
        <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
          Browse Movies
        </button>
      </div>
    );
  }

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];
  
  // Use real booked seats from the API showtime data
  const bookedSeats = selectedShowtime.bookedSeats || [];
  const price = selectedShowtime.price || 19;
  const convenienceFee = 4.00;

  const totalPrice = selectedSeats.length * price;
  const grandTotal = totalPrice + convenienceFee;

  const theaterName = selectedShowtime.theater?.name || 'Theater';
  const showTime = selectedShowtime.time || '';

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    toggleSeat(seatId);
  };

  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    setError(null);
    try {
      const result = await api.createBooking(selectedShowtime._id, selectedSeats);
      setBookingResult(result);
      setShowModal(false);
      navigate('/success');
    } catch (err) {
      setError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="seat-selection-page">
      {/* Top Bar */}
      <div className="booking-topbar container">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div className="booking-context">
          <h2 className="context-title">{selectedMovie.title}</h2>
          <p className="context-subtitle">{theaterName} • {showTime} • Screen {selectedShowtime.screen || 1}</p>
        </div>
      </div>

      {/* Screen Indicator */}
      <div className="screen-indicator-wrapper container">
        <div className="screen-glow"></div>
        <div className="screen-line"></div>
        <p className="screen-text">SCREEN</p>
      </div>

      {/* Seat Grid */}
      <div className="seat-grid container hide-scrollbar">
        {rows.map(row => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            <div className="seat-cols">
              {cols.map(col => {
                const seatId = `${row}${col}`;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);
                
                let btnClass = 'seat-btn';
                if (isBooked) btnClass += ' booked';
                else if (isSelected) btnClass += ' selected';
                
                const marginClass = col === 4 ? 'aisle-right' : '';

                return (
                  <button 
                    key={seatId} 
                    className={`${btnClass} ${marginClass}`}
                    onClick={() => handleSeatClick(seatId)}
                    disabled={isBooked}
                  />
                );
              })}
            </div>
            <span className="row-label">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="seat-legend container">
        <div className="legend-item"><div className="seat-preview"></div> Available</div>
        <div className="legend-item"><div className="seat-preview selected"></div> Selected</div>
        <div className="legend-item"><div className="seat-preview booked"></div> Booked</div>
      </div>

      {/* Sticky Bottom Summary */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="sticky-summary panel-glass"
          >
            <div className="summary-left">
              <span className="seats-list">{selectedSeats.join(', ')}</span>
              <span className="total-price">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Proceed to Confirm
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay glass-panel-heavy">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="confirmation-modal glass-panel"
            >
              <h2 className="modal-title">Confirm Booking</h2>
              
              <div className="modal-movie-info">
                <img src={selectedMovie.poster} alt={selectedMovie.title} />
                <div className="m-info">
                  <h3>{selectedMovie.title}</h3>
                  <p>{theaterName} • {showTime}</p>
                </div>
              </div>

              <div className="receipt-breakdown">
                <div className="r-row">
                  <span>{selectedSeats.length} × Seat ({selectedSeats.join(', ')})</span> 
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="r-row"><span>Convenience Fee</span> <span>${convenienceFee.toFixed(2)}</span></div>
                <div className="r-divider"></div>
                <div className="r-row r-total">
                  <span>Total Due</span> 
                  <span className="gradient-text">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <p style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {error}
                </p>
              )}

              <div className="modal-actions">
                <button className="btn-ghost" onClick={() => setShowModal(false)} disabled={bookingLoading}>
                  Go Back
                </button>
                <button className="btn-primary" onClick={handleConfirmBooking} disabled={bookingLoading}>
                  {bookingLoading ? 'Booking...' : 'Yes, Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeatSelection;
