import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Press & News - grO'Clock",
  description:
    "Stay updated with the latest news, press releases, and media coverage about grO'Clock and our contributions to financial services.",
};

const pressReleases = [
  {
    date: "Jan 30, 2026",
    title: "grO'Clock Expands Services to Include Digital Wealth Management",
    excerpt:
      "grO'Clock announces the launch of its digital wealth management platform, making premium financial services accessible to a wider audience.",
  },
  {
    date: "Dec 15, 2025",
    title: "grO'Clock Recognized as Top Financial Advisory Firm in Nepal",
    excerpt:
      "grO'Clock receives the prestigious Financial Excellence Award for outstanding client service and innovation in financial advisory.",
  },
  {
    date: "Nov 20, 2025",
    title:
      "grO'Clock Partners with Leading Banks for Seamless Investment Solutions",
    excerpt:
      "Strategic partnerships with top Nepali banks enable grO'Clock clients to access integrated investment and banking services.",
  },
  {
    date: "Oct 5, 2025",
    title: "grO'Clock Surpasses ₹50 Crore in Assets Under Management",
    excerpt:
      "A significant milestone as grO'Clock reaches ₹50 crore in total assets under management, reflecting growing client trust.",
  },
];

const mediaFeatures = [
  {
    outlet: "Nepal Business Times",
    title: "How grO'Clock is Democratizing Financial Planning in Nepal",
    date: "Feb 2, 2026",
  },
  {
    outlet: "The Kathmandu Post",
    title: "Fintech Revolution: grO'Clock's Role in Modernizing Finance",
    date: "Jan 15, 2026",
  },
  {
    outlet: "Republica Daily",
    title: "Young Entrepreneurs Making Waves in Nepal's Financial Sector",
    date: "Dec 28, 2025",
  },
];

export default function PressPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Press & News"
        subtitle="Latest news, press releases, and media coverage."
      />

      {/* Press Releases */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Press <span className="text-primary">Releases</span>
          </h2>
          <div className="w-20 h-1 bg-accent rounded-full mb-12"></div>
          <div className="space-y-6">
            {pressReleases.map((release) => (
              <article
                key={release.title}
                className="bg-gray-50 rounded-xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <span className="font-montserrat text-xs text-primary font-semibold">
                  {release.date}
                </span>
                <h3 className="font-merriweather text-lg md:text-xl font-bold text-gray-900 mt-2 mb-3">
                  {release.title}
                </h3>
                <p className="font-montserrat text-sm text-gray-500 leading-relaxed">
                  {release.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Media <span className="text-primary">Coverage</span>
          </h2>
          <div className="w-20 h-1 bg-accent rounded-full mb-12"></div>
          <div className="space-y-4">
            {mediaFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div>
                  <span className="font-montserrat text-xs text-accent font-semibold uppercase tracking-wider">
                    {feature.outlet}
                  </span>
                  <h3 className="font-merriweather text-base font-bold text-gray-900 mt-1">
                    {feature.title}
                  </h3>
                </div>
                <span className="font-montserrat text-xs text-gray-400 whitespace-nowrap">
                  {feature.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-merriweather text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Media <span className="text-primary">Inquiries</span>
          </h2>
          <p className="font-montserrat text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            For press inquiries, interviews, or media kit requests, please
            contact our communications team.
          </p>
          <a
            href="mailto:press@groclock.com"
            className="inline-flex items-center px-8 py-4 bg-primary text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-lg"
          >
            press@groclock.com
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
