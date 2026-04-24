const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border-color)', padding: '2rem 0', marginTop: 'auto' }}>
      <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} ShopMatrix. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
