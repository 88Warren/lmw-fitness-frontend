import { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import AudioControl from "../../components/Shared/AudioControl";
import useWorkoutAudio from "../../hooks/useWorkoutAudio";
import useWorkoutFullscreen from "../../hooks/useWorkoutFullscreen";
import usePreparationCountdown from "../../hooks/usePreparationCountdown";
import { getToggleButtonText } from "../../utils/exerciseUtils";

const ForTimeWorkout = ({
  workoutBlock,
  title,
  onComplete,
  onGoBack,
  canGoBack,
  shouldAutoStart = false,
  isAdmin = false,
}) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showModified, setShowModified] = useState({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const { isFullscreen, toggleFullscreen } = useWorkoutFullscreen();
  const intervalRef = useRef(null);
  const { audioEnabled, volume, startSound, toggleAudio, setVolumeLevel, setStartSoundType, playStartSound, playBeep } = useWorkoutAudio();

  const {
    isPreparationCountdown,
    preparationTime,
    startPreparationCountdown,
    cancelPreparationCountdown,
  } = usePreparationCountdown(playBeep, playStartSound);

  // Suppress unused lint warnings
  void shouldAutoStart;
  void cancelPreparationCountdown;

  const workoutSteps = useMemo(() => {
    const steps = [];
    const hasLadderReps = workoutBlock.exercises.some(
      (exercise) => exercise.reps && exercise.reps.includes(",")
    );

    if (hasLadderReps) {
      const firstExercise = workoutBlock.exercises[0];
      const repSteps = firstExercise.reps.split(",").map((rep) => rep.trim());
      repSteps.forEach((reps, stepIndex) => {
        steps.push({ id: stepIndex + 1, stepNumber: stepIndex + 1, reps, exercises: workoutBlock.exercises, isCompleted: false });
      });
    } else if (workoutBlock.blockRounds && workoutBlock.blockRounds > 1) {
      for (let round = 1; round <= workoutBlock.blockRounds; round++) {
        steps.push({ id: round, stepNumber: round, reps: null, exercises: workoutBlock.exercises, isCompleted: false });
      }
    } else {
      steps.push({ id: 1, stepNumber: 1, reps: null, exercises: workoutBlock.exercises, isCompleted: false });
    }
    return steps;
  }, [workoutBlock]);

  const getProgressPercentage = () => (completedSteps.size / workoutSteps.length) * 100;

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (isResting) {
          setRestTime((prev) => {
            if (prev <= 1) { setIsResting(false); return 0; }
            return prev - 1;
          });
        } else {
          setTime((prev) => prev + 1);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, isResting]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (!isActive && !isPaused && !isPreparationCountdown && !hasStartedOnce) {
      startPreparationCountdown(() => {
        setIsActive(true);
        setIsPaused(false);
        setHasStartedOnce(true);
      });
    } else {
      setIsActive(true);
      setIsPaused(false);
      setHasStartedOnce(true);
    }
  };

  const pauseTimer = () => setIsPaused(true);

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setIsActive(false);
    setIsPaused(false);
    setCompletedSteps(new Set());
    setIsComplete(false);
    setCurrentStepIndex(0);
    setIsResting(false);
    setRestTime(0);
    setHasStartedOnce(false);
  };

  const skipToEnd = () => {
    if (!isAdmin) return;
    clearInterval(intervalRef.current);
    setIsActive(false);
    setIsComplete(true);
  };

  const handleComplete = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setIsComplete(true);
  };

  const handleFinishWorkout = () => {
    clearInterval(intervalRef.current);
    onComplete();
  };

  const completeStep = (stepIndex) => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(stepIndex);
    setCompletedSteps(newCompletedSteps);
    if (newCompletedSteps.size === workoutSteps.length) {
      handleComplete();
    } else if (stepIndex === currentStepIndex && currentStepIndex < workoutSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const uncompleteStep = (stepIndex) => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.delete(stepIndex);
    setCompletedSteps(newCompletedSteps);
    const maxCompletedStep = Math.max(...Array.from(newCompletedSteps), -1);
    setCurrentStepIndex(Math.min(maxCompletedStep + 1, workoutSteps.length - 1));
  };

  const getExerciseName = (exercise, exerciseIndex) => {
    if (!exercise?.exercise) return "";
    const isModified = showModified[exerciseIndex] || false;
    if (isModified && exercise.exercise.modification) return exercise.exercise.modification.name;
    return exercise.exercise.name;
  };

  const getStepReps = (step, exercise) => step.reps || exercise.reps;

  const ModificationToggle = ({ exercise, index, size = "sm" }) => {
    if (!exercise?.exercise?.modification) return null;
    const { standardText, modifiedText } = getToggleButtonText(exercise);
    const base = size === "xs"
      ? "text-xs px-2 py-1"
      : "text-xs px-2 py-1";
    return (
      <div className="flex gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); setShowModified((prev) => ({ ...prev, [index]: false })); }}
          className={`${base} rounded-lg border font-titillium transition-colors ${
            !showModified[index]
              ? "border-limeGreen bg-limeGreen text-black"
              : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
          }`}
        >
          {standardText}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowModified((prev) => ({ ...prev, [index]: true })); }}
          className={`${base} rounded-lg border font-titillium transition-colors ${
            showModified[index]
              ? "border-limeGreen bg-limeGreen text-black"
              : "border-gray-200 bg-gray-100 text-customGray hover:bg-gray-200"
          }`}
        >
          {modifiedText}
        </button>
      </div>
    );
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-lg w-full text-center">
          <div className="text-5xl mb-5">⏱️</div>
          <h2 className="text-2xl md:text-3xl font-bold text-customGray font-titillium mb-3">
            For Time Complete!
          </h2>
          <p className="text-customGray/60 font-titillium mb-2">Excellent work! You finished in</p>
          <p className="text-3xl font-bold text-limeGreen font-titillium mb-8">{formatTime(time)}</p>
          <div className="space-y-3">
            <button
              onClick={handleFinishWorkout}
              className="w-full py-3 bg-brightYellow text-black font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200"
            >
              Back to Programme
            </button>
            <button
              onClick={resetTimer}
              className="w-full py-3 bg-gray-50 text-customGray/60 font-titillium font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
            >
              Restart For Time
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 p-0" : "min-h-screen bg-white pt-32 pb-8 px-4"}`}>
      <div className={`${isFullscreen ? "bg-white h-full max-w-none p-6 flex flex-col" : "max-w-6xl mx-auto space-y-4"}`}>

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
                {workoutBlock.blockNotes && (
                  <div className="flex-1 bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">
                      {workoutBlock.blockNotes}
                    </p>
                  </div>
                )}
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-wide mb-1">Instructions</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed">
                    {workoutSteps.length === 1
                      ? "Complete all exercises with the prescribed reps as fast as possible. Break up reps as needed."
                      : "Complete all exercises in each step with the prescribed reps, then mark the step as complete."}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Audio controls for fullscreen */}
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

        {/* Main content */}
        <div className={`flex gap-4 ${isFullscreen ? "flex-col flex-1" : "flex-col lg:flex-row"}`}>

          {/* ── Non-fullscreen layout ─────────────────────────────── */}
          {!isFullscreen && (
            <>
              {/* Left column: timer + video */}
              <div className="w-full lg:w-1/2 flex flex-col gap-4">

                {/* Timer card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center relative">
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-2 right-2 text-customGray/30 hover:text-customGray transition-colors p-2 rounded-lg hover:bg-gray-50 z-10"
                    title="Enter Fullscreen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>

                  <p className="text-xs font-titillium font-bold text-customGray/50 uppercase tracking-wide mb-2">Stopwatch</p>

                  <div className="mb-4">
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
                      <div className={`text-6xl font-bold ${isResting ? "text-hotPink" : "text-limeGreen"}`}>
                        {isResting ? formatTime(restTime) : formatTime(time)}
                      </div>
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

                {/* Progress bar — multi-step only */}
                {workoutSteps.length > 1 && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-titillium font-bold text-customGray/50 uppercase tracking-wide">Progress</p>
                      <p className="text-sm font-bold text-customGray font-titillium">{completedSteps.size}/{workoutSteps.length}</p>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div
                        className="h-full rounded-full bg-limeGreen transition-all duration-500"
                        style={{ width: `${getProgressPercentage()}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Modification toggle — desktop */}
                <div className="hidden lg:block">
                  <ModificationToggle
                    exercise={workoutBlock.exercises[selectedExerciseIndex]}
                    index={selectedExerciseIndex}
                  />
                </div>

                {/* Video — desktop */}
                <div className="hidden lg:block">
                  <div className="relative w-full pb-[56.25%] overflow-hidden rounded-2xl border border-gray-100">
                    <div className="absolute top-0 left-0 w-full h-full">
                      <ExerciseVideo
                        exercise={workoutBlock.exercises[selectedExerciseIndex]}
                        isActive={true}
                        shouldAutoStart={false}
                        showModified={showModified[selectedExerciseIndex] || false}
                      />
                    </div>
                  </div>
                </div>

                {/* Instructions — desktop */}
                {(workoutBlock.exercises[selectedExerciseIndex]?.instructions ||
                  workoutBlock.exercises[selectedExerciseIndex]?.exercise?.instructions) && (
                  <div className="hidden lg:block bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Instructions</p>
                    <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">
                      {workoutBlock.exercises[selectedExerciseIndex]?.instructions ||
                        workoutBlock.exercises[selectedExerciseIndex]?.exercise?.instructions}
                    </p>
                  </div>
                )}
              </div>

              {/* Right column: step list + mobile video */}
              <div className="w-full lg:w-1/2 flex flex-col gap-3">

                {/* Step list */}
                <div className="space-y-2">
                  {workoutSteps.map((step, stepIndex) => {
                    const isStepCompleted = completedSteps.has(stepIndex);
                    const isCurrentStep = stepIndex === currentStepIndex;

                    return (
                      <div
                        key={step.id}
                        className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
                          isStepCompleted
                            ? "bg-limeGreen/10 border-limeGreen/40"
                            : isCurrentStep
                            ? "bg-white border-brightYellow/60 shadow-sm"
                            : "bg-white border-gray-100"
                        }`}
                      >
                        {isStepCompleted ? (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-limeGreen text-lg">✓</span>
                              <span className="font-semibold text-sm text-customGray font-titillium">
                                {workoutSteps.length === 1 ? "Round" : `Step ${step.stepNumber}`} Complete
                              </span>
                            </div>
                            <button
                              onClick={() => uncompleteStep(stepIndex)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-customGray/60 font-titillium hover:bg-gray-200 transition-colors"
                            >
                              Undo
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {workoutSteps.length > 1 && (
                              <p className={`text-xs font-titillium font-bold uppercase tracking-wide mb-2 ${
                                isCurrentStep ? "text-brightYellow" : "text-customGray/40"
                              }`}>
                                {isCurrentStep ? `Step ${step.stepNumber} — Current` : `Step ${step.stepNumber}`}
                              </p>
                            )}

                            {/* Exercise rows */}
                            {step.exercises.map((exercise, exerciseIndex) => (
                              <div
                                key={exercise.id || exerciseIndex}
                                onClick={() => setSelectedExerciseIndex(exerciseIndex)}
                                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                                  selectedExerciseIndex === exerciseIndex && isCurrentStep
                                    ? "bg-brightYellow/20 border border-brightYellow/40"
                                    : "hover:bg-gray-50 border border-transparent"
                                }`}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="font-semibold text-sm text-customGray font-titillium truncate">
                                    {getExerciseName(exercise, exerciseIndex)}
                                  </span>
                                  {exercise.exercise?.modification && (
                                    <span className="text-xs text-brightYellow shrink-0">*</span>
                                  )}
                                  {exercise.tips && (
                                    <span className="text-xs text-customGray/40 font-titillium italic shrink-0 hidden sm:inline">
                                      ({exercise.tips})
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  <ModificationToggle exercise={exercise} index={exerciseIndex} />
                                  <span className="font-bold text-sm text-brightYellow font-titillium whitespace-nowrap">
                                    {getStepReps(step, exercise)}
                                  </span>
                                </div>
                              </div>
                            ))}

                            {/* Complete step button */}
                            <div className="flex justify-center pt-1">
                              <button
                                onClick={() => completeStep(stepIndex)}
                                className="px-5 py-2 bg-limeGreen text-black font-titillium font-bold text-sm rounded-xl hover:bg-limeGreen/80 transition-colors"
                              >
                                {workoutSteps.length === 1 ? "Complete Round" : `Complete Step ${step.stepNumber}`}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Video — mobile */}
                <div className="lg:hidden relative w-full pb-[56.25%] overflow-hidden rounded-2xl border border-gray-100">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <ExerciseVideo
                      exercise={workoutBlock.exercises[selectedExerciseIndex]}
                      isActive={true}
                      shouldAutoStart={false}
                      showModified={showModified[selectedExerciseIndex] || false}
                    />
                  </div>
                </div>

                {/* Instructions — mobile */}
                {(workoutBlock.exercises[selectedExerciseIndex]?.instructions ||
                  workoutBlock.exercises[selectedExerciseIndex]?.exercise?.instructions) && (
                  <div className="lg:hidden bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Instructions</p>
                    <p className="text-sm text-customGray/70 font-titillium leading-relaxed whitespace-pre-line">
                      {workoutBlock.exercises[selectedExerciseIndex]?.instructions ||
                        workoutBlock.exercises[selectedExerciseIndex]?.exercise?.instructions}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Fullscreen layout ─────────────────────────────────── */}
          {isFullscreen && (
            <div className="w-full flex flex-col flex-1 gap-3 sm:gap-4">

              {/* Timer */}
              <div className="shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm text-center relative p-4 sm:p-5">
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-2 right-2 text-customGray/30 hover:text-customGray transition-colors p-2 rounded-lg hover:bg-gray-50 z-10"
                  title="Exit Fullscreen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <p className="text-xs font-titillium font-bold text-customGray/50 uppercase tracking-wide mb-2">Stopwatch</p>
                {!isActive && !isPaused && !isPreparationCountdown && !hasStartedOnce ? (
                  <div className="text-center mb-3">
                    <div className="text-brightYellow text-6xl sm:text-7xl md:text-8xl lg:text-9xl">5</div>
                    <div className="text-brightYellow font-semibold text-lg mt-1">Get Ready!</div>
                    <p className="text-customGray/50 text-sm font-titillium">Click START for a 5-second countdown</p>
                  </div>
                ) : isPreparationCountdown ? (
                  <div className="text-center mb-3">
                    <div className="text-brightYellow animate-pulse text-6xl sm:text-7xl md:text-8xl lg:text-9xl">{preparationTime}</div>
                    <div className="text-brightYellow font-semibold text-lg mt-1">Get Ready!</div>
                    <span className="text-brightYellow font-semibold text-sm animate-bounce">🏃‍♀️ Get in position!</span>
                  </div>
                ) : (
                  <div className={`mb-3 font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl ${isResting ? "text-hotPink" : "text-limeGreen"}`}>
                    {isResting ? formatTime(restTime) : formatTime(time)}
                  </div>
                )}
                <div className="flex justify-center gap-2 sm:gap-4">
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

              {/* Progress — multi-step only */}
              {workoutSteps.length > 1 && (
                <div className="shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-titillium font-bold text-customGray/50 uppercase tracking-wide">Progress</p>
                    <p className="text-sm font-bold text-customGray font-titillium">{completedSteps.size}/{workoutSteps.length}</p>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div
                      className="h-full rounded-full bg-limeGreen transition-all duration-500"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Workout steps */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full overflow-y-auto">
                  <p className="text-xs font-titillium font-bold text-customGray/50 uppercase tracking-wide mb-3">Workout Steps</p>
                  <div className="space-y-2">
                    {workoutSteps.map((step, stepIndex) => {
                      const isStepCompleted = completedSteps.has(stepIndex);
                      const isCurrentStep = stepIndex === currentStepIndex;
                      return (
                        <div
                          key={step.id}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                            isStepCompleted
                              ? "bg-limeGreen/10 border-limeGreen/40"
                              : isCurrentStep
                              ? "bg-white border-brightYellow/60 shadow-sm"
                              : "bg-white border-gray-100"
                          }`}
                        >
                          {isStepCompleted ? (
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-limeGreen">✓</span>
                                <span className="font-semibold text-sm text-customGray font-titillium">
                                  {workoutSteps.length === 1 ? "Round" : `Step ${step.stepNumber}`} Complete
                                </span>
                              </div>
                              <button
                                onClick={() => uncompleteStep(stepIndex)}
                                className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-customGray/60 font-titillium hover:bg-gray-200 transition-colors"
                              >
                                Undo
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {step.exercises.map((exercise, exerciseIndex) => (
                                <div key={exercise.id || exerciseIndex} className="flex items-center justify-between text-sm">
                                  <span className="font-semibold text-customGray font-titillium">
                                    {getExerciseName(exercise, exerciseIndex)}
                                  </span>
                                  <span className="font-bold text-brightYellow font-titillium ml-2">
                                    {getStepReps(step, exercise)}
                                  </span>
                                </div>
                              ))}
                              <div className="flex justify-center pt-1">
                                <button
                                  onClick={() => completeStep(stepIndex)}
                                  className="px-4 py-1.5 bg-limeGreen text-black font-titillium font-bold text-sm rounded-xl hover:bg-limeGreen/80 transition-colors"
                                >
                                  {workoutSteps.length === 1 ? "Complete" : `Complete Step ${step.stepNumber}`}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Finish button — all steps done */}
              {completedSteps.size === workoutSteps.length && (
                <div className="shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                  <button
                    onClick={handleComplete}
                    className="px-8 py-3 bg-brightYellow text-black font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors text-lg"
                  >
                    Finish Workout!
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ForTimeWorkout.propTypes = {
  workoutBlock: PropTypes.shape({
    blockType: PropTypes.string.isRequired,
    blockNotes: PropTypes.string,
    blockRounds: PropTypes.number,
    roundRest: PropTypes.string,
    exercises: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        reps: PropTypes.string,
        exercise: PropTypes.shape({
          name: PropTypes.string.isRequired,
          instructions: PropTypes.string,
          tips: PropTypes.string,
          modification: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
              name: PropTypes.string,
              videoId: PropTypes.string,
            }),
          ]),
        }).isRequired,
        tips: PropTypes.string,
        instructions: PropTypes.string,
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
};

export default ForTimeWorkout;
