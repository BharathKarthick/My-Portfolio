import { useEffect, useState } from "react";
import LogoSVG from "../components/LogoSVG";

const Intro = ({ onDone }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => onDone(), 4200); 

    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone]);

  return (
    <div
      style={{
        height: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,92,0,0.12) 0%, transparent 70%)",
          transition: "opacity 1s ease",
          opacity: phase >= 1 ? 1 : 0,
        }}
      />

      <div
        style={{
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "scale(1)" : "scale(0.7)",
          marginBottom: 24,
        }}
      >
        <LogoSVG size={96} />
      </div>

      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "clamp(11px, 2.5vw, 14px)",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "6px",
          textTransform: "uppercase",
          transition: "all 0.7s 0.3s ease",
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(16px)",
        }}
      >
        P. Bharath — Portfolio
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          background: "#FF5C00",
          transition: "width 3.4s cubic-bezier(0.4, 0, 0.2, 1)",
          width: phase >= 1 ? "100%" : "0%",
        }}
      />
    </div>
  );
};

export default Intro;