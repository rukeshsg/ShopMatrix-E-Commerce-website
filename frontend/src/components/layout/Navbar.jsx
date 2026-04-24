import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Sun, Moon, Menu, Search, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { logout, isAuthenticated, user } = useAuthStore();
  const cartItems = useCartStore((state) => state.cartItems);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Read initial keyword from URL if already on products page
  const queryParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState(queryParams.get('keyword') || '');

  // Sync search box if user navigates away and comes back
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('keyword') || '');
  }, [location.search]);

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/?keyword=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    navigate('/');
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="/logo-clean.svg"
              alt="ShopMatrix"
              className="navbar-logo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </Link>
        </div>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch} role="search">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            {searchQuery && (
              <button type="button" className="search-clear-btn" onClick={clearSearch} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>
        </form>

        {/* Nav links + Actions */}
        <div className="navbar-right">
          <nav className="navbar-links">
            <Link to="/" className="nav-link">Products</Link>
            <Link to="/categories" className="nav-link">Categories</Link>
            {user?.role === 'admin' && <Link to="/admin/products" className="nav-link">Admin</Link>}
          </nav>

          <div className="navbar-actions">
            <button className="nav-icon-link" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/cart" className="nav-icon-link">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
            </Link>
            {isAuthenticated ? (
              <Link to="/settings" className="nav-icon-link">
                <User size={20} />
              </Link>
            ) : (
              <Link to="/login" className="nav-icon-link">
                <User size={20} />
              </Link>
            )}
            <button className="mobile-menu-btn">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
