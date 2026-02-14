import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Privacy Policy - grO'Clock",
  description:
    "grO'Clock's Privacy Policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Privacy Policy"
        subtitle="Your privacy is important to us."
      />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-montserrat text-sm text-gray-400 mb-8">
            Last updated: February 1, 2026
          </p>

          <div className="prose-custom space-y-10">
            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                1. Information We Collect
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed mb-3">
                We collect information you provide directly to us, such as when
                you create an account, request a consultation, subscribe to our
                newsletter, or contact us for support. This may include:
              </p>
              <ul className="list-disc list-inside font-montserrat text-gray-600 space-y-2 ml-4">
                <li>Name, email address, phone number</li>
                <li>Financial information relevant to our services</li>
                <li>Communication preferences</li>
                <li>Any other information you choose to provide</li>
              </ul>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside font-montserrat text-gray-600 space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>
                  Send you technical notices, updates, and support messages
                </li>
                <li>Respond to your comments, questions, and requests</li>
                <li>
                  Communicate with you about products, services, and events
                </li>
                <li>Monitor and analyze trends, usage, and activities</li>
              </ul>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                3. Information Sharing
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personally
                identifiable information to outside parties without your
                consent, except as necessary to provide our services, comply
                with the law, enforce our policies, or protect our or
                others&apos; rights, property, or safety.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                4. Data Security
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                We implement industry-standard security measures to protect your
                personal information, including encryption, secure data storage,
                and regular security audits. However, no method of transmission
                over the Internet is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                5. Your Rights
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside font-montserrat text-gray-600 space-y-2 ml-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict the processing of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                6. Contact Us
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
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
