"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // Check for session expired message in URL params
  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason === "expired") {
      setError("Your session has expired. Please log in again.");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(formData.email, formData.password);
      router.push("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.response?.data?.non_field_errors?.[0] ||
        "Invalid email or password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative">
      <Navbar />
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <Link href="/">
                <Image
                  src="/grOw.png"
                  alt="grO'Clock"
                  width={100}
                  height={50}
                  className="mx-auto mb-4"
                />
              </Link>
              <h1 className="font-merriweather text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="font-montserrat text-sm text-gray-500">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-montserrat text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-montserrat text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="font-montserrat text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 font-montserrat text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-3.5 bg-primary text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="font-montserrat text-sm text-gray-500 text-center mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
