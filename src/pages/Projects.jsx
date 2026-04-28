import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";

import project1Img from "../image/port1.jpeg";
import project2Img from "../image/proj1.png";
import project3Img from "../image/Frontend mentor.png";
import project4Img from "../image/proj4.png";

const projects = [
  { id: 1, num: "01", title: "Portfolio", desc: "My portfolio showcases web development projects built with modern tools and a focus on clean, responsive design.", tools: ["React.js", "TailwindCSS", "JavaScript", "HTML5", "CSS3"], frontend: "https://github.com/BharathKarthick/My-Portfolio", demo: "https://bharathkarthick.github.io/My-Portfolio/", image: project1Img },
  { id: 2, num: "02", title: "Coffee Shop Website", desc: "A vibrant coffee shop website designed with a clean layout and engaging UI to showcase services and enhance online orders.", tools: ["HTML5", "CSS3"], frontend: "https://github.com/BharathKarthick/Coffee-Website", demo: "https://bharathkarthick.github.io/Coffee-Website/", image: project2Img },
  { id: 3, num: "03", title: "Frontend Mentor Challenges", desc: "Completed multiple Frontend Mentor challenges to enhance skills in layout structuring, responsive design, and clean UI.", tools: ["HTML5", "CSS3"], frontend: "https://github.com/BharathKarthick/product-card", demo: "https://www.frontendmentor.io/home/my-challenges?tab=completed", image: project3Img },
  { id: 4, num: "04", title: "Recipe Shopping List Builder", desc: "An interactive web app to help users select recipes and generate personalized shopping lists based on portion size.", tools: ["HTML5", "CSS3", "JavaScript"], frontend: "https://github.com/BharathKarthick/Recipe-Website", demo: "https://bharathkarthick.github.io/Recipe-Website/", image: project4Img },
];

const ProjectPage = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const prev = () => { setDirection(-1); setCurrent(c => (c - 1 + projects.length) % projects.length); };
  const next = () => { setDirection(1); setCurrent(c => (c + 1) % projects.length); };
  const p = projects[current];

  const variants = {
    enter: d => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: d => ({ x: d > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.3 } }),
  };

  const arrowStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 44, height: 44,
    background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,92,0,0.4)',
    borderRadius: '50%', color: '#FF5C00',
    cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)', flexShrink: 0,
  };

  const dots = (
    <div style={{ display: 'flex', gap: 8 }}>
      {projects.map((_, i) => (
        <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }} style={{ width: i === current ? 22 : 7, height: 7, borderRadius: 4, background: i === current ? '#FF5C00' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
      ))}
    </div>
  );

  return (
    <div className="proj-page" style={{ height: '100vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
      <div className="dot-grid" />
      <Navbar />
      <BackArrow />

      <div className="proj-inner" style={{ position: 'relative', zIndex: 1, height: 'calc(100vh - 64px)', maxWidth: 1100, margin: '0 auto', padding: '20px 24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div>
            <div className="section-label anim-fade-up" style={{ marginBottom: 4 }}>Work</div>
            <h2 className="anim-fade-up-d1 heading-display" style={{ fontSize: 'clamp(22px, 3.5vw, 44px)', whiteSpace: 'nowrap' }}>
              Featured <span style={{ color: '#FF5C00' }}>Projects</span>
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {dots}
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
              <span style={{ color: '#FF5C00', fontWeight: 500 }}>{String(current + 1).padStart(2, '0')}</span>{' / '}{String(projects.length).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/*
          DESKTOP: left-arrow | card | right-arrow  (side by side in a flex row)
          TABLET/MOBILE: card stacked (image top, content below), bottom nav visible
          .proj-card-wrap flex col on tablet/mobile via CSS
          .proj-arrow-side hidden on tablet/mobile via CSS
          .proj-bottom-nav shown on tablet/mobile via CSS
        */}
        <div className="proj-card-wrap" style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>

          {/* Left arrow — desktop only */}
          <button className="proj-arrow-side" onClick={prev} style={arrowStyle}
            onMouseEnter={e => { e.currentTarget.style.background = '#FF5C00'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.color = '#FF5C00'; }}>
            <ChevronLeft size={20} />
          </button>

          {/* Card */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={p.id} custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
                className="proj-grid"
                style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'center' }}>
                {/* Image */}
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: -1, borderRadius: 17, background: 'linear-gradient(135deg, rgba(255,92,0,0.3), transparent)', zIndex: 0 }} />
                  <div style={{ position: 'absolute', top: -14, left: -6, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 72, color: 'rgba(255,92,0,0.08)', lineHeight: 1, zIndex: 0, pointerEvents: 'none', userSelect: 'none' }}>{p.num}</div>
                  <a href={p.demo} target="_blank" rel="noopener noreferrer">
                    <img src={p.image} alt={p.title} style={{ width: '100%', height: 'auto', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 16, display: 'block', position: 'relative', zIndex: 1, transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </a>
                </div>
                {/* Content */}
                <div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(20px, 2.5vw, 32px)', marginBottom: 12, lineHeight: 1.2 }}>{p.title}</h3>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', marginBottom: 18 }}>{p.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                    {p.tools.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn-orange"><ExternalLink size={14} />Live Demo</a>
                    <a href={p.frontend} target="_blank" rel="noopener noreferrer" className="btn-outline"><Github size={14} />GitHub</a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right arrow — desktop only */}
          <button className="proj-arrow-side" onClick={next} style={arrowStyle}
            onMouseEnter={e => { e.currentTarget.style.background = '#FF5C00'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.color = '#FF5C00'; }}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Bottom nav — tablet/mobile only, hidden on desktop */}
        <div className="proj-bottom-nav" style={{ display: 'none', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={prev} style={{ ...arrowStyle, width: 40, height: 40 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FF5C00'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.color = '#FF5C00'; }}>
            <ChevronLeft size={18} />
          </button>
          {dots}
          <button onClick={next} style={{ ...arrowStyle, width: 40, height: 40 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FF5C00'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.color = '#FF5C00'; }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;