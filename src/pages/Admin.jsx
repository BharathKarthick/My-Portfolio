import { useEffect, useState } from "react";
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const TOKEN_KEY = "portfolio_admin_token";

export default function Admin() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const savedToken = sessionStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        if (!cancelled) setCheckingSession(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/settings/home`, {
          headers: { Authorization: `Bearer ${savedToken}` },
        });

        if (!response.ok) {
          sessionStorage.removeItem(TOKEN_KEY);
          if (!cancelled) setToken("");
        } else if (!cancelled) {
          setToken(savedToken);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to verify your session.");
        }
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogin({ username, password }) {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok || !data.token) {
        throw new Error(data.message || "Invalid username or password.");
      }

      sessionStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setError("");
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black font-['Plus_Jakarta_Sans'] text-white">
        <p className="text-sm text-white/50">Checking admin session...</p>
      </main>
    );
  }

  if (token) {
    return <Dashboard token={token} onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} loading={loading} error={error} />;
}