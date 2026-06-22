import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import AudioControl from "../../components/Shared/AudioControl";
import useWorkoutAudio from "../../hooks/useWorkoutAudio";
import useWorkoutFullscreen from "../../hooks/useWorkoutFullscreen";
import usePreparationCountdown from "../../hooks/usePreparationCountdown";
import { getToggleButtonText } from "../../utils/exerciseUtils";
import api from "../../utils/api";
import { BACKEND_URL } from "../../utils/config";

const AMRAPWorkout = ({
  workoutBlock,
  title,
  description,
  onComplete,
  onGoBack,
  canGoBack,
  shouldAutoStart = false,
  isAdmin = false,
  programName = "",
  dayNumber = 0,
  blockIndex = 0,
}) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentAMRAPRound, setCurrentAMRAPRound] = useState(1);
  const [isRoundRest, setIsRoundRest] = useState(false);
  const [showModified, setShowModified] = useState({});
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  // AMRAP score tracking
  const [scoreRounds, setScoreRounds] = useState("");
  const [scorePartialReps, setScorePartialReps] = useState("");
  const [scoreNotes, setScoreNotes] = useState("");
  const [previousBest, setPreviousBest] = useState(null);
  const [savedScore, setSavedScore] = useState(null);
  const [scoreSaving, setScoreSaving] = useState(false);
  const { isFullscreen, toggleFullscreen } = useWorkoutFullscreen();
  const intervalRef = useRef(null);
  const {
    audioEnabled,
    volume,
    startSound,
    toggleAudio,
    setVolumeLevel,
    setStartSoundType,
    playBeep,
    playStartSound,
  } = useWorkoutAudio();

  // Use the preparation countdown hook
  const {
    isPreparationCountdown,
    preparationTime,
    startPreparationCountdown,
    cancelPreparationCountdown,
  } = usePreparationCountdown(playBeep, playStartSound);

  const extractDuration = () => {
    const notes = workoutBlock.blockNotes || "";
    let match = notes.match(/(\d+)\s*(?:minutes?|mins?)\s*(?:total|work)?/i);
    if (!match) {
      match = notes.match(/\d+\s*x\s*(\d+)\s*min/i);
    }
    return match ? parseInt(match[1]) * 60 : 720;
  };

  const totalDuration = extractDuration();
  const hasMultipleAMRAPRounds = (workoutBlock.blockRounds || 1) > 1;
  const totalAMRAPRounds = workoutBlock.blockRounds || 1;
  const hasRoundRest = workoutBlock.roundRest && workoutBlock.roundRest !== "";

  const parseRoundRestDuration = () => {
    if (!hasRoundRest || !workoutBlock.roundRest) return 0;
    const match = workoutBlock.roundRest.match(/(\d+)/);
    return match ? parseInt(match[1]) : 120;
  };

  useEffect(() => {
    if (isRoundRest) {
      setTime(parseRoundRestDuration());
    } else {
      setTime(totalDuration);
    }
    // Never auto-start - always require user interaction for safety
  }, [totalDuration, isRoundRest]);

  useEffect(() => {
    if (isActive && !isPaused && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 5 && prev > 0) {
            playBeep();
          }

          // Play start sound when transitioning from rest to work (or at very start)
          if (prev === 1 && (isRoundRest || currentAMRAPRound === 1)) {
            setTimeout(() => playStartSound(), 1000); // Play start sound when rest ends and work begins
          }

          if (prev <= 1) {
            clearInterval(intervalRef.current);
            if (isRoundRest) {
              setIsRoundRest(false);
              setCurrentAMRAPRound(currentAMRAPRound + 1);
              setRoundsCompleted(0);
              setTime(totalDuration);
              setIsActive(true);
            } else if (
              hasMultipleAMRAPRounds &&
              currentAMRAPRound < totalAMRAPRounds
            ) {
              if (hasRoundRest) {
                setIsRoundRest(true);
                setTime(parseRoundRestDuration());
                setIsActive(true);
              } else {
                setCurrentAMRAPRound(currentAMRAPRound + 1);
                setRoundsCompleted(0);
                setTime(totalDuration);
                setIsActive(false);
              }
            } else {
              setIsComplete(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [
    isActive,
    isPaused,
    time,
    isRoundRest,
    hasMultipleAMRAPRounds,
    currentAMRAPRound,
    totalAMRAPRounds,
    hasRoundRest,
    totalDuration,
    playBeep,
  ]);

  // Load previous best score when workout completes
  useEffect(() => {
    const blockId = workoutBlock.ID || workoutBlock.id;
    if (isComplete && blockId) {
      api.get(`${BACKEND_URL}/api/amrap/score/${blockId}`)
        .then(res => setPreviousBest(res.data))
        .catch(() => setPreviousBest(null));
    }
  }, [isComplete, workoutBlock.ID, workoutBlock.id]);

  const handleSaveScore = async () => {
    if (!scoreRounds) return;
    const blockId = workoutBlock.ID || workoutBlock.id;
    setScoreSaving(true);
    try {
      const res = await api.post(`${BACKEND_URL}/api/amrap/score`, {
        blockId: blockId,
        programName,
        dayNumber,
        blockIndex,
        rounds: parseInt(scoreRounds) || 0,
        partialReps: parseInt(scorePartialReps) || 0,
        notes: scoreNotes,
      });
      setSavedScore({ ...res.data.score, isNewBest: res.data.isNewBest });
      setPreviousBest(res.data.score);
    } catch (e) {
      console.error("Failed to save AMRAP score", e);
    } finally {
      setScoreSaving(false);
    }
  };

  const formatTime = (seconds) => {    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    // Start with 5-second preparation countdown ONLY for the very first start
    if (!isActive && !isPaused && !isPreparationCountdown && !hasStartedOnce) {
      startPreparationCountdown(() => {
        // After preparation countdown, start the actual workout
        setIsActive(true);
        setIsPaused(false);
        setHasStartedOnce(true);
      });
    } else {
      // Resume from pause or start subsequent rounds without preparation countdown
      setIsActive(true);
      setIsPaused(false);
      setHasStartedOnce(true);
    }
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTime(totalDuration);
    setIsActive(false);
    setIsPaused(false);
    setRoundsCompleted(0);
    setIsComplete(false);
    setCurrentAMRAPRound(1);
    setIsRoundRest(false);
    setHasStartedOnce(false);
  };

  const skipToEnd = () => {
    if (!isAdmin) return;

    clearInterval(intervalRef.current);
    setTime(0);
    setIsActive(false);
    setIsComplete(true);
  };

  const incrementRounds = () => {
    setRoundsCompleted((prev) => prev + 1);
  };

  const decrementRounds = () => {
    setRoundsCompleted((prev) => Math.max(0, prev - 1));
  };

  const handleComplete = () => {
    clearInterval(intervalRef.current);
    setIsComplete(false);
    onComplete();
  };



  const getExerciseName = (exercise, exerciseIndex) => {
    if (!exercise?.exercise) return "";

    const isModified = showModified[exerciseIndex] || false;
    if (isModified && exercise.exercise.modification) {
      return exercise.exercise.modification.name;
    }
    return exercise.exercise.name;
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-lg w-full text-center">
          <div className="text-5xl mb-5">⏰</div>
          <h2 className="text-2xl md:text-3xl font-bold text-customGray font-titillium mb-3">
            AMRAP Complete!
          </h2>
          <p className="text-customGray/60 font-titillium mb-6">
            {hasMultipleAMRAPRounds
              ? `All ${totalAMRAPRounds} AMRAP rounds complete!`
              : `Time's up! You completed ${roundsCompleted} rounds.`}
          </p>

          {/* Previous best */}
          {previousBest && !savedScore && (
            <div className="bg-yellow-50 rounded-xl p-4 mb-5 border border-brightYellow/30 text-left">
              <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-2">🏆 Your Personal Best</p>
              <p className="text-base font-bold text-customGray font-titillium">
                {previousBest.rounds} round{previousBest.rounds !== 1 ? "s" : ""}
                {previousBest.partialReps > 0 ? ` + ${previousBest.partialReps} reps` : ""}
              </p>
              {previousBest.notes && (
                <p className="text-xs text-customGray/50 font-titillium italic mt-1">{previousBest.notes}</p>
              )}
            </div>
          )}

          {/* Score saved */}
          {savedScore ? (
            <div className={`rounded-xl p-4 mb-5 text-left ${savedScore.isNewBest ? "bg-limeGreen/10 border-2 border-limeGreen" : "bg-gray-50 border border-gray-100"}`}>
              {savedScore.isNewBest ? (
                <p className="text-limeGreen font-bold font-titillium mb-1">🎉 New Personal Best!</p>
              ) : (
                <p className="text-customGray font-bold font-titillium mb-1">Score recorded</p>
              )}
              <p className="text-customGray font-titillium">
                {savedScore.rounds} round{savedScore.rounds !== 1 ? "s" : ""}
                {savedScore.partialReps > 0 ? ` + ${savedScore.partialReps} reps` : ""}
              </p>
              <p className="text-xs text-customGray/40 font-titillium mt-1">Saved to your profile — come back and beat it!</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-5 mb-5 border border-gray-100 text-left space-y-3">
              <p className="text-sm font-bold text-customGray font-titillium text-center">Record your score</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-customGray/50 font-titillium mb-1">Full Rounds</label>
                  <input
                    type="number" min="0" value={scoreRounds}
                    onChange={e => setScoreRounds(e.target.value)}
                    placeholder="e.g. 4"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-customGray font-titillium text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-brightYellow transition-colors no-spinners"
                  />
                </div>
                <div>
                  <label className="block text-xs text-customGray/50 font-titillium mb-1">+ Partial Reps</label>
                  <input
                    type="number" min="0" value={scorePartialReps}
                    onChange={e => setScorePartialReps(e.target.value)}
                    placeholder="e.g. 7"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-customGray font-titillium text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-brightYellow transition-colors no-spinners"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-customGray/50 font-titillium mb-1">Notes <span className="font-normal">(optional)</span></label>
                <input
                  type="text" value={scoreNotes}
                  onChange={e => setScoreNotes(e.target.value)}
                  placeholder="e.g. used modified push-ups"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-customGray font-titillium text-sm focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-brightYellow transition-colors"
                />
              </div>
              <button
                onClick={handleSaveScore}
                disabled={!scoreRounds || scoreSaving}
                className="w-full py-3 bg-brightYellow text-black font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scoreSaving ? "Saving..." : "Save Score"}
              </button>
            </div>
          )}

          <div className="space-y-3">
            <button onClick={handleComplete} className="w-full py-3 bg-brightYellow text-black font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200">
              Back to Programme
            </button>
            <button onClick={resetTimer} className="w-full py-3 bg-gray-50 text-customGray/60 font-titillium font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-100">
              Restart AMRAP
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${isFullscreen ? "fixed inset-0 z-50 p-0" : "min-h-screen bg-white pt-32 pb-8 px-4"}`}
    >
      <div
        className={`${isFullscreen ? "bg-customGray h-full max-w-none p-6 flex flex-col" : "max-w-6xl mx-auto space-y-4"}`}
      >
        {!isFullscreen && (
          <>
            {/* Top bar */}
            <div className="flex justify-between items-center">
              <AudioControl
                audioEnabled={audioEnabled}
                volume={volume}
                startSound={startSound}
                onToggle={toggleAudio}
                onVolumeChange={setVolumeLevel}
                onStartSoundChange={setStartSoundType}
                playStartSound={playStartSound}
                playBeep={playBeep}
                className="mt-0"
              />
              {canGoBack && (
                <button
                  onClick={onGoBack}
                  className="inline-flex items-center gap-2 text-sm font-titillium font-semibold text-customGray/50 hover:text-customGray transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Overview
                </button>
              )}
            </div>

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h1 className="text-lg md:text-2xl font-bold text-customGray font-titillium mb-3 text-center">{title}</h1>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">{description}</p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-1">Instructions</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed">
                    Complete all exercises in order for 1 round. Click exercises to view videos.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Audio controls for larger screens in fullscreen */}
        {isFullscreen && (
          <div className="hidden lg:flex justify-start items-center mb-2">
            <AudioControl
              audioEnabled={audioEnabled}
              volume={volume}
              startSound={startSound}
              onToggle={toggleAudio}
              onVolumeChange={setVolumeLevel}
              onStartSoundChange={setStartSoundType}
              playStartSound={playStartSound}
              playBeep={playBeep}
              className="mt-0"
            />
          </div>
        )}

        {/* Main Content */}
        <div
          className={`grow flex ${
            isFullscreen
              ? "flex-col items-center justify-start gap-2 p-2 sm:gap-4 sm:p-4 h-full"
              : "flex-col lg:flex-row gap-6"
          }`}
        >
          {/* Left Column: Timer and Round Counter - Only show when NOT fullscreen */}
          {!isFullscreen && (
            <div className="flex flex-col w-full lg:w-1/3 space-y-4">
              <div className="flex flex-col sm:flex-row-reverse lg:flex-col gap-4">
                {/* Timer card */}
                <div className="w-full sm:w-1/2 lg:w-full bg-white rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col justify-between relative p-5 min-h-[160px]">
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-2 right-2 text-customGray/30 hover:text-customGray transition-colors p-2 rounded-lg hover:bg-gray-50 z-10"
                    title="Enter Fullscreen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                  <div className="flex-1 flex flex-col justify-center">
                    {!isActive && !isPaused && !isPreparationCountdown && !hasStartedOnce ? (
                      <div className="text-center">
                        <div className="text-6xl text-brightYellow mb-2">5</div>
                        <p className="text-sm font-titillium font-semibold text-brightYellow mb-1">Get Ready!</p>
                        <p className="text-xs text-customGray/50 font-titillium">Click START for a 5-second countdown</p>
                      </div>
                    ) : isPreparationCountdown ? (
                      <div className="text-center">
                        <div className="text-6xl text-brightYellow animate-pulse mb-2">{preparationTime}</div>
                        <p className="text-sm font-titillium font-semibold text-brightYellow animate-bounce">🏃‍♀️ Get in position!</p>
                      </div>
                    ) : (
                      <div className="text-5xl lg:text-6xl text-limeGreen font-bold mb-2">{formatTime(time)}</div>
                    )}
                  </div>
                  <div className="flex justify-center gap-2">
                    {(!isActive && !isPreparationCountdown) || isPaused ? (
                      <button onClick={startTimer} className="px-4 py-2 text-sm font-titillium font-bold bg-limeGreen text-black rounded-xl hover:bg-limeGreen/80 transition-colors">
                        {isPaused ? "Resume" : "Start"}
                      </button>
                    ) : isPreparationCountdown ? (
                      <button disabled className="px-4 py-2 text-sm font-titillium font-bold bg-brightYellow/50 text-black rounded-xl cursor-not-allowed">
                        Get Ready...
                      </button>
                    ) : (
                      <button onClick={pauseTimer} className="px-4 py-2 text-sm font-titillium font-bold bg-hotPink text-black rounded-xl hover:bg-hotPink/80 transition-colors">
                        Pause
                      </button>
                    )}
                    <button onClick={resetTimer} className="px-4 py-2 text-sm font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors">
                      Reset
                    </button>
                    {isAdmin && isActive && (
                      <button onClick={skipToEnd} className="px-4 py-2 text-sm font-titillium font-semibold bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                        End
                      </button>
                    )}
                  </div>
                </div>

                {/* Round counter card */}
                <div className="w-full sm:w-1/2 lg:w-full bg-white rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col justify-between p-5 min-h-[160px]">
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-5xl lg:text-6xl font-bold text-brightYellow mb-2">{roundsCompleted}</div>
                    <p className="text-sm text-customGray/60 font-titillium">Rounds Completed</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button onClick={decrementRounds} disabled={roundsCompleted === 0} className="px-4 py-2 text-sm font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-40">
                      −1
                    </button>
                    <button onClick={incrementRounds} className="px-4 py-2 text-sm font-titillium font-bold bg-brightYellow text-black rounded-xl hover:bg-brightYellow/80 transition-colors">
                      +1
                    </button>
                  </div>
                </div>
              </div>

              {/* Tips & Instructions — desktop */}
              <div className="hidden lg:flex flex-col gap-3">
                {(workoutBlock.exercises[selectedExerciseIndex]?.tips || workoutBlock.exercises[selectedExerciseIndex]?.exercise?.tips) && (
                  <div className="bg-yellow-50 rounded-xl p-4 border border-brightYellow/20">
                    <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-1">Tips</p>
                    <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">
                      {workoutBlock.exercises[selectedExerciseIndex]?.tips || workoutBlock.exercises[selectedExerciseIndex]?.exercise?.tips}
                    </p>
                  </div>
                )}
                {(workoutBlock.exercises[selectedExerciseIndex]?.instructions || workoutBlock.exercises[selectedExerciseIndex]?.exercise?.instructions) && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Instructions</p>
                    <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">
                      {workoutBlock.exercises[selectedExerciseIndex]?.instructions || workoutBlock.exercises[selectedExerciseIndex]?.exercise?.instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Column: Exercise Table and Video */}
          {!isFullscreen && (
            <div className="w-full lg:w-2/3">
              <div className="flex-1 space-y-2 overflow-y-auto mb-4">
                {workoutBlock.exercises.map((exercise, index) => (
                  <div
                    key={exercise.id || index}
                    onClick={() => setSelectedExerciseIndex(index)}
                    className={`p-3 rounded-xl text-sm transition-colors duration-200 cursor-pointer border ${
                      index === selectedExerciseIndex
                        ? "bg-gray-50 border-brightYellow/40 shadow-sm"
                        : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      {/* Exercise name and tips */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-customGray font-titillium">
                            {getExerciseName(exercise, index)}
                          </span>
                          {exercise.exercise.modification && (
                            <span className="text-xs text-brightYellow">*</span>
                          )}
                        </div>
                        {exercise.tips && (
                          <div className="text-xs text-customGray/50 font-titillium italic mt-0.5">
                            {exercise.tips}
                          </div>
                        )}
                      </div>

                      {/* Modification toggle + reps badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        {exercise.exercise.modification && (() => {
                          const { standardText, modifiedText } = getToggleButtonText(exercise);
                          return (
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); setShowModified((prev) => ({ ...prev, [index]: false })); }}
                                className={`text-xs px-2 py-1 rounded-lg border font-titillium transition-colors ${
                                  !showModified[index]
                                    ? "border-limeGreen bg-limeGreen text-black"
                                    : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                                }`}
                              >
                                {standardText}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setShowModified((prev) => ({ ...prev, [index]: true })); }}
                                className={`text-xs px-2 py-1 rounded-lg border font-titillium transition-colors ${
                                  showModified[index]
                                    ? "border-limeGreen bg-limeGreen text-black"
                                    : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                                }`}
                              >
                                {modifiedText}
                              </button>
                            </div>
                          );
                        })()}
                        <div className="px-2 py-1 rounded-lg text-xs font-titillium font-bold bg-brightYellow text-black">
                          {exercise.reps} reps
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Video */}
              <div className="pt-4">
                <div className="relative w-full pb-[100%] md:pb-[60%] lg:pb-[80%] overflow-hidden rounded-lg">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <ExerciseVideo
                      exercise={workoutBlock.exercises[selectedExerciseIndex]}
                      isActive={true}
                      shouldAutoStart={false}
                      showModified={
                        showModified[selectedExerciseIndex] || false
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Exercise Details - Shown on mobile below video, hidden on desktop */}
              {!isFullscreen && (
                <div className="mt-4 space-y-2 lg:hidden">
                  {(workoutBlock.exercises[selectedExerciseIndex]?.tips ||
                    workoutBlock.exercises[selectedExerciseIndex]?.exercise?.tips) && (
                    <div className="bg-yellow-50 rounded-xl p-4 border border-brightYellow/20">
                      <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-1">Tips</p>
                      <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">
                        {workoutBlock.exercises[selectedExerciseIndex]?.tips ||
                          workoutBlock.exercises[selectedExerciseIndex]?.exercise?.tips}
                      </p>
                    </div>
                  )}
                  {(workoutBlock.exercises[selectedExerciseIndex]?.instructions ||
                    workoutBlock.exercises[selectedExerciseIndex]?.exercise?.instructions) && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Instructions</p>
                      <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">
                        {workoutBlock.exercises[selectedExerciseIndex]?.instructions ||
                          workoutBlock.exercises[selectedExerciseIndex]?.exercise?.instructions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Fullscreen Layout - Timer, Round Counter, Exercise List */}
          {isFullscreen && (
            <div className="w-full flex flex-col flex-1 space-y-4 sm:space-y-6 landscape:space-y-2">
              {/* Timer - First */}
              <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm text-center relative p-3 sm:p-4 md:p-5 landscape:p-2">
                {/* Fullscreen Toggle Button */}
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-2 right-2 text-customGray/30 hover:text-customGray transition-colors p-2 rounded-lg hover:bg-gray-50 z-10"
                  title="Exit Fullscreen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {!isActive && !isPaused && !isPreparationCountdown && !hasStartedOnce ? (
                  <div className="text-center mb-4 sm:mb-6 md:mb-8 landscape:mb-2">
                    <div className="text-brightYellow text-6xl sm:text-7xl md:text-8xl lg:text-9xl landscape:text-5xl">5</div>
                    <div className="text-brightYellow font-semibold text-lg mb-2">Get Ready!</div>
                    <div className="text-customGray/60 text-sm mb-2 font-titillium">Prepare for your AMRAP workout</div>
                    <span className="text-customGray/40 text-sm font-titillium">🏃‍♀️ Click START for a 5-second countdown to get in position</span>
                  </div>
                ) : isPreparationCountdown ? (
                  <div className="text-center mb-4 sm:mb-6 md:mb-8 landscape:mb-2">
                    <div className="text-brightYellow animate-pulse text-6xl sm:text-7xl md:text-8xl lg:text-9xl landscape:text-5xl">{preparationTime}</div>
                    <div className="text-brightYellow font-semibold text-lg mb-2">Get Ready!</div>
                    <span className="text-brightYellow font-semibold text-sm animate-bounce">🏃‍♀️ Get in position!</span>
                  </div>
                ) : (
                  <div className="mb-4 sm:mb-6 md:mb-8 landscape:mb-2 text-limeGreen font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl landscape:text-4xl">
                    {formatTime(time)}
                  </div>
                )}
                <div className="flex justify-center gap-2 sm:gap-4 landscape:gap-2">
                  {(!isActive && !isPreparationCountdown) || isPaused ? (
                    <button onClick={startTimer} className="px-6 py-3 text-sm font-titillium font-bold bg-limeGreen text-black rounded-xl hover:bg-limeGreen/80 transition-colors">
                      {isPaused ? "Resume" : "Start"}
                    </button>
                  ) : isPreparationCountdown ? (
                    <button disabled className="px-6 py-3 text-sm font-titillium font-bold bg-brightYellow/50 text-black rounded-xl cursor-not-allowed">
                      Get Ready...
                    </button>
                  ) : (
                    <button onClick={pauseTimer} className="px-6 py-3 text-sm font-titillium font-bold bg-hotPink text-black rounded-xl hover:bg-hotPink/80 transition-colors">
                      Pause
                    </button>
                  )}
                  <button onClick={resetTimer} className="px-6 py-3 text-sm font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors">
                    Reset
                  </button>
                  {isAdmin && isActive && (
                    <button onClick={skipToEnd} className="px-6 py-3 text-sm font-titillium font-semibold bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                      End
                    </button>
                  )}
                </div>
              </div>

              {/* Round Counter - Second */}
              <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm text-center p-3 sm:p-4 md:p-5 landscape:p-2">
                <div className="mb-4 sm:mb-6 landscape:mb-2 text-brightYellow font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl landscape:text-3xl">
                  {roundsCompleted}
                </div>
                <div className="text-customGray/60 font-titillium mb-4 sm:mb-6 landscape:mb-2 text-lg sm:text-xl md:text-2xl landscape:text-base">
                  Rounds Completed
                </div>
                <div className="flex justify-center gap-2 sm:gap-4 landscape:gap-2">
                  <button onClick={decrementRounds} disabled={roundsCompleted === 0} className="px-6 py-3 text-sm font-titillium font-semibold bg-gray-100 text-customGray rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-40">
                    −1
                  </button>
                  <button onClick={incrementRounds} className="px-6 py-3 text-sm font-titillium font-bold bg-brightYellow text-black rounded-xl hover:bg-brightYellow/80 transition-colors">
                    +1
                  </button>
                </div>
              </div>

              {/* Exercise List - Third */}
              <div className="flex-1 overflow-hidden landscape:h-[20vh] landscape:sm:h-[22vh] landscape:md:h-[24vh] landscape:lg:h-[26vh]">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 md:p-5 landscape:p-2 h-full overflow-y-auto">
                  <div className="space-y-2 sm:space-y-3 landscape:space-y-1">
                    {workoutBlock.exercises.map((exercise, index) => (
                      <div
                        key={exercise.id || index}
                        className="flex items-center justify-between p-3 sm:p-4 landscape:p-2 rounded-xl border border-gray-100 bg-gray-50"
                      >
                        <div className="flex-1">
                          <span className="font-semibold font-titillium text-customGray text-base sm:text-lg md:text-xl landscape:text-sm">
                            {getExerciseName(exercise, index)}
                          </span>
                          {exercise.exercise.modification && (
                            <span className="text-brightYellow ml-1 text-sm">*</span>
                          )}
                          {exercise.tips && (
                            <div className="text-xs text-customGray/50 font-titillium italic mt-1 landscape:mt-0">
                              {exercise.tips}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1 min-w-[80px] justify-end">
                            {exercise.exercise.modification ? (() => {
                              const { standardText, modifiedText } = getToggleButtonText(exercise);
                              return (
                                <>
                                  <button
                                    onClick={() => setShowModified((prev) => ({ ...prev, [index]: false }))}
                                    className={`text-xs px-2 py-1 rounded-lg border font-titillium transition-colors ${
                                      !showModified[index]
                                        ? "border-limeGreen bg-limeGreen text-black"
                                        : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                                    }`}
                                  >
                                    {standardText}
                                  </button>
                                  <button
                                    onClick={() => setShowModified((prev) => ({ ...prev, [index]: true }))}
                                    className={`text-xs px-2 py-1 rounded-lg border font-titillium transition-colors ${
                                      showModified[index]
                                        ? "border-limeGreen bg-limeGreen text-black"
                                        : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
                                    }`}
                                  >
                                    {modifiedText}
                                  </button>
                                </>
                              );
                            })() : <div className="w-[80px]"></div>}
                          </div>
                          <div className="px-3 py-2 rounded-xl text-xs font-titillium font-bold bg-brightYellow text-black">
                            {exercise.reps} reps
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AMRAPWorkout.propTypes = {
  workoutBlock: PropTypes.shape({
    blockType: PropTypes.string.isRequired,
    blockNotes: PropTypes.string,
    blockRounds: PropTypes.number,
    roundRest: PropTypes.string,
    exercises: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        tips: PropTypes.string,
        instructions: PropTypes.string,
        exercise: PropTypes.shape({
          name: PropTypes.string.isRequired,
          instructions: PropTypes.string,
          tips: PropTypes.string,
          modification: PropTypes.shape({
            name: PropTypes.string,
            videoId: PropTypes.string,
          }),
        }).isRequired,
        reps: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  shouldAutoStart: PropTypes.bool,
  isAdmin: PropTypes.bool,
  programName: PropTypes.string,
  dayNumber: PropTypes.number,
  blockIndex: PropTypes.number,
};

export default AMRAPWorkout;
