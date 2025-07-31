import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";

import project1Img from "../image/port1.png";
import project2Img from "../image/proj1.png";
import project3Img from "../image/Frontend mentor.png";
import project4Img from "../image/proj4.png";

const projects = [
  {
    id: 1,
    title: "Portfolio",
    description: "My portfolio showcases the web development projects I’ve built using modern tools and a focus on clean, responsive design.",
    tools: ["HTML5", "CSS3","TailwindCss" , "React Js" , "JavaScript"],
    frontend: "https://github.com/BharathKarthick/My-Portfolio",
    backend: "https://github.com/BharathKarthick/My-Portfolio",
    demo: "/",
    image: project1Img,
  },
  {
    id: 2,
    title: "Coffee Shop Website",
    description: "A vibrant coffee shop website designed with a clean layout and engaging UI to showcase services and enhance online orders.",
    tools: ["HTML5", "CSS3"],
    frontend: "https://github.com/BharathKarthick/Coffee-Website",
    backend: "https://github.com/BharathKarthick/Coffee-Website",
    demo: "https://bharathkarthick.github.io/Coffee-Website/",
    image: project2Img,
  },
  {
    id: 3,
    title: "Frontend Mentor Challenges",
    description: "Completed multiple Frontend Mentor challenges using HTML and CSS to enhance skills in layout structuring, responsive design, and clean UI development.",
    tools: ["HTML5", "CSS3"],
    frontend: "https://github.com/BharathKarthick/product-card",
    backend: "https://github.com/BharathKarthick/columns-preview",
    demo: "https://www.frontendmentor.io/home/my-challenges?tab=completed",
    image: project3Img,
  },
  {
    id: 4,
    title: "Recipe Shopping List Builder",
    description: "Designed an interactive web app to help users select recipes and generate personalized shopping lists based on portion size and preferences.",
    tools: ["HTML5", "CSS3", "JavaScript"],
    frontend: "https://github.com/BharathKarthick/Recipe-Website",
    backend: "https://github.com/BharathKarthick/Recipe-Website",
    demo: "https://bharathkarthick.github.io/Recipe-Website/",
    image: project4Img,
  },
];

const ProjectPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: "absolute",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      position: "absolute",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="h-screen bg-[#121062] bg-cover bg-center overflow-hidden flex flex-col">
      <Navbar />
      <BackArrow />

      <div className=" pro flex flex-col flex-1 justify-between items-center px-4 max-w-2xl mx-auto w-[80%] md:w-full py-4">
        {/* Header */}
        <h1 className="font-bold font-stylish text-2xl md:text-5xl mb-3 md:mb-0 text-[#00ffea] text-center">
          My Projects
        </h1>

        {/* Project card area */}
        <div className="relative w-full max-w-3xl flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={projects[currentIndex].id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-black/40 backdrop-blur-lg rounded-2xl text-white shadow-lg w-full p-6 text-center"
            >
              <a
                href={projects[currentIndex].demo}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={projects[currentIndex].image}
                  alt={projects[currentIndex].title}
                  className="w-full h-52 object-cover font-stylish mx-auto rounded-xl mb-4"
                />
              </a>
              <h2 className="text-2xl font-bold font-stylish mb-2">
                {projects[currentIndex].title}
              </h2>
              <p className="text-sm md:text-[16px] mb-3 font-stylish lg:w-[80%] mx-auto md:w-[80%] ">
                {projects[currentIndex].description}
              </p>
              <p className="mb-3 text-sm md:text-lg italic font-stylish">
                 {projects[currentIndex].tools.join(", ")}
              </p>
              <div className="flex justify-center gap-4 mt-2">
                <a
                  href={projects[currentIndex].frontend}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded shadow"
                >
                  Frontend
                </a>
                <a
                  href={projects[currentIndex].backend}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded shadow"
                >
                  Backend
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Arrows */}
        <div className="flex justify-center items-center gap-8 md:gap-14 mt-2 md:mt-2">
          <ArrowLeftCircle
            className="text-white cursor-pointer hover:scale-110 transition size-8 md:size-12"
            onClick={handlePrev}
          />
          <ArrowRightCircle
            className="text-white cursor-pointer hover:scale-110 transition size-8 md:size-12"
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
