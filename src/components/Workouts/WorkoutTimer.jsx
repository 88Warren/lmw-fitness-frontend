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
  shouldAutoStart = false,
  showModified,
  setShowModified, // Make sure this is being received
}) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Add debug logging to check if setShowModified is received
  useEffect(() => {
    console.log("WorkoutTimer props check:", {
      setShowModified: typeof setShowModified,
      showModified,
      hasModification: !!currentExercise?.modification
    });
  }, [setShowModified, showModified, currentExercise]);

  // Helper to parse duration strings into seconds
  const parseDurationToSeconds = (duration) => {
    console.log("Parsing duration:", duration, "type:", typeof duration);
    
    if (typeof duration === 'number') return duration;
    if (typeof duration === 'string') {
      if (duration.trim() === "") {
        console.log("Empty duration string, returning 0");
        return 0; 
      }
      
      // More comprehensive regex to handle various formats
      const match = duration.match(/(\d+)\s*(seconds?|secs?|sec|s|minutes?|mins?|min|m)/i);
      console.log("Regex match result:", match);
      
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        console.log("Parsed value:", value, "unit:", unit);
        
        if (unit.includes('min') || unit === 'm') {
          console.log("Converting minutes to seconds:", value * 60);
          return value * 60;
        }
        console.log("Returning seconds:", value);
        return value;
      } else {
        console.log("No regex match for duration:", duration);
      }
    }
    console.log("Fallback: returning 0 for duration:", duration);
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
      modification: currentExercise?.modification,
      shouldAutoStart
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
        setIsActive(shouldAutoStart);
        setIsPaused(false);
    }
  }, [currentExercise, isRest, isStopwatch, shouldAutoStart]);

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

  const activeExercise = showModified && currentExercise?.modification 
    ? currentExercise.modification 
    : currentExercise?.exercise;

  // Handle the modification button clicks with better error handling
  const handleOriginalClick = () => {
    console.log("Original button clicked, setShowModified:", typeof setShowModified);
    if (typeof setShowModified === 'function') {
      // Pause the timer when switching exercises and reset to original duration
      clearInterval(intervalRef.current);
      setIsActive(false);
      setIsPaused(false);
      // Reset time to the original duration
      const exerciseDuration = parseDurationToSeconds(currentExercise.duration);
      setTime(exerciseDuration);
      setShowModified(false);
    } else {
      console.error("setShowModified is not a function:", setShowModified);
    }
  };

  const handleModifiedClick = () => {
    console.log("Modified button clicked, setShowModified:", typeof setShowModified);
    if (typeof setShowModified === 'function') {
      // Pause the timer when switching exercises and reset to original duration
      clearInterval(intervalRef.current);
      setIsActive(false);
      setIsPaused(false);
      // Reset time to the original duration
      const exerciseDuration = parseDurationToSeconds(currentExercise.duration);
      setTime(exerciseDuration);
      setShowModified(true);
    } else {
      console.error("setShowModified is not a function:", setShowModified);
    }
  };

    return (
        <div className="bg-gray-700 rounded-lg p-2 flex flex-col h-full justify-between">

            {/* Timer Section */}
            <div>
                <div className="mb-2">
                  <div className="flex flex-col items-center mb-2">
                    <h3 className="text-3xl font-bold text-customWhite">
                        {isStopwatch ? activeExercise?.name : isRest ? 'Rest Time' : activeExercise?.name}
                    </h3>
                    <p className="text-logoGray text-xs">
                      (No. {currentExerciseNumber} of {totalExercisesInBlock})
                    </p>
                  </div>
                </div>

                {/* Modification Toggle Buttons */}
                {currentExercise?.modification && (
                  <div className="flex justify-center mb-2 space-x-2">
                    <button
                      onClick={handleOriginalClick}
                      className={`${
                        !showModified
                          ? "btn-primary px-1 py-1 mt-2"
                          : "btn-cancel mt-2"
                      }`}
                    >
                      Original
                    </button>
                    <button
                      onClick={handleModifiedClick}
                      className={`${
                        showModified
                          ? "btn-primary mt-2"
                          : "btn-cancel px-1 py-1 mt-2"
                      }`}
                    >
                      Modified
                    </button>
                  </div>
                )}

                {/* Timer Display */}
                <div className="mb-2">
                    <div className="text-7xl text-limeGreen p-4">
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
                            className="btn-cancel"
                        >
                            Back
                        </button>
                    )}

                    {(!isActive || isPaused) ? (
                        <button
                            onClick={resumeTimer}
                            className={`btn-full-colour ${
                                isStopwatch && isActive ? 'btn-subscribe' : 'bg-limeGreen hover:bg-green-600 text-black'
                            }`}
                        >
                            {isPaused ? "Resume" : "Start"}
                        </button>
                    ) : (
                        <button
                            onClick={pauseTimer}
                            className="btn-subscribe"
                        >
                            Pause
                        </button>
                    )}

                    {isStopwatch && isActive && (
                        <button
                            onClick={stopAndReset}
                            className="btn-skip"
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
                          className="btn-cancel"
                        >
                          Next
                        </button>
                    )}

                    {!isStopwatch && isRest && time > 0 && (
                        <button
                            onClick={skipRest}
                            className="btn-skip"
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
                            className="btn-cancel"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>

            {/* Instructions, Tips, and Progress Bar Section */}
            <div className="mt-4 flex flex-col justify-end">
                {exerciseInstructions && (
                    <div className="bg-gray-600 rounded-lg p-2 m-3 text-left">
                        <p><span className="text-limeGreen text-sm font-bold mb-2">Instructions: </span>
                        <span className="text-logoGray text-sm">{exerciseInstructions}</span></p>
                    </div>
                )}

                {exerciseTips && (
                    <div className="bg-gray-600 rounded-lg p-2 m-3 text-left">
                        <p><span className="text-limeGreen font-bold text-sm mb-2">Form Tips: </span>
                        <span className="text-logoGray text-sm">{exerciseTips}</span></p>
                    </div>
                )}
            </div>

            {/* Overall Progress Bar */}
            <div className="m-2 bg-gray-800 rounded-lg p-2 flex items-center space-x-2">
                <span className="text-sm text-logoGray whitespace-nowrap">Progress</span>
                <div className="flex-grow bg-gray-600 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${progressPercentage}%`,
                        }}
                    ></div>
                </div>
                <span className="text-sm text-logoGray whitespace-nowrap">
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
  shouldAutoStart: PropTypes.bool,
  showModified: PropTypes.bool,
  setShowModified: PropTypes.func.isRequired,
};

export default WorkoutTimer;