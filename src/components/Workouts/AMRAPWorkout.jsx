import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import AudioControl from "../../components/Shared/AudioControl";
import useWorkoutAudio from "../../hooks/useWorkoutAudio";
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
  const intervalRef = useRef(null);
  const {
    audioEnabled,
    toggleAudio,
    playWhistle,
    playSound,
    soundTypes,
    selectedSound,
    setSelectedSound,
  } = useWorkoutAudio();

  // Extract duration from block notes or description
  const extractDuration = () => {
    const notes = workoutBlock.blockNotes || "";
    // Try to match various time formats: "12 minutes", "15 min", "20 minutes total", "8 min work"
    let match = notes.match(/(\d+)\s*(?:minutes?|mins?)\s*(?:total|work)?/i);
    if (!match) {
      // Try to match "2 x 8 min work" format
      match = notes.match(/\d+\s*x\s*(\d+)\s*min/i);
    }
    return match ? parseInt(match[1]) * 60 : 720; // Default to 12 minutes if not found
  };

  const totalDuration = extractDuration();
  const hasMultipleAMRAPRounds = (workoutBlock.blockRounds || 1) > 1;
  const totalAMRAPRounds = workoutBlock.blockRounds || 1;
  const hasRoundRest = workoutBlock.roundRest && workoutBlock.roundRest !== "";

  // Helper to parse round rest duration
  const parseRoundRestDuration = () => {
    if (!hasRoundRest || !workoutBlock.roundRest) return 0;
    const match = workoutBlock.roundRest.match(/(\d+)/);
    return match ? parseInt(match[1]) : 120; // Default to 2 minutes
  };

  useEffect(() => {
    if (isRoundRest) {
      setTime(parseRoundRestDuration());
    } else {
      setTime(totalDuration);
    }
    // Only auto-start if explicitly requested and not in a choice scenario
    if (shouldAutoStart && !isRoundRest && !canGoBack) {
      setIsActive(true);
    }
  }, [totalDuration, shouldAutoStart, isRoundRest, canGoBack]);

  // Timer effect
  useEffect(() => {
    if (isActive && !isPaused && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          // Play whistle sound for last 3 seconds
          if (prev <= 3 && prev > 0) {
            playWhistle();
          }

          if (prev <= 1) {
            clearInterval(intervalRef.current);
            if (isRoundRest) {
              // Finished round rest, start next AMRAP round
              setIsRoundRest(false);
              setCurrentAMRAPRound(currentAMRAPRound + 1);
              setRoundsCompleted(0); // Reset rounds for new AMRAP session
              setTime(totalDuration);
              setIsActive(true);
            } else if (
              hasMultipleAMRAPRounds &&
              currentAMRAPRound < totalAMRAPRounds
            ) {
              // Finished AMRAP round, start rest period
              if (hasRoundRest) {
                setIsRoundRest(true);
                setTime(parseRoundRestDuration());
                setIsActive(true);
              } else {
                setCurrentAMRAPRound(currentAMRAPRound + 1);
                setRoundsCompleted(0);
                setTime(totalDuration);
                setIsActive(false); // Let user start next round manually
              }
            } else {
              // All AMRAP rounds complete
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
    playWhistle,
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

  const incrementRounds = () => {
    setRoundsCompleted((prev) => prev + 1);
  };

  const decrementRounds = () => {
    setRoundsCompleted((prev) => Math.max(0, prev - 1));
  };

  const handleComplete = () => {
    clearInterval(intervalRef.current);
    setIsComplete(false); // Reset completion state
    onComplete();
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
        <div className="bg-customGray p-6 rounded-lg text-center max-w-2xl w-full border-brightYellow border-2">
          <div className="text-6xl mb-6">⏰</div>
          <DynamicHeading
            text="AMRAP Complete!"
            className="font-higherJump text-3xl font-bold text-customWhite mb-8 leading-loose md:leading-normal"
          />
          <p className="text-lg text-logoGray m-4">
            {hasMultipleAMRAPRounds
              ? `All ${totalAMRAPRounds} AMRAP rounds complete!`
              : `Time's up! You completed ${roundsCompleted} rounds.`}
          </p>
          <div className="space-y-4">
            <button
              onClick={handleComplete}
              className="btn-full-colour md:mr-4"
            >
              Continue Workout
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
      <div className="bg-customGray p-4 rounded-lg text-center max-w-6xl w-full h-full lg:max-h-[140vh] flex flex-col border-brightYellow border-2 mt-20 md:mt-26">
        <div className="flex justify-between items-center">
          <AudioControl
            audioEnabled={audioEnabled}
            onToggle={toggleAudio}
            soundTypes={soundTypes}
            selectedSound={selectedSound}
            onSoundChange={setSelectedSound}
            onTestSound={playSound}
            className="mt-0"
          />
          {canGoBack && (
            <button onClick={onGoBack} className="btn-cancel mt-0">
              Back to Overview
            </button>
          )}
        </div>
        {/* Header */}
        <div className="flex flex-col mt-4 mb-4 items-center">
          <DynamicHeading
            text={title}
            className="font-higherJump mb-4 text-xl md:text-3xl font-bold text-customWhite text-center leading-loose tracking-widest"
          />
          <div className="flex flex-col md:flex-row gap-0 md:gap-2 w-full items-center">
            {/* Description */}
            <div className="flex items-center justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center">
              <p className="text-logoGray text-sm whitespace-pre-line break-words leading-loose">
                <span className="text-limeGreen font-bold">Description:</span>{" "}
                {description}
              </p>
            </div>

            {/* Instructions */}
            <div className="flex items-center justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center">
              <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                <span className="text-limeGreen font-bold">Instructions:</span>{" "}
                Complete all exercises in order for 1 round. Click exercises to
                view videos.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col lg:flex-row gap-6 p-4">
          {/* Left Column: Timer and Round Counter */}
          <div className="w-full lg:w-1/3 flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row-reverse lg:flex-col gap-4">
              {/* Timer */}
              <div className="w-full sm:w-1/2 lg:w-full bg-gray-600 rounded-lg p-4 lg:p-6 text-center">
                <div
                  className={`text-4xl sm:text-5xl lg:text-6xl mb-2 lg:mb-4 ${
                    isRoundRest ? "text-hotPink" : "text-limeGreen"
                  }`}
                >
                  {formatTime(time)}
                </div>
                <div className="text-sm lg:text-base text-customWhite mb-2">
                  {isRoundRest ? "Round Rest" : "AMRAP Timer"}
                </div>
                {/* Timer Controls */}
                <div className="flex justify-center space-x-1 lg:space-x-2">
                  {!isActive || isPaused ? (
                    <button
                      onClick={startTimer}
                      className="btn-full-colour text-xs lg:text-sm px-2 lg:px-4 py-1 lg:py-2"
                    >
                      {isPaused ? "Resume" : "Start"}
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="btn-subscribe text-xs lg:text-sm px-2 lg:px-4 py-1 lg:py-2"
                    >
                      Pause
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="btn-cancel text-xs lg:text-sm px-2 lg:px-4 py-1 lg:py-2"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Round Counter */}
              <div className="bg-gray-600 w-full sm:w-1/2 lg:w-full rounded-lg p-4 lg:p-6 text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl text-brightYellow mb-2 lg:mb-4">
                  {roundsCompleted}
                </div>
                <div className="text-sm lg:text-base text-customWhite mb-2">
                  Rounds Completed
                </div>
                <div className="flex justify-center space-x-1 lg:space-x-2">
                  <button
                    onClick={decrementRounds}
                    className="btn-cancel text-xs lg:text-sm px-2 lg:px-4 py-1 lg:py-2"
                    disabled={roundsCompleted === 0}
                  >
                    -1
                  </button>
                  <button
                    onClick={incrementRounds}
                    className="btn-full-colour text-xs lg:text-sm px-2 lg:px-4 py-1 lg:py-2"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>
            {/* Exercise Details - Hidden on mobile, shown on desktop */}
            <div className="mt-2 space-y-2 hidden lg:block">
              {/* Show day-specific tips first, then exercise tips */}
              {(workoutBlock.exercises[selectedExerciseIndex]?.tips ||
                workoutBlock.exercises[selectedExerciseIndex]?.exercise
                  ?.tips) && (
                <div className="bg-gray-600 rounded-lg p-3">
                  <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
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
                  <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
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

          {/* Right Column: Exercise Table and Video */}
          <div className="w-full lg:w-2/3">
            <div className="bg-gray-600 rounded-lg p-4 mb-4">
              {/* Exercise List */}
              <div className="space-y-2">
                {workoutBlock.exercises.map((exercise, index) => (
                  <div
                    key={exercise.id || index}
                    onClick={() => setSelectedExerciseIndex(index)}
                    className={`cursor-pointer transition-colors rounded-lg p-3 ${
                      selectedExerciseIndex === index
                        ? "bg-limeGreen text-black"
                        : "hover:bg-gray-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold">
                          {exercise.exercise.name}
                        </div>
                        {exercise.tips && (
                          <div className="text-xs mt-1 opacity-75">
                            {exercise.tips}
                          </div>
                        )}
                        {/* Show modification toggle on mobile */}
                        {exercise.exercise.modification && (
                          <div className="sm:hidden mt-2 flex space-x-1">
                            {(() => {
                              const { standardText, modifiedText } = getToggleButtonText(exercise);
                              return (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowModified(prev => ({ ...prev, [index]: false }));
                                    }}
                                    className={`text-xs px-2 py-1 rounded ${
                                      !showModified[index]
                                        ? "bg-black text-limeGreen"
                                        : "bg-gray-400 text-black"
                                    }`}
                                  >
                                    {standardText}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowModified(prev => ({ ...prev, [index]: true }));
                                    }}
                                    className={`text-xs px-2 py-1 rounded ${
                                      showModified[index]
                                        ? "bg-black text-limeGreen"
                                        : "bg-gray-400 text-black"
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
                      
                      {/* Desktop modification toggle */}
                      <div className="hidden sm:flex items-center space-x-2">
                        {exercise.exercise.modification ? (
                          <div className="flex space-x-1">
                            {(() => {
                              const { standardText, modifiedText } = getToggleButtonText(exercise);
                              return (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowModified(prev => ({ ...prev, [index]: false }));
                                    }}
                                    className={`text-xs px-2 py-1 rounded ${
                                      !showModified[index]
                                        ? selectedExerciseIndex === index
                                          ? "bg-black text-limeGreen"
                                          : "bg-limeGreen text-black"
                                        : "bg-gray-400 text-black"
                                    }`}
                                  >
                                    {standardText}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowModified(prev => ({ ...prev, [index]: true }));
                                    }}
                                    className={`text-xs px-2 py-1 rounded ${
                                      showModified[index]
                                        ? selectedExerciseIndex === index
                                          ? "bg-black text-limeGreen"
                                          : "bg-limeGreen text-black"
                                        : "bg-gray-400 text-black"
                                    }`}
                                  >
                                    {modifiedText}
                                  </button>
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                      
                      {/* Reps */}
                      <div className="font-bold text-right ml-4">
                        {exercise.reps}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video */}
            <div className="pt-4">
              <div className="relative w-full pb-[56.25%] sm:pb-[45%] lg:pb-[40%] overflow-hidden rounded-lg">
                <div className="absolute top-0 left-0 w-full h-full">
                  <ExerciseVideo
                    exercise={workoutBlock.exercises[selectedExerciseIndex]}
                    isActive={true}
                    shouldAutoStart={false}
                    showModified={showModified[selectedExerciseIndex] || false}
                  />
                </div>
              </div>
            </div>

            {/* Exercise Details - Shown on mobile below video, hidden on desktop */}
            <div className="mt-4 space-y-2 lg:hidden">
              {/* Show day-specific tips first, then exercise tips */}
              {(workoutBlock.exercises[selectedExerciseIndex]?.tips ||
                workoutBlock.exercises[selectedExerciseIndex]?.exercise
                  ?.tips) && (
                <div className="bg-gray-600 rounded-lg p-3">
                  <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
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
                  <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
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
};

export default AMRAPWorkout;
