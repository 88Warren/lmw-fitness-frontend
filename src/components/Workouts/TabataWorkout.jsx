import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import DynamicHeading from "../../components/Shared/DynamicHeading";
import AudioControl from "../../components/Shared/AudioControl";
import useWorkoutAudio from "../../hooks/useWorkoutAudio";

const TabataWorkout = ({
  workoutBlock,
  allTabataBlocks = [workoutBlock], // Accept multiple blocks for full Tabata session
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
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRest, setIsRest] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showModified, setShowModified] = useState(false);
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

  // Extract Tabata configuration from block notes
  const extractTabataConfig = () => {
    const currentBlock = allTabataBlocks[currentBlockIndex];
    const notes = currentBlock.blockNotes || "";

    // Default Tabata: 20s work, 10s rest, 8 sets per block
    let workTime = 20;
    let restTime = 10;
    let setsPerBlock = 8;

    // Try to extract work time (e.g., "20 seconds work", "30s work")
    let match = notes.match(/(\d+)\s*(?:seconds?|secs?|s)\s+work/i);
    if (match) workTime = parseInt(match[1]);

    // Try to extract rest time (e.g., "10 seconds rest", "15s rest")
    match = notes.match(/(\d+)\s*(?:seconds?|secs?|s)\s+rest/i);
    if (match) restTime = parseInt(match[1]);

    // Try to extract sets per block (e.g., "8 sets", "6 rounds")
    match = notes.match(/(\d+)\s+(?:sets?|rounds?)/i);
    if (match) setsPerBlock = parseInt(match[1]);

    return {
      workTime,
      restTime,
      setsPerBlock,
      totalBlocks: allTabataBlocks.length,
    };
  };

  const { workTime, restTime, setsPerBlock, totalBlocks } =
    extractTabataConfig();

  // Initialize timer based on current state
  useEffect(() => {
    if (isRest) {
      setTime(restTime);
    } else {
      setTime(workTime);
    }

    if (shouldAutoStart && !isRest) {
      setIsActive(true);
    }
  }, [workTime, restTime, shouldAutoStart, isRest]);

  // Main timer effect
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
  }, [isActive, isPaused, time, playWhistle]);

  const handleTimerComplete = () => {
    const currentBlock = allTabataBlocks[currentBlockIndex];

    console.log("Timer complete:", {
      isRest,
      currentSet,
      setsPerBlock,
      currentBlockIndex,
      totalBlocks,
      currentExerciseIndex,
    });

    if (isRest) {
      // Rest period complete, start next work period
      setIsRest(false);
      setTime(workTime);

      // Move to next set
      if (currentSet < setsPerBlock) {
        setCurrentSet(currentSet + 1);
        // Cycle through exercises in current block
        const nextExerciseIndex =
          (currentExerciseIndex + 1) % currentBlock.exercises.length;
        console.log("Moving to next exercise:", {
          currentExerciseIndex,
          nextExerciseIndex,
        });
        setCurrentExerciseIndex(nextExerciseIndex);
      } else {
        // Block complete, move to next block
        if (currentBlockIndex < totalBlocks - 1) {
          console.log("Starting new block:", currentBlockIndex + 1);
          setCurrentBlockIndex(currentBlockIndex + 1);
          setCurrentSet(1);
          setCurrentExerciseIndex(0);
        } else {
          // All blocks complete
          setIsComplete(true);
          return;
        }
      }
      setIsActive(true);
    } else {
      // Work period complete, start rest period
      if (currentSet < setsPerBlock) {
        setIsRest(true);
        setTime(restTime);
        setIsActive(true);
      } else if (currentBlockIndex < totalBlocks - 1) {
        // End of block, longer rest before next block
        console.log(
          "Block complete, starting rest before block:",
          currentBlockIndex + 1
        );
        setIsRest(true);
        setTime(60); // 1 minute rest between blocks
        setIsActive(true);
      } else {
        // Workout complete
        setIsComplete(true);
      }
    }
  };

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
    setTime(workTime);
    setIsActive(false);
    setIsPaused(false);
    setCurrentBlockIndex(0);
    setCurrentSet(1);
    setCurrentExerciseIndex(0);
    setIsRest(false);
    setIsComplete(false);
  };

  const handleComplete = () => {
    clearInterval(intervalRef.current);
    onComplete();
  };

  const getCurrentExercise = () => {
    const currentBlock = allTabataBlocks[currentBlockIndex];
    if (!currentBlock?.exercises || currentBlock.exercises.length === 0) {
      return null;
    }
    // Ensure currentExerciseIndex is within bounds
    const safeIndex = currentExerciseIndex % currentBlock.exercises.length;
    return currentBlock.exercises[safeIndex];
  };

  const currentExercise = getCurrentExercise();

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
        <div className="bg-customGray p-6 rounded-lg text-center max-w-2xl w-full border-brightYellow border-2">
          <div className="text-6xl mb-6">🔥</div>
          <h2 className="font-higherJump text-3xl font-bold text-customWhite mb-4">
            Tabata Complete!
          </h2>
          <p className="text-lg text-logoGray mb-4">
            Incredible work! You completed {totalBlocks} blocks of Tabata
            training.
          </p>
          <div className="space-y-4">
            <button onClick={handleComplete} className="btn-full-colour">
              Continue Workout
            </button>
            <button onClick={resetTimer} className="btn-cancel">
              Restart Tabata
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
            <button
              onClick={onGoBack}
              className="btn-cancel mt-0 py-2 md:py-3 px-3 md:px-6"
            >
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
                {workTime}s work, {restTime}s rest. Complete {setsPerBlock} sets
                per block.
              </p>
            </div>
          </div>
        </div>

        {/* Round and Set Progress */}
        <div className="mb-4">
          <h2 className="text-customWhite text-2xl font-titillium font-semibold mb-2">
            Block{" "}
            <span className="text-brightYellow">{currentBlockIndex + 1}</span>{" "}
            of <span className="text-brightYellow">{totalBlocks}</span>
            {" • "}
            Set <span className="text-limeGreen">{currentSet}</span> of{" "}
            <span className="text-limeGreen">{setsPerBlock}</span>
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col lg:flex-row gap-6 p-4">
          {/* Left Column: Timer and Status */}
          <div className="w-full lg:w-1/3 flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row-reverse lg:flex-col gap-4">
              {/* Timer - First on mobile */}
              <div className="w-full sm:w-1/2 lg:w-full bg-gray-600 rounded-lg p-4 lg:p-6 text-center">
                <div
                  className={`text-5xl lg:text-6xl mb-2 lg:mb-4 ${
                    isRest ? "text-hotPink" : "text-limeGreen"
                  }`}
                >
                  {formatTime(time)}
                </div>
                <div
                  className={`text-xl font-bold mb-2 lg:mb-4 ${
                    isRest ? "text-hotPink" : "text-limeGreen"
                  }`}
                >
                  {isRest ? "REST" : "WORK"}
                </div>
                {/* Timer Controls */}
                <div className="flex justify-center space-x-1 lg:space-x-2">
                  {!isActive || isPaused ? (
                    <button
                      onClick={startTimer}
                      className="btn-full-colour mr-2"
                    >
                      {isPaused ? "Resume" : "Start"}
                    </button>
                  ) : (
                    <button onClick={pauseTimer} className="btn-subscribe">
                      Pause
                    </button>
                  )}
                  <button onClick={resetTimer} className="btn-cancel">
                    Reset
                  </button>
                </div>
              </div>

              {/* Current Exercise - Second on mobile */}
              <div className="bg-gray-600 w-full sm:w-1/2 lg:w-full rounded-lg p-4 lg:p-6 text-center">
                <h3 className="text-lg lg:text-xl font-bold text-customWhite mb-2">
                  Current Exercise
                </h3>
                {currentExercise && (
                  <div className="text-brightYellow text-base lg:text-lg font-bold">
                    {currentExercise.exercise.name}
                    {currentExercise.exercise?.modification && (
                      <span className="text-xs text-limeGreen ml-2 block">
                        (Modified Available)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Exercise Details - Hidden on mobile, shown on desktop */}
            <div className="mt-2 space-y-2 hidden lg:block">
              {currentExercise && (
                <>
                  {(currentExercise?.tips ||
                    currentExercise?.exercise?.tips) && (
                    <div className="bg-gray-600 rounded-lg p-3">
                      <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                        <span className="text-limeGreen font-bold">Tips:</span>{" "}
                        {currentExercise?.tips ||
                          currentExercise?.exercise?.tips}
                      </p>
                    </div>
                  )}
                  {(currentExercise?.instructions ||
                    currentExercise?.exercise?.instructions) && (
                    <div className="bg-gray-600 rounded-lg p-3">
                      <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                        <span className="text-limeGreen font-bold">
                          Instructions:
                        </span>{" "}
                        {currentExercise?.instructions ||
                          currentExercise?.exercise?.instructions}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Column: Exercise List and Video */}
          <div className="w-full lg:w-2/3">
            {/* Exercise List */}
            <div className="bg-gray-600 rounded-lg p-4 mb-4">
              <div className="space-y-2">
                {allTabataBlocks[currentBlockIndex]?.exercises.map(
                  (exercise, index) => (
                    <div
                      key={exercise.id || index}
                      className={`w-full p-3 rounded-lg text-center transition-colors ${
                        currentExerciseIndex === index
                          ? "bg-limeGreen text-black"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="font-semibold">
                          {exercise.exercise.name}
                        </span>
                        {exercise.exercise?.modification && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setShowModified(false)}
                              className={`text-xs px-1 py-0.5 rounded ${
                                !showModified
                                  ? "bg-black text-limeGreen"
                                  : "bg-gray-400 text-black"
                              }`}
                            >
                              Std
                            </button>
                            <button
                              onClick={() => setShowModified(true)}
                              className={`text-xs px-1 py-0.5 rounded ${
                                showModified
                                  ? "bg-black text-limeGreen"
                                  : "bg-gray-400 text-black"
                              }`}
                            >
                              Mod
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Video */}
            {currentExercise && (
              <div className="pt-4">
                <div className="relative w-full pb-[86.25%] overflow-hidden rounded-lg">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <ExerciseVideo
                      exercise={currentExercise}
                      isActive={true}
                      shouldAutoStart={false}
                      showModified={showModified}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Exercise Details - Shown on mobile below video, hidden on desktop */}
            <div className="mt-4 space-y-2 lg:hidden">
              {currentExercise && (
                <>
                  {(currentExercise?.tips ||
                    currentExercise?.exercise?.tips) && (
                    <div className="bg-gray-600 rounded-lg p-3">
                      <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                        <span className="text-limeGreen font-bold">Tips:</span>{" "}
                        {currentExercise?.tips ||
                          currentExercise?.exercise?.tips}
                      </p>
                    </div>
                  )}
                  {(currentExercise?.instructions ||
                    currentExercise?.exercise?.instructions) && (
                    <div className="bg-gray-600 rounded-lg p-3">
                      <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                        <span className="text-limeGreen font-bold">
                          Instructions:
                        </span>{" "}
                        {currentExercise?.instructions ||
                          currentExercise?.exercise?.instructions}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
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
};

export default TabataWorkout;
