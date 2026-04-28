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
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(255,92,0,0.2)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <LogoSVG size={36} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 15, color: 'white' }}>P. Bharath</span>
          </Link>

          {/* Desktop nav */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {navItems.map((item) => (
              <NavLink key={item.name} to={item.path} style={({ isActive }) => ({
                color: isActive ? '#FF5C00' : '#cccccc',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600, fontSize: 14,
                textDecoration: 'none', transition: 'color 0.2s',
              })}>{item.name}</NavLink>
            ))}
          </div>

          <button className="hide-desktop" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="hide-desktop" style={{ background: 'rgba(0,0,0,0.97)', borderTop: '1px solid rgba(255,92,0,0.15)', padding: '20px 24px 28px' }}>
            {navItems.map((item, i) => (
              <NavLink key={item.name} to={item.path} style={({ isActive }) => ({
                display: 'block', padding: '14px 0',
                color: isActive ? '#FF5C00' : '#cccccc',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600, fontSize: 18, textDecoration: 'none',
                borderBottom: i < navItems.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                transition: 'color 0.2s',
              })}>{item.name}</NavLink>
            ))}
          </div>
        )}
      </nav>
      <div style={{ height: 64 }} />
    </>
  );
}

export default Navbar;