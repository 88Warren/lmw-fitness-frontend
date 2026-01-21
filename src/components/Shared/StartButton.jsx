import React from 'react';
import PropTypes from 'prop-types';
import usePreparationCountdown from '../../hooks/usePreparationCountdown';

const StartButton = ({ 
  onStart, 
  playBeep, 
  playStartSound, 
  isActive, 
  isPaused, 
  onResume,
  onPause,
  className = "",
  disabled = false,
  showPreparationCountdown = true,
  preparationMessage = "Get Ready!",
  exerciseName = ""
}) => {
  const {
    isPreparationCountdown,
    preparationTime,
    startPreparationCountdown,
  } = usePreparationCountdown(playBeep, playStartSound);

  const handleStartClick = () => {
    if (showPreparationCountdown && !isActive && !isPaused) {
      // Start with preparation countdown
      startPreparationCountdown(() => {
        if (onStart) {
          onStart();
        }
      });
    } else if (isPaused) {
      // Resume from pause
      if (onResume) {
        onResume();
      }
    } else if (!isActive) {
      // Direct start without preparation
      if (onStart) {
        onStart();
      }
    }
  };

  const handlePauseClick = () => {
    if (onPause) {
      onPause();
    }
  };

  // Show preparation countdown UI
  if (isPreparationCountdown) {
    return (
      <div className="text-center">
        {/* Preparation countdown display */}
        <div className="mb-4">
          <div className="text-6xl text-brightYellow animate-pulse font-bold">
            {preparationTime}
          </div>
          <div className="text-brightYellow font-semibold text-lg">
            {preparationMessage}
          </div>
          {exerciseName && (
            <div className="text-logoGray text-sm mt-1">
              Prepare for: {exerciseName}
            </div>
          )}
          <div className="text-center mt-2">
            <span className="text-brightYellow font-semibold text-sm animate-bounce">
              🏃‍♀️ Get in position!
            </span>
          </div>
        </div>
        
        {/* Disabled button during countdown */}
        <button
          disabled
          className={`btn-full-colour opacity-50 cursor-not-allowed bg-brightYellow text-black ${className}`}
        >
          Get Ready...
        </button>
      </div>
    );
  }

  // Regular start/pause/resume button
  if (!isActive || isPaused) {
    return (
      <div className="text-center">
        {/* Guidance message */}
        {!isActive && !isPaused && showPreparationCountdown && (
          <div className="mb-4 p-3 rounded-lg">
            <p className="text-brightYellow font-semibold text-sm">
              🎯 Ready to start? Tap START for a 5-second countdown!
            </p>
            <p className="text-logoGray text-xs mt-1">
              (You&apos;ll get 5 seconds to get in position)
            </p>
          </div>
        )}
        
        <button
          onClick={handleStartClick}
          disabled={disabled}
          className={`btn-full-colour bg-limeGreen hover:bg-green-600 text-black ${className} ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isPaused ? "Resume" : "Start"}
        </button>
      </div>
    );
  }

  // Pause button when active
  return (
    <button
      onClick={handlePauseClick}
      disabled={disabled}
      className={`btn-subscribe ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      Pause
    </button>
  );
};

StartButton.propTypes = {
  onStart: PropTypes.func.isRequired,
  playBeep: PropTypes.func,
  playStartSound: PropTypes.func,
  isActive: PropTypes.bool.isRequired,
  isPaused: PropTypes.bool.isRequired,
  onResume: PropTypes.func,
  onPause: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  showPreparationCountdown: PropTypes.bool,
  preparationMessage: PropTypes.string,
  exerciseName: PropTypes.string,
};

export default StartButton;