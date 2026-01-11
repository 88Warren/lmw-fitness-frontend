import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { showToast } from '../../utils/toastUtil';
import { ToastContainer } from 'react-toastify';
import api from '../../utils/api';
import { BACKEND_URL } from '../../utils/config';
import DynamicHeading from '../../components/Shared/DynamicHeading';
import PropTypes from 'prop-types';

const ExerciseManagement = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExercise, setEditingExercise] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const categories = [
    'Cardio',
    'Strength',
    'Flexibility',
    'Core',
    'Upper Body',
    'Lower Body',
    'Full Body',
    'Warm Up',
    'Cool Down'
  ];

  useEffect(() => {
    fetchExercises();
  }, []);

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
      <div className="min-h-screen flex items-center justify-center bg-customGray">
        <p className="text-xl font-titillium text-customWhite">Loading exercises...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-linear-to-b from-customGray/30 to-white p-6 pt-24"
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
              text="Exercise Management"
              className="font-higherJump text-3xl md:text-4xl font-bold text-customGray leading-loose tracking-widest"
            />
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-full-colour flex items-center gap-2"
            >
              <Plus size={20} />
              Add Exercise
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-customGray p-6 rounded-lg border-2 border-brightYellow mb-8"
          >
            <h3 className="text-xl font-bold text-customWhite mb-4 font-higherJump">Create New Exercise</h3>
            <ExerciseForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              exercises={exercises}
              onSave={handleCreate}
              onCancel={cancelEdit}
            />
          </motion.div>
        )}

        {/* Exercise List */}
        <div className="grid gap-6">
          {exercises.map((exercise) => (
            <motion.div
              key={exercise.ID}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-customGray p-6 rounded-lg border-2 border-brightYellow"
            >
              {editingExercise === exercise.ID ? (
                <ExerciseForm
                  formData={formData}
                  setFormData={setFormData}
                  categories={categories}
                  exercises={exercises}
                  onSave={() => handleUpdate(exercise.ID)}
                  onCancel={cancelEdit}
                />
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-customWhite font-higherJump">
                        {exercise.name}
                      </h3>
                      <p className="text-brightYellow font-titillium">{exercise.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(exercise)}
                        className="p-2 bg-brightYellow text-customGray rounded hover:bg-hotPink transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(exercise.ID)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {exercise.description && (
                    <p className="text-logoGray mb-2 font-titillium">{exercise.description}</p>
                  )}
                  
                  {exercise.videoId && (
                    <p className="text-logoGray mb-2 font-titillium">
                      <strong>Video ID:</strong> {exercise.videoId}
                    </p>
                  )}
                  
                  {exercise.tips && (
                    <p className="text-logoGray mb-2 font-titillium">
                      <strong>Tips:</strong> {exercise.tips}
                    </p>
                  )}
                  
                  {exercise.instructions && (
                    <p className="text-logoGray font-titillium">
                      <strong>Instructions:</strong> {exercise.instructions}
                    </p>
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

const ExerciseForm = ({ formData, setFormData, categories, exercises, onSave, onCancel }) => {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-customWhite font-titillium mb-2">Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
          required
        />
      </div>
      
      <div>
        <label className="block text-customWhite font-titillium mb-2">Category *</label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-customWhite font-titillium mb-2">Video ID</label>
        <input
          type="text"
          value={formData.videoId}
          onChange={(e) => handleInputChange('videoId', e.target.value)}
          className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
          placeholder="YouTube video ID"
        />
      </div>
      
      <div>
        <label className="block text-customWhite font-titillium mb-2">Modification Exercise</label>
        <select
          value={formData.modificationId || ''}
          onChange={(e) => handleInputChange('modificationId', e.target.value ? parseInt(e.target.value) : null)}
          className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
        >
          <option value="">No Modification</option>
          {exercises.map(ex => (
            <option key={ex.ID} value={ex.ID}>{ex.name}</option>
          ))}
        </select>
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-customWhite font-titillium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
          rows="3"
        />
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-customWhite font-titillium mb-2">Instructions</label>
        <textarea
          value={formData.instructions}
          onChange={(e) => handleInputChange('instructions', e.target.value)}
          className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
          rows="3"
        />
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-customWhite font-titillium mb-2">Tips</label>
        <textarea
          value={formData.tips}
          onChange={(e) => handleInputChange('tips', e.target.value)}
          className="w-full p-3 rounded bg-customWhite text-customGray font-titillium"
          rows="3"
        />
      </div>
      
      <div className="md:col-span-2 flex gap-4 mt-4">
        <button
          onClick={onSave}
          className="btn-full-colour flex items-center gap-2"
          disabled={!formData.name || !formData.category}
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
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ExerciseManagement;