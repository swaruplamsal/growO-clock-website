"use client";
import { useState, useEffect } from "react";
import { notificationsAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const typeIcons = {
  consultation: "text-blue-500",
  document: "text-amber-500",
  financial: "text-emerald-500",
  investment: "text-purple-500",
  system: "text-gray-500",
};

export default function NotificationsPage() {
  const { refreshUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationsAPI.list();
      setNotifications(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      refreshUser();
    } catch {
      flash("error", "Failed to mark as read.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      refreshUser();
      flash("success", "All notifications marked as read.");
    } catch {
      flash("error", "Failed to mark all as read.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      refreshUser();
    } catch {
      flash("error", "Failed to delete notification.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const timeAgo = (date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-merriweather text-2xl font-bold text-gray-900">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="font-montserrat text-sm text-gray-500 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 && "s"}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="font-montserrat text-sm text-primary hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg font-montserrat text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
        >
          {message.text}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <p className="font-montserrat text-gray-500">No notifications yet.</p>
          <p className="font-montserrat text-sm text-gray-400 mt-1">
            You&apos;ll be notified about important updates here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-xl border transition-all ${n.is_read ? "border-gray-100" : "border-primary/20 bg-primary/[0.02]"}`}
            >
              <div className="px-5 py-4 flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${n.is_read ? "bg-gray-100" : "bg-primary/10"}`}
                >
                  <svg
                    className={`w-5 h-5 ${n.is_read ? "text-gray-400" : typeIcons[n.notification_type] || "text-primary"}`}
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

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-montserrat text-sm ${n.is_read ? "text-gray-600" : "text-gray-900 font-medium"}`}
                  >
                    {n.title || n.message}
                  </p>
                  {n.title && n.message && n.message !== n.title && (
                    <p className="font-montserrat text-xs text-gray-500 mt-0.5">
                      {n.message}
                    </p>
                  )}
                  <p className="font-montserrat text-xs text-gray-400 mt-1">
                    {timeAgo(n.created_at)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                      title="Mark as read"
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
