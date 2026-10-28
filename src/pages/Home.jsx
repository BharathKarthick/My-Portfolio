import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import logoImg from "../assets/logo.png";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Code2, Palette } from "lucide-react";
import SEO from "../seo/SEO";
import seoData from "../seo/seoData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function OrangeCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const particles = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.1,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x,
            dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,92,0,${(1 - dist / 100) * 0.12})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,92,0,${p.alpha})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function Home() {
  const [homeData, setHomeData] = useState({
    roleTitles: ["UI/UX Designer", "Web Developer", "Front-End Engineer"],
    location: "Chennai, Tamil Nadu, India",
    experienceYears: 2,
    terminalName: "P. Bharath",
  });
  const [projectCount, setProjectCount] = useState(0);
  const [skillCount, setSkillCount] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const [homeRes, projRes, skillRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/settings/home`),
          fetch(`${API_BASE_URL}/api/projects`),
          fetch(`${API_BASE_URL}/api/skills`),
        ]);

        const homeJson = await homeRes.json();
        const projJson = await projRes.json();
        const skillJson = await skillRes.json();

        if (homeJson.success && homeJson.home) {
          setHomeData(homeJson.home);
        }
        if (projJson.success) {
          setProjectCount(projJson.count ?? (projJson.projects || []).length);
        }
        if (skillJson.success) {
          setSkillCount(skillJson.count ?? (skillJson.skills || []).length);
        }
      } catch (err) {
        console.error("Failed to fetch home details:", err);
      }
    }

    fetchAllData();
  }, []);

  const roles =
    homeData.roleTitles && homeData.roleTitles.length > 0
      ? homeData.roleTitles
      : ["UI/UX Designer", "Web Developer", "Front-End Engineer"];

  useEffect(() => {
    const iv = setInterval(() => {
      setTitleIndex((p) => (p + 1) % roles.length);
    }, 3000);
    return () => clearInterval(iv);
  }, [roles.length]);

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden bg-black text-white font-['Plus_Jakarta_Sans']">
      <SEO {...seoData.home} />
      <div className="dot-grid" />
      <div className="fixed -top-24 -right-24 w-125] h-125 rounded-full bg-[radial-gradient(circle,rgba(255,92,0,0.12)_0%,transparent_65%)] pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10 w-[90%] md:w-[85%] lg:w-[85%] xl:w-[80%] mx-auto min-h-[calc(100vh-64px)] flex items-center justify-center py-10 lg:py-0">
        {/* டேப்லெட்டில் 1 காலமாகவும், லேப்டாப் (lg) திரையில் மட்டுமே 2 காலமாகவும் மாறும் */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-10 xl:gap-16 items-center w-full">
          
          {/* Left Column: Text Info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2.5 font-['DM_Mono'] text-xs text-[#FF5C00] tracking-[3px] uppercase mb-3 sm:mb-4">
              <span className="w-8 h-px bg-[#FF5C00]" />
              Hello, I'm
            </div>

            {/* lg-ல் 4xl ஆகவும், xl/2xl-ல் 6xl/7xl ஆகவும் மாறும் */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight mb-2 sm:mb-3">
              {homeData.terminalName || "P. Bharath"}
            </h1>

            {/* ரோல் டைட்டில்கள் lg-ல் உடையாமல் ஒரே வரியில் அமைய ஃபான்ட் ரீசைஸ் */}
            <div className="h-9 sm:h-11 lg:h-9 xl:h-12 overflow-hidden mb-4 font-bold text-lg sm:text-2xl lg:text-xl xl:text-3xl 2xl:text-4xl">
              <AnimatePresence mode="wait">
                <motion.span
                  key={titleIndex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="block text-[#FF5C00] truncate"
                >
                  {roles[titleIndex % roles.length]}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1.5 text-white/50 text-xs sm:text-sm font-['DM_Mono'] mb-6 sm:mb-7">
              <MapPin size={14} className="text-[#FF5C00] shrink-0" />
              <span>{homeData.location || "Chennai, Tamil Nadu, India"}</span>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 bg-[#FF5C00] text-white font-semibold text-xs sm:text-sm xl:text-[15px] rounded-lg border-2 border-[#FF5C00] transition-all hover:bg-transparent hover:text-[#FF5C00] hover:-translate-y-0.5 no-underline"
              >
                Hire Me
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 bg-transparent text-[#FF5C00] font-semibold text-xs sm:text-sm xl:text-[15px] rounded-lg border-2 border-[#FF5C00] transition-all hover:bg-[#FF5C00] hover:text-white hover:-translate-y-0.5 no-underline"
              >
                View Projects <ArrowRight size={15} />
              </Link>
            </div>

            {/* Dynamic Stats Section */}
            <div className="flex gap-6 sm:gap-8 mt-7 sm:mt-9 pt-6 sm:pt-7 border-t border-white/10">
              {[
                { num: `${homeData.experienceYears || 2}+`, label: "Years Experience" },
                { num: `${projectCount || 0}+`, label: "Projects Built" },
                { num: `${skillCount || 0}+`, label: "Skills Mastered" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl sm:text-3xl lg:text-2xl xl:text-3xl font-extrabold text-[#FF5C00] leading-none">
                    {s.num}
                  </div>
                  <div className="font-['DM_Mono'] text-[10px] text-white/40 tracking-wider mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Animation Canvas & Rings */}
          <div className="relative flex items-center justify-center w-full h-75 sm:h-90 md:h-100 lg:h-95 xl:h-110">
            <div className="absolute inset-0 rounded-3xl overflow-hidden border border-[#FF5C00]/15">
              <OrangeCanvas />
            </div>

            <div className="relative z-10 flex items-center justify-center">
              <div className="absolute w-52.5 h-52.5 sm:w-60 sm:h-60 border border-[#FF5C00]/20 rounded-full top-1/2 left-1/2 anim-spin-center-1" />
              <div className="absolute w-37.5 h-37.5 sm:w-42.5 sm:h-42.5 border border-[#FF5C00]/15 rounded-full top-1/2 left-1/2 anim-spin-center-2" />

              <div className="bg-[#FF5C00]/10 border border-[#FF5C00]/30 rounded-2xl px-6 sm:px-7 py-4 sm:py-5 text-center anim-float backdrop-blur-md flex flex-col items-center gap-2">
                <img src={logoImg} alt="Logo" className="w-10 h-10" />
                <div className="font-['DM_Mono'] text-[9px] text-white/40 tracking-[3px] uppercase">
                  {homeData.terminalName || "P. Bharath"}
                </div>
              </div>

              {[
                { Icon: Code2, angle: 0, label: "Dev" },
                { Icon: Palette, angle: 120, label: "Design" },
                { Icon: MapPin, angle: 240, label: (homeData.location || "Chennai").split(",")[0].trim() },
              ].map(({ Icon, angle, label }) => {
                const rad = ((angle - 90) * Math.PI) / 180;
                const r = 105;
                return (
                  <div
                    key={label}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${Math.cos(rad) * r}px), calc(-50% + ${Math.sin(rad) * r}px))`,
                    }}
                  >
                    <div className="bg-black/80 border border-[#FF5C00]/40 rounded-xl p-2 flex flex-col items-center gap-1 shadow-md">
                      <Icon size={15} className="text-[#FF5C00]" />
                      <span className="font-['DM_Mono'] text-[8px] text-white/50 tracking-wider">
                        {label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Home;