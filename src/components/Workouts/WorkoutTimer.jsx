import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const WorkoutTimer = ({ 
  currentExercise, 
  nextExercise, 
  onExerciseComplete, 
  onGoBack,
  canGoBack,
  isRest = false,
  isRoundRest = false,
  isStopwatch = false,
  exerciseInstructions,
  exerciseTips, 
  progressPercentage,
  currentBlockType, 
  currentExerciseNumber, 
  totalExercisesInBlock,
  currentRound = 1,
  totalRounds = 1,
  onShowModificationModal, 
  currentModification, 
  setShowModificationModal,
  shouldAutoStart = false,
  showModified,
  setShowModified, 
}) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Add debug logging to check if setShowModified is received
  useEffect(() => {
    // console.log("WorkoutTimer props check:", {
    //   setShowModified: typeof setShowModified,
    //   showModified,
    //   hasModification: !!currentExercise?.modification
    // });
  }, [setShowModified, showModified, currentExercise]);

  // Helper to parse duration strings into seconds
  const parseDurationToSeconds = (duration) => {
    // console.log("Parsing duration:", duration, "type:", typeof duration);
    
    if (typeof duration === 'number') return duration;
    if (typeof duration === 'string') {
      if (duration.trim() === "") {
        // console.log("Empty duration string, returning 0");
        return 0; 
      }
      
      // More comprehensive regex to handle various formats
      const match = duration.match(/(\d+)\s*(seconds?|secs?|sec|s|minutes?|mins?|min|m)/i);
      // console.log("Regex match result:", match);
      
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        // console.log("Parsed value:", value, "unit:", unit);
        
        if (unit.includes('min') || unit === 'm') {
          // console.log("Converting minutes to seconds:", value * 60);
          return value * 60;
        }
        // console.log("Returning seconds:", value);
        return value;
      } else {
        // console.log("No regex match for duration:", duration);
      }
    }
    // console.log("Fallback: returning 0 for duration:", duration);
    return 0; 
  };

 useEffect(() => {
    console.log("Timer initializing:", {
      isRest,
      isRoundRest,
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
    } else if (isRoundRest) {
        const roundRest = parseDurationToSeconds(currentExercise.rest);

        setTime(roundRest);
        // Use setTimeout to ensure state is properly set before starting timer
        setTimeout(() => {
          setIsActive(true);
          setIsPaused(false);
        }, 10);
    } else if (isRest) {
        const rest = parseDurationToSeconds(currentExercise.rest);
        // console.log("Rest duration parsed:", rest);
        setTime(rest);
        setIsActive(true);
        setIsPaused(false);
    } else {
        const exerciseDuration = parseDurationToSeconds(currentExercise.duration);
        // console.log("Exercise duration parsed:", exerciseDuration);
        setTime(exerciseDuration);
        setIsActive(shouldAutoStart);
        setIsPaused(false);
    }
  }, [currentExercise, isRest, isRoundRest, isStopwatch, shouldAutoStart]);

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
    }, [isActive, isPaused, isStopwatch, isRoundRest, isRest, onExerciseComplete]);

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
    let resetTime = 0;
    if (isStopwatch) {
      resetTime = 0;
    } else if (isRoundRest) {
      resetTime = parseDurationToSeconds(currentExercise.rest);
    } else if (isRest) {
      resetTime = parseDurationToSeconds(currentExercise.rest);
    } else {
      resetTime = parseDurationToSeconds(currentExercise.duration);
    }
    setTime(resetTime);
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
    let durationStr;
    if (isRoundRest || isRest) {
      durationStr = currentExercise.rest;
    } else {
      durationStr = currentExercise.duration;
    }
    const totalSeconds = parseDurationToSeconds(durationStr);
    return totalSeconds > 0 ? ((totalSeconds - time) / totalSeconds) * 100 : 0;
  };

  const activeExercise = showModified && currentExercise?.modification 
    ? currentExercise.modification 
    : currentExercise?.exercise;

  // Handle the modification button clicks with better error handling
  const handleOriginalClick = () => {
    // console.log("Original button clicked, setShowModified:", typeof setShowModified);
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
    // console.log("Modified button clicked, setShowModified:", typeof setShowModified);
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
        <div className="flex flex-col h-full justify-between">
          {totalRounds > 1 && currentBlockType !== 'AMRAP' && currentBlockType !== 'EMOM' && (
            <h2 className="text-customWhite text-2xl font-titillium font-semibold mb-4">
              Round <span className="text-brightYellow">{currentRound}</span> of <span className="text-brightYellow">{totalRounds}</span>
            </h2>
          )}
            {/* Timer Section */}
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="mb-2">
                <div className="flex flex-col items-center mb-2">
                  <h3 className="text-3xl font-bold text-customWhite">
                      {isStopwatch ? activeExercise?.name : isRoundRest ? 'Round Rest' : isRest ? 'Rest Time' : activeExercise?.name}
                  </h3>
                  <p className="text-logoGray text-xs">
                    Exercise {currentExerciseNumber} of {totalExercisesInBlock}
                  </p>
                  {currentBlockType === 'AMRAP' && (
                    <p className="text-brightYellow text-sm font-semibold">
                      AMRAP - Keep Going!
                    </p>
                  )}
                  {currentBlockType === 'EMOM' && (
                    <p className="text-brightYellow text-sm font-semibold">
                      EMOM - Every Minute On the Minute!
                    </p>
                  )}
                </div>
              </div>

                {/* Modification Toggle Buttons - only show during exercise, not rest */}
                {currentExercise?.modification && !isRest && !isRoundRest && (
                  <div className="flex justify-center mb-2 space-x-2">
                    <button
                      onClick={handleOriginalClick}
                      className={`${
                        !showModified
                          ? "btn-primary p-2 mt-2"
                          : "btn-cancel p-2 mt-2"
                      }`}
                    >
                      Original
                    </button>
                    <button
                      onClick={handleModifiedClick}
                      className={`${
                        showModified
                          ? "btn-primary p-2 mt-2"
                          : "btn-cancel p-2 mt-2"
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

                {/* Overall Progress Bar */}
                <div className="flex justify-center w-full mt-4">
                  <div className="bg-gray-400 rounded-full h-3 w-1/2">
                    <div
                        className="bg-gradient-to-r from-limeGreen via-brightYellow to-hotPink h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${progressPercentage}%`,
                        }}
                    ></div>
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
                      className="btn-cancel px-3 py-2"
                    >
                      Back
                    </button>
                  )}

                  {(!isActive || isPaused) ? (
                    <button
                      onClick={resumeTimer}
                      className={`btn-full-colour px-3 py-2 ${
                          isStopwatch && isActive ? 'btn-subscribe px-3 py-2' : 'px-3 py-2 bg-limeGreen hover:bg-green-600 text-black'
                      }`}
                    >
                      {isPaused ? "Resume" : "Start"}
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="btn-subscribe px-3 py-2"
                    >
                      Pause
                    </button>
                    )}

                    {isStopwatch && isActive && (
                      <button
                        onClick={stopAndReset}
                        className="btn-skip px-3 py-2"
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
                        className="btn-cancel px-3 py-2"
                      >
                        Next
                      </button>
                    )}

                    {!isStopwatch && (isRest || isRoundRest) && time > 0 && (
                      <button
                        onClick={skipRest}
                        className="btn-skip px-3 py-2"
                      >
                        Skip
                      </button>
                    )}

                    {!isStopwatch && !isRest && !isRoundRest && (
                      <button
                        onClick={() => {
                            clearInterval(intervalRef.current);
                            onExerciseComplete();
                        }}
                        className="btn-cancel px-3 py-2"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>

            {/* Instructions, Tips, and Progress Bar Section */}
            <div className="mt-4 flex flex-col justify-end">
                {exerciseInstructions && (
                    <div className="bg-gray-600 rounded-lg p-2 text-left">
                        <p><span className="text-limeGreen text-sm font-bold mb-2">Instructions: </span>
                        <span className="text-logoGray text-sm">{exerciseInstructions}</span></p>
                    </div>
                )}

                {exerciseTips && (
                    <div className="bg-gray-600 rounded-lg p-2 mt-3 text-left">
                        <p><span className="text-limeGreen font-bold text-sm mb-2">Form Tips: </span>
                        <span className="text-logoGray text-sm">{exerciseTips}</span></p>
                    </div>
                )}
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
  isRoundRest: PropTypes.bool,
  isStopwatch: PropTypes.bool,
  exerciseInstructions: PropTypes.string,
  exerciseTips: PropTypes.string,
  progressPercentage: PropTypes.number,
  currentBlockType: PropTypes.string,
  currentExerciseNumber: PropTypes.number,
  totalExercisesInBlock: PropTypes.number,
  currentRound: PropTypes.number,
  totalRounds: PropTypes.number,
  onShowModificationModal: PropTypes.func.isRequired, 
  currentModification: PropTypes.object, 
  setShowModificationModal: PropTypes.func.isRequired, 
  shouldAutoStart: PropTypes.bool,
  showModified: PropTypes.bool,
  setShowModified: PropTypes.func.isRequired,
};

export default WorkoutTimer;