import React, { useState } from 'react';
import { toast } from 'sonner';

const NotificationTab = () => {
  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    smsAlerts: false
  });

  const handleToggle = (key) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const handleSave = () => {
    // Mock save
    toast.success('Notification preferences updated');
  };

  return (
    <div>
      <h2 className="settings-section-title">Notification Preferences</h2>
      
      <div className="settings-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div>
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Order Updates</h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Receive emails about your order status and shipping.</p>
          </div>
          <input type="checkbox" checked={preferences.orderUpdates} onChange={() => handleToggle('orderUpdates')} style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div>
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Promotions & Offers</h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Get notified about exclusive sales and new collections.</p>
          </div>
          <input type="checkbox" checked={preferences.promotions} onChange={() => handleToggle('promotions')} style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div>
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>SMS Alerts</h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Receive text messages for delivery notifications.</p>
          </div>
          <input type="checkbox" checked={preferences.smsAlerts} onChange={() => handleToggle('smsAlerts')} style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)' }} />
        </div>

        <button className="btn-save" onClick={handleSave} style={{ alignSelf: 'flex-start' }}>
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationTab;
