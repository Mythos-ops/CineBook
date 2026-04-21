import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  // Booking flow state
  selectedMovie: null,
  selectedShowtime: null,   // Full showtime object from API (includes theater, price, bookedSeats)
  selectedSeats: [],
  
  // Booking result (after confirmation)
  bookingResult: null,      // Full booking object returned from POST /api/bookings
  
  setMovie: (movie) => set({ 
    selectedMovie: movie, 
    selectedSeats: [], 
    selectedShowtime: null,
    bookingResult: null 
  }),

  setShowtime: (showtime) => set({ 
    selectedShowtime: showtime, 
    selectedSeats: [] 
  }),
  
  toggleSeat: (seatId) => set((state) => {
    const isSelected = state.selectedSeats.includes(seatId);
    if (isSelected) {
      return { selectedSeats: state.selectedSeats.filter(id => id !== seatId) };
    }
    return { selectedSeats: [...state.selectedSeats, seatId] };
  }),

  setBookingResult: (result) => set({ bookingResult: result }),
  
  clearBooking: () => set({ 
    selectedMovie: null, 
    selectedShowtime: null, 
    selectedSeats: [],
    bookingResult: null
  }),
}));
