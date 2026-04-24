import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package, AlertCircle, BarChart3, TrendingUp, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    brand: '',
    countInStock: '',
    description: '',
    images: ['']
  });

  const CATEGORIES = ['Electronics', 'Fashion', 'Home & Garden', 'Sports/Fitness', 'Beauty', 'Accessories', 'Books/Comics'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/products?pageSize=100');
      setProducts(data.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      toast.success('Product removed');
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      brand: product.brand,
      countInStock: product.countInStock,
      description: product.description,
      images: product.images && product.images.length > 0 ? product.images : ['']
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category: CATEGORIES[0],
      brand: '',
      countInStock: '',
      description: '',
      images: ['']
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving product...');
    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, formData);
        toast.dismiss(loadingToast);
        toast.success('Product updated');
      } else {
        await api.post('/api/products', formData);
        toast.dismiss(loadingToast);
        toast.success('New product created');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Save failed');
    }
  };

  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.countInStock < 10).length,
    totalValue: products.reduce((acc, p) => acc + (p.price * p.countInStock), 0)
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-title">
          <Package className="admin-icon" />
          <h1>Admin Dashboard</h1>
        </div>
        <button className="btn-primary add-btn" onClick={handleAddNew}>
          <Plus size={18} />
          Add Product
        </button>
      </header>

      <section className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon"><Inbox size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Total Inventory</span>
            <span className="stat-value">{stats.total} Products</span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"><AlertCircle size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Low Stock Alerts</span>
            <span className="stat-value">{stats.lowStock} Items</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon"><BarChart3 size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Stock Value</span>
            <span className="stat-value">₹{stats.totalValue.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <div className="admin-controls">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, brand or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="loading-state">
             <div className="spinner"></div>
             <p>Syncing product catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={40} />
            <p>No products found in the database.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Information</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="product-info-cell">
                      <div className="img-container">
                        <img src={product.images?.[0]} alt="" className="table-img" />
                      </div>
                      <div className="text-container">
                        <div className="product-name">{product.name}</div>
                        <div className="product-brand">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="category-tag">{product.category}</span></td>
                  <td><span className="price-tag">₹{product.price.toLocaleString()}</span></td>
                  <td>
                    <div className="stock-level-container">
                      <span className={`stock-status ${product.countInStock < 10 ? 'low-stock' : ''}`}>
                        {product.countInStock}
                      </span>
                      <div className="stock-bar">
                        <div 
                          className="stock-progress" 
                          style={{ width: `${Math.min(product.countInStock, 100)}%`, background: product.countInStock < 10 ? '#ff4d4d' : 'var(--primary-color)' }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => handleEdit(product)} title="Edit">
                        <Edit2 size={15} />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(product._id)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
               <h2>{editingProduct ? 'Edit Inventory Item' : 'New Inventory Item'}</h2>
               <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input required type="text" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Initial Stock</label>
                  <input required type="number" value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Image Reference</label>
                  <input required type="text" value={formData.images[0]} onChange={(e) => setFormData({...formData, images: [e.target.value]})} />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Product Description</label>
                <textarea required rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Discard</button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
