import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import DynamicHeading from "../../components/Shared/DynamicHeading";
import AudioControl from "../../components/Shared/AudioControl";
import useWorkoutAudio from "../../hooks/useWorkoutAudio";
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef(null);
  const { audioEnabled, volume, startSound, toggleAudio, setVolumeLevel, setStartSoundType } = useWorkoutAudio();

  const workoutSteps = generateWorkoutSteps();

  function generateWorkoutSteps() {
    const steps = [];

    // Check if this is a ladder workout (has comma-separated reps)
    const hasLadderReps = workoutBlock.exercises.some(
      (exercise) => exercise.reps && exercise.reps.includes(",")
    );

    if (hasLadderReps) {
      // Ladder workout - create steps based on comma-separated reps
      const firstExercise = workoutBlock.exercises[0];
      const repSteps = firstExercise.reps.split(",").map((rep) => rep.trim());

      repSteps.forEach((reps, stepIndex) => {
        steps.push({
          id: stepIndex + 1,
          stepNumber: stepIndex + 1,
          reps: reps,
          exercises: workoutBlock.exercises,
          isCompleted: false,
        });
      });
    } else if (workoutBlock.blockRounds && workoutBlock.blockRounds > 1) {
      // Multi-round workout - create steps for each round
      for (let round = 1; round <= workoutBlock.blockRounds; round++) {
        steps.push({
          id: round,
          stepNumber: round,
          reps: null, // Use original reps from exercises
          exercises: workoutBlock.exercises,
          isCompleted: false,
        });
      }
    } else {
      // Simple workout - single step
      steps.push({
        id: 1,
        stepNumber: 1,
        reps: null, // Use original reps from exercises
        exercises: workoutBlock.exercises,
        isCompleted: false,
      });
    }

    return steps;
  }

  function getProgressDisplay() {
    const completedStepsCount = completedSteps.size;
    return `${completedStepsCount}/${workoutSteps.length}`;
  }

  function getProgressPercentage() {
    const completedStepsCount = completedSteps.size;
    return (completedStepsCount / workoutSteps.length) * 100;
  }

  useEffect(() => {
    if (shouldAutoStart) {
      setIsActive(true);
    }
  }, [shouldAutoStart]);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (isResting) {
          setRestTime((prev) => {
            if (prev <= 1) {
              setIsResting(false);
              return 0;
            }
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
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

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

  // Check if fullscreen state exists in sessionStorage (persists across component remounts)
  useEffect(() => {
    const savedFullscreenState = sessionStorage.getItem('forTimeWorkoutFullscreen');
    if (savedFullscreenState === 'true') {
      setIsFullscreen(true);
    }
    
    // Cleanup function to clear fullscreen state when component unmounts completely
    return () => {
      // Only clear if user navigates away from workout (not just exercise change)
      const isNavigatingAway = !window.location.pathname.includes('/workout/');
      if (isNavigatingAway) {
        sessionStorage.removeItem('forTimeWorkoutFullscreen');
      }
    };
  }, []);

  const toggleFullscreen = () => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
    
    if (newFullscreenState) {
      // Save fullscreen state to sessionStorage so it persists across component remounts
      sessionStorage.setItem('forTimeWorkoutFullscreen', 'true');
    } else {
      // Clear fullscreen state when user explicitly exits
      sessionStorage.removeItem('forTimeWorkoutFullscreen');
    }
  };

  const completeStep = (stepIndex) => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.add(stepIndex);
    setCompletedSteps(newCompletedSteps);

    // Check if workout is complete
    if (newCompletedSteps.size === workoutSteps.length) {
      handleComplete();
    } else {
      // Move to next step if available
      if (
        stepIndex === currentStepIndex &&
        currentStepIndex < workoutSteps.length - 1
      ) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };

  const uncompleteStep = (stepIndex) => {
    const newCompletedSteps = new Set(completedSteps);
    newCompletedSteps.delete(stepIndex);
    setCompletedSteps(newCompletedSteps);

    // If this was the last completed step, make it the current step
    const maxCompletedStep = Math.max(...Array.from(newCompletedSteps), -1);
    const newCurrentStep = Math.min(
      maxCompletedStep + 1,
      workoutSteps.length - 1
    );
    setCurrentStepIndex(newCurrentStep);
  };

  const getExerciseName = (exercise, exerciseIndex) => {
    if (!exercise?.exercise) return "";

    const isModified = showModified[exerciseIndex] || false;
    if (isModified && exercise.exercise.modification) {
      return exercise.exercise.modification.name;
    }
    return exercise.exercise.name;
  };

  const getStepReps = (step, exercise) => {
    // If step has specific reps (ladder), use those
    if (step.reps) {
      return step.reps;
    }
    // Otherwise use exercise's original reps
    return exercise.reps;
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
        <div className="bg-customGray p-6 rounded-lg text-center max-w-2xl w-full border-brightYellow border-2">
          <div className="text-6xl mb-6">⏱️</div>
          <DynamicHeading
            className="font-higherJump text-3xl font-bold text-customWhite mb-4 leading-loose"
            text="For Time Complete!"
          />
          <p className="text-lg text-logoGray mt-6">
            Excellent work! You finished in{" "}
            <span className="text-limeGreen font-bold">{formatTime(time)}</span>
          </p>
          <div className="space-y-4">
            <button
              onClick={handleFinishWorkout}
              className="btn-full-colour mr-4"
            >
              Back to Program
            </button>
            <button onClick={resetTimer} className="btn-cancel">
              Restart For Time
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-b from-customGray/30 to-white ${
      isFullscreen ? 'fixed inset-0 z-50 p-0' : 'p-6'
    }`}>
      <div className={`bg-customGray rounded-lg text-center w-full flex flex-col border-brightYellow border-2 ${
        isFullscreen 
          ? 'h-full max-w-none p-6' 
          : 'p-6 max-w-6xl min-h-[90vh] mt-20 md:mt-26'
      }`}>
        {!isFullscreen && (
          <div className="flex justify-between items-center">
            <AudioControl
              audioEnabled={audioEnabled}
              volume={volume}
              startSound={startSound}
              onToggle={toggleAudio}
              onVolumeChange={setVolumeLevel}
              onStartSoundChange={setStartSoundType}
              className="mt-0"
            />
            {canGoBack && (
              <button onClick={onGoBack} className="btn-cancel mt-0">
                Back to Overview
              </button>
            )}
          </div>
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
              className="mt-0"
            />
          </div>
        )}

        {/* Header - Hidden in fullscreen */}
        {!isFullscreen && (
          <div className="flex flex-col mt-4 mb-4 items-center">
            <DynamicHeading
              text={title}
              className="font-higherJump mb-6 text-xl md:text-3xl font-bold text-customWhite text-center leading-loose tracking-widest"
            />

            <div className="flex flex-col md:flex-row gap-0 md:gap-6 w-full items-center md:items-stretch">
              {/* Block Notes */}
              <div className="flex items-start justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 mb-3 md:mb-0 text-center">
                <p className="text-logoGray text-sm whitespace-pre-line break-words leading-loose">
                  <span className="text-limeGreen font-bold">Notes:</span>{" "}
                  {workoutBlock.blockNotes ||
                    "No additional notes for this workout."}
                </p>
              </div>

              {/* Instructions */}
              <div className="flex items-start justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 text-center">
                <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                  <span className="text-limeGreen font-bold">Instructions:</span>{" "}
                  {workoutSteps.length === 1
                    ? "Complete all exercises in this workout with the prescribed reps, you can do the exercises in any order and break up the reps if you need."
                    : "Complete all exercises in each step with the prescribed reps, then mark the entire step as complete."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-grow flex ${
          isFullscreen 
            ? 'flex-col items-center justify-start gap-2 p-2 sm:gap-4 sm:p-4 h-full' 
            : 'flex-col lg:flex-row gap-6'
        }`}>
          {/* Regular Content - Hidden in fullscreen */}
          {!isFullscreen && (
            <>
              {/* Left Column: Stopwatch, Progress, and Video (Desktop) */}
              <div className="w-full lg:w-1/2 flex flex-col space-y-4">
            <div className="flex flex-col gap-4">
              {/* Timer */}
              <div className="w-full bg-gray-600 rounded-lg p-6 text-center relative">
                {/* Fullscreen Toggle Button - Inside timer card */}
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-2 right-2 text-customWhite hover:text-brightYellow transition-colors p-2 rounded-lg hover:bg-gray-700 z-10"
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? (
                    // Exit fullscreen icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    // Enter fullscreen icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  )}
                </button>
                <div
                  className={`text-6xl mb-4 ${
                    isResting ? "text-hotPink" : "text-limeGreen"
                  }`}
                >
                  {isResting ? formatTime(restTime) : formatTime(time)}
                </div>
                {/* Timer Controls */}
                <div className="flex justify-center space-x-2">
                  {!isActive || isPaused ? (
                    <button
                      onClick={startTimer}
                      className="btn-full-colour mt-3"
                    >
                      {isPaused ? "Resume" : "Start"}
                    </button>
                  ) : (
                    <button onClick={pauseTimer} className="btn-subscribe mt-3">
                      Pause
                    </button>
                  )}
                  <button onClick={resetTimer} className="btn-cancel mt-3">
                    Reset
                  </button>
                  {isAdmin && isActive && (
                    <button onClick={skipToEnd} className="btn-skip mt-3">
                      End
                    </button>
                  )}
                </div>
              </div>

              {/* Progress - Only show for multi-step workouts */}
              {workoutSteps.length > 1 && (
                <div className="bg-gray-600 w-full rounded-lg p-6 text-center">
                  <h3 className="text-xl font-bold text-customWhite mb-2">
                    Progress
                  </h3>
                  <div className="text-6xl text-brightYellow mb-4">
                    {getProgressDisplay()}
                  </div>
                  <div className="bg-gray-500 rounded-full h-3 mb-4">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-limeGreen"
                      style={{
                        width: `${getProgressPercentage()}%`,
                      }}
                    ></div>
                  </div>
                  {completedSteps.size === workoutSteps.length && (
                    <div className="space-y-2">
                      <button
                        onClick={handleComplete}
                        className="btn-full-colour mt-3"
                      >
                        Finish!
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Finish Button for Single-Step Workouts */}
              {workoutSteps.length === 1 &&
                completedSteps.size === workoutSteps.length && (
                  <div className="bg-gray-600 w-full rounded-lg p-6 text-center">
                    <div className="space-y-2">
                      <button
                        onClick={handleComplete}
                        className="btn-full-colour mt-3"
                      >
                        Finish!
                      </button>
                    </div>
                  </div>
                )}
            </div>

            {/* Exercise Modification Toggle - Desktop Only */}
            {workoutBlock.exercises[selectedExerciseIndex]?.exercise
              ?.modification && (
              <div className="bg-gray-600 rounded-lg p-3 hidden lg:block">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-customWhite text-sm font-medium mr-2">
                    {getExerciseName(
                      workoutBlock.exercises[selectedExerciseIndex],
                      selectedExerciseIndex
                    )}
                    :
                  </span>
                  {(() => {
                    const { standardText, modifiedText } = getToggleButtonText(
                      workoutBlock.exercises[selectedExerciseIndex]
                    );
                    return (
                      <>
                        <button
                          onClick={() =>
                            setShowModified((prev) => ({
                              ...prev,
                              [selectedExerciseIndex]: false,
                            }))
                          }
                          className={`text-sm px-3 py-1.5 rounded font-medium ${
                            !showModified[selectedExerciseIndex]
                              ? "bg-limeGreen text-black"
                              : "bg-gray-400 text-black hover:bg-gray-300"
                          }`}
                        >
                          {standardText}
                        </button>
                        <button
                          onClick={() =>
                            setShowModified((prev) => ({
                              ...prev,
                              [selectedExerciseIndex]: true,
                            }))
                          }
                          className={`text-sm px-3 py-1.5 rounded font-medium ${
                            showModified[selectedExerciseIndex]
                              ? "bg-limeGreen text-black"
                              : "bg-gray-400 text-black hover:bg-gray-300"
                          }`}
                        >
                          {modifiedText}
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Video - Desktop Only */}
            <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg hidden lg:block">
              <div className="absolute top-0 left-0 w-full h-full">
                <ExerciseVideo
                  exercise={workoutBlock.exercises[selectedExerciseIndex]}
                  isActive={true}
                  shouldAutoStart={false}
                  showModified={showModified[selectedExerciseIndex] || false}
                />
              </div>
            </div>

            {/* Exercise Details - Hidden on mobile, shown on desktop */}
            <div className="space-y-2 hidden lg:block">
              {workoutBlock.exercises[selectedExerciseIndex] && (
                <>
                  {(workoutBlock.exercises[selectedExerciseIndex]
                    ?.instructions ||
                    workoutBlock.exercises[selectedExerciseIndex]?.exercise
                      ?.instructions) && (
                    <div className="bg-gray-600 rounded-lg p-3">
                      <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                        <span className="text-limeGreen font-bold">
                          Instructions:
                        </span>{" "}
                        {workoutBlock.exercises[selectedExerciseIndex]
                          ?.instructions ||
                          workoutBlock.exercises[selectedExerciseIndex]
                            ?.exercise?.instructions}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Column: Step List */}
          <div className="w-full lg:w-1/2">
            {/* Step List */}
            <div className="">
              <div className="space-y-3">
                {workoutSteps.map((step, stepIndex) => {
                  const isStepCompleted = completedSteps.has(stepIndex);
                  const isCurrentStep = stepIndex === currentStepIndex;

                  return (
                    <div
                      key={step.id}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-300 ${
                        isStepCompleted
                          ? "bg-limeGreen text-black border-limeGreen"
                          : isCurrentStep
                          ? "bg-transparent text-customWhite border-brightYellow shadow-xs shadow-brightYellow/30 backdrop-blur-sm"
                          : "bg-customGray text-white border-gray-500"
                      }`}
                    >
                      {/* Collapsed view for completed steps */}
                      {isStepCompleted ? (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center flex-1">
                            <span className="font-medium text-sm">
                              Step {step.stepNumber} Complete ✓
                            </span>
                          </div>
                          <div className="ml-3">
                            <button
                              onClick={() => uncompleteStep(stepIndex)}
                              className="bg-gray-500 text-white px-3 py-1.5 rounded font-semibold text-sm hover:bg-gray-400 transition-colors"
                            >
                              Undo
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Expanded view for incomplete steps */
                        <div className="space-y-3">
                          {/* Complete Button - Mobile Top, Desktop Right */}
                          <div className="flex justify-center lg:hidden">
                            <button
                              onClick={() => completeStep(stepIndex)}
                              className="bg-limeGreen text-black px-4 py-2 rounded font-semibold text-sm hover:bg-green-400 transition-colors"
                            >
                              {workoutSteps.length === 1
                                ? "Complete Round"
                                : "Complete Step"}
                            </button>
                          </div>

                          {/* Exercise List */}
                          <div className="space-y-1">
                            {step.exercises.map((exercise, exerciseIndex) => (
                              <div
                                key={exercise.id || exerciseIndex}
                                className={`flex items-center justify-between p-2 rounded text-md transition-colors ${
                                  selectedExerciseIndex === exerciseIndex &&
                                  isCurrentStep
                                    ? "bg-brightYellow text-black cursor-pointer"
                                    : "hover:bg-brightYellow hover:text-black cursor-pointer"
                                }`}
                                onClick={() => {
                                  setSelectedExerciseIndex(exerciseIndex);
                                }}
                              >
                                <div className="flex items-center space-x-2 flex-1">
                                  <span className="font-medium">
                                    {getExerciseName(exercise, exerciseIndex)}
                                  </span>
                                  {exercise.tips && (
                                    <span className="text-xs text-logoGray italic">
                                      ({exercise.tips})
                                    </span>
                                  )}
                                </div>
                                <div className="text-right ml-2">
                                  <div className="font-bold text-sm">
                                    {getStepReps(step, exercise)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Complete Button - Desktop (centered below exercises) */}
                          <div className="hidden lg:flex justify-center mt-3">
                            <button
                              onClick={() => completeStep(stepIndex)}
                              className="bg-limeGreen text-black px-4 py-2 rounded font-semibold text-sm hover:bg-green-400 transition-colors"
                            >
                              {workoutSteps.length === 1
                                ? "Complete Round"
                                : "Complete Step"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise Modification Toggle - Mobile */}
            {workoutBlock.exercises[selectedExerciseIndex]?.exercise
              ?.modification && (
              <div className="bg-gray-600 rounded-lg p-3 mt-4 lg:hidden">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-customWhite text-sm font-medium mr-2">
                    {getExerciseName(
                      workoutBlock.exercises[selectedExerciseIndex],
                      selectedExerciseIndex
                    )}
                    :
                  </span>
                  {(() => {
                    const { standardText, modifiedText } = getToggleButtonText(
                      workoutBlock.exercises[selectedExerciseIndex]
                    );
                    return (
                      <>
                        <button
                          onClick={() =>
                            setShowModified((prev) => ({
                              ...prev,
                              [selectedExerciseIndex]: false,
                            }))
                          }
                          className={`text-sm px-3 py-1.5 rounded font-medium ${
                            !showModified[selectedExerciseIndex]
                              ? "bg-limeGreen text-black"
                              : "bg-gray-400 text-black hover:bg-gray-300"
                          }`}
                        >
                          {standardText}
                        </button>
                        <button
                          onClick={() =>
                            setShowModified((prev) => ({
                              ...prev,
                              [selectedExerciseIndex]: true,
                            }))
                          }
                          className={`text-sm px-3 py-1.5 rounded font-medium ${
                            showModified[selectedExerciseIndex]
                              ? "bg-limeGreen text-black"
                              : "bg-gray-400 text-black hover:bg-gray-300"
                          }`}
                        >
                          {modifiedText}
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Video - Mobile Only */}
            <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg mt-4 lg:hidden">
              <div className="absolute top-0 left-0 w-full h-full">
                <ExerciseVideo
                  exercise={workoutBlock.exercises[selectedExerciseIndex]}
                  isActive={true}
                  shouldAutoStart={false}
                  showModified={showModified[selectedExerciseIndex] || false}
                />
              </div>
            </div>

            {/* Exercise Details - Shown on mobile below video, hidden on desktop */}
            <div className="mt-4 space-y-2 lg:hidden">
              {workoutBlock.exercises[selectedExerciseIndex] && (
                <>
                  {(workoutBlock.exercises[selectedExerciseIndex]
                    ?.instructions ||
                    workoutBlock.exercises[selectedExerciseIndex]?.exercise
                      ?.instructions) && (
                    <div className="bg-gray-600 rounded-lg p-3">
                      <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                        <span className="text-limeGreen font-bold">
                          Instructions:
                        </span>{" "}
                        {workoutBlock.exercises[selectedExerciseIndex]
                          ?.instructions ||
                          workoutBlock.exercises[selectedExerciseIndex]
                            ?.exercise?.instructions}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
            </>
          )}

          {/* Fullscreen Content */}
          {isFullscreen && (
            <div className="w-full flex flex-col flex-1">
              {/* Timer Row */}
              <div className="flex justify-center mb-4 flex-shrink-0">
                <div className="w-full bg-gray-600 rounded-lg text-center relative p-4 sm:p-6">
                  {/* Fullscreen Toggle Button - Inside timer card */}
                  <button
                    onClick={toggleFullscreen}
                    className="absolute top-2 right-2 text-customWhite hover:text-brightYellow transition-colors p-2 rounded-lg hover:bg-gray-700 z-10"
                    title="Exit Fullscreen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div
                    className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 ${
                      isResting ? "text-hotPink" : "text-limeGreen"
                    }`}
                  >
                    {isResting ? formatTime(restTime) : formatTime(time)}
                  </div>
                  {/* Timer Controls */}
                  <div className="flex justify-center space-x-1 lg:space-x-2">
                    {!isActive || isPaused ? (
                      <button
                        onClick={startTimer}
                        className="btn-full-colour mt-0 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base"
                      >
                        {isPaused ? "Resume" : "Start"}
                      </button>
                    ) : (
                      <button
                        onClick={pauseTimer}
                        className="btn-subscribe mt-0 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base"
                      >
                        Pause
                      </button>
                    )}
                    <button
                      onClick={resetTimer}
                      className="btn-cancel mt-0 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base"
                    >
                      Reset
                    </button>
                    {isAdmin && isActive && (
                      <button
                        onClick={skipToEnd}
                        className="btn-skip mt-0 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base"
                      >
                        End
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Display - Only show for multi-step workouts */}
              {workoutSteps.length > 1 && (
                <div className="w-full bg-gray-600 rounded-lg p-3 sm:p-4 text-center mb-4 flex-shrink-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-customWhite mb-2">
                    Progress: {getProgressDisplay()}
                  </h3>
                  <div className="bg-gray-500 rounded-full h-2 mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-limeGreen"
                      style={{
                        width: `${getProgressPercentage()}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Exercise List - Large height for complex content */}
              <div className="h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] overflow-hidden w-full">
                <div className="bg-gray-600 rounded-lg p-3 sm:p-4 h-full overflow-y-auto">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-customWhite mb-3">Workout Steps</h3>
                  <div className="space-y-2">
                    {workoutSteps.map((step, stepIndex) => {
                      const isStepCompleted = completedSteps.has(stepIndex);
                      const isCurrentStep = stepIndex === currentStepIndex;

                      return (
                        <div
                          key={step.id}
                          className={`p-2 rounded transition-all duration-300 ${
                            isStepCompleted
                              ? "bg-limeGreen text-black"
                              : isCurrentStep
                              ? "bg-gray-800 border-2 border-brightYellow text-customWhite"
                              : "bg-gray-700 text-customWhite"
                          }`}
                        >
                          {isStepCompleted ? (
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm">
                                Step {step.stepNumber} Complete ✓
                              </span>
                              <button
                                onClick={() => uncompleteStep(stepIndex)}
                                className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-400 transition-colors"
                              >
                                Undo
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {step.exercises.map((exercise, exerciseIndex) => (
                                <div
                                  key={exercise.id || exerciseIndex}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="font-medium">
                                    {getExerciseName(exercise, exerciseIndex)}
                                  </span>
                                  <span className="font-bold">
                                    {getStepReps(step, exercise)}
                                  </span>
                                </div>
                              ))}
                              <div className="flex justify-center mt-2">
                                <button
                                  onClick={() => completeStep(stepIndex)}
                                  className="bg-limeGreen text-black px-3 py-1 rounded text-sm font-semibold hover:bg-green-400 transition-colors"
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

              {/* Finish Button for completed workouts */}
              {completedSteps.size === workoutSteps.length && (
                <div className="w-full bg-gray-600 rounded-lg p-3 sm:p-4 text-center mt-4 flex-shrink-0">
                  <button
                    onClick={handleComplete}
                    className="btn-full-colour mt-0 px-6 py-3 text-lg font-bold"
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
