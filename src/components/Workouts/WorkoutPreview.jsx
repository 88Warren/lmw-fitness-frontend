import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DynamicHeading from '../Shared/DynamicHeading';

const WorkoutPreview = ({ workoutData, onStartWorkout, onGoBackToProgram }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isApiReady, setIsApiReady] = useState(false); 
  const [player, setPlayer] = useState(null);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const hasStartedPlayingRef = useRef(false); 
  const allExercises = workoutData?.workoutBlocks?.flatMap(block => block.exercises) || [];
  const totalExercises = allExercises.length;
  const currentExercise = allExercises[currentExerciseIndex];
  const iframeRef = useRef(null);
  const [showModified, setShowModified] = useState(false);

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
    
  useEffect(() => {
    const videoToPlay = showModified && currentExercise?.exercise?.modification
      ? currentExercise.exercise.modification.videoId
      : currentExercise?.exercise?.videoId;

    if (isApiReady && videoToPlay) {
      if (player) {
        player.destroy();
      }
      const playerDiv = document.createElement('div');
      playerDiv.id = `youtube-player-${currentExerciseIndex}`;
      
      if (iframeRef.current) {
        iframeRef.current.innerHTML = '';
        iframeRef.current.appendChild(playerDiv);
      }

      const newPlayer = new window.YT.Player(playerDiv.id, {
        width: '100%',
        height: '100%',
        videoId: videoToPlay,
        playerVars: {
          controls: 1,
          modestbranding: 1,
          rel: 0,
          autoplay: hasStartedPlaying ? 1 : 0, 
          mute: 0,
        },
        events: {
          'onReady': (event) => {
            console.log('YouTube player ready');
            if (hasStartedPlayingRef.current && currentExerciseIndex > 0) {
              console.log('Auto-starting video for exercise:', currentExerciseIndex);
              event.target.playVideo();
            }
          },
          'onStateChange': (event) => {
            console.log('Player state changed:', event.data);
            if (event.data === window.YT.PlayerState.PLAYING && !hasStartedPlayingRef.current) {
              console.log('Setting hasStartedPlaying to true');
              setHasStartedPlaying(true);
              hasStartedPlayingRef.current = true;
            }
            
            if (event.data === window.YT.PlayerState.ENDED) {
              console.log('Video ended, moving to next exercise');
              hasStartedPlayingRef.current = true;
              setHasStartedPlaying(true);
              
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
  }, [isApiReady, currentExerciseIndex, totalExercises, showModified, currentExercise, hasStartedPlaying]);

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
    setShowModified(false);
  };

  const handleToggleModified = () => {
    setShowModified(!showModified);
  };

  const getModifiedExercise = (exercise) => {
    return exercise?.modification || null;
  };
  
  const modifiedExercise = getModifiedExercise(currentExercise?.exercise);
  const displayedExercise = showModified && modifiedExercise ? modifiedExercise : currentExercise?.exercise;


  if (totalExercises === 0) {
    return (
      <div className="bg-customGray p-4 rounded-lg text-center max-w-6xl w-full h-full lg:max-h-[100vh] flex flex-col border-brightYellow border-2 mt-10 justify-center items-center">
        <p className="text-customWhite text-xl font-bold">No exercises found for this workout.</p>
        <button
          onClick={onGoBackToProgram}
          className="btn-cancel mt-4 px-6 py-2 rounded-lg text-base md:text-lg font-bold"
        >
          Back to Overview
        </button>
      </div>
    );
  }

  return (
    <div className="bg-customGray p-4 rounded-lg text-center max-w-6xl w-full min-h-full flex flex-col border-brightYellow border-2 my-20 mx-auto">
      {/* Title section */}
       <div className="flex flex-col items-center m-6 text-center">
          <DynamicHeading 
            text={`Day ${workoutData.dayNumber} Preview`}
            className="font-higherJump text-2xl md:text-3xl font-bold text-customWhite leading-loose tracking-widest mb-2"
          />

          {/* Title + exercise count */}
          <p className="text-customWhite text-sm md:text-base mt-4">
            {workoutData.title} • {totalExercises} exercises
          </p>

          {/* Workout description */}
          {workoutData.description && (
            <p className="text-customWhite text-sm md:text-base max-w-2xl mb-2">
              {workoutData.description}
            </p>
          )}

          {/* First block notes (if any) */}
          {workoutData.workoutBlocks?.[0]?.blockNotes && (
            <p className="text-logoGray text-xs md:text-sm italic max-w-2xl">
              💡 {workoutData.workoutBlocks[0].blockNotes}
            </p>
          )}
        </div>

      {/* All buttons together in a single flex container at the top */}
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 md:space-x-4 m-4">
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
          Back to Overview
        </button>
      </div>

      {/* Main content container for the two-column layout */}
      <div className="flex flex-grow flex-col lg:flex-row lg:items-start justify-center gap-6 overflow-hidden mt-6">
      
        {/* Left-hand side: Video and Exercise Name only */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-full max-w-md aspect-video rounded-lg mb-4 overflow-hidden bg-black">
            {displayedExercise?.videoId ? (
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

          {/* Toggle between original and modified */}
          {modifiedExercise && (
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setShowModified(false)}
                className={`px-4 py-1 rounded-lg text-sm font-bold ${
                  !showModified
                    ? 'bg-limeGreen text-gray-900'
                    : 'bg-gray-700 text-customWhite hover:bg-gray-600'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setShowModified(true)}
                className={`px-4 py-1 rounded-lg text-sm font-bold ${
                  showModified
                    ? 'bg-limeGreen text-gray-900'
                    : 'bg-gray-700 text-customWhite hover:bg-gray-600'
                }`}
              >
                Modified
              </button>
            </div>
          )}

          {/* Display instructions for current exercise */}
          {displayedExercise?.instructions && (
            <div className="bg-gray-800 rounded-lg p-3 mb-4 w-full max-w-md text-center border border-customWhite">
              <p className="text-logoGray text-sm"> {displayedExercise.instructions}</p>
            </div>
          )}

          {/* Display tips for current exercise */}
          {displayedExercise?.tips && (
            <div className="bg-gray-800 rounded-lg p-3 mb-4 w-full max-w-md text-center border border-customWhite">
              <p className="text-logoGray text-xs italic">💡 Top Tip: {displayedExercise.tips}</p>
            </div>
          )}
        </div>

        {/* Right-hand side: Exercise List with Duration and Rest */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start mb-8">
          <div className="space-y-2 overflow-y-auto w-full text-left"> 
            {allExercises.map((exercise, index) => (
              <div
                key={index}
                onClick={() => handleExerciseClick(index)}
                className={`p-3 rounded-md text-sm transition-colors duration-200 cursor-pointer mr-2 ${
                  index === currentExerciseIndex
                    ? 'bg-brightYellow text-gray-900'
                    : 'text-logoGray hover:bg-gray-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between font-bold gap-2">
                  {/* Left side: name + modified label */}
                  <div className="flex flex-col">
                    <span
                      className={`${
                        index === currentExerciseIndex ? "text-gray-900" : "text-customWhite"
                      }`}
                    >
                      {exercise.exercise.name}
                    </span>

                    {/* Modified version label */}
                    {exercise.exercise.modificationId && (
                      <span
                        className={`text-xs font-bold mt-1 ${
                          index === currentExerciseIndex ? "text-gray-500" : "text-brightYellow"
                        }`}
                      >
                        Modified version available
                      </span>
                    )}
                  </div>

                  {/* Right side: metrics (stack below name on mobile) */}
                  <div className="flex flex-wrap gap-2">
                    {exercise.reps && (
                      <div
                        className={`px-2 py-1 rounded-md text-xs font-bold border ${
                          index === currentExerciseIndex
                            ? "bg-white text-gray-900 border-gray-900"
                            : "bg-gray-800 text-logoGray border-gray-700"
                        }`}
                      >
                        REPS: {exercise.reps}
                      </div>
                    )}

                    {exercise.duration && (
                      <div
                        className={`px-2 py-1 rounded-md text-xs font-bold border ${
                          index === currentExerciseIndex
                            ? "bg-white text-gray-900 border-gray-900"
                            : "bg-gray-800 text-logoGray border-gray-700"
                        }`}
                      >
                        DURATION: {exercise.duration}
                      </div>
                    )}

                    {exercise.rest && (
                      <div
                        className={`px-2 py-1 rounded-md text-xs font-bold border ${
                          index === currentExerciseIndex
                            ? "bg-white text-gray-900 border-gray-900"
                            : "bg-gray-800 text-logoGray border-gray-700"
                        }`}
                      >
                        REST: {exercise.rest}
                      </div>
                    )}
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
              instructions: PropTypes.string,
              modificationId: PropTypes.number,
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