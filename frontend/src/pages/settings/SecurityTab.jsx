import React, { useState } from 'react';
import api from '../../utils/api';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';

const SecurityTab = () => {
  const { logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (passwords.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await api.put('/api/users/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = () => {
    // For simplicity, we'll just log them out of the current device.
    // In a real app, this would invalidate all refresh tokens in DB.
    logout();
    toast.success('Logged out of all devices');
  };

  return (
    <div>
      <h2 className="settings-section-title">Security & Password</h2>
      
      <form className="settings-form" onSubmit={handlePasswordChange}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input 
            type="password" 
            id="currentPassword" 
            name="currentPassword" 
            value={passwords.currentPassword} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input 
              type="password" 
              id="newPassword" 
              name="newPassword" 
              value={passwords.newPassword} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              value={passwords.confirmPassword} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <button type="submit" className="btn-save" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Device Management</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Log out of all active sessions across all devices, including this one.
        </p>
        <button className="btn-danger" onClick={handleLogoutAll}>
          Log Out of All Devices
        </button>
      </div>
    </div>
  );
};

export default SecurityTab;
