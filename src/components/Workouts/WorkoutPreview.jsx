import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import DynamicHeading from "../Shared/DynamicHeading";

const WorkoutPreview = ({ workoutData, onStartWorkout, onGoBackToProgram, hasExistingProgress = false }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isApiReady, setIsApiReady] = useState(false);
  const [player, setPlayer] = useState(null);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const hasStartedPlayingRef = useRef(false);
  const allExercises =
    workoutData?.workoutBlocks?.flatMap((block) => block.exercises) || [];
  const totalExercises = allExercises.length;
  const currentExercise = allExercises[currentExerciseIndex];
  const iframeRef = useRef(null);
  const [showModified, setShowModified] = useState({});

  useEffect(() => {
    const onYouTubeIframeAPIReady = () => {
      setIsApiReady(true);
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    } else {
      setIsApiReady(true);
    }
  }, []);

  useEffect(() => {
    const videoToPlay =
      showModified[currentExerciseIndex] &&
      currentExercise?.exercise?.modification
        ? currentExercise.exercise.modification.videoId
        : currentExercise?.exercise?.videoId;

    if (isApiReady && videoToPlay) {
      if (player) {
        player.destroy();
      }
      const playerDiv = document.createElement("div");
      playerDiv.id = `youtube-player-${currentExerciseIndex}`;

      if (iframeRef.current) {
        iframeRef.current.innerHTML = "";
        iframeRef.current.appendChild(playerDiv);
      }

      const newPlayer = new window.YT.Player(playerDiv.id, {
        width: "100%",
        height: "100%",
        videoId: videoToPlay,
        playerVars: {
          controls: 1,
          modestbranding: 1,
          rel: 0,
          autoplay: hasStartedPlaying ? 1 : 0,
          mute: 0,
        },
        events: {
          onReady: (event) => {
            // console.log('YouTube player ready');
            if (hasStartedPlayingRef.current && currentExerciseIndex > 0) {
              // console.log('Auto-starting video for exercise:', currentExerciseIndex);
              event.target.playVideo();
            }
          },
          onStateChange: (event) => {
            // console.log('Player state changed:', event.data);
            if (
              event.data === window.YT.PlayerState.PLAYING &&
              !hasStartedPlayingRef.current
            ) {
              // console.log('Setting hasStartedPlaying to true');
              setHasStartedPlaying(true);
              hasStartedPlayingRef.current = true;
            }

            if (event.data === window.YT.PlayerState.ENDED) {
              // console.log('Video ended, moving to next exercise');
              hasStartedPlayingRef.current = true;
              setHasStartedPlaying(true);

              setCurrentExerciseIndex((prev) => {
                const nextIndex = prev + 1;
                return nextIndex < totalExercises ? nextIndex : prev;
              });
            }
          },
          onError: (event) => {
            console.error("YouTube player error:", event.data);
          },
        },
      });

      setPlayer(newPlayer);
    }
  }, [
    isApiReady,
    currentExerciseIndex,
    totalExercises,
    showModified,
    currentExercise,
    hasStartedPlaying,
  ]);

  useEffect(() => {
    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [player]);

  const handleExerciseClick = (index) => {
    // console.log('Exercise clicked:', index);
    setCurrentExerciseIndex(index);
  };

  const getExerciseName = (exercise, exerciseIndex) => {
    if (!exercise?.exercise) return "";

    const isModified = showModified[exerciseIndex] || false;
    if (isModified && exercise.exercise.modification) {
      return exercise.exercise.modification.name;
    }
    return exercise.exercise.name;
  };

  const getModifiedExercise = (exercise) => {
    return exercise?.modification || null;
  };

  const modifiedExercise = getModifiedExercise(currentExercise?.exercise);
  const displayedExercise =
    showModified[currentExerciseIndex] && modifiedExercise
      ? modifiedExercise
      : currentExercise?.exercise;

  const getMetricsString = (exercise) => {
    const metrics = [];
    if (exercise?.reps) metrics.push(`Reps: ${exercise.reps}`);
    if (exercise?.duration) metrics.push(`Duration: ${exercise.duration}`);
    if (exercise?.rest) metrics.push(`Rest: ${exercise.rest}`);
    return metrics.join(" • ");
  };

  if (totalExercises === 0) {
    return (
      <div className="bg-customGray p-4 rounded-lg text-center max-w-6xl w-full h-full lg:max-h-[100vh] flex flex-col border-brightYellow border-2 mt-10 justify-center items-center">
        <p className="text-customWhite text-xl font-bold">
          No exercises found for this workout.
        </p>
        <button onClick={onGoBackToProgram} className="btn-cancel">
          Back to Overview
        </button>
      </div>
    );
  }

  return (
    <div className="bg-customGray p-4 rounded-lg text-center lg:w-6xl flex flex-col border-brightYellow border-2 my-20 overview-hidden">
      {/* Title section */}
      <div className="shrink-0">
        <div className="flex flex-col items-center text-center">
          <DynamicHeading
            text={`Day ${workoutData.dayNumber} Preview`}
            className="font-higherJump text-2xl md:text-3xl font-bold text-customWhite leading-loose tracking-widest m-4 md:m-6"
          />
          {hasExistingProgress && (
            <div className="mb-4 p-3 bg-brightYellow/20 border border-brightYellow rounded-lg">
              <p className="text-brightYellow font-semibold text-sm">
                🔄 Workout in progress - You can resume where you left off
              </p>
            </div>
          )}
          {/* Buttons*/}
          <div className="flex flex-row justify-center items-center gap-4 mb-2 md:mb-6">
            <button
              onClick={onStartWorkout}
              className="btn-full-colour mt-0 md:mt-6"
            >
              {hasExistingProgress ? "Resume Workout" : "Start Workout"}
            </button>
            <button
              onClick={onGoBackToProgram}
              className="btn-cancel mt-0 md:mt-6"
            >
              Back to Overview
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-0 md:gap-4 w-full items-center md:items-stretch">
            {/* Workout description */}
            {workoutData.description && (
              <div className="flex items-start justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center flex-1 min-h-[80px]">
                <p className="text-logoGray text-sm whitespace-pre-line wrap-break-words leading-loose">
                  <span className="text-limeGreen font-bold">
                    Description:{" "}
                  </span>
                  {workoutData.description}
                </p>
              </div>
            )}

            {/* First block notes (if any) */}
            {workoutData.workoutBlocks?.[0]?.blockNotes && (
              <div className="flex items-start justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center flex-1 min-h-[80px]">
                <p className="text-logoGray text-sm whitespace-pre-line wrap-break-words leading-loose">
                  <span className="text-limeGreen font-bold">Notes: </span>
                  {workoutData.workoutBlocks[0].blockNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content container for the two-column layout */}
      <div className="flex-1 flex flex-col-reverse lg:flex-row md:gap-6 overflow-hidden m-2">
        {/* Left-hand side: Video and Exercise Name only */}
        <div className="w-full lg:w-1/2 flex flex-col items-center min-h-0">
          {/* Toggle between standard and modified - with placeholder for consistent spacing */}
          <div className="flex space-x-2 mb-4 shrink-0 min-h-[48px] items-center">
            {modifiedExercise ? (
              <>
                <button
                  onClick={() =>
                    setShowModified((prev) => ({
                      ...prev,
                      [currentExerciseIndex]: false,
                    }))
                  }
                  className={`${
                    !showModified[currentExerciseIndex]
                      ? "btn-primary mt-2"
                      : "btn-cancel mt-2"
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() =>
                    setShowModified((prev) => ({
                      ...prev,
                      [currentExerciseIndex]: true,
                    }))
                  }
                  className={`${
                    showModified[currentExerciseIndex]
                      ? "btn-primary mt-2"
                      : "btn-cancel mt-2"
                  }`}
                >
                  Modified
                </button>
              </>
            ) : (
              <div className="hidden lg:block opacity-0 mt-2 px-6 py-3">
                Placeholder
              </div>
            )}
          </div>
          <div className="w-full aspect-video rounded-lg mb-4 overflow-hidden bg-black shrink-0">
            {displayedExercise?.videoId ? (
              <div
                ref={iframeRef}
                className="w-full h-full"
                style={{ minHeight: "200px" }}
              />
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <p className="text-logoGray text-sm">Video not available</p>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto w-full max-w-5xl space-y-3">
            {/* Display instructions for current exercise */}
            {displayedExercise?.instructions && (
              <div className="w-full bg-gray-600 rounded-lg p-3 text-center">
                <p className="text-logoGray text-sm">
                  <span className="text-limeGreen font-bold">
                    Instructions:
                  </span>{" "}
                  {displayedExercise.instructions}
                </p>
              </div>
            )}

            {/* Display tips for current exercise */}
            {displayedExercise?.tips && (
              <div className="bg-gray-600 rounded-lg p-3 text-center">
                <p className="text-logoGray text-xs italic">
                  <span className="text-limeGreen font-bold">Top Tip: </span>
                  {displayedExercise.tips}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right-hand side: Exercise List with Duration and Rest */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-0">
          <div className="flex-1 space-y-2 overflow-y-auto">
            {/* Title + exercise count */}
            <p className="text-customWhite text-base font-bold md:text-base">
              {workoutData.title} • {totalExercises} exercises
            </p>

            <p className="text-logoGray text-xs italic mb-4">
              * Modified version available
            </p>

            {allExercises.map((exercise, index) => (
              <div
                key={index}
                onClick={() => handleExerciseClick(index)}
                className={`p-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer ${
                  index === currentExerciseIndex
                    ? "bg-gray-700 text-black"
                    : "text-logoGray hover:bg-gray-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start font-bold gap-2">
                  {/* Left side: name + tips + modified label */}
                  <div className="flex flex-col items-center md:items-start">
                    <div className="flex">
                      <span className="text-customWhite text-left">
                        {getExerciseName(exercise, index)}
                      </span>

                      {/* Modified version label */}
                      {exercise.exercise.modificationId && (
                        <span
                          className={`text-xs align-center ml-1 text-brightYellow`}
                        >
                          *
                        </span>
                      )}
                    </div>
                    {/* Exercise tips for rep breakdown */}
                    {exercise.tips && (
                      <div className="text-xs text-logoGray italic mt-1">
                        {exercise.tips}
                      </div>
                    )}
                  </div>

                  {/* Right side: metrics */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {getMetricsString(exercise) && (
                      <div
                        className={`px-2 py-1 rounded-lg text-sm border ${
                          index === currentExerciseIndex
                            ? "bg-brightYellow text-black border-black"
                            : "bg-customGray text-logoGray border-gray-500"
                        }`}
                      >
                        {getMetricsString(exercise)}
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
    dayNumber: PropTypes.number,
    description: PropTypes.string,
    workoutBlocks: PropTypes.arrayOf(
      PropTypes.shape({
        blockNotes: PropTypes.string,
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
  hasExistingProgress: PropTypes.bool,
};

export default WorkoutPreview;
