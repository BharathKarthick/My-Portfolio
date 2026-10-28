import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackArrow = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      aria-label="Go back"
      className="fixed bottom-15 left-5 z-40 flex items-center gap-1.5 px-4 py-2.5 bg-[#FF5C00]/10 border border-[#FF5C00]/40 rounded-lg text-[#FF5C00] font-semibold text-[13px] cursor-pointer transition-all duration-200 hover:bg-[#FF5C00] hover:text-white"
    >
      <ArrowLeft size={16} />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
};

export default BackArrow;