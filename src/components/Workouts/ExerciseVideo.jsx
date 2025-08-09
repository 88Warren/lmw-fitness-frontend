import React from 'react';
import PropTypes from 'prop-types';

const ExerciseVideo = ({ exercise }) => {
  // Replace these with your actual video IDs
  const getVideoUrl = (videoId) => {
    if (!videoId) return null;
    
    // If it's a YouTube video ID
    if (videoId.length === 11) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0&controls=1`;
    }
    
    // If it's a direct video URL
    if (videoId.startsWith('http')) {
      return videoId;
    }
    
    // Default placeholder
    return null;
  };

  const videoUrl = getVideoUrl(exercise?.video_id);

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-brightYellow mb-2">
          {exercise?.name}
        </h3>
        <div className="text-logoGray text-sm space-y-1">
          <p><strong>Duration:</strong> {exercise?.duration}</p>
          <p><strong>Rest:</strong> {exercise?.rest}</p>
        </div>
      </div>

      {/* Video Display */}
      <div className="relative bg-black rounded-lg aspect-video overflow-hidden mb-4">
        {videoUrl ? (
          <iframe
            className="w-full h-full"
            src={videoUrl}
            title={exercise?.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-logoGray text-lg mb-2">
                {exercise?.name} Demo
              </p>
              <p className="text-logoGray text-sm">
                {exercise?.video_id ? 
                  `Video ID: ${exercise.video_id}` : 
                  'Video placeholder - Add your exercise demo'
                }
              </p>
              {exercise?.tips && (
                <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                  <p className="text-sm text-logoGray">
                    💡 <span className="text-brightYellow font-semibold">Form Tip:</span> {exercise.tips}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Exercise Instructions */}
      {exercise?.instructions && (
        <div className="bg-gray-600 rounded-lg p-3 mb-4">
          <h4 className="text-limeGreen font-bold mb-2">Instructions:</h4>
          <p className="text-logoGray text-sm">{exercise.instructions}</p>
        </div>
      )}

      {/* Form Tips */}
      {exercise?.tips && !videoUrl && (
        <div className="bg-gray-600 rounded-lg p-3">
          <h4 className="text-limeGreen font-bold mb-2">Form Tips:</h4>
          <p className="text-logoGray text-sm">{exercise.tips}</p>
        </div>
      )}
    </div>
  );
};

ExerciseVideo.propTypes = {
  exercise: PropTypes.shape({
    name: PropTypes.string,
    duration: PropTypes.string,
    rest: PropTypes.string,
    video_id: PropTypes.string,
    tips: PropTypes.string,
    instructions: PropTypes.string,
  }),
};

export default ExerciseVideo; 