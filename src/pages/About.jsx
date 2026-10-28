import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import { Download } from "lucide-react";
import SEO from "../seo/SEO";
import seoData from "../seo/seoData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// பேராகிராஃப்களில் *star* குள் கொடுக்கப்படும் சொற்களை ஆரஞ்சு நிறத்தில் ஹைலைட் செய்ய
function renderHighlightedText(text) {
  if (!text) return null;
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      const content = part.slice(1, -1);
      return (
        <span key={i} className="text-[#FF5C00] font-semibold">
          {content}
        </span>
      );
    }
    return part;
  });
}

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [aboutRes, resumeRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/about`),
          fetch(`${API_BASE_URL}/api/settings/resume`),
        ]);

        const aboutDataJson = await aboutRes.json();
        const resumeDataJson = await resumeRes.json();

        if (aboutDataJson.success) {
          setAboutData(aboutDataJson.about);
        }
        if (resumeDataJson.success) {
          setResumeUrl(resumeDataJson.resumeUrl || "");
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-['Plus_Jakarta_Sans']">
        <Navbar />
        <p>Loading about...</p>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center font-['Plus_Jakarta_Sans']">
        <Navbar />
        <BackArrow />
        <p className="text-white/60 text-sm">
          No about information found. Add via Admin Dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden bg-black text-white font-['Plus_Jakarta_Sans']">
      <SEO {...seoData.about} />
      <div className="dot-grid" />
      <div className="fixed bottom-0 left-0 w-112.5 h-112.5 rounded-full bg-[radial-gradient(circle,rgba(255,92,0,0.08)_0%,transparent_70%)] pointer-events-none z-0" />

      <Navbar />
      <BackArrow />

      {/* Main Container: 90% mobile, 80% md/desktop */}
      <main className="relative z-10 w-[90%] md:w-[80%] lg:w-[85%] xl:w-[80%] mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center py-10 lg:py-0">
        
        <div className="flex items-center gap-2.5 font-['DM_Mono'] text-xs text-[#FF5C00] tracking-[3px] uppercase mb-2">
          <span className="w-7 h-px bg-[#FF5C00]" />
          About Me
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight mb-6">
          Crafting <span className="text-[#FF5C00]">digital</span> experiences that leave an impression.
        </h2>

        {/* மொபைல் மற்றும் டேப்லெட்டில் (md) 1-Column ஆகவும், லேப்டாப் (lg) திரையில் மட்டுமே 2-Column ஆகவும் மாறும் */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr] gap-8 lg:gap-12 items-center">
          
          {/* Image Block: மொபைல் மற்றும் டேப்லெட்டில் மையப்படுத்தப்பட்டு, lg திரையில் இடதுபுறம் அமையும் */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-48 sm:w-56 md:w-60 lg:w-full max-w-60">
              <div className="absolute -top-2.5 -left-2.5 -right-2.5 -bottom-2.5 border-2 border-[#FF5C00]/30 rounded-2xl z-0" />
              <img
                src={aboutData.image}
                alt={aboutData.name}
                className="relative z-10 w-full h-auto aspect-3/4 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute -bottom-3 -right-2 z-20 bg-[#FF5C00] rounded-md px-3 py-1 font-['DM_Mono'] text-[10px] text-white font-medium tracking-wider shadow">
                {aboutData.title}
              </div>
            </div>
          </div>

          {/* Bio & Details */}
          <div>
            {/* Dynamic Paragraphs with *highlight* support */}
            {(aboutData.paragraphs || []).map((para, index) => (
              <p
                key={index}
                className="text-sm sm:text-base leading-relaxed text-white/75 mb-4"
              >
                {renderHighlightedText(para)}
              </p>
            ))}

            {/* Dynamic Info Cards: டேப்லெட் மற்றும் டெஸ்க்டாப்பில் 2 காலம்களாக நேர்த்தியாக அமையும் */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 mb-6">
              {(aboutData.infoCards || []).map((card, index) => (
                <div
                  key={index}
                  className="bg-white/3 border border-white/10 rounded-xl p-3.5 flex flex-col justify-center"
                >
                  <div className="font-['DM_Mono'] text-[10px] text-[#FF5C00] tracking-wider uppercase mb-0.5">
                    {card.label}
                  </div>
                  <div className="font-semibold text-xs sm:text-sm text-white/95 truncate">
                    {card.value}
                  </div>
                </div>
              ))}
            </div>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF5C00] text-white font-semibold text-sm rounded-lg border-2 border-[#FF5C00] transition-all hover:bg-transparent hover:text-[#FF5C00] hover:-translate-y-0.5 cursor-pointer no-underline"
              >
                <Download size={15} /> Download Resume
              </a>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default About;