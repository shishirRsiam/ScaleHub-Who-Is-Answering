import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaEdit, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { userService } from '../services/api';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userService.getProfile();
      setUser(response.data.user);
      setFormData(response.data.user);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        avatar: formData.avatar || '',
        bio: formData.bio || '',
      };
      
      await userService.updateProfile(updateData);
      setUser(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="container profile-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container profile-page">
      <motion.div
        className="profile-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </motion.div>

      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="profile-avatar">
          <div className="avatar-circle">
            {formData.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
          </div>
        </div>

        <div className="profile-content">
          {!isEditing ? (
            <div className="profile-info">
              <div className="info-group">
                <label>Username</label>
                <p><FaUser /> {user?.username}</p>
              </div>

              <div className="info-group">
                <label>Email</label>
                <p><FaEnvelope /> {user?.email}</p>
              </div>

              <div className="info-group">
                <label>Full Name</label>
                <p>{`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Not set'}</p>
              </div>

              <div className="info-group">
                <label>Bio</label>
                <p>{user?.profile?.bio || 'No bio added'}</p>
              </div>

              <motion.button
                className="btn-edit"
                onClick={() => setIsEditing(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit /> Edit Profile
              </motion.button>
            </div>
          ) : (
            <div className="profile-edit">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows="4"
                ></textarea>
              </div>

              <div className="button-group">
                <motion.button
                  className="btn-save"
                  onClick={handleSave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave /> Save Changes
                </motion.button>

                <motion.button
                  className="btn-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="profile-stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="stat">
          <span className="stat-value">Premium</span>
          <span className="stat-label">Account Status</span>
        </div>
        <div className="stat">
          <span className="stat-value">Active</span>
          <span className="stat-label">Membership</span>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
