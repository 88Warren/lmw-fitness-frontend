import React, { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { showToast } from "../../utils/toastUtil";
import DynamicHeading from "../../components/Shared/DynamicHeading";

const ProgramDayListPage = () => {
  const { user, loadingAuth, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { programName } = useParams();

  // Helper function to check if there's existing workout progress for a specific day
  const hasExistingProgress = useCallback((dayNumber) => {
    const savedProgress = localStorage.getItem("workoutProgress");
    if (!savedProgress) return false;
    
    try {
      const progress = JSON.parse(savedProgress);
      return (
        progress.programName === programName &&
        progress.dayNumber === dayNumber &&
        progress.hasStartedWorkout
      );
    } catch (error) {
      return false;
    }
  }, [programName]);

  const programDetails = {
    "beginner-program": {
      title: "30-Day Beginner Programme",
      totalDays: 30,
    },
    "advanced-program": {
      title: "30-Day Advanced Programme",
      totalDays: 30,
    },
  };

  const currentProgram = programDetails[programName];
  const unlockedDays = user?.unlockedDays?.[programName] || 0;
  const completedDaysList = user?.completedDaysList?.[programName] || [];

  // console.log("ProgramDayListPage Debug:", {
  //   user,
  //   programName,
  //   completedDays: user?.completedDays,
  //   lastCompletedDay,
  //   purchasedPrograms: user?.purchasedPrograms
  // });

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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <p className="text-xl font-titillium text-brightYellow">
          Loading program details...
        </p>
      </div>
    );
  }

  const daysArray = Array.from(
    { length: currentProgram.totalDays },
    (_, i) => i + 1
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center justify-center min-h-screen py-30 bg-linear-to-b from-customGray/30 to-white"
    >
      <div className="bg-customGray p-4 md:p-8 rounded-lg text-center max-w-sm md:max-w-4xl lg:max-w-5xl w-full border-brightYellow border-2">
        <div className="flex justify-center mb-4 md:justify-end">
          <button
            onClick={() => navigate("/profile")}
            className="btn-cancel mt-0"
          >
            Back to Profile
          </button>
        </div>
        <DynamicHeading
          text={currentProgram.title}
          className="font-higherJump text-2xl md:text-4xl font-bold text-customWhite leading-loose tracking-widest"
        />

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => navigate(`/workouts/${programName}/routines/warmup`)}
            className="btn-primary"
          >
            Warm Up
          </button>
          <button
            onClick={() =>
              navigate(`/workouts/${programName}/routines/cooldown`)
            }
            className="btn-primary"
          >
            Cool Down
          </button>
        </div>

        {/* Debug info - remove in production
        <div className="text-xs text-gray-400 mb-4">
          Debug: Last completed day: {lastCompletedDay}, User role: {user.role}
        </div> */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 overflow-y-auto px-2 md:px-4 custom-scrollbar">
          {daysArray.map((day) => {
            const isDayLocked = day > unlockedDays && user.role !== "admin";
            const isDayCompleted = completedDaysList.includes(day);

            const previewButtonClass = isDayLocked
              ? "btn-disabled  px-1 md:px-2 mt-0"
              : isDayCompleted
              ? "btn-complete px-1 md:px-2 mt-0"
              : "btn-cancel px-1 md:px-2 mt-0";

            const startButtonClass = isDayLocked
              ? "btn-disabled  px-1 md:px-2 mt-0"
              : isDayCompleted
              ? "btn-complete px-1 md:px-2 mt-0"
              : "btn-full-colour px-1 md:px-2 mt-0";

            const borderColor = isDayCompleted
              ? "border-limeGreen"
              : isDayLocked
              ? "border-gray-700"
              : "border-brightYellow";

            return (
              <div
                key={day}
                className={`p-2 md:p-4 rounded-lg border-2 ${borderColor} flex flex-col items-center justify-center`}
              >
                <div className="flex items-center justify-center">
                  <h3
                    className={`text-lg md:text-xl font-bold mb-2 ${
                      isDayCompleted ? "text-limeGreen" : "text-customWhite"
                    }`}
                  >
                    Day {day}
                  </h3>
                </div>
                <div className="h-6 mb-4 flex items-center justify-center">
                  {isDayLocked && (
                    <p className="text-sm text-gray-400">Status: Locked</p>
                  )}
                  {isDayCompleted && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-limeGreen"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      {" "}
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col items-center w-full gap-2">
                  <button
                    onClick={() => {
                      if (!isDayLocked) {
                        navigate(
                          `/workouts/${programName}/${day}?mode=preview`
                        );
                      }
                    }}
                    className={`${previewButtonClass} w-4/5 lg:w-full`}
                    disabled={isDayLocked}
                  >
                    Preview Workout
                  </button>
                  <button
                    onClick={() => {
                      if (!isDayLocked) {
                        const hasProgress = hasExistingProgress(day);
                        if (hasProgress) {
                          // Resume workout - go directly to workout page without ?start=true
                          navigate(`/workouts/${programName}/${day}`);
                        } else {
                          // Start fresh workout
                          navigate(`/workouts/${programName}/${day}?start=true`);
                        }
                      }
                    }}
                    className={`${startButtonClass} w-4/5 lg:w-full`}
                    disabled={isDayLocked}
                  >
                    {hasExistingProgress(day) ? "Resume Workout" : "Start Workout"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="btn-cancel text-black mt-8"
        >
          Back to Profile
        </button>
      </div>
    </motion.div>
  );
};

export default ProgramDayListPage;
