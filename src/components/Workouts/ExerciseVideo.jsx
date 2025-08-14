import React from 'react';
import PropTypes from 'prop-types';

const ExerciseVideo = ({ exercise }) => {
  const videoId = exercise?.exercise?.videoId;
  const exerciseName = exercise?.exercise?.name;
  const exerciseTips = exercise?.exercise?.tips;
  const exerciseInstructions = exercise?.exercise?.instructions;
  const duration = exercise?.duration;
  const restDuration = exercise?.restDuration;


  const getVideoUrl = (id) => {
    if (!id) return null;
    
    if (id.length === 11) {
      return `https://www.youtube.com/embed/${id}?autoplay=1&modestbranding=1&rel=0&controls=1`;
    }
    
    return null;
  };

  const videoUrl = getVideoUrl(videoId);

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-brightYellow mb-2">
          {exerciseName}
        </h3>
        <div className="text-logoGray text-sm space-y-1">
          <p><strong>Duration:</strong> {duration}</p>
          <p><strong>Rest:</strong> {restDuration}</p>
        </div>
      </div>

      {/* Video Display */}
      <div className="relative bg-black rounded-lg border-0 aspect-video overflow-hidden mb-4">
        {videoUrl ? (
          <iframe
            className="w-full h-full"
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
              </p>
              <p className="text-logoGray text-sm">
                {videoId ? 
                  `Video ID: ${videoId}` : 
                  'Video placeholder - Add your exercise demo'
                }
              </p>
               {exerciseTips && (
                <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                  <p className="text-sm text-logoGray">
                    💡 <span className="text-brightYellow font-semibold">Form Tip:</span> {exerciseTips}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Exercise Instructions */}
      {exerciseInstructions && (
        <div className="bg-gray-600 rounded-lg p-3 mb-4">
          <h4 className="text-limeGreen font-bold mb-2">Instructions:</h4>
          <p className="text-logoGray text-sm">{exerciseInstructions}</p>
        </div>
      )}

      {/* Form Tips */}
      {exerciseTips && !videoUrl && (
        <div className="bg-gray-600 rounded-lg p-3">
          <h4 className="text-limeGreen font-bold mb-2">Form Tips:</h4>
          <p className="text-logoGray text-sm">{exerciseTips}</p>
        </div>
      )}
    </div>
  );
};

ExerciseVideo.propTypes = {
  exercise: PropTypes.shape({
    duration: PropTypes.string,
    restDuration: PropTypes.string,
    exercise: PropTypes.shape({
      name: PropTypes.string,
      videoId: PropTypes.string,
      tips: PropTypes.string,
      instructions: PropTypes.string,
    }),
  }),
};

export default ExerciseVideo; 