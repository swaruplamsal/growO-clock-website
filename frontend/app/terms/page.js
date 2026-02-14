import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Terms of Service - grO'Clock",
  description:
    "grO'Clock's Terms of Service. Read the terms and conditions governing your use of our services.",
};

export default function TermsPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Terms of Service"
        subtitle="Please read these terms carefully before using our services."
      />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-montserrat text-sm text-gray-400 mb-8">
            Last updated: February 1, 2026
          </p>

          <div className="space-y-10">
            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                By accessing or using grO&apos;Clock&apos;s services, website,
                or any associated applications, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do
                not use our services.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                2. Description of Services
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                grO&apos;Clock provides financial planning, investment advisory,
                tax consulting, wealth management, and related financial
                services. Our services are designed to provide general financial
                guidance and should not be construed as specific financial,
                legal, or tax advice.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                3. User Accounts
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed mb-3">
                When you create an account with us, you must provide accurate,
                complete, and current information. You are responsible for:
              </p>
              <ul className="list-disc list-inside font-montserrat text-gray-600 space-y-2 ml-4">
                <li>Safeguarding your password and account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                4. Intellectual Property
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                All content, features, and functionality on our platform,
                including text, graphics, logos, and software, are the exclusive
                property of grO&apos;Clock and are protected by copyright,
                trademark, and other intellectual property laws.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                5. Limitation of Liability
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                grO&apos;Clock shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising out of or
                relating to your use of our services. Our total liability shall
                not exceed the amount paid by you for the services in the
                preceding twelve months.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                6. Disclaimer
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                Our services are provided &ldquo;as is&rdquo; without warranties
                of any kind. Past performance is not indicative of future
                results. All investments carry risk, and you should consult with
                a qualified professional before making any financial decisions.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                7. Governing Law
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                These terms shall be governed by and construed in accordance
                with the laws of Nepal. Any disputes arising from these terms
                shall be subject to the exclusive jurisdiction of the courts in
                Kathmandu, Nepal.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                8. Contact
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                For questions about these Terms of Service, contact us at{" "}
                <a
                  href="mailto:legal@groclock.com"
                  className="text-primary hover:underline"
                >
                  legal@groclock.com
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
