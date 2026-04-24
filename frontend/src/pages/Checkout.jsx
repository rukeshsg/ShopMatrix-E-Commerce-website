import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { toast } from 'sonner';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, saveShippingAddress, getTotals, clearCartItems } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const totals = getTotals();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate]);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!address || !city || !postalCode || !country) {
      toast.error('Please fill in all shipping fields');
      return;
    }

    saveShippingAddress({ address, city, postalCode, country });

    setLoading(true);
    try {
      const res = await api.post('/orders', {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Credit Card', // Hardcoded for internship demo
      });

      toast.success('Order placed successfully!');
      clearCartItems();
      await api.delete('/cart/clear'); // clear backend cart
      
      // Navigate to order tracking page
      navigate(`/order/${res.data.data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container checkout-page">
      <div className="checkout-grid">
        <div className="checkout-form-section">
          <h2>Shipping Information</h2>
          <form onSubmit={placeOrderHandler} className="checkout-form">
            <div className="form-group">
              <label>Address</label>
              <input type="text" className="input" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input type="text" className="input" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input type="text" className="input" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" className="input" value={country} onChange={(e) => setCountry(e.target.value)} required />
            </div>
            
            <h2 className="mt-4">Payment Method</h2>
            <div className="form-group">
              <select className="input" disabled>
                <option>Credit Card (Simulated)</option>
              </select>
              <small style={{ color: 'var(--text-muted)' }}>Payment is simulated for this environment.</small>
            </div>
          </form>
        </div>

        <div className="checkout-summary-section">
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {cartItems.map((item, index) => (
                <div key={index} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="ci-info">
                    <span className="ci-name">{item.name}</span>
                    <span className="ci-qty">Qty: {item.qty}</span>
                  </div>
                  <div className="ci-price">₹{(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <hr className="summary-divider" />
            <div className="summary-row">
              <span>Items:</span>
              <span>₹{totals.itemsPrice}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>₹{totals.shippingPrice}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>₹{totals.taxPrice}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>₹{totals.totalPrice}</span>
            </div>
            <button 
              className="btn btn-primary w-100 mt-4" 
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
