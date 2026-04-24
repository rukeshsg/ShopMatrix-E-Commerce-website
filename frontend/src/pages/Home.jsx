import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { PackageSearch } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword') || '';
  const categoryFilter = queryParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query string — pass keyword directly to backend (case-insensitive regex already there)
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);

        const res = await api.get(`/api/products?${params.toString()}`);
        let data = res.data.data.products;

        // Client-side category filter (category isn't in backend search yet)
        if (categoryFilter) {
          data = data.filter(p =>
            p.category?.toLowerCase() === categoryFilter.toLowerCase()
          );
        }

        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, categoryFilter]);

  // Page title changes based on search
  const pageTitle = keyword
    ? `Search results for "${keyword}"`
    : categoryFilter
    ? `Category: ${categoryFilter}`
    : 'Latest Products';

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>{pageTitle}</h1>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i}>
              <Skeleton height="200px" />
              <div style={{ padding: '1rem' }}>
                <Skeleton height="20px" width="80%" className="mt-4" />
                <Skeleton height="15px" width="50%" style={{ marginTop: '0.5rem' }} />
                <Skeleton height="25px" width="40%" style={{ marginTop: '1rem' }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{ color: 'var(--danger-color)', padding: '1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          message={keyword ? `No products found for "${keyword}". Try a different search.` : 'No products found.'}
          icon={PackageSearch}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
