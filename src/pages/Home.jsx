import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import LogoSVG from "../components/LogoSVG";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Code2, Palette } from "lucide-react";

const jobTitles = ["UI/UX Designer", "Web Developer", "Front-End Engineer"];

function OrangeCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const particles = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 2 + 0.5, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, alpha: Math.random() * 0.6 + 0.1 });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) { ctx.beginPath(); ctx.strokeStyle = `rgba(255,92,0,${(1 - dist / 100) * 0.12})`; ctx.lineWidth = 0.8; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); }
        }
      }
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,92,0,${p.alpha})`; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

function Home() {
  const [titleIndex, setTitleIndex] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTitleIndex(p => (p + 1) % jobTitles.length), 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    /*
      DESKTOP (>1024px):  height:100vh, overflow:hidden, 2-col grid side by side
      TABLET (≤1024px):   height:auto, overflow:auto, 1-col grid — text first, anim below
      MOBILE (≤600px):    same as tablet but animation is shorter (260px via CSS)
      The .home-page, .home-grid, .home-anim-col classes are all controlled by index.css
    */
    <div className="home-page" style={{ height: '100vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
      <div className="dot-grid" />
      <div style={{ position: 'fixed', top: -100, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,92,0,0.1) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      <Navbar />

      <div className="home-grid" style={{
        position: 'relative', zIndex: 1,
        /* DESKTOP default values — overridden by CSS on smaller screens */
        height: 'calc(100vh - 64px)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px', gap: 40,
      }}>

        {/* ── LEFT: Text content (always first in DOM order = top on mobile) ── */}
        <div>
          <div className="anim-fade-up" style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#FF5C00', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 30, height: 1, background: '#FF5C00' }} />
            Hello, I'm
          </div>

          <h1 className="anim-fade-up-d1 heading-display" style={{ fontSize: 'clamp(32px, 5.5vw, 68px)', marginBottom: 14, whiteSpace: 'nowrap' }}>
            P. Bharath
          </h1>

          <div className="anim-fade-up-d2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 'clamp(18px, 3vw, 36px)', lineHeight: 1.2, marginBottom: 16, height: '1.4em', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.span key={titleIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} style={{ display: 'block', color: '#FF5C00' }}>
                {jobTitles[titleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="anim-fade-up-d2" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: "'DM Mono', monospace", marginBottom: 28 }}>
            <MapPin size={13} color="#FF5C00" />
            Chennai, Tamil Nadu, India
          </div>

          <div className="anim-fade-up-d3" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <Link to="/contact" className="btn-orange">Hire Me <ArrowRight size={16} /></Link>
            <Link to="/about" className="btn-outline">About Me</Link>
          </div>

          <div className="anim-fade-up-d4" style={{ display: 'flex', gap: 32, marginTop: 36, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {[{ num: '2+', label: 'Years Experience' }, { num: '4+', label: 'Projects Built' }, { num: '10+', label: 'Skills Mastered' }].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 26, color: '#FF5C00', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Animation panel
              Desktop  → shown in the right column
              Tablet   → shown below the text (CSS changes grid to 1-col)
              Mobile   → shown below the text, shorter height (260px via CSS)
              NOTE: We no longer hide this on any screen size.
        ── */}
        <div className="home-anim-col anim-slide-right" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          height: 440, /* CSS overrides: 320px tablet, 260px mobile */
          width: '100%',
        }}>
          {/* Canvas particle background */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,92,0,0.1)' }}>
            <OrangeCanvas />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Orbit rings */}
            <div style={{ position: 'absolute', width: 240, height: 240, border: '1px solid rgba(255,92,0,0.15)', borderRadius: '50%', top: '50%', left: '50%', animation: 'spin-slow-center 20s linear infinite' }} />
            <div style={{ position: 'absolute', width: 170, height: 170, border: '1px solid rgba(255,92,0,0.1)', borderRadius: '50%', top: '50%', left: '50%', animation: 'spin-slow-center 14s linear infinite reverse' }} />

            {/* Center card with logo */}
            <div style={{ background: 'rgba(255,92,0,0.08)', border: '1px solid rgba(255,92,0,0.3)', borderRadius: 20, padding: '20px 28px', textAlign: 'center', animation: 'float 4s ease-in-out infinite', backdropFilter: 'blur(8px)', minWidth: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <LogoSVG size={56} />
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '3px', textTransform: 'uppercase' }}>P. Bharath</div>
            </div>

            {/* Orbit icons */}
            {[{ Icon: Code2, angle: 0, label: 'Dev' }, { Icon: Palette, angle: 120, label: 'Design' }, { Icon: MapPin, angle: 240, label: 'Chennai' }].map(({ Icon, angle, label }) => {
              const rad = ((angle - 90) * Math.PI) / 180;
              const r = 110;
              return (
                <div key={label} style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(calc(-50% + ${Math.cos(rad) * r}px), calc(-50% + ${Math.sin(rad) * r}px))` }}>
                  <div style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,92,0,0.4)', borderRadius: 10, padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <Icon size={16} color="#FF5C00" />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>{label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow-center {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

export default Home;