import React from 'react';
import PropTypes from 'prop-types';

const ExerciseVideo = ({ exercise, shouldAutoStart = false, showModified = false, isMobility = false }) => {
  // console.log("ExerciseVideo received:", { exercise, showModified });

  const getActiveExercise = () => {
    if (!exercise) return null;
    
    // Check if we're showing modified and there's a modification available
    if (showModified && exercise.exercise?.modification) {
      // console.log("Using modified exercise:", exercise.exercise.modification);
      return exercise.exercise.modification;
    }
    
    // Otherwise use the base exercise
    const baseExercise = exercise.exercise || exercise;
    // console.log("Using base exercise:", baseExercise);
    return baseExercise;
  };

  const activeExercise = getActiveExercise();
  const videoId = activeExercise?.videoId;
  const exerciseName = activeExercise?.name;

  // console.log("Active exercise details:", { activeExercise, videoId, exerciseName, showModified });

  const getVideoUrl = (id) => {
    if (!id) return null;
    
    if (id.length === 11) {
      // For mobility videos, always autoplay. For regular exercises, use shouldAutoStart
      const autoplayParam = (isMobility || shouldAutoStart) ? 'autoplay=1' : 'autoplay=0';
      return `https://www.youtube.com/embed/${id}?${autoplayParam}&modestbranding=1&rel=0&controls=1`;
    }
    return null;
  };

  const videoUrl = getVideoUrl(videoId);

  return (
    <div className="flex flex-col h-full">
      {/* Video Display */}
      <div className={`flex-1 relative rounded-lg border-0 overflow-hidden mb-4 ${
        isMobility ? 'min-h-[70vh]' : 'min-h-[60vh]'
      }`}>
        {videoUrl ? (
          <iframe
            key={`${videoId}-${shouldAutoStart}-${showModified}`}
            className="absolute top-0 left-0 w-full h-full"
            src={videoUrl}
            title={exerciseName}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-logoGray text-lg mb-2">
                {exerciseName} Demo
                {showModified && exercise?.exercise?.modification && (
                  <span className="text-limeGreen ml-2">(Modified)</span>
                )}
              </p>
              <p className="text-logoGray text-sm">
                {videoId ?
                  `Video ID: ${videoId}` :
                  'Video placeholder - Add your exercise demo'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ExerciseVideo.propTypes = {
  exercise: PropTypes.shape({
    name: PropTypes.string,
    videoId: PropTypes.string,
    exercise: PropTypes.shape({
      name: PropTypes.string,
      videoId: PropTypes.string,
      modification: PropTypes.shape({
        name: PropTypes.string,
        videoId: PropTypes.string,
      }),
    }),
    modification: PropTypes.shape({
      name: PropTypes.string,
      videoId: PropTypes.string,
    }),
  }),
  shouldAutoStart: PropTypes.bool,
  showModified: PropTypes.bool,
  isMobility: PropTypes.bool,
};

export default ExerciseVideo;