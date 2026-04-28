import { useRef, useState } from "react";
import emailjs from "emailjs-com";
import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import { Send, Linkedin, Github, Mail, CheckCircle, MapPin, User, Phone } from "lucide-react";

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState("idle");

  const sendEmail = (e) => {
    e.preventDefault();
    const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    if (!publicKey || !serviceId || !templateId) { alert("Missing EmailJS config. Check .env"); return; }
    setStatus("sending");
    emailjs.sendForm(serviceId, templateId, form.current, publicKey).then(
      () => { setStatus("success"); form.current.reset(); setTimeout(() => setStatus("idle"), 4000); },
      () => { setStatus("error");   setTimeout(() => setStatus("idle"), 3000); }
    );
  };

  const contactItems = [
    { Icon: User,  label: 'Full Name', value: 'P. Bharath',            href: null },
    { Icon: Phone, label: 'WhatsApp',  value: '+91 8608975629',        href: 'https://wa.me/918608975629' }, // ← replace with real number
    { Icon: Mail,  label: 'Email',     value: 'pbharath6001@gmail.com', href: 'mailto:pbharath6001@gmail.com' },
    { Icon: MapPin,label: 'Location',  value: 'Chennai, Tamil Nadu',    href: null },
  ];

  return (
    /*
      DESKTOP (>1024px):  height:100vh, overflow:hidden, 2-col grid
      TABLET/MOBILE:      height:auto, min-height:100vh, overflow:auto — everything visible
      Classes: contact-page, contact-inner, contact-grid, form-row
    */
    <div className="contact-page" style={{ height: '100vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
      <div className="dot-grid" />
      <div style={{ position: 'fixed', bottom: 0, right: 0, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,92,0,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <Navbar />
      <BackArrow />

      <div className="contact-inner" style={{ position: 'relative', zIndex: 1, height: 'calc(100vh - 64px)', maxWidth: 1100, margin: '0 auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="section-label anim-fade-up" style={{ marginBottom: 4 }}>Get In Touch</div>
        <h2 className="anim-fade-up-d1 heading-display" style={{ fontSize: 'clamp(22px, 3.5vw, 44px)', marginBottom: 18, whiteSpace: 'nowrap' }}>
          Let's <span style={{ color: '#FF5C00' }}>work</span> together
        </h2>

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 32, alignItems: 'start', flex: 1, minHeight: 0 }}>

          {/* LEFT — info panel */}
          <div className="anim-slide-left" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)' }}>
              Whether you have a project idea, want to collaborate, or just want to say hi — my inbox is open.
            </p>

            {/* Contact items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {contactItems.map(({ Icon, label, value, href }) => (
                <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,92,0,0.1)', border: '1px solid rgba(255,92,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color="#FF5C00" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#FF5C00'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}>
                        {value}
                      </a>
                    ) : (
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

            {/* Social links */}
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>Follow Me</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { href: 'https://www.linkedin.com/in/bharath070/', Icon: Linkedin, label: 'LinkedIn', hoverColor: '#0A66C2' },
                  { href: 'https://github.com/BharathKarthick',       Icon: Github,   label: 'GitHub',   hoverColor: '#ffffff' },
                ].map(({ href, Icon, label, hoverColor }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 12, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = hoverColor; e.currentTarget.style.color = hoverColor; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                    <Icon size={14} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="anim-slide-right" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px' }}>
            {status === 'success' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '32px 0', textAlign: 'center' }}>
                <CheckCircle size={48} color="#FF5C00" />
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 20 }}>Message Sent!</h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Thanks for reaching out. I'll reply soon.</p>
              </div>
            ) : (
              <form ref={form} onSubmit={sendEmail} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>Your Name</label>
                    <input type="text" name="user_name" placeholder="P. Bharath" required className="input-dark" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>Email Address</label>
                    <input type="email" name="user_email" placeholder="hello@example.com" required className="input-dark" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 6 }}>Message</label>
                  <textarea name="message" placeholder="Tell me about your project..." required rows="4" className="input-dark" style={{ resize: 'vertical', minHeight: 100 }} />
                </div>

                <button type="submit" disabled={status === 'sending'} className="btn-orange" style={{ justifyContent: 'center', opacity: status === 'sending' ? 0.7 : 1, cursor: status === 'sending' ? 'not-allowed' : 'pointer' }}>
                  <Send size={15} />
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                {status === 'error' && <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#ff4444', textAlign: 'center' }}>Failed to send. Please try again.</p>}
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>© 2025 P. Bharath. Crafted with care in Chennai.</p>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.25)' }}><span style={{ color: '#FF5C00' }}>@</span> Thank you for visiting.</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;