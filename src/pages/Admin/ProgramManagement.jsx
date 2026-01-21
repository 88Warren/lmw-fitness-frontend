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
} from "react-icons/fi";
import { showToast } from "../../utils/toastUtil";
import { ToastContainer } from "react-toastify";
import api from "../../utils/api";
import { BACKEND_URL } from "../../utils/config";
import PropTypes from "prop-types";

const ProgramManagement = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPrograms, setExpandedPrograms] = useState({});
  const [editingProgram, setEditingProgram] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    difficulty: "",
    duration: 0,
    isActive: true,
  });

  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  // Helper function to format program names for display
  const formatProgramName = (name) => {
    if (!name) return '';
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await api.get(`${BACKEND_URL}/api/admin/programs`);
      setPrograms(response.data);
    } catch (error) {
      showToast("error", "Failed to fetch programs");
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await api.post(
        `${BACKEND_URL}/api/admin/programs`,
        formData
      );
      setPrograms([...programs, response.data]);
      setShowCreateForm(false);
      resetForm();
      showToast("success", "Program created successfully");
    } catch (error) {
      showToast("error", "Failed to create program");
      console.error("Error creating program:", error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await api.put(
        `${BACKEND_URL}/api/admin/programs/${id}`,
        formData
      );
      setPrograms(
        programs.map((prog) => (prog.ID === id ? response.data : prog))
      );
      setEditingProgram(null);
      resetForm();
      showToast("success", "Program updated successfully");
    } catch (error) {
      showToast("error", "Failed to update program");
      console.error("Error updating program:", error);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this program? This will also delete all associated workout days."
      )
    )
      return;

    try {
      await api.delete(`${BACKEND_URL}/api/admin/programs/${id}`);
      setPrograms(programs.filter((prog) => prog.ID !== id));
      showToast("success", "Program deleted successfully");
    } catch (error) {
      showToast("error", "Failed to delete program");
      console.error("Error deleting program:", error);
    }
  };

  const startEdit = (program) => {
    setEditingProgram(program.ID);
    setFormData({
      name: program.name || "",
      description: program.description || "",
      difficulty: program.difficulty || "",
      duration: program.duration || 0,
      isActive: program.isActive !== undefined ? program.isActive : true,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      difficulty: "",
      duration: 0,
      isActive: true,
    });
  };

  const cancelEdit = () => {
    setEditingProgram(null);
    setShowCreateForm(false);
    resetForm();
  };

  const toggleProgramExpansion = (programId) => {
    setExpandedPrograms((prev) => ({
      ...prev,
      [programId]: !prev[programId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-customGray/30 to-white pt-32">
        <p className="text-xl font-titillium text-customGray">
          Loading programs...
        </p>
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
              to="/admin"
              className="flex items-center text-customGray hover:text-logoGray transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-customGray mb-6">Program Management</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-customGray text-white px-6 py-3 rounded-lg hover:bg-logoGray transition-colors flex items-center space-x-2 mx-auto"
          >
            <FiPlus size={20} />
            <span>Add Program</span>
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white p-6 rounded-lg shadow-md mb-8"
          >
            <h3 className="text-xl font-bold text-customGray mb-4">
              Create New Program
            </h3>
            <ProgramForm
              formData={formData}
              setFormData={setFormData}
              difficulties={difficulties}
              onSave={handleCreate}
              onCancel={cancelEdit}
            />
          </motion.div>
        )}

        {/* Program List */}
        <div className="grid gap-6">
          {programs.map((program) => (
            <motion.div
              key={program.ID}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {editingProgram === program.ID ? (
                <ProgramForm
                  formData={formData}
                  setFormData={setFormData}
                  difficulties={difficulties}
                  onSave={() => handleUpdate(program.ID)}
                  onCancel={cancelEdit}
                />
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleProgramExpansion(program.ID)}
                        className="text-customGray hover:text-logoGray transition-colors"
                      >
                        {expandedPrograms[program.ID] ? (
                          <FiChevronDown size={20} />
                        ) : (
                          <FiChevronRight size={20} />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-customGray mb-2">
                          {formatProgramName(program.name)}
                        </h3>
                        <div className="flex gap-3 text-sm items-center">
                          <span className="bg-customGray text-white px-2 py-1 rounded text-xs">
                            {program.difficulty}
                          </span>
                          <span className="text-gray-600">
                            {program.duration} days
                          </span>
                          <span className="text-gray-500 text-xs">
                            {program.Days?.length || 0} workout days
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              program.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {program.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/workout-days/${program.ID}`}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        title="Manage Workout Days"
                      >
                        📅
                      </Link>
                      <button
                        onClick={() => startEdit(program)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        title="Edit Program"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(program.ID)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        title="Delete Program"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Program Details */}
                  {expandedPrograms[program.ID] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-gray-200 pt-4 mt-4"
                    >
                      <h4 className="text-lg font-bold text-customGray mb-3">
                        Workout Days ({program.Days?.length || 0})
                      </h4>
                      {program.Days && program.Days.length > 0 ? (
                        <div className="grid gap-3">
                          {program.Days.map((day) => (
                            <div
                              key={day.ID}
                              className="bg-gray-50 p-4 rounded border border-gray-200"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-bold text-customGray">
                                    Day {day.dayNumber}: {day.title}
                                  </h5>
                                  {day.description && (
                                    <p className="text-gray-600 text-sm mt-1">
                                      {day.description}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs bg-customGray text-white px-2 py-1 rounded">
                                  {day.WorkoutBlocks?.length || 0} blocks
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          No workout days created yet.
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </motion.div>
  );
};

const ProgramForm = ({
  formData,
  setFormData,
  difficulties,
  onSave,
  onCancel,
}) => {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-customGray mb-2">
          Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full p-3 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
          placeholder="Program name"
          required
        />
      </div>

      <div>
        <label className="block text-customGray mb-2">
          Difficulty *
        </label>
        <select
          value={formData.difficulty}
          onChange={(e) => handleInputChange("difficulty", e.target.value)}
          className="w-full p-3 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
          required
        >
          <option value="">Select Difficulty</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-customGray mb-2">
          Duration (days) *
        </label>
        <input
          type="number"
          value={formData.duration}
          onChange={(e) =>
            handleInputChange("duration", parseInt(e.target.value) || 0)
          }
          className="w-full p-3 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
          min="1"
          required
        />
      </div>

      <div className="flex items-center">
        <label className="flex items-center text-customGray">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleInputChange("isActive", e.target.checked)}
            className="mr-2 rounded focus:ring-2 focus:ring-customGray"
          />
          Active Program
        </label>
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
          placeholder="Program description"
        />
      </div>

      <div className="md:col-span-2 flex gap-4 mt-4">
        <button
          onClick={onSave}
          className="bg-customGray text-white px-6 py-3 rounded-lg hover:bg-logoGray transition-colors flex items-center gap-2"
          disabled={!formData.name || !formData.difficulty}
        >
          <FiSave size={16} />
          Save
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

ProgramForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    difficulty: PropTypes.string.isRequired,
    duration: PropTypes.number,
    isActive: PropTypes.bool,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  difficulties: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ProgramManagement;
