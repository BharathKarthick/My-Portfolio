import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Skill from './pages/Skill';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Intro from './pages/intro';

// ✅ Memory-only flag resets every browser refresh
let introShown = false;

function App() {
  const shouldShowIntro = !introShown;
  if (shouldShowIntro) {
    introShown = true; // Set it true so it won’t repeat again unless browser is refreshed
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={shouldShowIntro ? "/intro" : "/home"} />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skill" element={<Skill />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;

