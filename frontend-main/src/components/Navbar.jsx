import { Link, useLocation } from "react-router-dom";
import logo from "../assets/github-mark-white.svg";
import "./navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="GitHub Logo" className="navbar-logo" />
          <span className="navbar-title">ApnaGit</span>
        </Link>
        <nav className="navbar-links">
          <Link 
            to="/create" 
            className={`navbar-link ${location.pathname === "/create" ? "active" : ""}`}
          >
            Create Repository
          </Link>
          <Link 
            to="/profile" 
            className={`navbar-link ${location.pathname === "/profile" ? "active" : ""}`}
          >
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
