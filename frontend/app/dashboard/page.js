"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  consultationsAPI,
  plansAPI,
  investmentsAPI,
  documentsAPI,
  notificationsAPI,
} from "@/lib/api";

const statCards = [
  {
    key: "consultations",
    label: "Consultations",
    href: "/dashboard/consultations",
    color: "bg-blue-500",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    key: "plans",
    label: "Financial Plans",
    href: "/dashboard/financial-plans",
    color: "bg-emerald-500",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    key: "portfolios",
    label: "Portfolios",
    href: "/dashboard/investments",
    color: "bg-purple-500",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
  {
    key: "documents",
    label: "Documents",
    href: "/dashboard/documents",
    color: "bg-amber-500",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    consultations: 0,
    plans: 0,
    portfolios: 0,
    documents: 0,
    notifications: 0,
  });
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const results = await Promise.allSettled([
          consultationsAPI.list({ page_size: 5 }),
          plansAPI.list(),
          investmentsAPI.listPortfolios(),
          documentsAPI.list(),
          notificationsAPI.unreadCount(),
        ]);

        const consultations =
          results[0].status === "fulfilled"
            ? results[0].value.data
            : { results: [], count: 0 };
        const plans =
          results[1].status === "fulfilled" ? results[1].value.data : [];
        const portfolios =
          results[2].status === "fulfilled" ? results[2].value.data : [];
        const documents =
          results[3].status === "fulfilled" ? results[3].value.data : [];
        const unread =
          results[4].status === "fulfilled"
            ? results[4].value.data
            : { count: 0 };

        setStats({
          consultations:
            consultations.count ??
            (Array.isArray(consultations) ? consultations.length : 0),
          plans: Array.isArray(plans) ? plans.length : (plans.count ?? 0),
          portfolios: Array.isArray(portfolios)
            ? portfolios.length
            : (portfolios.count ?? 0),
          documents: Array.isArray(documents)
            ? documents.length
            : (documents.count ?? 0),
          notifications: unread.count ?? unread.unread_count ?? 0,
        });

        const consultList =
          consultations.results ??
          (Array.isArray(consultations) ? consultations : []);
        setRecentConsultations(consultList.slice(0, 5));
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-6 lg:p-8 shadow-lg">
        <h1 className="font-merriweather text-2xl lg:text-3xl font-bold">
          {greeting()}, {user?.full_name?.split(" ")[0] || "there"}!
        </h1>
        <p className="font-montserrat text-blue-100 mt-2">
          Here&apos;s an overview of your financial dashboard.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`${card.color} p-3 rounded-lg text-white shadow-md group-hover:shadow-lg transition-shadow`}
              >
                {card.icon}
              </div>
              <svg
                className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors"
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
            </div>
            <p className="font-montserrat text-3xl font-bold text-gray-900 mb-1">
              {stats[card.key]}
            </p>
            <p className="font-montserrat text-sm text-gray-500">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Unread Notifications */}
      {stats.notifications > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg shadow-sm">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <p className="font-montserrat text-sm text-amber-800">
              You have <strong>{stats.notifications}</strong> unread
              notification{stats.notifications !== 1 && "s"}.
            </p>
          </div>
          <Link
            href="/dashboard/notifications"
            className="font-montserrat text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-amber-100"
          >
            View All
          </Link>
        </div>
      )}

      {/* Recent Consultations */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="font-merriweather text-lg font-bold text-gray-900">
            Recent Consultations
          </h2>
          <Link
            href="/dashboard/consultations"
            className="font-montserrat text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
        {recentConsultations.length === 0 ? (
          <div className="px-6 py-12 text-center bg-gradient-to-b from-gray-50 to-white">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="font-montserrat text-gray-500 mb-4">
              No consultations yet.
            </p>
            <Link
              href="/dashboard/consultations"
              className="inline-flex items-center gap-2 font-montserrat text-sm bg-gradient-to-r from-primary to-primary-dark text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Book a Consultation
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentConsultations.map((c) => (
              <div
                key={c.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200"
              >
                <div>
                  <p className="font-montserrat text-sm font-semibold text-gray-900">
                    {c.consultation_type_display ||
                      c.consultation_type ||
                      "Consultation"}
                  </p>
                  <p className="font-montserrat text-xs text-gray-500 mt-0.5">
                    {c.scheduled_date
                      ? new Date(c.scheduled_date).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <span
                  className={`font-montserrat text-xs px-3 py-1.5 rounded-full font-medium shadow-sm ${
                    c.status === "SCHEDULED"
                      ? "bg-green-100 text-green-700"
                      : c.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : c.status === "COMPLETED"
                          ? "bg-blue-100 text-blue-700"
                          : c.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {c.status_display || c.status || "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-merriweather text-lg font-bold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Book Consultation",
              href: "/dashboard/consultations",
              desc: "Schedule a meeting with an advisor",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              label: "Create Financial Plan",
              href: "/dashboard/financial-plans",
              desc: "Start planning your finances",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              label: "Upload Document",
              href: "/dashboard/documents",
              desc: "Securely store your documents",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              ),
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-all duration-300 shadow-sm">
                {action.icon}
              </div>
              <p className="font-montserrat text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1">
                {action.label}
              </p>
              <p className="font-montserrat text-xs text-gray-500">
                {action.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
