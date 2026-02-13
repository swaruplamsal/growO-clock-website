"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    hasDropdown: true,
  },
  {
    label: "Services",
    href: "/services",
    hasDropdown: true,
  },
  {
    label: "Resources",
    href: "/resources",
    hasDropdown: true,
  },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 ">
            <Image
              src="/grOw.png"
              alt="grO'Clock"
              width={120}
              height={60}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() =>
                  link.hasDropdown && setActiveDropdown(link.label)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-montserrat font-medium text-white hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === link.label ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>

                {/* Dropdown placeholder */}
                {link.hasDropdown && activeDropdown === link.label && (
                  <div className="absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary font-montserrat"
                    >
                      Option 1
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary font-montserrat"
                    >
                      Option 2
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary font-montserrat"
                    >
                      Option 3
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-montserrat font-medium text-white hover:text-primary transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-7 py-3 text-sm font-montserrat font-semibold text-black bg-accent hover:bg-cyan-500 hover:text-gray-100 rounded-3xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-white hover:text-primary hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96 border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center justify-between px-3 py-2 text-sm font-montserrat font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
              {link.hasDropdown && (
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col space-y-2">
            <Link
              href="/login"
              className="px-3 py-2 text-sm font-montserrat font-medium text-gray-700 hover:text-primary rounded-md"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-montserrat font-semibold text-white bg-accent hover:bg-cyan-500 rounded-full text-center transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
