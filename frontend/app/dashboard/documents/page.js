"use client";
import { useState, useEffect, useRef } from "react";
import { documentsAPI } from "@/lib/api";

const fileIcons = {
  pdf: "text-red-500",
  doc: "text-blue-600",
  docx: "text-blue-600",
  xls: "text-green-600",
  xlsx: "text-green-600",
  png: "text-purple-500",
  jpg: "text-purple-500",
  jpeg: "text-purple-500",
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [shareModal, setShareModal] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [uploadCategory, setUploadCategory] = useState("OTHER");
  const fileRef = useRef();

  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchDocuments = async () => {
    try {
      const { data } = await documentsAPI.list();
      setDocuments(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name);
        formData.append("category", uploadCategory);
        await documentsAPI.upload(formData);
      }
      flash(
        "success",
        `${files.length} document${files.length > 1 ? "s" : ""} uploaded!`,
      );
      fetchDocuments();
    } catch (err) {
      flash("error", err.response?.data?.detail || "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDownload = async (doc) => {
    try {
      const response = await documentsAPI.download(doc.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.filename || doc.title || "document";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      flash("error", "Download failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;
    try {
      await documentsAPI.delete(id);
      flash("success", "Document deleted.");
      fetchDocuments();
    } catch {
      flash("error", "Failed to delete.");
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      await documentsAPI.share(shareModal, [shareEmail]);
      flash("success", "Document shared!");
      setShareModal(null);
      setShareEmail("");
    } catch (err) {
      flash("error", "Failed to share document.");
    }
  };

  const getExt = (name) => (name || "").split(".").pop().toLowerCase();
  const formatSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-merriweather text-2xl font-bold text-gray-900">
          Documents
        </h1>
        <div className="flex items-center gap-3">
          <select
            className="px-3 py-2.5 border border-gray-200 rounded-lg font-montserrat text-sm text-gray-700 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
          >
            <option value="TAX">Tax</option>
            <option value="INVESTMENT">Investment</option>
            <option value="INSURANCE">Insurance</option>
            <option value="LEGAL">Legal</option>
            <option value="REPORT">Report</option>
            <option value="OTHER">Other</option>
          </select>
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="bg-primary text-white px-4 py-2.5 rounded-lg font-montserrat text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>{" "}
                Uploading...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>{" "}
                Upload
              </>
            )}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg font-montserrat text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
        >
          {message.text}
        </div>
      )}

      {/* Share Modal */}
      {shareModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShareModal(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-merriweather text-lg font-bold text-gray-900 mb-4">
              Share Document
            </h2>
            <form onSubmit={handleShare} className="space-y-4">
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg font-montserrat text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="Enter user UUID"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-primary text-white px-5 py-2.5 rounded-lg font-montserrat text-sm font-medium hover:bg-primary-dark"
                >
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => setShareModal(null)}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg font-montserrat text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("border-primary/40");
        }}
        onDragLeave={(e) =>
          e.currentTarget.classList.remove("border-primary/40")
        }
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-primary/40");
          const dt = new DataTransfer();
          for (const f of e.dataTransfer.files) dt.items.add(f);
          fileRef.current.files = dt.files;
          handleUpload({ target: { files: e.dataTransfer.files } });
        }}
      >
        <svg
          className="w-10 h-10 mx-auto text-gray-300 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="font-montserrat text-sm text-gray-500">
          Drag files here or click to upload
        </p>
        <p className="font-montserrat text-xs text-gray-400 mt-1">
          PDF, DOC, XLS, PNG, JPG up to 10MB
        </p>
      </div>

      {/* Document List */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="font-montserrat text-gray-500">
            No documents uploaded yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Name", "Size", "Uploaded", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="font-montserrat text-xs font-medium text-gray-500 py-3 px-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => {
                  const ext = getExt(doc.filename || doc.title || "");
                  return (
                    <tr
                      key={doc.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <svg
                            className={`w-5 h-5 ${fileIcons[ext] || "text-gray-400"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="font-montserrat text-sm font-medium text-gray-900 truncate max-w-xs">
                            {doc.title || doc.filename}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-montserrat text-sm text-gray-500">
                        {formatSize(doc.file_size)}
                      </td>
                      <td className="py-3 px-4 font-montserrat text-sm text-gray-500">
                        {doc.uploaded_at
                          ? new Date(doc.uploaded_at).toLocaleDateString()
                          : doc.created_at
                            ? new Date(doc.created_at).toLocaleDateString()
                            : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-1.5 text-gray-400 hover:text-primary"
                            title="Download"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setShareModal(doc.id)}
                            className="p-1.5 text-gray-400 hover:text-blue-500"
                            title="Share"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500"
                            title="Delete"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
