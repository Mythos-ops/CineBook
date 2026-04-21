import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, ChevronRight, ChevronLeft } from 'lucide-react';
import { api } from '../data/api';
import './Home.css';

const Home = () => {
  const containerRef = useRef(null);
  const nowShowingRef = useRef(null);

  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [featured, nowMovies, soonMovies] = await Promise.all([
          api.getFeaturedMovie(),
          api.getMovies('now_showing'),
          api.getMovies('coming_soon')
        ]);
        setFeaturedMovie(featured);
        setNowShowing(nowMovies);
        setComingSoon(soonMovies);
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const heroRadius = useTransform(scrollYProgress, [0, 1], ["0px", "40px"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  const scrollNav = (ref, dir) => {
    if (ref.current) {
      const amount = dir === 'left' ? -400 : 400;
      ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="home-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!featuredMovie) return null;

  return (
    <div className="home-page">
      <div className="scroll-tracker" ref={containerRef}>
        <motion.section 
          className="sticky-hero"
          style={{ scale: heroScale, borderRadius: heroRadius }}
        >
          <div 
            className="hero-bg" 
            style={{ 
              backgroundImage: `url('${featuredMovie.backdrop}')`,
              backgroundColor: '#111'
            }}
          >
            <div className="hero-overlay-cinematic"></div>
          </div>
          
          <motion.div 
            className="container hero-content"
            style={{ opacity: contentOpacity, y: contentY }}
          >
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <div className="hero-meta">
              <span className="badge">{featuredMovie.rating}</span>
              <span>{featuredMovie.year}</span>
              <span>•</span>
              <span>{featuredMovie.genre.join(', ')}</span>
              <span>•</span>
              <span>{featuredMovie.duration}</span>
            </div>
            <p className="hero-description">{featuredMovie.synopsis}</p>
            
            <div className="hero-actions">
              <Link to={`/movie/${featuredMovie._id}`} className="btn-primary">
                Book Tickets
              </Link>
              <button className="btn-play">
                <span className="play-icon-wrapper glass-panel">
                  <Play size={20} fill="#fff" />
                </span>
                Watch Trailer
              </button>
            </div>
          </motion.div>
        </motion.section>
      </div>

      <div className="content-layers">
        {/* Now Showing */}
        <section className="movie-rail container relative-rail">
          <div className="rail-header">
            <h2 className="section-title">Now Showing</h2>
            <div className="nav-arrows">
              <button className="icon-btn arrow" onClick={() => scrollNav(nowShowingRef, 'left')}><ChevronLeft size={24}/></button>
              <button className="icon-btn arrow" onClick={() => scrollNav(nowShowingRef, 'right')}><ChevronRight size={24}/></button>
            </div>
          </div>
          
          <div className="scroll-rail hide-scrollbar smooth-scroll" ref={nowShowingRef}>
            {nowShowing.map((movie, idx) => (
              <motion.div 
                key={movie._id}
                className="rail-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: (idx % 4) * 0.1 }}
              >
                <Link to={`/movie/${movie._id}`} className="movie-card premium-card">
                  <div className="card-img-wrapper">
                    <img src={movie.poster} alt={movie.title} loading="lazy" />
                    <div className="rating-badge">⭐ {movie.score}</div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{movie.title}</h3>
                    <div className="card-tags">
                      {movie.genre.slice(0,2).map(g => <span key={g} className="tag">{g}</span>)}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Coming Soon */}
        <section className="movie-rail container upcoming-rail">
          <h2 className="section-title">Coming Soon</h2>
          <div className="scroll-rail hide-scrollbar">
            {comingSoon.map((movie, idx) => (
              <motion.div 
                key={movie._id}
                className="rail-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (idx % 4) * 0.1 }}
              >
                <div className="movie-card upcoming-card">
                  <div className="card-img-wrapper">
                    <img src={movie.poster} alt={movie.title} loading="lazy" />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{movie.title}</h3>
                    <button className="btn-ghost notify-btn">Notify Me</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
