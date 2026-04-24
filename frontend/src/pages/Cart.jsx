import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';
import { ShoppingBag, Trash2 } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, getTotals } = useCartStore();
  const totals = getTotals();

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <EmptyState 
          message="Your cart is completely empty." 
          icon={ShoppingBag}
          action={<Link to="/" className="btn btn-primary">Go Shopping</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1 className="page-title">Shopping Cart</h1>
      <div className="cart-grid">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.product} className="cart-item">
              <img 
                src={(item.images && item.images.length > 0) ? item.images[0] : 'https://via.placeholder.com/150?text=No+Image'} 
                alt={item.name} 
                className="cart-item-image"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'; }}
              />
              <div className="cart-item-info">
                <Link to={`/product/${item.product}`} className="cart-item-name">{item.name}</Link>
                <div className="cart-item-price">₹{item.price.toFixed(2)}</div>
              </div>
              <div className="cart-item-actions">
                <select 
                  className="input" 
                  value={item.qty} 
                  onChange={(e) => addToCart(item, Number(e.target.value))}
                >
                  {[...Array(item.countInStock || 10).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
                <button className="btn btn-icon" onClick={() => removeFromCart(item.product)}>
                  <Trash2 size={20} color="var(--danger-color)" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
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
            disabled={cartItems.length === 0} 
            onClick={checkoutHandler}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
