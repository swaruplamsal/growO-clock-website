"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const services = [
  {
    id: "financial-planning",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Financial Planning",
    subtitle: "Chart your path to financial security",
    description:
      "Comprehensive financial planning services tailored to your unique goals and circumstances. We help you build a clear, actionable roadmap to financial security and growth.",
    features: [
      "Personalized financial goal setting",
      "Cash flow analysis and budgeting",
      "Retirement planning and projections",
      "Education funding strategies",
      "Estate planning guidance",
    ],
  },
  {
    id: "investment-strategy",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    title: "Investment Strategy",
    subtitle: "Data-driven wealth growth",
    description:
      "Data-driven investment strategies designed to maximize returns while effectively managing risk. Grow your wealth with confidence through our expert analysis.",
    features: [
      "Portfolio construction and optimization",
      "Asset allocation strategies",
      "Market research and analysis",
      "Regular portfolio rebalancing",
      "Performance tracking and reporting",
    ],
  },
  {
    id: "risk-management",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Risk Management",
    subtitle: "Protect your assets proactively",
    description:
      "Protect your assets and minimize exposure with our expert analysis and proactive risk management solutions tailored to your portfolio and business needs.",
    features: [
      "Comprehensive risk assessment",
      "Insurance planning and review",
      "Diversification strategies",
      "Hedging solutions",
      "Contingency planning",
    ],
  },
  {
    id: "business-advisory",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    title: "Business Advisory",
    subtitle: "Strategic consulting for growth",
    description:
      "Strategic business consulting to help your company scale effectively. From startups to enterprises, we provide the insights and strategies that drive measurable results.",
    features: [
      "Business valuation and analysis",
      "Growth strategy development",
      "Financial modeling and forecasting",
      "M&A advisory services",
      "Operational efficiency optimization",
    ],
  },
  {
    id: "tax-consulting",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Tax Consulting",
    subtitle: "Optimize your tax strategy",
    description:
      "Expert tax consulting services to optimize your tax strategy and ensure full compliance. We maximize deductions and credits while keeping you on the right side of regulations.",
    features: [
      "Tax planning and optimization",
      "Corporate and individual tax filing",
      "Tax-efficient investment structuring",
      "Regulatory compliance advisory",
      "Tax dispute resolution",
    ],
  },
  {
    id: "wealth-management",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Wealth Management",
    subtitle: "Preserve and grow your legacy",
    description:
      "Personalized wealth management solutions for high-net-worth individuals. We help you preserve, protect, and grow your legacy for generations to come.",
    features: [
      "High-net-worth portfolio management",
      "Succession and legacy planning",
      "Philanthropic advisory",
      "Private banking coordination",
      "Family office services",
    ],
  },
];

function ServiceSection({ service, index }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const isEven = index % 2 === 0;

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
      id={service.id}
      className={`scroll-mt-24 py-16 md:py-20 ${isEven ? "bg-white" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Content */}
          <div className={isEven ? "" : "md:order-2"}>
            <div className="text-primary mb-4">{service.icon}</div>
            <h2 className="font-merriweather text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {service.title}
            </h2>
            <p className="font-montserrat text-accent font-medium text-sm mb-4">
              {service.subtitle}
            </p>
            <div className="w-16 h-1 bg-accent rounded-full mb-6"></div>
            <p className="font-montserrat text-gray-600 text-base md:text-lg leading-relaxed mb-8">
              {service.description}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Get Consultation
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {/* Features */}
          <div className={isEven ? "" : "md:order-1"}>
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 shadow-lg">
              <h3 className="font-merriweather text-xl font-bold text-white mb-6">
                Key Features
              </h3>
              <ul className="space-y-4">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
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
                    <span className="font-montserrat text-sm text-gray-200">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesContent() {
  return (
    <>
      {/* Services Overview */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-merriweather text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What We <span className="text-primary">Offer</span>
          </h2>
          <div className="w-20 h-1 bg-accent rounded-full mx-auto mb-6"></div>
          <p className="font-montserrat text-gray-600 max-w-3xl mx-auto text-base md:text-lg leading-relaxed mb-12">
            We offer a full spectrum of financial services designed to address
            every aspect of your financial journey. Each service is tailored to
            your unique needs and goals.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="group bg-gray-50 hover:bg-primary rounded-xl p-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-primary group-hover:text-white transition-colors duration-300 flex justify-center mb-2">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {service.icon.props.children}
                  </svg>
                </div>
                <span className="font-montserrat text-xs md:text-sm font-medium text-gray-700 group-hover:text-white transition-colors">
                  {service.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Individual Service Sections */}
      {services.map((service, index) => (
        <ServiceSection key={service.id} service={service} index={index} />
      ))}

      {/* CTA */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ready to Get <span className="text-primary">Started?</span>
          </h2>
          <p className="font-montserrat text-gray-600 text-base md:text-lg mb-10 max-w-2xl mx-auto">
            Schedule a free consultation with our experts and discover how
            grO&apos;Clock can help you achieve your financial goals.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Schedule Free Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
