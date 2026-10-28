import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import { Calendar, ChevronRight } from "lucide-react";
import SEO from "../seo/SEO";
import seoData from "../seo/seoData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/experiences`);
        const data = await response.json();
        if (data.success) {
          setExperiences(data.experiences || []);
        }
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiences();
  }, []);

  function handleTabClick(index) {
    setActive(index);
    if (tabRefs.current[index]) {
      tabRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-['Plus_Jakarta_Sans']">
        <Navbar />
        <p>Loading experiences...</p>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center font-['Plus_Jakarta_Sans']">
        <Navbar />
        <BackArrow />
        <p className="text-white/60 text-sm">No experience records found. Add them via Admin Dashboard.</p>
      </div>
    );
  }

  const exp = experiences[active] || experiences[0];

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden bg-black text-white font-['Plus_Jakarta_Sans']">
      <SEO {...seoData.experience} />
      <div className="dot-grid" />
      <Navbar />
      <BackArrow />

      {/* Main Container: 90% mobile, 85% md/lg, 80% xl */}
      <main className="relative z-10 w-[90%] md:w-[85%] lg:w-[85%] xl:w-[80%] mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center py-10 lg:py-0">
        <div className="flex items-center gap-2.5 font-['DM_Mono'] text-xs text-[#FF5C00] tracking-[3px] uppercase mb-2">
          <span className="w-7 h-px bg-[#FF5C00]" />
          Work History
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight mb-6">
          My <span className="text-[#FF5C00]">Experience</span>
        </h2>

        {/* Mobile & Tablet: Top-Bottom (flex-col), Laptop (lg): Left-Right (flex-row) */}
        <div className="flex flex-col lg:flex-row gap-5 md:gap-6 lg:gap-8 items-stretch">
          
          {/* Tab Selector: Horizontal scrollable with right end-padding */}
          <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto p-1 pb-3 lg:p-0 lg:w-64 shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth scroll-px-4">
            {experiences.map((e, index) => {
              const isActive = active === index;

              return (
                <button
                  key={e._id || index}
                  ref={(el) => (tabRefs.current[index] = el)}
                  onClick={() => handleTabClick(index)}
                  className={`relative text-left py-2.5 px-4 sm:px-5 lg:p-4 rounded-xl border transition-all cursor-pointer whitespace-nowrap shrink-0 lg:w-full lg:min-w-0 ${
                    isActive
                      ? "bg-[#FF5C00]/15 border-[#FF5C00] text-[#FF5C00]"
                      : "bg-white/2 border-white/10 text-white/70 hover:bg-white/5"
                  }`}
                >
                  {/* LG screen left vertical indicator bar */}
                  {isActive && (
                    <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-1 bg-[#FF5C00] rounded-r" />
                  )}

                  {/* Mobile & Tablet screen bottom indicator line */}
                  {isActive && (
                    <div className="lg:hidden absolute bottom-0 left-3 right-3 h-0.5 bg-[#FF5C00] rounded-t" />
                  )}

                  <div className={`font-bold text-xs sm:text-sm ${isActive ? "lg:pl-2 text-[#FF5C00]" : "text-white"}`}>
                    {e.company}
                  </div>
                  <div className={`font-['DM_Mono'] text-[10px] sm:text-[11px] mt-0.5 ${isActive ? "lg:pl-2 text-[#FF5C00]/70" : "text-white/40"}`}>
                    {e.type}
                  </div>
                </button>
              );
            })}

            {/* வலது ஓரத்தில் கார்டுகள் கட் ஆகாமல் இருக்க உதவும் End-Spacer */}
            <div className="w-5 sm:w-8 shrink-0 lg:hidden pointer-events-none" aria-hidden="true" />
          </div>

          {/* Details Card: Mobile & Tablet-ல் full width, LG-ல் right-side flex-1 */}
          <div className="flex-1 bg-white/2 border border-white/10 rounded-2xl p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <div className="font-['DM_Mono'] text-[10px] text-[#FF5C00] tracking-widest uppercase mb-1">
                  {exp.type}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white mb-1">
                  {exp.company}
                </h3>
                <div className="font-semibold text-xs sm:text-sm text-white/60">
                  {exp.role}
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF5C00]/10 border border-[#FF5C00]/30 rounded-full shrink-0 w-fit">
                <Calendar size={12} className="text-[#FF5C00]" />
                <span className="font-['DM_Mono'] text-xs text-white/70">{exp.period}</span>
              </div>
            </div>

            <div className="h-0.5 bg-white/10 my-4" />

            <div className="mb-5">
              <div className="font-['DM_Mono'] text-[10px] text-white/40 tracking-widest uppercase mb-3">
                Key Highlights
              </div>
              {(exp.highlights || []).map((h, i) => (
                <div key={i} className="flex gap-2.5 items-start mb-2.5">
                  <ChevronRight size={14} className="text-[#FF5C00] shrink-0 mt-1" />
                  <span className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    {h}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <div className="font-['DM_Mono'] text-[10px] text-white/40 tracking-widest uppercase mb-3">
                Technologies Used
              </div>
              <div className="flex flex-wrap gap-2">
                {(exp.skills || []).map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full text-xs font-['DM_Mono'] bg-[#FF5C00]/10 border border-[#FF5C00]/30 text-[#FF5C00]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Experience;