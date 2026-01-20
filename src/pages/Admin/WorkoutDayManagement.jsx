import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiArrowLeft,
  FiSearch,
  FiFilter,
  FiCalendar,
} from "react-icons/fi";
import { showToast } from "../../utils/toastUtil";
import { ToastContainer } from "react-toastify";
import api from "../../utils/api";
import { BACKEND_URL } from "../../utils/config";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const WorkoutDayManagement = () => {
  const { programId } = useParams();

  const [program, setProgram] = useState(null);
  const [workoutDays, setWorkoutDays] = useState([]);
  const [filteredWorkoutDays, setFilteredWorkoutDays] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedDays, setExpandedDays] = useState({});
  const [editingDay, setEditingDay] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [detailedView, setDetailedView] = useState({});

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [blockTypeFilter, setBlockTypeFilter] = useState("all");
  const [dayNumberFilter, setDayNumberFilter] = useState("all");
  const [quickDayJump, setQuickDayJump] = useState("");
  const [sortBy, setSortBy] = useState("dayNumber");

  // Helper function to format program names for display
  const formatProgramName = (name) => {
    if (!name) return '';
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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

  useEffect(() => {
    applyFilters();
  }, [workoutDays, searchTerm, blockTypeFilter, dayNumberFilter, sortBy]);

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

  const applyFilters = () => {
    let filtered = [...workoutDays];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(day => {
        const titleMatch = day.title && day.title.toLowerCase().includes(searchTerm.toLowerCase());
        const descriptionMatch = day.description && day.description.toLowerCase().includes(searchTerm.toLowerCase());
        const dayNumberMatch = day.dayNumber && day.dayNumber.toString().includes(searchTerm);
        
        // Search in workout blocks
        const blockMatch = (day.WorkoutBlocks || day.workoutBlocks || []).some(block => {
          const blockTypeMatch = (block.blockType || block.BlockType || "").toLowerCase().includes(searchTerm.toLowerCase());
          const blockNotesMatch = (block.blockNotes || block.BlockNotes || "").toLowerCase().includes(searchTerm.toLowerCase());
          
          // Search in exercises within blocks
          const exerciseMatch = (block.Exercises || block.exercises || []).some(exercise => {
            const exerciseName = exercise.Exercise?.name || exercise.exercise?.name || "";
            return exerciseName.toLowerCase().includes(searchTerm.toLowerCase());
          });
          
          return blockTypeMatch || blockNotesMatch || exerciseMatch;
        });

        return titleMatch || descriptionMatch || dayNumberMatch || blockMatch;
      });
    }

    // Day number filter
    if (dayNumberFilter !== "all") {
      if (dayNumberFilter === "1-10") {
        filtered = filtered.filter(day => day.dayNumber >= 1 && day.dayNumber <= 10);
      } else if (dayNumberFilter === "11-20") {
        filtered = filtered.filter(day => day.dayNumber >= 11 && day.dayNumber <= 20);
      } else if (dayNumberFilter === "21-30") {
        filtered = filtered.filter(day => day.dayNumber >= 21 && day.dayNumber <= 30);
      } else {
        // Specific day number
        filtered = filtered.filter(day => day.dayNumber === parseInt(dayNumberFilter));
      }
    }

    // Block type filter
    if (blockTypeFilter !== "all") {
      filtered = filtered.filter(day => {
        return (day.WorkoutBlocks || day.workoutBlocks || []).some(block => 
          (block.blockType || block.BlockType) === blockTypeFilter
        );
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dayNumber":
          return (a.dayNumber || 0) - (b.dayNumber || 0);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "newest":
          return new Date(b.CreatedAt || b.createdAt || 0) - new Date(a.CreatedAt || a.createdAt || 0);
        case "oldest":
          return new Date(a.CreatedAt || a.createdAt || 0) - new Date(b.CreatedAt || b.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredWorkoutDays(filtered);
  };

  const handleQuickDayJump = (e) => {
    const dayNum = e.target.value;
    setQuickDayJump(dayNum);
    
    if (dayNum && !isNaN(dayNum) && dayNum >= 1 && dayNum <= 30) {
      setDayNumberFilter(dayNum);
      setSearchTerm(""); // Clear search when jumping to specific day
    } else if (dayNum === "") {
      setDayNumberFilter("all");
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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-customGray/30 to-white pt-32">
        <p className="text-xl text-customGray">
          Loading workout days...
        </p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-customGray/30 to-white pt-32">
        <div className="text-center">
          <p className="text-xl font-titillium text-customGray mb-4">
            Program not found
          </p>
          <p className="text-gray-600 font-titillium">
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
      className="min-h-screen bg-linear-to-b from-customGray/30 to-white p-6 pt-32"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-start mb-4">
            <Link
              to="/admin/workout-days"
              className="flex items-center text-customGray hover:text-logoGray transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Programs
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-customGray mb-4">
            {formatProgramName(program.name)}
          </h1>
          <div className="flex justify-center items-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Difficulty:</span>
              <span className="bg-customGray text-white px-3 py-1 rounded text-sm">
                {program.difficulty}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Duration:</span>
              <span className="text-customGray font-semibold">
                {program.duration} days
              </span>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {/* Quick Day Jump */}
            <div className="flex items-center gap-2">
              <FiCalendar className="text-customGray" size={20} />
              <span className="text-customGray text-sm">Jump to Day:</span>
              <input
                type="number"
                min="1"
                max="30"
                placeholder="Day #"
                value={quickDayJump}
                onChange={handleQuickDayJump}
                className="w-20 px-2 py-1 rounded border border-gray-300 text-customGray text-center focus:ring-2 focus:ring-customGray focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-customGray text-white px-6 py-3 rounded-lg hover:bg-logoGray transition-colors flex items-center space-x-2"
            >
              <FiPlus size={20} />
              <span>Add Workout Day</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FiSearch className="text-customGray" size={20} />
            <h3 className="text-xl font-bold text-customGray">
              Search & Filter Workout Days ({filteredWorkoutDays.length} of {workoutDays.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by title, exercises, block types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded border border-gray-300 text-customGray placeholder-gray-500 focus:ring-2 focus:ring-customGray focus:border-transparent"
              />
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={dayNumberFilter}
                onChange={(e) => setDayNumberFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded border border-gray-300 text-customGray appearance-none focus:ring-2 focus:ring-customGray focus:border-transparent"
              >
                <option value="all">All Days</option>
                <option value="1-10">Days 1-10</option>
                <option value="11-20">Days 11-20</option>
                <option value="21-30">Days 21-30</option>
                <optgroup label="Specific Days">
                  {[...Array(30)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={blockTypeFilter}
                onChange={(e) => setBlockTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded border border-gray-300 text-customGray appearance-none focus:ring-2 focus:ring-customGray focus:border-transparent"
              >
                <option value="all">All Block Types</option>
                {blockTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
            >
              <option value="dayNumber">Sort by Day Number</option>
              <option value="title">Sort by Title (A-Z)</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {(searchTerm || dayNumberFilter !== "all" || blockTypeFilter !== "all") && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-customGray">Active filters:</span>
              
              {searchTerm && (
                <div className="flex items-center gap-1 bg-customGray text-white px-2 py-1 rounded">
                  <span>Search: "{searchTerm}"</span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-white hover:text-red-300 transition-colors ml-1"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}

              {dayNumberFilter !== "all" && (
                <div className="flex items-center gap-1 bg-customGray text-white px-2 py-1 rounded">
                  <span>
                    {dayNumberFilter.includes("-") 
                      ? `Days ${dayNumberFilter}` 
                      : `Day ${dayNumberFilter}`
                    }
                  </span>
                  <button
                    onClick={() => setDayNumberFilter("all")}
                    className="text-white hover:text-red-300 transition-colors ml-1"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}

              {blockTypeFilter !== "all" && (
                <div className="flex items-center gap-1 bg-customGray text-white px-2 py-1 rounded">
                  <span>Block: {blockTypeFilter}</span>
                  <button
                    onClick={() => setBlockTypeFilter("all")}
                    className="text-white hover:text-red-300 transition-colors ml-1"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setSearchTerm("");
                  setDayNumberFilter("all");
                  setBlockTypeFilter("all");
                }}
                className="text-red-500 hover:text-red-700 transition-colors text-sm underline"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white p-6 rounded-lg shadow-md mb-8"
          >
            <h3 className="text-xl font-bold text-customGray mb-4">
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
          {filteredWorkoutDays.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                {workoutDays.length === 0 
                  ? "No workout days created yet." 
                  : searchTerm || blockTypeFilter !== "all" || dayNumberFilter !== "all"
                    ? "No workout days match your search criteria."
                    : "No workout days to display."
                }
              </p>
              {workoutDays.length === 0 ? (
                <p className="text-gray-600">
                  Click "Add Workout Day" to get started.
                </p>
              ) : (searchTerm || blockTypeFilter !== "all" || dayNumberFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setBlockTypeFilter("all");
                    setDayNumberFilter("all");
                  }}
                  className="bg-customGray text-white px-4 py-2 rounded-lg hover:bg-logoGray transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredWorkoutDays.map((day) => (
                <div
                  key={day.ID}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {editingDay === day.ID ? (
                    <div className="p-6">
                      <WorkoutDayForm
                        formData={formData}
                        setFormData={setFormData}
                        exercises={exercises}
                        blockTypes={blockTypes}
                        onSave={() => handleUpdateDay(day.ID)}
                        onCancel={cancelEdit}
                      />
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleDayExpansion(day.ID)}
                            className="text-customGray hover:text-logoGray transition-colors"
                          >
                            {expandedDays[day.ID] ? (
                              <FiChevronDown size={20} />
                            ) : (
                              <FiChevronRight size={20} />
                            )}
                          </button>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-customGray mb-1">
                              Day {day.dayNumber}: {day.title}
                            </h3>
                            {day.description && (
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {day.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => startEdit(day)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50"
                            title="Edit Day"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteDay(day.ID)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50"
                            title="Delete Day"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Day Details */}
                      {expandedDays[day.ID] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="border-t border-gray-200 pt-4 mt-4"
                        >
                          {day.warmup && (
                            <div className="mb-4">
                              <h4 className="text-lg font-bold text-customGray mb-2">
                                Warmup
                              </h4>
                              <p className="text-gray-600">
                                {day.warmup}
                              </p>
                            </div>
                          )}

                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-lg font-bold text-customGray">
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
                                    className="text-sm bg-customGray text-white px-3 py-1 rounded hover:bg-logoGray transition-colors"
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
                                      className="bg-gray-50 p-4 rounded border border-gray-200"
                                    >
                                      <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                          <h5 className="font-bold text-customGray text-lg">
                                            Block {blockIndex + 1}:{" "}
                                            {block.blockType || block.BlockType}
                                          </h5>
                                          {(block.blockNotes ||
                                            block.BlockNotes) && (
                                            <p className="text-gray-600 text-sm mt-2 italic">
                                              &quot;
                                              {block.blockNotes ||
                                                block.BlockNotes}
                                              &quot;
                                            </p>
                                          )}
                                          <div className="flex gap-4 text-sm text-customGray mt-2">
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
                                          <span className="text-xs text-white bg-customGray px-2 py-1 rounded">
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
                                            <FiEdit2 size={12} />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Exercise List */}
                                      {(block.Exercises || block.exercises) &&
                                        (block.Exercises || block.exercises)
                                          .length > 0 && (
                                          <div className="mt-4">
                                            <h6 className="font-bold text-customGray mb-2">
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
                                                      className="bg-customGray text-white px-2 py-1 rounded text-sm"
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
                                                      className="bg-white p-3 rounded border-l-4 border-customGray"
                                                    >
                                                      <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                          <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-customGray font-bold text-sm">
                                                              {exercise.order ||
                                                                exercise.Order ||
                                                                exerciseIndex + 1}
                                                              .
                                                            </span>
                                                            <span className="text-customGray font-bold">
                                                              {exercise.Exercise
                                                                ?.name ||
                                                                exercise.exercise
                                                                  ?.name ||
                                                                "Exercise Name"}
                                                            </span>
                                                          </div>

                                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2">
                                                            {(exercise.reps ||
                                                              exercise.Reps) && (
                                                              <div>
                                                                <span className="text-gray-600">
                                                                  Reps:{" "}
                                                                </span>
                                                                <span className="text-customGray">
                                                                  {exercise.reps ||
                                                                    exercise.Reps}
                                                                </span>
                                                              </div>
                                                            )}
                                                            {(exercise.duration ||
                                                              exercise.Duration) && (
                                                              <div>
                                                                <span className="text-gray-600">
                                                                  Duration:{" "}
                                                                </span>
                                                                <span className="text-customGray">
                                                                  {exercise.duration ||
                                                                    exercise.Duration}
                                                                </span>
                                                              </div>
                                                            )}
                                                            {(exercise.rest ||
                                                              exercise.Rest) && (
                                                              <div>
                                                                <span className="text-gray-600">
                                                                  Rest:{" "}
                                                                </span>
                                                                <span className="text-customGray">
                                                                  {exercise.rest ||
                                                                    exercise.Rest}
                                                                </span>
                                                              </div>
                                                            )}
                                                            {(exercise.workRestRatio ||
                                                              exercise.WorkRestRatio) && (
                                                              <div>
                                                                <span className="text-gray-600">
                                                                  Work/Rest:{" "}
                                                                </span>
                                                                <span className="text-customGray">
                                                                  {exercise.workRestRatio ||
                                                                    exercise.WorkRestRatio}
                                                                </span>
                                                              </div>
                                                            )}
                                                          </div>

                                                          {(exercise.tips ||
                                                            exercise.Tips) && (
                                                            <div className="mt-2">
                                                              <span className="text-gray-600 text-sm">
                                                                Tips:{" "}
                                                              </span>
                                                              <span className="text-customGray text-sm italic">
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
                                                              <span className="text-gray-600 text-sm">
                                                                Instructions:{" "}
                                                              </span>
                                                              <span className="text-customGray text-sm">
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
                                                          <FiEdit2 size={10} />
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
                              <p className="text-gray-600">
                                No workout blocks created yet.
                              </p>
                            )}
                          </div>

                          {day.cooldown && (
                            <div>
                              <h4 className="text-lg font-bold text-customGray mb-2">
                                Cooldown
                              </h4>
                              <p className="text-gray-600">
                                {day.cooldown}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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
          <label className="block text-customGray mb-2">
            Day Number *
          </label>
          <input
            type="number"
            value={formData.dayNumber}
            onChange={(e) =>
              handleInputChange("dayNumber", parseInt(e.target.value) || 1)
            }
            className="w-full p-3 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-customGray mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full p-3 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
            placeholder="e.g., Upper Body Strength"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-customGray mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full p-3 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
            rows="3"
            placeholder="Brief description of this workout day"
          />
        </div>
      </div>

      {/* Workout Blocks */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-bold text-customGray">
            Workout Blocks ({formData.workoutBlocks?.length || 0})
          </h4>
          <button
            type="button"
            onClick={addBlock}
            className="bg-customGray text-white px-4 py-2 rounded-lg hover:bg-logoGray transition-colors flex items-center gap-2"
          >
            <FiPlus size={16} />
            Add Block
          </button>
        </div>

        {formData.workoutBlocks?.map((block, blockIndex) => (
          <div
            key={blockIndex}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-bold text-customGray">
                Block {blockIndex + 1}
              </h5>
              <button
                type="button"
                onClick={() => removeBlock(blockIndex)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <FiTrash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-customGray mb-2">
                  Block Type *
                </label>
                <select
                  value={block.blockType}
                  onChange={(e) =>
                    handleBlockChange(blockIndex, "blockType", e.target.value)
                  }
                  className="w-full p-3 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
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
                <label className="block text-customGray mb-2">
                  Block Rounds
                </label>
                <input
                  type="text"
                  value={block.blockRounds}
                  onChange={(e) =>
                    handleBlockChange(blockIndex, "blockRounds", e.target.value)
                  }
                  className="w-full p-3 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
                  placeholder="e.g., 3, 5, AMRAP"
                />
              </div>

              <div>
                <label className="block text-customGray mb-2">
                  Round Rest
                </label>
                <input
                  type="text"
                  value={block.roundRest}
                  onChange={(e) =>
                    handleBlockChange(blockIndex, "roundRest", e.target.value)
                  }
                  className="w-full p-3 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
                  placeholder="e.g., 60s, 2 mins"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-customGray mb-2">
                Block Notes
              </label>
              <textarea
                value={block.blockNotes}
                onChange={(e) =>
                  handleBlockChange(blockIndex, "blockNotes", e.target.value)
                }
                className="w-full p-3 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
                rows="2"
                placeholder="Instructions for this block"
              />
            </div>

            {/* Exercises in this block */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h6 className="text-lg font-bold text-customGray">
                  Exercises ({block.exercises?.length || 0})
                </h6>
                <button
                  type="button"
                  onClick={() => addExercise(blockIndex)}
                  className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <FiPlus size={14} />
                  Add Exercise
                </button>
              </div>

              {block.exercises?.map((exercise, exerciseIndex) => (
                <div
                  key={exerciseIndex}
                  className="bg-white p-3 rounded border border-gray-200 mb-3"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-customGray font-bold">
                      Exercise {exerciseIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExercise(blockIndex, exerciseIndex)}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-customGray mb-2">
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
                        className="w-full p-2 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
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
                      <label className="block text-customGray mb-2">
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
                        className="w-full p-2 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-customGray mb-2">
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
                        className="w-full p-2 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
                        placeholder="e.g., 10-12, Max Effort"
                      />
                    </div>

                    <div>
                      <label className="block text-customGray mb-2">
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
                        className="w-full p-2 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
                        placeholder="e.g., 30s, 1 min"
                      />
                    </div>

                    <div>
                      <label className="block text-customGray mb-2">
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
                        className="w-full p-2 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
                        placeholder="e.g., 15s, 2 mins"
                      />
                    </div>

                    <div>
                      <label className="block text-customGray mb-2">
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
                        className="w-full p-2 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
                        placeholder="e.g., 2:1, 30:15"
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-customGray mb-2">
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
                        className="w-full p-2 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
                        placeholder="e.g., 2 Lunges = 1 rep"
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-customGray mb-2">
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
                        className="w-full p-2 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
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

      <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={onSave}
          className="bg-customGray text-white px-6 py-3 rounded-lg hover:bg-logoGray transition-colors flex items-center gap-2"
          disabled={!formData.title || !formData.dayNumber}
        >
          <FiSave size={16} />
          Save Workout Day
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <FiX size={16} />
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
