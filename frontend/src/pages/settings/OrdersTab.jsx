import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Package, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my');
        setOrders(res.data.data.orders);
      } catch (error) {
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2 className="settings-section-title">Order History</h2>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          <Package size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3>No orders yet</h3>
          <p>When you place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <div key={order._id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', background: 'var(--bg-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Order ID</span>
                  <div style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>#{order._id.substring(0, 10)}...</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Date</span>
                  <div style={{ color: 'var(--text-primary)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total</span>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>₹{order.totalPrice}</div>
                </div>
                <div>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: order.status === 'Delivered' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                    color: order.status === 'Delivered' ? '#22c55e' : '#eab308'
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {order.orderItems.map(item => (
                  <div key={item.product} style={{ minWidth: '60px', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
