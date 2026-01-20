import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Save, Clock, Hash } from 'lucide-react';
import { showToast } from '../../utils/toastUtil';
import assessmentApi from '../../utils/assessmentApi';
import DynamicHeading from '../Shared/DynamicHeading';

const WorkoutAssessmentInput = ({ 
  exercise, 
  programName, 
  dayNumber, 
  isVisible = false,
  onSave 
}) => {
  const [reps, setReps] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingAssessment, setHasExistingAssessment] = useState(false);

  // Determine if this is a time-based exercise (like Plank Hold)
  const isTimeBased = exercise?.name?.toLowerCase().includes('plank hold') || 
                      exercise?.name?.toLowerCase().includes('hold');

  // Load existing assessment when component becomes visible
  useEffect(() => {
    if (isVisible && exercise && programName && dayNumber) {
      loadExistingAssessment();
    }
  }, [isVisible, exercise, programName, dayNumber]);

  const loadExistingAssessment = async () => {
    const result = await assessmentApi.getProgramAssessments(programName, dayNumber);
    if (result.success) {
      const existingAssessment = result.data.find(a => a.exerciseId === exercise.id);
      if (existingAssessment) {
        setHasExistingAssessment(true);
        if (existingAssessment.reps) {
          setReps(existingAssessment.reps.toString());
        }
        if (existingAssessment.timeSeconds) {
          setMinutes(Math.floor(existingAssessment.timeSeconds / 60).toString());
          setSeconds((existingAssessment.timeSeconds % 60).toString());
        }
      }
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    let assessmentData = {
      programName,
      dayNumber,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      notes: ''
    };

    if (isTimeBased) {
      const totalSeconds = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
      if (totalSeconds <= 0) {
        showToast('error', 'Please enter a valid time');
        setIsSubmitting(false);
        return;
      }
      assessmentData.timeSeconds = totalSeconds;
    } else {
      const repsValue = parseInt(reps);
      if (!repsValue || repsValue <= 0) {
        showToast('error', 'Please enter a valid number of reps');
        setIsSubmitting(false);
        return;
      }
      assessmentData.reps = repsValue;
    }

    const result = await assessmentApi.saveAssessment(assessmentData);
    
    // Debug logging
    console.log('Sending assessment data:', assessmentData);
    
    if (result.success) {
      showToast('success', hasExistingAssessment ? 'Assessment updated!' : 'Assessment saved!');
      setHasExistingAssessment(true);
      onSave && onSave(result.data.assessment);
    } else {
      showToast('error', result.error);
    }
    
    setIsSubmitting(false);
  };

  const handleClear = () => {
    setReps('');
    setMinutes('');
    setSeconds('');
  };

  if (!isVisible || !exercise) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-customGray rounded-lg p-4 border-2 border-brightYellow mb-4"
    >
      <DynamicHeading
        text={`Record: ${exercise.name}`}
        className="text-lg font-higherJump text-customWhite mb-3 tracking-wider"
      />

      <div className="space-y-3">
        {isTimeBased ? (
          <div>
            <label className="block text-customWhite font-titillium mb-2 text-sm">
              <Clock className="inline mr-2" size={14} />
              Time Held
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="0"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full px-2 py-1 bg-gray-700 border border-logoGray rounded text-customWhite font-titillium focus:border-brightYellow focus:outline-none text-sm"
                  min="0"
                  max="59"
                />
                <span className="text-xs text-logoGray mt-1 block">Min</span>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="0"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="w-full px-2 py-1 bg-gray-700 border border-logoGray rounded text-customWhite font-titillium focus:border-brightYellow focus:outline-none text-sm"
                  min="0"
                  max="59"
                />
                <span className="text-xs text-logoGray mt-1 block">Sec</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-customWhite font-titillium mb-2 text-sm">
              <Hash className="inline mr-2" size={14} />
              Reps Completed
            </label>
            <input
              type="number"
              placeholder="Enter reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-logoGray rounded text-customWhite font-titillium focus:border-brightYellow focus:outline-none"
              min="0"
            />
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={handleClear}
            className="flex-1 px-3 py-2 bg-gray-600 text-customWhite rounded font-titillium hover:bg-gray-500 transition-colors text-sm"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 px-3 py-2 bg-brightYellow text-customGray rounded font-titillium hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
          >
            <Save className="mr-1" size={14} />
            {isSubmitting ? 'Saving...' : hasExistingAssessment ? 'Update' : 'Save'}
          </button>
        </div>

        {hasExistingAssessment && (
          <p className="text-xs text-brightYellow font-titillium text-center">
            ✓ Assessment recorded for this exercise
          </p>
        )}
      </div>
    </motion.div>
  );
};

WorkoutAssessmentInput.propTypes = {
  exercise: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  programName: PropTypes.string.isRequired,
  dayNumber: PropTypes.number.isRequired,
  isVisible: PropTypes.bool,
  onSave: PropTypes.func,
};

WorkoutAssessmentInput.defaultProps = {
  isVisible: false,
  onSave: null,
};

export default WorkoutAssessmentInput;