const LogoIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill="currentColor"/>
    <path d="M30 65C30 65 30 40 45 40C60 40 55 55 45 55C35 55 30 65 30 65Z" stroke="var(--bg-primary)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M45 55C45 55 70 55 70 40V65" stroke="var(--bg-primary)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="50" y="65" fontFamily="sans-serif" fontSize="40" fontWeight="900" fill="var(--bg-primary)" textAnchor="middle" dominantBaseline="middle">SM</text>
  </svg>
);

export default LogoIcon;
