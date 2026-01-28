import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="navbar">
      <Link to="/" className="logo-container">
        <div className="logo-icon">⚡</div>
        <span className="logo-text">EV Manage</span>
      </Link>

      <nav className="nav-links">
        <Link to="/about">About</Link>
        <Link to="/support">Support</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;