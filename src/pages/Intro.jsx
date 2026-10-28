import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import logoImg from "../assets/logo.png";

const Intro = ({ onDone }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);  // 3D Shield Scale-in & Neon Glow
    const t2 = setTimeout(() => setPhase(2), 1600); // Brand Name Reveal
    const t3 = setTimeout(() => setPhase(3), 3600); // Smooth Fade-out
    const t4 = setTimeout(() => onDone(), 4200);

    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      style={{
        height: "100vh",
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: phase === 3 ? 0 : 1,
        pointerEvents: phase === 3 ? "none" : "auto",
      }}
      className="px-4"
    >
      {/* Background Radial Glow Pulse */}
      <div
        style={{
          position: "absolute",
          width: "min(550px, 90vw)",
          height: "min(550px, 90vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,92,0,0.22) 0%, rgba(255,92,0,0.04) 50%, transparent 70%)",
          transition: "all 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: phase >= 1 ? "scale(1.15)" : "scale(0.5)",
          opacity: phase >= 1 ? 1 : 0,
          pointerEvents: "none",
        }}
      />

      {/* 3D Shield Badge Container with Perfect Mobile Centering */}
      <div
        style={{
          position: "relative",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "scale(1) translateY(0)" : "scale(0.7) translateY(20px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Luxury Shield Frame */}
        <div
          style={{
            position: "relative",
            width: "clamp(130px, 28vw, 190px)",
            height: "clamp(160px, 34vw, 230px)",
            background: "linear-gradient(145deg, #0e1217, #050608)",
            border: "1.5px solid rgba(255, 92, 0, 0.55)",
            boxShadow:
              "0 0 45px rgba(255,92,0,0.38), inset 0 0 25px rgba(255,92,0,0.15), 0 20px 50px rgba(0,0,0,0.9)",
            borderRadius: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(14px)",
            overflow: "hidden",
          }}
        >
          {/* Exact 3D Metallic Monogram Logo */}
          <div
            style={{
              width: "72%",
              height: "72%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logoImg}
              alt="P. Bharath Monogram"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "clamp(11px, 2.5vw, 13px)",
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginTop: "30px",
          transition: "all 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(15px)",
          textAlign: "center",
        }}
      >
        Welcome To My <span style={{ color: "#FF5C00", fontWeight: 700 }}>Portfolio</span>
      </div>

      {/* Bottom Progress Accent Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          background: "linear-gradient(90deg, #FF5C00, #FFA726, #FFFFFF)",
          boxShadow: "0 0 12px rgba(255,92,0,0.8)",
          transition: "width 3.2s cubic-bezier(0.4, 0, 0.2, 1)",
          width: phase >= 1 ? "100%" : "0%",
        }}
      />
    </div>
  );
};

Intro.propTypes = {
  onDone: PropTypes.func.isRequired,
};

export default Intro;