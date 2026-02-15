"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI, usersAPI, notificationsAPI } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [logoutMessage, setLogoutMessage] = useState(null);

  // Listen for forced logout (e.g., session expired from interceptor)
  useEffect(() => {
    const handleLogout = (event) => {
      setUser(null);
      setUnreadCount(0);
      setLogoutMessage(event.detail?.reason || "Session expired");
      // Clear message after 5 seconds
      setTimeout(() => setLogoutMessage(null), 5000);
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
      // Refresh user data from API
      usersAPI
        .getMe()
        .then(({ data }) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch(() => {
          // Token might be expired, interceptor handles refresh
        });
    }
    setLoading(false);
  }, []);

  // Poll unread notifications when logged in
  useEffect(() => {
    if (!user) return;
    const fetchUnread = () => {
      notificationsAPI
        .unreadCount()
        .then(({ data }) =>
          setUnreadCount(data.unread_count ?? data.count ?? 0),
        )
        .catch((err) => {
          // If it's a 401, the interceptor will handle logout
          // Log other errors for debugging
          if (err.response?.status !== 401) {
            console.debug("Failed to fetch unread notifications", err.message);
          }
        });
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000); // every 60s
    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    const tokens = data.data?.tokens || data.tokens || data;
    const userData = data.data?.user || data.user || data;
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return data;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await authAPI.register(formData);
    const tokens = data.data?.tokens || data.tokens || {};
    const userData = data.data?.user || data.user || data;
    if (tokens.access) {
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      if (refreshToken) await authAPI.logout(refreshToken);
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    setUnreadCount(0);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await usersAPI.getMe();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch {
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        unreadCount,
        setUnreadCount,
        logoutMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
