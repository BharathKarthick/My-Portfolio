import { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import HomeManagement from "./HomeManagement";
import AboutManagement from "./AboutManagement";
import ResumeManagement from "./ResumeManagement";
import ProjectManagement from "./ProjectManagement";
import ExperienceManagement from "./ExperienceManagement";
import SkillManagement from "./SkillManagement";
import {
  LayoutDashboard,
  Home,
  User,
  FileText,
  FolderGit2,
  Briefcase,
  Code2,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logo.png";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Dashboard({ token, onLogout }) {
  const [section, setSection] = useState("Overview");
  const [stats, setStats] = useState({ skills: 0, experiences: 0, projects: 0 });
  const tabRefs = useRef([]);

  const navigation = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Home", icon: Home },
    { label: "About", icon: User },
    { label: "Resume", icon: FileText },
    { label: "Skills", icon: Code2 },
    { label: "Experience", icon: Briefcase },
    { label: "Projects", icon: FolderGit2 },
  ];

  // Overview-kku thevaiyaana counts fetch seiyum logic
  const loadStats = useCallback(async () => {
    try {
      const [skillsRes, expRes, projRes] = await Promise.all([
        fetch(`${API_URL}/api/skills`),
        fetch(`${API_URL}/api/experiences`),
        fetch(`${API_URL}/api/projects`),
      ]);
      const [skillsJson, expJson, projJson] = await Promise.all([
        skillsRes.json(),
        expRes.json(),
        projRes.json(),
      ]);

      setStats({
        skills: skillsJson.count ?? (skillsJson.skills || []).length,
        experiences: expJson.count ?? (expJson.experiences || []).length,
        projects: projJson.count ?? (projJson.projects || []).length,
      });
    } catch (err) {
      console.error("Failed to load overview counts:", err);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats, section]);

  // Mobile nav auto-scroll to center
  useEffect(() => {
    const activeIndex = navigation.findIndex((item) => item.label === section);
    if (activeIndex !== -1 && tabRefs.current[activeIndex]) {
      tabRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [section]);

  return (
    <div className="min-h-screen bg-black font-['Plus_Jakarta_Sans'] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF5C00]/40 bg-[#FF5C00]/10 text-[#FF5C00]">
              <img src={logo} alt="Logo" className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Portfolio Admin</h1>
              <p className="text-xs text-white/50">Management Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Administrator
            </span>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8 flex gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block sticky top-24 w-60 shrink-0 rounded-2xl border border-white/10 bg-[#0a0a0a] p-3">
          <p className="px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[2px] text-white/40 font-['DM_Mono']">
            Navigation
          </p>

          <nav className="flex flex-col gap-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = section === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSection(item.label)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition cursor-pointer ${
                    active
                      ? "border border-[#FF5C00]/40 bg-[#FF5C00]/15 text-[#FF5C00]"
                      : "border border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Content */}
        <div className="flex-1 min-w-0 pb-16">
          {/* Mobile Navigation */}
          <div className="flex lg:hidden overflow-x-auto gap-2.5 mb-6 p-1 pb-2.5 border-b border-white/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const active = section === item.label;
              return (
                <button
                  key={item.label}
                  ref={(el) => (tabRefs.current[index] = el)}
                  type="button"
                  onClick={() => setSection(item.label)}
                  className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    active
                      ? "border border-[#FF5C00] bg-[#FF5C00]/15 text-[#FF5C00]"
                      : "border border-white/10 text-white/70 bg-[#0a0a0a] hover:bg-white/5"
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#FF5C00] rounded-t" />
                  )}
                </button>
              );
            })}
            <div className="w-4 shrink-0 lg:hidden pointer-events-none" aria-hidden="true" />
          </div>

          {section === "Overview" && (
            <section className="space-y-6">
              <div>
                <p className="font-['DM_Mono'] text-xs uppercase tracking-[3px] text-[#FF5C00]">
                  Welcome back
                </p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                  Dashboard Overview
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  Select a section from the navigation menu to manage your portfolio.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Home */}
                <button
                  type="button"
                  onClick={() => setSection("Home")}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 text-left transition hover:border-[#FF5C00]/40 hover:bg-[#FF5C00]/5 cursor-pointer"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF5C00]/30 bg-[#FF5C00]/10 text-[#FF5C00]">
                      <Home size={22} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">Home Management</h3>
                    <p className="mt-1 text-sm text-white/50">
                      Edit animated roles, homepage location, and experience years.
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5C00] transition group-hover:translate-x-1">
                    <span>Manage Home</span>
                    <span>→</span>
                  </span>
                </button>

                {/* About */}
                <button
                  type="button"
                  onClick={() => setSection("About")}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 text-left transition hover:border-[#FF5C00]/40 hover:bg-[#FF5C00]/5 cursor-pointer"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF5C00]/30 bg-[#FF5C00]/10 text-[#FF5C00]">
                      <User size={22} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">About Management</h3>
                    <p className="mt-1 text-sm text-white/50">
                      Update your bio, profile picture, location, and role details.
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5C00] transition group-hover:translate-x-1">
                    <span>Manage About</span>
                    <span>→</span>
                  </span>
                </button>

                {/* Resume */}
                <button
                  type="button"
                  onClick={() => setSection("Resume")}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 text-left transition hover:border-[#FF5C00]/40 hover:bg-[#FF5C00]/5 cursor-pointer"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF5C00]/30 bg-[#FF5C00]/10 text-[#FF5C00]">
                      <FileText size={22} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">Resume Management</h3>
                    <p className="mt-1 text-sm text-white/50">
                      Upload or replace the PDF resume available to clients.
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5C00] transition group-hover:translate-x-1">
                    <span>Manage Resume</span>
                    <span>→</span>
                  </span>
                </button>

                {/* Skills Card with Dynamic Count Badge */}
                <button
                  type="button"
                  onClick={() => setSection("Skills")}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 text-left transition hover:border-[#FF5C00]/40 hover:bg-[#FF5C00]/5 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF5C00]/30 bg-[#FF5C00]/10 text-[#FF5C00]">
                        <Code2 size={22} />
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#FF5C00]/10 border border-[#FF5C00]/30 font-['DM_Mono'] text-xs font-bold text-[#FF5C00]">
                        {stats.skills} Skills
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">Skills Management</h3>
                    <p className="mt-1 text-sm text-white/50">
                      Add, update, or remove technical stack items and icons.
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5C00] transition group-hover:translate-x-1">
                    <span>Manage Skills</span>
                    <span>→</span>
                  </span>
                </button>

                {/* Experience Card with Dynamic Count Badge */}
                <button
                  type="button"
                  onClick={() => setSection("Experience")}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 text-left transition hover:border-[#FF5C00]/40 hover:bg-[#FF5C00]/5 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF5C00]/30 bg-[#FF5C00]/10 text-[#FF5C00]">
                        <Briefcase size={22} />
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#FF5C00]/10 border border-[#FF5C00]/30 font-['DM_Mono'] text-xs font-bold text-[#FF5C00]">
                        {stats.experiences} Records
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">Experience Management</h3>
                    <p className="mt-1 text-sm text-white/50">
                      Add, update, or remove work history and experience records.
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5C00] transition group-hover:translate-x-1">
                    <span>Manage Experience</span>
                    <span>→</span>
                  </span>
                </button>

                {/* Project Card with Dynamic Count Badge */}
                <button
                  type="button"
                  onClick={() => setSection("Projects")}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 text-left transition hover:border-[#FF5C00]/40 hover:bg-[#FF5C00]/5 cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF5C00]/30 bg-[#FF5C00]/10 text-[#FF5C00]">
                        <FolderGit2 size={22} />
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#FF5C00]/10 border border-[#FF5C00]/30 font-['DM_Mono'] text-xs font-bold text-[#FF5C00]">
                        {stats.projects} Projects
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-white">Project Management</h3>
                    <p className="mt-1 text-sm text-white/50">
                      Add, update, or remove portfolio projects and images.
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF5C00] transition group-hover:translate-x-1">
                    <span>Manage Projects</span>
                    <span>→</span>
                  </span>
                </button>
              </div>
            </section>
          )}

          {section === "Home" && <HomeManagement token={token} />}
          {section === "About" && <AboutManagement token={token} />}
          {section === "Resume" && <ResumeManagement token={token} />}
          {section === "Skills" && <SkillManagement token={token} />}
          {section === "Experience" && <ExperienceManagement token={token} />}
          {section === "Projects" && <ProjectManagement token={token} />}
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  token: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};