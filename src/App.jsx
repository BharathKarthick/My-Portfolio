import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useState } from "react";

const Intro      = lazy(() => import("./pages/Intro"));
const Home       = lazy(() => import("./pages/Home"));
const About      = lazy(() => import("./pages/About"));
const Skill      = lazy(() => import("./pages/Skill"));
const Experience = lazy(() => import("./pages/Experience"));
const Projects   = lazy(() => import("./pages/Projects"));
const Contact    = lazy(() => import("./pages/Contact"));

const Loader = () => (
  <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{
      width: 40, height: 40,
      border: '2px solid rgba(255,92,0,0.2)',
      borderTop: '2px solid #FF5C00',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  </div>
);

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {/* ✅ Intro Overlay */}
      {showIntro && <Intro onDone={() => setShowIntro(false)} />}

      <HashRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/home"       element={<Home />} />
            <Route path="/about"      element={<About />} />
            <Route path="/skill"      element={<Skill />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects"   element={<Projects />} />
            <Route path="/contact"    element={<Contact />} />
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  );
}

export default App;