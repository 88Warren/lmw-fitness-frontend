import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const WorkoutPreview = ({ workoutData, onStartWorkout, onGoBackToProfile }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const allExercises = workoutData?.workoutBlocks?.flatMap(block => block.exercises) || [];
  const totalExercises = allExercises.length;
   const currentExercise = allExercises[currentExerciseIndex];

  useEffect(() => {
    if (isPlaying && totalExercises > 0) {
      const interval = setInterval(() => {
        setCurrentExerciseIndex(prev => {
          if (prev >= totalExercises - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, totalExercises]);

  const startPreview = () => {
    setIsPlaying(true);
    setCurrentExerciseIndex(0);
  };

  const stopPreview = () => {
    setIsPlaying(false);
  };


  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-limeGreen">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-brightYellow mb-2 font-higherJump">
          Today&apos;s Workout Preview
        </h2>
        <p className="text-logoGray">
          {workoutData.title} • {totalExercises} exercises
        </p>
      </div>

      {/* Exercise Preview */}
      <div className="mb-6">
        <div className="bg-gray-700 rounded-lg p-4 text-center">
          <h3 className="text-xl font-bold text-limeGreen mb-2">
            {currentExercise?.exercise?.name || 'Loading...'}
          </h3>
          
          {/* Video Placeholder - Replace with your actual video */}
          <div className="rounded-lg aspect-video mb-4 overflow-hidden">
          {currentExercise?.exercise?.videoId ? (
              <iframe
                  className="w-full h-full"
                  // FIX: Remove autoplay and mute. Add `rel=0` to hide related videos.
                  src={`https://www.youtube.com/embed/${currentExercise.exercise.videoId}?controls=1&modestbranding=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; gyroscope; picture-in-picture"
                  allowFullScreen
              ></iframe>
              ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                      <p className="text-logoGray">Video not available</p>
                  </div>
              )}
          </div>

          <div className="text-logoGray text-sm">
            {/* FIX: Access duration and rest from the correct properties */}
            <p><strong>Duration:</strong> {currentExercise?.duration}</p>
            <p><strong>Rest:</strong> {currentExercise?.rest_duration}</p>
            {currentExercise?.tips && (
              <p className="mt-2 italic">💡 {currentExercise.tips}</p>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mt-4">
          {allExercises.map((_, index) => (
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
      
      {/* Exercise List - Now iterates over the `allExercises` array */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-brightYellow mb-3">Full Workout:</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {allExercises.map((exercise, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-sm ${
                index === currentExerciseIndex
                  ? 'bg-limeGreen text-gray-900'
                  : 'bg-gray-700 text-logoGray'
              }`}
            >
              <span className="font-bold">{index + 1}.</span> {exercise.exercise.name} - {exercise.duration}
            </div>
          ))}
        </div>
      </div>
      
       {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onGoBackToProfile} // New button
          className="btn-cancel px-6 py-2 rounded-lg"
        >
          Back to Profile
        </button>
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
      </div>
    </div>
  );
};

WorkoutPreview.propTypes = {
  workoutData: PropTypes.shape({
    title: PropTypes.string,
    workoutBlocks: PropTypes.arrayOf(
      PropTypes.shape({
        exercises: PropTypes.arrayOf(
          PropTypes.shape({
            exercise: PropTypes.shape({ 
                name: PropTypes.string,
                video_id: PropTypes.string,
             }),
            duration: PropTypes.string,
            rest_duration: PropTypes.string,
            tips: PropTypes.string,
          })
        ),
      })
    ),
  }).isRequired,
  onStartWorkout: PropTypes.func.isRequired,
  onSkipPreview: PropTypes.func.isRequired,
};

export default WorkoutPreview;