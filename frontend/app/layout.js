import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "grO'Clock - Smart Financial Solutions for a Secure Future",
  description:
    "We provide innovative financial solutions that empower individuals and businesses to grow with confidence. Financial planning, investment strategy, and wealth management.",
  keywords:
    "financial planning, investment, wealth management, tax consulting, grO'Clock",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
