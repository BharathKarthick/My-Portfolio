import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ConfirmationModal from "../../components/ConfirmationModal";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ResumeManagement({ token }) {
  const [resumeUrl, setResumeUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadResume() {
      try {
        const response = await fetch(`${API_URL}/api/settings/resume`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load resume details.");
        }

        if (!cancelled) {
          setResumeUrl(data.resumeUrl || "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load resume details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadResume();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpload(event) {
    event.preventDefault();
    setError("");

    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }

    if (
      selectedFile.type !== "application/pdf" ||
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a valid PDF file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("The resume file must be 10 MB or smaller.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const uploadResponse = await fetch(`${API_URL}/api/uploads/resume`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.url || !uploadData.publicId) {
        throw new Error(uploadData.message || "Resume upload failed.");
      }

      const saveResponse = await fetch(`${API_URL}/api/settings/admin/resume`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeUrl: uploadData.url,
          resumePublicId: uploadData.publicId,
        }),
      });

      const saveData = await saveResponse.json();

      if (!saveResponse.ok || saveData.success === false) {
        throw new Error(saveData.message || "Unable to save resume details.");
      }

      setResumeUrl(uploadData.url);
      setSelectedFile(null);
      event.target.reset();

      setModal({
        variant: "success",
        title: "Resume Updated!",
        message: "Your resume has been uploaded and saved successfully.",
        confirmText: "Done",
        cancelText: "Close",
      });
    } catch (err) {
      setError(err.message || "Unable to upload resume.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="space-y-6 text-white font-['Plus_Jakarta_Sans']">
      <div>
        <p className="font-['DM_Mono'] text-xs font-semibold uppercase tracking-[3px] text-[#FF5C00]">
          Management
        </p>
        <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
          Resume Management
        </h2>
        <p className="mt-1 text-sm text-white/60">
          Upload or replace the resume displayed to visitors on your portfolio.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 sm:p-7">
        {loading ? (
          <p className="text-sm text-white/50">Loading resume details...</p>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-white">
                  Current Resume Status
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                    resumeUrl
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      resumeUrl ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  {resumeUrl ? "Active & Downloadable" : "No Resume Configured"}
                </span>
              </div>

              {resumeUrl && (
                <div className="mt-4">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#FF5C00]/40 bg-[#FF5C00]/10 px-4 py-2.5 text-xs font-semibold text-[#FF5C00] transition hover:bg-[#FF5C00] hover:text-white no-underline"
                  >
                    <span>View current resume</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )}
            </div>

            <div className="h-px bg-white/10" />

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label
                  htmlFor="resume-file"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Choose a PDF resume to upload (Max 10 MB)
                </label>
                <input
                  id="resume-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(event) => {
                    setSelectedFile(event.target.files?.[0] || null);
                    setError("");
                  }}
                  className="block w-full rounded-xl border border-white/10 bg-[#111111] p-3 text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-[#FF5C00] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#cc4900]"
                />
                {selectedFile && (
                  <p className="mt-2 text-xs text-[#FF5C00]">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              {error && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="rounded-xl bg-[#FF5C00] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#cc4900] disabled:opacity-50 cursor-pointer"
              >
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>
            </form>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={Boolean(modal)}
        title={modal?.title || ""}
        message={modal?.message || ""}
        variant={modal?.variant || "success"}
        confirmText={modal?.confirmText || "Done"}
        cancelText={modal?.cancelText || "Close"}
        onConfirm={() => setModal(null)}
        onCancel={() => setModal(null)}
      />
    </section>
  );
}

ResumeManagement.propTypes = {
  token: PropTypes.string.isRequired,
};