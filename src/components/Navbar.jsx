import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoSVG from "./LogoSVG";
import { X, Menu } from "lucide-react";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "About", path: "/about" },
    { name: "Skills", path: "/skill" },
    { name: "Experience", path: "/experience" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 border-b border-[#FF5C00]/20 backdrop-blur-xl' : 'bg-black/60 border-b border-transparent backdrop-blur-md'
      }`}>
        {/* Responsive Container: 90% mobile, 80% md/desktop */}
        <div className="w-[90%] md:w-[80%] mx-auto h-20 flex items-center justify-between">
          <Link to="/home" className="flex items-center no-underline">
            <LogoSVG size={120} />
            {/* <span className="font-['Plus_Jakarta_Sans'] font-bold text-[25px] text-white">
              harath
            </span> */}
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `font-['Plus_Jakarta_Sans'] font-semibold text-base transition-colors duration-200 no-underline ${
                  isActive ? 'text-[#FF5C00]' : 'text-[#cccccc] hover:text-[#FF5C00]'
                }`}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu trigger */}
          <button
            className="lg:hidden p-1 text-white bg-transparent border-none cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-black/95 border-t border-[#FF5C00]/20 px-6 py-6 transition-all">
            {navItems.map((item, i) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `block py-3 font-semibold text-lg no-underline transition-colors ${
                  isActive ? 'text-[#FF5C00]' : 'text-[#cccccc]'
                } ${i < navItems.length - 1 ? 'border-b border-white/10' : ''}`}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
      <div className="h-16" />
    </>
  );
}

export default Navbar;