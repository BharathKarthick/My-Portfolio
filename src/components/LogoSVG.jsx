import PropTypes from "prop-types";
import logoImg from "../assets/logo1.png";

export default function LogoSVG({ size = 44, className = "" }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logoImg}
        alt="PB Logo"
        width={size}
        height={size}
        className="w-full h-full object-contain filter transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}

LogoSVG.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};