import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Categories from './pages/Categories';
import ProductDetails from './pages/ProductDetails';
import Settings from './pages/Settings';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import AdminProducts from './pages/admin/AdminProducts';

const NotFound = () => (
  <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>404</h1>
    <p style={{ color: 'var(--text-muted)' }}>The page you are looking for does not exist.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="page-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster theme="dark" position="bottom-right" richColors />
    </Router>
  );
}

export default App;
