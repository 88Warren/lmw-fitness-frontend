import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const WorkoutTimer = ({ 
  currentExercise, 
  nextExercise, 
  onExerciseComplete, 
  onGoBack,
  canGoBack,
  isRest = false,
  isStopwatch = false,
  exerciseInstructions,
  exerciseTips, 
  progressPercentage,
  currentBlockType, 
  currentExerciseNumber, 
  totalExercisesInBlock,
  onShowModificationModal, 
  currentModification, 
  setShowModificationModal,
}) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Helper to parse duration strings into seconds
  const parseDurationToSeconds = (duration) => {
    if (typeof duration === 'number') return duration;
    if (typeof duration === 'string') {
      if (duration.trim() === "") {
        return 0; 
      }
      const match = duration.match(/(\d+)\s*(seconds?|secs?|s|minutes?|mins?|m)/i);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        if (unit.includes('min')) return value * 60;
        return value;
      }
    }
    return 0; 
  };

 useEffect(() => {
    console.log("Timer initializing:", {
      isRest,
      isStopwatch,
      currentExercise,
      restValue: currentExercise?.rest,
      durationValue: currentExercise?.duration,
      exerciseName: currentExercise?.exercise?.name,
      modification: currentExercise?.modification
    });
    clearInterval(intervalRef.current);
    
    if (isStopwatch) {
        setTime(0);
        setIsActive(false); 
        setIsPaused(false);
    } else if (isRest) {
        const rest = parseDurationToSeconds(currentExercise.rest);
        console.log("Rest duration parsed:", rest);
        setTime(rest);
        setIsActive(true);
        setIsPaused(false);
    } else {
        const exerciseDuration = parseDurationToSeconds(currentExercise.duration);
        console.log("Exercise duration parsed:", exerciseDuration);
        setTime(exerciseDuration);
        setIsActive(true);
        setIsPaused(false);
    }
  }, [currentExercise, isRest, isStopwatch]);

  // Timer interval effect
  useEffect(() => {
      if (isActive && !isPaused) {
        intervalRef.current = setInterval(() => {
          setTime((prev) => {
            if (isStopwatch) {
              return prev + 1; 
            } else {
              if (prev <= 1) {
                clearInterval(intervalRef.current);
                setTimeout(() => {
                  onExerciseComplete();
                }, 100);
                return 0;
              }
              return prev - 1; 
            }
          });
        }, 1000);
      } else {
        clearInterval(intervalRef.current);
      }
      return () => clearInterval(intervalRef.current);
    }, [isActive, isPaused, isStopwatch, onExerciseComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    setIsActive(true);
  };

  const stopAndReset = () => {
    clearInterval(intervalRef.current);
    setTime(isStopwatch ? 0 : parseDurationToSeconds(isRest ? currentExercise.rest : currentExercise.duration));
    setIsActive(false);
    setIsPaused(false);
  };

  const skipRest = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    onExerciseComplete();
  };

  const getProgressPercentage = () => {
    if (isStopwatch) return 0;
    const durationStr = isRest ? currentExercise.rest : currentExercise.duration;
    const totalSeconds = parseDurationToSeconds(durationStr);
    return totalSeconds > 0 ? ((totalSeconds - time) / totalSeconds) * 100 : 0;
  };

    return (
        <div className="bg-gray-700 rounded-lg p-2 flex flex-col h-full justify-between">
            {/* New: Workout Block and Exercise Number at the top */}
            <div className="flex flex-col items-center mb-2">
                <p className="text-logoGray text-sm md:text-base">
                    {currentBlockType} - Exercise {currentExerciseNumber} of {totalExercisesInBlock}
                </p>
            </div>
            

            {/* Timer Section */}
            <div>
                <div className="mb-2">
                    <h3 className="text-xl font-bold text-brightYellow mb-2">
                        {isStopwatch ? currentExercise?.exercise?.name : isRest ? 'Rest Time' : currentExercise?.exercise?.name}
                    </h3>
                    {isRest && nextExercise?.exercise?.name && (
                        <p className="text-logoGray text-sm">
                            Next: {nextExercise.exercise.name}
                        </p>
                    )}
                </div>

                {/* Timer Display */}
                <div className="mb-2">
                    <div className="text-5xl font-bold text-limeGreen">
                        {formatTime(time)}
                    </div>
                </div>

                {/* Timer Controls */}
                <div className="flex justify-center space-x-2">
                    {canGoBack && (
                        <button
                            onClick={() => {
                              clearInterval(intervalRef.current);
                              setTime(0);
                              setIsActive(false);
                              setIsPaused(false);
                              onGoBack();
                          }}
                            className="btn-cancel mt-3 px-2 py-1"
                        >
                            Back
                        </button>
                    )}

                    {(!isActive || isPaused) ? (
                        <button
                            onClick={resumeTimer}
                            className={`btn-full-colour mt-3 px-2 py-1 ${
                                isStopwatch && isActive ? 'bg-hotPink hover:bg-pink-600 text-white' : 'bg-limeGreen hover:bg-green-600 text-white'
                            }`}
                        >
                            {isPaused ? "Resume" : "Start"}
                        </button>
                    ) : (
                        <button
                            onClick={pauseTimer}
                            className="btn-primary mt-3 px-2 py-1"
                        >
                            Pause
                        </button>
                    )}

                    {isStopwatch && isActive && (
                        <button
                            onClick={stopAndReset}
                            className="btn-cancel mt-3 px-2 py-1"
                        >
                            Reset
                        </button>
                    )}
                    {isStopwatch && (
                        <button
                          onClick={() => {
                            clearInterval(intervalRef.current);
                            onExerciseComplete();
                          }}
                          className="btn-full-colour mt-3 px-2 py-1"
                        >
                          Next
                        </button>
                    )}

                    {!isStopwatch && isRest && time > 0 && (
                        <button
                            onClick={skipRest}
                            className="btn-primary mt-3 px-2 py-1"
                        >
                            Skip
                        </button>
                    )}

                    {!isStopwatch && !isRest && (
                        <button
                            onClick={() => {
                                clearInterval(intervalRef.current);
                                onExerciseComplete();
                            }}
                            className="btn-primary mt-3 px-2 py-1"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>

            {/* Instructions, Tips, and Progress Bar Section */}
            <div className="mt-2 flex flex-col justify-end">
                {exerciseInstructions && (
                    <div className="bg-gray-600 rounded-lg p-2 m-2 text-left">
                        <p><span className="text-limeGreen text-xs font-bold mb-2">Instructions: </span>
                        <span className="text-logoGray text-xs">{exerciseInstructions}</span></p>
                    </div>
                )}

                {exerciseTips && (
                    <div className="bg-gray-600 rounded-lg p-2 m-2 text-left">
                        <p><span className="text-limeGreen font-bold text-xs mb-2">Form Tips: </span>
                        <span className="text-logoGray text-xs">{exerciseTips}</span></p>
                    </div>
                )}

                {currentExercise && currentExercise.modification && (
                  <div className="bg-gray-600 rounded-lg p-2 m-2 text-left">
                      <p className="text-limeGreen font-bold text-xs mb-2">Modification(s):</p>
                      <button
                          onClick={() => {
                              onShowModificationModal(currentExercise.modification);
                              setShowModificationModal(true);
                          }}
                          className="btn-primary mt-1 px-2 py-1"
                      >
                          {currentExercise.modification.name}
                      </button>
                  </div>
              )}
            </div>

            {/* Overall Progress Bar - MODIFIED FOR INLINE LAYOUT */}
            <div className="m-2 bg-gray-800 rounded-lg p-2 flex items-center space-x-2">
                <span className="text-xs text-logoGray whitespace-nowrap">Progress</span>
                <div className="flex-grow bg-gray-600 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-limeGreen to-brightYellow h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${progressPercentage}%`,
                        }}
                    ></div>
                </div>
                <span className="text-xs text-logoGray whitespace-nowrap">
                    {Math.round(progressPercentage)}%
                </span>
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
    }),
    modification: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
    }),
  }),
  nextExercise: PropTypes.shape({
    exercise: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  onExerciseComplete: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  isRest: PropTypes.bool,
  isStopwatch: PropTypes.bool,
  exerciseInstructions: PropTypes.string,
  exerciseTips: PropTypes.string,
  progressPercentage: PropTypes.number,
  currentBlockType: PropTypes.string,
  currentExerciseNumber: PropTypes.number,
  totalExercisesInBlock: PropTypes.number,
  onShowModificationModal: PropTypes.func.isRequired, 
  currentModification: PropTypes.object, 
  setShowModificationModal: PropTypes.func.isRequired, 
};

export default WorkoutTimer;