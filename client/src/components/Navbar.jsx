import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar glass-panel">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="gradient-text">CineBook</span>
        </Link>
        <div className="navbar-actions">
          <button className="icon-btn">
            <Search size={20} />
          </button>
          <button className="profile-btn">
            <User size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
