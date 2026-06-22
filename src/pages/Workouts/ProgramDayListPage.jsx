import { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { showToast } from "../../utils/toastUtil";

const programDetails = {
  "beginner-program": {
    title: "30-Day Beginner Programme",
    subtitle: "Build your foundation with daily guided workouts",
    totalDays: 30,
    pill: { label: "Beginner", color: "bg-limeGreen text-black shadow-limeGreen/40" },
    icon: "🌱",
  },
  "advanced-program": {
    title: "30-Day Advanced Programme",
    subtitle: "Push your limits with progressive daily challenges",
    totalDays: 30,
    pill: { label: "Advanced", color: "bg-hotPink text-white shadow-hotPink/30" },
    icon: "⚡",
  },
};

const ProgramDayListPage = () => {
  const { user, loadingAuth, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { programName } = useParams();

  const hasExistingProgress = useCallback(
    (dayNumber) => {
      const savedProgress = localStorage.getItem("workoutProgress");
      if (!savedProgress) return false;
      try {
        const progress = JSON.parse(savedProgress);
        return (
          progress.programName === programName &&
          progress.dayNumber === dayNumber &&
          progress.hasStartedWorkout
        );
      } catch {
        return false;
      }
    },
    [programName]
  );

  const currentProgram = programDetails[programName];
  const unlockedDays = user?.unlockedDays?.[programName] || 0;
  const completedDaysList = user?.completedDaysList?.[programName] || [];
  const completedCount = completedDaysList.length;
  const progressPercent = currentProgram
    ? Math.round((completedCount / currentProgram.totalDays) * 100)
    : 0;

  useEffect(() => {
    if (loadingAuth) return;
    if (!isLoggedIn) {
      navigate("/login");
    } else if (user && user.mustChangePassword) {
      navigate("/change-password-first-login");
    } else if (
      !loadingAuth &&
      isLoggedIn &&
      user &&
      currentProgram &&
      user.role === "user" &&
      !user.purchasedPrograms.includes(programName)
    ) {
      navigate("/profile");
      showToast("error", "You do not have access to this program.");
    } else if (!currentProgram) {
      navigate("/profile");
      showToast("error", "Program not found.");
    }
  }, [isLoggedIn, loadingAuth, navigate, user, programName, currentProgram]);

  if (loadingAuth || !isLoggedIn || !user || !currentProgram) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <p className="text-lg font-titillium text-customGray/60">Loading programme...</p>
      </div>
    );
  }

  const daysArray = Array.from({ length: currentProgram.totalDays }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-white pt-40 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => navigate("/profile")}
            className="inline-flex items-center gap-2 text-sm font-titillium font-semibold text-customGray/50 hover:text-customGray transition-colors duration-200 mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </button>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shrink-0">
                  {currentProgram.icon}
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 mb-2 px-3 py-1 rounded-full text-xs font-titillium font-bold tracking-widest uppercase shadow-lg ${currentProgram.pill.color}`}>
                    {currentProgram.pill.label}
                  </span>
                  <h1 className="text-xl md:text-2xl font-bold text-customGray font-titillium leading-tight">
                    {currentProgram.title}
                  </h1>
                  <p className="text-sm text-customGray/50 font-titillium mt-1">
                    {currentProgram.subtitle}
                  </p>
                </div>
              </div>

              {/* Warm up / Cool down */}
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => navigate(`/workouts/${programName}/routines/warmup`)}
                  className="px-4 py-2 text-sm font-titillium font-semibold text-customGray border-2 border-brightYellow rounded-xl hover:bg-brightYellow transition-colors duration-200"
                >
                  🔥 Warm Up
                </button>
                <button
                  onClick={() => navigate(`/workouts/${programName}/routines/cooldown`)}
                  className="px-4 py-2 text-sm font-titillium font-semibold text-customGray border-2 border-limeGreen rounded-xl hover:bg-limeGreen transition-colors duration-200"
                >
                  🧊 Cool Down
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-titillium font-semibold text-customGray">
                  Progress
                </span>
                <span className="text-sm font-titillium text-customGray/50">
                  {completedCount} / {currentProgram.totalDays} days completed
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-limeGreen via-brightYellow to-hotPink rounded-full"
                />
              </div>
              <p className="text-xs text-customGray/40 font-titillium mt-1.5 text-right">
                {progressPercent}% complete
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Day Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {daysArray.map((day) => {
            const isDayLocked = day > unlockedDays && user.role !== "admin";
            const isDayCompleted = completedDaysList.includes(day);
            const hasProgress = hasExistingProgress(day);
            const isNextUp = !isDayLocked && !isDayCompleted && day === unlockedDays;

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: day * 0.02 }}
                className={`relative bg-white rounded-2xl border-2 p-5 flex flex-col items-center gap-4 min-h-[160px] transition-all duration-200
                  ${isDayCompleted
                    ? "border-limeGreen shadow-sm shadow-limeGreen/20"
                    : isDayLocked
                    ? "border-gray-100 opacity-60"
                    : isNextUp
                    ? "border-brightYellow shadow-sm shadow-brightYellow/20"
                    : "border-gray-100 hover:border-brightYellow hover:shadow-sm"
                  }`}
              >
                {/* Day number + status icon */}
                <div className="flex items-center justify-between w-full">
                  <span className={`text-sm font-bold font-titillium ${isDayCompleted ? "text-limeGreen" : isDayLocked ? "text-customGray/30" : "text-customGray"}`}>
                    Day {day}
                  </span>
                  {isDayCompleted && (
                    <svg className="w-5 h-5 text-limeGreen shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {isDayLocked && (
                    <svg className="w-4 h-4 text-customGray/25 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {isNextUp && !isDayCompleted && (
                    <span className="text-xs font-titillium font-bold text-brightYellow">Next</span>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col w-full gap-2 mt-auto">
                  <button
                    onClick={() => !isDayLocked && navigate(`/workouts/${programName}/${day}?mode=preview`)}
                    disabled={isDayLocked}
                    className={`w-full py-2 text-sm font-titillium font-semibold rounded-lg transition-colors duration-200
                      ${isDayLocked
                        ? "bg-gray-50 text-customGray/25 cursor-not-allowed"
                        : "bg-gray-50 text-customGray hover:bg-gray-100"
                      }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => {
                      if (!isDayLocked) {
                        navigate(
                          hasProgress
                            ? `/workouts/${programName}/${day}`
                            : `/workouts/${programName}/${day}?start=true`
                        );
                      }
                    }}
                    disabled={isDayLocked}
                    className={`w-full py-2 text-sm font-titillium font-semibold rounded-lg transition-colors duration-200
                      ${isDayLocked
                        ? "bg-gray-50 text-customGray/25 cursor-not-allowed"
                        : isDayCompleted
                        ? "bg-limeGreen/10 text-limeGreen hover:bg-limeGreen/20"
                        : "bg-brightYellow text-black hover:bg-brightYellow/80"
                      }`}
                  >
                    {isDayCompleted ? "Redo" : hasProgress ? "Resume" : "Start"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
};

export default ProgramDayListPage;
