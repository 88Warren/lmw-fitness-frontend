import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import api from "../../utils/api";
import { BACKEND_URL } from "../../utils/config";

const ProfilePage = () => {
  const { user, isLoggedIn, loadingAuth, updateUser } = useAuth();
  const navigate = useNavigate();
  const [reminderOptOut, setReminderOptOut] = useState(false);
  const [reminderSaving, setReminderSaving] = useState(false);

  useEffect(() => {
    if (user) setReminderOptOut(user.reminderOptOut || false);
  }, [user]);

  const handleReminderToggle = async () => {
    const newVal = !reminderOptOut;
    setReminderOptOut(newVal);
    setReminderSaving(true);
    try {
      await api.put(`${BACKEND_URL}/api/reminder-opt-out`, { optOut: newVal });
      if (updateUser) updateUser({ ...user, reminderOptOut: newVal });
    } catch (e) {
      setReminderOptOut(!newVal);
    } finally {
      setReminderSaving(false);
    }
  };

  useEffect(() => {
    if (!loadingAuth && !isLoggedIn) {
      navigate("/login");
    } else if (user && user.mustChangePassword) {
      navigate("/change-password-first-login");
    }
  }, [isLoggedIn, navigate, loadingAuth]);

  useEffect(() => {
    if (!loadingAuth && isLoggedIn && user?.mustChangePassword) {
      navigate("/change-password-first-login");
    }
  }, [loadingAuth, isLoggedIn, user, navigate]);

  if (loadingAuth || !isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <p className="text-lg font-titillium text-customGray/60">Loading profile...</p>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? "U";

  const hasPrograms =
    user.role === "admin" ||
    (user.purchasedPrograms && user.purchasedPrograms.length > 0);

  const hasBeginner =
    user.role === "admin" || user.purchasedPrograms?.includes("beginner-program");
  const hasAdvanced =
    user.role === "admin" || user.purchasedPrograms?.includes("advanced-program");

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1 },
    }),
  };

  return (
    <div className="min-h-screen bg-white pt-44 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Profile Header Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-hotPink via-brightYellow to-limeGreen flex items-center justify-center shrink-0 shadow-md">
              <span className="text-2xl font-bold text-white font-titillium">{initials}</span>
            </div>

            {/* Name / email / role */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-customGray font-titillium">
                {user.name || "Welcome back"}
              </h1>
              <p className="text-customGray/50 font-titillium text-sm mt-1">{user.email}</p>
              {user.role === "admin" && (
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-hotPink text-white text-xs font-titillium font-bold tracking-wide">
                  Admin
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Streak Stats ── */}
        {(user.currentStreak > 0 || user.longestStreak > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <p className="text-3xl font-bold text-customGray font-titillium">🔥 {user.currentStreak}</p>
              <p className="text-sm text-customGray/50 font-titillium mt-2">Current Streak</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <p className="text-3xl font-bold text-customGray font-titillium">🏆 {user.longestStreak}</p>
              <p className="text-sm text-customGray/50 font-titillium mt-2">Longest Streak</p>
            </div>
          </motion.div>
        )}

        {/* ── My Programmes ── */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-pink-50">
              <span className="text-lg">🎯</span>
            </span>
            <h2 className="text-lg font-bold text-customGray font-titillium">My Programmes</h2>
          </div>

          {hasPrograms ? (
            <div className="space-y-3">
              {hasBeginner && (
                <Link
                  to="/workouts/beginner-program/list"
                  className="flex items-center justify-between w-full px-5 py-4 bg-gray-50 hover:bg-yellow-50 border border-gray-100 hover:border-brightYellow rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌱</span>
                    <div className="text-left">
                      <p className="text-sm font-bold text-customGray font-titillium">30-Day Beginner Programme</p>
                      <p className="text-xs text-customGray/50 font-titillium">Daily workouts · 30 days</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-customGray/30 group-hover:text-brightYellow transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
              {hasAdvanced && (
                <Link
                  to="/workouts/advanced-program/list"
                  className="flex items-center justify-between w-full px-5 py-4 bg-gray-50 hover:bg-yellow-50 border border-gray-100 hover:border-brightYellow rounded-xl transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚡</span>
                    <div className="text-left">
                      <p className="text-sm font-bold text-customGray font-titillium">30-Day Advanced Programme</p>
                      <p className="text-xs text-customGray/50 font-titillium">Daily workouts · 30 days</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-customGray/30 group-hover:text-brightYellow transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-customGray/50 font-titillium text-sm mb-4">No programmes purchased yet.</p>
              <Link to="/#Pricing" className="btn-primary mt-0 inline-block text-sm px-5 py-2">
                Browse Programmes
              </Link>
            </div>
          )}
        </motion.div>

        {/* ── Tools & Tracking ── */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-green-50">
              <span className="text-lg">📊</span>
            </span>
            <h2 className="text-lg font-bold text-customGray font-titillium">Tools & Tracking</h2>
          </div>

          <div className="space-y-3">
            {[
              { to: "/fitness-assessments", icon: "📋", label: "Fitness Assessments", sub: "Track your progress over time" },
              { to: "/amrap-history",        icon: "⏱️", label: "AMRAP History",        sub: "Your personal bests" },
              { to: "/calorie-calculator",   icon: "🥗", label: "Calorie Calculator",   sub: "Estimate your daily needs" },
            ].map(({ to, icon, label, sub }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between w-full px-5 py-4 bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-limeGreen rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-customGray font-titillium">{label}</p>
                    <p className="text-xs text-customGray/50 font-titillium">{sub}</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-customGray/30 group-hover:text-limeGreen transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Preferences ── */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-yellow-50">
              <span className="text-lg">⚙️</span>
            </span>
            <h2 className="text-lg font-bold text-customGray font-titillium">Preferences</h2>
          </div>

          <div className="flex items-center justify-between px-5 py-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-bold text-customGray font-titillium">Workout reminders</p>
              <p className="text-xs text-customGray/50 font-titillium mt-0.5">
                {reminderOptOut
                  ? "Reminders are turned off"
                  : "We'll nudge you if you've been away a while"}
              </p>
            </div>
            <button
              onClick={handleReminderToggle}
              disabled={reminderSaving}
              aria-label="Toggle workout reminders"
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-limeGreen focus:ring-offset-2 ${
                reminderOptOut ? "bg-gray-300" : "bg-limeGreen"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
                  reminderOptOut ? "translate-x-1" : "translate-x-6"
                }`}
              />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ProfilePage;
