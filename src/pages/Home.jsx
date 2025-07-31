import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import background from "../image/image1.jpg";
import "../App.css";

const jobTitles = ["Web Developer", "UI/UX Designer"];

function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % jobTitles.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat text-white pt-20"
        style={{ backgroundImage: `url(${background})` }}
      >
        <Navbar />

        {/* Content Section */}
        <div className=" cont flex items-center h-full px-6 md:px-48">
          <div className="flex flex-col font-stylish space-y-4 text-left">
            <p className="text-2xl md:text-[32px]">Hello</p>

            <h1 className="text-4xl md:text-[42px] lg:text-6xl font-bold flex flex-wrap gap-2">
              <span>I am a</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-r from-[#ff00c3] via-white to-[#ffc400] bg-clip-text text-transparent font-bold"
                >
                  {jobTitles[index]}
                </motion.span>
              </AnimatePresence>
            </h1>

            <p className="text-2xl lg:text-3xl">From Chennai</p>

            <a
              href="/contact"
              className="inline-block w-fit mt-6 px-6 py-3 bg-[#ff4500] text-lg md:text-xl text-white rounded-full hover:bg-white hover:text-[#ff4500] transition border-2 border-transparent hover:border-[#ff4500]"
            >
              Hire Me
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
