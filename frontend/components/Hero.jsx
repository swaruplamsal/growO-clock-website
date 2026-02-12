import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl pt-20">
          <h1 className="font-merriweather text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Smart Financial Solutions for a{" "}
            <span className="text-accent">Secure Future.</span>
          </h1>

          <p className="font-montserrat text-base sm:text-lg text-gray-200 mb-10 max-w-xl leading-relaxed">
            We provide innovative financial solutions that empower individuals
            and businesses to grow with confidence.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/get-started"
              className="group px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-montserrat font-semibold text-sm rounded-md hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 bg-accent text-white font-montserrat font-semibold text-sm rounded-md hover:bg-cyan-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-white/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
