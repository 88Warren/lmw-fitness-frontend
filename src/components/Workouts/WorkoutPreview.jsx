import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DynamicHeading from '../Shared/DynamicHeading';

const WorkoutPreview = ({ workoutData, onStartWorkout, onGoBackToProgram }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isApiReady, setIsApiReady] = useState(false); 
  const [player, setPlayer] = useState(null);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const hasStartedPlayingRef = useRef(false); // Use ref to track immediate state
  const allExercises = workoutData?.workoutBlocks?.flatMap(block => block.exercises) || [];
  const totalExercises = allExercises.length;
  const currentExercise = allExercises[currentExerciseIndex];
  const iframeRef = useRef(null);

  // Load YouTube API
  useEffect(() => {
    const onYouTubeIframeAPIReady = () => {
      setIsApiReady(true);
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else {
      setIsApiReady(true);
    }
  }, []);
    
  // Create/update YouTube player when API is ready or exercise changes
  useEffect(() => {
    if (isApiReady && currentExercise?.exercise?.videoId) {
      // Destroy existing player if it exists
      if (player) {
        player.destroy();
      }

      // Create a unique div for each video
      const playerDiv = document.createElement('div');
      playerDiv.id = `youtube-player-${currentExerciseIndex}`;
      
      // Clear the container and add the new div
      if (iframeRef.current) {
        iframeRef.current.innerHTML = '';
        iframeRef.current.appendChild(playerDiv);
      }

      // Create new player
      const newPlayer = new window.YT.Player(playerDiv.id, {
        width: '100%',
        height: '100%',
        videoId: currentExercise.exercise.videoId,
        playerVars: {
          controls: 1,
          modestbranding: 1,
          rel: 0,
          autoplay: hasStartedPlaying ? 1 : 0, // Only autoplay if user has started playing
          mute: 0,
        },
        events: {
          'onReady': (event) => {
            console.log('YouTube player ready');
            // If user has already started playing and this is not the first video, start playing
            if (hasStartedPlayingRef.current && currentExerciseIndex > 0) {
              console.log('Auto-starting video for exercise:', currentExerciseIndex);
              event.target.playVideo();
            }
          },
          'onStateChange': (event) => {
            console.log('Player state changed:', event.data);
            // Track when user starts playing for the first time
            if (event.data === window.YT.PlayerState.PLAYING && !hasStartedPlayingRef.current) {
              console.log('Setting hasStartedPlaying to true');
              setHasStartedPlaying(true);
              hasStartedPlayingRef.current = true; // Set ref immediately
            }
            
            if (event.data === window.YT.PlayerState.ENDED) {
              console.log('Video ended, moving to next exercise');
              // Ensure hasStartedPlaying is true for next videos
              hasStartedPlayingRef.current = true;
              setHasStartedPlaying(true);
              
              // Move to next exercise
              setCurrentExerciseIndex(prev => {
                const nextIndex = prev + 1;
                return nextIndex < totalExercises ? nextIndex : prev;
              });
            }
          },
          'onError': (event) => {
            console.error('YouTube player error:', event.data);
          }
        }
      });

      setPlayer(newPlayer);
    }
  }, [isApiReady, currentExerciseIndex, totalExercises, currentExercise, hasStartedPlaying]);

  // Cleanup player on unmount
  useEffect(() => {
    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [player]);

  const handleExerciseClick = (index) => {
    console.log('Exercise clicked:', index);
    setCurrentExerciseIndex(index);
  };

  if (totalExercises === 0) {
    return (
      <div className="bg-customGray p-4 rounded-lg text-center max-w-5xl w-full h-full lg:max-h-[90vh] flex flex-col border-brightYellow border-2 mt-10 justify-center items-center">
        <p className="text-customWhite text-xl font-bold">No exercises found for this workout.</p>
        <button
          onClick={onGoBackToProgram}
          className="btn-cancel mt-4 px-6 py-2 rounded-lg text-base md:text-lg font-bold"
        >
          Back to Program
        </button>
      </div>
    );
  }

  return (
    <div className="bg-customGray p-4 rounded-lg text-center max-w-5xl w-full h-full lg:max-h-[90vh] flex flex-col border-brightYellow border-2 mt-10">
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
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-full max-w-md aspect-video rounded-lg mb-4 overflow-hidden bg-black">
            {currentExercise?.exercise?.videoId ? (
              <div
                ref={iframeRef}
                className="w-full h-full"
                style={{ minHeight: '200px' }}
              />
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <p className="text-logoGray text-sm">Video not available</p>
              </div>
            )}
          </div>

          {/* Display tips for current exercise */}
          {currentExercise?.exercise?.tips && (
            <div className="bg-gray-800 rounded-lg p-3 w-full max-w-md text-center">
              <p className="text-logoGray text-sm italic">💡 {currentExercise.exercise.tips}</p>
            </div>
          )}
        </div>

        {/* Right-hand side: Exercise List with Duration and Rest */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start mb-8">
          <div className="space-y-2 overflow-y-auto w-full text-left max-h-[40vh] lg:max-h-[calc(90vh - 200px)]"> 
            {allExercises.map((exercise, index) => (
              <div
                key={index}
                onClick={() => handleExerciseClick(index)}
                className={`p-3 rounded-md text-sm transition-colors duration-200 cursor-pointer mr-2 ${
                  index === currentExerciseIndex
                    ? 'bg-limeGreen text-gray-900'
                    : 'text-logoGray hover:bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span className={`${index === currentExerciseIndex ? 'text-gray-900' : 'text-customWhite'}`}>
                    {exercise.exercise.name}
                  </span>
                  
                  <div className="flex items-center space-x-4 text-xs md:text-sm">
                    {/* Exercise Time */}
                    <span className={`flex items-center space-x-1 ${index === currentExerciseIndex ? 'text-gray-900' : 'text-logoGray'}`}>
                      <span className="font-bold">EXERCISE:</span>
                      <span>{exercise.duration}</span>
                    </span>
                    
                    {/* Rest Time */}
                    <span className={`flex items-center space-x-1 ${index === currentExerciseIndex ? 'text-gray-900' : 'text-logoGray'}`}>
                      <span className="font-bold">REST:</span>
                      <span>{exercise.rest}</span>
                    </span>
                  </div>
                </div>
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
              videoId: PropTypes.string,
              tips: PropTypes.string,
            }),
            duration: PropTypes.string,
            rest: PropTypes.string,
          })
        ),
      })
    ),
  }).isRequired,
  onStartWorkout: PropTypes.func.isRequired,
  onGoBackToProgram: PropTypes.func.isRequired,
};

export default WorkoutPreview;