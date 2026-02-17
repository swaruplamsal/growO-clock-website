"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { blogAPI } from "@/lib/api";

export default function EditBlogPostPage() {
  const router = useRouter();
  const { slug } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    status: "DRAFT",
    is_featured: false,
    published_at: "",
  });

  useEffect(() => {
    // Fetch categories and tags
    blogAPI
      .getCategories()
      .then(({ data }) => setCategories(data.results || data || []))
      .catch(() => {});
    blogAPI
      .getTags()
      .then(({ data }) => setTags(data.results || data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!slug) return;

    // Fetch existing post
    const fetchPost = async () => {
      try {
        const { data } = await blogAPI.getPost(slug);

        // Format published_at for datetime-local input
        let publishedAt = "";
        if (data.published_at) {
          const date = new Date(data.published_at);
          publishedAt = date.toISOString().slice(0, 16);
        }

        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          content: data.content || "",
          category: data.category?.id || "",
          tags: data.tags?.map((t) => t.id) || [],
          status: data.status || "DRAFT",
          is_featured: data.is_featured || false,
          published_at: publishedAt,
        });
      } catch (error) {
        console.error("Failed to fetch post", error);
        alert("Failed to load blog post");
        router.push("/dashboard/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTagToggle = (tagId) => {
    const newTags = formData.tags.includes(tagId)
      ? formData.tags.filter((t) => t !== tagId)
      : [...formData.tags, tagId];
    setFormData({ ...formData, tags: newTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSend = {
        ...formData,
        category: formData.category || null,
        tags: formData.tags,
        published_at:
          formData.status === "PUBLISHED" && !formData.published_at
            ? new Date().toISOString()
            : formData.published_at || null,
      };

      await blogAPI.updatePost(slug, dataToSend);
      alert("Blog post updated successfully!");
      router.push("/dashboard/blog");
    } catch (error) {
      console.error("Failed to update post", error);
      alert(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to update blog post. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Check if user is admin or advisor
  const canManageBlog = user?.role === "ADMIN" || user?.role === "ADVISOR";

  if (!canManageBlog) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="font-merriweather text-xl font-bold text-red-900 mb-2">
            Access Denied
          </h2>
          <p className="font-montserrat text-red-700">
            You don&apos;t have permission to edit blog posts.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-merriweather text-3xl font-bold text-gray-900 mb-2">
          Edit Blog Post
        </h1>
        <p className="font-montserrat text-gray-600">
          Update your blog post content and settings
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Title */}
          <div className="mb-6">
            <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter blog post title"
            />
          </div>

          {/* Slug */}
          <div className="mb-6">
            <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm bg-gray-100 cursor-not-allowed"
              placeholder="url-friendly-slug"
            />
            <p className="font-montserrat text-xs text-gray-500 mt-1">
              Slug cannot be changed after creation to maintain URL integrity
            </p>
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">
              Excerpt *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Brief summary of the blog post (max 500 characters)"
            />
            <p className="font-montserrat text-xs text-gray-500 mt-1">
              {formData.excerpt.length}/500 characters
            </p>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              placeholder="Write your blog post content here..."
            />
            <p className="font-montserrat text-xs text-gray-500 mt-1">
              {formData.content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          {/* Category and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Category */}
            <div>
              <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Published Date */}
            <div>
              <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">
                Publish Date
              </label>
              <input
                type="datetime-local"
                name="published_at"
                value={formData.published_at}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-6">
              <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-3">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-4 py-2 rounded-full font-montserrat text-sm font-medium transition-colors ${
                      formData.tags.includes(tag.id)
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Featured */}
          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
              <span className="ml-3 font-montserrat text-sm font-semibold text-gray-700">
                Mark as featured post
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-montserrat text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary text-white font-montserrat text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
