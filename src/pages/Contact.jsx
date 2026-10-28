import { useRef, useState } from "react";
import emailjs from "emailjs-com";
import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import { Send, Linkedin, Github, Mail, CheckCircle, MapPin, User, Phone } from "lucide-react";
import SEO from "../seo/SEO";
import seoData from "../seo/seoData";

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState("idle");

  const sendEmail = (e) => {
    e.preventDefault();
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    if (!publicKey || !serviceId || !templateId) {
      alert("Missing EmailJS config. Check .env");
      return;
    }
    setStatus("sending");
    emailjs.sendForm(serviceId, templateId, form.current, publicKey).then(
      () => {
        setStatus("success");
        form.current.reset();
        setTimeout(() => setStatus("idle"), 4000);
      },
      () => {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    );
  };

  const contactItems = [
    { Icon: User, label: "Full Name", value: "P. Bharath", href: null },
    { Icon: Phone, label: "WhatsApp", value: "+91 8608975629", href: "https://wa.me/918608975629" },
    { Icon: Mail, label: "Email", value: "pbharath6001@gmail.com", href: "mailto:pbharath6001@gmail.com" },
    { Icon: MapPin, label: "Location", value: "Chennai, Tamil Nadu", href: null },
  ];

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden bg-black text-white font-['Plus_Jakarta_Sans'] flex flex-col justify-between">
      <SEO {...seoData.contact} />
      <div className="dot-grid" />
      <div className="fixed bottom-0 right-0 w-113 h-113 rounded-full bg-[radial-gradient(circle,rgba(255,92,0,0.08)_0%,transparent_70%)] pointer-events-none z-0" />

      <Navbar />
      <BackArrow />

      {/* Main Container: 90% mobile, 80% md/desktop */}
      <main className="relative z-10 w-[90%] md:w-[80%] mx-auto flex-1 flex flex-col justify-center py-6 sm:py-8 lg:py-0">
        
        {/* Form and Info Section */}
        <div className="w-full my-auto py-4 lg:py-2">
          <div className="flex items-center gap-2.5 font-['DM_Mono'] text-xs text-[#FF5C00] tracking-[3px] uppercase mb-1">
            <span className="w-7 h-px bg-[#FF5C00]" />
            Get In Touch
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Let&apos;s <span className="text-[#FF5C00]">work</span> together
          </h2>

          {/* Stacking: மொபைல் மற்றும் டேப்லெட்டில் 1 காலம் (மேல்-கீழ்), லேப்டாப்பில் 2 காலம் */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.45fr] gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-start">
            
            {/* Info Side */}
            <div className="flex flex-col gap-5">
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Whether you have a project idea, want to collaborate, or just want to say hi — my inbox is open.
              </p>

              <div className="flex flex-col gap-3.5">
                {contactItems.map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-lg bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-[#FF5C00]" />
                    </div>
                    <div>
                      <div className="font-['DM_Mono'] text-[9px] text-white/40 tracking-wider uppercase mb-0.5">
                        {label}
                      </div>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-white/80 hover:text-[#FF5C00] transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm text-white/80">{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <div className="font-['DM_Mono'] text-[9px] text-white/40 tracking-widest uppercase mb-2.5">
                  Follow Me
                </div>
                <div className="flex gap-3">
                  {[
                    { href: "https://www.linkedin.com/in/bharath070/", Icon: Linkedin, label: "LinkedIn" },
                    { href: "https://github.com/BharathKarthick", Icon: Github, label: "GitHub" },
                  ].map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-white/4 border border-white/10 rounded-lg text-white/70 font-semibold text-xs transition-all hover:border-[#FF5C00] hover:text-[#FF5C00]"
                    >
                      <Icon size={14} /> {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="bg-white/2 border border-white/10 rounded-2xl p-5 sm:p-7 shadow-lg">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                  <CheckCircle size={44} className="text-[#FF5C00]" />
                  <h3 className="font-bold text-lg sm:text-xl text-white">Message Sent!</h3>
                  <p className="text-white/50 text-xs sm:text-sm">Thanks for reaching out. I&apos;ll reply soon.</p>
                </div>
              ) : (
                <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-['DM_Mono'] text-[10px] text-white/40 tracking-wider uppercase mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="user_name"
                        placeholder="P. Bharath"
                        required
                        className="w-full bg-white/4 border border-white/10 rounded-lg px-4 py-3 text-white text-xs sm:text-sm outline-none focus:border-[#FF5C00] placeholder:text-white/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-['DM_Mono'] text-[10px] text-white/40 tracking-wider uppercase mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="user_email"
                        placeholder="hello@example.com"
                        required
                        className="w-full bg-white/4 border border-white/10 rounded-lg px-4 py-3 text-white text-xs sm:text-sm outline-none focus:border-[#FF5C00] placeholder:text-white/30 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-['DM_Mono'] text-[10px] text-white/40 tracking-wider uppercase mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      placeholder="Tell me about your project..."
                      required
                      rows="4"
                      className="w-full bg-white/4 border border-white/10 rounded-lg px-4 py-3 text-white text-xs sm:text-sm outline-none focus:border-[#FF5C00] placeholder:text-white/30 resize-y min-h-22.5 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-[#FF5C00] text-white font-semibold text-xs sm:text-sm rounded-lg border-2 border-[#FF5C00] hover:bg-transparent hover:text-[#FF5C00] transition-all cursor-pointer disabled:opacity-60"
                  >
                    <Send size={15} />
                    {status === "sending" ? "Sending..." : "Send Message"}
                  </button>

                  {status === "error" && (
                    <p className="text-red-500 text-xs text-center mt-1">Failed to send. Please try again.</p>
                  )}
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Footer: இருபுறமும் 80% கன்டெய்னர் இடைவெளி, மொபைலில் சென்டர் அலைன்மென்ட், போதிய டாப்/பாட்டம் உயரம் */}
      <footer className="w-full mx-auto border-t md:px-10 border-white/10 py-6 sm:py-7 mt-auto flex flex-col sm:flex-row justify-between items-center gap-2.5 text-center sm:text-left text-white/50 font-['DM_Mono'] text-xs sm:text-[13px]">
        <p>© 2025 P. Bharath. Crafted with care in Chennai.</p>
        <p>
          <span className="text-[#FF5C00]">@</span> Thank you for visiting.
        </p>
      </footer>
    </div>
  );
};

export default Contact;