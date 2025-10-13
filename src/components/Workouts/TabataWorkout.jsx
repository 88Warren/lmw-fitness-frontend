import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import DynamicHeading from "../../components/Shared/DynamicHeading";
import AudioControl from "../../components/Shared/AudioControl";
import useWorkoutAudio from "../../hooks/useWorkoutAudio";
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
  const intervalRef = useRef(null);
  const { audioEnabled, volume, startSound, toggleAudio, setVolumeLevel, setStartSoundType, playBeep, playStartSound } = useWorkoutAudio();

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

    return {
      workTime,
      restTime,
      setsPerBlock,
      totalBlocks: allTabataBlocks?.length || 0,
    };
  };

  const { workTime, restTime, setsPerBlock, totalBlocks } =
    extractTabataConfig();

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

  useEffect(() => {
    if (isActive && !isPaused && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 5 && prev > 0) {
            playBeep();
          }
          
          // Play start sound when transitioning from rest to work
          if (prev === 1 && isRest) {
            setTimeout(() => playStartSound(), 1000); // Play start sound when rest ends and work begins
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
  }, [isActive, isPaused, time, playBeep]);

  const handleTimerComplete = () => {
    const currentBlock = allTabataBlocks?.[currentBlockIndex];
    if (!currentBlock) return;

    // console.log("Timer complete:", {
    //   isRest,
    //   currentSet,
    //   setsPerBlock,
    //   currentBlockIndex,
    //   totalBlocks,
    //   currentExerciseIndex,
    // });

    if (isRest) {
      setIsRest(false);
      setTime(workTime);

      if (currentSet < setsPerBlock) {
        setCurrentSet(currentSet + 1);
        const nextExerciseIndex =
          (currentExerciseIndex + 1) % currentBlock.exercises.length;
        // console.log("Moving to next exercise:", {
        //   currentExerciseIndex,
        //   nextExerciseIndex,
        // });
        setCurrentExerciseIndex(nextExerciseIndex);
      } else {
        if (currentBlockIndex < totalBlocks - 1) {
          // console.log("Starting new block:", currentBlockIndex + 1);
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
        // console.log(
        //   "Block complete, starting rest before block:",
        //   currentBlockIndex + 1
        // );
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
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    setHasResetOnce(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    
    if (!hasResetOnce) {
      if (isRest) {
        setTime(restTime);
      } else {
        setTime(workTime);
      }
      setIsActive(false);
      setIsPaused(false);
      setHasResetOnce(true);
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
    if (!currentBlock?.exercises || currentBlock.exercises.length === 0) {
      return null;
    }
    const safeIndex = currentExerciseIndex % currentBlock.exercises.length;
    return currentBlock.exercises[safeIndex];
  };

  const currentExercise = getCurrentExercise();

  const getExerciseName = (exercise, exerciseIndex) => {
    if (!exercise?.exercise) return "";
    
    const isModified = showModified[exerciseIndex] || false;
    if (isModified && exercise.exercise.modification) {
      return exercise.exercise.modification.name;
    }
    return exercise.exercise.name;
  };

  const getNextExerciseInfo = () => {
    if (!isRest) return null;

    const currentBlock = allTabataBlocks?.[currentBlockIndex];
    if (!currentBlock) return null;
    if (currentSet < setsPerBlock) {
      const nextExerciseIndex = (currentExerciseIndex + 1) % currentBlock.exercises.length;
      const nextExercise = currentBlock.exercises[nextExerciseIndex];
      
      return {
        type: 'single',
        exercise: nextExercise,
        exerciseIndex: nextExerciseIndex,
        setNumber: currentSet + 1
      };
    } 

    else if (currentBlockIndex < totalBlocks - 1) {
      const nextBlock = allTabataBlocks[currentBlockIndex + 1];
      if (nextBlock?.exercises?.length >= 2) {
        return {
          type: 'nextBlock',
          exercises: [nextBlock.exercises[0], nextBlock.exercises[1]],
          blockNumber: currentBlockIndex + 2
        };
      } else if (nextBlock?.exercises?.length === 1) {
        return {
          type: 'single',
          exercise: nextBlock.exercises[0],
          exerciseIndex: 0,
          blockNumber: currentBlockIndex + 2
        };
      }
    }

    return null;
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
        <div className="bg-customGray p-6 rounded-lg text-center max-w-2xl w-full border-brightYellow border-2">
          <div className="text-6xl mb-6">🔥</div>
          <DynamicHeading
            className="font-higherJump text-2xl md:text-3xl font-bold text-customWhite mb-4 leading-loose"
            text="Tabata Complete!"
          />
          <p className="text-lg text-logoGray mt-6 mb-2">
            Incredible work! You completed {totalBlocks} blocks of Tabata
            training.
          </p>
          <div className="space-y-4">
            <button onClick={handleComplete} className="btn-full-colour sm:mr-4">
              Back to Program
            </button>
            <button onClick={resetTimer} className="btn-cancel mt-0 md:mt-6">
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
            volume={volume}
            startSound={startSound}
            onToggle={toggleAudio}
            onVolumeChange={setVolumeLevel}
            onStartSoundChange={setStartSoundType}
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
          <div className="flex flex-col md:flex-row gap-0 md:gap-2 w-full items-center md:items-stretch">
            {/* Description */}
            <div className="flex items-start justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center">
              <p className="text-logoGray text-sm whitespace-pre-line break-words leading-loose">
                <span className="text-limeGreen font-bold">Description:</span>{" "}
                {description}
              </p>
            </div>

            {/* Instructions */}
            <div className="flex items-start justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center">
              <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                <span className="text-limeGreen font-bold">Instructions:</span>{" "}
                {workTime}s work, {restTime}s rest. Complete {setsPerBlock} sets
                per block.
              </p>
            </div>
          </div>
        </div>

        {/* Round and Set Progress */}
        <div className="">
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
                    {hasResetOnce ? "Reset All" : (isRest ? "Reset Rest" : "Reset Work")}
                  </button>
                  {isAdmin && isActive && (
                    <button onClick={skipCurrent} className="btn-skip">
                      Next
                    </button>
                  )}
                </div>
              </div>

              {/* Current/Next Exercise - Second on mobile */}
              <div className="bg-gray-600 w-full sm:w-1/2 lg:w-full rounded-lg p-4 lg:p-6 text-center">
                {isRest ? (
                  // Show next exercise during rest
                  <>
                    <h3 className="text-lg lg:text-xl font-bold text-customWhite mb-2">
                      Next Up
                    </h3>
                    {(() => {
                      const nextInfo = getNextExerciseInfo();
                      if (!nextInfo) return null;

                      if (nextInfo.type === 'single') {
                        return (
                          <div className="text-brightYellow text-base lg:text-lg font-bold">
                            {getExerciseName(nextInfo.exercise, nextInfo.exerciseIndex)}
                            {nextInfo.blockNumber && (
                              <div className="text-sm text-logoGray mt-1">
                                Block {nextInfo.blockNumber}
                              </div>
                            )}
                          </div>
                        );
                      } else if (nextInfo.type === 'nextBlock') {
                        return (
                          <div className="text-brightYellow text-base lg:text-lg font-bold">
                            <div>Block {nextInfo.blockNumber}</div>
                            <div className="text-sm text-logoGray mt-1">
                              {getExerciseName(nextInfo.exercises[0], 0)} & {getExerciseName(nextInfo.exercises[1], 1)}
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </>
                ) : (
                  <>
                    <h3 className="text-lg lg:text-xl font-bold text-customWhite mb-2">
                      Current Exercise
                    </h3>
                    {currentExercise && (
                      <div className="text-brightYellow text-base lg:text-lg font-bold">
                        {getExerciseName(currentExercise, currentExerciseIndex)}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Exercise List and Video */}
          <div className="w-full lg:w-2/3">
            {/* Exercise Table */}
            <div className="flex-1 space-y-2 overflow-y-auto mb-4">
              {allTabataBlocks?.[currentBlockIndex]?.exercises?.map(
                (exercise, index) => (
                  <div
                    key={exercise.id || index}
                    onClick={() => setCurrentExerciseIndex(index)}
                    className={`p-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                      index === currentExerciseIndex
                        ? "bg-gray-700 text-black"
                        : "text-logoGray hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex flex-row justify-between font-bold gap-2">
                      {/* Left side: exercise name */}
                      <div className="flex flex-row items-start">
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

                      {/* Right side: standard/modified toggle for both mobile and desktop */}
                      <div className="flex flex-wrap gap-2 items-center">
                        {exercise.exercise.modification && (
                          <div className="flex items-center space-x-1">
                            {(() => {
                              const { standardText, modifiedText } =
                                getToggleButtonText(exercise);
                              return (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowModified(prev => ({ ...prev, [index]: false }));
                                    }}
                                    className={`text-xs sm:text-sm px-2 py-1 rounded sm:rounded-lg border ${
                                      currentExerciseIndex === index
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
                                      setShowModified(prev => ({ ...prev, [index]: true }));
                                    }}
                                    className={`text-xs sm:text-sm px-2 py-1 rounded sm:rounded-lg border ${
                                      currentExerciseIndex === index
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
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Video */}
            {currentExercise && (
              <div className="pt-4">
                <div className="relative w-full pb-[70%] md:pb-[75%] overflow-hidden rounded-lg">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <ExerciseVideo
                      exercise={currentExercise}
                      isActive={true}
                      shouldAutoStart={false}
                      showModified={showModified[currentExerciseIndex] || false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Exercise Details - Side by side on desktop, stacked on mobile */}
            <div className="mt-2 flex flex-col md:flex-row gap-4 w-full">
              {currentExercise && (
                <>
                  {/* Show individual exercise tips */}
                  {(currentExercise?.tips ||
                    currentExercise?.exercise?.tips) && (
                    <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-600 rounded-lg p-3 text-center">
                      <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                        <span className="text-limeGreen font-bold">Tips:</span>{" "}
                        {currentExercise?.tips ||
                          currentExercise?.exercise?.tips}
                      </p>
                    </div>
                  )}
                  {/* Show individual exercise instructions */}
                  {(currentExercise?.instructions ||
                    currentExercise?.exercise?.instructions) && (
                    <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-600 rounded-lg p-3 text-center">
                      <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                        <span className="text-limeGreen font-bold">
                          Exercise Instructions:
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
  isAdmin: PropTypes.bool,
};

export default TabataWorkout;
