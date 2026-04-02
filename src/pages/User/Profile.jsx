import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import DynamicHeading from "../../components/Shared/DynamicHeading";
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
      setReminderOptOut(!newVal); // revert on error
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-brightYellow">
          Loading profile or redirecting...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 pt-24 bg-linear-to-b from-customGray/30 to-white"
    >
      <div className="bg-customGray p-8 rounded-lg text-center max-w-lg w-full border-brightYellow border-2">
        <DynamicHeading
          text="User Profile"
          className="font-higherJump text-3xl md:text-4xl font-bold text-customWhite mb-8 leading-loose tracking-widest"
        />
        <div className="space-y-4 text-center">
          {/* Streak display */}
          {(user.currentStreak > 0 || user.longestStreak > 0) && (
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-brightYellow text-2xl font-bold">🔥 {user.currentStreak}</p>
                <p className="text-logoGray text-xs mt-1">Current Streak</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-limeGreen text-2xl font-bold">🏆 {user.longestStreak}</p>
                <p className="text-logoGray text-xs mt-1">Longest Streak</p>
              </div>
            </div>
          )}

          {/* Link to programs/workouts */}
          <div className="mt-6">
            <Link to="/fitness-assessments" className="block btn-primary mb-6">
              Fitness Assessments
            </Link>

            <Link to="/amrap-history" className="block btn-primary mb-6">
              AMRAP History
            </Link>
            
            <Link to="/calorie-calculator" className="block btn-primary mb-6">
              Calorie Calculator
            </Link>
            
            {user.role === "admin" ? (
              <div className="space-y-2">
                <Link
                  to="/workouts/beginner-program/list"
                  className="block btn-full-colour"
                >
                  30-Day Beginner Programme
                </Link>
                <Link
                  to="/workouts/advanced-program/list"
                  className="block btn-full-colour"
                >
                  30-Day Advanced Programme
                </Link>
              </div>
            ) : user.purchasedPrograms && user.purchasedPrograms.length > 0 ? (
              <div className="space-y-2">
                {user.purchasedPrograms.includes("beginner-program") && (
                  <Link
                    to="/workouts/beginner-program/list"
                    className="block btn-full-colour"
                  >
                    30-Day Beginner Programme
                  </Link>
                )}
                {user.purchasedPrograms.includes("advanced-program") && (
                  <Link
                    to="/workouts/advanced-program/list"
                    className="block btn-full-colour"
                  >
                    30-Day Advanced Programme
                  </Link>
                )}
              </div>
            ) : (
              <div>
                <p className="text-logoGray">No programs purchased yet.</p>
              </div>
            )}
          </div>

          {/* Reminder preference */}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-customWhite text-sm font-medium">Workout reminders</p>
                <p className="text-logoGray text-xs mt-0.5">
                  {reminderOptOut ? "Reminders off" : "We'll nudge you if you've been away a while"}
                </p>
              </div>
              <button
                onClick={handleReminderToggle}
                disabled={reminderSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  reminderOptOut ? "bg-gray-600" : "bg-limeGreen"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reminderOptOut ? "translate-x-1" : "translate-x-6"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
