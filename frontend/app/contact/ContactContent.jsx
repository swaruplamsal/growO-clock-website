"use client";
import { useState } from "react";
import { contactAPI } from "@/lib/api";

const contactInfo = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Visit Us",
    details: ["Kathmandu, Nepal", "Putalisadak, Ward 29"],
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    title: "Call Us",
    details: ["+977-01-4XXXXXX", "+977-98XXXXXXXX"],
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Email Us",
    details: ["info@groclock.com", "support@groclock.com"],
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Business Hours",
    details: ["Sun - Fri: 10:00 AM - 6:00 PM", "Saturday: Closed"],
  },
];

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await contactAPI.submit(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = [];
        for (const [, val] of Object.entries(data)) {
          if (Array.isArray(val)) messages.push(val.join(" "));
          else if (typeof val === "string") messages.push(val);
        }
        setError(
          messages.join(" ") || "Failed to send message. Please try again.",
        );
      } else {
        setError("Failed to send message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Contact Info Cards */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {info.icon}
                </div>
                <h3 className="font-merriweather text-lg font-bold text-gray-900 mb-2">
                  {info.title}
                </h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="font-montserrat text-sm text-gray-500">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="font-merriweather text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Send Us a <span className="text-primary">Message</span>
              </h2>
              <div className="w-16 h-1 bg-accent rounded-full mb-6"></div>
              <p className="font-montserrat text-gray-600 mb-8">
                Fill out the form below and our team will get back to you within
                24 hours.
              </p>

              {submitted ? (
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
                    Message Sent!
                  </h3>
                  <p className="font-montserrat text-gray-600 mb-4">
                    Thank you for reaching out. We&apos;ll get back to you
                    shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="font-montserrat text-sm text-primary hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-montserrat text-sm">
                      {error}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="+977-98XXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="consultation">Free Consultation</option>
                        <option value="services">Service Information</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-3.5 bg-primary text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Map Placeholder */}
            <div>
              <h2 className="font-merriweather text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Find <span className="text-primary">Us</span>
              </h2>
              <div className="w-16 h-1 bg-accent rounded-full mb-6"></div>
              <div className="bg-gray-100 rounded-xl overflow-hidden h-[400px] md:h-[500px] flex items-center justify-center border border-gray-200">
                <div className="text-center px-8">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="font-merriweather text-lg font-bold text-gray-400 mb-2">
                    Kathmandu, Nepal
                  </p>
                  <p className="font-montserrat text-sm text-gray-400">
                    Putalisadak, Ward 29
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
