import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      {/* Left Image Section */}
      <div style={{ 
        flex: 1, 
        display: 'none', 
        '@media (minWidth: 768px)': { display: 'block' },
        backgroundImage: 'url("https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }} className="split-image-container">
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%', color: 'white' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.2' }}>Experience<br/>Luxury Shopping.</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Discover the finest electronics, fashion, and lifestyle products curated just for you.</p>
        </div>
      </div>

      {/* Right Form Section */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '420px', 
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1rem' }}>Sign in to continue to ShopMatrix</p>
          </div>
          
          <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <input 
                type="email" 
                className="input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="name@example.com"
                style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '500' }}>Forgot?</span>
              </div>
              <input 
                type="password" 
                className="input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
                style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }} disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            New to ShopMatrix? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Create an account</Link>
          </div>

          <div style={{ marginTop: '2rem', position: 'relative', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid var(--border-color)', zIndex: 1 }}></div>
            <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.8rem', position: 'relative', zIndex: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>Or</span>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link to="/" className="btn" style={{ width: '100%', padding: '1rem', fontSize: '0.95rem', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: '500', backgroundColor: 'var(--bg-primary)' }}>
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .split-image-container {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .split-image-container {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
