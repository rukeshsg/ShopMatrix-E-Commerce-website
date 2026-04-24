import './Skeleton.css';

const Skeleton = ({ className, width, height, borderRadius }) => {
  return (
    <div 
      className={`skeleton ${className || ''}`}
      style={{ width, height, borderRadius: borderRadius || 'var(--radius-md)' }}
    ></div>
  );
};

export default Skeleton;
