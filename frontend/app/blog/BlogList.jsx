"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { blogAPI } from "@/lib/api";

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      const { data } = await blogAPI.getPosts(params);
      const results = data.results || data;
      setPosts(Array.isArray(results) ? results : []);
      setHasNext(!!data.next);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    blogAPI
      .getCategories()
      .then(({ data }) => setCategories(data.results || data || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white font-montserrat text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Search
            </button>
          </form>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id || cat.slug} value={cat.slug || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
            <h3 className="font-merriweather text-xl font-bold text-gray-400 mb-2">
              No articles found
            </h3>
            <p className="font-montserrat text-sm text-gray-400">
              Check back later for new content.
            </p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.id || post.slug}
                  className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 group flex flex-col"
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-primary-dark/30 flex items-center justify-center overflow-hidden">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
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
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    {post.category && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-montserrat text-xs font-semibold rounded-full mb-3 w-fit">
                        {post.category?.name || post.category}
                      </span>
                    )}
                    <h3 className="font-merriweather text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="font-montserrat text-sm text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                      {post.excerpt || post.content?.substring(0, 150)}
                    </p>
                    <div className="flex items-center justify-between text-xs font-montserrat text-gray-400 pt-4 border-t border-gray-200">
                      <span>
                        {post.author?.full_name || post.author_name || "Team"}
                      </span>
                      <span>
                        {formatDate(post.published_at || post.created_at)}
                        {post.read_time && ` · ${post.read_time} min read`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-montserrat text-sm rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-5 py-2.5 bg-primary text-white font-montserrat text-sm rounded-lg">
                Page {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-montserrat text-sm rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
