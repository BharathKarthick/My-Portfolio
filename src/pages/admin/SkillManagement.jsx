import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Plus, Edit, Trash2, Code2, ArrowUp, ArrowDown } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LEGACY_ICON_MAP = {
  FaReact: "simple-icons:react", FaNodeJs: "simple-icons:nodedotjs",
  FaHtml5: "simple-icons:html5", FaCss3Alt: "simple-icons:css3", FaGithub: "simple-icons:github",
  SiJavascript: "simple-icons:javascript", SiTypescript: "simple-icons:typescript",
  SiTailwindcss: "simple-icons:tailwindcss", SiExpress: "simple-icons:express",
  SiMongodb: "simple-icons:mongodb", SiPostman: "simple-icons:postman",
  SiNetlify: "simple-icons:netlify", SiRender: "simple-icons:render", SiAmazons3: "simple-icons:amazonaws",
};

const SIMPLE_ICON_ALIASES = { 
  html: "html5", css: "css3", js: "javascript", tailwind: "tailwindcss", 
  node: "nodedotjs", nodejs: "nodedotjs", expressjs: "express", postgres: "postgresql", 
  aws: "amazonaws", amazonaws: "amazonaws", python: "python", mysql: "mysql", 
  react: "react", javascript: "javascript", typescript: "typescript", mongodb: "mongodb", 
  docker: "docker", git: "git", github: "github", java: "java", php: "php", 
  firebase: "firebase", figma: "figma", wordpress: "wordpress", canva: "canva",
};

function normalizeIconIdentifier(icon) {
  const raw = String(icon || "").trim();
  if (!raw) return "";
  if (LEGACY_ICON_MAP[raw]) return LEGACY_ICON_MAP[raw];
  if (raw.includes(":")) return raw.toLowerCase();
  const slug = raw.toLowerCase().replace(/\s+/g, "-");
  return `simple-icons:${SIMPLE_ICON_ALIASES[slug] || slug}`;
}

function iconUrl(icon) {
  const id = normalizeIconIdentifier(icon);
  const match = id.match(/^([a-z0-9-]+):([a-z0-9-]+)$/i);
  if (!match) return null;
  return `https://api.iconify.design/${match[1]}/${match[2]}.svg`;
}

function IconPreview({ icon, color, size = 30 }) {
  const src = iconUrl(icon);
  const [failedSrc, setFailedSrc] = useState("");
  const failed = Boolean(src && failedSrc === src);

  if (!src || failed) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white/5 font-bold text-slate-400"
        style={{ width: size, height: size }}
      >
        {String(icon || "?").trim().slice(0, 1).toUpperCase() || "?"}
      </span>
    );
  }

  return (
    <span
      key={src}
      className="inline-block shrink-0"
      role="img"
      aria-label="Icon preview"
      style={{
        width: size,
        height: size,
        backgroundColor: color || "#FF5C00",
        WebkitMask: `url("${src}") center / contain no-repeat`,
        mask: `url("${src}") center / contain no-repeat`,
      }}
    >
      <img src={src} alt="" width={size} height={size} onError={() => setFailedSrc(src)} style={{ display: "none" }} />
    </span>
  );
}

IconPreview.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
};

const emptyForm = {
  name: "",
  icon: "",
  color: "#FF5C00",
  order: 1,
  published: true,
};

export default function SkillManagement({ token }) {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [modal, setModal] = useState(null);

  const loadSkills = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/skills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load skills.");
      }

      setSkills(Array.isArray(data.skills) ? data.skills : []);
    } catch (err) {
      setError(err.message || "Unable to load skills.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  function startAdd() {
    const nextOrder =
      skills.length > 0
        ? Math.max(...skills.map((skill) => Number(skill.order) || 0)) + 1
        : 1;

    setEditingId(null);
    setForm({
      ...emptyForm,
      order: nextOrder,
    });
    setError("");
    setShowForm(true);
  }

  function startEdit(skill) {
    setEditingId(skill._id);
    setForm({
      name: skill.name || "",
      icon: skill.icon || skill.key || "",
      color: skill.color || "#FF5C00",
      order: skill.order ?? 1,
      published: skill.published ?? true,
    });
    setError("");
    setShowForm(true);
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!form.name.trim()) throw new Error("Please enter a skill name.");
      if (!form.icon.trim()) throw new Error("Please enter an icon name or Iconify identifier.");
      if (!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(form.color)) throw new Error("Please choose a valid hexadecimal color.");
      
      const payload = {
        name: form.name.trim(),
        icon: normalizeIconIdentifier(form.icon),
        key: normalizeIconIdentifier(form.icon), // compatibility with existing schema
        color: form.color,
        order: Number(form.order),
        published: form.published,
      };

      const response = await fetch(
        editingId
          ? `${API_URL}/api/admin/skills/${editingId}`
          : `${API_URL}/api/admin/skills`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save skill.");
      }

      const wasEditing = Boolean(editingId);
      const skillName = payload.name;

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });

      await loadSkills();

      setModal({
        type: "success",
        variant: "success",
        title: wasEditing ? "Skill Updated!" : "Skill Added!",
        message: wasEditing
          ? `"${skillName}" was updated successfully.`
          : `"${skillName}" was added successfully.`,
        confirmText: "Done",
        cancelText: "Close",
      });
    } catch (err) {
      setError(err.message || "Unable to save skill.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;

    const skill = pendingDelete;
    setDeletingId(skill._id);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/skills/${skill._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete skill.");
      }

      setSkills((current) => current.filter((item) => item._id !== skill._id));
      setPendingDelete(null);

      setModal({
        type: "success",
        variant: "success",
        title: "Skill Deleted!",
        message: `"${skill.name}" was deleted successfully.`,
        confirmText: "Done",
        cancelText: "Close",
      });
    } catch (err) {
      setError(err.message || "Unable to delete skill.");
      setModal(null);
      setPendingDelete(null);
    } finally {
      setDeletingId("");
    }
  }

  function closeModal() {
    if (deletingId) return;
    setModal(null);
    setPendingDelete(null);
  }

  return (
    <section className="space-y-6 text-white font-['Plus_Jakarta_Sans']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="font-['DM_Mono'] text-xs uppercase tracking-[3px] text-[#FF5C00]">
            Management
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Skills Management
          </h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="inline-flex items-center px-3 py-2 rounded-xl bg-[#FF5C00]/10 border border-[#FF5C00]/30 font-['DM_Mono'] text-xs font-bold text-[#FF5C00]">
            {skills.length} Skills
          </span>

          {!showForm && (
            <button
              type="button"
              onClick={startAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF5C00] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#cc4900] cursor-pointer"
            >
              <Plus size={18} /> Add Skill
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
          <button
            type="button"
            onClick={loadSkills}
            className="ml-3 font-semibold text-white underline"
          >
            Retry
          </button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 sm:p-7"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-white">
              {editingId ? "Edit Skill" : "Add New Skill"}
            </h3>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setError("");
              }}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/75 hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                Skill Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                required
                maxLength={80}
                placeholder="e.g. MySQL"
                className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                Icon Name or Identifier *
              </label>
              <div className="flex items-center gap-3">
                <input
                  name="icon"
                  value={form.icon}
                  onChange={updateField}
                  required
                  maxLength={100}
                  placeholder="e.g. mysql or logos:docker"
                  className="flex-1 rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
                />
                <div
                  className="w-11 h-11 rounded-xl border border-white/10 bg-[#111111] flex items-center justify-center shrink-0 p-1"
                  title="Live icon preview"
                >
                  <IconPreview icon={form.icon} color={form.color} size={24} />
                </div>
              </div>
              <span className="text-[11px] text-white/40 mt-1 block">
                Type <code className="text-white/60">mysql</code>, <code className="text-white/60">python</code> or <code className="text-white/60">logos:docker</code>.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                Brand Color (Hex) *
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  name="color"
                  value={form.color}
                  onChange={updateField}
                  className="w-12 h-11 rounded-xl border border-white/10 bg-[#111111] p-1 cursor-pointer"
                />
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={updateField}
                  required
                  className="flex-1 rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
                  placeholder="e.g. #00758F"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={updateField}
                min="0"
                step="1"
                required
                className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
              />
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={updateField}
                className="accent-[#FF5C00] w-4 h-4"
              />
              Published on portfolio
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#FF5C00] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#cc4900] disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : editingId ? "Update Skill" : "Save Skill"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-white/70 text-sm">Loading skills...</p>
      ) : skills.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
          <Code2 size={40} className="mx-auto text-[#FF5C00] mb-3" />
          <p className="text-white/80">No skills added yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {skills.map((skill) => (
            <article
              key={skill._id}
              className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl border border-white/10 bg-[#111111] flex items-center justify-center shrink-0 p-1.5">
                    <IconPreview icon={skill.icon || skill.key} color={skill.color || "#FF5C00"} size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-white truncate">{skill.name}</h3>
                    <p className="font-['DM_Mono'] text-[11px] text-white/40 truncate">
                      Key: {skill.icon || skill.key}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                    skill.published !== false
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                  }`}
                >
                  {skill.published !== false ? "Published" : "Draft"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-white/40 font-['DM_Mono']">
                <span>Order: {skill.order ?? 1}</span>
                <span>{skill.color || "#FF5C00"}</span>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => startEdit(skill)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingDelete(skill);
                    setModal({
                      type: "confirmDelete",
                      title: "Delete Skill?",
                      message: `Are you sure you want to delete "${skill.name}"?`,
                      variant: "danger",
                      confirmText: "Delete",
                      cancelText: "Cancel",
                    });
                  }}
                  disabled={deletingId === skill._id}
                  className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={14} /> {deletingId === skill._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
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
        isLoading={Boolean(deletingId)}
        onConfirm={() => {
          if (modal?.type === "success") {
            setModal(null);
            return;
          }
          confirmDelete();
        }}
        onCancel={closeModal}
      />
    </section>
  );
}

SkillManagement.propTypes = {
  token: PropTypes.string.isRequired,
};