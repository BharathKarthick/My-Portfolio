import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import myImage from "../image/my image.jpg";
import resumePDF from "../assets/Resume(Bharath.P).pdf";
import "../App.css";

const About = () => {
  return (
    <div className="min-h-screen bg-[#121062] bg-cover bg-center">
      <Navbar />

      {/* Animated Container box */}
      <div
        className=" about flex flex-col md:flex-col lg:flex-row font-stylish items-center justify-center gap-6 p-4 md:p-10 mt-5 bg-black/30 backdrop-blur-md rounded-xl mx-4 md:mx-auto md:max-w-2xl lg:max-w-4xl shadow-lg animate-fadeInRight"
      >
        {/* Image Box (30%) */}
        <div className="  w-full md:w-1/3">
          <img
            src={myImage}
            alt="Bharath"
            className="ima rounded-xl shadow-md w-1/2 mx-auto md:w-full"
          />
        </div>

        {/* Content Box (70%) */}
        <div className="w-full lg:w-2/3 text-justify text-white">
          <h2 className="text-3xl text-center font-bold text-[#00ffea] mb-2">About Me</h2>
          <p className="text-xl leading-relaxed mb-4">
            <span className="font-bold text-3xl text-[#ff4500]">
              I'm Bharath.
            </span>
            <br />
            I recently completed an internship in frontend web development at
            Walk Horizons, where I honed my skills and created a web page titled{" "}
            <strong>"KJ Fitness."</strong> During this period, I developed a
            strong foundation in modern web technologies and design principles.
          </p>
          <p className="text-xl leading-relaxed">
            Additionally, I worked on a significant project over six months with
            The MindIT Solution, focusing on deep learning. This project, titled{" "}
            <strong>"Smart ATM,"</strong> involved developing advanced algorithms
            to enhance ATM functionalities, leveraging the power of artificial
            intelligence to improve security and user experience.
          </p>
          <div className="flex justify-center md:justify-start">
            {/* ✅ Download Resume Button */}
            <a
              href={resumePDF}
              download="Bharath_Resume.pdf"
              className="mt-4 px-6 py-3 bg-[#ff4500]  text-white rounded-2xl hover:bg-white hover:text-[#ff4500] transition border-2 border-transparent hover:border-[#ff4500]"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>

      {/* Back Arrow Button */}
      <BackArrow />
    </div>
  );
};

export default About;