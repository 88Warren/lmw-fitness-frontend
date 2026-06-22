import PropTypes from "prop-types";

const WorkoutChoice = ({
  workoutData,
  onChoiceMade,
  onGoBack,
  completedSessions = [],
}) => {
  const hasMobilityBlock = workoutData.workoutBlocks.some(
    (block) => block.blockType === "Mobility"
  );

  const getWorkoutSessions = () => {
    const sessions = [];
    let currentSession = [];
    let sessionIndex = 0;

    const nonMobilityBlocks = workoutData.workoutBlocks.filter(
      (block) => block.blockType !== "Mobility"
    );

    if (nonMobilityBlocks.length <= 1) {
      if (nonMobilityBlocks.length === 1) {
        const blockIndex = workoutData.workoutBlocks.findIndex(
          (b) => b === nonMobilityBlocks[0]
        );
        sessions.push({
          id: 0,
          name: getSessionName([nonMobilityBlocks[0]], 0),
          blocks: [nonMobilityBlocks[0]],
          blockIndices: [blockIndex],
        });
      }
      return sessions;
    }

    workoutData.workoutBlocks.forEach((block, index) => {
      if (block.blockType === "Mobility") {
        return;
      }

      let isNewSession = false;

      if (currentSession.length === 0) {
        isNewSession = false;
      } else {
        const lastBlock = currentSession[currentSession.length - 1];

        isNewSession =
          block.sessionBreak ||
          (block.blockNotes &&
            (block.blockNotes.toLowerCase().includes("workout") ||
              block.blockNotes.toLowerCase().includes("circuit") ||
              block.blockNotes.toLowerCase().includes("finisher"))) ||
          (block.blockType !== lastBlock.blockType &&
            !(
              block.blockType === "Tabata" && lastBlock.blockType === "Tabata"
            )) ||
          (block.blockType !== "Tabata" &&
            lastBlock.blockType !== "Tabata" &&
            ["AMRAP", "EMOM", "For Time", "Circuit"].includes(
              block.blockType
            ) &&
            ["AMRAP", "EMOM", "For Time", "Circuit"].includes(
              lastBlock.blockType
            )) ||
          (nonMobilityBlocks.length > 2 &&
            currentSession.length >= Math.ceil(nonMobilityBlocks.length / 2));
      }

      if (isNewSession && currentSession.length > 0) {
        sessions.push({
          id: sessionIndex,
          name: getSessionName(currentSession, sessionIndex),
          blocks: [...currentSession],
          blockIndices: currentSession.map((b) => b.originalIndex),
        });
        currentSession = [];
        sessionIndex++;
      }

      currentSession.push({ ...block, originalIndex: index });
    });

    if (currentSession.length > 0) {
      sessions.push({
        id: sessionIndex,
        name: getSessionName(currentSession, sessionIndex),
        blocks: [...currentSession],
        blockIndices: currentSession.map((b) => b.originalIndex),
      });
    }

    return sessions;
  };

  const getSessionName = (blocks, index) => {
    const firstBlock = blocks[0];

    if (
      firstBlock.blockNotes &&
      firstBlock.blockNotes.toLowerCase().includes("finisher")
    ) {
      return "Finisher";
    }

    if (firstBlock.blockNotes) {
      const notes = firstBlock.blockNotes.toLowerCase();
      if (notes.includes("strength")) return "Strength";
      if (notes.includes("cardio")) return "Cardio";
      if (notes.includes("conditioning")) return "Conditioning";
      if (notes.includes("circuit")) return "Circuit";
    }

    return `Workout ${index + 1}`;
  };

  const getSessionIcon = (sessionName, blocks) => {
    const name = sessionName.toLowerCase();
    if (name.includes("finisher")) return "🔥";
    if (name.includes("strength")) return "💪";
    if (name.includes("cardio")) return "❤️";
    if (name.includes("conditioning")) return "⚡";
    if (name.includes("circuit")) return "🔄";

    const hasAMRAP = blocks.some((b) => b.blockType === "AMRAP");
    const hasEMOM = blocks.some((b) => b.blockType === "EMOM");
    const hasTabata = blocks.some((b) => b.blockType === "Tabata");
    const hasForTime = blocks.some((b) => b.blockType === "For Time");

    if (hasTabata) return "🔥";
    if (hasAMRAP) return "⏰";
    if (hasEMOM) return "⏱️";
    if (hasForTime) return "🏃‍♂️";

    return "💪";
  };

  const getSessionDescription = (blocks) => {
    const blockTypes = [...new Set(blocks.map((b) => b.blockType))];
    const exerciseCount = blocks.reduce(
      (total, block) => total + block.exercises.length,
      0
    );

    let description = `${exerciseCount} exercises`;
    if (blockTypes.length > 0) {
      description += ` • ${blockTypes.join(", ")}`;
    }

    return description;
  };

  const workoutSessions = getWorkoutSessions();

  const forceMultiWorkout = () => {
    const title = workoutData.title?.toLowerCase() || "";
    const description = workoutData.description?.toLowerCase() || "";

    const hasMultipleCircuits =
      title.includes("circuit") &&
      workoutData.workoutBlocks.filter((b) => b.blockType !== "Mobility")
        .length > 1;
    const hasFinisher =
      description.includes("finisher") ||
      workoutData.workoutBlocks.some((b) =>
        b.blockNotes?.toLowerCase().includes("finisher")
      );
    const specialBlockTypes = [
      ...new Set(
        workoutData.workoutBlocks
          .filter((b) =>
            ["AMRAP", "EMOM", "Tabata", "For Time", "Circuit"].includes(
              b.blockType
            )
          )
          .map((b) => b.blockType)
      ),
    ];

    const hasMultipleSpecialBlocks =
      specialBlockTypes.length > 1 ||
      (specialBlockTypes.length === 1 &&
        specialBlockTypes[0] !== "Tabata" &&
        workoutData.workoutBlocks.filter(
          (b) => b.blockType === specialBlockTypes[0]
        ).length > 1);

    return hasMultipleCircuits || hasFinisher || hasMultipleSpecialBlocks;
  };

  const shouldForceMulti = forceMultiWorkout();
  const isMultiWorkoutDay =
    workoutSessions.length > 1 || hasMobilityBlock || shouldForceMulti;

  if (
    shouldForceMulti &&
    workoutSessions.length === 1 &&
    workoutSessions[0].blocks.length > 1
  ) {
    const blocks = workoutSessions[0].blocks;
    const midPoint = Math.ceil(blocks.length / 2);

    const newSessions = [
      {
        id: 0,
        name: getSessionName(blocks.slice(0, midPoint), 0),
        blocks: blocks.slice(0, midPoint),
        blockIndices: blocks.slice(0, midPoint).map((b) => b.originalIndex),
      },
      {
        id: 1,
        name: getSessionName(blocks.slice(midPoint), 1),
        blocks: blocks.slice(midPoint),
        blockIndices: blocks.slice(midPoint).map((b) => b.originalIndex),
      },
    ];

    workoutSessions.length = 0;
    workoutSessions.push(...newSessions);
  }

  const handleChoice = (choice, sessionData = null) => {
    onChoiceMade(choice, sessionData);
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-xl md:text-2xl font-bold text-customGray font-titillium text-center">{workoutData.title}</h1>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={onGoBack}
            className="inline-flex items-center gap-2 text-sm font-titillium font-semibold text-customGray/50 hover:text-customGray transition-colors duration-200"
          >
            ← Back to Overview
          </button>
        </div>

        {/* Description */}
        {workoutData.description && (
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-customGray/70 font-titillium leading-relaxed">
              {workoutData.description}
            </p>
          </div>
        )}

        {/* Choice Options */}
        <div className="space-y-6">
          {isMultiWorkoutDay ? (
            <>
              <h2 className="text-lg font-bold text-customGray font-titillium mb-4">
                {workoutSessions.length === 0
                  ? "Today's Mobility - Complete to finish the day"
                  : hasMobilityBlock && workoutSessions.length === 1
                  ? "Mobility Day - Choose your training"
                  : "Today's Workouts - Complete all to finish the day"}
              </h2>

              <div
                className={`grid gap-4 max-w-6xl mx-auto ${
                  (hasMobilityBlock ? 1 : 0) + workoutSessions.length === 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {/* Mobility */}
                {hasMobilityBlock && (
                  <div
                    className={`rounded-2xl p-6 flex flex-col ${
                      completedSessions.includes("mobility")
                        ? "bg-limeGreen/10 border-2 border-limeGreen"
                        : "bg-white border border-gray-100 shadow-sm hover:border-brightYellow hover:shadow-md transition-all duration-200"
                    }`}
                  >
                    <div className="text-4xl mb-4">🧘‍♀️</div>
                    <h3 className={`text-base font-bold font-titillium mb-2 ${completedSessions.includes("mobility") ? "text-limeGreen" : "text-customGray"}`}>
                      Mobility Session
                      {completedSessions.includes("mobility") && (
                        <span className="ml-2 text-lg">✓</span>
                      )}
                    </h3>
                    <p className="text-sm text-customGray/60 font-titillium mb-4 grow">
                      Stretching and mobility work for flexibility and recovery.
                      {workoutSessions.length === 0 && (
                        <span className="block mt-1 font-semibold text-limeGreen">
                          Required to complete the day.
                        </span>
                      )}
                    </p>
                    <div className="mt-auto">
                      {completedSessions.includes("mobility") ? (
                        <button
                          onClick={() => handleChoice("mobility")}
                          className="w-full py-2.5 px-4 bg-white text-limeGreen text-sm font-titillium font-bold rounded-xl border-2 border-limeGreen hover:bg-limeGreen/10 transition-colors duration-200"
                        >
                          Redo Mobility
                        </button>
                      ) : (
                        <button
                          onClick={() => handleChoice("mobility")}
                          className="w-full py-2.5 px-4 bg-brightYellow text-black text-sm font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200"
                        >
                          Start Mobility
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Workout Sessions */}
                {workoutSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`rounded-2xl p-6 flex flex-col ${
                      completedSessions.includes(`workout-${session.id}`)
                        ? "bg-limeGreen/10 border-2 border-limeGreen"
                        : "bg-white border border-gray-100 shadow-sm hover:border-brightYellow hover:shadow-md transition-all duration-200"
                    }`}
                  >
                    <div className="text-4xl mb-4">
                      {getSessionIcon(session.name, session.blocks)}
                    </div>
                    <h3 className={`text-base font-bold font-titillium mb-2 ${completedSessions.includes(`workout-${session.id}`) ? "text-limeGreen" : "text-customGray"}`}>
                      {session.name}
                      {completedSessions.includes(`workout-${session.id}`) && (
                        <span className="ml-2 text-lg">✓</span>
                      )}
                    </h3>
                    <p className="text-sm text-customGray/60 font-titillium mb-4 grow">
                      {getSessionDescription(session.blocks)}
                    </p>
                    <div className="mt-auto">
                      {completedSessions.includes(`workout-${session.id}`) ? (
                        <button
                          onClick={() => handleChoice("workout", session)}
                          className="w-full py-2.5 px-4 bg-white text-limeGreen text-sm font-titillium font-bold rounded-xl border-2 border-limeGreen hover:bg-limeGreen/10 transition-colors duration-200"
                        >
                          Redo {session.name}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleChoice("workout", session)}
                          className="w-full py-2.5 px-4 bg-brightYellow text-black text-sm font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200"
                        >
                          Start {session.name}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress and Instructions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide">Progress</span>
                  <span className="text-sm text-customGray/70 font-titillium">
                    {completedSessions.length} /{" "}
                    {(hasMobilityBlock ? 1 : 0) + workoutSessions.length}{" "}
                    completed
                  </span>
                </div>
                <div className="bg-gray-100 rounded-full h-3 mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-limeGreen"
                    style={{
                      width: `${
                        (completedSessions.length /
                          ((hasMobilityBlock ? 1 : 0) +
                            workoutSessions.length)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-customGray/70 font-titillium leading-relaxed">
                  {workoutSessions.length === 0
                    ? "Complete the mobility session to finish today's training."
                    : hasMobilityBlock && workoutSessions.length === 1
                    ? "Complete the mobility session to finish the day. The workout is optional for extra challenge."
                    : "Complete all workouts to finish today's training. You can do them in any order, but finishers are recommended last. Take breaks between workouts as needed."}
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-customGray font-titillium mb-4">
                What would you like to do today?
              </h2>

              <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                {/* Mobility */}
                {hasMobilityBlock && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-brightYellow hover:shadow-md transition-all duration-200 p-6 flex flex-col">
                    <div className="text-5xl mb-4">🧘‍♀️</div>
                    <h3 className="text-base font-bold text-customGray font-titillium mb-2">
                      Mobility Session
                    </h3>
                    <p className="text-sm text-customGray/60 font-titillium mb-4 grow">
                      Focus on stretching and mobility work to improve
                      flexibility and aid recovery.{" "}
                      <span className="text-limeGreen font-semibold">
                        Required for day completion.
                      </span>
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={() => handleChoice("mobility")}
                        className="w-full py-2.5 px-4 bg-brightYellow text-black text-sm font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200"
                      >
                        Start Mobility
                      </button>
                    </div>
                  </div>
                )}

                {/* Single Workout */}
                {workoutSessions.length === 1 && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-brightYellow hover:shadow-md transition-all duration-200 p-6 flex flex-col">
                    <div className="text-5xl mb-4">
                      {getSessionIcon(
                        workoutSessions[0].name,
                        workoutSessions[0].blocks
                      )}
                    </div>
                    <h3 className="text-base font-bold text-customGray font-titillium mb-2">
                      {hasMobilityBlock
                        ? "Optional Workout"
                        : "Today's Workout"}
                    </h3>
                    <p className="text-sm text-customGray/60 font-titillium mb-4 grow">
                      {hasMobilityBlock ? (
                        <>
                          Challenge yourself with today&apos;s optional workout.
                          <span className="text-brightYellow font-semibold">
                            {" "}
                            Optional - not required for day completion.
                          </span>
                        </>
                      ) : (
                        getSessionDescription(workoutSessions[0].blocks)
                      )}
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={() =>
                          handleChoice("workout", workoutSessions[0])
                        }
                        className="w-full py-2.5 px-4 bg-brightYellow text-black text-sm font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200"
                      >
                        Start Workout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Recovery Day Info */}
              {hasMobilityBlock && workoutSessions.length === 1 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-titillium font-bold text-limeGreen uppercase tracking-wide mb-1">Recovery Day</p>
                  <p className="text-sm text-customGray/70 font-titillium leading-relaxed">
                    Choose mobility for recovery and flexibility, or add the
                    optional workout for extra challenge. You can do them in any
                    order or just one - it&apos;s up to you!
                  </p>
                </div>
              )}
            </>
          )}
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
        blockNotes: PropTypes.string,
        exercises: PropTypes.array,
      })
    ).isRequired,
  }).isRequired,
  onChoiceMade: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
  completedSessions: PropTypes.arrayOf(PropTypes.string),
};

export default WorkoutChoice;
