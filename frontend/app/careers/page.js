import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Link from "next/link";

export const metadata = {
  title: "Careers - grO'Clock",
  description:
    "Join the grO'Clock team. Explore career opportunities and be part of a team that's transforming financial services.",
};

const openPositions = [
  {
    title: "Senior Financial Analyst",
    department: "Finance",
    type: "Full-time",
    location: "Kathmandu",
    description:
      "Lead financial analysis and reporting for our growing client portfolio. 5+ years experience required.",
  },
  {
    title: "Investment Associate",
    department: "Investments",
    type: "Full-time",
    location: "Kathmandu",
    description:
      "Support investment strategy development and portfolio management for individual and corporate clients.",
  },
  {
    title: "Frontend Developer",
    department: "Technology",
    type: "Full-time",
    location: "Remote / Kathmandu",
    description:
      "Build and maintain our client-facing web applications using React and Next.js. 3+ years experience required.",
  },
  {
    title: "Client Relations Executive",
    department: "Operations",
    type: "Full-time",
    location: "Kathmandu",
    description:
      "Manage client relationships and ensure exceptional service delivery. Strong communication skills required.",
  },
];

const benefits = [
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Competitive Salary",
    description:
      "Industry-leading compensation packages with performance bonuses.",
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
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    title: "Health Insurance",
    description: "Comprehensive health coverage for you and your family.",
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
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    title: "Learning & Growth",
    description: "Professional development programs and learning stipends.",
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    title: "Flexible Work",
    description:
      "Hybrid work options with flexible scheduling to suit your lifestyle.",
  },
];

export default function CareersPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Careers"
        subtitle="Join our team and help shape the future of financial services in Nepal."
      />

      {/* Why Join Us */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Join <span className="text-primary">grO&apos;Clock?</span>
          </h2>
          <div className="w-20 h-1 bg-accent rounded-full mb-12"></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                <div className="text-primary mb-4">{benefit.icon}</div>
                <h3 className="font-merriweather text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="font-montserrat text-sm text-gray-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Open <span className="text-primary">Positions</span>
          </h2>
          <div className="w-20 h-1 bg-accent rounded-full mb-12"></div>
          <div className="space-y-4">
            {openPositions.map((position) => (
              <div
                key={position.title}
                className="bg-white rounded-xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <h3 className="font-merriweather text-lg font-bold text-gray-900">
                    {position.title}
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-primary/10 text-primary font-montserrat text-xs font-semibold rounded-full">
                      {position.department}
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-primary-dark font-montserrat text-xs font-semibold rounded-full">
                      {position.type}
                    </span>
                  </div>
                </div>
                <p className="font-montserrat text-sm text-gray-500 mb-3">
                  {position.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-montserrat text-xs text-gray-400 flex items-center gap-1">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    {position.location}
                  </span>
                  <Link
                    href="/contact"
                    className="font-montserrat text-sm text-primary font-semibold hover:underline"
                  >
                    Apply Now &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
