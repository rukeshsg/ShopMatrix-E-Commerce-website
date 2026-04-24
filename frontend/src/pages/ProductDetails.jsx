import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Skeleton from '../components/ui/Skeleton';
import { toast } from 'sonner';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState('');
  
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const data = res.data.data.product;
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to add items to your cart.');
      navigate(`/login?redirect=/product/${id}`);
      return;
    }
    addToCart(product, qty);
    navigate('/cart');
  };

  if (loading) return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <Skeleton height="400px" />
    </div>
  );

  if (error) return <div className="container" style={{ padding: '2rem 1rem', color: 'var(--danger-color)' }}>{error}</div>;
  if (!product) return <div className="container">Product not found</div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1rem', border: '1px solid var(--border-color)' }}>Go Back</Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        {/* Images Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <img 
            src={mainImage || 'https://via.placeholder.com/600'} 
            alt={product.name} 
            style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }} 
          />
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
            {product.images && product.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`${product.name} ${idx}`}
                onClick={() => setMainImage(img)}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover', 
                  borderRadius: 'var(--radius-sm)', 
                  cursor: 'pointer',
                  border: mainImage === img ? '2px solid var(--primary-color)' : '1px solid var(--border-color)'
                }} 
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{product.name}</h2>
          <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <span>{product.rating} ★</span> ({product.numReviews} reviews)
          </div>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>₹{product.price.toFixed(2)}</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
            {product.description}
          </p>
          
          <div style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <span>Status:</span>
              <span style={{ fontWeight: 'bold', color: product.countInStock > 0 ? 'var(--accent-color)' : 'var(--danger-color)' }}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span>Qty:</span>
                <select 
                  className="input" 
                  style={{ width: '100px' }} 
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>
            )}

            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={product.countInStock === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
