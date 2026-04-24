import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import api from '../../utils/api';

const ProfileTab = ({ user }) => {
  const { updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/api/users/profile', formData);
      updateUser(res.data.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="settings-section-title">Profile Information</h2>
      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" value={user?.email || ''} disabled />
          <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.5rem' }}>
            Email cannot be changed at this time.
          </small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <button type="submit" className="btn-save" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileTab;
