import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const WorkoutPreview = ({ exercises, onStartWorkout, onSkipPreview }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && exercises.length > 0) {
      const interval = setInterval(() => {
        setCurrentExerciseIndex(prev => {
          if (prev >= exercises.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000); // Show each exercise for 2 seconds

      return () => clearInterval(interval);
    }
  }, [isPlaying, exercises.length]);

  const startPreview = () => {
    setIsPlaying(true);
    setCurrentExerciseIndex(0);
  };

  const stopPreview = () => {
    setIsPlaying(false);
  };

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-limeGreen">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-brightYellow mb-2 font-higherJump">
          Today&apos;s Workout Preview
        </h2>
        <p className="text-logoGray">
          {exercises.length} exercises • {exercises.length * 2} minutes total
        </p>
      </div>

      {/* Exercise Preview */}
      <div className="mb-6">
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <h3 className="text-xl font-bold text-limeGreen mb-2">
            {currentExercise?.name || 'Loading...'}
          </h3>
          
          {/* Video Placeholder - Replace with your actual video */}
          <div className="bg-black rounded-lg aspect-video mb-4 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🎥</div>
              <p className="text-logoGray text-sm">
                {currentExercise?.video_id ? 
                  `Video: ${currentExercise.video_id}` : 
                  'Exercise Demo Video'
                }
              </p>
            </div>
          </div>

          <div className="text-logoGray text-sm">
            <p><strong>Duration:</strong> {currentExercise?.duration}</p>
            <p><strong>Rest:</strong> {currentExercise?.rest}</p>
            {currentExercise?.tips && (
              <p className="mt-2 italic">💡 {currentExercise.tips}</p>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mt-4">
          {exercises.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentExerciseIndex 
                  ? 'bg-limeGreen' 
                  : index < currentExerciseIndex 
                    ? 'bg-brightYellow' 
                    : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Exercise List */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-brightYellow mb-3">Full Workout:</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-sm ${
                index === currentExerciseIndex
                  ? 'bg-limeGreen text-gray-900'
                  : 'bg-gray-700 text-logoGray'
              }`}
            >
              <span className="font-bold">{index + 1}.</span> {exercise.name} - {exercise.duration}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {!isPlaying ? (
          <button
            onClick={startPreview}
            className="btn-primary bg-limeGreen hover:bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Play Preview
          </button>
        ) : (
          <button
            onClick={stopPreview}
            className="btn-primary bg-hotPink hover:bg-pink-600 text-white px-6 py-2 rounded-lg"
          >
            Stop Preview
          </button>
        )}
        
        <button
          onClick={onStartWorkout}
          className="btn-primary bg-brightYellow hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg"
        >
          Start Workout
        </button>
        
        <button
          onClick={onSkipPreview}
          className="btn-cancel px-6 py-2 rounded-lg"
        >
          Skip Preview
        </button>
      </div>
    </div>
  );
};

WorkoutPreview.propTypes = {
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      duration: PropTypes.string,
      rest: PropTypes.string,
      video_id: PropTypes.string,
      tips: PropTypes.string,
    })
  ).isRequired,
  onStartWorkout: PropTypes.func.isRequired,
  onSkipPreview: PropTypes.func.isRequired,
};

export default WorkoutPreview; 