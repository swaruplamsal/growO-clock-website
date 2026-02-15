"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogAPI } from "@/lib/api";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      try {
        const { data } = await blogAPI.getPost(slug);
        setPost(data);
        // Track view
        blogAPI.trackView(slug).catch(() => {});
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="font-merriweather text-3xl font-bold text-gray-900 mb-4">
              Article Not Found
            </h1>
            <p className="font-montserrat text-gray-500 mb-6">
              The article you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link
              href="/blog"
              className="px-6 py-3 bg-primary text-white font-montserrat text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      {/* Hero */}
      <section className="relative w-full h-[50vh] min-h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: post.featured_image
              ? `url('${post.featured_image}')`
              : "url('/1.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4 pt-20 max-w-4xl mx-auto">
          {post.category && (
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-accent font-montserrat text-xs font-semibold rounded-full mb-4">
              {post.category?.name || post.category}
            </span>
          )}
          <h1 className="font-merriweather text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-300 font-montserrat text-sm">
            <span>
              By {post.author?.full_name || post.author_name || "Team"}
            </span>
            <span>·</span>
            <span>{formatDate(post.published_at || post.created_at)}</span>
            {post.read_time && (
              <>
                <span>·</span>
                <span>{post.read_time} min read</span>
              </>
            )}
            {post.view_count !== undefined && (
              <>
                <span>·</span>
                <span>{post.view_count} views</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none font-montserrat text-gray-700 leading-relaxed
              prose-headings:font-merriweather prose-headings:text-gray-900
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id || tag.slug || tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 font-montserrat text-xs rounded-full"
                  >
                    #{tag.name || tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back */}
          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary font-montserrat text-sm font-semibold hover:underline"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
