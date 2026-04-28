const LogoSVG = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 2L44 13V35L24 46L4 35V13L24 2Z" fill="#FF5C00" opacity="0.12" />
    <path d="M24 2L44 13V35L24 46L4 35V13L24 2Z" stroke="#FF5C00" strokeWidth="1.5" fill="none" />
    <path d="M24 8L38 16V32L24 40L10 32V16L24 8Z" stroke="#FF5C00" strokeWidth="0.6" fill="none" opacity="0.4" />
    <text x="11" y="30" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="16" fill="#FF5C00">P</text>
    <text x="26" y="30" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="16" fill="white">B</text>
  </svg>
);

export default LogoSVG;