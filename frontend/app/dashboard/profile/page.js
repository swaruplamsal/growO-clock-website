"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { usersAPI } from "@/lib/api";

const tabs = ["Personal Info", "Preferences", "Security"];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Personal
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    date_of_birth: "",
    address: "",
    city: "",
    country: "",
    occupation: "",
    annual_income: "",
    risk_tolerance: "MODERATE",
    bio: "",
  });
  // Preferences
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    dark_mode: false,
  });
  // Security
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const avatarRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, profileRes, prefsRes] = await Promise.allSettled([
          usersAPI.getMe(),
          usersAPI.getProfile(),
          usersAPI.getPreferences(),
        ]);

        const me = meRes.status === "fulfilled" ? meRes.value.data : {};
        const prof =
          profileRes.status === "fulfilled" ? profileRes.value.data : {};
        const prefs =
          prefsRes.status === "fulfilled" ? prefsRes.value.data : {};

        setProfile({
          full_name: me.full_name || "",
          phone: me.phone || "",
          date_of_birth: prof.date_of_birth || "",
          address: prof.address || "",
          city: prof.city || "",
          country: prof.country || "",
          occupation: prof.occupation || "",
          annual_income: prof.annual_income || "",
          risk_tolerance: prof.risk_tolerance || "MODERATE",
          bio: prof.bio || "",
        });
        setPreferences({
          email_notifications: prefs.email_notifications ?? true,
          sms_notifications: prefs.sms_notifications ?? false,
          push_notifications: prefs.push_notifications ?? true,
          dark_mode: prefs.dark_mode ?? false,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersAPI.updateMe({
        full_name: profile.full_name,
        phone: profile.phone,
      });
      await usersAPI.updateProfile({
        date_of_birth: profile.date_of_birth || null,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        occupation: profile.occupation,
        annual_income: profile.annual_income || null,
        risk_tolerance: profile.risk_tolerance,
        bio: profile.bio,
      });
      await refreshUser();
      flash("success", "Profile updated successfully!");
    } catch (err) {
      flash("error", err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersAPI.updatePreferences(preferences);
      flash("success", "Preferences saved!");
    } catch (err) {
      flash(
        "error",
        err.response?.data?.detail || "Failed to save preferences.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      flash("error", "Passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await usersAPI.changePassword({
        old_password: passwords.old_password,
        new_password: passwords.new_password,
        new_password_confirm: passwords.confirm_password,
      });
      setPasswords({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      flash("success", "Password changed successfully!");
    } catch (err) {
      const msg =
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.detail ||
        "Failed to change password.";
      flash("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      flash("error", "Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      flash("error", "Avatar image must be less than 2MB.");
      return;
    }
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      await usersAPI.uploadAvatar(formData);
      await refreshUser();
      flash("success", "Avatar updated!");
    } catch (err) {
      const msg =
        err.response?.data?.avatar?.[0] ||
        err.response?.data?.detail ||
        "Failed to upload avatar.";
      flash("error", msg);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-lg font-montserrat text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-merriweather text-2xl lg:text-3xl font-bold text-gray-900">
          My Profile
        </h1>
        <p className="font-montserrat text-sm text-gray-500 mt-1">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-lg font-montserrat text-sm shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === "success" ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200" : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200"}`}
        >
          {message.text}
        </div>
      )}

      {/* Avatar */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center gap-6 shadow-md hover:shadow-lg transition-shadow">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user?.profile?.avatar || user?.avatar ? (
              <img
                src={user?.profile?.avatar || user?.avatar}
                alt=""
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              user?.full_name?.[0] || "U"
            )}
          </div>
          <button
            onClick={() => avatarRef.current?.click()}
            className="absolute -bottom-1 -right-1 bg-white border-2 border-primary rounded-full p-2 shadow-lg hover:bg-primary hover:text-white transition-all duration-200"
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>
        <div>
          <p className="font-montserrat font-bold text-lg text-gray-900">
            {user?.full_name}
          </p>
          <p className="font-montserrat text-sm text-gray-500 mt-1">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-md">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-1 px-4 py-3.5 font-montserrat text-sm font-semibold transition-all duration-200 ${activeTab === i ? "text-primary border-b-2 border-primary bg-gradient-to-t from-primary/5 to-transparent" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Personal Info */}
          {activeTab === 0 && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <div>
                  <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    className={inputClass}
                    value={profile.full_name}
                    onChange={(e) =>
                      setProfile({ ...profile, full_name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    className={inputClass}
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={inputClass}
                    value={profile.date_of_birth}
                    onChange={(e) =>
                      setProfile({ ...profile, date_of_birth: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  className={inputClass}
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    className={inputClass}
                    value={profile.city}
                    onChange={(e) =>
                      setProfile({ ...profile, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    className={inputClass}
                    value={profile.country}
                    onChange={(e) =>
                      setProfile({ ...profile, country: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                    Occupation
                  </label>
                  <input
                    className={inputClass}
                    value={profile.occupation}
                    onChange={(e) =>
                      setProfile({ ...profile, occupation: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                    Annual Income
                  </label>
                  <input
                    type="number"
                    className={inputClass}
                    value={profile.annual_income}
                    onChange={(e) =>
                      setProfile({ ...profile, annual_income: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                  Risk Tolerance
                </label>
                <select
                  className={inputClass}
                  value={profile.risk_tolerance}
                  onChange={(e) =>
                    setProfile({ ...profile, risk_tolerance: e.target.value })
                  }
                >
                  <option value="CONSERVATIVE">Conservative</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="AGGRESSIVE">Aggressive</option>
                </select>
              </div>
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2.5 rounded-lg font-montserrat text-sm font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {/* Preferences */}
          {activeTab === 1 && (
            <form onSubmit={handleSavePreferences} className="space-y-5">
              {[
                {
                  key: "email_notifications",
                  label: "Email Notifications",
                  desc: "Receive notification emails",
                },
                {
                  key: "sms_notifications",
                  label: "SMS Notifications",
                  desc: "Receive text message alerts",
                },
                {
                  key: "push_notifications",
                  label: "Push Notifications",
                  desc: "Receive push notification alerts",
                },
                {
                  key: "dark_mode",
                  label: "Dark Mode",
                  desc: "Use dark theme (coming soon)",
                },
              ].map((pref) => (
                <div
                  key={pref.key}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-montserrat text-sm font-semibold text-gray-900">
                      {pref.label}
                    </p>
                    <p className="font-montserrat text-xs text-gray-500 mt-0.5">
                      {pref.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        [pref.key]: !preferences[pref.key],
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${preferences[pref.key] ? "bg-gradient-to-r from-primary to-primary-dark" : "bg-gray-200"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${preferences[pref.key] ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>
              ))}
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2.5 rounded-lg font-montserrat text-sm font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </form>
          )}

          {/* Security */}
          {activeTab === 2 && (
            <form
              onSubmit={handleChangePassword}
              className="space-y-4 max-w-md"
            >
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className={inputClass}
                  required
                  value={passwords.old_password}
                  onChange={(e) =>
                    setPasswords({ ...passwords, old_password: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className={inputClass}
                  required
                  minLength={8}
                  value={passwords.new_password}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new_password: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className={inputClass}
                  required
                  minLength={8}
                  value={passwords.confirm_password}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirm_password: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2.5 rounded-lg font-montserrat text-sm font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Changing..." : "Change Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
