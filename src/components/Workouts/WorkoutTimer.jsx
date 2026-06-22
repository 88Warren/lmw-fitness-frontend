import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useWorkoutFullscreen from "../../hooks/useWorkoutFullscreen";
import usePreparationCountdown from "../../hooks/usePreparationCountdown";
import Day1MotivationDisplay from "../Assessments/Day1MotivationDisplay";
import WorkoutAssessmentInput from "../Assessments/WorkoutAssessmentInput";

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
  initializeAudioContext = () => Promise.resolve(), // New prop for iOS audio initialization
  programName = null, // New prop for assessment
  dayNumber = null, // New prop for assessment
  isAssessmentDay = false, // New prop for assessment
  completedExercise = null, // New prop for assessment - the exercise that was just completed
}) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasResetOnce, setHasResetOnce] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const { isFullscreen, toggleFullscreen } = useWorkoutFullscreen();
  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  
  // Use the preparation countdown hook
  const {
    isPreparationCountdown,
    preparationTime,
    startPreparationCountdown,
    cancelPreparationCountdown,
    resetPreparationCountdown,
  } = usePreparationCountdown(playBeep, playStartSound);

  // Reset hasStartedOnce when exercise changes (except for the first exercise)
  useEffect(() => {
    const isFirstExerciseOfWorkout = currentExerciseNumber === 1 && currentRound === 1;
    if (!isFirstExerciseOfWorkout) {
      setHasStartedOnce(false);
    }
  }, [currentExerciseNumber, currentRound]);

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
      
      // Auto-start subsequent exercises, but not the first exercise
      const isFirstExerciseOfWorkout = currentExerciseNumber === 1 && currentRound === 1;
      if (isFirstExerciseOfWorkout) {
        setIsActive(false); // First exercise requires manual start
      } else {
        setIsActive(true); // Subsequent exercises auto-start
      }
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
    currentExerciseNumber, // Add this to dependencies to trigger auto-start
    currentRound, // Add this to dependencies to trigger auto-start
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
    // Initialize audio context on user interaction (critical for iOS)
    initializeAudioContext().then(() => {
      // Start with 5-second preparation countdown ONLY for the very first exercise of the entire workout
      const isFirstExerciseOfWorkout = currentExerciseNumber === 1 && currentRound === 1;
      
      if (!isActive && !isPaused && isFirstExerciseOfWorkout && !hasStartedOnce) {
        // First exercise, first time - show preparation countdown
        startPreparationCountdown(() => {
          setIsActive(true);
          setIsPaused(false);
          setHasResetOnce(false);
          setHasStartedOnce(true);
        });
      } else {
        // All other cases: subsequent exercises, resume from pause, or first exercise after reset
        setIsPaused(false);
        setIsActive(true);
        setHasResetOnce(false);
        // Don't set hasStartedOnce for subsequent exercises - let them always auto-start
        if (isFirstExerciseOfWorkout) {
          setHasStartedOnce(true);
        }
      }
    }).catch((error) => {
      console.warn('Audio initialization failed, but continuing with timer:', error);
      const isFirstExerciseOfWorkout = currentExerciseNumber === 1 && currentRound === 1;
      
      if (!isActive && !isPaused && isFirstExerciseOfWorkout && !hasStartedOnce) {
        startPreparationCountdown(() => {
          setIsActive(true);
          setIsPaused(false);
          setHasResetOnce(false);
          setHasStartedOnce(true);
        });
      } else {
        setIsPaused(false);
        setIsActive(true);
        setHasResetOnce(false);
        if (isFirstExerciseOfWorkout) {
          setHasStartedOnce(true);
        }
      }
    });
  };

  const stopAndReset = () => {
    clearInterval(intervalRef.current);
    cancelPreparationCountdown();
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
    setHasStartedOnce(false);
  };

  const skipRest = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    onExerciseComplete();
  };

  const resetCurrentTimer = () => {
    clearInterval(intervalRef.current);
    cancelPreparationCountdown();

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
      setHasStartedOnce(false);
    } else {
      setHasResetOnce(false);
      setHasStartedOnce(false);
      onGoBack();
    }
  };

  const activeExercise = currentExercise?.exercise;

  // Shared button size classes
  const btnSm = "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm";
  const btnMd = "px-3 py-1 md:px-5 md:py-2";
  const btnLg = "px-6 py-3 text-sm";

  return (
    <div
      ref={timerRef}
      className={`flex flex-col h-full justify-between ${
        isFullscreen ? "workout-fullscreen-container fixed inset-0 z-50 bg-white p-8 landscape:p-4 landscape:sm:p-5 landscape:md:p-6" : ""
      }`}
    >
      {/* Round title or placeholder for consistent spacing */}
      <div className="md:min-h-[48px] md:mb-4 flex items-center justify-center">
        {totalRounds > 1 &&
        currentBlockType !== "AMRAP" &&
        currentBlockType !== "EMOM" ? (
          <h2 className="text-customGray text-2xl font-titillium font-semibold">
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
        className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative ${
          isFullscreen ? "flex-1 flex flex-col justify-center" : ""
        }`}
      >
        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 text-customGray/30 hover:text-customGray transition-colors p-2 rounded-lg hover:bg-gray-50 z-10"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>

        {/* ── Fullscreen rest layout ── */}
        {isFullscreen && (isRest || isRoundRest) ? (
          <div className="flex flex-col h-full justify-between min-h-0">
            {/* Title + counter */}
            <div className="text-center mb-2 shrink-0">
              <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold font-titillium mb-1 ${isRoundRest ? "text-brightYellow" : "text-hotPink"}`}>
                {isRoundRest ? "Round Rest" : "Rest Time"}
              </h3>
              <p className="text-xs sm:text-sm text-customGray/50 font-titillium">
                Exercise {currentExerciseNumber} of {totalExercisesInBlock}
              </p>
            </div>

            {/* Timer + progress */}
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div className="text-center mb-3">
                <div className={`p-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-hotPink ${
                  time <= 5 && time > 0 ? "animate-pulse" : ""
                }`}>
                  {formatTime(time)}
                </div>
                {time <= 5 && time > 0 && (
                  <span className="text-brightYellow font-semibold text-base font-titillium animate-bounce">
                    🔔 Get Ready!
                  </span>
                )}
              </div>
              <div className="flex justify-center mb-3">
                <div className="bg-gray-100 rounded-full h-2 w-2/3">
                  <div
                    className="bg-linear-to-r from-limeGreen via-brightYellow to-hotPink h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Next exercise + assessment + controls */}
            <div className="space-y-2 shrink-0">
              {nextExercise && (
                <div className="bg-gray-50 rounded-xl p-2 text-center border border-gray-100">
                  <p className="text-brightYellow text-xs font-titillium font-semibold mb-1">Next Exercise</p>
                  <p className="text-customGray text-sm font-bold font-titillium">
                    {nextExercise.exercise?.name || "Get Ready!"}
                  </p>
                  {nextExercise.exercise?.modification && (
                    <p className="text-customGray/50 text-xs font-titillium">
                      or <span className="text-brightYellow">{nextExercise.exercise.modification.name}</span>
                    </p>
                  )}
                </div>
              )}

              {isAssessmentDay && completedExercise && (
                <WorkoutAssessmentInput
                  exercise={{
                    id: completedExercise.exerciseId,
                    name: completedExercise.exercise?.name || completedExercise.name
                  }}
                  programName={programName}
                  dayNumber={dayNumber}
                  isVisible={true}
                  isFullscreen={true}
                  onSave={(assessment) => { console.log('Assessment saved in fullscreen:', assessment); }}
                />
              )}

              <div className="flex justify-center flex-wrap gap-2">
                {canGoBack && (
                  <button
                    onClick={() => { clearInterval(intervalRef.current); setTime(0); setIsActive(false); setIsPaused(false); cancelPreparationCountdown(); onGoBack(); }}
                    className={`${btnSm} font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors`}
                  >
                    Back
                  </button>
                )}
                {(!isActive && !isPreparationCountdown) || isPaused ? (
                  <button onClick={resumeTimer} className={`${btnSm} font-titillium font-bold bg-limeGreen text-black rounded-xl hover:bg-limeGreen/80 transition-colors`}>
                    {isPaused ? "Resume" : "Start"}
                  </button>
                ) : (
                  <button onClick={pauseTimer} className={`${btnSm} font-titillium font-bold bg-hotPink text-black rounded-xl hover:bg-hotPink/80 transition-colors`}>
                    Pause
                  </button>
                )}
                <button onClick={resetCurrentTimer} className={`${btnSm} font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors`}>
                  {hasResetOnce ? "Go Back" : "Reset"}
                </button>
                {time > 0 && (
                  <button onClick={skipRest} className={`${btnSm} font-titillium font-semibold bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors`}>
                    Skip
                  </button>
                )}
                {isAdmin && (
                  <button onClick={() => { clearInterval(intervalRef.current); onExerciseComplete(); }} className={`${btnSm} font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors`}>
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>

        ) : (
          // ── Regular layout (non-fullscreen, or fullscreen work period) ──
          <>
            <div className="mb-2">
              <div className="flex flex-col items-center mb-2">
                <h3
                  className={`mb-2 font-bold text-customGray font-titillium ${
                    isFullscreen ? "text-2xl sm:text-3xl md:text-4xl lg:text-5xl" : "text-3xl"
                  }`}
                >
                  {isPreparationCountdown
                    ? "Get Ready!"
                    : isStopwatch || isMaxTimeExercise
                    ? activeExercise?.name
                    : isRoundRest
                    ? "Round Rest"
                    : isRest
                    ? "Rest Time"
                    : activeExercise?.name}
                </h3>

                {/* Day 1 Motivation Display */}
                {!isRest && !isRoundRest && !isPreparationCountdown && isAssessmentDay && activeExercise && (
                  <div className={`w-full max-w-md ${isFullscreen ? "mb-4" : "mb-2"}`}>
                    <Day1MotivationDisplay
                      exercise={{
                        id: currentExercise?.exerciseId || currentExercise?.exercise?.id,
                        name: activeExercise?.name
                      }}
                      programName={programName}
                      dayNumber={dayNumber}
                      isVisible={true}
                    />
                  </div>
                )}

                {isPreparationCountdown && (
                  <p className={`text-brightYellow font-titillium font-semibold mb-2 ${isFullscreen ? "text-sm sm:text-base md:text-lg" : "text-sm"}`}>
                    Prepare for: {activeExercise?.name}
                  </p>
                )}
                {isMaxTimeExercise && !isPreparationCountdown && (
                  <p className={`text-brightYellow font-titillium font-semibold mb-2 ${isFullscreen ? "text-sm sm:text-base md:text-lg" : "text-sm"}`}>
                    Hold as long as possible — use Done when finished
                  </p>
                )}
                <p className={`text-customGray/50 font-titillium ${isFullscreen ? "text-xs sm:text-sm md:text-base" : "text-xs"}`}>
                  Exercise {currentExerciseNumber} of {totalExercisesInBlock}
                </p>
                {currentBlockType === "AMRAP" && (
                  <p className={`text-brightYellow font-titillium font-semibold ${isFullscreen ? "text-sm sm:text-base md:text-lg" : "text-sm"}`}>
                    AMRAP — Keep Going!
                  </p>
                )}
                {currentBlockType === "EMOM" && (
                  <p className={`text-brightYellow font-titillium font-semibold ${isFullscreen ? "text-sm sm:text-base md:text-lg" : "text-sm"}`}>
                    EMOM — Every Minute On the Minute!
                  </p>
                )}
              </div>
            </div>

            {/* Timer display */}
            <div className="mb-2">
              {(() => {
                const isFirstExerciseOfWorkout = currentExerciseNumber === 1 && currentRound === 1;
                return !isActive && !isPaused && !isPreparationCountdown && isFirstExerciseOfWorkout && !hasStartedOnce;
              })() ? (
                <div className="text-center">
                  <div className={`p-4 text-brightYellow ${isFullscreen ? "text-6xl md:text-8xl lg:text-9xl" : "text-7xl"}`}>5</div>
                  <div className="text-brightYellow font-titillium font-semibold text-lg mb-2">Get Ready!</div>
                  <div className="text-customGray/60 font-titillium text-sm mb-1">
                    {activeExercise?.name ? `Prepare for: ${activeExercise.name}` : "Prepare for your exercise"}
                  </div>
                  <span className="text-customGray/40 font-titillium text-sm">
                    🏃‍♀️ Click START for a 5-second countdown to get in position
                  </span>
                </div>
              ) : (
                <div>
                  <div
                    className={`font-bold ${
                      isFullscreen && (isRest || isRoundRest)
                        ? "p-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                        : isFullscreen
                        ? "p-4 text-6xl md:text-8xl lg:text-9xl"
                        : "p-4 text-7xl"
                    } ${
                      isPreparationCountdown
                        ? "text-brightYellow animate-pulse"
                        : isRest || isRoundRest
                        ? "text-hotPink"
                        : "text-limeGreen"
                    } ${
                      time <= 5 && time > 0 && !isStopwatch && !isMaxTimeExercise && !isPreparationCountdown
                        ? "animate-pulse"
                        : ""
                    }`}
                  >
                    {isPreparationCountdown ? preparationTime : formatTime(time)}
                  </div>

                  {isPreparationCountdown && (
                    <div className="text-center">
                      <div className="text-brightYellow font-titillium font-semibold text-lg mb-2">Get Ready!</div>
                      <div className="text-customGray/60 font-titillium text-sm mb-2">
                        {activeExercise?.name ? `Prepare for: ${activeExercise.name}` : "Prepare for your exercise"}
                      </div>
                      <span className="text-brightYellow font-titillium font-semibold text-sm animate-bounce">🏃‍♀️ Get in position!</span>
                    </div>
                  )}

                  {!isPreparationCountdown && time <= 5 && time > 0 && !isStopwatch && !isMaxTimeExercise && (
                    <div className="text-center">
                      <span className="text-brightYellow font-titillium font-semibold text-lg animate-bounce">🔔 Get Ready!</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className={`flex justify-center w-full ${isFullscreen && (isRest || isRoundRest) ? "mt-2" : "mt-4"}`}>
              <div className={`bg-gray-100 rounded-full ${isFullscreen ? "h-3 w-3/4" : "h-3 w-1/2"}`}>
                <div
                  className="bg-linear-to-r from-limeGreen via-brightYellow to-hotPink h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Next exercise — fullscreen only */}
            {isFullscreen && nextExercise && (
              (isRest || isRoundRest) ||
              (!isRest && !isRoundRest && !isStopwatch && !isMaxTimeExercise &&
               parseDurationToSeconds(currentExercise?.rest || "0s") === 0)
            ) && (
              <div className="flex justify-center w-full mt-4">
                <div className={`p-3 landscape:p-2 bg-gray-50 rounded-xl border border-gray-100 ${isFullscreen ? "w-3/4" : "w-full"}`}>
                  <div className="text-center">
                    <h4 className="text-base landscape:text-sm font-titillium font-semibold text-brightYellow mb-1 landscape:mb-0.5">
                      Next Exercise
                    </h4>
                    <p className="text-lg landscape:text-base font-bold text-customGray font-titillium mb-1 landscape:mb-0">
                      {nextExercise.exercise?.name || "Get Ready!"}
                    </p>
                    {nextExercise.exercise?.modification && (
                      <p className="text-sm landscape:text-xs text-customGray/50 font-titillium mb-1 landscape:mb-0">
                        or <span className="text-brightYellow">{nextExercise.exercise.modification.name}</span>
                      </p>
                    )}
                    {nextExercise.reps && (
                      <p className="text-sm landscape:text-xs text-brightYellow font-titillium">
                        {`${nextExercise.reps}${nextExercise.duration ? ` (${nextExercise.duration})` : " reps"}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Timer controls */}
            <div className={`flex justify-center flex-wrap gap-2 ${isFullscreen ? "mt-4" : "mt-3"}`}>
              {canGoBack && (
                <button
                  onClick={() => { clearInterval(intervalRef.current); setTime(0); setIsActive(false); setIsPaused(false); cancelPreparationCountdown(); onGoBack(); }}
                  className={`${isFullscreen ? btnLg : btnMd} font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors`}
                >
                  Back
                </button>
              )}

              {(!isActive && !isPreparationCountdown) || isPaused ? (
                <button
                  onClick={resumeTimer}
                  className={`${isFullscreen ? btnLg : btnMd} font-titillium font-bold bg-limeGreen text-black rounded-xl hover:bg-limeGreen/80 transition-colors`}
                >
                  {isPaused ? "Resume" : "Start"}
                </button>
              ) : isPreparationCountdown ? (
                <button
                  disabled
                  className={`${isFullscreen ? btnLg : btnMd} font-titillium font-bold bg-brightYellow/50 text-black rounded-xl cursor-not-allowed`}
                >
                  Get Ready...
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className={`${isFullscreen ? btnLg : btnMd} font-titillium font-bold bg-hotPink text-black rounded-xl hover:bg-hotPink/80 transition-colors`}
                >
                  Pause
                </button>
              )}

              {(isStopwatch || isMaxTimeExercise) && isActive && (
                <button
                  onClick={stopAndReset}
                  className={`${isFullscreen ? btnLg : btnMd} font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors`}
                >
                  Reset
                </button>
              )}

              {(isMaxTimeExercise ||
                (currentExercise?.duration && (currentExercise.duration === "Max Time" || currentExercise.duration === "Max time")) ||
                (currentExercise?.exercise?.name?.toLowerCase().includes("plank") && currentExercise?.duration?.toLowerCase().includes("max"))) && (
                <button
                  onClick={() => { clearInterval(intervalRef.current); onExerciseComplete(); }}
                  className={`${isFullscreen ? btnLg : btnMd} font-titillium font-semibold bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors`}
                >
                  Done
                </button>
              )}

              {(isStopwatch || isMaxTimeExercise) && isAdmin && (
                <button
                  onClick={() => { clearInterval(intervalRef.current); onExerciseComplete(); }}
                  className={`${isFullscreen ? btnLg : btnMd} font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors`}
                >
                  Next
                </button>
              )}

              {!isStopwatch && !isMaxTimeExercise && (
                <button
                  onClick={resetCurrentTimer}
                  className={`${isFullscreen ? btnLg : btnMd} font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors`}
                >
                  {hasResetOnce ? "Go Back" : "Reset"}
                </button>
              )}

              {isMaxTimeExercise && (
                <button
                  onClick={resetCurrentTimer}
                  className={`${isFullscreen ? btnLg : btnMd} font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors`}
                >
                  {hasResetOnce ? "Go Back" : "Reset"}
                </button>
              )}

              {!isStopwatch && (isRest || isRoundRest) && time > 0 && (
                <button
                  onClick={skipRest}
                  className={`${isFullscreen ? btnLg : btnMd} font-titillium font-semibold bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors`}
                >
                  Skip
                </button>
              )}

              {!isStopwatch && !isMaxTimeExercise && !isRest && !isRoundRest && isAdmin && (
                <button
                  onClick={() => { clearInterval(intervalRef.current); onExerciseComplete(); }}
                  className={`${isFullscreen ? btnLg : btnMd} font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors`}
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
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
  initializeAudioContext: PropTypes.func, // New prop for iOS audio initialization
};

export default WorkoutTimer;
