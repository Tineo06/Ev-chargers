import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">⚡</span>
        <span>EV Manage</span>
      </Link>

      <nav className="nav-links">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}

export default Header;