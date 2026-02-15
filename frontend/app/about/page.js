import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import AboutContent from "./AboutContent";

export const metadata = {
  title: "About Us - grO'Clock",
  description:
    "Learn about gro O'Clock, our mission, vision, team, and board of directors. We provide smart financial solutions for a secure future.",
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="About Us"
        subtitle="Empowering individuals and businesses with smart financial solutions since 2014."
      />
      <AboutContent />
      <Footer />
    </main>
  );
}
