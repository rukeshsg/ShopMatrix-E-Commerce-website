import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { toast } from 'sonner';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) navigate(redirect);
  }, [isAuthenticated, navigate, redirect]);

  const sendOtpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp: otpCode });
      toast.success('Registration successful!');
      await login(email, password);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      {/* Left Form Section */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              {otpSent ? 'Verify Email' : 'Join ShopMatrix'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1rem' }}>
              {otpSent ? `Enter the 6-digit OTP sent to ${email}` : 'Create your premium account today'}
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={sendOtpHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
                <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
                <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@example.com" style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Create a strong password" style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }} disabled={loading}>
                {loading ? 'Sending OTP...' : 'Register'}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtpHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>6-Digit OTP</label>
                <input 
                  type="text" 
                  className="input" 
                  value={otpCode} 
                  onChange={(e) => setOtpCode(e.target.value)} 
                  required 
                  placeholder="000000" 
                  maxLength={6}
                  style={{ textAlign: 'center', fontSize: '2.5rem', letterSpacing: '0.75rem', padding: '1.5rem', fontWeight: '700', backgroundColor: 'var(--bg-primary)' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <button type="button" onClick={() => setOtpSent(false)} style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '1rem', textDecoration: 'underline' }}>
                Back to registration
              </button>
            </form>
          )}

          <div style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div style={{ 
        flex: 1, 
        display: 'none', 
        '@media (minWidth: 768px)': { display: 'block' },
        backgroundImage: 'url("https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }} className="split-image-container">
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', right: '10%', color: 'white', textAlign: 'right' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.2' }}>Elevate Your<br/>Lifestyle.</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Join an exclusive community of discerning shoppers.</p>
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

export default Register;
