"use client";
import { useState } from "react";

export default function CTA() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert(`Thank you! We'll reach out to ${email} shortly.`);
    setEmail("");
  };

  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Ready to Grow Your <span className="text-primary">Wealth?</span>
        </h2>
        <p className="font-montserrat text-gray-600 text-base md:text-lg mb-10 max-w-2xl mx-auto">
          Join hundreds of satisfied clients who trust grow O&apos;Clock with their
          financial future. Get started today with a free consultation.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-5 py-3.5 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="px-8 py-3.5 bg-primary text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            Get Started
          </button>
        </form>

        <p className="font-montserrat text-xs text-gray-400 mt-4">
          No spam, ever. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
