import React from 'react';
import { motion } from 'framer-motion';
import './ContainerCard.css';

function ContainerCard({ containerId, onClick }) {
  const containerNum = containerId.slice(-1);
  const colors = ['#00d4ff', '#ff006e', '#ffbe0b', '#00d084', '#ffa502'];
  const color = colors[parseInt(containerNum) % colors.length];

  return (
    <motion.div
      className="container-card"
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="container-header">
        <div className="container-indicator" style={{ boxShadow: `0 0 20px ${color}` }}>
          <div className="indicator-dot" style={{ backgroundColor: color }}></div>
        </div>
        <span className="container-status">Active</span>
      </div>

      <div className="container-info">
        <p className="label">Container ID</p>
        <p className="container-id-text">{containerId}</p>
      </div>

      <div className="container-footer">
        <span className="label">Last Connected</span>
        <span className="time-text">Just now</span>
      </div>
    </motion.div>
  );
}

export default ContainerCard;
