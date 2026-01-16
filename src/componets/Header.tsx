import './Header.css';

const Header = () => {
  return (
    <header className="navbar">
      <div className="logo-container">
        <div className="logo-icon">⚡</div>
        <span className="logo-text">EV Manage</span>
      </div>

      <nav className="nav-links">
        <a href="#about">About</a>
        <a href="#support">Support</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
};

export default Header;