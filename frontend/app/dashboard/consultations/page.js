"use client";
import { useState, useEffect } from "react";
import { consultationsAPI } from "@/lib/api";

const statusColor = {
  PENDING: "bg-yellow-100 text-yellow-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const typeOptions = [
  { value: "FREE", label: "Free Consultation" },
  { value: "PAID", label: "Paid Consultation" },
  { value: "FOLLOW_UP", label: "Follow-up" },
];

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    subject: "",
    message: "",
    consultation_type: "FREE",
    scheduled_date: "",
  });
  const [rescheduleData, setRescheduleData] = useState({
    id: null,
    scheduled_date: "",
  });

  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchConsultations = async () => {
    try {
      const { data } = await consultationsAPI.list();
      setConsultations(data.results ?? (Array.isArray(data) ? data : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await consultationsAPI.create({
        ...form,
        scheduled_date: form.scheduled_date
          ? new Date(form.scheduled_date).toISOString()
          : null,
      });
      flash("success", "Consultation booked successfully!");
      setShowForm(false);
      setForm({
        subject: "",
        message: "",
        consultation_type: "FREE",
        scheduled_date: "",
      });
      fetchConsultations();
    } catch (err) {
      flash(
        "error",
        err.response?.data?.detail ||
          Object.values(err.response?.data || {})?.[0]?.[0] ||
          "Failed to book consultation.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this consultation?")) return;
    try {
      await consultationsAPI.cancel(id);
      flash("success", "Consultation cancelled.");
      fetchConsultations();
      setSelected(null);
    } catch (err) {
      flash("error", "Failed to cancel.");
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await consultationsAPI.reschedule(rescheduleData.id, {
        scheduled_date: new Date(rescheduleData.scheduled_date).toISOString(),
      });
      flash("success", "Consultation rescheduled!");
      setRescheduleData({ id: null, scheduled_date: "" });
      fetchConsultations();
      setSelected(null);
    } catch (err) {
      flash("error", "Failed to reschedule.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-lg font-montserrat text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-merriweather text-2xl font-bold text-gray-900">
          Consultations
        </h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setSelected(null);
          }}
          className="bg-primary text-white px-4 py-2.5 rounded-lg font-montserrat text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Book Consultation
        </button>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg font-montserrat text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
        >
          {message.text}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-merriweather text-lg font-bold text-gray-900 mb-4">
            Book a New Consultation
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                className={inputClass}
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="What would you like to discuss?"
              />
            </div>
            <div>
              <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                rows={3}
                className={inputClass}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Provide details about your consultation needs..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className={inputClass}
                  value={form.consultation_type}
                  onChange={(e) =>
                    setForm({ ...form, consultation_type: e.target.value })
                  }
                >
                  {typeOptions.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={form.scheduled_date}
                  onChange={(e) =>
                    setForm({ ...form, scheduled_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-white px-6 py-2.5 rounded-lg font-montserrat text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {saving ? "Booking..." : "Book Consultation"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-gray-200 rounded-lg font-montserrat text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reschedule Form */}
      {rescheduleData.id && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <h2 className="font-merriweather text-lg font-bold text-blue-900 mb-4">
            Reschedule Consultation
          </h2>
          <form onSubmit={handleReschedule} className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block font-montserrat text-sm font-medium text-blue-800 mb-1">
                New Date & Time
              </label>
              <input
                type="datetime-local"
                className={inputClass}
                required
                value={rescheduleData.scheduled_date}
                onChange={(e) =>
                  setRescheduleData({
                    ...rescheduleData,
                    scheduled_date: e.target.value,
                  })
                }
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-montserrat text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Reschedule"}
            </button>
            <button
              type="button"
              onClick={() =>
                setRescheduleData({ id: null, scheduled_date: "" })
              }
              className="px-4 py-2.5 border border-blue-200 rounded-lg font-montserrat text-sm text-blue-700 hover:bg-blue-100"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {consultations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="font-montserrat text-gray-500 mb-1">
            No consultations booked yet
          </p>
          <p className="font-montserrat text-sm text-gray-400">
            Book your first consultation to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {consultations.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(selected?.id === c.id ? null : c)}
              className={`bg-white rounded-xl border cursor-pointer transition-all ${selected?.id === c.id ? "border-primary shadow-md" : "border-gray-100 hover:border-gray-200"}`}
            >
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-montserrat text-sm font-semibold text-gray-900 truncate">
                      {c.subject}
                    </p>
                    <span
                      className={`font-montserrat text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColor[c.status] || "bg-gray-100 text-gray-700"}`}
                    >
                      {c.status_display || c.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-montserrat text-xs text-gray-500">
                    <span>
                      {c.consultation_type_display || c.consultation_type}
                    </span>
                    <span>
                      {c.scheduled_date
                        ? new Date(c.scheduled_date).toLocaleString()
                        : "Not scheduled"}
                    </span>
                    <span>{c.duration} min</span>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-300 transition-transform ${selected?.id === c.id ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Expanded */}
              {selected?.id === c.id && (
                <div className="px-6 pb-5 border-t border-gray-50 pt-4">
                  <p className="font-montserrat text-sm text-gray-600 mb-4">
                    {c.message}
                  </p>
                  {c.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="font-montserrat text-xs font-medium text-gray-500 mb-1">
                        Advisor Notes
                      </p>
                      <p className="font-montserrat text-sm text-gray-700">
                        {c.notes}
                      </p>
                    </div>
                  )}
                  {c.meeting_link && (
                    <a
                      href={c.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
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
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Join Meeting
                    </a>
                  )}
                  {(c.status === "PENDING" || c.status === "SCHEDULED") && (
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRescheduleData({ id: c.id, scheduled_date: "" });
                        }}
                        className="px-4 py-2 border border-blue-200 text-blue-700 rounded-lg font-montserrat text-sm hover:bg-blue-50"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(c.id);
                        }}
                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-montserrat text-sm hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
