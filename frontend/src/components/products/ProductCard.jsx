import { Link } from 'react-router-dom';
import './ProductCard.css';

const getImageSrc = (images) => {
  if (!images || images.length === 0) return 'https://placehold.co/400x300/1a1a1a/d4af37?text=No+Image';
  const src = images[0];
  // Already an absolute URL (http/https)
  if (src.startsWith('http')) return src;
  // Local static file served by Vite from /public
  return src;
};

const ProductCard = ({ product }) => {
  const imgSrc = getImageSrc(product.images);
  return (
    <div className="product-card" style={{ 
      backgroundColor: 'var(--bg-elevated)', 
      borderRadius: 'var(--radius-lg)', 
      overflow: 'hidden', 
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Link to={`/product/${product._id}`} style={{ overflow: 'hidden', display: 'block', aspectRatio: '4/3' }}>
        <img 
          src={imgSrc}
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          className="product-img"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/1a1a1a/d4af37?text=No+Image'; }}
        />
      </Link>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: '1.4' }}>
            {product.name}
          </h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', marginTop: 'auto' }}>
          <span style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>★ {product.rating}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({product.numReviews})</span>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          ₹{product.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </div>
      </div>
      <style>{`
        .product-card:hover {
          box-shadow: var(--shadow-lg) !important;
          transform: translateY(-4px);
        }
        .product-card:hover .product-img {
          transform: scale(1.05) !important;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
