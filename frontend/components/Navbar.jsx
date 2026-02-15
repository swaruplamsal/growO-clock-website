"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    hasDropdown: true,
    dropdownItems: [
      { label: "Our Story", href: "/about#our-story" },
      { label: "Mission & Vision", href: "/about#mission" },
      { label: "Our Team", href: "/about#team" },
      { label: "Board of Directors", href: "/about#board" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    hasDropdown: true,
    dropdownItems: [
      { label: "Financial Planning", href: "/services#financial-planning" },
      { label: "Investment Strategy", href: "/services#investment-strategy" },
      { label: "Risk Management", href: "/services#risk-management" },
      { label: "Business Advisory", href: "/services#business-advisory" },
      { label: "Tax Consulting", href: "/services#tax-consulting" },
      { label: "Wealth Management", href: "/services#wealth-management" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    hasDropdown: true,
    dropdownItems: [
      { label: "Help Center", href: "/resources#help-center" },
      { label: "FAQs", href: "/resources#faqs" },
      { label: "Market Insights", href: "/resources#market-insights" },
      { label: "Calculators", href: "/resources/calculators" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, unreadCount } = useAuth();

  const handleSmoothScroll = (e, href) => {
    const [path, hash] = href.split("#");
    if (hash && pathname === path) {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setMobileOpen(false);
      setActiveDropdown(null);
    } else {
      setMobileOpen(false);
      setActiveDropdown(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
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
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-montserrat font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? "text-accent"
                      : "text-white hover:text-primary"
                  }`}
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

                {/* Dropdown Menu */}
                {link.hasDropdown && activeDropdown === link.label && (
                  <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {link.dropdownItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={(e) => handleSmoothScroll(e, item.href)}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary font-montserrat transition-colors duration-150"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-white hover:text-accent transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                    {user?.profile?.avatar || user?.avatar ? (
                      <img
                        src={user?.profile?.avatar || user?.avatar}
                        alt=""
                        className="w-8 h-8 object-cover"
                      />
                    ) : (
                      user?.full_name?.[0] ||
                      user?.email?.[0]?.toUpperCase() ||
                      "U"
                    )}
                  </div>
                  <span className="font-montserrat text-sm font-medium max-w-[120px] truncate">
                    {user?.full_name?.split(" ")[0] || "Account"}
                  </span>
                  {unreadCount > 0 && (
                    <span className="w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
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
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-montserrat text-sm font-semibold text-gray-900 truncate">
                        {user?.full_name}
                      </p>
                      <p className="font-montserrat text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary font-montserrat"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary font-montserrat"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard/consultations"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary font-montserrat"
                    >
                      Consultations
                    </Link>
                    <Link
                      href="/dashboard/notifications"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary font-montserrat"
                    >
                      Notifications
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-montserrat"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
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
          mobileOpen ? "max-h-[80vh] border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="bg-white px-4 py-3 space-y-1 overflow-y-auto max-h-[70vh]">
          {navLinks.map((link) => (
            <div key={link.label}>
              <div className="flex items-center justify-between">
                <Link
                  href={link.href}
                  className={`flex-1 px-3 py-2 text-sm font-montserrat font-medium rounded-md transition-colors ${
                    pathname === link.href
                      ? "text-primary bg-primary/5"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={() => !link.hasDropdown && setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.hasDropdown && (
                  <button
                    onClick={() =>
                      setMobileDropdown(
                        mobileDropdown === link.label ? null : link.label,
                      )
                    }
                    className="p-2 text-gray-500 hover:text-primary"
                    aria-label={`Toggle ${link.label} submenu`}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileDropdown === link.label ? "rotate-180" : ""
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
                  </button>
                )}
              </div>

              {/* Mobile Dropdown */}
              {link.hasDropdown && mobileDropdown === link.label && (
                <div className="ml-4 pl-3 border-l-2 border-gray-200 space-y-1 py-1">
                  {link.dropdownItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={(e) => {
                        handleSmoothScroll(e, item.href);
                        setMobileOpen(false);
                      }}
                      className="block px-3 py-2 text-sm text-gray-500 hover:text-primary font-montserrat transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-montserrat font-medium text-primary rounded-md hover:bg-primary/5"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="px-3 py-2 text-sm font-montserrat font-medium text-gray-700 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/dashboard/notifications"
                  className="flex items-center justify-between px-3 py-2 text-sm font-montserrat font-medium text-gray-700 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="px-3 py-2 text-sm font-montserrat font-medium text-red-600 rounded-md hover:bg-red-50 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-montserrat font-medium text-gray-700 hover:text-primary rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-montserrat font-semibold text-white bg-accent hover:bg-cyan-500 rounded-full text-center transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
