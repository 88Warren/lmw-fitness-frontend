import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import AudioControl from "../../components/Shared/AudioControl";
import useWorkoutAudio from "../../hooks/useWorkoutAudio";
import useWorkoutFullscreen from "../../hooks/useWorkoutFullscreen";
import usePreparationCountdown from "../../hooks/usePreparationCountdown";
import { getToggleButtonText } from "../../utils/exerciseUtils";

const TabataWorkout = ({
  workoutBlock,
  allTabataBlocks = [workoutBlock],
  title,
  description,
  onComplete,
  onGoBack,
  canGoBack,
  shouldAutoStart = false,
  isAdmin = false,
}) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRest, setIsRest] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
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

  // Suppress unused lint warnings
  void shouldAutoStart;
  void cancelPreparationCountdown;

  // Reset hasStartedOnce for subsequent blocks/sets
  useEffect(() => {
    const isFirstBlockAndSet = currentBlockIndex === 0 && currentSet === 1;
    if (!isFirstBlockAndSet) setHasStartedOnce(false);
  }, [currentBlockIndex, currentSet]);

  const extractTabataConfig = () => {
    const currentBlock = allTabataBlocks?.[currentBlockIndex];
    const notes = currentBlock?.blockNotes || "";
    let workTime = 20;
    let restTime = 10;
    let setsPerBlock = 8;

    let match = notes.match(/(\d+)\s*(?:seconds?|secs?|s)\s+work/i);
    if (match) workTime = parseInt(match[1]);
    match = notes.match(/(\d+)\s*(?:seconds?|secs?|s)\s+rest/i);
    if (match) restTime = parseInt(match[1]);
    match = notes.match(/(\d+)\s+(?:sets?|rounds?)/i);
    if (match) setsPerBlock = parseInt(match[1]);

    return { workTime, restTime, setsPerBlock, totalBlocks: allTabataBlocks?.length || 0 };
  };

  const { workTime, restTime, setsPerBlock, totalBlocks } = extractTabataConfig();

  useEffect(() => {
    if (isRest) {
      setTime(restTime);
    } else {
      setTime(workTime);
    }
    const isFirstBlockAndSet = currentBlockIndex === 0 && currentSet === 1;
    if (!isFirstBlockAndSet && !isActive) {
      setIsActive(true);
      setIsPaused(false);
    }
  }, [workTime, restTime, isRest, currentBlockIndex, currentSet, isActive]);

  useEffect(() => {
    if (isActive && !isPaused && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 5 && prev > 0) playBeep();
          if (prev === 1 && isRest) setTimeout(() => playStartSound(), 1000);
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, time, playBeep]);

  const handleTimerComplete = () => {
    const currentBlock = allTabataBlocks?.[currentBlockIndex];
    if (!currentBlock) return;

    if (isRest) {
      setIsRest(false);
      setTime(workTime);
      if (currentSet < setsPerBlock) {
        setCurrentSet(currentSet + 1);
        setCurrentExerciseIndex((currentExerciseIndex + 1) % currentBlock.exercises.length);
      } else {
        if (currentBlockIndex < totalBlocks - 1) {
          setCurrentBlockIndex(currentBlockIndex + 1);
          setCurrentSet(1);
          setCurrentExerciseIndex(0);
        } else {
          setIsComplete(true);
          return;
        }
      }
      setIsActive(true);
    } else {
      if (currentSet < setsPerBlock) {
        setIsRest(true);
        setTime(restTime);
        setIsActive(true);
      } else if (currentBlockIndex < totalBlocks - 1) {
        setIsRest(true);
        setTime(60);
        setIsActive(true);
      } else {
        setIsComplete(true);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (!isActive && !isPaused && !isPreparationCountdown && !hasStartedOnce) {
      startPreparationCountdown(() => {
        setIsActive(true);
        setIsPaused(false);
        setHasResetOnce(false);
        setHasStartedOnce(true);
      });
    } else {
      setIsActive(true);
      setIsPaused(false);
      setHasResetOnce(false);
      setHasStartedOnce(true);
    }
  };

  const pauseTimer = () => setIsPaused(true);

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    if (!hasResetOnce) {
      setTime(isRest ? restTime : workTime);
      setIsActive(false);
      setIsPaused(false);
      setHasResetOnce(true);
      setHasStartedOnce(false);
    } else {
      setTime(workTime);
      setIsActive(false);
      setIsPaused(false);
      setCurrentBlockIndex(0);
      setCurrentSet(1);
      setCurrentExerciseIndex(0);
      setIsRest(false);
      setIsComplete(false);
      setHasResetOnce(false);
      setHasStartedOnce(false);
    }
  };

  const skipCurrent = () => {
    if (!isAdmin) return;
    clearInterval(intervalRef.current);
    setTime(0);
    handleTimerComplete();
  };

  const handleComplete = () => {
    clearInterval(intervalRef.current);
    onComplete();
  };

  const getCurrentExercise = () => {
    const currentBlock = allTabataBlocks?.[currentBlockIndex];
    if (!currentBlock?.exercises || currentBlock.exercises.length === 0) return null;
    return currentBlock.exercises[currentExerciseIndex % currentBlock.exercises.length];
  };

  const currentExercise = getCurrentExercise();

  const getExerciseName = (exercise, exerciseIndex) => {
    if (!exercise?.exercise) return "";
    const isModified = showModified[exerciseIndex] || false;
    if (isModified && exercise.exercise.modification) return exercise.exercise.modification.name;
    return exercise.exercise.name;
  };

  const getNextExerciseInfo = () => {
    if (!isRest) return null;
    const currentBlock = allTabataBlocks?.[currentBlockIndex];
    if (!currentBlock) return null;

    if (currentSet < setsPerBlock) {
      const nextExerciseIndex = (currentExerciseIndex + 1) % currentBlock.exercises.length;
      return {
        type: "single",
        exercise: currentBlock.exercises[nextExerciseIndex],
        exerciseIndex: nextExerciseIndex,
        setNumber: currentSet + 1,
      };
    } else if (currentBlockIndex < totalBlocks - 1) {
      const nextBlock = allTabataBlocks[currentBlockIndex + 1];
      if (nextBlock?.exercises?.length >= 2) {
        return { type: "nextBlock", exercises: [nextBlock.exercises[0], nextBlock.exercises[1]], blockNumber: currentBlockIndex + 2 };
      } else if (nextBlock?.exercises?.length === 1) {
        return { type: "single", exercise: nextBlock.exercises[0], exerciseIndex: 0, blockNumber: currentBlockIndex + 2 };
      }
    }
    return null;
  };

  const isFirstBlockAndSet = currentBlockIndex === 0 && currentSet === 1;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-lg w-full text-center">
          <div className="text-5xl mb-5">🔥</div>
          <h2 className="text-2xl md:text-3xl font-bold text-customGray font-titillium mb-3">
            Tabata Complete!
          </h2>
          <p className="text-customGray/60 font-titillium mb-8">
            Incredible work! You completed {totalBlocks} block{totalBlocks !== 1 ? "s" : ""} of Tabata training.
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
              Restart Tabata
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
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-1">Instructions</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed">
                    {workTime}s work · {restTime}s rest · {setsPerBlock} sets per block
                  </p>
                </div>
              </div>
            </div>

            {/* Block / set progress header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-base md:text-lg font-bold text-customGray font-titillium">
                Block{" "}
                <span className="text-brightYellow">{currentBlockIndex + 1}</span>{" "}
                of <span className="text-brightYellow">{totalBlocks}</span>
                <span className="text-customGray/30 mx-2">·</span>
                Set <span className="text-limeGreen">{currentSet}</span> of{" "}
                <span className="text-limeGreen">{setsPerBlock}</span>
              </p>
              {/* Set progress dots */}
              <div className="flex justify-center gap-1.5 mt-2">
                {Array.from({ length: setsPerBlock }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      i < currentSet - 1
                        ? "bg-limeGreen"
                        : i === currentSet - 1
                        ? isRest ? "bg-hotPink" : "bg-limeGreen"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
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

        {/* Main content */}
        <div className={`flex gap-4 ${isFullscreen ? "flex-col items-center flex-1" : "flex-col lg:flex-row"}`}>

          {/* Left column: timer + current/next exercise */}
          <div className={`flex flex-col gap-4 ${isFullscreen ? "w-full" : "w-full lg:w-1/3"}`}>
            <div className="flex flex-col sm:flex-row-reverse lg:flex-col gap-4">

              {/* Timer card */}
              <div className={`bg-white rounded-2xl border shadow-sm text-center flex flex-col justify-between relative p-5 min-h-[160px] ${
                isRest ? "border-hotPink/30" : "border-gray-100"
              } ${isFullscreen ? "w-full" : "w-full sm:w-1/2 lg:w-full"}`}>
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

                {/* Phase label */}
                <p className={`text-xs font-titillium font-bold uppercase tracking-wide mb-1 ${isRest ? "text-hotPink" : "text-limeGreen"}`}>
                  {isRest ? "Rest" : "Work"}
                </p>

                <div className="flex-1 flex flex-col justify-center">
                  {!isActive && !isPaused && !isPreparationCountdown && isFirstBlockAndSet && !hasStartedOnce ? (
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
                    <div className={`text-5xl lg:text-6xl font-bold mb-1 ${isRest ? "text-hotPink" : "text-limeGreen"}`}>
                      {formatTime(time)}
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-2">
                  {(!isActive && !isPreparationCountdown) || isPaused ? (
                    <button onClick={startTimer} className="px-4 py-2 text-sm font-titillium font-bold bg-limeGreen text-black rounded-xl hover:bg-limeGreen/80 transition-colors">
                      {isPaused ? "Resume" : "Start"}
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
                    {hasResetOnce ? "Reset All" : isRest ? "Reset Rest" : "Reset Work"}
                  </button>
                  {isAdmin && isActive && (
                    <button onClick={skipCurrent} className="px-4 py-2 text-sm font-titillium font-semibold bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                      Next
                    </button>
                  )}
                </div>
              </div>

              {/* Current / Next exercise card */}
              <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center ${isFullscreen ? "w-full" : "w-full sm:w-1/2 lg:w-full"}`}>
                {isRest ? (
                  <>
                    <p className="text-xs font-titillium font-bold text-hotPink uppercase tracking-wide mb-2">Next Up</p>
                    {(() => {
                      const nextInfo = getNextExerciseInfo();
                      if (!nextInfo) return null;
                      if (nextInfo.type === "single") {
                        return (
                          <>
                            <p className="text-base font-bold text-customGray font-titillium">
                              {getExerciseName(nextInfo.exercise, nextInfo.exerciseIndex)}
                            </p>
                            {nextInfo.blockNumber && (
                              <p className="text-xs text-customGray/50 font-titillium mt-1">Block {nextInfo.blockNumber}</p>
                            )}
                          </>
                        );
                      } else if (nextInfo.type === "nextBlock") {
                        return (
                          <>
                            <p className="text-xs text-customGray/50 font-titillium mb-1">Block {nextInfo.blockNumber}</p>
                            <p className="text-base font-bold text-customGray font-titillium">
                              {getExerciseName(nextInfo.exercises[0], 0)} &amp; {getExerciseName(nextInfo.exercises[1], 1)}
                            </p>
                          </>
                        );
                      }
                    })()}
                  </>
                ) : (
                  <>
                    <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-2">Current Exercise</p>
                    {currentExercise && (
                      <>
                        <p className="text-base font-bold text-customGray font-titillium mb-3">
                          {getExerciseName(currentExercise, currentExerciseIndex)}
                        </p>
                        {currentExercise.exercise?.modification && (() => {
                          const { standardText, modifiedText } = getToggleButtonText(currentExercise);
                          return (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => setShowModified((prev) => ({ ...prev, [currentExerciseIndex]: false }))}
                                className={`text-xs px-2 py-1 rounded-lg border font-titillium transition-colors ${
                                  !showModified[currentExerciseIndex]
                                    ? "border-limeGreen bg-limeGreen text-black"
                                    : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                                }`}
                              >
                                {standardText}
                              </button>
                              <button
                                onClick={() => setShowModified((prev) => ({ ...prev, [currentExerciseIndex]: true }))}
                                className={`text-xs px-2 py-1 rounded-lg border font-titillium transition-colors ${
                                  showModified[currentExerciseIndex]
                                    ? "border-limeGreen bg-limeGreen text-black"
                                    : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                                }`}
                              >
                                {modifiedText}
                              </button>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Tips & instructions — desktop */}
            {!isFullscreen && (
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
            )}
          </div>

          {/* Right column: exercise list + video */}
          {!isFullscreen && (
            <div className="w-full lg:w-2/3 flex flex-col gap-3">

              {/* Exercise list */}
              <div className="space-y-2">
                {allTabataBlocks?.[currentBlockIndex]?.exercises?.map((exercise, index) => (
                  <div
                    key={exercise.id || index}
                    onClick={() => setCurrentExerciseIndex(index)}
                    className={`p-3 rounded-xl text-sm transition-colors duration-200 cursor-pointer border ${
                      index === currentExerciseIndex
                        ? "bg-gray-50 border-limeGreen/40 shadow-sm"
                        : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {index === currentExerciseIndex && !isRest && (
                          <span className="w-1.5 h-1.5 rounded-full bg-limeGreen shrink-0" />
                        )}
                        <span className="font-bold text-customGray font-titillium">
                          {getExerciseName(exercise, index)}
                        </span>
                        {exercise.exercise.modification && (
                          <span className="text-xs text-brightYellow">*</span>
                        )}
                      </div>

                      {exercise.exercise.modification && (() => {
                        const { standardText, modifiedText } = getToggleButtonText(exercise);
                        return (
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowModified((prev) => ({ ...prev, [index]: false })); }}
                              className={`text-xs px-2 py-1 rounded-lg border font-titillium transition-colors ${
                                !showModified[index]
                                  ? "border-limeGreen bg-limeGreen text-black"
                                  : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                              }`}
                            >
                              {standardText}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowModified((prev) => ({ ...prev, [index]: true })); }}
                              className={`text-xs px-2 py-1 rounded-lg border font-titillium transition-colors ${
                                showModified[index]
                                  ? "border-limeGreen bg-limeGreen text-black"
                                  : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                              }`}
                            >
                              {modifiedText}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Video */}
              {currentExercise && !isRest && (
                <div className="relative w-full pb-[70%] md:pb-[75%] overflow-hidden rounded-2xl border border-gray-100">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <ExerciseVideo
                      exercise={currentExercise}
                      isActive={true}
                      shouldAutoStart={false}
                      showModified={showModified[currentExerciseIndex] || false}
                    />
                  </div>
                </div>
              )}

              {/* Rest period placeholder */}
              {isRest && (
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
                  <div className="text-5xl mb-3">🧘</div>
                  <h3 className="text-lg font-bold text-hotPink font-titillium mb-1">Rest Period</h3>
                  <p className="text-sm text-customGray/60 font-titillium">Get ready for the next exercise</p>
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

          {/* Fullscreen layout */}
          {isFullscreen && (
            <div className="w-full flex flex-col flex-1 gap-3 sm:gap-4">
              {/* Block / set progress */}
              <div className="shrink-0 text-center">
                <h2 className="text-customGray text-xl sm:text-2xl md:text-3xl font-titillium font-semibold">
                  Block <span className="text-brightYellow">{currentBlockIndex + 1}</span> of <span className="text-brightYellow">{totalBlocks}</span>
                  <span className="text-customGray/30 mx-2">·</span>
                  Set <span className="text-limeGreen">{currentSet}</span> of <span className="text-limeGreen">{setsPerBlock}</span>
                </h2>
                <div className="flex justify-center gap-1.5 mt-2">
                  {Array.from({ length: setsPerBlock }, (_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      i < currentSet - 1 ? "bg-limeGreen" : i === currentSet - 1 ? (isRest ? "bg-hotPink" : "bg-limeGreen") : "bg-gray-200"
                    }`} />
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div className="shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm text-center relative p-4 sm:p-5">
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-2 right-2 text-customGray/30 hover:text-customGray transition-colors p-2 rounded-lg hover:bg-gray-50 z-10"
                  title="Exit Fullscreen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <p className={`text-xs font-titillium font-bold uppercase tracking-wide mb-2 ${isRest ? "text-hotPink" : "text-limeGreen"}`}>
                  {isRest ? "Rest" : "Work"}
                </p>
                {!isActive && !isPaused && !isPreparationCountdown && isFirstBlockAndSet && !hasStartedOnce ? (
                  <div className="text-center mb-3">
                    <div className="text-brightYellow text-6xl sm:text-7xl md:text-8xl lg:text-9xl">5</div>
                    <div className="text-brightYellow font-semibold text-lg mt-1">Get Ready!</div>
                    <p className="text-customGray/50 text-sm font-titillium">Click START for a 5-second countdown</p>
                  </div>
                ) : isPreparationCountdown ? (
                  <div className="text-center mb-3">
                    <div className="text-brightYellow animate-pulse text-6xl sm:text-7xl md:text-8xl lg:text-9xl">{preparationTime}</div>
                    <div className="text-brightYellow font-semibold text-lg mt-1">Get Ready!</div>
                    <span className="text-brightYellow font-semibold text-sm animate-bounce">🏃‍♀️ Get in position!</span>
                  </div>
                ) : (
                  <div className={`mb-3 font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl ${isRest ? "text-hotPink" : "text-limeGreen"}`}>
                    {formatTime(time)}
                  </div>
                )}
                <div className="flex justify-center gap-2 sm:gap-4">
                  {(!isActive && !isPreparationCountdown) || isPaused ? (
                    <button onClick={startTimer} className="px-6 py-3 text-sm font-titillium font-bold bg-limeGreen text-black rounded-xl hover:bg-limeGreen/80 transition-colors">
                      {isPaused ? "Resume" : "Start"}
                    </button>
                  ) : isPreparationCountdown ? (
                    <button disabled className="px-6 py-3 text-sm font-titillium font-bold bg-brightYellow/50 text-black rounded-xl cursor-not-allowed">
                      Get Ready...
                    </button>
                  ) : (
                    <button onClick={pauseTimer} className="px-6 py-3 text-sm font-titillium font-bold bg-hotPink text-black rounded-xl hover:bg-hotPink/80 transition-colors">
                      Pause
                    </button>
                  )}
                  <button onClick={resetTimer} className="px-6 py-3 text-sm font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors">
                    {hasResetOnce ? "Reset All" : isRest ? "Reset Rest" : "Reset Work"}
                  </button>
                  {isAdmin && isActive && (
                    <button onClick={skipCurrent} className="px-6 py-3 text-sm font-titillium font-semibold bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                      Next
                    </button>
                  )}
                </div>
              </div>

              {/* Current / Next exercise */}
              <div className="shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 text-center">
                {isRest ? (
                  <>
                    <p className="text-xs font-titillium font-bold text-hotPink uppercase tracking-wide mb-2">Next Up</p>
                    {(() => {
                      const nextInfo = getNextExerciseInfo();
                      if (!nextInfo) return null;
                      if (nextInfo.type === "single") {
                        return (
                          <>
                            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-customGray font-titillium">
                              {getExerciseName(nextInfo.exercise, nextInfo.exerciseIndex)}
                            </p>
                            {nextInfo.blockNumber && (
                              <p className="text-sm text-customGray/50 font-titillium mt-1">Block {nextInfo.blockNumber}</p>
                            )}
                          </>
                        );
                      } else if (nextInfo.type === "nextBlock") {
                        return (
                          <>
                            <p className="text-sm text-customGray/50 font-titillium mb-1">Block {nextInfo.blockNumber}</p>
                            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-customGray font-titillium">
                              {getExerciseName(nextInfo.exercises[0], 0)} &amp; {getExerciseName(nextInfo.exercises[1], 1)}
                            </p>
                          </>
                        );
                      }
                    })()}
                  </>
                ) : (
                  <>
                    <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-2">Current Exercise</p>
                    {currentExercise && (
                      <>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-customGray font-titillium mb-3">
                          {getExerciseName(currentExercise, currentExerciseIndex)}
                        </p>
                        {currentExercise.exercise?.modification && (() => {
                          const { standardText, modifiedText } = getToggleButtonText(currentExercise);
                          return (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => setShowModified((prev) => ({ ...prev, [currentExerciseIndex]: false }))}
                                className={`text-xs px-3 py-1.5 rounded-lg border font-titillium transition-colors ${
                                  !showModified[currentExerciseIndex]
                                    ? "border-limeGreen bg-limeGreen text-black"
                                    : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                                }`}
                              >
                                {standardText}
                              </button>
                              <button
                                onClick={() => setShowModified((prev) => ({ ...prev, [currentExerciseIndex]: true }))}
                                className={`text-xs px-3 py-1.5 rounded-lg border font-titillium transition-colors ${
                                  showModified[currentExerciseIndex]
                                    ? "border-limeGreen bg-limeGreen text-black"
                                    : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                                }`}
                              >
                                {modifiedText}
                              </button>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Exercise list for fullscreen */}
              <div className="flex-1 min-h-0 overflow-hidden">
                {isRest ? (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full overflow-y-auto">
                    {(() => {
                      const nextInfo = getNextExerciseInfo();
                      if (nextInfo?.type === "nextBlock") {
                        return (
                          <>
                            <p className="text-xs font-titillium font-bold text-customGray/50 uppercase tracking-wide mb-3">
                              Block {nextInfo.blockNumber} Exercises
                            </p>
                            <div className="space-y-2">
                              {nextInfo.exercises.map((exercise, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                                  <span className="font-semibold font-titillium text-customGray">
                                    {getExerciseName(exercise, index)}
                                  </span>
                                  {exercise.exercise.modification && (
                                    <span className="text-brightYellow text-xs ml-1">*</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      }
                      return (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="text-4xl mb-3">💪</div>
                            <h3 className="text-lg font-bold text-customGray font-titillium mb-1">Rest Time</h3>
                            <p className="text-sm text-customGray/60 font-titillium">Get ready for the next exercise</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full overflow-y-auto">
                    <p className="text-xs font-titillium font-bold text-customGray/50 uppercase tracking-wide mb-3">Current Block</p>
                    <div className="space-y-2">
                      {allTabataBlocks?.[currentBlockIndex]?.exercises?.map((exercise, index) => (
                        <div
                          key={exercise.id || index}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-colors duration-200 ${
                            index === currentExerciseIndex
                              ? "bg-gray-50 border-limeGreen/40"
                              : "bg-white border-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {index === currentExerciseIndex && (
                              <span className="w-1.5 h-1.5 rounded-full bg-limeGreen shrink-0" />
                            )}
                            <span className="font-semibold font-titillium text-customGray text-sm sm:text-base md:text-lg">
                              {getExerciseName(exercise, index)}
                            </span>
                            {exercise.exercise.modification && (
                              <span className="text-brightYellow text-xs">*</span>
                            )}
                          </div>
                          {exercise.exercise.modification && (() => {
                            const { standardText, modifiedText } = getToggleButtonText(exercise);
                            return (
                              <div className="flex gap-1 shrink-0">
                                <button
                                  onClick={() => setShowModified((prev) => ({ ...prev, [index]: false }))}
                                  className={`text-xs px-2 py-1 rounded-lg border font-titillium transition-colors ${
                                    !showModified[index]
                                      ? "border-limeGreen bg-limeGreen text-black"
                                      : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                                  }`}
                                >
                                  {standardText}
                                </button>
                                <button
                                  onClick={() => setShowModified((prev) => ({ ...prev, [index]: true }))}
                                  className={`text-xs px-2 py-1 rounded-lg border font-titillium transition-colors ${
                                    showModified[index]
                                      ? "border-limeGreen bg-limeGreen text-black"
                                      : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                                  }`}
                                >
                                  {modifiedText}
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
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

TabataWorkout.propTypes = {
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
  allTabataBlocks: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  shouldAutoStart: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

export default TabataWorkout;
