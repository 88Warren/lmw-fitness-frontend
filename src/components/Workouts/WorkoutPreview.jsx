import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DynamicHeading from '../Shared/DynamicHeading';

const WorkoutPreview = ({ workoutData, onStartWorkout, onGoBackToProgram }) => {
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

  const handleExerciseClick = (index) => {
    setCurrentExerciseIndex(index);
    setIsPlaying(false); 
  };

return (
    <div className="bg-customGray p-4 rounded-lg text-center max-w-7xl w-full h-full lg:max-h-[90vh] flex flex-col border-brightYellow border-2 mt-10">
      {/* Title section */}
      <div className="flex flex-col items-center mb-4">
        <DynamicHeading 
          text="Workout Preview"
          className="font-higherJump text-2xl md:text-3xl font-bold text-customWhite leading-loose tracking-widest"
        />
        <p className="text-logoGray text-sm md:text-base">
          {workoutData.title} • {totalExercises} exercises
        </p>
      </div>

      {/* All buttons together in a single flex container at the top */}
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <button
          onClick={onStartWorkout}
          className="btn-full-colour bg-brightYellow hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg text-base md:text-lg font-bold shadow-lg"
        >
          Start Workout
        </button>
        <button
          onClick={onGoBackToProgram}
          className="btn-cancel px-6 py-2 rounded-lg text-base md:text-lg font-bold"
        >
          Back to Program
        </button>
      </div>

      {/* Main content container for the two-column layout */}
      <div className="flex flex-grow flex-col lg:flex-row lg:items-start justify-center gap-6 overflow-hidden">
      
        {/* Left-hand side: Video and Exercise Name only */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-full max-w-md aspect-video rounded-lg mb-4 overflow-hidden">
            {currentExercise?.exercise?.videoId ? (
              <iframe
                key={currentExercise.exercise.videoId} 
                className="w-full h-full border-0"
                src={`https://www.youtube.com/embed/${currentExercise.exercise.videoId}?controls=1&modestbranding=1&rel=0&autoplay=1&mute=1`}
                title="YouTube video player"
                allow="accelerometer; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <p className="text-logoGray text-sm">Video not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Right-hand side: Exercise List with Duration and Rest */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start mb-8">
          <div className="space-y-1 overflow-y-auto w-full text-left max-h-[40vh] lg:max-h-[calc(90vh - 200px)]"> 
            {allExercises.map((exercise, index) => (
              <div
                key={index}
                onClick={() => handleExerciseClick(index)}
                className={`p-2 rounded-md text-sm transition-colors duration-200  cursor-pointer mr-2 ${
                  index === currentExerciseIndex
                    ? 'bg-limeGreen text-gray-900'
                    : 'text-logoGray'
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span>{exercise.exercise.name}</span>
                  <span className="text-xs md:text-sm">
                    {exercise.duration} | {exercise.rest}
                  </span>
                </div>
                {exercise.tips && (
                  <p className="mt-1 italic text-xs">💡 {exercise.tips}</p>
                )}
              </div>
            ))}
          </div>
        </div>
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
            rest: PropTypes.string,
            tips: PropTypes.string,
          })
        ),
      })
    ),
  }).isRequired,
  onStartWorkout: PropTypes.func.isRequired,
  onGoBackToProgram: PropTypes.func.isRequired,
};

export default WorkoutPreview;