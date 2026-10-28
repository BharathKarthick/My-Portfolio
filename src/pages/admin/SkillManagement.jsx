import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Plus, Edit, Trash2, Code2, ArrowUp, ArrowDown } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const LEGACY_ICONS = {
  html: "simple-icons:html5",
  html5: "simple-icons:html5",
  css: "simple-icons:css3",
  css3: "simple-icons:css3",
  tailwind: "simple-icons:tailwindcss",
  tailwindcss: "simple-icons:tailwindcss",
  javascript: "simple-icons:javascript",
  js: "simple-icons:javascript",
  react: "simple-icons:react",
  reactjs: "simple-icons:react",
  figma: "simple-icons:figma",
  wordpress: "simple-icons:wordpress",
  github: "simple-icons:github",
  mongodb: "simple-icons:mongodb",
  express: "simple-icons:express",
  expressjs: "simple-icons:express",
  nodejs: "simple-icons:nodedotjs",
  node: "simple-icons:nodedotjs",
  mysql: "simple-icons:mysql",
  postgresql: "simple-icons:postgresql",
  postgres: "simple-icons:postgresql",
  python: "simple-icons:python",
  java: "simple-icons:java",
  php: "simple-icons:php",
  git: "simple-icons:git",
  docker: "simple-icons:docker",
  canva: "simple-icons:canva",
  aws: "simple-icons:amazonaws",
  firebase: "simple-icons:firebase",
  postman: "simple-icons:postman",
  bootstrap: "simple-icons:bootstrap",
  redux: "simple-icons:redux",
  graphql: "simple-icons:graphql",
  nextjs: "simple-icons:nextdotjs",
  vue: "simple-icons:vuedotjs",
  typescript: "simple-icons:typescript",
  ts: "simple-icons:typescript",
  linux: "simple-icons:linux",
  nginx: "simple-icons:nginx",
};

function sanitizeColor(color) {
  if (!color || typeof color !== "string") return "#FF5C00";
  let c = color.trim();
  if (!c.startsWith("#")) c = `#${c}`;

  const hexPart = c.slice(1).replace(/[^0-9a-fA-F]/g, "");
  if (hexPart.length === 3) {
    c = `#${hexPart[0]}${hexPart[0]}${hexPart[1]}${hexPart[1]}${hexPart[2]}${hexPart[2]}`;
  } else if (hexPart.length >= 6) {
    c = `#${hexPart.slice(0, 6)}`;
  } else {
    c = `#${hexPart.padEnd(6, "0")}`;
  }

  return /^#[0-9a-fA-F]{6}$/.test(c) ? c : "#FF5C00";
}

function getIconUrl(key, color) {
  if (!key) return null;
  const clean = key.trim().toLowerCase();

  let identifier = LEGACY_ICONS[clean] || clean;
  if (!identifier.includes(":")) {
    identifier = `simple-icons:${clean}`;
  }

  const match = identifier.match(/^([a-z0-9-]+):([a-z0-9-]+)$/i);
  if (!match) return null;

  const [, collection, name] = match;
  const validColor = sanitizeColor(color);
  return `https://api.iconify.design/${collection}/${name}.svg?color=${encodeURIComponent(validColor)}`;
}

function SkillIconPreview({ iconKey, color, size = 20 }) {
  const [failed, setFailed] = useState(false);
  const validColor = sanitizeColor(color);
  const iconUrl = getIconUrl(iconKey, validColor);

  useEffect(() => {
    setFailed(false);
  }, [iconKey, color]);

  if (!iconUrl || failed) {
    return <Code2 size={size} color={validColor} />;
  }

  return (
    <img
      src={iconUrl}
      alt="preview"
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}

function emptySkillForm(initialOrder = 1) {
  return {
    name: "",
    key: "",
    color: "#FF5C00",
    order: initialOrder,
  };
}

function SkillForm({ token, skill, initialOrder, onCancel, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => {
    if (!skill) return emptySkillForm(initialOrder);
    return {
      name: skill.name || "",
      key: skill.key || skill.icon || "",
      color: sanitizeColor(skill.color),
      order: skill.order ?? 1,
    };
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  const hasChanges =
    !skill ||
    form.name.trim() !== (skill.name || "").trim() ||
    form.key.trim().toLowerCase() !== (skill.key || skill.icon || "").trim().toLowerCase() ||
    sanitizeColor(form.color).toLowerCase() !== sanitizeColor(skill.color).toLowerCase() ||
    Number(form.order) !== Number(skill.order ?? 1);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (skill && !hasChanges) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        key: form.key.trim().toLowerCase(),
        icon: form.key.trim().toLowerCase(),
        color: sanitizeColor(form.color),
        order: Number(form.order),
      };

      const response = await fetch(
        skill
          ? `${API_URL}/api/admin/skills/${skill._id}`
          : `${API_URL}/api/admin/skills`,
        {
          method: skill ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save skill.");
      }
      onSaved(skill ? "updated" : "created", payload.name);
    } catch (submitError) {
      setError(submitError.message || "Unable to save skill.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white font-['Plus_Jakarta_Sans']">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{skill ? "Edit Skill" : "Add New Skill"}</h3>
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
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
            Skill Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            required
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="e.g. MySQL"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
            Icon Key / Identifier *
          </label>
          <div className="flex gap-2 items-center">
            <input
              name="key"
              value={form.key}
              onChange={updateField}
              required
              className="flex-1 rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
              placeholder="e.g. simple-icons:mysql or mysql"
            />
            <div
              className="w-11 h-11 rounded-xl border border-white/10 bg-[#111111] flex items-center justify-center shrink-0 p-1"
              title="Live Icon Preview"
            >
              <SkillIconPreview iconKey={form.key} color={form.color} size={22} />
            </div>
          </div>
          <span className="text-[11px] text-white/40 mt-1 block">
            Enter an Iconify identifier (e.g. simple-icons:mysql, logos:docker) or direct name (e.g. mysql, react).
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
              value={sanitizeColor(form.color)}
              onInput={updateField}
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
          {saving ? "Saving..." : skill ? "Update Skill" : "Save Skill"}
        </button>
      </div>
    </form>
  );
}

SkillForm.propTypes = {
  token: PropTypes.string.isRequired,
  skill: PropTypes.object,
  initialOrder: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};

export default function SkillManagement({ token }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [modal, setModal] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadSkills = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        const sorted = (data.skills || []).sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );
        setSkills(sorted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  // மீண்டும் சேர்க்கப்பட்ட மேலேயும் கீழேயும் நகர்த்தும் (Move Up / Down) ஃபங்ஷன்
  async function handleMove(index, direction) {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const updated = [...skills];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reindexed = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSkills(reindexed);

    try {
      await Promise.all(
        reindexed.map((s) =>
          fetch(`${API_URL}/api/admin/skills/${s._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: s.name,
              key: s.key || s.icon,
              icon: s.key || s.icon,
              color: sanitizeColor(s.color),
              order: s.order,
            }),
          })
        )
      );
      loadSkills();
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const deletedName = pendingDelete.name;
    try {
      const res = await fetch(`${API_URL}/api/admin/skills/${pendingDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSkills((curr) => curr.filter((s) => s._id !== pendingDelete._id));
        setPendingDelete(null);
        setModal({
          type: "success",
          variant: "success",
          title: "Skill Deleted!",
          message: `"${deletedName}" has been deleted successfully.`,
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
              onClick={() => {
                setEditingSkill(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF5C00] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#cc4900] cursor-pointer"
            >
              <Plus size={18} /> Add Skill
            </button>
          )}
        </div>
      </div>

      {showForm ? (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
          <SkillForm
            token={token}
            skill={editingSkill}
            initialOrder={skills.length + 1}
            onCancel={() => {
              setShowForm(false);
              setEditingSkill(null);
            }}
            onSaved={async (action, skillName) => {
              setShowForm(false);
              setEditingSkill(null);
              await loadSkills();
              setModal({
                type: "success",
                variant: "success",
                title: action === "created" ? "Skill Added!" : "Skill Updated!",
                message:
                  action === "created"
                    ? `"${skillName}" has been added to your skills successfully.`
                    : `"${skillName}" has been updated successfully.`,
                confirmText: "Done",
                cancelText: "Close",
              });
            }}
          />
        </div>
      ) : loading ? (
        <p className="text-white/70 text-sm">Loading skills...</p>
      ) : skills.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
          <Code2 size={40} className="mx-auto text-[#FF5C00] mb-3" />
          <p className="text-white/80">No skills added yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {skills.map((skill, index) => (
            <div
              key={skill._id}
              className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border border-white/10 bg-[#111111] flex items-center justify-center shrink-0 p-1.5"
                    style={{ borderColor: `${sanitizeColor(skill.color)}40` }}
                  >
                    <SkillIconPreview
                      iconKey={skill.key || skill.icon}
                      color={sanitizeColor(skill.color)}
                      size={20}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {skill.name}
                    </h3>
                    <p className="font-['DM_Mono'] text-[11px] text-white/40">
                      Key: {skill.key || skill.icon} | Order: {skill.order ?? index + 1}
                    </p>
                  </div>
                </div>

                {/* Arrow Up / Down Buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === skills.length - 1}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setEditingSkill(skill);
                    setShowForm(true);
                  }}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
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
                  className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
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
        onCancel={() => {
          setModal(null);
          setPendingDelete(null);
        }}
      />
    </section>
  );
}

SkillManagement.propTypes = {
  token: PropTypes.string.isRequired,
};