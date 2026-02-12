import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
  ],
  Services: [
    { label: "Financial Planning", href: "/services/financial-planning" },
    { label: "Investment Strategy", href: "/services/investment" },
    { label: "Tax Consulting", href: "/services/tax" },
    { label: "Wealth Management", href: "/services/wealth" },
  ],
  Resources: [
    { label: "Help Center", href: "/help" },
    { label: "FAQs", href: "/faq" },
    { label: "Market Insights", href: "/insights" },
    { label: "Calculators", href: "/calculators" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/grOw.png"
              alt="grO'Clock"
              width={120}
              height={40}
              className="h-8 w-auto mb-4 brightness-0 invert"
            />
            <p className="font-montserrat text-sm text-gray-500 leading-relaxed">
              Smart financial solutions for a secure and prosperous future.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {["facebook", "twitter", "linkedin", "instagram"].map(
                (social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors duration-300"
                    aria-label={social}
                  >
                    <svg
                      className="w-4 h-4 fill-current text-gray-400 hover:text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-merriweather text-sm font-bold text-white mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-montserrat text-sm text-gray-500 hover:text-accent transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-montserrat text-xs text-gray-600">
            &copy; {new Date().getFullYear()} grO&apos;Clock. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-montserrat text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-montserrat text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/sitemap"
              className="font-montserrat text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
