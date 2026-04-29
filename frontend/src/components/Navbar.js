import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './Navbar.css';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar blur-bg">
      <div className="container nav-container">
        <motion.div
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="logo-text">
            <span className="logo-icon">⚡</span>
            <span className="gradient-text">ScaleHub</span>
          </Link>
        </motion.div>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Link to="/sessions" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Sessions
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link to="/profile" className="nav-link nav-profile" onClick={() => setIsMenuOpen(false)}>
                  <FaUser /> Profile
                </Link>
              </motion.div>
              <motion.button
                className="btn-logout"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt /> Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-link nav-register" onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
