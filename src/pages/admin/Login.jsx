import { useState } from "react";
import PropTypes from "prop-types";
import { Lock, User, ArrowRight } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Login({ onLogin, loading, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onLogin({ username: username.trim(), password });
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-black px-4 py-8 text-white font-['Plus_Jakarta_Sans']">
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-125 h-80 sm:h-125 rounded-full bg-[radial-gradient(circle,rgba(255,92,0,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Mobile view-il cross-aamal perfectly center aaga w-full max-w-md matrum mx-auto */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <section className="rounded-2xl border border-[#FF5C00]/30 bg-[#0a0a0a]/95 p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-[#FF5C00]/40 bg-[#FF5C00]/10 text-[#FF5C00]">
            <img src={logo} alt="Logo" className="h-9 w-9 sm:h-11 sm:w-11 object-contain" />
          </div>

          <header className="mb-5 sm:mb-6 text-center">
            <p className="font-['DM_Mono'] text-[10px] uppercase tracking-[3px] text-[#FF5C00] mb-1">
              Admin Portal
            </p>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-white/50 mt-1">
              Sign in to manage your portfolio content.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block font-['DM_Mono'] text-[10px] text-white/40 tracking-wider uppercase mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-white/40">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-white outline-none focus:border-[#FF5C00]"
                />
              </div>
            </div>

            <div>
              <label className="block font-['DM_Mono'] text-[10px] text-white/40 tracking-wider uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-white/40">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-white outline-none focus:border-[#FF5C00]"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FF5C00] text-white font-semibold text-sm transition hover:bg-[#cc4900] disabled:opacity-60 cursor-pointer"
            >
              <span>{loading ? "Signing in..." : "Sign in to Dashboard"}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs text-white/40 hover:text-[#FF5C00] transition-colors no-underline"
            >
              ← Back to Portfolio
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};