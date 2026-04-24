import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

const WishlistTab = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore(state => state.addToCart);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/api/users/wishlist');
      setWishlist(res.data.data.wishlist);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.post('/api/users/wishlist', { productId });
      setWishlist(wishlist.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    handleRemove(product._id);
  };

  if (loading) return <div>Loading wishlist...</div>;

  return (
    <div>
      <h2 className="settings-section-title">Your Wishlist</h2>
      
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          <Heart size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3>Wishlist is empty</h3>
          <p>Save items you like here to buy them later.</p>
          <Link to="/" className="btn-save" style={{ display: 'inline-block', textDecoration: 'none', marginTop: '1rem' }}>Browse Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {wishlist.map(product => (
            <div key={product._id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '1', width: '100%' }}>
                <img src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/200'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Link to={`/product/${product._id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.name}
                </Link>
                <div style={{ fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                  ₹{product.price}
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleMoveToCart(product)} style={{ flex: 1, padding: '0.5rem', background: 'var(--primary-color)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }} title="Move to Cart">
                    <ShoppingCart size={16} />
                  </button>
                  <button onClick={() => handleRemove(product._id)} style={{ padding: '0.5rem', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }} title="Remove">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
