"use client";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "10+", label: "Years Experience" },
  { value: "₹50Cr+", label: "Assets Managed" },
  { value: "98%", label: "Client Retention" },
];

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Why Choose{" "}
              <span className="text-primary">grow O&apos;Clock?</span>
            </h2>
            <div className="w-16 h-1 bg-accent rounded-full mb-6"></div>
            <p className="font-montserrat text-gray-600 text-base md:text-lg leading-relaxed mb-8">
              With years of experience and a client-first approach, we deliver
              financial solutions that create real impact. Our team of experts
              combines deep market knowledge with cutting-edge technology to
              help you succeed.
            </p>

            <ul className="space-y-4">
              {[
                "Personalized strategies tailored to your goals",
                "Transparent pricing with no hidden fees",
                "24/7 support and dedicated account managers",
                "Proven track record of consistent growth",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 font-montserrat text-gray-600"
                >
                  <svg
                    className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Stats Grid */}
          <div
            className={`grid grid-cols-2 gap-6 transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <div className="font-merriweather text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="font-montserrat text-sm text-gray-200">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
