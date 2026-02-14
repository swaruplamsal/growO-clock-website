import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ServicesContent from "./ServicesContent";

export const metadata = {
  title: "Our Services - grO'Clock",
  description:
    "Explore grO'Clock's comprehensive financial services: Financial Planning, Investment Strategy, Risk Management, Business Advisory, Tax Consulting, and Wealth Management.",
};

export default function ServicesPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Our Services"
        subtitle="Comprehensive financial solutions designed to help you grow with confidence."
      />
      <ServicesContent />
      <Footer />
    </main>
  );
}
