import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Plus, Edit, Trash2, Briefcase } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function emptyExperienceForm(initialOrder = 1) {
  return {
    company: "",
    role: "",
    period: "",
    type: "Intern",
    skills: "",
    highlights: "",
    order: initialOrder,
  };
}

function ExperienceForm({ token, experience, initialOrder, onCancel, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => {
    if (!experience) return emptyExperienceForm(initialOrder);
    return {
      company: experience.company || "",
      role: experience.role || "",
      period: experience.period || "",
      type: experience.type || "Intern",
      skills: Array.isArray(experience.skills) ? experience.skills.join(", ") : "",
      highlights: Array.isArray(experience.highlights) ? experience.highlights.join("\n") : "",
      order: experience.order ?? 1,
    };
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  const initialSkills = Array.isArray(experience?.skills)
    ? experience.skills.map((s) => s.trim()).filter(Boolean).join(", ")
    : "";
  const currentSkills = form.skills.split(",").map((s) => s.trim()).filter(Boolean).join(", ");

  const initialHighlights = Array.isArray(experience?.highlights)
    ? experience.highlights.map((h) => h.trim()).filter(Boolean).join("\n")
    : "";
  const currentHighlights = form.highlights.split("\n").map((h) => h.trim()).filter(Boolean).join("\n");

  const hasChanges =
    !experience ||
    form.company.trim() !== (experience.company || "").trim() ||
    form.role.trim() !== (experience.role || "").trim() ||
    form.period.trim() !== (experience.period || "").trim() ||
    form.type.trim() !== (experience.type || "Intern").trim() ||
    currentSkills !== initialSkills ||
    currentHighlights !== initialHighlights ||
    Number(form.order) !== Number(experience.order ?? 1);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (experience && !hasChanges) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        company: form.company.trim(),
        role: form.role.trim(),
        period: form.period.trim(),
        type: form.type.trim(),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        highlights: form.highlights.split("\n").map((h) => h.trim()).filter(Boolean),
        order: Number(form.order),
      };

      const response = await fetch(
        experience
          ? `${API_URL}/api/admin/experiences/${experience._id}`
          : `${API_URL}/api/admin/experiences`,
        {
          method: experience ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save experience.");
      }
      onSaved(experience ? "updated" : "created", payload.company);
    } catch (submitError) {
      setError(submitError.message || "Unable to save experience.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white font-['Plus_Jakarta_Sans']">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{experience ? "Edit Experience" : "Add New Experience"}</h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/75 hover:bg-white/5 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Company Name *</label>
          <input
            name="company"
            value={form.company}
            onChange={updateField}
            required
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="e.g. Magic Bus India Foundation"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Role / Title *</label>
          <input
            name="role"
            value={form.role}
            onChange={updateField}
            required
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="e.g. Front-End Developer"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Period *</label>
          <input
            name="period"
            value={form.period}
            onChange={updateField}
            required
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="e.g. November 2024 – January 2025"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Employment Type</label>
          <input
            name="type"
            value={form.type}
            onChange={updateField}
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="e.g. Intern"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Highlights (One per line) *</label>
          <textarea
            name="highlights"
            value={form.highlights}
            onChange={updateField}
            required
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="Built responsive web pages&#10;Collaborated with back-end team"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Technologies / Skills (comma-separated)</label>
          <input
            name="skills"
            value={form.skills}
            onChange={updateField}
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="React.js, Tailwind CSS, JavaScript, MongoDB"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Display Order</label>
          <input
            type="number"
            name="order"
            value={form.order}
            onChange={updateField}
            min="0"
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#FF5C00] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#cc4900] disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Saving..." : experience ? "Update Experience" : "Save Experience"}
        </button>
      </div>
    </form>
  );
}

ExperienceForm.propTypes = {
  token: PropTypes.string.isRequired,
  experience: PropTypes.object,
  initialOrder: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};

export default function ExperienceManagement({ token }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [modal, setModal] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/experiences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setExperiences(data.experiences || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    const deletedCompany = pendingDelete.company;
    try {
      const res = await fetch(`${API_URL}/api/admin/experiences/${pendingDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setExperiences((curr) => curr.filter((e) => e._id !== pendingDelete._id));
        setPendingDelete(null);
        setModal({
          type: "success",
          variant: "success",
          title: "Experience Deleted!",
          message: `"${deletedCompany}" experience has been deleted successfully.`,
          confirmText: "Done",
          cancelText: "Close",
        });
      }
    } catch (err) {
      console.error(err);
      setModal(null);
      setPendingDelete(null);
    }
  }

  return (
    <section className="space-y-6 text-white font-['Plus_Jakarta_Sans']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="font-['DM_Mono'] text-xs uppercase tracking-[3px] text-[#FF5C00]">Management</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Experience Management</h2>
        </div>

        {/* Count Badge + Add Button Container */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="inline-flex items-center px-3 py-2 rounded-xl bg-[#FF5C00]/10 border border-[#FF5C00]/30 font-['DM_Mono'] text-xs font-bold text-[#FF5C00]">
            {experiences.length} Records
          </span>

          {!showForm && (
            <button
              onClick={() => { setEditingExp(null); setShowForm(true); }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF5C00] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#cc4900] cursor-pointer"
            >
              <Plus size={18} /> Add Experience
            </button>
          )}
        </div>
      </div>

      {showForm ? (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
          <ExperienceForm
            token={token}
            experience={editingExp}
            initialOrder={experiences.length + 1}
            onCancel={() => { setShowForm(false); setEditingExp(null); }}
            onSaved={async (action, companyName) => {
              setShowForm(false);
              setEditingExp(null);
              await loadExperiences();
              setModal({
                type: "success",
                variant: "success",
                title: action === "created" ? "Experience Added!" : "Experience Updated!",
                message:
                  action === "created"
                    ? `"${companyName}" experience has been added successfully.`
                    : `"${companyName}" experience has been updated successfully.`,
                confirmText: "Done",
                cancelText: "Close",
              });
            }}
          />
        </div>
      ) : loading ? (
        <p className="text-white/70 text-sm">Loading experiences...</p>
      ) : experiences.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
          <Briefcase size={40} className="mx-auto text-[#FF5C00] mb-3" />
          <p className="text-white/80">No experience records added yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {experiences.map((exp) => (
            <div key={exp._id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 flex flex-col justify-between">
              <div>
                <span className="font-['DM_Mono'] text-[10px] text-[#FF5C00] uppercase">{exp.type}</span>
                <h3 className="font-bold text-lg text-white mt-1">{exp.company}</h3>
                <p className="text-xs text-white/60">{exp.role}</p>
                <p className="text-[11px] font-['DM_Mono'] text-white/40 mt-1">{exp.period}</p>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={() => { setEditingExp(exp); setShowForm(true); }}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setPendingDelete(exp);
                    setModal({
                      type: "confirmDelete",
                      title: "Delete Experience?",
                      message: `Are you sure you want to delete "${exp.company}"?`,
                      variant: "danger",
                      confirmText: "Delete",
                      cancelText: "Cancel",
                    });
                  }}
                  className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={Boolean(modal)}
        title={modal?.title || ""}
        message={modal?.message || ""}
        variant={modal?.variant || "danger"}
        confirmText={modal?.confirmText || "Confirm"}
        cancelText={modal?.cancelText || "Close"}
        onConfirm={() => {
          if (modal?.type === "confirmDelete") {
            confirmDelete();
          } else {
            setModal(null);
          }
        }}
        onCancel={() => { setModal(null); setPendingDelete(null); }}
      />
    </section>
  );
}

ExperienceManagement.propTypes = {
  token: PropTypes.string.isRequired,
};