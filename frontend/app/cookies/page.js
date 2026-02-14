import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Cookie Policy - grO'Clock",
  description:
    "grO'Clock's Cookie Policy. Learn how we use cookies and similar technologies on our website.",
};

export default function CookiesPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Cookie Policy"
        subtitle="How we use cookies and similar technologies."
      />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-montserrat text-sm text-gray-400 mb-8">
            Last updated: February 1, 2026
          </p>

          <div className="space-y-10">
            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                1. What Are Cookies?
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                Cookies are small text files that are placed on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences and understanding how
                you use our site.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                2. Types of Cookies We Use
              </h2>
              <div className="space-y-4">
                {[
                  {
                    name: "Essential Cookies",
                    description:
                      "Required for the website to function properly. These cannot be disabled.",
                  },
                  {
                    name: "Performance Cookies",
                    description:
                      "Help us understand how visitors interact with our website by collecting anonymous information.",
                  },
                  {
                    name: "Functional Cookies",
                    description:
                      "Remember your preferences and settings to provide a more personalized experience.",
                  },
                  {
                    name: "Analytics Cookies",
                    description:
                      "Allow us to measure and analyze website traffic to improve our services.",
                  },
                ].map((cookie) => (
                  <div
                    key={cookie.name}
                    className="bg-gray-50 rounded-lg p-5 border border-gray-100"
                  >
                    <h3 className="font-merriweather text-lg font-bold text-gray-900 mb-2">
                      {cookie.name}
                    </h3>
                    <p className="font-montserrat text-sm text-gray-600">
                      {cookie.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                3. Managing Cookies
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                Most web browsers allow you to control cookies through their
                settings. You can set your browser to refuse cookies or delete
                certain cookies. However, blocking some cookies may affect your
                experience on our website and limit the functionality available
                to you.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                4. Third-Party Cookies
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                Some cookies are placed by third-party services that appear on
                our pages, such as analytics providers and social media
                platforms. We do not control these cookies, and you should refer
                to the respective third party&apos;s privacy policy for more
                information.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                5. Contact Us
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                If you have questions about our use of cookies, please contact
                us at{" "}
                <a
                  href="mailto:privacy@groclock.com"
                  className="text-primary hover:underline"
                >
                  privacy@groclock.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
