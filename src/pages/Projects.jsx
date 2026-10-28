import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import SEO from "../seo/SEO";
import seoData from "../seo/seoData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Projects = () => {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/projects`);
        const data = await response.json();
        if (data.success) {
          setProjectsList(data.projects || []);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + projectsList.length) % projectsList.length);
  };
  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % projectsList.length);
  };

  // Touch Swipe / Drag Handler (Mobile & Tablet)
  const handleDragEnd = (_event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -300) {
      next();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 300) {
      prev();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-['Plus_Jakarta_Sans']">
        <Navbar />
        <p>Loading projects...</p>
      </div>
    );
  }

  if (projectsList.length === 0) {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center font-['Plus_Jakarta_Sans']">
        <Navbar />
        <BackArrow />
        <p className="text-white/60 text-sm">No projects found. Add them via Admin Dashboard.</p>
      </div>
    );
  }

  const p = projectsList[current] || projectsList[0];

  const variants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
    exit: (d) => ({ x: d > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.25 } }),
  };

  const dots = (
    <div className="flex gap-2">
      {projectsList.map((_, i) => (
        <button
          key={i}
          onClick={() => {
            setDirection(i > current ? 1 : -1);
            setCurrent(i);
          }}
          className={`h-2 rounded-full transition-all duration-300 border-none cursor-pointer p-0 ${
            i === current ? "w-6 bg-[#FF5C00]" : "w-2 bg-white/20"
          }`}
          aria-label={`Slide ${i + 1}`}
        />
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden bg-black text-white font-['Plus_Jakarta_Sans']">
      <SEO {...seoData.projects} />
      <div className="dot-grid" />
      <Navbar />
      <BackArrow />

      {/* Main Container: строго 90% mobile, 80% md/desktop */}
      <main className="relative z-10 w-[90%] md:w-[80%] mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center py-8 lg:py-0">
        
        {/* Top Header */}
        <div className="flex justify-between items-end flex-wrap gap-4 mb-5 lg:mb-6 xl:mb-8">
          <div>
            <div className="flex items-center gap-2.5 font-['DM_Mono'] text-xs text-[#FF5C00] tracking-[3px] uppercase mb-1">
              <span className="w-7 h-0.5 bg-[#FF5C00]" />
              Work
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Featured <span className="text-[#FF5C00]">Projects</span>
            </h2>
          </div>

          {/* Top Indicator: டேப்லெட் மற்றும் டெஸ்க்டாப்பில் மட்டும் மேலே இருக்கும் */}
          <div className="hidden md:flex items-center gap-4">
            {dots}
            <div className="font-['DM_Mono'] text-xs text-white/40">
              <span className="text-[#FF5C00] font-medium">{String(current + 1).padStart(2, "0")}</span> /{" "}
              {String(projectsList.length).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Carousel Block Wrapper with Relative Positioning */}
        <div className="relative w-full">
          
          {/* Side Previous Button (10% மார்ஜின் வெளியில் Absolute ஆக அமையும்) */}
          <button
            onClick={prev}
            className="hidden md:flex absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-black/80 border border-[#FF5C00]/40 text-[#FF5C00] hover:bg-[#FF5C00] hover:text-white transition-all cursor-pointer backdrop-blur-md z-30 shadow-lg"
            aria-label="Previous project"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Project Details Card */}
          <div className="w-full md:w-[80%] lg:w-full xl:w-[90%] 2xl:w-[80%] overflow-hidden mx-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={p._id || current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-8 xl:gap-12 items-center bg-white/2 border border-white/10 rounded-2xl p-5 sm:p-6 lg:p-7 xl:p-8 cursor-grab active:cursor-grabbing select-none"
              >
                {/* Image Section: மொபைல் & டேப்லெட்டில் மேலே, lg-ல் இடதுபுறம் */}
                <div className="relative group overflow-hidden rounded-xl">
                  <div className="absolute top-0 left-0 font-extrabold text-5xl sm:text-6xl lg:text-7xl text-[#FF5C00]/10 select-none pointer-events-none z-0">
                    {String(current + 1).padStart(2, "0")}
                  </div>
                  {p.liveUrl ? (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-xl"
                      draggable="false"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        draggable="false"
                        className="w-full aspect-16/10 max-h-65 sm:max-h-80 lg:max-h-none object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                      />
                    </a>
                  ) : (
                    <img
                      src={p.image}
                      alt={p.title}
                      draggable="false"
                      className="w-full aspect-16/10 max-h-65 sm:max-h-80 lg:max-h-none object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                    />
                  )}
                </div>

                {/* Content Section */}
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-extrabold mb-2.5 sm:mb-3 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4">
                    {p.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                    {(p.technologies || []).map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 text-[11px] sm:text-xs font-['DM_Mono'] rounded-full bg-[#FF5C00]/10 border border-[#FF5C00]/30 text-[#FF5C00]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 bg-[#FF5C00] text-white text-xs sm:text-sm font-semibold rounded-lg border-2 border-[#FF5C00] hover:bg-transparent hover:text-[#FF5C00] transition-all no-underline cursor-pointer"
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {p.frontendUrl && (
                      <a
                        href={p.frontendUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 bg-transparent text-[#FF5C00] text-xs sm:text-sm font-semibold rounded-lg border-2 border-[#FF5C00] hover:bg-[#FF5C00] hover:text-white transition-all no-underline cursor-pointer"
                      >
                        <Github size={14} /> GitHub
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side Next Button (10% மார்ஜின் வெளியில் Absolute ஆக அமையும்) */}
          <button
            onClick={next}
            className="hidden md:flex absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-black/80 border border-[#FF5C00]/40 text-[#FF5C00] hover:bg-[#FF5C00] hover:text-white transition-all cursor-pointer backdrop-blur-md z-30 shadow-lg"
            aria-label="Next project"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Mobile View Bottom Right Indicator: கார்டுக்குக் கீழே வலதுபுறத்தில் மட்டும் அமையும் */}
        <div className="flex md:hidden justify-end items-center gap-3 mt-3">
          {dots}
          <div className="font-['DM_Mono'] text-xs text-white/50">
            <span className="text-[#FF5C00] font-semibold">{String(current + 1).padStart(2, "0")}</span> /{" "}
            {String(projectsList.length).padStart(2, "0")}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Projects;