import React, { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import DynamicHeading from "../../components/Shared/DynamicHeading";

const EMOMWorkout = ({
  workoutBlock,
  title,
  description,
  onComplete,
  onGoBack,
  canGoBack,
  shouldAutoStart = false,
}) => {
  const [timerState, setTimerState] = useState({
    totalTime: 0,
    currentMinute: 1,
    secondsInCurrentMinute: 60,
    isActive: false,
    isPaused: false,
    isComplete: false
  });
  const intervalRef = useRef(null);

  // Extract total duration and pattern from block notes
  const extractWorkoutInfo = () => {
    const notes = workoutBlock.blockNotes || "";
    
    // Extract total minutes
    let match = notes.match(/(\d+)\s*(?:minutes?|mins?)/i);
    const totalMinutes = match ? parseInt(match[1]) : 12;
    
    // Check for "every 2 minutes" pattern
    const isEveryTwoMinutes = /every\s+2\s+minutes?/i.test(notes);
    
    // Check for rounds with rest minutes (e.g., "Minute 5 is rest")
    const hasRestMinutes = /minute\s+\d+\s+(?:is\s+)?rest/i.test(notes);
    
    return { totalMinutes, isEveryTwoMinutes, hasRestMinutes };
  };

  const { totalMinutes, isEveryTwoMinutes, hasRestMinutes } = extractWorkoutInfo();

  // Determine current exercise based on minute and pattern - using useMemo to recalculate when currentMinute changes
  const currentExercise = useMemo(() => {
    if (!workoutBlock.exercises || workoutBlock.exercises.length === 0) {
      return null;
    }

    // If only one exercise, use it for all minutes
    if (workoutBlock.exercises.length === 1) {
      return workoutBlock.exercises[0];
    }

    const currentMinute = timerState.currentMinute;
    const exercises = workoutBlock.exercises;

    // Pattern 3: Every 2 minutes (e.g., "Every 2 minutes for 20 minutes")
    if (isEveryTwoMinutes) {
      const exerciseIndex = Math.floor((currentMinute - 1) / 2) % exercises.length;
      return exercises[exerciseIndex];
    }

    // Pattern 4: Rounds with rest minutes (e.g., "4 rounds, Minute 5 is rest")
    if (hasRestMinutes && workoutBlock.blockRounds) {
      const minutesPerRound = exercises.length + 1; // +1 for rest minute
      const minuteInRound = ((currentMinute - 1) % minutesPerRound) + 1;
      
      // If it's the last minute of the round, it's rest
      if (minuteInRound > exercises.length) {
        return { exercise: { name: "Rest" }, reps: "Rest", isRest: true };
      }
      
      return exercises[minuteInRound - 1];
    }

    // Pattern 1 & 2: Standard cycling through exercises
    // Minute 1 -> Exercise 0, Minute 2 -> Exercise 1, etc.
    const exerciseIndex = (currentMinute - 1) % exercises.length;
    return exercises[exerciseIndex];
  }, [timerState.currentMinute, workoutBlock.exercises, isEveryTwoMinutes, hasRestMinutes, workoutBlock.blockRounds]);

  useEffect(() => {
    if (shouldAutoStart) {
      setTimerState(prev => ({ ...prev, isActive: true }));
    }
  }, [shouldAutoStart]);

  // Debug effect to log minute changes
  useEffect(() => {
    console.log(`EMOM: Current minute changed to ${timerState.currentMinute}`);
    console.log(`EMOM: Pattern - Every 2 min: ${isEveryTwoMinutes}, Has rest: ${hasRestMinutes}`);
    console.log(`EMOM: Total exercises in block:`, workoutBlock.exercises?.length);
    console.log(`EMOM: Current exercise:`, currentExercise);
  }, [timerState.currentMinute, currentExercise, isEveryTwoMinutes, hasRestMinutes]);

  // Main timer effect
  useEffect(() => {
    if (timerState.isActive && !timerState.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimerState(prevState => {
          const newSeconds = prevState.secondsInCurrentMinute - 1;
          
          if (newSeconds <= 0) {
            // Move to next minute
            const nextMinute = prevState.currentMinute + 1;
            if (nextMinute > totalMinutes) {
              // Workout complete
              clearInterval(intervalRef.current);
              return { ...prevState, isComplete: true };
            }
            return {
              ...prevState,
              currentMinute: nextMinute,
              secondsInCurrentMinute: 60,
              totalTime: prevState.totalTime + 1
            };
          }
          
          return {
            ...prevState,
            secondsInCurrentMinute: newSeconds,
            totalTime: prevState.totalTime + 1
          };
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [timerState.isActive, timerState.isPaused, totalMinutes]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTotalTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    setTimerState(prev => ({ ...prev, isActive: true, isPaused: false }));
  };

  const pauseTimer = () => {
    setTimerState(prev => ({ ...prev, isPaused: true }));
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimerState({
      totalTime: 0,
      currentMinute: 1,
      secondsInCurrentMinute: 60,
      isActive: false,
      isPaused: false,
      isComplete: false
    });
  };

  const handleComplete = () => {
    clearInterval(intervalRef.current);
    onComplete();
  };

  const getProgressPercentage = () => {
    const totalWorkoutSeconds = totalMinutes * 60;
    return (timerState.totalTime / totalWorkoutSeconds) * 100;
  };

  const getMinuteProgressPercentage = () => {
    return ((60 - timerState.secondsInCurrentMinute) / 60) * 100;
  };

  if (timerState.isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
        <div className="bg-customGray p-6 rounded-lg text-center max-w-2xl w-full border-brightYellow border-2">
          <div className="text-6xl m-6">🎉</div>
          <h2 className="font-higherJump text-3xl font-bold text-customWhite m-4">
            Workout Complete!
          </h2>
          <p className="text-lg text-logoGray m-4">
            Great job! You completed {totalMinutes} minutes of EMOM training.
          </p>
          <div className="space-x-4">
            <button onClick={handleComplete} className="btn-full-colour">
              Continue Workout
            </button>
            <button onClick={resetTimer} className="btn-cancel">
              Restart EMOM
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
      <div className="bg-customGray p-4 rounded-lg text-center max-w-6xl w-full h-full lg:max-h-[120vh] flex flex-col border-brightYellow border-2 mt-20 md:mt-26">
       {canGoBack && (
          <button onClick={onGoBack} className="btn-cancel mt-0 self-end">
            Back to Overview
          </button>
        )}
        {/* Header */}
        <div className="flex flex-col mt-4 mb-4 items-center">
          <DynamicHeading
            text={title} 
            className="font-higherJump mb-4 text-xl md:text-3xl font-bold text-customWhite text-center leading-loose tracking-widest"
          />
          <div className="flex flex-col md:flex-row gap-0 md:gap-4 w-full items-center">
            {/* Description */}
            <div className="flex items-center justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center">
              <p className="text-logoGray text-sm whitespace-pre-line break-words leading-loose">
                <span className="text-limeGreen font-bold">Description:</span>{" "}
                {description}
              </p>
            </div>
            {/* Instructions */}
            {!currentExercise.isRest && (
              <div className="flex items-center justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center">
                <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                  <span className="text-limeGreen font-bold">
                    Instructions:
                  </span>{" "}
                  Complete {currentExercise.reps} reps of{" "}
                  {currentExercise.exercise.name} within this minute. Use
                  any remaining time to rest before the next minute begins.
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-customWhite text-2xl font-titillium font-semibold mb-2">
            Minute <span className="text-brightYellow">{timerState.currentMinute}</span> of <span className="text-brightYellow">{totalMinutes}</span> (Exercise <span className="text-brightYellow"> {((timerState.currentMinute - 1) % workoutBlock.exercises.length) + 1}</span>)
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col lg:flex-row gap-6">
          {/* Left Column: Timer and Controls */}
          <div className="w-full lg:w-1/3 flex flex-col pl-4 space-y-4">
            {currentExercise && (
              <div className="space-y-4 pt-4">
                <div className={`p-4 rounded-lg text-center ${currentExercise.isRest ? 'bg-hotPink text-white' : 'bg-limeGreen text-black'}`}>
                  <h4 className="font-bold text-lg mb-2">
                    {currentExercise.exercise.name}
                  </h4>
                  <div className="text-2xl font-bold">
                    {currentExercise.isRest ? 'Rest' : `${currentExercise.reps} ${currentExercise.duration ? `(${currentExercise.duration})` : 'reps'}`}
                  </div>
                  {!currentExercise.isRest && (
                    <div className="text-sm mt-2 opacity-75">
                      {isEveryTwoMinutes ? `Every 2 min - Ex ${Math.floor((timerState.currentMinute - 1) / 2) + 1}` : 
                        hasRestMinutes ? `Round ${Math.ceil(timerState.currentMinute / (workoutBlock.exercises.length + 1))}` :
                        `Exercise ${((timerState.currentMinute - 1) % workoutBlock.exercises.length) + 1}`}
                    </div>
                  )}
                </div>
                {currentExercise.isRest && (
                  <div className="bg-gray-600 rounded-lg p-3">
                    <p className="text-sm text-logoGray">
                      <span className="text-hotPink font-bold">
                        Rest Minute:
                      </span>{" "}
                      Take this minute to recover before the next round begins.
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-row-reverse lg:flex-col gap-4">
              {/* Current Minute Timer */}
              <div className="w-1/2 lg:w-full bg-gray-600 rounded-lg p-4 text-center">
                <div className="text-6xl mb-4 text-limeGreen">
                  {formatTime(timerState.secondsInCurrentMinute)}
                </div>
                {/* Timer Controls */}
                <div className="flex justify-center space-x-2">
                  {!timerState.isActive || timerState.isPaused ? (
                    <button onClick={startTimer} className="btn-full-colour mt-3">
                      {timerState.isPaused ? "Resume" : "Start"}
                    </button>
                  ) : (
                    <button onClick={pauseTimer} className="btn-subscribe mt-3">
                      Pause
                    </button>
                  )}
                  <button onClick={resetTimer} className="btn-cancel mt-3">
                    Reset
                  </button>
                </div>
              </div>
              {/* Total Time */}
              <div className="w-1/2 lg:w-full bg-gray-600 rounded-lg p-4 text-center">
                <h3 className="text-xl font-bold text-customWhite mb-2">
                  Total Time
                </h3>
                <div className="text-6xl text-brightYellow mb-4">
                  {formatTotalTime(timerState.totalTime)}
                </div>
                {/* Overall Progress Bar */}
                <div className="bg-gray-500 rounded-full h-3">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-brightYellow"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Current Exercise */}
          <div className="w-full lg:w-2/3">
            <div className="px-4 h-full">
            {/* Video */}
            {currentExercise ? (
            <div className="pt-4">
              <div className="relative w-full pb-[80.25%] overflow-hidden rounded-lg">
                <div className="absolute top-0 left-0 w-full h-full">
                  <ExerciseVideo
                    exercise={currentExercise}
                    isActive={true}
                    shouldAutoStart={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-600 rounded-lg p-10 h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold text-customWhite mb-2">
                EMOM Ready
              </h3>
              <p className="text-logoGray text-md">
                Start the timer to begin your EMOM workout
              </p>
            </div>
            )}
            {/* Exercise Details */}
            <div className="mt-2 flex flex-col md:flex-row gap-4">
              {currentExercise.exercise.instructions && (
                <div className="flex items-center justify-center w-1/2 bg-gray-600 rounded-lg p-3 mt-2 text-center">
                  <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                    <span className="text-limeGreen font-bold">
                      Instructions:
                    </span>{" "}
                    {currentExercise.exercise.instructions}
                  </p>
                </div>
              )}
              {currentExercise.exercise.tips && (
                <div className="flex items-center justify-center w-1/2 bg-gray-600 rounded-lg p-3 mt-2 text-center">
                  <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                    <span className="text-limeGreen font-bold">Tips:</span>{" "}
                    {currentExercise.exercise.tips}
                  </p>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

EMOMWorkout.propTypes = {
  workoutBlock: PropTypes.shape({
    blockType: PropTypes.string.isRequired,
    blockNotes: PropTypes.string,
    exercises: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        exercise: PropTypes.shape({
          name: PropTypes.string.isRequired,
          instructions: PropTypes.string,
          tips: PropTypes.string,
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
};

export default EMOMWorkout;
