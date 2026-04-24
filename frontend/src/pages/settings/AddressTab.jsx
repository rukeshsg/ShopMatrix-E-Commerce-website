import React, { useState } from 'react';
import api from '../../utils/api';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import { MapPin, Trash2 } from 'lucide-react';

const AddressTab = ({ user }) => {
  const { updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    street: '', city: '', state: '', postalCode: '', country: '', isDefault: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/users/addresses', formData);
      updateUser({ addresses: res.data.data.addresses });
      toast.success('Address added successfully');
      setShowAdd(false);
      setFormData({ street: '', city: '', state: '', postalCode: '', country: '', isDefault: false });
    } catch (error) {
      toast.error('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await api.delete(`/api/users/addresses/${id}`);
      updateUser({ addresses: res.data.data.addresses });
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const addresses = user?.addresses || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Saved Addresses</h2>
        <button className="btn-save" style={{ marginTop: 0, padding: '0.5rem 1rem' }} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ Add New Address'}
        </button>
      </div>

      {showAdd && (
        <form className="settings-form" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }} onSubmit={handleAddAddress}>
          <div className="form-group">
            <label>Street Address</label>
            <input type="text" name="street" value={formData.street} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Postal Code</label>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange} style={{ width: 'auto' }} />
            <label style={{ marginBottom: 0 }}>Set as default address</label>
          </div>
          <button type="submit" className="btn-save" disabled={loading}>Save Address</button>
        </form>
      )}

      {addresses.length === 0 && !showAdd ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          <MapPin size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3>No saved addresses</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {addresses.map(addr => (
            <div key={addr._id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', position: 'relative' }}>
              {addr.isDefault && <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary-color)', color: '#000', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>DEFAULT</span>}
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{user.name}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {addr.street}<br />
                {addr.city}, {addr.state} {addr.postalCode}<br />
                {addr.country}
              </p>
              <button 
                onClick={() => handleDeleteAddress(addr._id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', marginTop: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressTab;
