import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "grO'Clock - Smart Financial Solutions for a Secure Future",
  description:
    "We provide innovative financial solutions that empower individuals and businesses to grow with confidence. Financial planning, investment strategy, and wealth management.",
  keywords:
    "financial planning, investment, wealth management, tax consulting, grO'Clock",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
