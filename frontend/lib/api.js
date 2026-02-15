import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT access token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem("access_token", data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          // Trigger logout in AuthContext via a custom event
          window.dispatchEvent(
            new CustomEvent("auth:logout", {
              detail: { reason: "Session expired. Please log in again." },
            }),
          );

          // Redirect to login
          if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login?reason=expired";
          }
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  },
);

// ─── Auth ────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register/", data),
  login: (data) => api.post("/auth/login/", data),
  logout: (refreshToken) =>
    api.post("/auth/logout/", { refresh: refreshToken }),
  refresh: (refreshToken) =>
    api.post("/auth/refresh/", { refresh: refreshToken }),
  verifyEmail: (data) => api.post("/auth/verify-email/", data),
  resendVerification: () => api.post("/auth/resend-verification/"),
  forgotPassword: (data) => api.post("/auth/forgot-password/", data),
  resetPassword: (data) => api.post("/auth/reset-password/", data),
};

// ─── Users ───────────────────────────────────────────────────────
export const usersAPI = {
  getMe: () => api.get("/users/me/"),
  updateMe: (data) => api.patch("/users/me/", data),
  getProfile: () => api.get("/users/me/profile/"),
  updateProfile: (data) => api.patch("/users/me/profile/", data),
  getPreferences: () => api.get("/users/me/preferences/"),
  updatePreferences: (data) => api.patch("/users/me/preferences/", data),
  changePassword: (data) => api.put("/users/me/password/", data),
  uploadAvatar: (formData) =>
    api.patch("/users/me/avatar/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteAccount: () => api.delete("/users/me/delete/"),
};

// ─── Blog ────────────────────────────────────────────────────────
export const blogAPI = {
  getPosts: (params) => api.get("/blog/posts/", { params }),
  getPost: (slug) => api.get(`/blog/posts/${slug}/`),
  trackView: (slug) => api.post(`/blog/posts/${slug}/view/`),
  getCategories: () => api.get("/blog/categories/"),
  getTags: () => api.get("/blog/tags/"),
};

// ─── Contact ─────────────────────────────────────────────────────
export const contactAPI = {
  submit: (data) => api.post("/contact/", data),
};

// ─── Careers ─────────────────────────────────────────────────────
export const careersAPI = {
  getPositions: () => api.get("/careers/positions/"),
  getPosition: (id) => api.get(`/careers/positions/${id}/`),
  apply: (formData) =>
    api.post("/careers/apply/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ─── Consultations ───────────────────────────────────────────────
export const consultationsAPI = {
  list: (params) => api.get("/consultations/", { params }),
  create: (data) => api.post("/consultations/", data),
  get: (id) => api.get(`/consultations/${id}/`),
  update: (id, data) => api.patch(`/consultations/${id}/`, data),
  cancel: (id) => api.delete(`/consultations/${id}/`),
  reschedule: (id, data) => api.post(`/consultations/${id}/reschedule/`, data),
  getDocuments: (id) => api.get(`/consultations/${id}/documents/`),
  uploadDocument: (id, formData) =>
    api.post(`/consultations/${id}/documents/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ─── Financial Planning ──────────────────────────────────────────
export const plansAPI = {
  list: () => api.get("/plans/"),
  create: (data) => api.post("/plans/", data),
  get: (id) => api.get(`/plans/${id}/`),
  update: (id, data) => api.patch(`/plans/${id}/`, data),
  delete: (id) => api.delete(`/plans/${id}/`),
  // Goals
  listGoals: (planId) => api.get(`/plans/${planId}/goals/`),
  createGoal: (planId, data) => api.post(`/plans/${planId}/goals/`, data),
  updateGoal: (planId, goalId, data) =>
    api.put(`/plans/${planId}/goals/${goalId}/`, data),
  deleteGoal: (planId, goalId) =>
    api.delete(`/plans/${planId}/goals/${goalId}/`),
  // Income
  listIncomes: (planId) => api.get(`/plans/${planId}/incomes/`),
  createIncome: (planId, data) => api.post(`/plans/${planId}/incomes/`, data),
  // Expenses
  listExpenses: (planId) => api.get(`/plans/${planId}/expenses/`),
  createExpense: (planId, data) => api.post(`/plans/${planId}/expenses/`, data),
  // Assets
  listAssets: (planId) => api.get(`/plans/${planId}/assets/`),
  createAsset: (planId, data) => api.post(`/plans/${planId}/assets/`, data),
  // Liabilities
  listLiabilities: (planId) => api.get(`/plans/${planId}/liabilities/`),
  createLiability: (planId, data) =>
    api.post(`/plans/${planId}/liabilities/`, data),
};

// ─── Calculators ─────────────────────────────────────────────────
export const calculatorsAPI = {
  compoundInterest: (data) => api.post("/calculators/compound-interest/", data),
  retirement: (data) => api.post("/calculators/retirement/", data),
  loan: (data) => api.post("/calculators/loan/", data),
  investmentGrowth: (data) => api.post("/calculators/investment-growth/", data),
  taxEstimation: (data) => api.post("/calculators/tax-estimation/", data),
};

// ─── Investments / Portfolios ────────────────────────────────────
export const investmentsAPI = {
  listPortfolios: () => api.get("/investments/portfolios/"),
  createPortfolio: (data) => api.post("/investments/portfolios/", data),
  getPortfolio: (id) => api.get(`/investments/portfolios/${id}/`),
  updatePortfolio: (id, data) =>
    api.patch(`/investments/portfolios/${id}/`, data),
  deletePortfolio: (id) => api.delete(`/investments/portfolios/${id}/`),
  // Holdings
  listHoldings: (portfolioId) =>
    api.get(`/investments/portfolios/${portfolioId}/holdings/`),
  createHolding: (portfolioId, data) =>
    api.post(`/investments/portfolios/${portfolioId}/holdings/`, data),
  updateHolding: (portfolioId, holdingId, data) =>
    api.put(
      `/investments/portfolios/${portfolioId}/holdings/${holdingId}/`,
      data,
    ),
  deleteHolding: (portfolioId, holdingId) =>
    api.delete(`/investments/portfolios/${portfolioId}/holdings/${holdingId}/`),
  // Performance
  getPerformance: (portfolioId) =>
    api.get(`/investments/portfolios/${portfolioId}/performance/`),
};

// ─── Documents ───────────────────────────────────────────────────
export const documentsAPI = {
  list: () => api.get("/documents/"),
  upload: (formData) =>
    api.post("/documents/upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  get: (id) => api.get(`/documents/${id}/`),
  delete: (id) => api.delete(`/documents/${id}/`),
  download: (id) =>
    api.get(`/documents/${id}/download/`, { responseType: "blob" }),
  share: (id, userIds) =>
    api.post(`/documents/${id}/share/`, { user_ids: userIds }),
};

// ─── Notifications ───────────────────────────────────────────────
export const notificationsAPI = {
  list: (params) => api.get("/notifications/", { params }),
  get: (id) => api.get(`/notifications/${id}/`),
  markRead: (id) => api.post(`/notifications/${id}/read/`),
  markAllRead: () => api.post("/notifications/mark-all-read/"),
  delete: (id) => api.delete(`/notifications/${id}/delete/`),
  unreadCount: () => api.get("/notifications/unread-count/"),
};

// ─── Analytics ───────────────────────────────────────────────────
export const analyticsAPI = {
  dashboard: () => api.get("/admin/dashboard/"),
  userAnalytics: () => api.get("/admin/user/"),
  consultationAnalytics: () => api.get("/admin/consultations/"),
  trackPageView: (data) => api.post("/admin/track-page-view/", data),
};

export default api;
