import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import DynamicHeading from "../../components/Shared/DynamicHeading";

const AMRAPWorkout = ({
  workoutBlock,
  title,
  description,
  onComplete,
  onGoBack,
  canGoBack,
  shouldAutoStart = false,
}) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentAMRAPRound, setCurrentAMRAPRound] = useState(1);
  const [isRoundRest, setIsRoundRest] = useState(false);
  const intervalRef = useRef(null);

  // Extract duration from block notes or description
  const extractDuration = () => {
    const notes = workoutBlock.blockNotes || "";
    // Try to match various time formats: "12 minutes", "15 min", "20 minutes total", "8 min work"
    let match = notes.match(/(\d+)\s*(?:minutes?|mins?)\s*(?:total|work)?/i);
    if (!match) {
      // Try to match "2 x 8 min work" format
      match = notes.match(/\d+\s*x\s*(\d+)\s*min/i);
    }
    return match ? parseInt(match[1]) * 60 : 720; // Default to 12 minutes if not found
  };

  const totalDuration = extractDuration();
  const hasMultipleAMRAPRounds = (workoutBlock.blockRounds || 1) > 1;
  const totalAMRAPRounds = workoutBlock.blockRounds || 1;
  const hasRoundRest = workoutBlock.roundRest && workoutBlock.roundRest !== "";

  // Helper to parse round rest duration
  const parseRoundRestDuration = () => {
    if (!hasRoundRest || !workoutBlock.roundRest) return 0;
    const match = workoutBlock.roundRest.match(/(\d+)/);
    return match ? parseInt(match[1]) : 120; // Default to 2 minutes
  };

  useEffect(() => {
    if (isRoundRest) {
      setTime(parseRoundRestDuration());
    } else {
      setTime(totalDuration);
    }
    if (shouldAutoStart && !isRoundRest) {
      setIsActive(true);
    }
  }, [totalDuration, shouldAutoStart, isRoundRest]);

  // Timer effect
  useEffect(() => {
    if (isActive && !isPaused && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            if (isRoundRest) {
              // Finished round rest, start next AMRAP round
              setIsRoundRest(false);
              setCurrentAMRAPRound(currentAMRAPRound + 1);
              setRoundsCompleted(0); // Reset rounds for new AMRAP session
              setTime(totalDuration);
              setIsActive(true);
            } else if (
              hasMultipleAMRAPRounds &&
              currentAMRAPRound < totalAMRAPRounds
            ) {
              // Finished AMRAP round, start rest period
              if (hasRoundRest) {
                setIsRoundRest(true);
                setTime(parseRoundRestDuration());
                setIsActive(true);
              } else {
                setCurrentAMRAPRound(currentAMRAPRound + 1);
                setRoundsCompleted(0);
                setTime(totalDuration);
                setIsActive(false); // Let user start next round manually
              }
            } else {
              // All AMRAP rounds complete
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
  ]);

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
    setTime(totalDuration);
    setIsActive(false);
    setIsPaused(false);
    setRoundsCompleted(0);
    setIsComplete(false);
    setCurrentAMRAPRound(1);
    setIsRoundRest(false);
  };

  const incrementRounds = () => {
    setRoundsCompleted((prev) => prev + 1);
  };

  const decrementRounds = () => {
    setRoundsCompleted((prev) => Math.max(0, prev - 1));
  };

  const handleComplete = () => {
    clearInterval(intervalRef.current);
    onComplete();
  };

  const getProgressPercentage = () => {
    if (isRoundRest) {
      const roundRestDuration = parseRoundRestDuration();
      return ((roundRestDuration - time) / roundRestDuration) * 100;
    }
    return ((totalDuration - time) / totalDuration) * 100;
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
        <div className="bg-customGray p-6 rounded-lg text-center max-w-2xl w-full border-brightYellow border-2">
          <div className="text-6xl mb-6">⏰</div>
          <h2 className="font-higherJump text-3xl font-bold text-customWhite mb-4">
            AMRAP Complete!
          </h2>
          <p className="text-lg text-logoGray mb-4">
            {hasMultipleAMRAPRounds
              ? `All ${totalAMRAPRounds} AMRAP rounds complete!`
              : `Time's up! You completed ${roundsCompleted} rounds.`}
          </p>
          <div className="space-y-4">
            <button onClick={handleComplete} className="btn-full-colour">
              Continue Workout
            </button>
            <button onClick={resetTimer} className="btn-cancel">
              Restart AMRAP
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
      <div className="bg-customGray p-4 rounded-lg text-center max-w-6xl w-full h-full lg:max-h-[140vh] flex flex-col border-brightYellow border-2 mt-20 md:mt-26">
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
          <div className="flex flex-col md:flex-row gap-0 md:gap-2 w-full items-center">
            {/* Description */}
            <div className="flex items-center justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center">
              <p className="text-logoGray text-sm whitespace-pre-line break-words leading-loose">
                <span className="text-limeGreen font-bold">Description:</span>{" "}
                {description}
              </p>
            </div>

            {/* Instructions */}
            <div className="flex items-center justify-center w-5/6 lg:w-1/2 bg-gray-600 rounded-lg p-3 m-3 text-center">
              <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                <span className="text-limeGreen font-bold">
                  Instructions:
                </span>{" "}
                  Complete all exercises in order for 1 round. Click exercises to view videos.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col lg:flex-row gap-6 p-4">
          {/* Left Column: Timer and Round Counter */}
          <div className="w-full lg:w-1/3 flex flex-col space-y-4">
            <div className="flex flex-row-reverse lg:flex-col gap-4">
              {/* Timer */}
              <div className="w-1/2 lg:w-full bg-gray-600 rounded-lg p-6 text-center">
                <div
                  className={`text-6xl mb-4 ${
                    isRoundRest ? "text-hotPink" : "text-limeGreen"
                  }`}
                >
                  {formatTime(time)}
                </div>
                {/* Timer Controls */}
                <div className="flex justify-center space-x-2">
                  {!isActive || isPaused ? (
                    <button onClick={startTimer} className="btn-full-colour mt-3">
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
                </div>
              </div>

              {/* Round Counter */}
              <div className="bg-gray-600 w-1/2 lg:w-full rounded-lg p-6 text-center">
                {/* <h3 className="text-xl font-bold text-customWhite mb-2">
                  Rounds Completed
                </h3> */}
                <div className="text-6xl text-brightYellow mb-4">
                  {roundsCompleted}
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={decrementRounds}
                    className="btn-cancel mt-3"
                    disabled={roundsCompleted === 0}
                  >
                    -1
                  </button>
                  <button
                    onClick={incrementRounds}
                    className="btn-full-colour mt-3"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>
            {/* Exercise Details */}
            <div className="mt-2 space-y-2">
              {workoutBlock.exercises[selectedExerciseIndex].exercise
                .instructions && (
                <div className="bg-gray-600 rounded-lg p-3">
                  <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                    <span className="text-limeGreen font-bold">
                      Instructions:
                    </span>{" "}
                    {
                      workoutBlock.exercises[selectedExerciseIndex].exercise
                        .instructions
                    }
                  </p>
                </div>
              )}
              {workoutBlock.exercises[selectedExerciseIndex].exercise
                .tips && (
                <div className="bg-gray-600 rounded-lg p-3">
                  <p className="text-sm text-logoGray whitespace-pre-line break-words leading-loose">
                    <span className="text-limeGreen font-bold">Tips:</span>{" "}
                    {
                      workoutBlock.exercises[selectedExerciseIndex].exercise
                        .tips
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Exercise List */}
          <div className="w-full lg:w-2/3">
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="space-y-2">
                {workoutBlock.exercises.map((exercise, index) => (
                  <button
                    key={exercise.id || index}
                    onClick={() => setSelectedExerciseIndex(index)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedExerciseIndex === index
                        ? "bg-limeGreen text-black"
                        : "bg-gray-600 text-white hover:bg-gray-500"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {exercise.exercise.name}
                      </span>
                      <span className="text-lg font-bold">
                        {exercise.reps} reps
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* Video */}
            <div className="pt-4">
              <div className="relative w-full pb-[30.25%] overflow-hidden rounded-lg">
                <div className="absolute top-0 left-0 w-full h-1/2"></div>
                  <ExerciseVideo
                    exercise={workoutBlock.exercises[selectedExerciseIndex]}
                    isActive={true}
                    shouldAutoStart={false}
                  />
                </div>
              </div>
            </div>
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

export default AMRAPWorkout;
