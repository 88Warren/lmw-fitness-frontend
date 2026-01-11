import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import AudioControl from "../../components/Shared/AudioControl";
import useWorkoutAudio from "../../hooks/useWorkoutAudio";
import useWorkoutFullscreen from "../../hooks/useWorkoutFullscreen";
import DynamicHeading from "../Shared/DynamicHeading";
import { getToggleButtonText } from "../../utils/exerciseUtils";

const AMRAPWorkout = ({
  workoutBlock,
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
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentAMRAPRound, setCurrentAMRAPRound] = useState(1);
  const [isRoundRest, setIsRoundRest] = useState(false);
  const [showModified, setShowModified] = useState({});
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

  const extractDuration = () => {
    const notes = workoutBlock.blockNotes || "";
    let match = notes.match(/(\d+)\s*(?:minutes?|mins?)\s*(?:total|work)?/i);
    if (!match) {
      match = notes.match(/\d+\s*x\s*(\d+)\s*min/i);
    }
    return match ? parseInt(match[1]) * 60 : 720;
  };

  const totalDuration = extractDuration();
  const hasMultipleAMRAPRounds = (workoutBlock.blockRounds || 1) > 1;
  const totalAMRAPRounds = workoutBlock.blockRounds || 1;
  const hasRoundRest = workoutBlock.roundRest && workoutBlock.roundRest !== "";

  const parseRoundRestDuration = () => {
    if (!hasRoundRest || !workoutBlock.roundRest) return 0;
    const match = workoutBlock.roundRest.match(/(\d+)/);
    return match ? parseInt(match[1]) : 120;
  };

  useEffect(() => {
    if (isRoundRest) {
      setTime(parseRoundRestDuration());
    } else {
      setTime(totalDuration);
    }
    if (shouldAutoStart && !isRoundRest && !canGoBack) {
      setIsActive(true);
    }
  }, [totalDuration, shouldAutoStart, isRoundRest, canGoBack]);

  useEffect(() => {
    if (isActive && !isPaused && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 5 && prev > 0) {
            playBeep();
          }

          // Play start sound when transitioning from rest to work (or at very start)
          if (prev === 1 && (isRoundRest || currentAMRAPRound === 1)) {
            setTimeout(() => playStartSound(), 1000); // Play start sound when rest ends and work begins
          }

          if (prev <= 1) {
            clearInterval(intervalRef.current);
            if (isRoundRest) {
              setIsRoundRest(false);
              setCurrentAMRAPRound(currentAMRAPRound + 1);
              setRoundsCompleted(0);
              setTime(totalDuration);
              setIsActive(true);
            } else if (
              hasMultipleAMRAPRounds &&
              currentAMRAPRound < totalAMRAPRounds
            ) {
              if (hasRoundRest) {
                setIsRoundRest(true);
                setTime(parseRoundRestDuration());
                setIsActive(true);
              } else {
                setCurrentAMRAPRound(currentAMRAPRound + 1);
                setRoundsCompleted(0);
                setTime(totalDuration);
                setIsActive(false);
              }
            } else {
              setIsComplete(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [
    isActive,
    isPaused,
    time,
    isRoundRest,
    hasMultipleAMRAPRounds,
    currentAMRAPRound,
    totalAMRAPRounds,
    hasRoundRest,
    totalDuration,
    playBeep,
  ]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTime(totalDuration);
    setIsActive(false);
    setIsPaused(false);
    setRoundsCompleted(0);
    setIsComplete(false);
    setCurrentAMRAPRound(1);
    setIsRoundRest(false);
  };

  const skipToEnd = () => {
    if (!isAdmin) return;

    clearInterval(intervalRef.current);
    setTime(0);
    setIsActive(false);
    setIsComplete(true);
  };

  const incrementRounds = () => {
    setRoundsCompleted((prev) => prev + 1);
  };

  const decrementRounds = () => {
    setRoundsCompleted((prev) => Math.max(0, prev - 1));
  };

  const handleComplete = () => {
    clearInterval(intervalRef.current);
    setIsComplete(false);
    onComplete();
  };



  const getExerciseName = (exercise, exerciseIndex) => {
    if (!exercise?.exercise) return "";

    const isModified = showModified[exerciseIndex] || false;
    if (isModified && exercise.exercise.modification) {
      return exercise.exercise.modification.name;
    }
    return exercise.exercise.name;
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-b from-customGray/30 to-white">
        <div className="bg-customGray p-6 rounded-lg text-center max-w-2xl w-full border-brightYellow border-2">
          <div className="text-6xl mb-6">⏰</div>
          <DynamicHeading
            text="AMRAP Complete!"
            className="font-higherJump text-2xl md:text-3xl font-bold text-customWhite mb-8 leading-loose md:leading-normal"
          />
          <p className="text-lg text-logoGray mt-6 mb-2">
            {hasMultipleAMRAPRounds
              ? `All ${totalAMRAPRounds} AMRAP rounds complete!`
              : `Time's up! You completed ${roundsCompleted} rounds.`}
          </p>
          <div className="space-y-4">
            <button
              onClick={handleComplete}
              className="btn-full-colour sm:mr-4"
            >
              Back to Program
            </button>
            <button onClick={resetTimer} className="btn-cancel mt-0 md:mt-6">
              Restart AMRAP
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
            : "p-4 max-w-6xl h-full lg:max-h-[140vh] mt-20 md:mt-26"
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
              <button onClick={onGoBack} className="btn-cancel mt-0 self-end">
                Back to Overview
              </button>
            )}
          </div>
        )}
        {/* Audio controls for larger screens in fullscreen */}
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
        {/* Header */}
        {!isFullscreen && (
          <div className="flex flex-col mt-4 mb-4 items-center">
            <DynamicHeading
              text={title}
              className="font-higherJump mb-4 text-xl md:text-3xl font-bold text-customWhite text-center leading-loose tracking-widest"
            />
            <div className="flex flex-col md:flex-row gap-0 md:gap-2 w-full items-center md:items-stretch">
              {/* Description */}
              <div className="flex items-start justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center">
                <p className="text-logoGray text-sm whitespace-pre-line wrap-break-word leading-loose">
                  <span className="text-limeGreen font-bold">Description:</span>{" "}
                  {description}
                </p>
              </div>

              {/* Instructions */}
              <div className="flex items-start justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center">
                <p className="text-sm text-logoGray whitespace-pre-line wrap-break-word leading-loose">
                  <span className="text-limeGreen font-bold">
                    Instructions:
                  </span>{" "}
                  Complete all exercises in order for 1 round. Click exercises
                  to view videos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div
          className={`grow flex ${
            isFullscreen
              ? "flex-col items-center justify-start gap-2 p-2 sm:gap-4 sm:p-4 h-full"
              : "flex-col lg:flex-row gap-6 p-4"
          }`}
        >
          {/* Left Column: Timer and Round Counter - Only show when NOT fullscreen */}
          {!isFullscreen && (
            <div className="flex flex-col w-full lg:w-1/3 space-y-4">
              <div className="flex flex-col sm:flex-row-reverse lg:flex-col gap-4">
                {/* Timer */}
                <div
                  className={`w-full sm:w-1/2 lg:w-full bg-gray-600 rounded-lg text-center flex flex-col justify-between relative ${
                    isFullscreen
                      ? "p-2 sm:p-3 lg:p-4 min-h-[100px] sm:min-h-[120px]"
                      : "p-4 lg:p-6 min-h-[150px]"
                  }`}
                >
                  {/* Fullscreen Toggle Button - Inside timer card */}
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-2 right-2 text-customWhite hover:text-brightYellow transition-colors p-2 rounded-lg hover:bg-gray-700 z-10"
                    title={
                      isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"
                    }
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
                  <div className="flex-1 flex flex-col justify-center">
                    <div
                      className={`mb-2 lg:mb-4 text-limeGreen ${
                        isFullscreen
                          ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                          : "text-4xl sm:text-5xl lg:text-6xl"
                      }`}
                    >
                      {formatTime(time)}
                    </div>
                  </div>

                  {/* Timer Controls - Positioned at bottom */}
                  <div className="flex justify-center space-x-1 lg:space-x-2">
                    {!isActive || isPaused ? (
                      <button
                        onClick={startTimer}
                        className={`btn-full-colour mt-0 ${
                          isFullscreen
                            ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg"
                            : "text-sm px-4 py-2"
                        }`}
                      >
                        {isPaused ? "Resume" : "Start"}
                      </button>
                    ) : (
                      <button
                        onClick={pauseTimer}
                        className={`btn-subscribe mt-0 ${
                          isFullscreen
                            ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg"
                            : "text-sm px-4 py-2"
                        }`}
                      >
                        Pause
                      </button>
                    )}
                    <button
                      onClick={resetTimer}
                      className={`btn-cancel mt-0 ${
                        isFullscreen
                          ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg"
                          : "text-sm px-4 py-2"
                      }`}
                    >
                      Reset
                    </button>
                    {isAdmin && isActive && (
                      <button
                        onClick={skipToEnd}
                        className={`btn-skip mt-0 ${
                          isFullscreen
                            ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg"
                            : "text-sm px-4 py-2"
                        }`}
                      >
                        End
                      </button>
                    )}
                  </div>
                </div>

                {/* Round Counter */}
                <div
                  className={`bg-gray-600 w-full sm:w-1/2 lg:w-full rounded-lg text-center flex flex-col justify-between ${
                    isFullscreen
                      ? "p-2 sm:p-3 lg:p-4 min-h-[100px] sm:min-h-[120px]"
                      : "p-4 lg:p-6 min-h-[150px]"
                  }`}
                >
                  <div className="flex-1 flex flex-col justify-center">
                    <div
                      className={`text-brightYellow mb-2 lg:mb-4 ${
                        isFullscreen
                          ? "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                          : "text-4xl sm:text-5xl lg:text-6xl"
                      }`}
                    >
                      {roundsCompleted}
                    </div>
                    <div
                      className={`text-customWhite mb-2 ${
                        isFullscreen
                          ? "text-sm sm:text-base md:text-lg"
                          : "text-sm lg:text-base"
                      }`}
                    >
                      Rounds Completed
                    </div>
                  </div>

                  {/* Round Counter Controls - Positioned at bottom */}
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={decrementRounds}
                      className={`btn-cancel mt-0 ${
                        isFullscreen
                          ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg"
                          : "text-sm px-4 py-2"
                      }`}
                      disabled={roundsCompleted === 0}
                    >
                      -1
                    </button>
                    <button
                      onClick={incrementRounds}
                      className={`btn-full-colour mt-0 ${
                        isFullscreen
                          ? "px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg"
                          : "text-sm px-4 py-2"
                      }`}
                    >
                      +1
                    </button>
                  </div>
                </div>
              </div>
              {/* Exercise Details - Hidden on mobile, shown on desktop, hidden in fullscreen */}
              <div className="mt-2 space-y-2 hidden lg:block">
                {/* Show day-specific tips first, then exercise tips */}
                {(workoutBlock.exercises[selectedExerciseIndex]?.tips ||
                  workoutBlock.exercises[selectedExerciseIndex]?.exercise
                    ?.tips) && (
                  <div className="bg-gray-600 rounded-lg p-3">
                    <p className="text-sm text-logoGray whitespace-pre-line wrap-break-word leading-loose">
                      <span className="text-limeGreen font-bold">Tips:</span>{" "}
                      {workoutBlock.exercises[selectedExerciseIndex]?.tips ||
                        workoutBlock.exercises[selectedExerciseIndex]?.exercise
                          ?.tips}
                    </p>
                  </div>
                )}
                {/* Show day-specific instructions first, then exercise instructions */}
                {(workoutBlock.exercises[selectedExerciseIndex]?.instructions ||
                  workoutBlock.exercises[selectedExerciseIndex]?.exercise
                    ?.instructions) && (
                  <div className="bg-gray-600 rounded-lg p-3">
                    <p className="text-sm text-logoGray whitespace-pre-line wrap-break-word leading-loose">
                      <span className="text-limeGreen font-bold">
                        Instructions:
                      </span>{" "}
                      {workoutBlock.exercises[selectedExerciseIndex]
                        ?.instructions ||
                        workoutBlock.exercises[selectedExerciseIndex]?.exercise
                          ?.instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Column: Exercise Table and Video */}
          {!isFullscreen && (
            <div className="w-full lg:w-2/3">
              <div className="flex-1 space-y-2 overflow-y-auto mb-4">
                {workoutBlock.exercises.map((exercise, index) => (
                  <div
                    key={exercise.id || index}
                    onClick={() => setSelectedExerciseIndex(index)}
                    className={`p-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                      index === selectedExerciseIndex
                        ? "bg-gray-700 text-black"
                        : "text-logoGray hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-center sm:justify-between font-bold gap-2">
                      {/* Exercise name with tips and modified label */}
                      <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center">
                          <span className="text-customWhite text-left">
                            {getExerciseName(exercise, index)}
                          </span>
                          {/* Modified version label */}
                          {exercise.exercise.modification && (
                            <span
                              className={`text-xs align-center ml-1 text-brightYellow`}
                            >
                              *
                            </span>
                          )}
                        </div>
                        {/* Exercise tips for rep breakdown */}
                        {exercise.tips && (
                          <div className="text-xs text-logoGray italic mt-1">
                            {exercise.tips}
                          </div>
                        )}
                      </div>

                      {/* Pills container - all in one line for mobile, separate for desktop */}
                      <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start mt-2 md:mt-0">
                        {/* Mobile: All pills in one line */}
                        <div className="sm:hidden flex items-center space-x-1">
                          {/* Modification toggle for mobile */}
                          {exercise.exercise.modification && (
                            <>
                              {(() => {
                                const { standardText, modifiedText } =
                                  getToggleButtonText(exercise);
                                return (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowModified((prev) => ({
                                          ...prev,
                                          [index]: false,
                                        }));
                                      }}
                                      className={`text-xs px-2 py-1 rounded border ${
                                        selectedExerciseIndex === index
                                          ? !showModified[index]
                                            ? "border-limeGreen bg-limeGreen text-black"
                                            : "border-logoGray bg-logoGray text-black hover:bg-gray-400"
                                          : "border-gray-500"
                                      }`}
                                    >
                                      {standardText}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowModified((prev) => ({
                                          ...prev,
                                          [index]: true,
                                        }));
                                      }}
                                      className={`text-xs px-2 py-1 rounded border ${
                                        selectedExerciseIndex === index
                                          ? showModified[index]
                                            ? "border-limeGreen bg-limeGreen text-black"
                                            : "border-logoGray bg-logoGray text-black hover:bg-gray-400"
                                          : "border-gray-500"
                                      }`}
                                    >
                                      {modifiedText}
                                    </button>
                                  </>
                                );
                              })()}
                            </>
                          )}

                          {/* Reps badge for mobile */}
                          <div
                            className={`px-2 py-1 rounded text-xs border ${
                              index === selectedExerciseIndex
                                ? "bg-brightYellow text-black border-black"
                                : "bg-brightYellow text-black border-black"
                            }`}
                          >
                            Reps: {exercise.reps}
                          </div>
                        </div>

                        {/* Desktop: Separate modification toggle and reps badge */}
                        <div className="hidden sm:flex items-center space-x-1">
                          {exercise.exercise.modification && (
                            <div className="flex space-x-2">
                              {(() => {
                                const { standardText, modifiedText } =
                                  getToggleButtonText(exercise);
                                return (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowModified((prev) => ({
                                          ...prev,
                                          [index]: false,
                                        }));
                                      }}
                                      className={`text-sm px-2 py-1 rounded-lg border ${
                                        selectedExerciseIndex === index
                                          ? !showModified[index]
                                            ? "border-limeGreen bg-limeGreen text-black"
                                            : "border-logoGray bg-logoGray text-black hover:bg-gray-400"
                                          : "border-gray-500"
                                      }`}
                                    >
                                      {standardText}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowModified((prev) => ({
                                          ...prev,
                                          [index]: true,
                                        }));
                                      }}
                                      className={`px-2 py-1 rounded-lg text-sm border ${
                                        selectedExerciseIndex === index
                                          ? showModified[index]
                                            ? "border-limeGreen bg-limeGreen text-black"
                                            : "border-logoGray bg-logoGray text-black hover:bg-gray-400"
                                          : "border-gray-500"
                                      }`}
                                    >
                                      {modifiedText}
                                    </button>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Reps badge for desktop */}
                        <div
                          className={`hidden sm:block px-2 py-1 rounded-lg text-sm border ${
                            index === selectedExerciseIndex
                              ? "bg-brightYellow text-black border-black"
                              : "bg-brightYellow text-black border-black"
                          }`}
                        >
                          Reps: {exercise.reps}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Video */}
              <div className="pt-4">
                <div className="relative w-full pb-[100%] md:pb-[60%] lg:pb-[80%] overflow-hidden rounded-lg">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <ExerciseVideo
                      exercise={workoutBlock.exercises[selectedExerciseIndex]}
                      isActive={true}
                      shouldAutoStart={false}
                      showModified={
                        showModified[selectedExerciseIndex] || false
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Exercise Details - Shown on mobile below video, hidden on desktop and fullscreen */}
              {!isFullscreen && (
                <div className="mt-4 space-y-2 lg:hidden">
                  {/* Show day-specific tips first, then exercise tips */}
                  {(workoutBlock.exercises[selectedExerciseIndex]?.tips ||
                    workoutBlock.exercises[selectedExerciseIndex]?.exercise
                      ?.tips) && (
                    <div className="bg-gray-600 rounded-lg p-3">
                      <p className="text-sm text-logoGray whitespace-pre-line wrap-break-word leading-loose">
                        <span className="text-limeGreen font-bold">Tips:</span>{" "}
                        {workoutBlock.exercises[selectedExerciseIndex]?.tips ||
                          workoutBlock.exercises[selectedExerciseIndex]
                            ?.exercise?.tips}
                      </p>
                    </div>
                  )}
                  {/* Show day-specific instructions first, then exercise instructions */}
                  {(workoutBlock.exercises[selectedExerciseIndex]
                    ?.instructions ||
                    workoutBlock.exercises[selectedExerciseIndex]?.exercise
                      ?.instructions) && (
                    <div className="bg-gray-600 rounded-lg p-3">
                      <p className="text-sm text-logoGray whitespace-pre-line wrap-break-word leading-loose">
                        <span className="text-limeGreen font-bold">
                          Instructions:
                        </span>{" "}
                        {workoutBlock.exercises[selectedExerciseIndex]
                          ?.instructions ||
                          workoutBlock.exercises[selectedExerciseIndex]
                            ?.exercise?.instructions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Fullscreen Layout - Timer, Round Counter, Exercise List */}
          {isFullscreen && (
            <div className="w-full flex flex-col flex-1 space-y-4 sm:space-y-6 landscape:space-y-2">
              {/* Timer - First */}
              <div className="w-full bg-gray-600 rounded-lg text-center relative p-3 sm:p-4 md:p-5 landscape:p-2">
                {/* Fullscreen Toggle Button - Inside timer card */}
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-2 right-2 text-customWhite hover:text-brightYellow transition-colors p-2 rounded-lg hover:bg-gray-700 z-10"
                  title="Exit Fullscreen"
                >
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
                </button>
                <div className="mb-4 sm:mb-6 md:mb-8 landscape:mb-2 text-limeGreen text-5xl sm:text-6xl md:text-7xl lg:text-8xl landscape:text-4xl">
                  {formatTime(time)}
                </div>
                {/* Timer Controls */}
                <div className="flex justify-center space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8 landscape:space-x-2">
                  {!isActive || isPaused ? (
                    <button
                      onClick={startTimer}
                      className="btn-full-colour mt-0 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg landscape:px-2 landscape:py-1 landscape:text-xs"
                    >
                      {isPaused ? "Resume" : "Start"}
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="btn-subscribe mt-0 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg landscape:px-2 landscape:py-1 landscape:text-xs"
                    >
                      Pause
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="btn-cancel mt-0 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg landscape:px-2 landscape:py-1 landscape:text-xs"
                  >
                    Reset
                  </button>
                  {isAdmin && isActive && (
                    <button
                      onClick={skipToEnd}
                      className="btn-skip mt-0 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg landscape:px-2 landscape:py-1 landscape:text-xs"
                    >
                      End
                    </button>
                  )}
                </div>
              </div>

              {/* Round Counter - Second */}
              <div className="w-full bg-gray-600 rounded-lg text-center p-3 sm:p-4 md:p-5 landscape:p-2">
                <div className="mb-4 sm:mb-6 landscape:mb-2 text-brightYellow text-4xl sm:text-5xl md:text-6xl lg:text-7xl landscape:text-3xl">
                  {roundsCompleted}
                </div>
                <div className="text-customWhite mb-4 sm:mb-6 landscape:mb-2 text-lg sm:text-xl md:text-2xl landscape:text-base">
                  Rounds Completed
                </div>
                {/* Round Counter Controls */}
                <div className="flex justify-center space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8 landscape:space-x-2">
                  <button
                    onClick={decrementRounds}
                    className="btn-cancel mt-0 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg landscape:px-2 landscape:py-1 landscape:text-xs"
                    disabled={roundsCompleted === 0}
                  >
                    -1
                  </button>
                  <button
                    onClick={incrementRounds}
                    className="btn-full-colour mt-0 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base md:text-lg landscape:px-2 landscape:py-1 landscape:text-xs"
                  >
                    +1
                  </button>
                </div>
              </div>

              {/* Exercise List - Third */}
              <div className="flex-1 overflow-hidden landscape:h-[20vh] landscape:sm:h-[22vh] landscape:md:h-[24vh] landscape:lg:h-[26vh]">
                <div className="bg-gray-600 rounded-lg p-3 sm:p-4 md:p-5 landscape:p-2 h-full overflow-y-auto">
                  <div className="space-y-2 sm:space-y-3 landscape:space-y-1">
                    {workoutBlock.exercises.map((exercise, index) => (
                      <div
                        key={exercise.id || index}
                        className="flex items-center justify-between p-4 sm:p-6 landscape:p-2 rounded-lg bg-gray-700 text-customWhite"
                      >
                        <div className="flex-1">
                          <span className="font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl landscape:text-base">
                            {getExerciseName(exercise, index)}
                          </span>
                          {exercise.exercise.modification && (
                            <span className="text-lg sm:text-xl md:text-2xl landscape:text-base text-brightYellow ml-2">
                              *
                            </span>
                          )}
                          {exercise.tips && (
                            <div className="text-sm sm:text-base md:text-lg landscape:text-xs text-logoGray italic mt-1 sm:mt-2 landscape:mt-0">
                              {exercise.tips}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Modification toggle for fullscreen */}
                          {exercise.exercise.modification && (
                            <div className="flex space-x-1">
                              {(() => {
                                const { standardText, modifiedText } =
                                  getToggleButtonText(exercise);
                                return (
                                  <>
                                    <button
                                      onClick={() =>
                                        setShowModified((prev) => ({
                                          ...prev,
                                          [index]: false,
                                        }))
                                      }
                                      className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border ${
                                        !showModified[index]
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
                                          [index]: true,
                                        }))
                                      }
                                      className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border ${
                                        showModified[index]
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
                          {/* Reps badge */}
                          <div className="px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg bg-brightYellow text-black font-semibold">
                            Reps: {exercise.reps}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AMRAPWorkout.propTypes = {
  workoutBlock: PropTypes.shape({
    blockType: PropTypes.string.isRequired,
    blockNotes: PropTypes.string,
    blockRounds: PropTypes.number,
    roundRest: PropTypes.string,
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

export default AMRAPWorkout;
