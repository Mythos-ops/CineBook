import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';
import Theater from './models/Theater.js';
import Showtime from './models/Showtime.js';
import Booking from './models/Booking.js';

dotenv.config();

const movies = [
  {
    title: 'Spider-Man: Across the Spider-Verse',
    year: 2023,
    duration: '2h 20m',
    rating: 'PG',
    score: 4.8,
    genre: ['Animation', 'Action'],
    poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    synopsis: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    cast: [
      { name: 'Shameik Moore', role: 'Miles Morales', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGSVXPvTWfj-w3yMOu9uvpL4h4bdGbCy9pwQ&s' },
      { name: 'Hailee Steinfeld', role: 'Gwen Stacy', avatar: 'https://cdn.britannica.com/35/215035-050-1CC9E23D/American-actress-Hailee-Steinfeld-2017.jpg' }
    ],
    status: 'now_showing',
    featured: true
  },
  {
    title: 'The Dark Knight',
    year: 2008,
    duration: '2h 32m',
    rating: 'PG-13',
    score: 4.9,
    genre: ['Action', 'Crime', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne / Batman', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEvf_7hPFM4tMWGdDzopvKNBV9_FkHl11eKw&s' },
      { name: 'Heath Ledger', role: 'Joker', avatar: 'https://hips.hearstapps.com/hmg-prod/images/heath_ledger_getty_images_photo_bob_riha_jr_wireimage_116948085.jpg' }
    ],
    status: 'now_showing',
    featured: false
  },
  {
    title: 'Blade Runner 2049',
    year: 2017,
    duration: '2h 44m',
    rating: 'R',
    score: 4.7,
    genre: ['Sci-Fi', 'Mystery'],
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_2049_poster.png',
    backdrop: 'https://image.tmdb.org/t/p/w1280/ilRyazdUWJlglhA7kEBME2zC6E.jpg',
    synopsis: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    cast: [
      { name: 'Ryan Gosling', role: 'K', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUgRTE2CmeBOl_e8KRT8mYdZ4CRyMkaLjzeA&s' },
      { name: 'Harrison Ford', role: 'Rick Deckard', avatar: 'https://image.tmdb.org/t/p/w200/5M7oN3sznp99hWYQ9sX0xheswWX.jpg' }
    ],
    status: 'now_showing',
    featured: false
  },
  {
    title: 'Oppenheimer',
    year: 2023,
    duration: '3h 0m',
    rating: 'R',
    score: 4.8,
    genre: ['Biography', 'Drama'],
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/rMZqqBpg2w26P7S4V9C7hKzFz4s.jpg',
    synopsis: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSvip8VYAF4ZOQk4KgSvEp515dYoDzaHOXng&s' }
    ],
    status: 'now_showing',
    featured: false
  },
  {
    title: 'Barbie',
    year: 2023,
    duration: '1h 54m',
    rating: 'PG-13',
    score: 4.5,
    genre: ['Comedy', 'Fantasy'],
    poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/t5zCBSB5xMCEcOTmb1wNyRwX4nK.jpg',
    synopsis: 'Barbie suffers a crisis that leads her to question her world and her existence.',
    cast: [
      { name: 'Margot Robbie', role: 'Barbie', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxq3ZmGOEBuPSAsWasRO70yyLgy33Gm3YCwQ&s' }
    ],
    status: 'now_showing',
    featured: false
  },
  {
    title: 'John Wick: Chapter 4',
    year: 2023,
    duration: '2h 49m',
    rating: 'R',
    score: 4.7,
    genre: ['Action', 'Thriller'],
    poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2u89.jpg',
    synopsis: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy.',
    cast: [
      { name: 'Keanu Reeves', role: 'John Wick', avatar: 'https://cdn.britannica.com/11/215011-050-3127A07E/American-actor-Keanu-Reeves-2014.jpg' }
    ],
    status: 'now_showing',
    featured: false
  },
  // Coming Soon
  {
    title: 'Deadpool & Wolverine',
    year: 2024,
    duration: '2h 8m',
    rating: 'R',
    score: 0,
    genre: ['Action', 'Comedy'],
    poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    synopsis: 'Deadpool and Wolverine team up for an adventure that will shake the Marvel universe to its core.',
    cast: [],
    status: 'coming_soon',
    featured: false
  },
  {
    title: 'Furiosa: A Mad Max Saga',
    year: 2024,
    duration: '2h 28m',
    rating: 'R',
    score: 0,
    genre: ['Action', 'Adventure'],
    poster: 'https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/iADOJ8Zymht2JPMoy3R7xceZprc.jpg',
    synopsis: 'The origin story of the mighty Furiosa before her encounter with Mad Max.',
    cast: [],
    status: 'coming_soon',
    featured: false
  },
  {
    title: 'Inside Out 2',
    year: 2024,
    duration: '1h 36m',
    rating: 'PG',
    score: 0,
    genre: ['Animation', 'Family'],
    poster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w1280/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    synopsis: 'A sequel that follows Riley as she enters puberty and encounters brand new emotions.',
    cast: [],
    status: 'coming_soon',
    featured: false
  }
];

const theaters = [
  { name: 'AMC Empire 25', screens: 8, location: 'New York' },
  { name: 'Regal Union Square', screens: 6, location: 'New York' },
  { name: 'Alamo Drafthouse Downtown', screens: 4, location: 'New York' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      tlsInsecure: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await Showtime.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert movies
    const insertedMovies = await Movie.insertMany(movies);
    console.log(`🎬 Inserted ${insertedMovies.length} movies`);

    // Insert theaters
    const insertedTheaters = await Theater.insertMany(theaters);
    console.log(`🏛️  Inserted ${insertedTheaters.length} theaters`);

    // Generate showtimes for the next 7 days for each now_showing movie at each theater
    const nowShowingMovies = insertedMovies.filter(m => m.status === 'now_showing');
    const showtimeTemplates = ['13:00', '16:00', '19:00', '21:30'];
    const showtimeDocs = [];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      date.setHours(0, 0, 0, 0);

      for (const movie of nowShowingMovies) {
        for (const theater of insertedTheaters) {
          // Pick 2-3 random showtimes per theater per day
          const count = 2 + Math.floor(Math.random() * 2);
          const selectedTimes = showtimeTemplates
            .sort(() => Math.random() - 0.5)
            .slice(0, count);

          for (const time of selectedTimes) {
            showtimeDocs.push({
              movie: movie._id,
              theater: theater._id,
              date,
              time,
              screen: 1 + Math.floor(Math.random() * theater.screens),
              price: 15 + Math.floor(Math.random() * 10),  // $15-$24
              bookedSeats: []
            });
          }
        }
      }
    }

    const insertedShowtimes = await Showtime.insertMany(showtimeDocs);
    console.log(`🕐 Inserted ${insertedShowtimes.length} showtimes`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
