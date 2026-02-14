import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Disclaimer - grO'Clock",
  description:
    "grO'Clock's Disclaimer. Important information about the limitations of our services and content.",
};

export default function DisclaimerPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Disclaimer"
        subtitle="Important information about our services and content."
      />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-montserrat text-sm text-gray-400 mb-8">
            Last updated: February 1, 2026
          </p>

          <div className="space-y-10">
            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                General Disclaimer
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                The information provided by grO&apos;Clock on our website and
                through our services is for general informational purposes only.
                All information is provided in good faith; however, we make no
                representation or warranty of any kind, express or implied,
                regarding the accuracy, adequacy, validity, reliability,
                availability, or completeness of any information.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                Financial Disclaimer
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                The content on this website does not constitute financial advice
                and should not be relied upon as such. The financial information
                provided is general in nature and is not tailored to your
                specific circumstances. Before making any financial decisions,
                you should consult with a qualified financial advisor who can
                assess your individual needs and objectives.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                Investment Risks
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                All investments carry risk, including the potential loss of
                principal. Past performance is not indicative of future results.
                The value of investments can go down as well as up, and you may
                not get back the amount originally invested. Market conditions,
                economic factors, and regulatory changes can all impact
                investment performance.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                Third-Party Links
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                Our website may contain links to third-party websites or
                services that are not owned or controlled by grO&apos;Clock. We
                have no control over, and assume no responsibility for, the
                content, privacy policies, or practices of any third-party
                websites or services.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                Professional Advice
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                Nothing on this website should be construed as professional
                financial, legal, or tax advice. Always seek the advice of
                qualified professionals regarding your specific circumstances.
                grO&apos;Clock disclaims any liability for actions taken based
                on the information provided on this website.
              </p>
            </div>

            <div>
              <h2 className="font-merriweather text-2xl font-bold text-gray-900 mb-4">
                Contact
              </h2>
              <p className="font-montserrat text-gray-600 leading-relaxed">
                If you have any concerns about our disclaimer, please contact us
                at{" "}
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
