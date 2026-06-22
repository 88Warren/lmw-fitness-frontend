import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const WorkoutPreview = ({ workoutData, onStartWorkout, onGoBackToProgram, hasExistingProgress = false }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isApiReady, setIsApiReady] = useState(false);
  const [player, setPlayer] = useState(null);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const hasStartedPlayingRef = useRef(false);
  const iframeRef = useRef(null);
  const [showModified, setShowModified] = useState({});

  const allExercises = workoutData?.workoutBlocks?.flatMap((block) => block.exercises) || [];
  const totalExercises = allExercises.length;
  const currentExercise = allExercises[currentExerciseIndex];

  // ── YouTube API setup ──
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => setIsApiReady(true);
    } else {
      setIsApiReady(true);
    }
  }, []);

  useEffect(() => {
    const videoToPlay =
      showModified[currentExerciseIndex] && currentExercise?.exercise?.modification
        ? currentExercise.exercise.modification.videoId
        : currentExercise?.exercise?.videoId;

    if (isApiReady && videoToPlay) {
      if (player) player.destroy();

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
        playerVars: { controls: 1, modestbranding: 1, rel: 0, autoplay: hasStartedPlaying ? 1 : 0, mute: 0 },
        events: {
          onReady: (event) => {
            if (hasStartedPlayingRef.current && currentExerciseIndex > 0) event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING && !hasStartedPlayingRef.current) {
              setHasStartedPlaying(true);
              hasStartedPlayingRef.current = true;
            }
            if (event.data === window.YT.PlayerState.ENDED) {
              hasStartedPlayingRef.current = true;
              setHasStartedPlaying(true);
              setCurrentExerciseIndex((prev) => {
                const next = prev + 1;
                return next < totalExercises ? next : prev;
              });
            }
          },
          onError: (event) => console.error("YouTube player error:", event.data),
        },
      });

      setPlayer(newPlayer);
    }
  }, [isApiReady, currentExerciseIndex, totalExercises, showModified, currentExercise, hasStartedPlaying]);

  useEffect(() => {
    return () => { if (player) player.destroy(); };
  }, [player]);

  // ── Helpers ──
  const getExerciseName = (exercise, exerciseIndex) => {
    if (!exercise?.exercise) return "";
    if (showModified[exerciseIndex] && exercise.exercise.modification) return exercise.exercise.modification.name;
    return exercise.exercise.name;
  };

  const modifiedExercise = currentExercise?.exercise?.modification || null;
  const displayedExercise =
    showModified[currentExerciseIndex] && modifiedExercise
      ? modifiedExercise
      : currentExercise?.exercise;

  const getMetrics = (exercise) => {
    const m = [];
    if (exercise?.reps) m.push({ label: "Reps", value: exercise.reps });
    if (exercise?.duration) m.push({ label: "Duration", value: exercise.duration });
    if (exercise?.rest) m.push({ label: "Rest", value: exercise.rest });
    return m;
  };

  if (totalExercises === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <p className="text-customGray font-titillium text-lg mb-6">No exercises found for this workout.</p>
        <button onClick={onGoBackToProgram} className="btn-cancel mt-0">Back to Overview</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <button
                onClick={onGoBackToProgram}
                className="inline-flex items-center gap-2 text-sm font-titillium font-semibold text-customGray/50 hover:text-customGray transition-colors duration-200 mb-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Overview
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-customGray font-titillium">
                Day {workoutData.dayNumber} — Preview
              </h1>
              <p className="text-sm text-customGray/50 font-titillium mt-1">
                {workoutData.title} &bull; {totalExercises} exercises
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              {hasExistingProgress && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 border border-brightYellow text-brightYellow text-xs font-titillium font-bold">
                  🔄 In progress
                </span>
              )}
              <button
                onClick={onStartWorkout}
                className="px-5 py-2.5 bg-brightYellow text-black text-sm font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200"
              >
                {hasExistingProgress ? "Resume Workout" : "Start Workout"}
              </button>
            </div>
          </div>

          {/* Description + Notes */}
          {(workoutData.description || workoutData.workoutBlocks?.[0]?.blockNotes) && (
            <div className="flex flex-col md:flex-row gap-3 mt-5 pt-5 border-t border-gray-100">
              {workoutData.description && (
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">{workoutData.description}</p>
                </div>
              )}
              {workoutData.workoutBlocks?.[0]?.blockNotes && (
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">{workoutData.workoutBlocks[0].blockNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Main two-column layout ── */}
        <div className="flex flex-col-reverse lg:flex-row gap-6">

          {/* ── Left: Video + instructions ── */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

              {/* Standard / Modified toggle */}
              {modifiedExercise && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setShowModified((prev) => ({ ...prev, [currentExerciseIndex]: false }))}
                    className={`px-4 py-1.5 text-sm font-titillium font-semibold rounded-lg transition-colors duration-200 ${
                      !showModified[currentExerciseIndex]
                        ? "bg-brightYellow text-black"
                        : "bg-gray-100 text-customGray hover:bg-gray-200"
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setShowModified((prev) => ({ ...prev, [currentExerciseIndex]: true }))}
                    className={`px-4 py-1.5 text-sm font-titillium font-semibold rounded-lg transition-colors duration-200 ${
                      showModified[currentExerciseIndex]
                        ? "bg-brightYellow text-black"
                        : "bg-gray-100 text-customGray hover:bg-gray-200"
                    }`}
                  >
                    Modified
                  </button>
                </div>
              )}

              {/* Video */}
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4">
                {displayedExercise?.videoId ? (
                  <div ref={iframeRef} className="w-full h-full" style={{ minHeight: "200px" }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-customGray/40 text-sm font-titillium">Video not available</p>
                  </div>
                )}
              </div>

              {/* Exercise name */}
              <h2 className="text-base font-bold text-customGray font-titillium mb-3">
                {getExerciseName(currentExercise, currentExerciseIndex)}
              </h2>

              {/* Instructions */}
              {displayedExercise?.instructions && (
                <div className="bg-gray-50 rounded-xl p-4 mb-3">
                  <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Instructions</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed">{displayedExercise.instructions}</p>
                </div>
              )}

              {/* Tips */}
              {displayedExercise?.tips && (
                <div className="bg-yellow-50 rounded-xl p-4 border border-brightYellow/30">
                  <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-1">Top Tip</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed italic">{displayedExercise.tips}</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Exercise list ── */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-customGray font-titillium">Exercises</h2>
                <span className="text-xs text-customGray/40 font-titillium">* = modified version available</span>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {allExercises.map((exercise, index) => {
                  const isActive = index === currentExerciseIndex;
                  const metrics = getMetrics(exercise);

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentExerciseIndex(index)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 border ${
                        isActive
                          ? "bg-yellow-50 border-brightYellow"
                          : "bg-gray-50 border-transparent hover:border-gray-200 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Index + name */}
                        <div className="flex items-start gap-3 min-w-0">
                          <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-titillium mt-0.5 ${
                            isActive ? "bg-brightYellow text-black" : "bg-gray-200 text-customGray/60"
                          }`}>
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold font-titillium truncate ${isActive ? "text-customGray" : "text-customGray/80"}`}>
                              {getExerciseName(exercise, index)}
                              {exercise.exercise?.modificationId && (
                                <span className="ml-1 text-brightYellow text-xs">*</span>
                              )}
                            </p>
                            {exercise.tips && (
                              <p className="text-xs text-customGray/40 font-titillium mt-0.5 italic">{exercise.tips}</p>
                            )}
                          </div>
                        </div>

                        {/* Metrics */}
                        {metrics.length > 0 && (
                          <div className="flex flex-wrap gap-1 shrink-0">
                            {metrics.map(({ label, value }) => (
                              <span
                                key={label}
                                className={`px-2 py-0.5 rounded-lg text-xs font-titillium font-semibold ${
                                  isActive
                                    ? "bg-brightYellow/20 text-customGray"
                                    : "bg-gray-200 text-customGray/60"
                                }`}
                              >
                                {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
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
