import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackArrow = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed bottom-9 left-2 md:bottom-4 md:left-4 text-white bg-[#ff4500]  hover:text-[#ff4500] hover:bg-white p-2 md:p-2 rounded-full shadow-md z-50"
      aria-label="Go back"
    >
      <ArrowLeft size={24} />
    </button>
  );
};

export default BackArrow;
