import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiArrowLeft,
  FiSearch,
  FiFilter,
} from 'react-icons/fi';
import { showToast } from '../../utils/toastUtil';
import { ToastContainer } from 'react-toastify';
import api from '../../utils/api';
import { BACKEND_URL } from '../../utils/config';
import PropTypes from 'prop-types';

const ExerciseManagement = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExercise, setEditingExercise] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    videoId: '',
    tips: '',
    instructions: '',
    modificationId: null,
    modificationId2: null
  });

  // Dynamically get categories from exercises
  const categories = [...new Set(exercises.map(ex => ex.category).filter(Boolean))].sort();
  
  // Helper function to format category names for display
  const formatCategoryName = (category) => {
    if (!category) return '';
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [exercises, searchTerm, categoryFilter, sortBy]);

  const fetchExercises = async () => {
    try {
      const response = await api.get(`${BACKEND_URL}/api/admin/exercises`);
      setExercises(response.data);
    } catch (error) {
      showToast('error', 'Failed to fetch exercises');
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...exercises];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exercise.description && exercise.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (exercise.category && exercise.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (exercise.tips && exercise.tips.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (exercise.instructions && exercise.instructions.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(exercise => 
        exercise.category && exercise.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "newest":
          return new Date(b.CreatedAt || b.createdAt || 0) - new Date(a.CreatedAt || a.createdAt || 0);
        case "oldest":
          return new Date(a.CreatedAt || a.createdAt || 0) - new Date(b.CreatedAt || b.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredExercises(filtered);
  };

  const handleCreate = async () => {
    try {
      const response = await api.post(`${BACKEND_URL}/api/admin/exercises`, formData);
      setExercises([...exercises, response.data]);
      setShowCreateForm(false);
      resetForm();
      showToast('success', 'Exercise created successfully');
    } catch (error) {
      showToast('error', 'Failed to create exercise');
      console.error('Error creating exercise:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await api.put(`${BACKEND_URL}/api/admin/exercises/${id}`, formData);
      setExercises(exercises.map(ex => ex.ID === id ? response.data : ex));
      setEditingExercise(null);
      resetForm();
      showToast('success', 'Exercise updated successfully');
    } catch (error) {
      showToast('error', 'Failed to update exercise');
      console.error('Error updating exercise:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;
    
    try {
      await api.delete(`${BACKEND_URL}/api/admin/exercises/${id}`);
      setExercises(exercises.filter(ex => ex.ID !== id));
      showToast('success', 'Exercise deleted successfully');
    } catch (error) {
      showToast('error', 'Failed to delete exercise');
      console.error('Error deleting exercise:', error);
    }
  };

  const startEdit = (exercise) => {
    setEditingExercise(exercise.ID);
    setFormData({
      name: exercise.name || '',
      description: exercise.description || '',
      category: exercise.category || '',
      videoId: exercise.videoId || '',
      tips: exercise.tips || '',
      instructions: exercise.instructions || '',
      modificationId: exercise.modificationId || null,
      modificationId2: exercise.modificationId2 || null
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      videoId: '',
      tips: '',
      instructions: '',
      modificationId: null,
      modificationId2: null
    });
  };

  const cancelEdit = () => {
    setEditingExercise(null);
    setShowCreateForm(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-customGray/30 to-white pt-32">
        <p className="text-xl text-customGray">Loading exercises...</p>
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
          <h1 className="text-4xl font-bold text-customGray mb-6">Exercise Management</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-customGray text-white px-6 py-3 rounded-lg hover:bg-logoGray transition-colors flex items-center space-x-2 mx-auto"
          >
            <FiPlus size={20} />
            <span>Add Exercise</span>
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FiSearch className="text-customGray" size={20} />
            <h3 className="text-xl font-bold text-customGray">
              Search & Filter Exercises ({filteredExercises.length} of {exercises.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search exercises by name, description, tips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded border border-gray-300 text-customGray placeholder-gray-500 focus:ring-2 focus:ring-customGray focus:border-transparent"
              />
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded border border-gray-300 text-customGray appearance-none focus:ring-2 focus:ring-customGray focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{formatCategoryName(cat)}</option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
            >
              <option value="name">Sort by Name (A-Z)</option>
              <option value="category">Sort by Category</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {searchTerm && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-customGray">Searching for:</span>
              <span className="bg-customGray text-white px-2 py-1 rounded">
                "{searchTerm}"
              </span>
              <button
                onClick={() => setSearchTerm("")}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8"
          >
            <h3 className="text-xl font-bold text-customGray mb-4 font-higherJump">Create New Exercise</h3>
            <ExerciseForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              formatCategoryName={formatCategoryName}
              exercises={exercises}
              onSave={handleCreate}
              onCancel={cancelEdit}
            />
          </motion.div>
        )}

        {/* Exercise List */}
        <div className="grid gap-6">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-customGray mb-4">
                {exercises.length === 0 
                  ? "No exercises found." 
                  : searchTerm || categoryFilter !== "all"
                    ? "No exercises match your search criteria."
                    : "No exercises to display."
                }
              </h3>
              {(searchTerm || categoryFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                  }}
                  className="bg-limeGreen text-black px-6 py-3 rounded-lg hover:bg-green-400 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.ID}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {editingExercise === exercise.ID ? (
                    <div className="p-6">
                      <ExerciseForm
                        formData={formData}
                        setFormData={setFormData}
                        categories={categories}
                        formatCategoryName={formatCategoryName}
                        exercises={exercises}
                        onSave={() => handleUpdate(exercise.ID)}
                        onCancel={cancelEdit}
                      />
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-customGray mb-2">
                            {exercise.name}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-limeGreen/10 text-limeGreen">
                            {formatCategoryName(exercise.category)}
                          </span>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => startEdit(exercise)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50"
                            title="Edit Exercise"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(exercise.ID)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50"
                            title="Delete Exercise"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {exercise.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{exercise.description}</p>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        {exercise.videoId && (
                          <div className="flex items-center text-gray-600">
                            <span className="font-medium mr-2">Video ID:</span>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">{exercise.videoId}</span>
                          </div>
                        )}
                        
                        {exercise.tips && (
                          <div className="text-gray-600">
                            <span className="font-medium">Tips:</span>
                            <p className="mt-1 text-xs bg-blue-50 p-2 rounded line-clamp-2">{exercise.tips}</p>
                          </div>
                        )}
                        
                        {exercise.instructions && (
                          <div className="text-gray-600">
                            <span className="font-medium">Instructions:</span>
                            <p className="mt-1 text-xs bg-green-50 p-2 rounded line-clamp-3">{exercise.instructions}</p>
                          </div>
                        )}
                      </div>
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

const ExerciseForm = ({ formData, setFormData, categories, formatCategoryName, exercises, onSave, onCancel }) => {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-customGray font-titillium mb-2">Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full p-3 rounded border border-gray-300 text-customGray font-titillium focus:ring-2 focus:ring-limeGreen focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label className="block text-customGray font-titillium mb-2">Category *</label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="w-full p-3 rounded border border-gray-300 text-customGray font-titillium focus:ring-2 focus:ring-limeGreen focus:border-transparent"
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{formatCategoryName(cat)}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-customGray font-titillium mb-2">Video ID</label>
        <input
          type="text"
          value={formData.videoId}
          onChange={(e) => handleInputChange('videoId', e.target.value)}
          className="w-full p-3 rounded border border-gray-300 text-customGray font-titillium focus:ring-2 focus:ring-limeGreen focus:border-transparent"
          placeholder="YouTube video ID"
        />
      </div>
      
      <div>
        <label className="block text-customGray font-titillium mb-2">Modification Exercise</label>
        <select
          value={formData.modificationId || ''}
          onChange={(e) => handleInputChange('modificationId', e.target.value ? parseInt(e.target.value) : null)}
          className="w-full p-3 rounded border border-gray-300 text-customGray font-titillium focus:ring-2 focus:ring-limeGreen focus:border-transparent"
        >
          <option value="">No Modification</option>
          {exercises.map(ex => (
            <option key={ex.ID} value={ex.ID}>{ex.name}</option>
          ))}
        </select>
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-customGray font-titillium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full p-3 rounded border border-gray-300 text-customGray font-titillium focus:ring-2 focus:ring-limeGreen focus:border-transparent"
          rows="3"
        />
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-customGray font-titillium mb-2">Instructions</label>
        <textarea
          value={formData.instructions}
          onChange={(e) => handleInputChange('instructions', e.target.value)}
          className="w-full p-3 rounded border border-gray-300 text-customGray font-titillium focus:ring-2 focus:ring-limeGreen focus:border-transparent"
          rows="3"
        />
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-customGray font-titillium mb-2">Tips</label>
        <textarea
          value={formData.tips}
          onChange={(e) => handleInputChange('tips', e.target.value)}
          className="w-full p-3 rounded border border-gray-300 text-customGray font-titillium focus:ring-2 focus:ring-limeGreen focus:border-transparent"
          rows="3"
        />
      </div>
      
      <div className="md:col-span-2 flex gap-4 mt-4">
        <button
          onClick={onSave}
          className="btn-full-colour flex items-center gap-2"
          disabled={!formData.name || !formData.category}
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

ExerciseForm.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string.isRequired,
    videoId: PropTypes.string,
    tips: PropTypes.string,
    instructions: PropTypes.string,
    modificationId: PropTypes.number,
    modificationId2: PropTypes.number
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  formatCategoryName: PropTypes.func.isRequired,
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ExerciseManagement;