import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Electronics',     image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800' },
  { name: 'Fashion',         image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800' },
  { name: 'Home & Garden',   image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=800' },
  { name: 'Sports/Fitness',  image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800' },
  { name: 'Beauty',          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800' },
  { name: 'Accessories',     image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800' },
  { name: 'Books/Comics',    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800' },
];

const Categories = () => {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center', fontWeight: '800' }}>Shop by Category</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {CATEGORIES.map((cat, idx) => (
          <Link to={`/?category=${encodeURIComponent(cat.name)}`} key={idx} style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'block', height: '250px', boxShadow: 'var(--shadow-md)' }}>
            <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} className="category-img" />
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: '700', letterSpacing: '1px' }}>{cat.name}</h2>
            </div>
          </Link>
        ))}
      </div>
      <style>{`
        .category-img:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default Categories;
