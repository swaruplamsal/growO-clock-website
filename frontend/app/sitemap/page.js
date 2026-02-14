import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Link from "next/link";

export const metadata = {
  title: "Sitemap - grO'Clock",
  description:
    "Navigate all pages on the grO'Clock website. Find links to every section of our site.",
};

const sitemapSections = [
  {
    title: "Main Pages",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Resources", href: "/resources" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Our Story", href: "/about#our-story" },
      { label: "Mission & Vision", href: "/about#mission" },
      { label: "Our Team", href: "/about#team" },
      { label: "Board of Directors", href: "/about#board" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Financial Planning", href: "/services#financial-planning" },
      { label: "Investment Strategy", href: "/services#investment-strategy" },
      { label: "Risk Management", href: "/services#risk-management" },
      { label: "Business Advisory", href: "/services#business-advisory" },
      { label: "Tax Consulting", href: "/services#tax-consulting" },
      { label: "Wealth Management", href: "/services#wealth-management" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/resources#help-center" },
      { label: "FAQs", href: "/resources#faqs" },
      { label: "Market Insights", href: "/resources#market-insights" },
      { label: "Calculators", href: "/resources#calculators" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press & News", href: "/press" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Sitemap"
        subtitle="Find your way around the grO'Clock website."
      />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sitemapSections.map((section) => (
              <div key={section.title}>
                <h2 className="font-merriweather text-lg font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-montserrat text-sm text-gray-500 hover:text-primary transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg
                          className="w-3 h-3 text-accent flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
