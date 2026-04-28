import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import { useState } from "react";
import { FaHtml5, FaCss3Alt, FaReact, FaGithub, FaWordpress, FaNodeJs } from "react-icons/fa";
import { SiTailwindcss, SiJavascript, SiFigma, SiMongodb } from "react-icons/si";

const icons = {
  HTML: FaHtml5,
  CSS: FaCss3Alt,
  Tailwind: SiTailwindcss,
  JavaScript: SiJavascript,
  React: FaReact,
  Figma: SiFigma,
  Wordpress: FaWordpress,
  GitHub: FaGithub,
  MongoDB: SiMongodb,
  NodeJS: FaNodeJs,
};

const skills = [
  { name: "HTML5", key: "HTML", color: "#E44D26" },
  { name: "CSS3", key: "CSS", color: "#1572B6" },
  { name: "Tailwind CSS", key: "Tailwind", color: "#38BDF8" },
  { name: "JavaScript", key: "JavaScript", color: "#F7DF1E" },
  { name: "React.js", key: "React", color: "#61DAFB" },
  { name: "Figma", key: "Figma", color: "#F24E1E" },
  { name: "WordPress", key: "Wordpress", color: "#21759B" },
  { name: "GitHub", key: "GitHub", color: "#fff" },
  { name: "MongoDB", key: "MongoDB", color: "#4FAA41" },
  { name: "Node.js", key: "NodeJS", color: "#83CD29" },
];

const Skill = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="skill-page" style={{ height: '100vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
      <div className="dot-grid" />
      <Navbar />
      <BackArrow />

      <div className="skill-inner" style={{ position: 'relative', zIndex: 1, height: 'calc(100vh - 64px)', maxWidth: 1000, margin: '0 auto', padding: '24px 24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="section-label anim-fade-up" style={{ marginBottom: 6 }}>Technical Stack</div>

        <h2 className="anim-fade-up-d1 heading-display" style={{ fontSize: 'clamp(24px, 4vw, 48px)', marginBottom: 8, whiteSpace: 'nowrap' }}>
          Skills &amp; <span style={{ color: '#FF5C00' }}>Technologies</span>
        </h2>

        <p className="anim-fade-up-d2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28, maxWidth: 500 }}>
          Tools and technologies I've worked with to build modern, responsive interfaces.
        </p>

        <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          {skills.map((skill, i) => {
            const IconComp = icons[skill.key];

            return (
              <div
                key={skill.name}
                className="skill-pill anim-fade-up"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  borderColor: hovered === i ? skill.color + '60' : 'rgba(255,255,255,0.07)',
                  background: hovered === i ? skill.color + '10' : 'rgba(255,255,255,0.03)',
                  boxShadow: hovered === i ? `0 8px 24px ${skill.color}20` : 'none'
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* ✅ Replaced SVG with icon component */}
                {IconComp && <IconComp size={28} color={skill.color} />}

                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                    color: hovered === i ? 'white' : 'rgba(255,255,255,0.7)',
                    transition: 'color 0.2s',
                    textAlign: 'center'
                  }}
                >
                  {skill.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Skill;