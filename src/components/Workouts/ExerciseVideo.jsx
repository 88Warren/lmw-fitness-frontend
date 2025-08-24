import React from 'react';
import PropTypes from 'prop-types';

const ExerciseVideo = ({ exercise, shouldAutoStart = false }) => {
  const videoId = exercise?.videoId || exercise?.exercise?.videoId;
  const exerciseName = exercise?.name || exercise?.exercise?.name;

  const getVideoUrl = (id) => {
    if (!id) return null;
    
    if (id.length === 11) {
      const autoplayParam = shouldAutoStart ? 'autoplay=1' : 'autoplay=0';
      return `https://www.youtube.com/embed/${id}?${autoplayParam}&modestbranding=1&rel=0&controls=1`;
    }
    return null;
  };

  const videoUrl = getVideoUrl(videoId);

    return (
        <div className="flex flex-col h-full">
            {/* Video Display */}
            <div className="flex-1 min-h-[60vh] relative rounded-lg border-0 overflow-hidden mb-4">
                {videoUrl ? (
                    <iframe
                        key={`${videoId}-${shouldAutoStart}`}
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
    }),
  }),
};

export default ExerciseVideo;