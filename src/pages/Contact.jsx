import { useRef, useState } from "react";
import emailjs from "emailjs-com";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Navbar from "../components/Navbar";
import BackArrow from "../components/BackArrow";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Contact = () => {
  const form = useRef();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    if (!publicKey || !serviceId || !templateId) {
      alert("Missing EmailJS configuration. Check your .env file.");
      return;
    }

    emailjs
      .sendForm(serviceId, templateId, form.current, publicKey)
      .then(
        (result) => {
          console.log("Email sent:", result.text);
          setShowSuccess(true);
          form.current.reset();
          setTimeout(() => setShowSuccess(false), 3000);
        },
        (error) => {
          console.error("Email error:", error.text);
          alert("Failed to send message.");
        }
      );
  };

  return (
    <div className="min-h-screen bg-[#121062] text-white flex flex-col relative">
      {/* Blur wrapper */}
      <div
        className={`${
          showSuccess ? "filter blur-sm pointer-events-none" : ""
        } flex-1 flex flex-col`}
      >
        <Navbar />
        <BackArrow />

        {/* Center the form both vertically and horizontally */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="bg-black/30 text-white rounded-2xl shadow-xl p-8 w-[85%] md:w-full max-w-md animate-fadeInRight">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#00ffea]">
              Contact Me
            </h2>
            <form
              ref={form}
              onSubmit={sendEmail}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                name="user_name" // Match this in EmailJS template
                placeholder="Enter your name"
                required
                className="px-4 py-2 rounded-md border focus:outline-none"
              />
              <input
                type="email"
                name="user_email" // Match this in EmailJS template
                placeholder="Enter your email"
                required
                className="px-4 py-2 rounded-md border focus:outline-none"
              />
              <textarea
                name="message" // Match this in EmailJS template
                placeholder="Type your message"
                required
                rows="4"
                className="px-4 py-2 rounded-md border focus:outline-none"
              ></textarea>
              <button
                type="submit"
                className="bg-[#ff4500] text-white py-2 rounded-3xl  hover:bg-white hover:text-[#ff4500] transition border-2 border-transparent hover:border-[#ff4500]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <div className="w-[70%] border-t border-gray-400"></div>
        </div>

        <footer className="flex justify-around items-center p-4 text-sm">
          <div className="flex gap-4">
            <p className=" text-[10px] md:text-[16px]">For Enqueries :</p>
            <a
              href="https://www.linkedin.com/in/bharath070/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff4500] transition "
            >
              <FaLinkedin size={15} className="md:size-5"/>
            </a>
            <a
              href="https://github.com/BharathKarthick"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff4500] transition"
            >
              <FaGithub size={15} className="md:size-5" />
            </a>
          </div>
          <div className="text-right text-[10px] md:text-sm">
            <p>pbharath6001@gmail.com</p>
            <p>
              <span className="text-[#ff4500]">@</span>Thank You For Visiting My
              Portfolio.
            </p>
          </div>
        </footer>
      </div>
      {/* Modal overlay, always centered */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl md:p-15 p-10 flex flex-col items-center gap-4">
            <div className="text-lg font-semibold text-[#121062] mb-2">
              ✅ Message sent successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;