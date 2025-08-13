import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const WorkoutTimer = ({ 
  currentExercise, 
  nextExercise, 
  onExerciseComplete, 
  onGoBack,
  canGoBack,
  isRest = false,
  isStopwatch = false 
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

   // A single function to stop and reset the timer/stopwatch
  const stopAndReset = () => {
    clearInterval(intervalRef.current);
    setTime(isStopwatch ? 0 : parseDurationToSeconds(isRest ? currentExercise.rest : currentExercise.duration));
    setIsActive(false);
    setIsPaused(false);
  };

  useEffect(() => {
    stopAndReset();
  }, [currentExercise, isRest, isStopwatch]); 

  useEffect(() => {
    if (isStopwatch) {
      setTime(0);
      setIsActive(false);
      setIsPaused(false);
    } else if (currentExercise) {
      const durationStr = isRest ? currentExercise.rest : currentExercise.duration;
      const seconds = parseDurationToSeconds(durationStr);
      setTime(seconds);
      setIsActive(false);
      setIsPaused(false);
      if (seconds === 0 && isRest) {
        const timeoutId = setTimeout(() => {
          onExerciseComplete();
        }, 0);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [currentExercise, isRest, isStopwatch, onExerciseComplete]);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (isStopwatch) {
            return prev + 1; // Count up
          } else {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              onExerciseComplete();
              return 0;
            }
            return prev - 1; // Count down
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
    <div className="bg-gray-700 rounded-lg p-6 text-center">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-brightYellow mb-2">
          {isStopwatch ? 'Stopwatch' : isRest ? 'Rest Time' : currentExercise?.exercise?.name}
        </h3>
        {isRest && nextExercise?.exercise?.name && (
          <p className="text-logoGray text-sm">
            Next: {nextExercise.exercise.name}
          </p>
        )}
      </div>

      {/* Timer Display */}
      <div className="mb-6">
        <div className="text-6xl font-bold text-limeGreen mb-2">
          {formatTime(time)}
        </div>
        
        {/* Progress Bar */}
        {!isStopwatch && (
          <div className="w-full bg-gray-600 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-limeGreen to-brightYellow h-3 rounded-full transition-all duration-1000"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Timer Controls */}
      <div className="flex justify-center space-x-4">
        {canGoBack && (
          <button
            onClick={() => {
              clearInterval(intervalRef.current);
              onGoBack();
            }}
            className="btn-primary px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
          >
            Previous ⏪
          </button>
        )}

        {(!isActive || isPaused) ? (
          <button
            onClick={resumeTimer}
            className={`btn-primary px-6 py-2 rounded-lg ${
              isStopwatch && isActive ? 'bg-hotPink hover:bg-pink-600 text-white' : 'bg-limeGreen hover:bg-green-600 text-white'
            }`}
          >
            {isPaused ? "Resume" : "Start"}
          </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="btn-primary bg-hotPink hover:bg-pink-600 text-white px-6 py-2 rounded-lg"
            >
              Pause
            </button>
          )}
          
          {isStopwatch && (
            <button
              onClick={stopAndReset}
              className="btn-cancel px-6 py-2 rounded-lg"
            >
              Reset
            </button>
          )}

          {!isStopwatch && isRest && time > 0 && (
            <button
              onClick={skipRest}
              className="bg-brightYellow hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg"
            >
              Skip Rest ⏩
            </button>
          )}

          {!isStopwatch && !isRest && (
              <button 
                  onClick={() => {
                      clearInterval(intervalRef.current);
                      onExerciseComplete();
                  }}
                  className="btn-primary px-6 py-2 rounded-lg bg-brightYellow hover:bg-yellow-600 text-gray-900"
              >
                  Next Exercise
              </button>
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
    }),
  }),
  nextExercise: PropTypes.shape({
    exercise: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  onExerciseComplete: PropTypes.func.isRequired,
  isRest: PropTypes.bool,
  isStopwatch: PropTypes.bool 
};

export default WorkoutTimer; 