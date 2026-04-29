import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaServer, FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { testService, userService } from '../services/api';
import ContainerCard from '../components/ContainerCard';
import './Dashboard.css';

function Dashboard() {
  const [containerHistory, setContainerHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentContainer, setCurrentContainer] = useState(null);
  const [stats, setStats] = useState({ total_requests: 0, unique_containers: 0 });

  useEffect(() => {
    loadSessionData();
  }, []);

  const loadSessionData = async () => {
    try {
      const response = await userService.getSessions();
      const sessions = response.data.sessions || [];
      
      const uniqueContainers = [...new Set(sessions.map(s => s.container_id))];
      setContainerHistory(uniqueContainers.slice(0, 5));
      setStats({
        total_requests: sessions.length,
        unique_containers: uniqueContainers.length
      });
    } catch (error) {
      console.log('First load, no sessions yet');
    }
  };

  const handleScaleTest = async () => {
    setLoading(true);
    try {
      const response = await testService.scaleTest();
      const containerId = response.data.container_id;
      
      setCurrentContainer(containerId);
      
      // Add to history if new
      if (!containerHistory.includes(containerId)) {
        setContainerHistory(prev => [containerId, ...prev].slice(0, 5));
      }
      
      setStats(prev => ({
        ...prev,
        total_requests: prev.total_requests + 1,
        unique_containers: new Set([...containerHistory, containerId]).size
      }));
      
      toast.success(`Connected to container: ${containerId.slice(-12)}`);
    } catch (error) {
      toast.error('Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Docker Scaling <span className="gradient-text">Dashboard</span>
          </motion.h1>
          <p>See how your requests are distributed across multiple containers</p>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        className="stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="stat-card">
          <div className="stat-icon">
            <FaRocket />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Requests</p>
            <p className="stat-value">{stats.total_requests}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaServer />
          </div>
          <div className="stat-content">
            <p className="stat-label">Unique Containers</p>
            <p className="stat-value">{stats.unique_containers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaSync />
          </div>
          <div className="stat-content">
            <p className="stat-label">Load Balancing</p>
            <p className="stat-value">Active</p>
          </div>
        </div>
      </motion.div>

      {/* Test Button */}
      <motion.div
        className="test-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          className="btn-test"
          onClick={handleScaleTest}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Connecting...' : 'Test Scale Connection'}
        </motion.button>
        {currentContainer && (
          <motion.div
            className="current-container-display"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>Connected to:</p>
            <p className="container-id-large">{currentContainer.slice(-12)}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Container History */}
      {containerHistory.length > 0 && (
        <motion.div
          className="containers-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>Container History</h2>
          <div className="containers-grid">
            {containerHistory.map((containerId, i) => (
              <motion.div
                key={containerId}
                custom={i}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <ContainerCard
                  containerId={containerId}
                  onClick={() => setCurrentContainer(containerId)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Info Section */}
      <motion.div
        className="info-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="info-card">
          <h3>How it works?</h3>
          <ul>
            <li>Each request is routed to a different container using Nginx load balancing</li>
            <li>Click "Test Scale Connection" button to send a request</li>
            <li>Watch the Container ID change as requests are distributed</li>
            <li>Your session history is tracked in the Sessions page</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>Why Docker Scaling?</h3>
          <ul>
            <li>Horizontal scaling for handling increased traffic</li>
            <li>Better resource utilization across multiple containers</li>
            <li>Load balancing ensures even distribution</li>
            <li>Fault tolerance through container redundancy</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;
