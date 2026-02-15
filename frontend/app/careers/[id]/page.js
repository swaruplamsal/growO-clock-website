"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { careersAPI } from "@/lib/api";

export default function CareerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    cover_letter: "",
  });
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (!id) return;
    careersAPI
      .getPosition(id)
      .then(({ data }) => setPosition(data))
      .catch(() => setPosition(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("position", id);
      fd.append("full_name", formData.full_name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("cover_letter", formData.cover_letter);
      if (resume) fd.append("resume", resume);
      await careersAPI.apply(fd);
      setApplied(true);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msgs = [];
        for (const [, val] of Object.entries(data)) {
          if (Array.isArray(val)) msgs.push(val.join(" "));
          else if (typeof val === "string") msgs.push(val);
        }
        setError(msgs.join(" ") || "Failed to submit application.");
      } else {
        setError("Failed to submit application. Please try again.");
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  if (!position) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="font-merriweather text-3xl font-bold text-gray-900 mb-4">
              Position Not Found
            </h1>
            <Link
              href="/careers"
              className="px-6 py-3 bg-primary text-white font-montserrat text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Back to Careers
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="relative w-full h-[40vh] min-h-[320px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/1.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4 pt-20">
          <h1 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {position.title}
          </h1>
          <div className="flex gap-3 flex-wrap justify-center">
            {position.department && (
              <span className="px-4 py-1.5 bg-primary/20 text-accent font-montserrat text-xs font-semibold rounded-full">
                {position.department}
              </span>
            )}
            {position.employment_type && (
              <span className="px-4 py-1.5 bg-white/10 text-white font-montserrat text-xs font-semibold rounded-full">
                {position.employment_type}
              </span>
            )}
            {position.location && (
              <span className="px-4 py-1.5 bg-white/10 text-white font-montserrat text-xs font-semibold rounded-full">
                {position.location}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose max-w-none font-montserrat text-gray-700 leading-relaxed prose-headings:font-merriweather prose-headings:text-gray-900 mb-12"
            dangerouslySetInnerHTML={{
              __html: position.description || position.details || "",
            }}
          />

          {position.requirements && (
            <div className="mb-8">
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                Requirements
              </h2>
              <div
                className="prose max-w-none font-montserrat text-gray-700"
                dangerouslySetInnerHTML={{ __html: position.requirements }}
              />
            </div>
          )}

          {position.salary_range && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
              <h3 className="font-merriweather text-lg font-bold text-gray-900 mb-1">
                Salary Range
              </h3>
              <p className="font-montserrat text-primary font-semibold">
                {position.salary_range}
              </p>
            </div>
          )}

          {!showApply && !applied && (
            <button
              onClick={() => setShowApply(true)}
              className="px-8 py-3.5 bg-primary text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors shadow-lg"
            >
              Apply for this Position
            </button>
          )}

          {applied && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <svg
                className="w-16 h-16 text-green-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-merriweather text-xl font-bold text-gray-900 mb-2">
                Application Submitted!
              </h3>
              <p className="font-montserrat text-gray-600 mb-4">
                Thank you for your interest. We&apos;ll review your application
                and get back to you.
              </p>
              <Link
                href="/careers"
                className="font-montserrat text-sm text-primary hover:underline"
              >
                View other positions
              </Link>
            </div>
          )}

          {showApply && !applied && (
            <div className="mt-8 bg-gray-50 rounded-xl p-8 border border-gray-100">
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-6">
                Apply Now
              </h2>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-montserrat text-sm mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleApply} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                    Resume *
                  </label>
                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                    Cover Letter
                  </label>
                  <textarea
                    rows={4}
                    value={formData.cover_letter}
                    onChange={(e) =>
                      setFormData({ ...formData, cover_letter: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Tell us why you're a great fit..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-8 py-3.5 bg-primary text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors shadow-lg disabled:opacity-50"
                  >
                    {applying ? "Submitting..." : "Submit Application"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApply(false)}
                    className="px-8 py-3.5 bg-gray-200 text-gray-700 font-montserrat font-semibold text-sm rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-12">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-primary font-montserrat text-sm font-semibold hover:underline"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Careers
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
