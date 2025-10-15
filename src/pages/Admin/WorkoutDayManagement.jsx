import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { showToast } from "../../utils/toastUtil";
import { ToastContainer } from "react-toastify";
import api from "../../utils/api";
import { BACKEND_URL } from "../../utils/config";
import DynamicHeading from "../../components/Shared/DynamicHeading";
import { useParams, Link } from "react-router-dom";
import PropTypes from "prop-types";

const WorkoutDayManagement = () => {
  const { programId } = useParams();

  const [program, setProgram] = useState(null);
  const [workoutDays, setWorkoutDays] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedDays, setExpandedDays] = useState({});
  const [editingDay, setEditingDay] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [detailedView, setDetailedView] = useState({});

  const [formData, setFormData] = useState({
    programId: parseInt(programId),
    dayNumber: 1,
    title: "",
    description: "",
    workoutBlocks: [],
  });

  const blockTypes = [
    "Fitness Assessment",
    "Circuit",
    "EMOM",
    "Mobility",
    "For Time",
    "Tabata",
    "AMRAP",
  ];

  useEffect(() => {
    if (programId) {
      fetchProgram();
      fetchExercises();
    }
  }, [programId]);

  const fetchProgram = async () => {
    try {
      const response = await api.get(
        `${BACKEND_URL}/api/admin/programs/${programId}`
      );
      setProgram(response.data);
      setWorkoutDays(response.data.days || response.data.Days || []);
    } catch (error) {
      showToast("error", "Failed to fetch program");
      console.error("Error fetching program:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await api.get(`${BACKEND_URL}/api/admin/exercises`);
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const handleCreateDay = async () => {
    try {
      // Transform the data to ensure proper types for the backend
      const transformedData = {
        ...formData,
        workoutBlocks: formData.workoutBlocks.map((block) => ({
          ...block,
          blockRounds: block.blockRounds ? parseInt(block.blockRounds) || 0 : 0,
          exercises: block.exercises.map((exercise) => ({
            ...exercise,
            exerciseId: exercise.exerciseId ? parseInt(exercise.exerciseId) : 0,
            order: parseInt(exercise.order) || 1,
          })),
        })),
      };

      const response = await api.post(
        `${BACKEND_URL}/api/admin/workout-days`,
        transformedData
      );
      setWorkoutDays([...workoutDays, response.data]);
      setShowCreateForm(false);
      resetForm();
      showToast("success", "Workout day created successfully");
    } catch (error) {
      showToast("error", "Failed to create workout day");
      console.error("Error creating workout day:", error);
    }
  };

  const handleUpdateDay = async (id) => {
    try {
      // Transform the data to ensure proper types for the backend
      const transformedData = {
        ...formData,
        workoutBlocks: formData.workoutBlocks.map((block) => ({
          ...block,
          blockRounds: block.blockRounds ? parseInt(block.blockRounds) || 0 : 0,
          exercises: block.exercises.map((exercise) => ({
            ...exercise,
            exerciseId: exercise.exerciseId ? parseInt(exercise.exerciseId) : 0,
            order: parseInt(exercise.order) || 1,
          })),
        })),
      };

      const response = await api.put(
        `${BACKEND_URL}/api/admin/workout-days/${id}`,
        transformedData
      );
      setWorkoutDays(
        workoutDays.map((day) => (day.ID === id ? response.data : day))
      );
      setEditingDay(null);
      resetForm();
      showToast("success", "Workout day updated successfully");
    } catch (error) {
      showToast("error", "Failed to update workout day");
      console.error("Error updating workout day:", error);
    }
  };

  const handleDeleteDay = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this workout day? This will also delete all associated blocks and exercises."
      )
    )
      return;

    try {
      await api.delete(`${BACKEND_URL}/api/admin/workout-days/${id}`);
      setWorkoutDays(workoutDays.filter((day) => day.ID !== id));
      showToast("success", "Workout day deleted successfully");
    } catch (error) {
      showToast("error", "Failed to delete workout day");
      console.error("Error deleting workout day:", error);
    }
  };

  const startEdit = (day) => {
    setEditingDay(day.ID);

    // Process workout blocks and exercises
    const blocks = (day.WorkoutBlocks || day.workoutBlocks || []).map(
      (block) => ({
        id: block.ID || block.id,
        blockType: block.blockType || block.BlockType || "",
        blockRounds: block.blockRounds || block.BlockRounds || "",
        blockNotes: block.blockNotes || block.BlockNotes || "",
        roundRest: block.roundRest || block.RoundRest || "",
        exercises: (block.Exercises || block.exercises || []).map(
          (exercise) => ({
            id: exercise.ID || exercise.id,
            exerciseId:
              exercise.exerciseId || exercise.ExerciseID || exercise.exerciseID,
            exerciseName:
              exercise.Exercise?.name || exercise.exercise?.name || "",
            order: exercise.order || exercise.Order || 1,
            reps: exercise.reps || exercise.Reps || "",
            duration: exercise.duration || exercise.Duration || "",
            rest: exercise.rest || exercise.Rest || "",
            tips: exercise.tips || exercise.Tips || "",
            instructions: exercise.instructions || exercise.Instructions || "",
            workRestRatio:
              exercise.workRestRatio || exercise.WorkRestRatio || "",
          })
        ),
      })
    );

    setFormData({
      programId: day.programId || parseInt(programId),
      dayNumber: day.dayNumber || 1,
      title: day.title || "",
      description: day.description || "",
      workoutBlocks: blocks,
    });
  };

  const resetForm = () => {
    setFormData({
      programId: parseInt(programId),
      dayNumber: Math.max(...workoutDays.map((d) => d.dayNumber || 0), 0) + 1,
      title: "",
      description: "",
      workoutBlocks: [],
    });
  };

  const cancelEdit = () => {
    setEditingDay(null);
    setShowCreateForm(false);
    resetForm();
  };

  const toggleDayExpansion = (dayId) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  const toggleDetailedView = (dayId) => {
    setDetailedView((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-customGray pt-24">
        <p className="text-xl font-titillium text-customWhite">
          Loading workout days...
        </p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-customGray pt-24">
        <div className="text-center">
          <p className="text-xl font-titillium text-customWhite mb-4">
            Program not found
          </p>
          <p className="text-logoGray font-titillium">
            Program ID: {programId}
          </p>
          <Link
            to="/admin/workout-days"
            className="btn-full-colour mt-4 inline-block"
          >
            Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gradient-to-b from-customGray/30 to-white p-6 pt-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/workout-days"
            className="p-2 bg-customGray text-brightYellow rounded hover:bg-brightYellow hover:text-customGray transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <DynamicHeading
            text={`${program.name} - Workout Days`}
            className="font-higherJump text-3xl md:text-4xl font-bold text-customGray leading-loose tracking-widest"
          />
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="text-logoGray font-titillium">
            <p>
              Difficulty:{" "}
              <span className="text-brightYellow">{program.difficulty}</span>
            </p>
            <p>
              Duration:{" "}
              <span className="text-brightYellow">{program.duration} days</span>
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-full-colour flex items-center gap-2"
          >
            <Plus size={20} />
            Add Workout Day
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-customGray p-6 rounded-lg border-2 border-brightYellow mb-8"
          >
            <h3 className="text-xl font-bold text-customWhite mb-4 font-higherJump">
              Create New Workout Day
            </h3>
            <WorkoutDayForm
              formData={formData}
              setFormData={setFormData}
              exercises={exercises}
              blockTypes={blockTypes}
              onSave={handleCreateDay}
              onCancel={cancelEdit}
            />
          </motion.div>
        )}

        {/* Workout Days List */}
        <div className="grid gap-6">
          {workoutDays
            .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0))
            .map((day) => (
              <motion.div
                key={day.ID}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-customGray p-6 rounded-lg border-2 border-brightYellow"
              >
                {editingDay === day.ID ? (
                  <WorkoutDayForm
                    formData={formData}
                    setFormData={setFormData}
                    exercises={exercises}
                    blockTypes={blockTypes}
                    onSave={() => handleUpdateDay(day.ID)}
                    onCancel={cancelEdit}
                  />
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleDayExpansion(day.ID)}
                          className="text-brightYellow hover:text-hotPink transition-colors"
                        >
                          {expandedDays[day.ID] ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronRight size={20} />
                          )}
                        </button>
                        <div>
                          <h3 className="text-xl font-bold text-customWhite font-higherJump">
                            Day {day.dayNumber}: {day.title}
                          </h3>
                          {day.description && (
                            <p className="text-logoGray font-titillium mt-1">
                              {day.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(day)}
                          className="p-2 bg-brightYellow text-customGray rounded hover:bg-hotPink transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteDay(day.ID)}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Day Details */}
                    {expandedDays[day.ID] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-logoGray pt-4 mt-4"
                      >
                        {day.warmup && (
                          <div className="mb-4">
                            <h4 className="text-lg font-bold text-customWhite mb-2 font-higherJump">
                              Warmup
                            </h4>
                            <p className="text-logoGray font-titillium">
                              {day.warmup}
                            </p>
                          </div>
                        )}

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-lg font-bold text-customWhite font-higherJump">
                              Workout Blocks (
                              {(day.WorkoutBlocks || day.workoutBlocks)
                                ?.length || 0}
                              )
                            </h4>
                            {(day.WorkoutBlocks || day.workoutBlocks) &&
                              (day.WorkoutBlocks || day.workoutBlocks).length >
                                0 && (
                                <button
                                  onClick={() => toggleDetailedView(day.ID)}
                                  className="text-sm bg-brightYellow text-customGray px-3 py-1 rounded hover:bg-hotPink transition-colors font-titillium"
                                >
                                  {detailedView[day.ID]
                                    ? "Simple View"
                                    : "Detailed View"}
                                </button>
                              )}
                          </div>
                          {(day.WorkoutBlocks || day.workoutBlocks) &&
                          (day.WorkoutBlocks || day.workoutBlocks).length >
                            0 ? (
                            <div className="grid gap-4">
                              {(day.WorkoutBlocks || day.workoutBlocks).map(
                                (block, blockIndex) => (
                                  <div
                                    key={block.ID}
                                    className="bg-customGray/50 p-4 rounded border border-logoGray"
                                  >
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex-1">
                                        <h5 className="font-bold text-customWhite font-titillium text-lg">
                                          Block {blockIndex + 1}:{" "}
                                          {block.blockType || block.BlockType}
                                        </h5>
                                        {(block.blockNotes ||
                                          block.BlockNotes) && (
                                          <p className="text-logoGray text-sm font-titillium mt-2 italic">
                                            &quot;
                                            {block.blockNotes ||
                                              block.BlockNotes}
                                            &quot;
                                          </p>
                                        )}
                                        <div className="flex gap-4 text-sm text-brightYellow font-titillium mt-2">
                                          {(block.blockRounds ||
                                            block.BlockRounds) && (
                                            <span>
                                              Rounds:{" "}
                                              {block.blockRounds ||
                                                block.BlockRounds}
                                            </span>
                                          )}
                                          {(block.roundRest ||
                                            block.RoundRest) && (
                                            <span>
                                              Round Rest:{" "}
                                              {block.roundRest ||
                                                block.RoundRest}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-brightYellow font-titillium bg-customGray px-2 py-1 rounded">
                                          {(block.Exercises || block.exercises)
                                            ?.length || 0}{" "}
                                          exercises
                                        </span>
                                        <button
                                          onClick={() => {
                                            /* TODO: Edit block */
                                          }}
                                          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                                          title="Edit Block"
                                        >
                                          <Edit size={12} />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Exercise List */}
                                    {(block.Exercises || block.exercises) &&
                                      (block.Exercises || block.exercises)
                                        .length > 0 && (
                                        <div className="mt-4">
                                          <h6 className="font-bold text-customWhite font-titillium mb-2">
                                            Exercises:
                                          </h6>

                                          {/* Simple View - Just exercise names */}
                                          {!detailedView[day.ID] && (
                                            <div className="flex flex-wrap gap-2">
                                              {(
                                                block.Exercises ||
                                                block.exercises
                                              ).map(
                                                (exercise, exerciseIndex) => (
                                                  <span
                                                    key={
                                                      exercise.ID ||
                                                      exerciseIndex
                                                    }
                                                    className="bg-brightYellow text-customGray px-2 py-1 rounded text-sm font-titillium"
                                                  >
                                                    {exerciseIndex + 1}.{" "}
                                                    {exercise.Exercise?.name ||
                                                      exercise.exercise?.name ||
                                                      "Exercise Name"}
                                                  </span>
                                                )
                                              )}
                                            </div>
                                          )}

                                          {/* Detailed View - Full exercise details */}
                                          {detailedView[day.ID] && (
                                            <div className="grid gap-2">
                                              {(
                                                block.Exercises ||
                                                block.exercises
                                              ).map(
                                                (exercise, exerciseIndex) => (
                                                  <div
                                                    key={
                                                      exercise.ID ||
                                                      exerciseIndex
                                                    }
                                                    className="bg-customGray/30 p-3 rounded border-l-4 border-brightYellow"
                                                  >
                                                    <div className="flex justify-between items-start">
                                                      <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                          <span className="text-brightYellow font-bold text-sm">
                                                            {exercise.order ||
                                                              exercise.Order ||
                                                              exerciseIndex + 1}
                                                            .
                                                          </span>
                                                          <span className="text-customWhite font-titillium font-bold">
                                                            {exercise.Exercise
                                                              ?.name ||
                                                              exercise.exercise
                                                                ?.name ||
                                                              "Exercise Name"}
                                                          </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm font-titillium mt-2">
                                                          {(exercise.reps ||
                                                            exercise.Reps) && (
                                                            <div>
                                                              <span className="text-logoGray">
                                                                Reps:{" "}
                                                              </span>
                                                              <span className="text-customWhite">
                                                                {exercise.reps ||
                                                                  exercise.Reps}
                                                              </span>
                                                            </div>
                                                          )}
                                                          {(exercise.duration ||
                                                            exercise.Duration) && (
                                                            <div>
                                                              <span className="text-logoGray">
                                                                Duration:{" "}
                                                              </span>
                                                              <span className="text-customWhite">
                                                                {exercise.duration ||
                                                                  exercise.Duration}
                                                              </span>
                                                            </div>
                                                          )}
                                                          {(exercise.rest ||
                                                            exercise.Rest) && (
                                                            <div>
                                                              <span className="text-logoGray">
                                                                Rest:{" "}
                                                              </span>
                                                              <span className="text-customWhite">
                                                                {exercise.rest ||
                                                                  exercise.Rest}
                                                              </span>
                                                            </div>
                                                          )}
                                                          {(exercise.workRestRatio ||
                                                            exercise.WorkRestRatio) && (
                                                            <div>
                                                              <span className="text-logoGray">
                                                                Work/Rest:{" "}
                                                              </span>
                                                              <span className="text-customWhite">
                                                                {exercise.workRestRatio ||
                                                                  exercise.WorkRestRatio}
                                                              </span>
                                                            </div>
                                                          )}
                                                        </div>

                                                        {(exercise.tips ||
                                                          exercise.Tips) && (
                                                          <div className="mt-2">
                                                            <span className="text-logoGray text-sm">
                                                              Tips:{" "}
                                                            </span>
                                                            <span className="text-customWhite text-sm italic">
                                                              &quot;
                                                              {exercise.tips ||
                                                                exercise.Tips}
                                                              &quot;
                                                            </span>
                                                          </div>
                                                        )}

                                                        {(exercise.instructions ||
                                                          exercise.Instructions) && (
                                                          <div className="mt-2">
                                                            <span className="text-logoGray text-sm">
                                                              Instructions:{" "}
                                                            </span>
                                                            <span className="text-customWhite text-sm">
                                                              {exercise.instructions ||
                                                                exercise.Instructions}
                                                            </span>
                                                          </div>
                                                        )}
                                                      </div>
                                                      <button
                                                        onClick={() => {
                                                          /* TODO: Edit exercise */
                                                        }}
                                                        className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-xs ml-2"
                                                        title="Edit Exercise"
                                                      >
                                                        <Edit size={10} />
                                                      </button>
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-logoGray font-titillium">
                              No workout blocks created yet.
                            </p>
                          )}
                        </div>

                        {day.cooldown && (
                          <div>
                            <h4 className="text-lg font-bold text-customWhite mb-2 font-higherJump">
                              Cooldown
                            </h4>
                            <p className="text-logoGray font-titillium">
                              {day.cooldown}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
        </div>

        {workoutDays.length === 0 && (
          <div className="text-center py-12">
            <p className="text-logoGray font-titillium text-lg">
              No workout days created yet.
            </p>
            <p className="text-logoGray font-titillium">
              Click &quot;Add Workout Day&quot; to get started.
            </p>
          </div>
        )}
      </div>
      <ToastContainer />
    </motion.div>
  );
};

const WorkoutDayForm = ({
  formData,
  setFormData,
  onSave,
  onCancel,
  exercises,
  blockTypes,
}) => {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlockChange = (blockIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      workoutBlocks: prev.workoutBlocks.map((block, index) =>
        index === blockIndex ? { ...block, [field]: value } : block
      ),
    }));
  };

  const handleExerciseChange = (blockIndex, exerciseIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      workoutBlocks: prev.workoutBlocks.map((block, bIndex) =>
        bIndex === blockIndex
          ? {
              ...block,
              exercises: block.exercises.map((exercise, eIndex) =>
                eIndex === exerciseIndex
                  ? { ...exercise, [field]: value }
                  : exercise
              ),
            }
          : block
      ),
    }));
  };

  const addBlock = () => {
    setFormData((prev) => ({
      ...prev,
      workoutBlocks: [
        ...prev.workoutBlocks,
        {
          blockType: "",
          blockRounds: "",
          blockNotes: "",
          roundRest: "",
          exercises: [],
        },
      ],
    }));
  };

  const removeBlock = (blockIndex) => {
    setFormData((prev) => ({
      ...prev,
      workoutBlocks: prev.workoutBlocks.filter(
        (_, index) => index !== blockIndex
      ),
    }));
  };

  const addExercise = (blockIndex) => {
    setFormData((prev) => ({
      ...prev,
      workoutBlocks: prev.workoutBlocks.map((block, index) =>
        index === blockIndex
          ? {
              ...block,
              exercises: [
                ...block.exercises,
                {
                  exerciseId: "",
                  exerciseName: "",
                  order: block.exercises.length + 1,
                  reps: "",
                  duration: "",
                  rest: "",
                  tips: "",
                  instructions: "",
                  workRestRatio: "",
                },
              ],
            }
          : block
      ),
    }));
  };

  const removeExercise = (blockIndex, exerciseIndex) => {
    setFormData((prev) => ({
      ...prev,
      workoutBlocks: prev.workoutBlocks.map((block, bIndex) =>
        bIndex === blockIndex
          ? {
              ...block,
              exercises: block.exercises.filter(
                (_, eIndex) => eIndex !== exerciseIndex
              ),
            }
          : block
      ),
    }));
  };

  const handleExerciseSelect = (blockIndex, exerciseIndex, exerciseId) => {
    const selectedExercise = exercises.find(
      (ex) => ex.ID === parseInt(exerciseId)
    );
    if (selectedExercise) {
      handleExerciseChange(blockIndex, exerciseIndex, "exerciseId", exerciseId);
      handleExerciseChange(
        blockIndex,
        exerciseIndex,
        "exerciseName",
        selectedExercise.name
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Day Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-customWhite font-titillium mb-2">
            Day Number *
          </label>
          <input
            type="number"
            value={formData.dayNumber}
            onChange={(e) =>
              handleInputChange("dayNumber", parseInt(e.target.value) || 1)
            }
            className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-customWhite font-titillium mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
            placeholder="e.g., Upper Body Strength"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-customWhite font-titillium mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
            rows="3"
            placeholder="Brief description of this workout day"
          />
        </div>
      </div>

      {/* Workout Blocks */}
      <div className="border-t border-logoGray pt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-bold text-customWhite font-higherJump">
            Workout Blocks ({formData.workoutBlocks?.length || 0})
          </h4>
          <button
            type="button"
            onClick={addBlock}
            className="btn-full-colour flex items-center gap-2"
          >
            <Plus size={16} />
            Add Block
          </button>
        </div>

        {formData.workoutBlocks?.map((block, blockIndex) => (
          <div
            key={blockIndex}
            className="bg-customGray/30 p-4 rounded-lg border border-logoGray mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-bold text-customWhite font-titillium">
                Block {blockIndex + 1}
              </h5>
              <button
                type="button"
                onClick={() => removeBlock(blockIndex)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-customWhite font-titillium mb-2">
                  Block Type *
                </label>
                <select
                  value={block.blockType}
                  onChange={(e) =>
                    handleBlockChange(blockIndex, "blockType", e.target.value)
                  }
                  className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
                  required
                >
                  <option value="">Select Block Type</option>
                  {blockTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-customWhite font-titillium mb-2">
                  Block Rounds
                </label>
                <input
                  type="text"
                  value={block.blockRounds}
                  onChange={(e) =>
                    handleBlockChange(blockIndex, "blockRounds", e.target.value)
                  }
                  className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
                  placeholder="e.g., 3, 5, AMRAP"
                />
              </div>

              <div>
                <label className="block text-customWhite font-titillium mb-2">
                  Round Rest
                </label>
                <input
                  type="text"
                  value={block.roundRest}
                  onChange={(e) =>
                    handleBlockChange(blockIndex, "roundRest", e.target.value)
                  }
                  className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
                  placeholder="e.g., 60s, 2 mins"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-customWhite font-titillium mb-2">
                Block Notes
              </label>
              <textarea
                value={block.blockNotes}
                onChange={(e) =>
                  handleBlockChange(blockIndex, "blockNotes", e.target.value)
                }
                className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
                rows="2"
                placeholder="Instructions for this block"
              />
            </div>

            {/* Exercises in this block */}
            <div className="border-t border-logoGray/50 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h6 className="text-lg font-bold text-customWhite font-titillium">
                  Exercises ({block.exercises?.length || 0})
                </h6>
                <button
                  type="button"
                  onClick={() => addExercise(blockIndex)}
                  className="btn-outline flex items-center gap-2"
                >
                  <Plus size={14} />
                  Add Exercise
                </button>
              </div>

              {block.exercises?.map((exercise, exerciseIndex) => (
                <div
                  key={exerciseIndex}
                  className="bg-customGray/50 p-3 rounded border border-logoGray/50 mb-3"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-brightYellow font-bold">
                      Exercise {exerciseIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExercise(blockIndex, exerciseIndex)}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-customWhite font-titillium mb-2">
                        Exercise *
                      </label>
                      <select
                        value={exercise.exerciseId}
                        onChange={(e) =>
                          handleExerciseSelect(
                            blockIndex,
                            exerciseIndex,
                            e.target.value
                          )
                        }
                        className="w-full p-2 rounded bg-customWhite text-customGray font-titillium"
                        required
                      >
                        <option value="">Select Exercise</option>
                        {exercises.map((ex) => (
                          <option key={ex.ID} value={ex.ID}>
                            {ex.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-customWhite font-titillium mb-2">
                        Order
                      </label>
                      <input
                        type="number"
                        value={exercise.order}
                        onChange={(e) =>
                          handleExerciseChange(
                            blockIndex,
                            exerciseIndex,
                            "order",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full p-2 rounded bg-customWhite text-customGray font-titillium"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-customWhite font-titillium mb-2">
                        Reps
                      </label>
                      <input
                        type="text"
                        value={exercise.reps}
                        onChange={(e) =>
                          handleExerciseChange(
                            blockIndex,
                            exerciseIndex,
                            "reps",
                            e.target.value
                          )
                        }
                        className="w-full p-2 rounded bg-customWhite text-customGray font-titillium"
                        placeholder="e.g., 10-12, Max Effort"
                      />
                    </div>

                    <div>
                      <label className="block text-customWhite font-titillium mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={exercise.duration}
                        onChange={(e) =>
                          handleExerciseChange(
                            blockIndex,
                            exerciseIndex,
                            "duration",
                            e.target.value
                          )
                        }
                        className="w-full p-2 rounded bg-customWhite text-customGray font-titillium"
                        placeholder="e.g., 30s, 1 min"
                      />
                    </div>

                    <div>
                      <label className="block text-customWhite font-titillium mb-2">
                        Rest
                      </label>
                      <input
                        type="text"
                        value={exercise.rest}
                        onChange={(e) =>
                          handleExerciseChange(
                            blockIndex,
                            exerciseIndex,
                            "rest",
                            e.target.value
                          )
                        }
                        className="w-full p-2 rounded bg-customWhite text-customGray font-titillium"
                        placeholder="e.g., 15s, 2 mins"
                      />
                    </div>

                    <div>
                      <label className="block text-customWhite font-titillium mb-2">
                        Work/Rest Ratio
                      </label>
                      <input
                        type="text"
                        value={exercise.workRestRatio}
                        onChange={(e) =>
                          handleExerciseChange(
                            blockIndex,
                            exerciseIndex,
                            "workRestRatio",
                            e.target.value
                          )
                        }
                        className="w-full p-2 rounded bg-customWhite text-customGray font-titillium"
                        placeholder="e.g., 2:1, 30:15"
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-customWhite font-titillium mb-2">
                        Tips
                      </label>
                      <input
                        type="text"
                        value={exercise.tips}
                        onChange={(e) =>
                          handleExerciseChange(
                            blockIndex,
                            exerciseIndex,
                            "tips",
                            e.target.value
                          )
                        }
                        className="w-full p-2 rounded bg-customWhite text-customGray font-titillium"
                        placeholder="e.g., 2 Lunges = 1 rep"
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-customWhite font-titillium mb-2">
                        Instructions
                      </label>
                      <textarea
                        value={exercise.instructions}
                        onChange={(e) =>
                          handleExerciseChange(
                            blockIndex,
                            exerciseIndex,
                            "instructions",
                            e.target.value
                          )
                        }
                        className="w-full p-2 rounded bg-customWhite text-customGray font-titillium"
                        rows="2"
                        placeholder="Specific instructions for this exercise"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-6 pt-6 border-t border-logoGray">
        <button
          onClick={onSave}
          className="btn-full-colour flex items-center gap-2"
          disabled={!formData.title || !formData.dayNumber}
        >
          <Save size={16} />
          Save Workout Day
        </button>
        <button
          onClick={onCancel}
          className="btn-outline flex items-center gap-2"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </div>
  );
};

WorkoutDayForm.propTypes = {
  formData: PropTypes.shape({
    programId: PropTypes.number.isRequired,
    dayNumber: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    workoutBlocks: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
  blockTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default WorkoutDayManagement;
