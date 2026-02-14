import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Link from "next/link";

export const metadata = {
  title: "Blog - grO'Clock",
  description:
    "Read the latest articles, insights, and tips from grO'Clock's financial experts. Stay informed about market trends and financial planning.",
};

const posts = [
  {
    category: "Financial Planning",
    title: "10 Essential Steps for Building a Strong Financial Foundation",
    excerpt:
      "Learn the fundamental building blocks of financial planning that every individual should implement for long-term success.",
    author: "Swarup Lamsal",
    date: "Feb 10, 2026",
    readTime: "8 min read",
  },
  {
    category: "Investment",
    title: "Understanding Market Volatility: A Beginner's Guide",
    excerpt:
      "Market volatility can be intimidating. Here's how to understand it and use it to your advantage as an investor.",
    author: "Rajesh Thapa",
    date: "Feb 5, 2026",
    readTime: "6 min read",
  },
  {
    category: "Tax Planning",
    title: "Tax-Saving Investment Options You Should Know About",
    excerpt:
      "Explore the best tax-saving investment instruments that can help you reduce your tax liability while growing your wealth.",
    author: "Bikash Karki",
    date: "Jan 28, 2026",
    readTime: "7 min read",
  },
  {
    category: "Wealth Management",
    title: "The Power of Compound Interest: Start Early, Grow Big",
    excerpt:
      "Discover how compound interest works and why starting your investment journey early can make a massive difference.",
    author: "Anita Gurung",
    date: "Jan 20, 2026",
    readTime: "5 min read",
  },
  {
    category: "Business",
    title: "Financial Strategies Every Startup Founder Should Know",
    excerpt:
      "From cash flow management to fundraising, essential financial strategies that can make or break your startup.",
    author: "Swarup Lamsal",
    date: "Jan 12, 2026",
    readTime: "9 min read",
  },
  {
    category: "Market Analysis",
    title: "Nepal's Economic Outlook for 2026: Key Trends to Watch",
    excerpt:
      "Our analysts examine the key economic indicators and trends that will shape Nepal's financial landscape in the coming year.",
    author: "Rajesh Thapa",
    date: "Jan 5, 2026",
    readTime: "10 min read",
  },
];

export default function BlogPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        title="Blog"
        subtitle="Insights, tips, and expert analysis to keep you financially informed."
      />

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <article
                key={post.title}
                className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 group flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary-dark/30 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-primary/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-montserrat text-xs font-semibold rounded-full mb-3 w-fit">
                    {post.category}
                  </span>
                  <h3 className="font-merriweather text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="font-montserrat text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs font-montserrat text-gray-400 pt-4 border-t border-gray-200">
                    <span>{post.author}</span>
                    <span>
                      {post.date} &middot; {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
