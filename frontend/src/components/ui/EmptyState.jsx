import { Link } from 'react-router-dom';

const EmptyState = ({ message, icon: Icon, actionText = 'Go Back', actionLink = '/' }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '4rem 2rem',
      backgroundColor: 'var(--bg-elevated)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-color)',
      margin: '2rem auto',
      maxWidth: '600px',
      textAlign: 'center'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(37, 99, 235, 0.1)', 
        padding: '1.5rem', 
        borderRadius: '50%', 
        marginBottom: '1.5rem' 
      }}>
        {Icon && <Icon size={64} color="var(--primary-color)" />}
      </div>
      <h3 style={{ 
        fontSize: '1.5rem', 
        marginBottom: '0.5rem', 
        color: 'var(--text-primary)',
        fontWeight: '600'
      }}>
        {message}
      </h3>
      <p style={{ 
        color: 'var(--text-secondary)', 
        marginBottom: '2rem',
        maxWidth: '80%'
      }}>
        Looks like you haven't added anything here yet. Discover our latest products and start shopping!
      </p>
      {actionText && (
        <Link to={actionLink} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 'bold' }}>
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
