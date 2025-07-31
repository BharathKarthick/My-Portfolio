import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../image/logo.png";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Me", path: "/about" },
    { name: "Skill", path: "/skill" },
    { name: "Experience", path: "/experience" },
    { name: "Project", path: "/projects" },
    { name: "Contact Me", path: "/contact" },
  ];

  return (
    <>
      {/* Spacer to prevent overlap */}
      <div className="h-20" />

      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0000023b] font-stylish">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 h-20">
          {/* Logo */}
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="max-h-[100px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-lg md:text-2xl font-medium transition ${
                    isActive ? "text-[#ff4500]" : "text-white"
                  } hover:text-[#ff4500]`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile/Tablet Burger Icon */}
          <button
            className="lg:hidden text-white text-3xl focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile/Tablet Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/10 backdrop-blur-md px-6 py-4 rounded-b-xl font-stylish">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-lg md:text-xl text-center font-medium transition ${
                      isActive ? "text-[#ff4500]" : "text-white"
                    } hover:text-[#ff4500]`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;