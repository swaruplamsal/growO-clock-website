import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ContactContent from "./ContactContent";

export const metadata = {
  title: "Contact Us - grO'Clock",
  description:
    "Get in touch with grO'Clock. Reach out for inquiries, consultations, or support. We're here to help with your financial needs.",
};

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out and let's start a conversation."
      />
      <ContactContent />
      <Footer />
    </main>
  );
}
