"use client";
import { useEffect, useRef, useState } from "react";

function AnimatedSection({ children, id, className = "" }) {
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
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={`scroll-mt-24 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

const team = [
  {
    name: "Shankar Neupane",
    role: "Managing Director & Founder",
    bio: "Visionary leader with 15+ years in financial services, driving innovation and client-centric solutions.",
  },
  {
    name: "Anita Gurung",
    role: "Chief Financial Officer",
    bio: "Expert in corporate finance with a proven track record of optimizing financial performance for growing companies.",
  },
  {
    name: "Rajesh Thapa",
    role: "Head of Investments",
    bio: "Seasoned investment strategist specializing in portfolio management and emerging market opportunities.",
  },
  {
    name: "Pooja Shrestha",
    role: "Director of Operations",
    bio: "Operations excellence leader focused on streamlining processes and delivering exceptional client experiences.",
  },
  {
    name: "Bikash Karki",
    role: "Lead Tax Consultant",
    bio: "Certified tax professional with deep expertise in corporate and individual tax optimization strategies.",
  },
  {
    name: "Nisha Rai",
    role: "Client Relations Manager",
    bio: "Dedicated to building lasting client partnerships through personalized service and proactive communication.",
  },
];

const boardMembers = [
  {
    name: "Dr. Hari Prasad Sharma",
    role: "Chairman",
    bio: "Former banking executive with 30+ years of financial industry leadership and regulatory expertise.",
  },
  {
    name: "Meena Acharya",
    role: "Independent Director",
    bio: "Corporate governance specialist and advisor to multiple Fortune 500 firms on financial strategy.",
  },
  {
    name: "Prakash Joshi",
    role: "Director",
    bio: "Serial entrepreneur and investor with a passion for fintech innovation and inclusive financial services.",
  },
  {
    name: "Sunita Basnet",
    role: "Director",
    bio: "Experienced risk management professional with expertise in regulatory compliance and audit frameworks.",
  },
];

export default function AboutContent() {
  return (
    <>
      {/* Our Story */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection id="our-story">
            <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-primary">Story</span>
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full mb-8"></div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="font-montserrat text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                  Founded in 2022, grow O&apos;Clock began with a simple vision:
                  to make expert financial guidance accessible to everyone. What
                  started as a small consulting firm has grown into a trusted
                  name in financial services across Nepal.
                </p>
                <p className="font-montserrat text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                  Over the years, we&apos;ve helped hundreds of individuals and
                  businesses achieve their financial goals through personalized
                  strategies, cutting-edge technology, and unwavering commitment
                  to our clients&apos; success.
                </p>
                <p className="font-montserrat text-gray-600 text-base md:text-lg leading-relaxed">
                  Today, with over Rs 10 Crore in assets under management and a
                  98% client retention rate, we continue to innovate and expand
                  our services to meet the evolving needs of our clients.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "2022", label: "Founded" },
                  { value: "100+", label: "Clients Served" },
                  { value: "Rs 10Cr+", label: "Assets Managed" },
                  { value: "98%", label: "Retention Rate" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-6 text-center shadow-lg"
                  >
                    <div className="font-merriweather text-2xl md:text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="font-montserrat text-sm text-gray-200">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-fixed"
          style={{
            background:
              "linear-gradient(135deg, #0D47A1 0%, #1565C0 40%, #1976D2 70%, #1E88E5 100%)",
          }}
        ></div>
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection id="mission">
            <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Mission & Vision
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full mb-12"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <div className="w-14 h-14 bg-accent/20 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-merriweather text-2xl font-bold text-white mb-4">
                  Our Mission
                </h3>
                <p className="font-montserrat text-gray-300 leading-relaxed">
                  To empower individuals and businesses with innovative,
                  transparent, and accessible financial solutions that foster
                  sustainable growth and long-term prosperity. We are committed
                  to building meaningful relationships and delivering
                  exceptional value to every client we serve.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <div className="w-14 h-14 bg-accent/20 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-merriweather text-2xl font-bold text-white mb-4">
                  Our Vision
                </h3>
                <p className="font-montserrat text-gray-300 leading-relaxed">
                  To become the most trusted financial partner in Nepal,
                  recognized for our integrity, innovation, and impact. We
                  envision a future where every individual and business has the
                  tools and guidance they need to achieve financial freedom and
                  security.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection id="team">
            <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-primary">Team</span>
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full mb-4"></div>
            <p className="font-montserrat text-gray-600 mb-12 max-w-2xl text-base md:text-lg leading-relaxed">
              Meet the dedicated professionals who make grO&apos;Clock a trusted
              name in financial services.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="bg-gray-50 rounded-xl p-6 md:p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mb-5">
                    <span className="font-merriweather text-xl font-bold text-white">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="font-merriweather text-lg font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="font-montserrat text-sm text-accent font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="font-montserrat text-sm text-gray-500 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection id="board">
            <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Board of <span className="text-primary">Directors</span>
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full mb-4"></div>
            <p className="font-montserrat text-gray-600 mb-12 max-w-2xl text-base md:text-lg leading-relaxed">
              Experienced leaders guiding our strategic direction and
              governance.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              {boardMembers.map((member) => (
                <div
                  key={member.name}
                  className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-merriweather text-xl font-bold text-white">
                        {member.name
                          .split(" ")
                          .filter(
                            (n) => !n.includes("Dr.") && !n.includes("Mr."),
                          )
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-merriweather text-lg font-bold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="font-montserrat text-sm text-accent font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="font-montserrat text-sm text-gray-500 leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
