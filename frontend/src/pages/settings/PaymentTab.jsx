import React, { useState } from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const PaymentTab = () => {
  const [showAdd, setShowAdd] = useState(false);

  // Mock cards for UI demonstration
  const [cards, setCards] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true }
  ]);

  const handleAdd = (e) => {
    e.preventDefault();
    setCards([...cards, { id: Date.now(), type: 'Mastercard', last4: '8888', expiry: '10/28', isDefault: false }]);
    setShowAdd(false);
    toast.success('Card added successfully');
  };

  const handleRemove = (id) => {
    setCards(cards.filter(c => c.id !== id));
    toast.success('Card removed');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Payment Methods</h2>
        <button className="btn-save" style={{ marginTop: 0, padding: '0.5rem 1rem' }} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : '+ Add New Card'}
        </button>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Note: This is a secure mock UI. Real payments are processed securely via external providers during checkout.
      </p>

      {showAdd && (
        <form className="settings-form" style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)' }} onSubmit={handleAdd}>
          <div className="form-group">
            <label>Card Number</label>
            <input type="text" placeholder="**** **** **** ****" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiration Date</label>
              <input type="text" placeholder="MM/YY" required />
            </div>
            <div className="form-group">
              <label>CVC</label>
              <input type="text" placeholder="123" required />
            </div>
          </div>
          <div className="form-group">
            <label>Name on Card</label>
            <input type="text" placeholder="John Doe" required />
          </div>
          <button type="submit" className="btn-save">Save Card</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {cards.map(card => (
          <div key={card.id} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', background: 'var(--bg-secondary)', position: 'relative' }}>
            {card.isDefault && <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary-color)', color: '#000', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>DEFAULT</span>}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                <CreditCard size={32} color="var(--primary-color)" />
              </div>
              <div>
                <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{card.type}</h4>
                <div style={{ color: 'var(--text-secondary)', letterSpacing: '2px', fontFamily: 'monospace' }}>**** {card.last4}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>Expires {card.expiry}</span>
              <button onClick={() => handleRemove(card.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentTab;
