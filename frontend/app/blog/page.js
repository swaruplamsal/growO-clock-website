import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import BlogList from "./BlogList";

export const metadata = {
  title: "Blog - grO'Clock",
  description:
    "Read the latest articles, insights, and tips from grO'Clock's financial experts. Stay informed about market trends and financial planning.",
};

export default function BlogPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Blog"
        subtitle="Insights, tips, and expert analysis to keep you financially informed."
      />
      <BlogList />
      <Footer />
    </main>
  );
}
