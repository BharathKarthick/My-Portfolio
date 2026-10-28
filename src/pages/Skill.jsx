import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import { Code2 } from "lucide-react";
import SEO from "../seo/SEO";
import seoData from "../seo/seoData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LEGACY_ICONS = {
  FaReact: "simple-icons:react", FaNodeJs: "simple-icons:nodedotjs",
  FaHtml5: "simple-icons:html5", FaCss3Alt: "simple-icons:css3", FaGithub: "simple-icons:github",
  SiJavascript: "simple-icons:javascript", SiTypescript: "simple-icons:typescript",
  SiTailwindcss: "simple-icons:tailwindcss", SiExpress: "simple-icons:express",
  SiMongodb: "simple-icons:mongodb", SiPostman: "simple-icons:postman",
  SiNetlify: "simple-icons:netlify", SiRender: "simple-icons:render", SiAmazons3: "simple-icons:amazonaws",
};

const SIMPLE_ICON_ALIASES = {
  html: "html5", css: "css3", js: "javascript", tailwind: "tailwindcss",
  node: "nodedotjs", nodejs: "nodedotjs", expressjs: "express", postgres: "postgresql",
  aws: "amazonaws", amazonaws: "amazonaws", python: "python", mysql: "mysql",
  react: "react", javascript: "javascript", typescript: "typescript", mongodb: "mongodb",
  docker: "docker", git: "git", github: "github", java: "java", php: "php",
  firebase: "firebase", figma: "figma", wordpress: "wordpress", canva: "canva",
};

function normalizeIconIdentifier(icon) {
  const raw = String(icon || "").trim();
  if (!raw) return "";
  if (LEGACY_ICONS[raw]) return LEGACY_ICONS[raw];
  if (raw.includes(":")) return raw.toLowerCase();
  const slug = raw.toLowerCase().replace(/\s+/g, "-");
  return `simple-icons:${SIMPLE_ICON_ALIASES[slug] || slug}`;
}

function getIconUrl(icon) {
  const id = normalizeIconIdentifier(icon);
  const match = id.match(/^([a-z0-9-]+):([a-z0-9-]+)$/i);
  if (!match) return null;
  return `https://api.iconify.design/${match[1]}/${match[2]}.svg`;
}

function SkillIcon({ icon, color, name }) {
  const src = getIconUrl(icon);
  const [failedSrc, setFailedSrc] = useState("");
  const failed = Boolean(src && failedSrc === src);

  if (!src || failed) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white/5 font-bold text-slate-400"
        style={{ width: 32, height: 32 }}
      >
        {String(icon || "?").trim().slice(0, 1).toUpperCase() || "?"}
      </span>
    );
  }

  return (
    <span
      key={src}
      className="inline-block shrink-0"
      role="img"
      aria-label={`${name} icon`}
      style={{
        width: 32,
        height: 32,
        backgroundColor: color || "#FF5C00",
        WebkitMask: `url("${src}") center / contain no-repeat`,
        mask: `url("${src}") center / contain no-repeat`,
      }}
    >
      <img src={src} alt="" width={32} height={32} onError={() => setFailedSrc(src)} style={{ display: "none" }} />
    </span>
  );
}

const Skill = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/skills`);
        const data = await response.json();
        if (data.success) {
          const sortedSkills = (data.skills || []).sort(
            (a, b) => (a.order || 0) - (b.order || 0)
          );
          setSkills(sortedSkills);
        }
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-['Plus_Jakarta_Sans']">
        <Navbar />
        <p>Loading skills...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen md:h-screen md:overflow-hidden bg-black text-white font-['Plus_Jakarta_Sans']">
      <SEO {...seoData.skills} />
      <div className="dot-grid" />
      <Navbar />
      <BackArrow />

      {/* Main Container: 90% mobile, 80% md/desktop */}
      <main className="relative z-10 w-[90%] md:w-[80%] mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center py-8 md:py-0">
        <div className="flex items-center gap-2.5 font-['DM_Mono'] text-xs text-[#FF5C00] tracking-[3px] uppercase mb-2">
          <span className="w-7 h-px bg-[#FF5C00]" />
          Technical Stack
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">
          Skills &amp; <span className="text-[#FF5C00]">Technologies</span>
        </h2>

        <p className="text-sm sm:text-base text-white/50 mb-8 max-w-lg">
          Tools and technologies I&apos;ve worked with to build modern, responsive interfaces.
        </p>

        {skills.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
            <Code2 size={40} className="mx-auto text-[#FF5C00] mb-3" />
            <p className="text-white/80">No skills found. Add them via Admin Dashboard.</p>
          </div>
        ) : (
          /* Responsive Skill Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {skills.map((skill, i) => {
              const isHovered = hovered === i;
              const skillColor = skill.color || "#FF5C00";

              return (
                <div
                  key={skill._id || skill.name}
                  className="flex flex-col items-center justify-center gap-2.5 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-default bg-white/3"
                  style={{
                    borderColor: isHovered ? skillColor : "rgba(255,255,255,0.08)",
                    backgroundColor: isHovered ? `${skillColor}15` : "rgba(255,255,255,0.03)",
                    boxShadow: isHovered ? `0 8px 24px ${skillColor}25` : "none",
                    transform: isHovered ? "translateY(-4px)" : "none",
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    <SkillIcon
                      icon={skill.icon || skill.key}
                      color={skillColor}
                      name={skill.name}
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold text-center transition-colors ${
                      isHovered ? "text-white" : "text-white/70"
                    }`}
                  >
                    {skill.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Skill;