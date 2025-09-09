import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import DynamicHeading from "../../components/Shared/DynamicHeading";
import AudioControl from "../../components/Shared/AudioControl";
import useWorkoutAudio from "../../hooks/useWorkoutAudio";
import { getToggleButtonText } from "../../utils/exerciseUtils";

const ForTimeWorkout = ({
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
  const [isComplete, setIsComplete] = useState(false);
  const [showModified, setShowModified] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [currentRound, setCurrentRound] = useState(1);
  const [currentLadderStep, setCurrentLadderStep] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const intervalRef = useRef(null);
  const { audioEnabled, toggleAudio } = useWorkoutAudio();

  // Determine workout type and structure
  const workoutType = getWorkoutType();
  const totalRounds = workoutBlock.blockRounds || 1;
  const roundRestSeconds = workoutBlock.roundRest ? parseRestTime(workoutBlock.roundRest) : 0;

  function getWorkoutType() {
    // Check if it's a multi-round workout
    if (workoutBlock.blockRounds && workoutBlock.blockRounds > 1) {
      return 'multi-round';
    }
    
    // Check if any exercise has ladder/pyramid reps (contains commas)
    const hasLadderReps = workoutBlock.exercises.some(exercise => 
      exercise.reps && exercise.reps.includes(',')
    );
    
    if (hasLadderReps) {
      return 'ladder';
    }
    
    return 'simple';
  }

  function parseRestTime(restString) {
    if (!restString) return 0;
    const match = restString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  function getLadderSteps() {
    if (workoutType !== 'ladder') return [];
    const firstExercise = workoutBlock.exercises[0];
    if (!firstExercise?.reps) return [];
    return firstExercise.reps.split(',').map(rep => rep.trim());
  }

  function getCurrentReps(exercise, stepIndex = 0) {
    if (workoutType === 'ladder') {
      const steps = exercise.reps.split(',').map(rep => rep.trim());
      return steps[stepIndex] || steps[0];
    }
    return exercise.reps;
  }

  function getWorkoutDescription() {
    if (workoutType === 'multi-round') {
      return `Complete ${totalRounds} rounds of all exercises as fast as possible!`;
    } else if (workoutType === 'ladder') {
      return `Complete the ladder pattern for all exercises as fast as possible!`;
    }
    return `Complete all exercises with the prescribed reps as quickly as possible!`;
  }

  function getProgressDisplay() {
    const currentCompleted = workoutBlock.exercises.filter((_, index) => isExerciseCompleted(index)).length;
    
    if (workoutType === 'simple') {
      return `${currentCompleted}/${workoutBlock.exercises.length}`;
    } else if (workoutType === 'multi-round') {
      const totalExercises = workoutBlock.exercises.length * totalRounds;
      const completedExercises = (currentRound - 1) * workoutBlock.exercises.length + currentCompleted;
      return `${completedExercises}/${totalExercises}`;
    } else if (workoutType === 'ladder') {
      const totalSteps = getLadderSteps().length;
      const totalExercises = workoutBlock.exercises.length * totalSteps;
      const completedExercises = currentLadderStep * workoutBlock.exercises.length + currentCompleted;
      return `${completedExercises}/${totalExercises}`;
    }
    return `${currentCompleted}/${workoutBlock.exercises.length}`;
  }

  function getProgressPercentage() {
    const currentCompleted = workoutBlock.exercises.filter((_, index) => isExerciseCompleted(index)).length;
    
    if (workoutType === 'simple') {
      return (currentCompleted / workoutBlock.exercises.length) * 100;
    } else if (workoutType === 'multi-round') {
      const totalExercises = workoutBlock.exercises.length * totalRounds;
      const completedExercises = (currentRound - 1) * workoutBlock.exercises.length + currentCompleted;
      return (completedExercises / totalExercises) * 100;
    } else if (workoutType === 'ladder') {
      const totalSteps = getLadderSteps().length;
      const totalExercises = workoutBlock.exercises.length * totalSteps;
      const completedExercises = currentLadderStep * workoutBlock.exercises.length + currentCompleted;
      return (completedExercises / totalExercises) * 100;
    }
    return (currentCompleted / workoutBlock.exercises.length) * 100;
  }

  useEffect(() => {
    if (shouldAutoStart) {
      setIsActive(true);
    }
  }, [shouldAutoStart]);

  // Main timer effect (stopwatch or rest timer)
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (isResting) {
          setRestTime((prev) => {
            if (prev <= 1) {
              // Rest complete, advance to next round
              setIsResting(false);
              setCurrentRound(currentRound + 1);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setTime((prev) => prev + 1);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, isResting, currentRound]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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
    setTime(0);
    setIsActive(false);
    setIsPaused(false);
    setCompletedExercises(new Set());
    setIsComplete(false);
    setCurrentRound(1);
    setCurrentLadderStep(0);
    setIsResting(false);
    setRestTime(0);
  };

  const handleComplete = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setIsComplete(true);
  };

  const handleFinishStep = () => {
    if (isWorkoutComplete()) {
      handleComplete();
    } else if (canAdvanceToNext()) {
      advanceToNext();
    }
  };

  const handleFinishWorkout = () => {
    clearInterval(intervalRef.current);
    onComplete();
  };

  const toggleExerciseComplete = (exerciseIndex) => {
    const newCompleted = new Set(completedExercises);
    const key = getExerciseKey(exerciseIndex);
    
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }
    setCompletedExercises(newCompleted);
  };

  const getExerciseKey = (exerciseIndex) => {
    if (workoutType === 'multi-round') {
      return `${currentRound}-${exerciseIndex}`;
    } else if (workoutType === 'ladder') {
      return `${currentLadderStep}-${exerciseIndex}`;
    }
    return exerciseIndex.toString();
  };

  const isExerciseCompleted = (exerciseIndex) => {
    const key = getExerciseKey(exerciseIndex);
    return completedExercises.has(key);
  };

  const allCurrentExercisesCompleted = () => {
    return workoutBlock.exercises.every((_, index) => isExerciseCompleted(index));
  };

  const canAdvanceToNext = () => {
    if (workoutType === 'simple') {
      return allCurrentExercisesCompleted();
    } else if (workoutType === 'multi-round') {
      return allCurrentExercisesCompleted() && currentRound < totalRounds;
    } else if (workoutType === 'ladder') {
      const ladderSteps = getLadderSteps();
      return allCurrentExercisesCompleted() && currentLadderStep < ladderSteps.length - 1;
    }
    return false;
  };

  const isWorkoutComplete = () => {
    if (workoutType === 'simple') {
      return allCurrentExercisesCompleted();
    } else if (workoutType === 'multi-round') {
      return currentRound === totalRounds && allCurrentExercisesCompleted();
    } else if (workoutType === 'ladder') {
      const ladderSteps = getLadderSteps();
      return currentLadderStep === ladderSteps.length - 1 && allCurrentExercisesCompleted();
    }
    return false;
  };

  const advanceToNext = () => {
    if (workoutType === 'multi-round' && currentRound < totalRounds) {
      if (roundRestSeconds > 0) {
        setIsResting(true);
        setRestTime(roundRestSeconds);
        setIsActive(true);
      } else {
        setCurrentRound(currentRound + 1);
      }
    } else if (workoutType === 'ladder') {
      const ladderSteps = getLadderSteps();
      if (currentLadderStep < ladderSteps.length - 1) {
        setCurrentLadderStep(currentLadderStep + 1);
      }
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
        <div className="bg-customGray p-6 rounded-lg text-center max-w-2xl w-full border-brightYellow border-2">
          <div className="text-6xl mb-6">⏱️</div>
          <h2 className="font-higherJump text-3xl font-bold text-customWhite mb-4">
            For Time Complete!
          </h2>
          <p className="text-lg text-logoGray mb-4">
            Excellent work! You finished in <span className="text-limeGreen font-bold">{formatTime(time)}</span>
          </p>
          <div className="space-y-4">
            <button onClick={handleFinishWorkout} className="btn-full-colour">
              Continue Workout
            </button>
            <button onClick={resetTimer} className="btn-cancel">
              Restart For Time
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
          
          {/* For Time Explanation */}
          <div className="bg-brightYellow text-black rounded-lg p-3 mb-4 max-w-4xl">
            <p className="text-sm font-semibold text-center">
              🏃‍♂️ FOR TIME: {getWorkoutDescription()}
            </p>
          </div>

          {/* Workout Progress */}
          {(workoutType === 'multi-round' || workoutType === 'ladder') && (
            <div className="bg-gray-700 rounded-lg p-3 mb-4 max-w-2xl">
              <div className="text-center">
                {workoutType === 'multi-round' && (
                  <p className="text-customWhite font-semibold">
                    Round <span className="text-brightYellow">{currentRound}</span> of <span className="text-brightYellow">{totalRounds}</span>
                    {roundRestSeconds > 0 && ` • ${roundRestSeconds}s rest between rounds`}
                  </p>
                )}
                {workoutType === 'ladder' && (
                  <p className="text-customWhite font-semibold">
                    Step <span className="text-brightYellow">{currentLadderStep + 1}</span> of <span className="text-brightYellow">{getLadderSteps().length}</span>
                    {` • Current reps: ${getLadderSteps()[currentLadderStep]}`}
                  </p>
                )}
              </div>
            </div>
          )}

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
                Complete all prescribed reps for each exercise as fast as possible. Mark exercises complete when finished.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col lg:flex-row gap-6 p-4">
          {/* Left Column: Stopwatch and Progress */}
          <div className="w-full lg:w-1/3 flex flex-col space-y-4">
            <div className="flex flex-row-reverse lg:flex-col gap-4">
              {/* Timer */}
              <div className="w-1/2 lg:w-full bg-gray-600 rounded-lg p-6 text-center">
                <div className={`text-6xl mb-4 ${isResting ? 'text-hotPink' : 'text-limeGreen'}`}>
                  {isResting ? formatTime(restTime) : formatTime(time)}
                </div>
                <div className={`text-xl font-bold mb-4 ${isResting ? 'text-hotPink' : 'text-customWhite'}`}>
                  {isResting ? 'REST' : 'STOPWATCH'}
                </div>
                {/* Timer Controls */}
                <div className="flex justify-center space-x-2">
                  {!isActive || isPaused ? (
                    <button onClick={startTimer} className="btn-full-colour mt-3">
                      {isPaused ? "Resume" : "Start"}
                    </button>
                  ) : (
                    <button onClick={pauseTimer} className="btn-subscribe mt-3">
                      Pause
                    </button>
                  )}
                  <button onClick={resetTimer} className="btn-cancel mt-3">
                    Reset
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-gray-600 w-1/2 lg:w-full rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-customWhite mb-2">
                  Progress
                </h3>
                <div className="text-6xl text-brightYellow mb-4">
                  {getProgressDisplay()}
                </div>
                <div className="bg-gray-500 rounded-full h-3 mb-4">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-limeGreen"
                    style={{ 
                      width: `${getProgressPercentage()}%` 
                    }}
                  ></div>
                </div>
                {allCurrentExercisesCompleted() && (
                  <div className="space-y-2">
                    {canAdvanceToNext() ? (
                      <button onClick={handleFinishStep} className="btn-subscribe mt-3">
                        {workoutType === 'multi-round' ? 'Next Round' : 'Next Step'}
                      </button>
                    ) : isWorkoutComplete() ? (
                      <button onClick={handleComplete} className="btn-full-colour mt-3">
                        Finish!
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Exercise Details - Hidden on mobile, shown on desktop */}
            <div className="mt-2 space-y-2 hidden lg:block">
              {workoutBlock.exercises[selectedExerciseIndex] && (
                <>
                  {(workoutBlock.exercises[selectedExerciseIndex]?.tips ||
                    workoutBlock.exercises[selectedExerciseIndex]?.exercise?.tips) && (
                    <div className="bg-gray-600 rounded-lg p-3">
                      <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                        <span className="text-limeGreen font-bold">Tips:</span>{" "}
                        {workoutBlock.exercises[selectedExerciseIndex]?.tips ||
                          workoutBlock.exercises[selectedExerciseIndex]?.exercise?.tips}
                      </p>
                    </div>
                  )}
                  {(workoutBlock.exercises[selectedExerciseIndex]?.instructions ||
                    workoutBlock.exercises[selectedExerciseIndex]?.exercise?.instructions) && (
                    <div className="bg-gray-600 rounded-lg p-3">
                      <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                        <span className="text-limeGreen font-bold">Instructions:</span>{" "}
                        {workoutBlock.exercises[selectedExerciseIndex]?.instructions ||
                          workoutBlock.exercises[selectedExerciseIndex]?.exercise?.instructions}
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
              <h3 className="text-xl font-bold text-customWhite mb-3">
                Workout Checklist
                <span className="text-sm font-normal text-logoGray ml-2">
                  (Complete all exercises)
                </span>
              </h3>
              <div className="space-y-2">
                {workoutBlock.exercises.map((exercise, index) => {
                  const isCompleted = isExerciseCompleted(index);
                  const currentReps = getCurrentReps(exercise, currentLadderStep);
                  
                  return (
                    <div
                      key={exercise.id || index}
                      className={`w-full p-3 rounded-lg text-left transition-colors cursor-pointer border-2 ${
                        isCompleted
                          ? "bg-limeGreen text-black border-limeGreen"
                          : selectedExerciseIndex === index
                          ? "bg-brightYellow text-black border-brightYellow"
                          : "bg-gray-700 text-white hover:bg-gray-600 border-gray-500"
                      }`}
                      onClick={() => {
                        setSelectedExerciseIndex(index);
                        if (isCompleted) {
                          // If clicking on completed exercise, allow toggling
                          toggleExerciseComplete(index);
                        }
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center flex-1">
                          <div className="flex items-center mr-3">
                            {isCompleted ? (
                              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                <span className="text-limeGreen text-sm font-bold">✓</span>
                              </div>
                            ) : (
                              <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <div className="font-semibold">
                                {exercise.exercise.name}
                              </div>
                              {exercise.exercise.modification && selectedExerciseIndex === index && (
                                <div className="flex space-x-1">
                                  {(() => {
                                    const { standardText, modifiedText } = getToggleButtonText(exercise);
                                    return (
                                      <>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setShowModified(false);
                                          }}
                                          className={`text-xs px-2 py-1 rounded ${
                                            !showModified
                                              ? "bg-limeGreen text-black"
                                              : "bg-gray-400 text-black"
                                          }`}
                                        >
                                          {standardText}
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setShowModified(true);
                                          }}
                                          className={`text-xs px-2 py-1 rounded ${
                                            showModified
                                              ? "bg-limeGreen text-black"
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
                            {exercise.exercise.modification && selectedExerciseIndex !== index && (
                              <div className="text-xs text-limeGreen">
                                Modified version available
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-xl font-bold">
                              {currentReps}
                            </div>
                            <div className="text-xs opacity-75">
                              {workoutType === 'ladder' ? 'this step' : 
                               currentReps.toLowerCase().includes('rep') ? 'total' : 'reps'}
                            </div>
                          </div>
                          {!isCompleted && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExerciseComplete(index);
                              }}
                              className="bg-limeGreen text-black px-3 py-1 rounded font-semibold text-sm hover:bg-green-400 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Workout Summary */}
              <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                {workoutType === 'multi-round' && (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-logoGray">Current Round:</span>
                      <span className="text-brightYellow font-semibold">{currentRound} of {totalRounds}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-logoGray">Round Progress:</span>
                      <span className="text-limeGreen font-semibold">
                        {workoutBlock.exercises.filter((_, index) => isExerciseCompleted(index)).length}/{workoutBlock.exercises.length}
                      </span>
                    </div>
                  </>
                )}
                {workoutType === 'ladder' && (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-logoGray">Current Step:</span>
                      <span className="text-brightYellow font-semibold">{currentLadderStep + 1} of {getLadderSteps().length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-logoGray">Step Reps:</span>
                      <span className="text-brightYellow font-semibold">{getLadderSteps()[currentLadderStep]}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-logoGray">Step Progress:</span>
                      <span className="text-limeGreen font-semibold">
                        {workoutBlock.exercises.filter((_, index) => isExerciseCompleted(index)).length}/{workoutBlock.exercises.length}
                      </span>
                    </div>
                  </>
                )}
                {workoutType === 'simple' && (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-logoGray">Total Exercises:</span>
                      <span className="text-customWhite font-semibold">{workoutBlock.exercises.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-logoGray">Completed:</span>
                      <span className="text-limeGreen font-semibold">
                        {workoutBlock.exercises.filter((_, index) => isExerciseCompleted(index)).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-logoGray">Remaining:</span>
                      <span className="text-brightYellow font-semibold">
                        {workoutBlock.exercises.length - workoutBlock.exercises.filter((_, index) => isExerciseCompleted(index)).length}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>



            {/* Video */}
            <div className="pt-4">
              <div className="relative w-full pb-[30.25%] overflow-hidden rounded-lg">
                <div className="absolute top-0 left-0 w-full h-full">
                  <ExerciseVideo
                    exercise={workoutBlock.exercises[selectedExerciseIndex]}
                    isActive={true}
                    shouldAutoStart={false}
                    showModified={showModified}
                  />
                </div>
              </div>
            </div>

            {/* Exercise Details - Shown on mobile below video, hidden on desktop */}
            <div className="mt-4 space-y-2 lg:hidden">
              {workoutBlock.exercises[selectedExerciseIndex] && (
                <>
                  {(workoutBlock.exercises[selectedExerciseIndex]?.tips ||
                    workoutBlock.exercises[selectedExerciseIndex]?.exercise?.tips) && (
                    <div className="bg-gray-600 rounded-lg p-3">
                      <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                        <span className="text-limeGreen font-bold">Tips:</span>{" "}
                        {workoutBlock.exercises[selectedExerciseIndex]?.tips ||
                          workoutBlock.exercises[selectedExerciseIndex]?.exercise?.tips}
                      </p>
                    </div>
                  )}
                  {(workoutBlock.exercises[selectedExerciseIndex]?.instructions ||
                    workoutBlock.exercises[selectedExerciseIndex]?.exercise?.instructions) && (
                    <div className="bg-gray-600 rounded-lg p-3">
                      <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                        <span className="text-limeGreen font-bold">Instructions:</span>{" "}
                        {workoutBlock.exercises[selectedExerciseIndex]?.instructions ||
                          workoutBlock.exercises[selectedExerciseIndex]?.exercise?.instructions}
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

ForTimeWorkout.propTypes = {
  workoutBlock: PropTypes.shape({
    blockType: PropTypes.string.isRequired,
    blockNotes: PropTypes.string,
    blockRounds: PropTypes.number,
    roundRest: PropTypes.string,
    exercises: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        reps: PropTypes.string,
        exercise: PropTypes.shape({
          name: PropTypes.string.isRequired,
          instructions: PropTypes.string,
          tips: PropTypes.string,
          modification: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
              name: PropTypes.string,
              videoId: PropTypes.string,
            })
          ]),
        }).isRequired,
        tips: PropTypes.string,
        instructions: PropTypes.string,
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

export default ForTimeWorkout;