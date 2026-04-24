import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogOut, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AccountActionsTab = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!password) return toast.error('Please enter your password to confirm');
    
    setLoading(true);
    try {
      await api.delete('/users/account', { data: { password } });
      toast.success('Your account has been deleted.');
      logout();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="settings-section-title" style={{ color: '#ef4444', borderBottomColor: 'rgba(239, 68, 68, 0.2)' }}>
        Account Actions
      </h2>
      
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Logout</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Securely log out of your ShopMatrix account on this device.
        </p>
        <button 
          onClick={handleLogout}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            background: 'var(--bg-secondary)', color: 'var(--text-primary)', 
            border: '1px solid var(--border-color)', padding: '0.75rem 1.5rem', 
            borderRadius: '6px', fontWeight: 600, cursor: 'pointer' 
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#ef4444' }}>
          <AlertTriangle size={24} />
          <h3 style={{ margin: 0 }}>Delete Account</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Permanently delete your ShopMatrix account and all associated data. This action is <strong>irreversible</strong>. 
          You will lose access to your order history, saved addresses, and wishlist.
        </p>
        
        {!showDeleteConfirm ? (
          <button 
            className="btn-danger" 
            onClick={() => setShowDeleteConfirm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Trash2 size={18} /> Delete My Account
          </button>
        ) : (
          <form onSubmit={handleDeleteAccount} style={{ background: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ef4444' }}>
            <p style={{ fontWeight: 600, color: '#ef4444', marginBottom: '1rem' }}>Confirm Account Deletion</p>
            <div className="form-group">
              <label>Enter your password to verify</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn-danger" disabled={loading}>
                {loading ? 'Deleting...' : 'Permanently Delete'}
              </button>
              <button type="button" onClick={() => setShowDeleteConfirm(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccountActionsTab;
