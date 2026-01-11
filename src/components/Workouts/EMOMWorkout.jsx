import React, { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import DynamicHeading from "../../components/Shared/DynamicHeading";
import AudioControl from "../../components/Shared/AudioControl";
import useWorkoutAudio from "../../hooks/useWorkoutAudio";
import useWorkoutFullscreen from "../../hooks/useWorkoutFullscreen";
import { getToggleButtonText } from "../../utils/exerciseUtils";

const EMOMWorkout = ({
  workoutBlock,
  title,
  description,
  onComplete,
  onGoBack,
  canGoBack,
  shouldAutoStart = false,
  isAdmin = false,
}) => {
  const [timerState, setTimerState] = useState({
    totalTime: 0,
    currentMinute: 1,
    secondsInCurrentMinute: 60,
    isActive: false,
    isPaused: false,
    isComplete: false,
  });
  const [showModified, setShowModified] = useState({});
  const [hasResetOnce, setHasResetOnce] = useState(false);
  const { isFullscreen, toggleFullscreen } = useWorkoutFullscreen();
  const intervalRef = useRef(null);
  const {
    audioEnabled,
    volume,
    startSound,
    toggleAudio,
    setVolumeLevel,
    setStartSoundType,
    playBeep,
    playStartSound,
  } = useWorkoutAudio();

  const extractWorkoutInfo = () => {
    const notes = workoutBlock.blockNotes || "";

    let match = notes.match(/(\d+)\s*(?:minutes?|mins?)/i);
    const totalMinutes = match ? parseInt(match[1]) : 12;
    const isEveryTwoMinutes = /every\s+2\s+minutes?/i.test(notes);

    return { totalMinutes, isEveryTwoMinutes };
  };

  const { totalMinutes, isEveryTwoMinutes } = extractWorkoutInfo();
  const currentExercise = useMemo(() => {
    if (!workoutBlock.exercises || workoutBlock.exercises.length === 0) {
      return null;
    }

    if (workoutBlock.exercises.length === 1) {
      return workoutBlock.exercises[0];
    }

    const currentMinute = timerState.currentMinute;
    const exercises = workoutBlock.exercises;

    if (isEveryTwoMinutes) {
      const exerciseIndex =
        Math.floor((currentMinute - 1) / 2) % exercises.length;
      return exercises[exerciseIndex];
    }

    const exerciseIndex = (currentMinute - 1) % exercises.length;
    return exercises[exerciseIndex];
  }, [
    timerState.currentMinute,
    workoutBlock.exercises,
    isEveryTwoMinutes,
    workoutBlock.blockRounds,
  ]);

  useEffect(() => {
    if (shouldAutoStart) {
      setTimerState((prev) => ({ ...prev, isActive: true }));
    }
  }, [shouldAutoStart]);

  // useEffect(() => {
  //   console.log(`EMOM: Current minute changed to ${timerState.currentMinute}`);
  //   console.log(`EMOM: Pattern - Every 2 min: ${isEveryTwoMinutes}`);
  //   console.log(
  //     `EMOM: Total exercises in block:`,
  //     workoutBlock.exercises?.length
  //   );
  //   console.log(`EMOM: Current exercise:`, currentExercise);
  // }, [timerState.currentMinute, currentExercise, isEveryTwoMinutes]);

  useEffect(() => {
    if (timerState.isActive && !timerState.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimerState((prevState) => {
          const newSeconds = prevState.secondsInCurrentMinute - 1;

          if (newSeconds <= 5 && newSeconds > 0) {
            playBeep();
          }

          // Play start sound when starting each new minute (when rest ends and work begins)
          if (newSeconds === 60 && prevState.currentMinute > 1) {
            playStartSound();
          }

          if (newSeconds <= 0) {
            const nextMinute = prevState.currentMinute + 1;
            if (nextMinute > totalMinutes) {
              clearInterval(intervalRef.current);
              return { ...prevState, isComplete: true };
            }
            return {
              ...prevState,
              currentMinute: nextMinute,
              secondsInCurrentMinute: 60,
              totalTime: prevState.totalTime + 1,
            };
          }

          return {
            ...prevState,
            secondsInCurrentMinute: newSeconds,
            totalTime: prevState.totalTime + 1,
          };
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [timerState.isActive, timerState.isPaused, totalMinutes, playBeep]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTotalTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    setTimerState((prev) => ({ ...prev, isActive: true, isPaused: false }));
    setHasResetOnce(false);
  };

  const pauseTimer = () => {
    setTimerState((prev) => ({ ...prev, isPaused: true }));
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);

    if (!hasResetOnce) {
      setTimerState((prevState) => ({
        ...prevState,
        secondsInCurrentMinute: 60,
        isActive: false,
        isPaused: false,
      }));
      setHasResetOnce(true);
    } else {
      setTimerState({
        totalTime: 0,
        currentMinute: 1,
        secondsInCurrentMinute: 60,
        isActive: false,
        isPaused: false,
        isComplete: false,
      });
      setHasResetOnce(false);
    }
  };

  const skipCurrentMinute = () => {
    if (!isAdmin) return;

    setTimerState((prevState) => {
      const nextMinute = prevState.currentMinute + 1;
      if (nextMinute > totalMinutes) {
        clearInterval(intervalRef.current);
        return { ...prevState, isComplete: true };
      }
      return {
        ...prevState,
        currentMinute: nextMinute,
        secondsInCurrentMinute: 60,
        totalTime: prevState.totalTime + prevState.secondsInCurrentMinute,
      };
    });
  };

  const handleComplete = () => {
    clearInterval(intervalRef.current);
    onComplete();
  };



  const getProgressPercentage = () => {
    const totalWorkoutSeconds = totalMinutes * 60;
    return (timerState.totalTime / totalWorkoutSeconds) * 100;
  };

  const getExerciseName = (exercise, minute) => {
    if (!exercise?.exercise) return "";

    const isModified = showModified[minute] || false;
    if (isModified && exercise.exercise.modification) {
      return exercise.exercise.modification.name;
    }
    return exercise.exercise.name;
  };

  const getNextExercise = useMemo(() => {
    if (!workoutBlock.exercises || workoutBlock.exercises.length === 0) {
      return null;
    }

    // If only one exercise, there's no "next" exercise
    if (workoutBlock.exercises.length === 1) {
      return null;
    }

    const nextMinute = timerState.currentMinute + 1;

    // If we're at the last minute, there's no next exercise
    if (nextMinute > totalMinutes) {
      return null;
    }

    const exercises = workoutBlock.exercises;

    if (isEveryTwoMinutes) {
      const exerciseIndex = Math.floor((nextMinute - 1) / 2) % exercises.length;
      return exercises[exerciseIndex];
    }

    const exerciseIndex = (nextMinute - 1) % exercises.length;
    return exercises[exerciseIndex];
  }, [
    timerState.currentMinute,
    workoutBlock.exercises,
    isEveryTwoMinutes,
    totalMinutes,
  ]);

  if (timerState.isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-customGray/30 to-white">
        <div className="bg-customGray p-6 rounded-lg text-center max-w-xs md:max-w-2xl w-full border-brightYellow border-2">
          <div className="text-6xl m-6">🎉</div>
          <DynamicHeading
            text="Workout Complete!"
            className="font-higherJump text-2xl sm:text-3xl font-bold text-customWhite m-4 leading-loose"
          />
          <p className="text-lg text-logoGray mt-6">
            Great job! You completed {totalMinutes} minutes of EMOM training.
          </p>
          <div className="space-x-4">
            <button
              onClick={handleComplete}
              className="btn-full-colour mr-0 sm:mr-2"
            >
              Back to Program
            </button>
            <button onClick={resetTimer} className="btn-cancel">
              Restart EMOM
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-linear-to-b from-customGray/30 to-white ${
        isFullscreen ? "fixed inset-0 z-50 p-0" : "p-4"
      }`}
    >
      <div
        className={`bg-customGray rounded-lg text-center w-full flex flex-col border-brightYellow border-2 ${
          isFullscreen
            ? "h-full max-w-none p-6"
            : "p-4 max-w-xs sm:max-w-2xl md:max-w-6xl h-full lg:max-h-[120vh] mt-20 md:mt-26"
        }`}
      >
        {!isFullscreen && (
          <div className="flex justify-between items-center">
            <AudioControl
              audioEnabled={audioEnabled}
              volume={volume}
              startSound={startSound}
              onToggle={toggleAudio}
              onVolumeChange={setVolumeLevel}
              onStartSoundChange={setStartSoundType}
              playStartSound={playStartSound}
              playBeep={playBeep}
              className="mt-0"
            />
            {canGoBack && (
              <button onClick={onGoBack} className="btn-cancel mt-0">
                Back to Overview
              </button>
            )}
          </div>
        )}
        {/* Header */}
        {!isFullscreen && (
          <div className="flex flex-col mt-4 mb-4 items-center">
            <DynamicHeading
              text={title}
              className="font-higherJump mb-4 text-xl md:text-3xl font-bold text-customWhite text-center leading-loose tracking-widest"
            />
            <div className="flex flex-col md:flex-row gap-0 md:gap-4 w-full items-center md:items-stretch">
              {/* Description */}
              <div className="flex items-start justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center flex-1 min-h-[80px]">
                <p className="text-logoGray text-sm whitespace-pre-line wrap-break-words leading-loose">
                  <span className="text-limeGreen font-bold">Description:</span>{" "}
                  {description}
                </p>
              </div>

              {/* Instructions */}
              {currentExercise && (
                <div className="flex items-start justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center flex-1 min-h-[80px]">
                  <p className="text-sm text-logoGray whitespace-pre-line wrap-break-words leading-loose">
                    <span className="text-limeGreen font-bold">
                      Instructions:
                    </span>{" "}
                    Complete {currentExercise.reps} reps of{" "}
                    {getExerciseName(currentExercise, timerState.currentMinute)}{" "}
                    within this minute. Use any remaining time to rest before
                    the next minute begins.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <h2
            className={`text-customWhite font-titillium font-semibold lg:mb-2 ${
              isFullscreen ? "text-4xl mb-6" : "text-lg md:text-2xl"
            }`}
          >
            Minute{" "}
            <span className="text-brightYellow">
              {timerState.currentMinute}
            </span>{" "}
            of <span className="text-brightYellow">{totalMinutes}</span>{" "}
            (Exercise{" "}
            <span className="text-brightYellow">
              {" "}
              {((timerState.currentMinute - 1) %
                workoutBlock.exercises.length) +
                1}
            </span>
            )
          </h2>
        </div>

        {/* Main Content */}
        <div
          className={`grow flex gap-0 md:gap-4 p-4 ${
            isFullscreen
              ? "flex-col items-center justify-start"
              : "flex-col lg:flex-row"
          }`}
        >
          {/* Left Column: Timer and Controls */}
          <div
            className={`flex flex-col space-y-4 landscape:space-y-2 ${
              isFullscreen ? "w-full" : "w-full lg:w-1/3"
            }`}
          >
            {currentExercise && (
              <div
                className={`space-y-4 landscape:space-y-2 pt-4 landscape:pt-2 ${isFullscreen ? "order-2" : ""}`}
              >
                <div className="p-4 landscape:p-2 rounded-lg text-center bg-gray-600 text-customWhite">
                  <h4
                    className={`font-bold ${
                      isFullscreen ? "text-3xl landscape:text-xl mb-4 landscape:mb-2" : "text-lg"
                    }`}
                  >
                    {getExerciseName(currentExercise, timerState.currentMinute)}
                  </h4>
                  {/* Exercise-specific tips (e.g., "2 Jabs = 1 rep") */}
                  {currentExercise.tips && (
                    <p className="text-xs text-logoGray mb-2 italic">
                      {currentExercise.tips}
                    </p>
                  )}
                  <div
                    className={`font-bold mb-3 landscape:mb-1 text-brightYellow ${
                      isFullscreen ? "text-6xl landscape:text-4xl" : "text-4xl"
                    }`}
                  >
                    {`${currentExercise.reps} ${
                      currentExercise.duration
                        ? `(${currentExercise.duration})`
                        : "reps"
                    }`}
                  </div>

                  {/* Modification Toggle - moved above next exercise */}
                  {currentExercise.exercise?.modification && (
                    <div className="flex justify-center space-x-1 mb-3 landscape:mb-1">
                      {(() => {
                        const { standardText, modifiedText } =
                          getToggleButtonText(currentExercise);
                        return (
                          <>
                            <button
                              onClick={() =>
                                setShowModified((prev) => ({
                                  ...prev,
                                  [timerState.currentMinute]: false,
                                }))
                              }
                              className={`text-xs px-2 py-1 rounded border ${
                                !showModified[timerState.currentMinute]
                                  ? "border-limeGreen bg-limeGreen text-black"
                                  : "border-logoGray bg-logoGray text-black hover:bg-gray-400"
                              }`}
                            >
                              {standardText}
                            </button>
                            <button
                              onClick={() =>
                                setShowModified((prev) => ({
                                  ...prev,
                                  [timerState.currentMinute]: true,
                                }))
                              }
                              className={`text-xs px-2 py-1 rounded border ${
                                showModified[timerState.currentMinute]
                                  ? "border-limeGreen bg-limeGreen text-black"
                                  : "border-logoGray bg-logoGray text-black hover:bg-gray-400"
                              }`}
                            >
                              {modifiedText}
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Next Exercise Preview */}
                  {getNextExercise && (
                    <div className="mt-4 pt-3 border-t border-gray-500">
                      <div
                        className={`text-logoGray mb-1 landscape:mb-0 ${
                          isFullscreen ? "text-lg landscape:text-sm" : "text-sm"
                        }`}
                      >
                        Next minute:
                      </div>
                      <div
                        className={`font-semibold text-customWhite mb-1 landscape:mb-0 ${
                          isFullscreen ? "text-2xl landscape:text-lg" : "text-lg"
                        }`}
                      >
                        {getExerciseName(
                          getNextExercise,
                          timerState.currentMinute + 1
                        )}
                      </div>
                      {getNextExercise.exercise.modification && (
                        <div
                          className={`text-logoGray mb-1 landscape:mb-0 ${
                            isFullscreen ? "text-xl landscape:text-base" : "text-base"
                          }`}
                        >
                          or{" "}
                          <span className="text-brightYellow">
                            {getNextExercise.exercise.modification.name}
                          </span>
                        </div>
                      )}
                      <div
                        className={`text-brightYellow ${
                          isFullscreen ? "text-xl landscape:text-base" : "text-base"
                        }`}
                      >
                        {`${getNextExercise.reps} ${
                          getNextExercise.duration
                            ? `(${getNextExercise.duration})`
                            : "reps"
                        }`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div
              className={`flex flex-col sm:flex-row-reverse lg:flex-col gap-4 ${
                isFullscreen ? "order-1" : ""
              }`}
            >
              {/* Current Minute Timer */}
              <div
                className={`bg-gray-600 rounded-lg p-4 landscape:p-2 text-center relative ${
                  isFullscreen ? "w-full" : "w-full sm:w-1/2 lg:w-full"
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
                <div
                  className={`mb-4 landscape:mb-2 text-limeGreen ${
                    isFullscreen
                      ? "text-6xl md:text-8xl lg:text-9xl landscape:text-4xl"
                      : "text-6xl"
                  }`}
                >
                  {formatTime(timerState.secondsInCurrentMinute)}
                </div>

                {/* Progress Bar - Only in fullscreen mode, directly under timer */}
                {isFullscreen && (
                  <div className="mb-4 landscape:mb-2">
                    <div className="bg-gray-500 rounded-full h-3 sm:h-4 md:h-6">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-brightYellow"
                        style={{ width: `${getProgressPercentage()}%` }}
                      ></div>
                    </div>
                    <div className="text-customWhite text-xs sm:text-sm mt-2">
                      Total Time: {formatTotalTime(timerState.totalTime)}
                    </div>
                  </div>
                )}

                {/* Timer Controls */}
                <div className="flex justify-center space-x-2">
                  {!timerState.isActive || timerState.isPaused ? (
                    <button
                      onClick={startTimer}
                      className={`btn-full-colour mt-3 ${
                        isFullscreen
                          ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg landscape:px-2 landscape:py-1 landscape:text-xs"
                          : ""
                      }`}
                    >
                      {timerState.isPaused ? "Resume" : "Start"}
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className={`btn-subscribe mt-3 ${
                        isFullscreen
                          ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg landscape:px-2 landscape:py-1 landscape:text-xs"
                          : ""
                      }`}
                    >
                      Pause
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className={`btn-cancel mt-3 ${
                      isFullscreen
                        ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg landscape:px-2 landscape:py-1 landscape:text-xs"
                        : ""
                    }`}
                  >
                    {hasResetOnce ? "Reset All" : "Reset"}
                  </button>
                  {isAdmin && timerState.isActive && (
                    <button
                      onClick={skipCurrentMinute}
                      className={`btn-skip mt-3 ${
                        isFullscreen
                          ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg landscape:px-2 landscape:py-1 landscape:text-xs"
                          : ""
                      }`}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
              {/* Total Time - Hidden in fullscreen */}
              {!isFullscreen && (
                <div className="w-full sm:w-1/2 lg:w-full bg-gray-600 rounded-lg p-4 text-center">
                  <h3 className="font-bold text-customWhite mb-2 text-xl">
                    Total Time
                  </h3>
                  <div className="text-brightYellow mb-4 text-6xl">
                    {formatTotalTime(timerState.totalTime)}
                  </div>
                  {/* Overall Progress Bar */}
                  <div className="bg-gray-500 rounded-full h-3">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-brightYellow"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Current Exercise */}
          {!isFullscreen && (
            <div className="w-full lg:w-2/3">
              <div className="h-full">
                {/* Video */}
                {currentExercise ? (
                  <div className="pt-4">
                    <div className="relative w-full pb-[100%] md:pb-[80.25%] overflow-hidden rounded-lg">
                      <div className="absolute top-0 left-0 w-full h-full">
                        <ExerciseVideo
                          exercise={currentExercise}
                          isActive={true}
                          shouldAutoStart={false}
                          showModified={
                            showModified[timerState.currentMinute] || false
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-600 rounded-lg p-10 h-full flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">⏱️</div>
                    <h3 className="text-xl font-bold text-customWhite mb-2">
                      EMOM Ready
                    </h3>
                    <p className="text-logoGray text-md">
                      Start the timer to begin your EMOM workout
                    </p>
                  </div>
                )}
                {/* Individual Exercise Details */}
                <div className="mt-2 flex flex-col md:flex-row gap-4">
                  {/* Show individual exercise tips */}
                  {currentExercise &&
                    (currentExercise?.tips ||
                      currentExercise?.exercise?.tips) && (
                      <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-600 rounded-lg p-2 mt-3 text-center">
                        <p className="text-sm text-logoGray whitespace-pre-line wrap-break-words leading-loose">
                          <span className="text-limeGreen font-bold">
                            Form Tips:
                          </span>{" "}
                          {currentExercise?.tips ||
                            currentExercise?.exercise?.tips}
                        </p>
                      </div>
                    )}
                  {/* Show individual exercise instructions */}
                  {currentExercise &&
                    (currentExercise?.instructions ||
                      currentExercise?.exercise?.instructions) && (
                      <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-600 rounded-lg p-2 mt-3 text-center">
                        <p className="text-sm text-logoGray whitespace-pre-line wrap-break-words leading-loose">
                          <span className="text-limeGreen font-bold">
                            Instructions:
                          </span>{" "}
                          {currentExercise?.instructions ||
                            currentExercise?.exercise?.instructions}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

EMOMWorkout.propTypes = {
  workoutBlock: PropTypes.shape({
    blockType: PropTypes.string.isRequired,
    blockNotes: PropTypes.string,
    blockRounds: PropTypes.number,
    exercises: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        tips: PropTypes.string,
        instructions: PropTypes.string,
        exercise: PropTypes.shape({
          name: PropTypes.string.isRequired,
          instructions: PropTypes.string,
          tips: PropTypes.string,
          modification: PropTypes.shape({
            name: PropTypes.string,
            videoId: PropTypes.string,
          }),
        }).isRequired,
        reps: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  shouldAutoStart: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

export default EMOMWorkout;
