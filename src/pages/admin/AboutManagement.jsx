import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Save, Upload, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AboutManagement({ token }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [initialState, setInitialState] = useState(null);
  const [form, setForm] = useState({
    name: "",
    title: "",
    imageFile: null,
    imagePreview: "",
    image: "",
    paragraphs: [],
    infoCards: [],
  });

  useEffect(() => {
    async function fetchAbout() {
      try {
        const response = await fetch(`${API_URL}/api/admin/about`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success && data.about) {
          const ab = data.about;
          const loaded = {
            name: ab.name || "",
            title: ab.title || "",
            image: ab.image || "",
            paragraphs: ab.paragraphs || [],
            infoCards: ab.infoCards || [],
          };
          setInitialState(JSON.stringify(loaded));
          setForm({
            ...loaded,
            imageFile: null,
            imagePreview: ab.image || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, [token]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((curr) => ({ ...curr, [name]: value }));
  }

  function handleFileChange(e) {
    const { files } = e.target;
    if (files && files[0]) {
      setForm((curr) => ({
        ...curr,
        imageFile: files[0],
        imagePreview: URL.createObjectURL(files[0]),
      }));
    }
  }

  function handleParagraphChange(index, value) {
    const updated = [...form.paragraphs];
    updated[index] = value;
    setForm((curr) => ({ ...curr, paragraphs: updated }));
  }

  function addParagraph() {
    setForm((curr) => ({ ...curr, paragraphs: [...curr.paragraphs, ""] }));
  }

  function removeParagraph(index) {
    const updated = form.paragraphs.filter((_, i) => i !== index);
    setForm((curr) => ({ ...curr, paragraphs: updated }));
  }

  function moveParagraph(index, direction) {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= form.paragraphs.length) return;
    const updated = [...form.paragraphs];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setForm((curr) => ({ ...curr, paragraphs: updated }));
  }

  function handleInfoCardChange(index, field, value) {
    const updated = form.infoCards.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    setForm((curr) => ({ ...curr, infoCards: updated }));
  }

  function addInfoCard() {
    setForm((curr) => ({
      ...curr,
      infoCards: [...curr.infoCards, { label: "", value: "" }],
    }));
  }

  function removeInfoCard(index) {
    const updated = form.infoCards.filter((_, i) => i !== index);
    setForm((curr) => ({ ...curr, infoCards: updated }));
  }

  function moveInfoCard(index, direction) {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= form.infoCards.length) return;
    const updated = [...form.infoCards];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setForm((curr) => ({ ...curr, infoCards: updated }));
  }

  const currentComparable = JSON.stringify({
    name: form.name.trim(),
    title: form.title.trim(),
    image: form.image,
    paragraphs: form.paragraphs.map((p) => p.trim()).filter(Boolean),
    infoCards: form.infoCards
      .filter((c) => c.label.trim() !== "" && c.value.trim() !== "")
      .map((c) => ({ label: c.label.trim(), value: c.value.trim() })),
  });

  const hasChanges = Boolean(form.imageFile) || currentComparable !== initialState;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!hasChanges) {
      return;
    }

    setSaving(true);

    try {
      let imageUrl = form.image;

      if (form.imageFile) {
        const imgData = new FormData();
        imgData.append("file", form.imageFile);
        const imgRes = await fetch(`${API_URL}/api/uploads/about-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: imgData,
        });
        const imgJson = await imgRes.json();
        if (!imgRes.ok || !imgJson.success)
          throw new Error(imgJson.message || "Image upload failed");
        imageUrl = imgJson.url;
      }

      const payload = {
        name: form.name.trim(),
        title: form.title.trim(),
        image: imageUrl,
        paragraphs: form.paragraphs.map((p) => p.trim()).filter(Boolean),
        infoCards: form.infoCards
          .filter((c) => c.label.trim() !== "" && c.value.trim() !== "")
          .map((c) => ({ label: c.label.trim(), value: c.value.trim() })),
      };

      const response = await fetch(`${API_URL}/api/admin/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Failed to update");

      setInitialState(JSON.stringify(payload));
      setForm((curr) => ({ ...curr, image: imageUrl, imageFile: null }));

      setModal({
        title: "About Me Updated!",
        message: `"${payload.name}" profile and about section have been updated successfully.`,
        variant: "success",
      });
    } catch (err) {
      setError(err.message || "Error updating about section.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <p className="text-white/70 text-sm">Loading about details...</p>;

  return (
    <section className="space-y-6 text-white font-['Plus_Jakarta_Sans']">
      <div>
        <p className="font-['DM_Mono'] text-xs uppercase tracking-[3px] text-[#FF5C00]">
          Management
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          About Me Management
        </h2>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl text-sm border bg-red-500/10 border-red-500/30 text-red-300">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-6 space-y-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
              Badge Title (e.g. Full Stack Developer)
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#FF5C00]"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#FF5C00]">
                Bio Paragraphs ({form.paragraphs.length})
              </label>
              <p className="text-[11px] text-white/40 mt-0.5">Tip: Use *word* inside paragraph to highlight in orange.</p>
            </div>
            <button
              type="button"
              onClick={addParagraph}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF5C00]/10 border border-[#FF5C00]/30 rounded-lg text-xs font-semibold text-[#FF5C00] hover:bg-[#FF5C00] hover:text-white transition cursor-pointer"
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>

          {form.paragraphs.map((para, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2.5 bg-white/2 p-3 rounded-xl border border-white/10">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <span className="font-['DM_Mono'] text-xs text-white/40 w-6 text-center">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="sm:hidden p-1.5 rounded bg-red-500/10 text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <textarea
                rows={2}
                value={para}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
                required
                className="flex-1 rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white outline-none focus:border-[#FF5C00]"
                placeholder="Write paragraph here... Use *highlight text* for orange color."
              />
              <div className="flex sm:flex-col justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => moveParagraph(index, "up")}
                  disabled={index === 0}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveParagraph(index, "down")}
                  disabled={index === form.paragraphs.length - 1}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="hidden sm:inline-flex p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Cards: மொபைல் வியூவில் Label மேலே, Value கீழே தனித்தனி ரோவாக மாற்றுதல் */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#FF5C00]">
              Info Cards (Name, Location, Email, Role, etc.)
            </label>
            <button
              type="button"
              onClick={addInfoCard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF5C00]/10 border border-[#FF5C00]/30 rounded-lg text-xs font-semibold text-[#FF5C00] hover:bg-[#FF5C00] hover:text-white transition cursor-pointer"
            >
              <Plus size={14} /> Add Info Card
            </button>
          </div>

          {form.infoCards.map((card, index) => (
            <div key={index} className="flex flex-col gap-2.5 bg-white/2 p-3.5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-['DM_Mono'] text-xs text-white/40">
                  Card #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeInfoCard(index)}
                  className="p-1 rounded bg-red-500/10 text-red-300 hover:bg-red-500/20 text-xs px-2"
                >
                  Delete Card
                </button>
              </div>

              {/* Top Label */}
              <div>
                <label className="block text-[11px] text-white/60 mb-1">Label</label>
                <input
                  type="text"
                  value={card.label}
                  onChange={(e) => handleInfoCardChange(index, "label", e.target.value)}
                  placeholder="e.g. Email"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white outline-none focus:border-[#FF5C00]"
                />
              </div>

              {/* Bottom Value */}
              <div>
                <label className="block text-[11px] text-white/60 mb-1">Value</label>
                <input
                  type="text"
                  value={card.value}
                  onChange={(e) => handleInfoCardChange(index, "value", e.target.value)}
                  placeholder="e.g. abc@gmail.com"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white outline-none focus:border-[#FF5C00]"
                />
              </div>

              <div className="flex justify-end gap-1.5 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => moveInfoCard(index, "up")}
                  disabled={index === 0}
                  className="px-2.5 py-1 rounded bg-white/5 text-xs text-white/70 disabled:opacity-30 cursor-pointer"
                >
                  ↑ Move Up
                </button>
                <button
                  type="button"
                  onClick={() => moveInfoCard(index, "down")}
                  disabled={index === form.infoCards.length - 1}
                  className="px-2.5 py-1 rounded bg-white/5 text-xs text-white/70 disabled:opacity-30 cursor-pointer"
                >
                  ↓ Move Down
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="Preview"
                className="w-16 h-20 object-cover rounded-lg border border-white/10"
              />
            )}
            <label className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/10 cursor-pointer">
              <Upload size={16} /> Upload New Photo
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF5C00] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#cc4900] disabled:opacity-50 cursor-pointer"
          >
            <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={Boolean(modal)}
        title={modal?.title || ""}
        message={modal?.message || ""}
        variant="success"
        confirmText="Done"
        cancelText="Close"
        onConfirm={() => setModal(null)}
        onCancel={() => setModal(null)}
      />
    </section>
  );
}

AboutManagement.propTypes = {
  token: PropTypes.string.isRequired,
};