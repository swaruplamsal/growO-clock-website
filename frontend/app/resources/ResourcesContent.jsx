"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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

const helpTopics = [
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    title: "Account Management",
    description:
      "Learn how to manage your account settings, update profile information, and configure preferences.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    title: "Security & Privacy",
    description:
      "Understand how we protect your data and learn best practices for keeping your account secure.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    title: "Payments & Billing",
    description:
      "Get help with billing inquiries, payment methods, invoices, and subscription management.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Getting Started",
    description:
      "New to grO'Clock? Learn the basics and get up and running with our comprehensive onboarding guide.",
  },
];

const faqs = [
  {
    question: "What services does grO'Clock offer?",
    answer:
      "We offer a comprehensive range of financial services including Financial Planning, Investment Strategy, Risk Management, Business Advisory, Tax Consulting, and Wealth Management. Each service is tailored to your specific needs and goals.",
  },
  {
    question: "How do I get started with grO'Clock?",
    answer:
      "Getting started is simple. You can register for a free account on our website, schedule a consultation with one of our financial experts, and we'll work together to create a personalized financial plan for you.",
  },
  {
    question: "What are your fees and pricing?",
    answer:
      "Our pricing is transparent with no hidden fees. We offer flexible pricing models including flat fees, percentage-based fees, and project-based pricing depending on the service. Contact us for a detailed proposal tailored to your needs.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Absolutely. We use bank-grade encryption and follow strict data protection protocols. Your financial information is stored securely and is never shared with third parties without your explicit consent.",
  },
  {
    question: "Can I switch between service plans?",
    answer:
      "Yes, our plans are flexible and can be adjusted as your needs evolve. You can upgrade, downgrade, or customize your service package at any time by contacting your dedicated account manager.",
  },
  {
    question: "Do you offer services for businesses?",
    answer:
      "Yes, we provide comprehensive financial services for businesses of all sizes, from startups to established enterprises. Our Business Advisory and Tax Consulting services are specifically designed for corporate clients.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our support team via email at support@groclock.com, call us at +977-01-4XXXXXX, or use the contact form on our website. We also offer 24/7 support for premium clients.",
  },
  {
    question: "What is the minimum investment amount?",
    answer:
      "We work with clients across various investment levels. While some of our premium wealth management services require a minimum threshold, our financial planning and tax consulting services are accessible to everyone.",
  },
];

const insights = [
  {
    category: "Market Analysis",
    title: "Q4 2025 Market Outlook: Opportunities in Emerging Markets",
    excerpt:
      "Our analysts break down the key trends and opportunities shaping emerging markets as we head into the new quarter.",
    date: "Jan 15, 2026",
  },
  {
    category: "Investment Tips",
    title: "5 Strategies for Building a Recession-Proof Portfolio",
    excerpt:
      "Learn how to protect your investments during economic downturns with these proven diversification strategies.",
    date: "Jan 8, 2026",
  },
  {
    category: "Tax Planning",
    title: "Year-End Tax Planning: Maximize Your Deductions",
    excerpt:
      "Essential tax planning strategies to implement before the fiscal year ends to optimize your tax position.",
    date: "Dec 28, 2025",
  },
  {
    category: "Wealth Management",
    title: "The Ultimate Guide to Succession Planning",
    excerpt:
      "How to create a comprehensive succession plan that protects your wealth and ensures smooth transitions.",
    date: "Dec 18, 2025",
  },
];

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-montserrat font-medium text-gray-900 pr-4">
          {faq.question}
        </span>
        <svg
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
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
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <p className="px-6 pb-4 font-montserrat text-sm text-gray-600 leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

function SimpleCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    if (p && r && t) {
      const amount = p * Math.pow(1 + r, t);
      const interest = amount - p;
      setResult({ amount: amount.toFixed(2), interest: interest.toFixed(2) });
    }
  };

  return (
    <form onSubmit={calculate} className="space-y-4">
      <div>
        <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
          Principal Amount (₹)
        </label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          placeholder="e.g., 100000"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
          Annual Interest Rate (%)
        </label>
        <input
          type="number"
          step="0.01"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="e.g., 8"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
          Investment Period (Years)
        </label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          placeholder="e.g., 5"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-6 py-3 bg-primary text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors shadow-md"
      >
        Calculate
      </button>
      {result && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between font-montserrat text-sm">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold text-gray-900">
              ₹{Number(result.amount).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between font-montserrat text-sm">
            <span className="text-gray-600">Total Interest:</span>
            <span className="font-bold text-primary">
              ₹{Number(result.interest).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </form>
  );
}

export default function ResourcesContent() {
  return (
    <>
      {/* Help Center */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection id="help-center">
            <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Help <span className="text-primary">Center</span>
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full mb-4"></div>
            <p className="font-montserrat text-gray-600 mb-12 max-w-2xl text-base md:text-lg leading-relaxed">
              Find answers and get the support you need.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {helpTopics.map((topic) => (
                <div
                  key={topic.title}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer"
                >
                  <div className="text-primary mb-4">{topic.icon}</div>
                  <h3 className="font-merriweather text-lg font-bold text-gray-900 mb-2">
                    {topic.title}
                  </h3>
                  <p className="font-montserrat text-sm text-gray-500 leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <p className="font-montserrat text-gray-600 mb-4">
                Can&apos;t find what you&apos;re looking for?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors shadow-md"
              >
                Contact Support
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection id="faqs">
            <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full mb-12"></div>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} index={index} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Market Insights */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection id="market-insights">
            <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Market <span className="text-primary">Insights</span>
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full mb-4"></div>
            <p className="font-montserrat text-gray-600 mb-12 max-w-2xl text-base md:text-lg leading-relaxed">
              Stay informed with the latest financial news, analysis, and expert
              commentary.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              {insights.map((insight) => (
                <article
                  key={insight.title}
                  className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                >
                  <div className="p-6 md:p-8">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-montserrat text-xs font-semibold rounded-full mb-4">
                      {insight.category}
                    </span>
                    <h3 className="font-merriweather text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {insight.title}
                    </h3>
                    <p className="font-montserrat text-sm text-gray-500 leading-relaxed mb-4">
                      {insight.excerpt}
                    </p>
                    <span className="font-montserrat text-xs text-gray-400">
                      {insight.date}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Calculators */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection id="calculators">
            <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Financial <span className="text-primary">Calculators</span>
            </h2>
            <div className="w-20 h-1 bg-accent rounded-full mb-4"></div>
            <p className="font-montserrat text-gray-600 mb-12 max-w-2xl text-base md:text-lg leading-relaxed">
              Use our interactive tools to plan and project your financial
              future.
            </p>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
                <h3 className="font-merriweather text-xl font-bold text-gray-900 mb-2">
                  Compound Interest Calculator
                </h3>
                <p className="font-montserrat text-sm text-gray-500 mb-6">
                  See how your investments can grow over time with the power of
                  compound interest.
                </p>
                <SimpleCalculator />
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
                  <h3 className="font-merriweather text-xl font-bold text-gray-900 mb-4">
                    Why Use Our Calculators?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Plan your retirement with accurate projections",
                      "Compare different investment scenarios",
                      "Understand the impact of compound growth",
                      "Make data-driven financial decisions",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 font-montserrat text-sm text-gray-600"
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
                <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-center shadow-lg">
                  <h3 className="font-merriweather text-xl font-bold text-white mb-3">
                    Need a Custom Analysis?
                  </h3>
                  <p className="font-montserrat text-sm text-gray-200 mb-6">
                    Our experts can provide detailed financial projections
                    tailored to your specific situation.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-white text-primary font-montserrat font-semibold text-sm rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Talk to an Expert
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
