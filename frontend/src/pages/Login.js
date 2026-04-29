import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { authService } from '../services/api';
import './Auth.css';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(username, password);
      const { access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      setIsAuthenticated(true);
      toast.success('Login successful! Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <h1 className="gradient-text">Welcome Back</h1>
          <p>Sign in to your ScaleHub account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <motion.div
            className="form-group"
            whileFocus={{ scale: 1.02 }}
          >
            <label htmlFor="username">
              <FaEnvelope /> Username or Email
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.div
            className="form-group"
            whileFocus={{ scale: 1.02 }}
          >
            <label htmlFor="password">
              <FaLock /> Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.button
            type="submit"
            className="btn-primary btn-large"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Create one</Link></p>
        </div>
      </motion.div>

      <div className="auth-decoration">
        <motion.div
          className="decoration-circle decoration-1"
          animate={{
            x: [0, 30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className="decoration-circle decoration-2"
          animate={{
            x: [0, -30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
        ></motion.div>
      </div>
    </div>
  );
}

export default Login;
