import { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import AudioControl from "../../components/Shared/AudioControl";
import useWorkoutAudio from "../../hooks/useWorkoutAudio";
import useWorkoutFullscreen from "../../hooks/useWorkoutFullscreen";
import usePreparationCountdown from "../../hooks/usePreparationCountdown";
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
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
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

  const {
    isPreparationCountdown,
    preparationTime,
    startPreparationCountdown,
    cancelPreparationCountdown,
  } = usePreparationCountdown(playBeep, playStartSound);

  const extractWorkoutInfo = () => {
    const notes = workoutBlock.blockNotes || "";
    let match = notes.match(/(\d+)\s*(?:minutes?|mins?)/i);
    const totalMinutes = match ? parseInt(match[1]) : 12;
    const isEveryTwoMinutes = /every\s+2\s+minutes?/i.test(notes);
    return { totalMinutes, isEveryTwoMinutes };
  };

  const { totalMinutes, isEveryTwoMinutes } = extractWorkoutInfo();

  const currentExercise = useMemo(() => {
    if (!workoutBlock.exercises || workoutBlock.exercises.length === 0) return null;
    if (workoutBlock.exercises.length === 1) return workoutBlock.exercises[0];
    const currentMinute = timerState.currentMinute;
    const exercises = workoutBlock.exercises;
    if (isEveryTwoMinutes) {
      return exercises[Math.floor((currentMinute - 1) / 2) % exercises.length];
    }
    return exercises[(currentMinute - 1) % exercises.length];
  }, [timerState.currentMinute, workoutBlock.exercises, isEveryTwoMinutes]);

  useEffect(() => {
    if (timerState.isActive && !timerState.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimerState((prevState) => {
          const newSeconds = prevState.secondsInCurrentMinute - 1;
          if (newSeconds <= 5 && newSeconds > 0) playBeep();
          if (newSeconds === 60 && prevState.currentMinute > 1) playStartSound();
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
  }, [timerState.isActive, timerState.isPaused, totalMinutes, playBeep, playStartSound]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTotalTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (!timerState.isActive && !timerState.isPaused && !isPreparationCountdown && !hasStartedOnce) {
      startPreparationCountdown(() => {
        setTimerState((prev) => ({ ...prev, isActive: true, isPaused: false }));
        setHasResetOnce(false);
        setHasStartedOnce(true);
      });
    } else {
      setTimerState((prev) => ({ ...prev, isActive: true, isPaused: false }));
      setHasResetOnce(false);
      setHasStartedOnce(true);
    }
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
      setHasStartedOnce(false);
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
      setHasStartedOnce(false);
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
    if (isModified && exercise.exercise.modification) return exercise.exercise.modification.name;
    return exercise.exercise.name;
  };

  const getNextExercise = useMemo(() => {
    if (!workoutBlock.exercises || workoutBlock.exercises.length <= 1) return null;
    const nextMinute = timerState.currentMinute + 1;
    if (nextMinute > totalMinutes) return null;
    const exercises = workoutBlock.exercises;
    if (isEveryTwoMinutes) {
      return exercises[Math.floor((nextMinute - 1) / 2) % exercises.length];
    }
    return exercises[(nextMinute - 1) % exercises.length];
  }, [timerState.currentMinute, workoutBlock.exercises, isEveryTwoMinutes, totalMinutes]);

  // Void unused variable to avoid lint warning
  void shouldAutoStart;
  void cancelPreparationCountdown;

  if (timerState.isComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-lg w-full text-center">
          <div className="text-5xl mb-5">🎉</div>
          <h2 className="text-2xl md:text-3xl font-bold text-customGray font-titillium mb-3">
            EMOM Complete!
          </h2>
          <p className="text-customGray/60 font-titillium mb-8">
            Great work! You completed {totalMinutes} minutes of EMOM training.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleComplete}
              className="w-full py-3 bg-brightYellow text-black font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200"
            >
              Back to Programme
            </button>
            <button
              onClick={resetTimer}
              className="w-full py-3 bg-gray-50 text-customGray/60 font-titillium font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
            >
              Restart EMOM
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 p-0" : "min-h-screen bg-white pt-32 pb-8 px-4"}`}>
      <div className={`${isFullscreen ? "bg-white h-full max-w-none p-6 flex flex-col" : "max-w-6xl mx-auto space-y-4"}`}>

        {!isFullscreen && (
          <>
            {/* Top bar */}
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
                <button
                  onClick={onGoBack}
                  className="inline-flex items-center gap-2 text-sm font-titillium font-semibold text-customGray/50 hover:text-customGray transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Overview
                </button>
              )}
            </div>

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h1 className="text-lg md:text-2xl font-bold text-customGray font-titillium mb-3 text-center">{title}</h1>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">{description}</p>
                </div>
                {currentExercise && (
                  <div className="flex-1 bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-1">Instructions</p>
                    <p className="text-sm text-customGray/70 font-titillium leading-relaxed">
                      Complete {currentExercise.reps} reps of{" "}
                      {getExerciseName(currentExercise, timerState.currentMinute)} within this minute. Use any remaining time to rest before the next minute begins.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Audio controls for fullscreen */}
        {isFullscreen && (
          <div className="hidden lg:flex justify-start items-center mb-2">
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
          </div>
        )}

        {/* Minute progress header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <h2 className="text-base md:text-xl font-bold text-customGray font-titillium">
            Minute{" "}
            <span className="text-brightYellow">{timerState.currentMinute}</span>{" "}
            of <span className="text-brightYellow">{totalMinutes}</span>
            {workoutBlock.exercises.length > 1 && (
              <span className="text-customGray/50 text-sm font-normal ml-2">
                (Exercise {((timerState.currentMinute - 1) % workoutBlock.exercises.length) + 1})
              </span>
            )}
          </h2>
          {/* Overall progress bar */}
          <div className="mt-3 bg-gray-100 rounded-full h-2">
            <div
              className="bg-brightYellow h-full rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Main content */}
        <div className={`flex gap-4 ${isFullscreen ? "flex-col items-center" : "flex-col lg:flex-row"}`}>

          {/* Left column: timer + exercise info */}
          <div className={`flex flex-col gap-4 ${isFullscreen ? "w-full" : "w-full lg:w-1/3"}`}>

            {/* Current exercise card */}
            {currentExercise && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                <h3 className="text-lg font-bold text-customGray font-titillium mb-1">
                  {getExerciseName(currentExercise, timerState.currentMinute)}
                </h3>
                {currentExercise.tips && (
                  <p className="text-xs text-customGray/50 font-titillium italic mb-2">{currentExercise.tips}</p>
                )}
                <div className="text-3xl font-bold text-brightYellow font-titillium mb-3">
                  {`${currentExercise.reps}${currentExercise.duration ? ` (${currentExercise.duration})` : " reps"}`}
                </div>

                {/* Modification toggle */}
                {currentExercise.exercise?.modification && (() => {
                  const { standardText, modifiedText } = getToggleButtonText(currentExercise);
                  return (
                    <div className="flex justify-center gap-2 mb-3">
                      <button
                        onClick={() => setShowModified((prev) => ({ ...prev, [timerState.currentMinute]: false }))}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-titillium transition-colors ${
                          !showModified[timerState.currentMinute]
                            ? "border-limeGreen bg-limeGreen text-black"
                            : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                        }`}
                      >
                        {standardText}
                      </button>
                      <button
                        onClick={() => setShowModified((prev) => ({ ...prev, [timerState.currentMinute]: true }))}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-titillium transition-colors ${
                          showModified[timerState.currentMinute]
                            ? "border-limeGreen bg-limeGreen text-black"
                            : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                        }`}
                      >
                        {modifiedText}
                      </button>
                    </div>
                  );
                })()}

                {/* Next exercise preview */}
                {getNextExercise && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs font-titillium font-semibold text-customGray/50 uppercase tracking-wide mb-1">Next Minute</p>
                    <p className="text-sm font-bold text-customGray font-titillium">
                      {getExerciseName(getNextExercise, timerState.currentMinute + 1)}
                    </p>
                    {getNextExercise.exercise?.modification && (
                      <p className="text-xs text-customGray/50 font-titillium">
                        or <span className="text-brightYellow">{getNextExercise.exercise.modification.name}</span>
                      </p>
                    )}
                    <p className="text-sm text-brightYellow font-titillium mt-0.5">
                      {`${getNextExercise.reps}${getNextExercise.duration ? ` (${getNextExercise.duration})` : " reps"}`}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row-reverse lg:flex-col gap-4">
              {/* Timer card */}
              <div className="w-full sm:w-1/2 lg:w-full bg-white rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col justify-between relative p-5 min-h-[160px]">
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
                <div className="flex-1 flex flex-col justify-center">
                  {!timerState.isActive && !timerState.isPaused && !isPreparationCountdown && !hasStartedOnce ? (
                    <div className="text-center">
                      <div className="text-6xl text-brightYellow mb-2">5</div>
                      <p className="text-sm font-titillium font-semibold text-brightYellow mb-1">Get Ready!</p>
                      <p className="text-xs text-customGray/50 font-titillium">Click START for a 5-second countdown</p>
                    </div>
                  ) : isPreparationCountdown ? (
                    <div className="text-center">
                      <div className="text-6xl text-brightYellow animate-pulse mb-2">{preparationTime}</div>
                      <p className="text-sm font-titillium font-semibold text-brightYellow animate-bounce">🏃‍♀️ Get in position!</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-5xl lg:text-6xl text-limeGreen font-bold mb-1">{formatTime(timerState.secondsInCurrentMinute)}</div>
                      <p className="text-xs text-customGray/50 font-titillium">this minute</p>
                    </>
                  )}
                </div>
                <div className="flex justify-center gap-2">
                  {(!timerState.isActive && !isPreparationCountdown) || timerState.isPaused ? (
                    <button onClick={startTimer} className="px-4 py-2 text-sm font-titillium font-bold bg-limeGreen text-black rounded-xl hover:bg-limeGreen/80 transition-colors">
                      {timerState.isPaused ? "Resume" : "Start"}
                    </button>
                  ) : isPreparationCountdown ? (
                    <button disabled className="px-4 py-2 text-sm font-titillium font-bold bg-brightYellow/50 text-black rounded-xl cursor-not-allowed">
                      Get Ready...
                    </button>
                  ) : (
                    <button onClick={pauseTimer} className="px-4 py-2 text-sm font-titillium font-bold bg-hotPink text-black rounded-xl hover:bg-hotPink/80 transition-colors">
                      Pause
                    </button>
                  )}
                  <button onClick={resetTimer} className="px-4 py-2 text-sm font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors">
                    {hasResetOnce ? "Reset All" : "Reset"}
                  </button>
                  {isAdmin && timerState.isActive && (
                    <button onClick={skipCurrentMinute} className="px-4 py-2 text-sm font-titillium font-semibold bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                      Next
                    </button>
                  )}
                </div>
              </div>

              {/* Total time card */}
              {!isFullscreen && (
                <div className="w-full sm:w-1/2 lg:w-full bg-white rounded-2xl border border-gray-100 shadow-sm text-center p-5">
                  <p className="text-xs font-titillium font-semibold text-customGray/50 uppercase tracking-wide mb-1">Total Time</p>
                  <div className="text-4xl lg:text-5xl font-bold text-brightYellow font-titillium mb-1">
                    {formatTotalTime(timerState.totalTime)}
                  </div>
                  <p className="text-xs text-customGray/40 font-titillium mb-3">of {formatTotalTime(totalMinutes * 60)}</p>
                </div>
              )}
            </div>

            {/* Tips & instructions — desktop */}
            <div className="hidden lg:flex flex-col gap-3">
              {(currentExercise?.tips || currentExercise?.exercise?.tips) && (
                <div className="bg-yellow-50 rounded-xl p-4 border border-brightYellow/20">
                  <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-1">Form Tips</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">
                    {currentExercise?.tips || currentExercise?.exercise?.tips}
                  </p>
                </div>
              )}
              {(currentExercise?.instructions || currentExercise?.exercise?.instructions) && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Instructions</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">
                    {currentExercise?.instructions || currentExercise?.exercise?.instructions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right column: video + mobile tips */}
          {!isFullscreen && (
            <div className="w-full lg:w-2/3 flex flex-col gap-3">
              {currentExercise ? (
                <div className="relative w-full pb-[100%] md:pb-[60%] lg:pb-[80%] overflow-hidden rounded-2xl border border-gray-100">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <ExerciseVideo
                      exercise={currentExercise}
                      isActive={true}
                      shouldAutoStart={false}
                      showModified={showModified[timerState.currentMinute] || false}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-10 flex flex-col items-center justify-center text-center">
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-lg font-bold text-customGray font-titillium mb-2">Get Ready!</h3>
                  <p className="text-sm text-customGray/60 font-titillium">Click START for a 5-second countdown to get in position</p>
                </div>
              )}

              {/* Tips & instructions — mobile */}
              <div className="lg:hidden flex flex-col gap-3">
                {(currentExercise?.tips || currentExercise?.exercise?.tips) && (
                  <div className="bg-yellow-50 rounded-xl p-4 border border-brightYellow/20">
                    <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-1">Form Tips</p>
                    <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">
                      {currentExercise?.tips || currentExercise?.exercise?.tips}
                    </p>
                  </div>
                )}
                {(currentExercise?.instructions || currentExercise?.exercise?.instructions) && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Instructions</p>
                    <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">
                      {currentExercise?.instructions || currentExercise?.exercise?.instructions}
                    </p>
                  </div>
                )}
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
