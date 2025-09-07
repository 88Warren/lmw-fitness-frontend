import React, { useState } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";
import DynamicHeading from "../../components/Shared/DynamicHeading";

const MobilityWorkout = ({
  workoutBlock,
  onComplete,
  onGoBack,
  canGoBack,
  shouldAutoStart = false,
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const mobilityExercise = workoutBlock.exercises[0];

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  const handleFinish = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
      <div className="bg-customGray p-4 rounded-lg text-center max-w-6xl w-full h-full lg:max-h-[110vh] flex flex-col border-brightYellow border-2 mt-20 md:mt-26">
        {/* Header */}
        <div className="flex flex-col mb-4 items-center">
          <DynamicHeading
            text="Mobility Session"
            className="font-higherJump m-4 text-xl md:text-3xl font-bold text-customWhite text-center leading-loose tracking-widest"
          /> 

          {/* Back Button */}
          {canGoBack && (
            <div className="flex justify-center mb-4">
              <button onClick={onGoBack} className="btn-cancel">
                Back to Overview
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {!hasStarted ? (
            /* Start Screen */
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-8xl mb-6">🧘‍♀️</div>
              <h2 className="text-2xl font-bold text-customWhite mb-4">
                Ready for your mobility session?
              </h2>
              <p className="text-logoGray mb-6 max-w-md text-center">
                This is a follow-along mobility session. The video will guide
                you through the entire routine.
              </p>
              <button
                onClick={handleStart}
                className="btn-primary mt-3"
              >
                Start Mobility Session
              </button>
              {/* Block Notes */}
              <div className="flex items-center justify-center mt-4">
              {workoutBlock.blockNotes && (
                <div className="w-2/3 bg-gray-600 rounded-lg p-3 m-3 text-center">
                  <p className="text-logoGray text-sm whitespace-pre-line break-words leading-loose">
                    <span className="text-limeGreen font-bold">Notes:</span>{" "}
                    {workoutBlock.blockNotes}
                  </p>
                </div>
              )}
          </div>
            </div>
          ) : isComplete ? (
            /* Completion Screen */
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-8xl mb-6">✅</div>
              <h2 className="text-2xl font-bold text-limeGreen mb-4">
                Mobility Session Complete!
              </h2>
              <p className="text-logoGray mb-6 max-w-md text-center">
                Great job! Your muscles should feel more relaxed and ready for
                action.
              </p>
              <button
                onClick={handleFinish}
                className="btn-primary text-xl px-8 py-4"
              >
                Finish Session
              </button>
            </div>
          ) : (
            /* Video Screen */
            <div className="flex-1 flex flex-col">
              <div className="flex-1 bg-gray-700 rounded-lg p-4 mb-4">
                <ExerciseVideo
                  exercise={mobilityExercise}
                  isActive={true}
                  shouldAutoStart={true}
                  showModified={false}
                  isMobility={true}
                />
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4 mb-4">
                <button
                  onClick={handleComplete}
                  className="btn-primary px-6 py-3"
                >
                  Mark as Complete
                </button>
                <button onClick={onGoBack} className="btn-cancel px-6 py-3">
                  Exit Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MobilityWorkout.propTypes = {
  workoutBlock: PropTypes.shape({
    blockNotes: PropTypes.string,
    exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  shouldAutoStart: PropTypes.bool,
};

export default MobilityWorkout;
