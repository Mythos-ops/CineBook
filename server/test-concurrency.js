/**
 * Concurrency Test: Attempt to book the SAME seat from two simultaneous requests.
 * Expected: One succeeds (201), the other is rejected (409).
 */

const API = 'http://localhost:5000/api';

async function run() {
  console.log('🧪 CineBook Concurrency Test\n');

  // 1. Get a showtime to test with
  const showtimesRes = await fetch(`${API}/showtimes`);
  const showtimes = await showtimesRes.json();
  
  if (!showtimes.length) {
    console.log('❌ No showtimes found. Run seed first.');
    return;
  }

  // Pick a showtime that has available seats
  const showtime = showtimes.find(st => !st.bookedSeats.includes('H8'));
  if (!showtime) {
    console.log('❌ All test seats are already booked. Re-seed the database.');
    return;
  }

  console.log(`📍 Testing showtime: ${showtime._id}`);
  console.log(`🎬 Movie: ${showtime.movie?.title || showtime.movie}`);
  console.log(`💺 Target seat: H8`);
  console.log(`📊 Currently booked seats: [${showtime.bookedSeats.join(', ')}]\n`);

  // 2. Fire TWO simultaneous booking requests for the SAME seat
  console.log('⚡ Firing 2 simultaneous requests for seat H8...\n');

  const bookSeat = async (label) => {
    const start = Date.now();
    try {
      const res = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showtimeId: showtime._id, seats: ['H8'] })
      });
      const data = await res.json();
      const ms = Date.now() - start;
      return { label, status: res.status, data, ms };
    } catch (err) {
      const ms = Date.now() - start;
      return { label, status: 'error', data: { error: err.message }, ms };
    }
  };

  const [result1, result2] = await Promise.all([
    bookSeat('Request A'),
    bookSeat('Request B')
  ]);

  // 3. Print results
  console.log(`${result1.label}: HTTP ${result1.status} (${result1.ms}ms)`);
  if (result1.status === 201) {
    console.log(`  ✅ Booking confirmed! Code: ${result1.data.bookingCode}`);
  } else {
    console.log(`  🚫 Rejected: ${result1.data.error}`);
  }

  console.log(`\n${result2.label}: HTTP ${result2.status} (${result2.ms}ms)`);
  if (result2.status === 201) {
    console.log(`  ✅ Booking confirmed! Code: ${result2.data.bookingCode}`);
  } else {
    console.log(`  🚫 Rejected: ${result2.data.error}`);
  }

  // 4. Verify
  console.log('\n─── VERDICT ───');
  const successes = [result1, result2].filter(r => r.status === 201);
  const failures = [result1, result2].filter(r => r.status !== 201);

  if (successes.length === 1 && failures.length === 1) {
    console.log('✅ PASS: Exactly one booking succeeded, the other was correctly rejected.');
    console.log('   The atomic locking mechanism is working!');
  } else if (successes.length === 2) {
    console.log('❌ FAIL: BOTH requests succeeded — race condition still exists!');
  } else if (successes.length === 0) {
    console.log('⚠️  BOTH requests failed — check server logs.');
  }
}

run().catch(console.error);
