import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Plus, Edit, Trash2, FolderGit2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function emptyProjectForm(initialOrder = 1) {
  return {
    title: "",
    description: "",
    category: "Web Development",
    technologies: "",
    liveUrl: "",
    frontendUrl: "",
    backendUrl: "",
    image: "",
    imagePublicId: "",
    published: true,
    order: initialOrder,
  };
}

function ProjectForm({ token, project, initialOrder, onCancel, onSaved }) {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => {
    if (!project) return emptyProjectForm(initialOrder);
    return {
      ...emptyProjectForm(),
      ...project,
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : "",
      order: project.order ?? 1,
    };
  });

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const initialTech = Array.isArray(project?.technologies)
    ? project.technologies.map((t) => t.trim()).filter(Boolean).join(", ")
    : "";
  const currentTech = form.technologies
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .join(", ");

  const hasChanges =
    !project ||
    Boolean(imageFile) ||
    form.title.trim() !== (project.title || "").trim() ||
    (form.category || "").trim() !== (project.category || "Web Development").trim() ||
    form.description.trim() !== (project.description || "").trim() ||
    currentTech !== initialTech ||
    (form.liveUrl || "").trim() !== (project.liveUrl || "").trim() ||
    (form.frontendUrl || "").trim() !== (project.frontendUrl || "").trim() ||
    Number(form.order) !== Number(project.order ?? 1) ||
    Boolean(form.published) !== Boolean(project.published ?? true);

  async function uploadImage() {
    if (!imageFile) return form.image;
    const body = new FormData();
    body.append("file", imageFile);
    setUploading(true);

    try {
      const response = await fetch(`${API_URL}/api/uploads/project-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Image upload failed.");
      }
      setForm((current) => ({
        ...current,
        image: data.url,
        imagePublicId: data.publicId,
      }));
      return data.url;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (project && !hasChanges) {
      return;
    }

    if (!form.image && !imageFile) {
      setError("Please select a project image or provide an image URL.");
      return;
    }
    setSaving(true);

    try {
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        image: imageUrl,
        technologies: form.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
        order: Number(form.order),
      };

      const response = await fetch(
        project
          ? `${API_URL}/api/admin/projects/${project._id}`
          : `${API_URL}/api/admin/projects`,
        {
          method: project ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save project.");
      }
      onSaved(project ? "updated" : "created", payload.title);
    } catch (submitError) {
      setError(submitError.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white font-['Plus_Jakarta_Sans']">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{project ? "Edit Project" : "Add New Project"}</h3>
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
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Project Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            required
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="e.g. Portfolio Website"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={updateField}
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="e.g. Frontend Development"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            required
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="Describe your project..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Technologies (comma-separated)</label>
          <input
            name="technologies"
            value={form.technologies}
            onChange={updateField}
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="React.js, Tailwind CSS, JavaScript"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Project Image *</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="block w-full rounded-xl border border-white/10 bg-[#111111] p-3 text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-[#FF5C00] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
          />
        </div>

        {form.image && (
          <div className="sm:col-span-2">
            <span className="text-xs text-white/60 block mb-1">Current Preview:</span>
            <img src={form.image} alt="Preview" className="h-40 w-full object-cover rounded-xl border border-white/10" />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">Live Demo URL</label>
          <input
            type="url"
            name="liveUrl"
            value={form.liveUrl}
            onChange={updateField}
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">GitHub / Frontend URL</label>
          <input
            type="url"
            name="frontendUrl"
            value={form.frontendUrl}
            onChange={updateField}
            className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            placeholder="https://github.com/..."
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

      <div className="flex gap-6 pt-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" name="published" checked={form.published} onChange={updateField} className="accent-[#FF5C00] w-4 h-4" />
          Published
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-xl bg-[#FF5C00] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#cc4900] disabled:opacity-50 cursor-pointer"
        >
          {uploading ? "Uploading Image..." : saving ? "Saving..." : project ? "Update Project" : "Save Project"}
        </button>
      </div>
    </form>
  );
}

ProjectForm.propTypes = {
  token: PropTypes.string.isRequired,
  project: PropTypes.object,
  initialOrder: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
};

export default function ProjectManagement({ token }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [modal, setModal] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    const deletedTitle = pendingDelete.title;
    try {
      const res = await fetch(`${API_URL}/api/admin/projects/${pendingDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjects((curr) => curr.filter((p) => p._id !== pendingDelete._id));
        setPendingDelete(null);
        setModal({
          type: "success",
          variant: "success",
          title: "Project Deleted!",
          message: `"${deletedTitle}" has been deleted successfully.`,
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Project Management</h2>
        </div>

        {/* Count Badge + Add Button Container */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="inline-flex items-center px-3 py-2 rounded-xl bg-[#FF5C00]/10 border border-[#FF5C00]/30 font-['DM_Mono'] text-xs font-bold text-[#FF5C00]">
            {projects.length} Projects
          </span>

          {!showForm && (
            <button
              onClick={() => { setEditingProject(null); setShowForm(true); }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF5C00] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#cc4900] cursor-pointer"
            >
              <Plus size={18} /> Add Project
            </button>
          )}
        </div>
      </div>

      {showForm ? (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
          <ProjectForm
            token={token}
            project={editingProject}
            initialOrder={projects.length + 1}
            onCancel={() => { setShowForm(false); setEditingProject(null); }}
            onSaved={async (action, projectTitle) => {
              setShowForm(false);
              setEditingProject(null);
              await loadProjects();
              setModal({
                type: "success",
                variant: "success",
                title: action === "created" ? "Project Added!" : "Project Updated!",
                message:
                  action === "created"
                    ? `"${projectTitle}" has been added to your projects successfully.`
                    : `"${projectTitle}" has been updated successfully.`,
                confirmText: "Done",
                cancelText: "Close",
              });
            }}
          />
        </div>
      ) : loading ? (
        <p className="text-white/70 text-sm">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
          <FolderGit2 size={40} className="mx-auto text-[#FF5C00] mb-3" />
          <p className="text-white/80">No projects added yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <div key={project._id} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 flex flex-col justify-between">
              <div>
                <img src={project.image} alt={project.title} className="w-full h-36 object-cover rounded-xl mb-3 border border-white/10" />
                <h3 className="font-bold text-lg text-white">{project.title}</h3>
                <p className="text-xs text-white/70 line-clamp-2 mt-1">{project.description}</p>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={() => { setEditingProject(project); setShowForm(true); }}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setPendingDelete(project);
                    setModal({
                      type: "confirmDelete",
                      title: "Delete Project?",
                      message: `Are you sure you want to delete "${project.title}"?`,
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

ProjectManagement.propTypes = {
  token: PropTypes.string.isRequired,
};