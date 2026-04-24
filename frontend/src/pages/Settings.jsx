import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import {
  User, Shield, Package, MapPin, Heart, Bell, CreditCard, LogOut, AlertTriangle
} from 'lucide-react';

import ProfileTab from './settings/ProfileTab';
import SecurityTab from './settings/SecurityTab';
import OrdersTab from './settings/OrdersTab';
import AddressTab from './settings/AddressTab';
import WishlistTab from './settings/WishlistTab';
import NotificationTab from './settings/NotificationTab';
import PaymentTab from './settings/PaymentTab';
import AccountActionsTab from './settings/AccountActionsTab';

import './Settings.css';

const Settings = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'orders', label: 'Order History', icon: <Package size={18} /> },
    { id: 'address', label: 'Addresses', icon: <MapPin size={18} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard size={18} /> },
    { id: 'actions', label: 'Account Actions', icon: <AlertTriangle size={18} />, isDanger: true },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab user={user} />;
      case 'security': return <SecurityTab />;
      case 'orders': return <OrdersTab />;
      case 'address': return <AddressTab user={user} />;
      case 'wishlist': return <WishlistTab />;
      case 'notifications': return <NotificationTab />;
      case 'payment': return <PaymentTab />;
      case 'actions': return <AccountActionsTab />;
      default: return <ProfileTab user={user} />;
    }
  };

  return (
    <div className="settings-page container">
      <div className="settings-header">
        <h1>Account Settings</h1>
        <p>Manage your account preferences, orders, and details.</p>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <div className="user-brief">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          
          <nav className="settings-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`settings-nav-btn ${activeTab === tab.id ? 'active' : ''} ${tab.isDanger ? 'danger' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="settings-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Settings;
