import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useWorkoutFullscreen from "../../hooks/useWorkoutFullscreen";

const WorkoutTimer = ({
  currentExercise,
  nextExercise,
  onExerciseComplete,
  onGoBack,
  canGoBack,
  isRest = false,
  isRoundRest = false,
  isStopwatch = false,
  progressPercentage,
  currentBlockType,
  currentExerciseNumber,
  totalExercisesInBlock,
  currentRound = 1,
  totalRounds = 1,
  shouldAutoStart = false,
  isAdmin = false,
  playBeep = () => {},
  playStartSound = () => {},
}) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasResetOnce, setHasResetOnce] = useState(false);
  const { isFullscreen, toggleFullscreen } = useWorkoutFullscreen();
  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  const parseDurationToSeconds = (duration) => {
    // console.log("Parsing duration:", duration, "type:", typeof duration);

    if (typeof duration === "number") return duration;
    if (typeof duration === "string") {
      if (duration.trim() === "") {
        // console.log("Empty duration string, returning 0");
        return 0;
      }

      // Check for "Max Time" or "Max time" - return -1 to indicate max time
      if (duration.toLowerCase().includes("max time")) {
        return -1;
      }

      const match = duration.match(
        /(\d+)\s*(seconds?|secs?|sec|s|minutes?|mins?|min|m)/i
      );
      // console.log("Regex match result:", match);

      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        // console.log("Parsed value:", value, "unit:", unit);

        if (unit.includes("min") || unit === "m") {
          // console.log("Converting minutes to seconds:", value * 60);
          return value * 60;
        }
        // console.log("Returning seconds:", value);
        return value;
      } else {
        // console.log("No regex match for duration:", duration);
      }
    }
    // console.log("Fallback: returning 0 for duration:", duration);
    return 0;
  };

  // Check if current exercise is a "Max Time" exercise
  const isMaxTimeExercise =
    !isRest &&
    !isRoundRest &&
    currentExercise?.duration &&
    currentExercise.duration.toLowerCase().includes("max time");

  // Temporary debug logging
  // if (currentExercise?.exercise?.name?.toLowerCase().includes("plank")) {
  //   console.log("PLANK DEBUG - PRODUCTION TEST:", {
  //     exerciseName: currentExercise?.exercise?.name,
  //     duration: currentExercise?.duration,
  //     isMaxTimeExercise,
  //     isRest,
  //     isRoundRest,
  //     isStopwatch,
  //     timestamp: new Date().toISOString(),
  //   });
  // }

  useEffect(() => {
    // console.log("Timer initializing:", {
    //   isRest,
    //   isRoundRest,
    //   isStopwatch,
    //   currentExercise,
    //   restValue: currentExercise?.rest,
    //   durationValue: currentExercise?.duration,
    //   exerciseName: currentExercise?.exercise?.name,
    //   modification: currentExercise?.modification,
    //   shouldAutoStart,
    //   isMaxTimeExercise,
    // });
    clearInterval(intervalRef.current);

    if (isStopwatch || isMaxTimeExercise) {
      setTime(0);
      setIsActive(false);
      setIsPaused(false);
    } else if (isRoundRest) {
      const roundRest = parseDurationToSeconds(currentExercise.rest);

      setTime(roundRest);
      setTimeout(() => {
        setIsActive(true);
        setIsPaused(false);
      }, 10);
    } else if (isRest) {
      const rest = parseDurationToSeconds(currentExercise.rest);
      // console.log("Rest duration parsed:", rest);
      setTime(rest);
      setIsActive(true);
      setIsPaused(false);
    } else {
      const exerciseDuration = parseDurationToSeconds(currentExercise.duration);
      // console.log("Exercise duration parsed:", exerciseDuration);
      setTime(exerciseDuration);
      setIsActive(shouldAutoStart);
      setIsPaused(false);
    }
  }, [
    // Only reset timer when actual exercise data changes, not object reference
    currentExercise?.exercise?.name,
    currentExercise?.duration,
    currentExercise?.rest,
    currentExercise?.modification?.name,
    isRest,
    isRoundRest,
    isStopwatch,
    shouldAutoStart,
    isMaxTimeExercise,
  ]);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (isStopwatch || isMaxTimeExercise) {
            return prev + 1;
          } else {
            // Play start sound when transitioning from rest to work (when rest timer ends)
            if (prev === 1 && isRest) {
              setTimeout(() => playStartSound(), 1000); // Play start sound when rest ends and work begins
            }

            if (prev <= 1) {
              clearInterval(intervalRef.current);
              setTimeout(() => {
                onExerciseComplete();
              }, 100);
              return 0;
            }

            const newTime = prev - 1;
            
            // Play beep for each second in the last 5 seconds (after decrementing)
            if (newTime <= 5 && newTime > 0) {
              playBeep();
            }

            return newTime;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [
    isActive,
    isPaused,
    isStopwatch,
    isMaxTimeExercise,
    isRoundRest,
    isRest,
    onExerciseComplete,
    playBeep,
  ]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    setIsActive(true);
    setHasResetOnce(false);
  };

  const stopAndReset = () => {
    clearInterval(intervalRef.current);
    let resetTime = 0;
    if (isStopwatch || isMaxTimeExercise) {
      resetTime = 0;
    } else if (isRoundRest) {
      resetTime = parseDurationToSeconds(currentExercise.rest);
    } else if (isRest) {
      resetTime = parseDurationToSeconds(currentExercise.rest);
    } else {
      resetTime = parseDurationToSeconds(currentExercise.duration);
    }
    setTime(resetTime);
    setIsActive(false);
    setIsPaused(false);
  };

  const skipRest = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    onExerciseComplete();
  };

  const resetCurrentTimer = () => {
    clearInterval(intervalRef.current);

    if (!hasResetOnce) {
      let resetTime = 0;
      if (isStopwatch || isMaxTimeExercise) {
        resetTime = 0;
      } else if (isRoundRest) {
        resetTime = parseDurationToSeconds(currentExercise.rest);
      } else if (isRest) {
        resetTime = parseDurationToSeconds(currentExercise.rest);
      } else {
        resetTime = parseDurationToSeconds(currentExercise.duration);
      }
      setTime(resetTime);
      setIsActive(false);
      setIsPaused(false);
      setHasResetOnce(true);
    } else {
      setHasResetOnce(false);
      onGoBack();
    }
  };

  const activeExercise = currentExercise?.exercise;

  return (
    <div
      ref={timerRef}
      className={`flex flex-col h-full justify-between ${
        isFullscreen ? "workout-fullscreen-container fixed inset-0 z-50 bg-customGray p-8 landscape:p-4 landscape:sm:p-5 landscape:md:p-6" : ""
      }`}
    >
      {/* Round title or placeholder for consistent spacing */}
      <div className="md:min-h-[48px] md:mb-4 flex items-center justify-center">
        {totalRounds > 1 &&
        currentBlockType !== "AMRAP" &&
        currentBlockType !== "EMOM" ? (
          <h2 className="text-customWhite text-2xl font-titillium font-semibold">
            Round <span className="text-brightYellow">{currentRound}</span> of{" "}
            <span className="text-brightYellow">{totalRounds}</span>
          </h2>
        ) : (
          <div className="opacity-0 text-2xl font-titillium font-semibold">
            Placeholder
          </div>
        )}
      </div>

      {/* Timer Section */}
      <div
        className={`bg-gray-600 rounded-lg p-4 relative ${
          isFullscreen ? "flex-1 flex flex-col justify-center" : ""
        }`}
      >
        {/* Fullscreen Toggle Button - Inside timer card */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 text-customWhite hover:text-brightYellow transition-colors p-2 rounded-lg hover:bg-gray-700 z-10"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            // Exit fullscreen icon
            <svg
              className="w-5 h-5"
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
          ) : (
            // Enter fullscreen icon
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          )}
        </button>
        <div className="mb-2">
          <div className="flex flex-col items-center mb-2">
            <h3
              className={`mb-2 font-bold text-customWhite ${
                isFullscreen
                  ? "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                  : "text-3xl"
              }`}
            >
              {isStopwatch || isMaxTimeExercise
                ? activeExercise?.name
                : isRoundRest
                ? "Round Rest"
                : isRest
                ? "Rest Time"
                : activeExercise?.name}
            </h3>
            {isMaxTimeExercise && (
              <p
                className={`text-brightYellow font-semibold mb-2 ${
                  isFullscreen ? "text-sm sm:text-base md:text-lg" : "text-sm"
                }`}
              >
                Hold as long as possible - Use Skip/Done when finished
              </p>
            )}
            <p
              className={`text-logoGray ${
                isFullscreen ? "text-xs sm:text-sm md:text-base" : "text-xs"
              }`}
            >
              Exercise {currentExerciseNumber} of {totalExercisesInBlock}
            </p>
            {currentBlockType === "AMRAP" && (
              <p
                className={`text-brightYellow font-semibold ${
                  isFullscreen ? "text-sm sm:text-base md:text-lg" : "text-sm"
                }`}
              >
                AMRAP - Keep Going!
              </p>
            )}
            {currentBlockType === "EMOM" && (
              <p
                className={`text-brightYellow font-semibold ${
                  isFullscreen ? "text-sm sm:text-base md:text-lg" : "text-sm"
                }`}
              >
                EMOM - Every Minute On the Minute!
              </p>
            )}
          </div>
        </div>

        {/* Timer Display */}
        <div className="mb-2">
          <div
            className={`p-4 ${
              isFullscreen
                ? "text-6xl md:text-8xl lg:text-9xl"
                : "text-7xl"
            } ${isRest || isRoundRest ? "text-hotPink" : "text-limeGreen"} ${
              time <= 5 && time > 0 && !isStopwatch && !isMaxTimeExercise 
                ? "animate-pulse" 
                : ""
            }`}
          >
            {formatTime(time)}
          </div>
          {/* Countdown indicator */}
          {time <= 5 && time > 0 && !isStopwatch && !isMaxTimeExercise && (
            <div className="text-center">
              <span className="text-brightYellow font-semibold text-lg animate-bounce">
                🔔 Get Ready!
              </span>
            </div>
          )}
        </div>

        {/* Overall Progress Bar */}
        <div className="flex justify-center w-full mt-4">
          <div
            className={`bg-gray-400 rounded-full ${
              isFullscreen ? "h-4 w-3/4" : "h-3 w-1/2"
            }`}
          >
            <div
              className="bg-linear-to-r from-limeGreen via-brightYellow to-hotPink h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Next Exercise Info - Show during rest OR during exercise if no rest period */}
        {isFullscreen && nextExercise && (
          (isRest || isRoundRest) || 
          (!isRest && !isRoundRest && !isStopwatch && !isMaxTimeExercise && 
           parseDurationToSeconds(currentExercise?.rest || "0s") === 0)
        ) && (
          <div className="flex justify-center w-full mt-4">
            <div className={`p-4 landscape:p-2 bg-gray-700 rounded-lg ${
              isFullscreen ? "w-3/4" : "w-full"
            }`}>
              <div className="text-center">
                <h4 className="text-2xl landscape:text-lg font-semibold text-brightYellow mb-3 landscape:mb-1">
                  Next Exercise
                </h4>
                <p className="text-3xl landscape:text-xl font-bold text-customWhite mb-2 landscape:mb-1">
                  {nextExercise.exercise?.name || "Get Ready!"}
                </p>
                {nextExercise.exercise?.modification && (
                  <p className="text-xl landscape:text-base text-logoGray mb-3 landscape:mb-1">
                    or{" "}
                    <span className="text-brightYellow">
                      {nextExercise.exercise.modification.name}
                    </span>
                  </p>
                )}
                {nextExercise.reps && (
                  <p className="text-lg landscape:text-sm text-brightYellow">
                    {`${nextExercise.reps} ${
                      nextExercise.duration
                        ? `(${nextExercise.duration})`
                        : "reps"
                    }`}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timer Controls */}
        <div
          className={`flex justify-center space-x-2 ${
            isFullscreen ? "mt-8" : ""
          }`}
        >
          {canGoBack && (
            <button
              onClick={() => {
                clearInterval(intervalRef.current);
                setTime(0);
                setIsActive(false);
                setIsPaused(false);
                onGoBack();
              }}
              className={`btn-cancel ${
                isFullscreen
                  ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg"
                  : "px-3 py-1 md:px-6 md:py-3"
              }`}
            >
              Back
            </button>
          )}

          {!isActive || isPaused ? (
            <button
              onClick={resumeTimer}
              className={`btn-full-colour ${
                isFullscreen
                  ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg"
                  : "px-3 py-1 md:px-6 md:py-3"
              } ${
                (isStopwatch || isMaxTimeExercise) && isActive
                  ? "btn-subscribe"
                  : "bg-limeGreen hover:bg-green-600 text-black"
              }`}
            >
              {isPaused ? "Resume" : "Start"}
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className={`btn-subscribe ${
                isFullscreen
                  ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg"
                  : "px-3 py-1 md:px-6 md:py-3"
              }`}
            >
              Pause
            </button>
          )}

          {(isStopwatch || isMaxTimeExercise) && isActive && (
            <button
              onClick={stopAndReset}
              className={`btn-cancel ${
                isFullscreen
                  ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg"
                  : "px-3 py-1 md:px-6 md:py-3"
              }`}
            >
              Reset
            </button>
          )}

          {/* Skip button for Max Time exercises - Always show when it's a max time exercise */}
          {(isMaxTimeExercise ||
            (currentExercise?.duration &&
              (currentExercise.duration === "Max Time" ||
                currentExercise.duration === "Max time")) ||
            (currentExercise?.exercise?.name?.toLowerCase().includes("plank") &&
              currentExercise?.duration?.toLowerCase().includes("max"))) && (
            <button
              onClick={() => {
                clearInterval(intervalRef.current);
                onExerciseComplete();
              }}
              className={`btn-skip ${
                isFullscreen
                  ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg"
                  : "px-3 py-1 md:px-6 md:py-3"
              }`}
            >
              Done
            </button>
          )}

          {(isStopwatch || isMaxTimeExercise) && isAdmin && (
            <button
              onClick={() => {
                clearInterval(intervalRef.current);
                onExerciseComplete();
              }}
              className="btn-cancel px-3 py-1 md:px-6 md:py-3"
            >
              Next
            </button>
          )}

          {!isStopwatch && !isMaxTimeExercise && (
            <button
              onClick={resetCurrentTimer}
              className="btn-cancel px-3 py-1 md:px-6 md:py-3"
            >
              {hasResetOnce
                ? "Go Back"
                : isRest || isRoundRest
                ? "Reset"
                : "Reset"}
            </button>
          )}

          {isMaxTimeExercise && (
            <button
              onClick={resetCurrentTimer}
              className="btn-cancel px-3 py-1 md:px-6 md:py-3"
            >
              {hasResetOnce ? "Go Back" : "Reset"}
            </button>
          )}

          {!isStopwatch && (isRest || isRoundRest) && time > 0 && (
            <button
              onClick={skipRest}
              className="btn-skip px-3 py-1 md:px-6 md:py-3"
            >
              Skip
            </button>
          )}

          {!isStopwatch &&
            !isMaxTimeExercise &&
            !isRest &&
            !isRoundRest &&
            isAdmin && (
              <button
                onClick={() => {
                  clearInterval(intervalRef.current);
                  onExerciseComplete();
                }}
                className="btn-cancel px-3 py-1 md:px-6 md:py-3"
              >
                Next
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

WorkoutTimer.propTypes = {
  currentExercise: PropTypes.shape({
    duration: PropTypes.string,
    rest: PropTypes.string,
    exercise: PropTypes.shape({
      name: PropTypes.string,
      tips: PropTypes.string,
      instructions: PropTypes.string,
      modification: PropTypes.shape({
        name: PropTypes.string,
        videoId: PropTypes.string,
        description: PropTypes.string,
        instructions: PropTypes.string,
        tips: PropTypes.string,
      }),
    }),
    modification: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
    }),
  }),
  nextExercise: PropTypes.shape({
    reps: PropTypes.string,
    duration: PropTypes.string,
    exercise: PropTypes.shape({
      name: PropTypes.string,
      modification: PropTypes.shape({
        name: PropTypes.string,
        videoId: PropTypes.string,
      }),
    }),
  }),
  onExerciseComplete: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  isRest: PropTypes.bool,
  isRoundRest: PropTypes.bool,
  isStopwatch: PropTypes.bool,
  progressPercentage: PropTypes.number,
  currentBlockType: PropTypes.string,
  currentExerciseNumber: PropTypes.number,
  totalExercisesInBlock: PropTypes.number,
  currentRound: PropTypes.number,
  totalRounds: PropTypes.number,
  onShowModificationModal: PropTypes.func.isRequired,
  currentModification: PropTypes.object,
  setShowModificationModal: PropTypes.func.isRequired,
  shouldAutoStart: PropTypes.bool,
  isAdmin: PropTypes.bool,
  playBeep: PropTypes.func,
  playStartSound: PropTypes.func,
};

export default WorkoutTimer;
