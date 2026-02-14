import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ResourcesContent from "./ResourcesContent";

export const metadata = {
  title: "Resources - grO'Clock",
  description:
    "Access grO'Clock's resource hub: Help Center, FAQs, Market Insights, and Financial Calculators to support your financial journey.",
};

export default function ResourcesPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Resources"
        subtitle="Everything you need to make informed financial decisions."
      />
      <ResourcesContent />
      <Footer />
    </main>
  );
}
