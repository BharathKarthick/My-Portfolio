import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackArrow = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} aria-label="Go back" style={{
      position: 'fixed', bottom: 28, left: 20, zIndex: 50,
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '10px 16px',
      background: 'rgba(255,92,0,0.1)', border: '1px solid rgba(255,92,0,0.4)',
      borderRadius: 8, color: '#FF5C00',
      fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 13,
      cursor: 'pointer', transition: 'all 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = '#FF5C00'; e.currentTarget.style.color = 'white'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,92,0,0.1)'; e.currentTarget.style.color = '#FF5C00'; }}>
      <ArrowLeft size={16} />
      <span className="hide-mobile">Back</span>
    </button>
  );
};

export default BackArrow;