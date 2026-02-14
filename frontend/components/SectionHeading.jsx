"use client";
import { useEffect, useRef, useState } from "react";

export default function SectionHeading({ title, highlight, description }) {
  const ref = useRef(null);
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
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`mb-12 md:mb-16 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {title} {highlight && <span className="text-primary">{highlight}</span>}
      </h2>
      <div className="w-20 h-1 bg-accent rounded-full"></div>
      {description && (
        <p className="font-montserrat text-gray-600 mt-4 max-w-2xl text-base md:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
