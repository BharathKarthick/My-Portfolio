import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaFigma,
  FaWordpress,
  FaGithub,
  FaNodeJs,
} from "react-icons/fa";
import { SiTailwindcss, SiMongodb } from "react-icons/si";
import "../App.css";

const skills = [
  { name: "HTML", icon: <FaHtml5 className="text-orange-600 text-5xl" /> },
  { name: "CSS", icon: <FaCss3Alt className="text-blue-600 text-5xl" /> },
  { name: "Tailwind", icon: <SiTailwindcss className="text-cyan-400 text-5xl" /> },
  { name: "JavaScript", icon: <FaJs className="text-yellow-400 text-5xl" /> },
  { name: "React", icon: <FaReact className="text-blue-400 text-5xl" /> },
  { name: "Figma", icon: <FaFigma className="text-pink-500 text-5xl" /> },
  { name: "Wordpress", icon: <FaWordpress className="text-blue-800 text-5xl" /> },
  { name: "GitHub", icon: <FaGithub className="text-black text-5xl" /> },
  { name: "MongoDB", icon: <SiMongodb className="text-green-600 text-5xl" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-700 text-5xl" /> },
];

// Animation direction logic for CSS classes
const getAnimationClass = (index) => {
  // 0-4: first row, 5-9: second row
  return index < 5 ? "animate-fadeInUp" : "animate-fadeInDown";
};

const Skill = () => {
  return (
    <div className="relative min-h-screen font-stylish overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundColor: "#121062" }}
      />

      {/* Main Content */}
      <div className="skill relative z-10 text-white">
        <Navbar />
        <BackArrow />

        <div className="p-6 mt-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl  text-[#00ffea] font-bold font-stylish">My Skills</h2>
          </div>

          {/* All cards animate at once without delay */}
          <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 gap-12 justify-items-center align-items-center">
            {skills.map((skill, index) => (
              <div
                key={index}
                className={`bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col items-center w-28 h-28 hover:scale-105 transition transform ${getAnimationClass(index)}`}
              >
                {skill.icon}
                <p className="mt-2 text-md font-semibold text-gray-300">{skill.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skill;