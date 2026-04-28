import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import myImage from "../image/my image.jpg";
import resumePDF from "../assets/Resume(Bharath.P).pdf";
import { Download, User, Briefcase, GraduationCap, MapPin } from "lucide-react";

const About = () => {
  return (
    <div className="about-page" style={{ height: '100vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
      <div className="dot-grid" />
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,92,0,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <Navbar />
      <BackArrow />

      <div className="about-inner" style={{
        position: 'relative', zIndex: 1,
        height: 'calc(100vh - 64px)',
        maxWidth: 1100, margin: '0 auto',
        padding: '24px 24px 16px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div className="section-label anim-fade-up" style={{ marginBottom: 6 }}>About Me</div>

        <h2 className="anim-fade-up-d1 heading-display about-heading" style={{ fontSize: 'clamp(22px, 3.5vw, 42px)', marginBottom: 20, whiteSpace: 'nowrap' }}>
          Crafting <span style={{ color: '#FF5C00' }}>digital</span> experiences that leave an impression.
        </h2>

        {/* Grid: desktop = 200px | 1fr, tablet/mobile = 1fr (stacked) */}
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 36, alignItems: 'center', flex: 1 }}>

          {/* Image — centered at 50% width on tablet/mobile via CSS */}
          <div className="anim-slide-left about-img-wrap" style={{ display: 'flex' }}>
            <div className="about-img-inner" style={{ position: 'relative', width: '100%' }}>
              <div style={{ position: 'absolute', top: -10, left: -10, right: 10, bottom: 10, border: '2px solid rgba(255,92,0,0.3)', borderRadius: 14, zIndex: 0 }} />
              <img src={myImage} alt="P. Bharath" style={{ width: '100%', borderRadius: 12, display: 'block', objectFit: 'cover', aspectRatio: '3/4', position: 'relative', zIndex: 1, maxHeight: 240 }} />
              <div style={{ position: 'absolute', bottom: -12, right: -8, zIndex: 2, background: '#FF5C00', borderRadius: 8, padding: '6px 12px', fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'white', fontWeight: 500, letterSpacing: '1px' }}>
                UI/UX & Dev
              </div>
            </div>
          </div>

          {/* Text + cards + button */}
          <div className="anim-slide-right">
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(13px, 1.5vw, 15px)', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', marginBottom: 16 }}>
              I'm <strong style={{ color: '#FF5C00' }}>P. Bharath</strong>, a passionate Front-End Developer and UI/UX Designer based in Chennai. I bridge the gap between clean code and beautiful design — turning ideas into intuitive, responsive web experiences.
            </p>

            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(13px, 1.5vw, 15px)', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', marginBottom: 20 }}>
              I completed an internship at <strong style={{ color: 'white' }}>Walk Horizons</strong> where I built the "KJ Fitness" web page, and spent six months at <strong style={{ color: 'white' }}>The MindIT Solution</strong> on the "Smart ATM" deep learning project.
            </p>

            {/* Info cards — 2x2 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { Icon: User,         title: 'Name',     value: 'P. Bharath' },
                { Icon: MapPin,       title: 'Location', value: 'Chennai, TN' },
                { Icon: Briefcase,    title: 'Role',     value: 'UI/UX & Frontend' },
                { Icon: GraduationCap,title: 'Email',    value: 'pbharath6001@gmail.com' },
              ].map(({ Icon, title, value }) => (
                <div key={title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Icon size={14} color="#FF5C00" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 3 }}>{title}</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <a href={resumePDF} download="Bharath_Resume.pdf" className="btn-orange" style={{ gap: 8 }}>
              <Download size={15} /> Download Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;