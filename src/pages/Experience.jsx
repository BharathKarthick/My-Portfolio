import { useState } from "react";
import "../App.css";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";

const Experience = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 2);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + 2) % 2);
  };

  // Removed framer-motion variants

  return (
    <div className="relative min-h-screen font-stylish overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundColor: "#121062" }}
      />

      {/* Top Navbar */}
      <div className="relative">
        <Navbar />
        <BackArrow />
      </div>

      {/* Experience Content */}
      <div className=" exp relative flex flex-col items-center md:mt-5 lg:mt-12 z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#00ffea] mb-6">
          Experience
        </h2>

        {/* Experience Card with Animation */}
        <div className="exp1 relative w-[78%] lg:w-full md:w[70%] max-w-4xl h-auto min-h-[400px]">
          {currentIndex === 0 && (
            <div className="bg-black/30 backdrop-blur-lg p-8 md:p-10 rounded-2xl shadow-lg animate-fadeInLeft">
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                Intern - Magic Bus India Foundation
              </h3>
              <div className="h-[2px] bg-white/50 w-full mt-2" />
              <p className="text-md md:text-lg text-gray-200 mt-2">
                November 2024 – January 2025
              </p>
              <p className="text-xl md:text-2xl font-semibold text-white mt-2">
                Web Designer – Front‑End Developer / UI / UX Designer
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-white">
                    Front‑End Development :
                  </h4>
                  <p className="text-md md:text-lg text-gray-200">
                    HTML5, CSS3, JavaScript, Tailwind CSS, React.Js, Node.Js,
                    MongoDB, WordPress, Responsive Design
                  </p>
                </div>
                <div className="flex gap-2">
                  <h4 className="text-lg md:text-xl font-semibold text-white">
                    UI / UX Design :
                  </h4>
                  <p className="text-md md:text-lg text-gray-200">Figma</p>
                </div>
                <div className="md:flex gap-2">
                  <h4 className="text-lg md:text-xl font-semibold text-white">
                    Version Control & Tools :
                  </h4>
                  <p className="text-md md:text-lg text-gray-200">
                    Git, GitHub
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentIndex === 1 && (
            <div className="bg-black/30 backdrop-blur-lg p-8 md:p-10 rounded-2xl shadow-lg animate-fadeInRight">
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                Intern - Walk Horizons
              </h3>
              <div className="h-[2px] bg-white/50 w-full mt-2" />
              <p className="text-md md:text-lg text-gray-200 mt-2">
                May 2023 – July 2023
              </p>
              <p className="text-xl md:text-2xl font-semibold text-white mt-2">
                Front‑End Developer – Web Designer
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-white">
                    Front‑End Development :
                  </h4>
                  <p className="text-md md:text-lg text-gray-200">
                    HTML5, CSS3, JavaScript, WordPress, Responsive Design
                  </p>
                </div>
                <div className="flex gap-2">
                  <h4 className="text-lg md:text-xl font-semibold text-white">
                    Tool :
                  </h4>
                  <p className="text-md md:text-lg text-gray-200">
                    Elementor
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Dots Indicator - with reduced margin */}
        <div className="flex justify-center items-center gap-3 mt-4 md:mt-4">
          {[0, 1].map((index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-[#ff4500]" : "bg-white/30"
              }`}
            ></div>
          ))}
        </div>
        </div>

        {/* Arrows Navigation */}
        <div className="flex justify-center items-center gap-8 md:gap-14 mt-3 md:mt-2">
          <ArrowLeftCircle
            size={typeof window !== "undefined" && window.innerWidth < 768 ? 30 : 40}
            className="text-white cursor-pointer hover:scale-110 transition"
            onClick={handlePrev}
          />
          <ArrowRightCircle
            size={typeof window !== "undefined" && window.innerWidth < 768 ? 30 : 40}
            className="text-white cursor-pointer hover:scale-110 transition"
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default Experience;