import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Job<span>Portal</span>
        </Link>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/jobs">Browse Jobs</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;