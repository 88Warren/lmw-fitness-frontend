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
import { Link } from "react-router-dom";
import { showToast } from "../../utils/toastUtil";
import { ToastContainer } from "react-toastify";
import api from "../../utils/api";
import { BACKEND_URL } from "../../utils/config";
import DynamicHeading from "../../components/Shared/DynamicHeading";
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
      <div className="min-h-screen flex items-center justify-center bg-customGray">
        <p className="text-xl font-titillium text-customWhite">
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
      className="min-h-screen bg-gradient-to-b from-customGray/30 to-white p-6 pt-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin"
            className="p-2 bg-customGray text-brightYellow rounded hover:bg-brightYellow hover:text-customGray transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex justify-between items-center w-full">
            <DynamicHeading
              text="Program Management"
              className="font-higherJump text-3xl md:text-4xl font-bold text-customGray leading-loose tracking-widest"
            />
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-full-colour flex items-center gap-2"
            >
              <Plus size={20} />
              Add Program
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-customGray p-6 rounded-lg border-2 border-brightYellow mb-8"
          >
            <h3 className="text-xl font-bold text-customWhite mb-4 font-higherJump">
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
              className="bg-customGray p-6 rounded-lg border-2 border-brightYellow"
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
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleProgramExpansion(program.ID)}
                        className="text-brightYellow hover:text-hotPink transition-colors"
                      >
                        {expandedPrograms[program.ID] ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </button>
                      <div>
                        <h3 className="text-xl font-bold text-customWhite font-higherJump">
                          {program.name}
                        </h3>
                        <div className="flex gap-4 text-sm">
                          <span className="text-brightYellow font-titillium">
                            {program.difficulty}
                          </span>
                          <span className="text-logoGray font-titillium">
                            {program.duration} days
                          </span>
                          <span
                            className={`font-titillium ${
                              program.isActive
                                ? "text-green-400"
                                : "text-red-400"
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
                        className="p-2 bg-brightYellow text-customGray rounded hover:bg-hotPink transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(program.ID)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {program.description && (
                    <p className="text-logoGray mb-4 font-titillium">
                      {program.description}
                    </p>
                  )}

                  {/* Expanded Program Details */}
                  {expandedPrograms[program.ID] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-logoGray pt-4 mt-4"
                    >
                      <h4 className="text-lg font-bold text-customWhite mb-3 font-higherJump">
                        Workout Days ({program.Days?.length || 0})
                      </h4>
                      {program.Days && program.Days.length > 0 ? (
                        <div className="grid gap-3">
                          {program.Days.map((day) => (
                            <div
                              key={day.ID}
                              className="bg-customGray/50 p-4 rounded border border-logoGray"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-bold text-customWhite font-titillium">
                                    Day {day.dayNumber}: {day.title}
                                  </h5>
                                  {day.description && (
                                    <p className="text-logoGray text-sm font-titillium mt-1">
                                      {day.description}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs text-brightYellow font-titillium">
                                  {day.WorkoutBlocks?.length || 0} blocks
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-logoGray font-titillium">
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
        <label className="block text-customWhite font-titillium mb-2">
          Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
          required
        />
      </div>

      <div>
        <label className="block text-customWhite font-titillium mb-2">
          Difficulty *
        </label>
        <select
          value={formData.difficulty}
          onChange={(e) => handleInputChange("difficulty", e.target.value)}
          className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
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
        <label className="block text-customWhite font-titillium mb-2">
          Duration (days)
        </label>
        <input
          type="number"
          value={formData.duration}
          onChange={(e) =>
            handleInputChange("duration", parseInt(e.target.value) || 0)
          }
          className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
          min="0"
        />
      </div>

      <div className="flex items-center">
        <label className="flex items-center text-customWhite font-titillium">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleInputChange("isActive", e.target.checked)}
            className="mr-2"
          />
          Active Program
        </label>
      </div>

      <div className="md:col-span-2">
        <label className="block text-customWhite font-titillium mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
          rows="4"
        />
      </div>

      <div className="md:col-span-2 flex gap-4 mt-4">
        <button
          onClick={onSave}
          className="btn-full-colour flex items-center gap-2"
          disabled={!formData.name || !formData.difficulty}
        >
          <Save size={16} />
          Save
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
