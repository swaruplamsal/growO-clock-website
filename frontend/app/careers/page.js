import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CareersContent from "./CareersContent";

export const metadata = {
  title: "Careers - grO'Clock",
  description:
    "Join the grO'Clock team. Explore career opportunities and be part of a team that's transforming financial services.",
};

export default function CareersPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Careers"
        subtitle="Join our team and help shape the future of financial services in Nepal."
      />
      <CareersContent />
      <Footer />
    </main>
  );
}
