import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ConfirmationModal from "../../components/ConfirmationModal";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DEFAULT_HOME = {
  roleTitles: [
    "UI/UX Designer",
    "Web Developer",
    "Front-End Engineer",
  ],
  location: "Chennai, Tamil Nadu, India",
  experienceYears: 2,
  terminalName: "P. Bharath",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#FF5C00]";

const labelClass = "text-sm font-semibold text-white/90";

export default function HomeManagement({ token }) {
  const [form, setForm] = useState(DEFAULT_HOME);
  const [initialState, setInitialState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const loadHomeSettings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/settings/home`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load Home settings.");
      }

      const home = data.home || {};
      const loaded = {
        roleTitles:
          Array.isArray(home.roleTitles) && home.roleTitles.length > 0
            ? home.roleTitles
            : DEFAULT_HOME.roleTitles,
        location: home.location ?? DEFAULT_HOME.location,
        experienceYears: Number(home.experienceYears ?? DEFAULT_HOME.experienceYears),
        terminalName: home.terminalName ?? DEFAULT_HOME.terminalName,
      };

      setForm(loaded);
      setInitialState(JSON.stringify(loaded));
    } catch (err) {
      setError(err.message || "Unable to load Home settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeSettings();
  }, [loadHomeSettings]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateRole(index, value) {
    setForm((current) => ({
      ...current,
      roleTitles: current.roleTitles.map((role, roleIndex) =>
        roleIndex === index ? value : role,
      ),
    }));
  }

  function addRole() {
    setForm((current) => ({
      ...current,
      roleTitles: [...current.roleTitles, ""],
    }));
  }

  function removeRole(index) {
    setForm((current) => ({
      ...current,
      roleTitles: current.roleTitles.filter(
        (_, roleIndex) => roleIndex !== index,
      ),
    }));
    setError("");
  }

  const currentComparable = JSON.stringify({
    roleTitles: form.roleTitles.map((r) => r.trim()),
    location: form.location.trim(),
    experienceYears: Number(form.experienceYears),
    terminalName: form.terminalName.trim(),
  });

  const hasChanges = currentComparable !== initialState;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    // எந்த மாற்றமும் செய்யாமல் Save கிளிக் செய்தால் எதுவும் நடக்காது
    if (!hasChanges) {
      return;
    }

    setSaving(true);

    const roleTitles = form.roleTitles.map((role) => role.trim());

    if (roleTitles.length === 0 || roleTitles.some((role) => !role)) {
      setError("Add at least one role title and complete every role field.");
      setSaving(false);
      return;
    }

    if (!form.location.trim()) {
      setError("Location cannot be empty.");
      setSaving(false);
      return;
    }

    if (!form.terminalName.trim()) {
      setError("Name cannot be empty.");
      setSaving(false);
      return;
    }

    const experienceYears = Number(form.experienceYears);

    if (!Number.isInteger(experienceYears) || experienceYears < 0) {
      setError("Experience years must be a whole number of 0 or more.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        roleTitles,
        location: form.location.trim(),
        experienceYears,
        terminalName: form.terminalName.trim(),
      };

      const response = await fetch(`${API_URL}/api/settings/admin/home`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save Home settings.");
      }

      setInitialState(JSON.stringify(payload));
      setIsSuccessModalOpen(true);
    } catch (err) {
      setError(err.message || "Unable to save Home settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6 text-white font-['Plus_Jakarta_Sans']">
      <div>
        <p className="font-['DM_Mono'] text-xs font-semibold uppercase tracking-[3px] text-[#FF5C00]">
          Management
        </p>
        <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
          Home Management
        </h2>
        <p className="mt-1 text-sm text-white/60">
          Manage the role animations, location, display name, and experience years shown on your homepage.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 text-sm text-white/50">
          Loading Home settings...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 sm:p-7"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <label className={labelClass}>Animated Role Titles</label>
                <p className="mt-0.5 text-xs text-white/40">
                  Add the roles you want to cycle through on the homepage.
                </p>
              </div>

              <button
                type="button"
                onClick={addRole}
                className="rounded-lg border border-[#FF5C00]/40 bg-[#FF5C00]/10 px-3 py-2 text-xs font-semibold text-[#FF5C00] transition hover:bg-[#FF5C00] hover:text-white cursor-pointer"
              >
                + Add Role
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {form.roleTitles.map((role, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-6 text-xs text-white/40 font-['DM_Mono']">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <input
                    type="text"
                    value={role}
                    onChange={(event) => updateRole(index, event.target.value)}
                    placeholder="e.g. UI/UX Designer"
                    required
                    className="flex-1 rounded-xl border border-white/10 bg-[#111111] px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF5C00]"
                  />
                  <button
                    type="button"
                    onClick={() => removeRole(index)}
                    disabled={form.roleTitles.length === 1}
                    className="rounded-lg border border-red-500/30 px-3 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-30 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="terminalName" className={labelClass}>
                Full Name
              </label>
              <input
                id="terminalName"
                name="terminalName"
                type="text"
                value={form.terminalName}
                onChange={updateField}
                maxLength={100}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={updateField}
                placeholder="e.g. Chennai, Tamil Nadu, India"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="experienceYears" className={labelClass}>
              Years of Experience
            </label>
            <input
              id="experienceYears"
              name="experienceYears"
              type="number"
              min="0"
              step="1"
              value={form.experienceYears}
              onChange={updateField}
              className={inputClass}
              required
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#FF5C00] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#cc4900] disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : "Save Home Settings"}
            </button>
          </div>
        </form>
      )}

      <ConfirmationModal
        isOpen={isSuccessModalOpen}
        title="Home Settings Updated!"
        message={`Homepage settings for "${form.terminalName}" have been saved successfully.`}
        confirmText="Done"
        cancelText="Close"
        variant="success"
        onConfirm={() => setIsSuccessModalOpen(false)}
        onCancel={() => setIsSuccessModalOpen(false)}
      />
    </section>
  );
}

HomeManagement.propTypes = {
  token: PropTypes.string.isRequired,
};