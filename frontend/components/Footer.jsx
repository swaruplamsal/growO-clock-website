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
    { label: "Financial Planning", href: "/services#financial-planning" },
    { label: "Investment Strategy", href: "/services#investment-strategy" },
    { label: "Tax Consulting", href: "/services#tax-consulting" },
    { label: "Wealth Management", href: "/services#wealth-management" },
  ],
  Resources: [
    { label: "Help Center", href: "/resources#help-center" },
    { label: "FAQs", href: "/resources#faqs" },
    { label: "Market Insights", href: "/resources#market-insights" },
    { label: "Calculators", href: "/resources#calculators" },
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
              width={100}
              height={60}
              className="mb-4 brightness-0 invert"
            />
            <p className="font-montserrat text-sm text-gray-500 leading-relaxed">
              Smart financial solutions for a secure and prosperous future.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {[
                {
                  name: "facebook",
                  href: "#facebook",
                  svg: (
                    <svg
                      className="w-4 h-4 fill-current text-gray-400 group-hover:text-white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  ),
                },
                {
                  name: "twitter",
                  href: "#twitter",
                  svg: (
                    <svg
                      className="w-4 h-4 fill-current text-gray-400 group-hover:text-white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                  ),
                },
                {
                  name: "linkedin",
                  href: "#linkedin",
                  svg: (
                    <svg
                      className="w-4 h-4 fill-current text-gray-400 group-hover:text-white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z" />
                    </svg>
                  ),
                },
                {
                  name: "instagram",
                  href: "#instagram",
                  svg: (
                    <svg
                      className="w-4 h-4 fill-current text-gray-400 group-hover:text-white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm8 1a1 1 0 110 2 1 1 0 010-2zm-5 2a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors duration-300 group"
                  aria-label={social.name}
                >
                  {social.svg}
                </a>
              ))}
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
            &copy; {new Date().getFullYear()} grow O&apos;clock Pvt. Ltd. All
            rights reserved.
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
