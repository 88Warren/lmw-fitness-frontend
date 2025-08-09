import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const WorkoutTimer = ({ 
  currentExercise, 
  nextExercise, 
  onExerciseComplete, 
  isRest = false 
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (currentExercise) {
      const duration = isRest ? currentExercise.rest : currentExercise.duration;
      const seconds = parseDurationToSeconds(duration);
      setTimeLeft(seconds);
      setIsActive(false);
      setIsPaused(false);
    }
  }, [currentExercise, isRest]);

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            onExerciseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, timeLeft, onExerciseComplete]);

  const parseDurationToSeconds = (duration) => {
    if (typeof duration === 'number') return duration;
    if (typeof duration === 'string') {
      const match = duration.match(/(\d+)\s*(seconds?|secs?|s|minutes?|mins?|m)/i);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        if (unit.includes('min')) return value * 60;
        return value;
      }
    }
    return 60; // default 60 seconds
  };

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

  const resetTimer = () => {
    const duration = isRest ? currentExercise.rest : currentExercise.duration;
    const seconds = parseDurationToSeconds(duration);
    setTimeLeft(seconds);
    setIsActive(false);
    setIsPaused(false);
  };

  const getProgressPercentage = () => {
    const duration = isRest ? currentExercise.rest : currentExercise.duration;
    const totalSeconds = parseDurationToSeconds(duration);
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  return (
    <div className="bg-gray-700 rounded-lg p-6 text-center">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-brightYellow mb-2">
          {isRest ? 'Rest Time' : currentExercise?.name}
        </h3>
        {isRest && nextExercise && (
          <p className="text-logoGray text-sm">
            Next: {nextExercise.name}
          </p>
        )}
      </div>

      {/* Timer Display */}
      <div className="mb-6">
        <div className="text-6xl font-bold text-limeGreen mb-2">
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-600 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-limeGreen to-brightYellow h-3 rounded-full transition-all duration-1000"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex justify-center space-x-4">
        {!isActive ? (
          <button
            onClick={startTimer}
            className="btn-primary bg-limeGreen hover:bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Start
          </button>
        ) : isPaused ? (
          <button
            onClick={resumeTimer}
            className="btn-primary bg-brightYellow hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg"
          >
            Resume
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="btn-primary bg-hotPink hover:bg-pink-600 text-white px-6 py-2 rounded-lg"
          >
            Pause
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="btn-cancel px-6 py-2 rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* Exercise Tips */}
      {!isRest && currentExercise?.tips && (
        <div className="mt-4 p-3 bg-gray-600 rounded-lg">
          <p className="text-sm text-logoGray">
            💡 <span className="text-brightYellow font-semibold">Tip:</span> {currentExercise.tips}
          </p>
        </div>
      )}
    </div>
  );
};

WorkoutTimer.propTypes = {
  currentExercise: PropTypes.shape({
    name: PropTypes.string,
    duration: PropTypes.string,
    rest: PropTypes.string,
    tips: PropTypes.string,
  }),
  nextExercise: PropTypes.shape({
    name: PropTypes.string,
  }),
  onExerciseComplete: PropTypes.func.isRequired,
  isRest: PropTypes.bool,
};

export default WorkoutTimer; 