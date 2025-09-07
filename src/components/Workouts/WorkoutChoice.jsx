import React from "react";
import PropTypes from "prop-types";
import DynamicHeading from "../Shared/DynamicHeading";

const WorkoutChoice = ({ workoutData, onChoiceMade, onGoBack }) => {
  const hasMobilityBlock = workoutData.workoutBlocks.some(
    (block) => block.blockType === "Mobility"
  );
  const hasRegularWorkout = workoutData.workoutBlocks.some(
    (block) => block.blockType !== "Mobility"
  );

  const handleChoice = (choice) => {
    onChoiceMade(choice);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
      <div className="bg-customGray p-6 rounded-lg text-center max-w-4xl w-full border-brightYellow border-2 mt-20 md:mt-26">
        {/* Header */}
        <DynamicHeading
          text={workoutData.title}
          className="font-higherJump m-4 text-xl md:text-3xl font-bold text-customWhite text-center leading-loose tracking-widest"
        />

        {/* Back Button */}
        <div className="flex justify-center mb-6">
          <button onClick={onGoBack} className="btn-cancel">
            Back to Overview
          </button>
        </div>

        {/* Description */}
        <div className="flex items-center justify-center m-3">
          {workoutData.description && (
            <div className="w-2/3 bg-gray-600 rounded-lg p-3 m-3 text-center">
              <p className="text-logoGray text-sm whitespace-pre-line break-words leading-loose">
                <span className="text-limeGreen font-bold">Description:</span>{" "}
                {workoutData.description}
              </p>
            </div>
          )}
        </div>

        {/* Choice Options */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-customWhite mb-6">
            What would you like to do today?
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Mobility Only */}
            {hasMobilityBlock && (
              <div className="bg-gray-600 rounded-lg p-6 hover:bg-gray-600 transition-colors flex flex-col">
                <div className="text-4xl mb-4">🧘‍♀️</div>
                <h3 className="text-lg font-bold text-customWhite mb-2">
                  Mobility Only
                </h3>
                <p className="text-logoGray text-sm mb-4">
                  Focus on stretching and mobility work to improve flexibility
                  and aid recovery.
                </p>
                <div className="mt-auto">
                  <button
                    onClick={() => handleChoice("mobility")}
                    className="btn-primary w-full"
                  >
                    Start Mobility
                  </button>
                </div>
              </div>
            )}

            {/* Workout Only */}
            {hasRegularWorkout && (
              <div className="bg-gray-600 rounded-lg p-6 hover:bg-gray-600 transition-colors flex flex-col">
                <div className="text-4xl mb-4">💪</div>
                <h3 className="text-lg font-bold text-customWhite mb-2">
                  Workout Only
                </h3>
                <p className="text-logoGray text-sm mb-4">
                  Jump straight into your workout.
                </p>
                <div className="mt-auto">
                  <button
                    onClick={() => handleChoice("workout")}
                    className="btn-primary w-full justify-end"
                  >
                    Start Workout
                  </button>
                </div>
              </div>
            )}

            {/* Both */}
            {hasRegularWorkout && hasMobilityBlock && (
              <div className="bg-gray-600 rounded-lg p-6 hover:bg-gray-600 transition-colors flex flex-col">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-lg font-bold text-customWhite mb-2">
                  Both Sessions
                </h3>
                <p className="text-logoGray text-sm mb-4">
                  Complete your workout first, then move on to the mobility session and improve recovery.
                </p>
                <div className="mt-auto">
                  <button
                    onClick={() => handleChoice("both")}
                    className="btn-primary w-full"
                  >
                    Start Both
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-gray-600 rounded-lg p-4 mt-6">
            <p className="text-logoGray text-sm whitespace-pre-line break-words leading-loose">
              <span className="text-limeGreen font-bold">Tip: </span> 
              Mobility work is great for recovery days and help aid recovery and flexibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

WorkoutChoice.propTypes = {
  workoutData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    workoutBlocks: PropTypes.arrayOf(
      PropTypes.shape({
        blockType: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onChoiceMade: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export default WorkoutChoice;
