import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen bg-black flex items-center justify-center overflow-hidden">
      <h1
        className="text-red-600 text-2xl sm:text-3xl md:text-6xl font-mono border-r-4 border-red-600 whitespace-nowrap overflow-hidden"
        style={{
          width: "0",
          animation:
            "typing 4s steps(30, end) forwards, blink 0.75s step-end infinite, flicker 3s infinite",
        }}
      >
        Welcome to My Portfolio
      </h1>

      <style>
        {`
          @keyframes typing {
            from { width: 0 }
            to { width: 24ch }
          }
          @keyframes blink {
            50% { border-color: transparent }
          }
          @keyframes flicker {
            0%, 100% { opacity: 1 }
            10% { opacity: 0.8 }
            30% { opacity: 0.6 }
            50% { opacity: 0.7 }
            70% { opacity: 0.9 }
            90% { opacity: 0.95 }
          }
        `}
      </style>
    </div>
  );
};

export default Intro;
