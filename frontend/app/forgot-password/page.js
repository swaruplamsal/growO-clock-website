"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { authAPI } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to send reset link. Please try again.",
      );
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
                Reset Password
              </h1>
              <p className="font-montserrat text-sm text-gray-500">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </div>

            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <svg
                  className="w-16 h-16 text-green-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="font-merriweather text-xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </h3>
                <p className="font-montserrat text-sm text-gray-600 mb-4">
                  We&apos;ve sent a password reset link to{" "}
                  <strong>{email}</strong>
                </p>
                <Link
                  href="/login"
                  className="font-montserrat text-sm text-primary hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            ) : (
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-3.5 bg-primary text-white font-montserrat font-semibold text-sm rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            <p className="font-montserrat text-sm text-gray-500 text-center mt-6">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
