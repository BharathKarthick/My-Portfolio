import { useState } from "react";
import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import { Calendar, ChevronRight } from "lucide-react";

const experiences = [
  { id: 0, company: "Magic Bus India Foundation", period: "November 2024 – January 2025", role: "Web Designer / UI UX Designer / Front-End Developer", type: "Intern", skills: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "React.js", "Node.js", "MongoDB", "WordPress", "Responsive Design", "Figma", "Git", "GitHub"], highlights: ["Built and maintained responsive web pages using React.js and Tailwind CSS", "Designed and prototyped UX flows in Figma for multiple features", "Collaborated with back-end team on Node.js + MongoDB integrations", "Ensured pixel-perfect responsive design across mobile, tablet, and desktop"] },
  { id: 1, company: "Walk Horizons", period: "May 2023 – July 2023", role: "Front-End Developer / Web Designer", type: "Intern", skills: ["HTML5", "CSS3", "JavaScript", "WordPress", "Elementor", "Responsive Design"], highlights: ["Developed the 'KJ Fitness' website using WordPress and Elementor", "Applied responsive design principles for cross-device compatibility", "Improved page layouts and component designs for better usability", "Delivered clean, maintainable HTML/CSS code for client projects"] },
];

const Experience = () => {
  const [active, setActive] = useState(0);
  const exp = experiences[active];
  return (
    <div className="exp-page" style={{ height: '100vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
      <div className="dot-grid" />
      <Navbar />
      <BackArrow />
      <div className="exp-inner" style={{ position: 'relative', zIndex: 1, height: 'calc(100vh - 64px)', maxWidth: 1100, margin: '0 auto', padding: '20px 24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="section-label anim-fade-up" style={{ marginBottom: 6 }}>Work History</div>
        <h2 className="anim-fade-up-d1 heading-display" style={{ fontSize: 'clamp(22px, 3.5vw, 44px)', marginBottom: 20, whiteSpace: 'nowrap' }}>
          My <span style={{ color: '#FF5C00' }}>Experience</span>
        </h2>

        {/* exp-layout: desktop = flex row, tablet/mobile = flex col via CSS */}
        <div className="exp-layout" style={{ display: 'flex', gap: 32, flex: 1, alignItems: 'stretch', minHeight: 0 }}>

          {/* Tabs column — on tablet/mobile: becomes horizontal scroll row */}
          <div className="exp-tabs-col" style={{ width: 260, flexShrink: 0 }}>
            <div className="exp-tabs-row" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {experiences.map((e) => (
                <button key={e.id} onClick={() => setActive(e.id)} className="exp-tab-btn" style={{ textAlign: 'left', padding: '16px 18px', background: active === e.id ? 'rgba(255,92,0,0.1)' : 'rgba(255,255,255,0.02)', border: active === e.id ? '1px solid rgba(255,92,0,0.4)' : '1px solid rgba(255,255,255,0.07)', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
                  {active === e.id && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#FF5C00', borderRadius: '0 3px 3px 0' }} />}
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13, color: active === e.id ? '#FF5C00' : 'rgba(255,255,255,0.8)', marginBottom: 4, paddingLeft: active === e.id ? 8 : 0, transition: 'all 0.2s' }}>{e.company}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{e.type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div key={active} className="anim-slide-right" style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#FF5C00', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>{exp.type}</div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 20, color: 'white', marginBottom: 3 }}>{exp.company}</h3>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{exp.role}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(255,92,0,0.08)', border: '1px solid rgba(255,92,0,0.2)', borderRadius: 100, flexShrink: 0 }}>
                <Calendar size={12} color="#FF5C00" />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{exp.period}</span>
              </div>
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 16 }} />
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>Key Highlights</div>
              {exp.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
                  <ChevronRight size={13} color="#FF5C00" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{h}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Technologies Used</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {exp.skills.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;