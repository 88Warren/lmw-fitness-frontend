import { useState } from "react";
import PropTypes from "prop-types";
import ExerciseVideo from "./ExerciseVideo";

const MobilityWorkout = ({
  workoutBlock,
  onComplete,
  onGoBack,
  canGoBack,
  hasOptionalWorkout = false,
  onFinishDay = null,
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
    <div className="min-h-screen bg-white pt-32 pb-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-customGray font-titillium">Mobility Session</h1>

          {/* Back Button */}
          {canGoBack && (
            <div className="flex justify-center mt-4">
              <button
                onClick={onGoBack}
                className="inline-flex items-center gap-2 text-sm font-titillium font-semibold text-customGray/50 hover:text-customGray transition-colors duration-200"
              >
                ← Back to Overview
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {!hasStarted ? (
            /* Start Screen */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <div className="text-8xl mb-6">🧘‍♀️</div>
              <h2 className="text-xl font-bold text-customGray font-titillium mb-4">
                Ready for your mobility session?
              </h2>
              <p className="text-customGray/60 font-titillium mb-6 max-w-md mx-auto">
                This is a follow-along mobility session. The video will guide
                you through the entire routine.
              </p>
              <button onClick={handleStart} className="btn-primary mt-3">
                Start Mobility Session
              </button>
              {/* Block Notes */}
              {workoutBlock.blockNotes && (
                <div className="mt-6 bg-gray-50 rounded-xl p-4 text-left">
                  <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed">
                    {workoutBlock.blockNotes}
                  </p>
                </div>
              )}
            </div>
          ) : isComplete ? (
            /* Completion Screen */
            <div className="min-h-screen bg-white flex items-center justify-center p-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-lg w-full text-center">
                <div className="text-8xl mb-6">✅</div>
                <h2 className="text-2xl font-bold text-limeGreen font-titillium mb-4">
                  Mobility Session Complete!
                </h2>
                <p className="text-customGray/60 font-titillium mb-6 max-w-md mx-auto">
                  Great job! Your muscles should feel more relaxed and ready for
                  action.
                </p>

                {hasOptionalWorkout ? (
                  <div className="space-y-4">
                    <button
                      onClick={onFinishDay || handleFinish}
                      className="btn-primary mr-4"
                    >
                      Finish Day
                    </button>
                    <button
                      onClick={() => {
                        handleFinish();
                      }}
                      className="btn-cancel"
                    >
                      Back to Choices
                    </button>
                    <p className="text-customGray/60 font-titillium text-sm text-center max-w-md mx-auto">
                      You&apos;ve completed the required mobility session! You can
                      finish the day now or go back to try the optional workout.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="btn-primary text-xl px-8 py-4"
                  >
                    Finish Session
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Video Screen */
            <div className="flex-1 flex flex-col space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <ExerciseVideo
                  exercise={mobilityExercise}
                  isActive={true}
                  shouldAutoStart={true}
                  showModified={false}
                  isMobility={true}
                />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-3 mb-4">
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
  hasOptionalWorkout: PropTypes.bool,
  onFinishDay: PropTypes.func,
};

export default MobilityWorkout;
