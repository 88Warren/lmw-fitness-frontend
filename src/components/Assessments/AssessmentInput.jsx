import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Clock, Hash } from 'lucide-react';
import { showToast } from '../../utils/toastUtil';
import assessmentApi from '../../utils/assessmentApi';
import DynamicHeading from '../Shared/DynamicHeading';

const AssessmentInput = ({ 
  exercise, 
  programName, 
  dayNumber, 
  isOpen, 
  onClose, 
  onSave,
  existingAssessment = null 
}) => {
  const [reps, setReps] = useState(existingAssessment?.reps?.toString() || '');
  const [minutes, setMinutes] = useState(
    existingAssessment?.timeSeconds ? Math.floor(existingAssessment.timeSeconds / 60).toString() : ''
  );
  const [seconds, setSeconds] = useState(
    existingAssessment?.timeSeconds ? (existingAssessment.timeSeconds % 60).toString() : ''
  );
  const [notes, setNotes] = useState(existingAssessment?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine if this is a time-based exercise (like Plank Hold)
  const isTimeBased = exercise?.name?.toLowerCase().includes('plank hold') || 
                      exercise?.name?.toLowerCase().includes('hold');

  const handleSave = async () => {
    setIsSubmitting(true);

    let assessmentData = {
      programName,
      dayNumber,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      notes: notes.trim()
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
    
    if (result.success) {
      showToast('success', existingAssessment ? 'Assessment updated!' : 'Assessment saved!');
      onSave && onSave(result.data.assessment);
      onClose();
    } else {
      showToast('error', result.error);
    }
    
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setReps('');
    setMinutes('');
    setSeconds('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-customGray rounded-lg p-6 w-full max-w-md border-2 border-brightYellow"
      >
        <div className="flex justify-between items-center mb-4">
          <DynamicHeading
            text="Record Result"
            className="text-xl font-higherJump text-customWhite tracking-wider"
          />
          <button
            onClick={handleClose}
            className="text-logoGray hover:text-brightYellow transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-customWhite font-titillium mb-2">
            <span className="text-brightYellow">{exercise?.name}</span>
          </p>
          <p className="text-logoGray text-sm font-titillium">
            Day {dayNumber} - {programName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>

        <div className="space-y-4">
          {isTimeBased ? (
            <div>
              <label className="block text-customWhite font-titillium mb-2">
                <Clock className="inline mr-2" size={16} />
                Time Held
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-logoGray rounded text-customWhite font-titillium focus:border-brightYellow focus:outline-none"
                    min="0"
                    max="59"
                  />
                  <span className="text-xs text-logoGray mt-1 block">Minutes</span>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Sec"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-logoGray rounded text-customWhite font-titillium focus:border-brightYellow focus:outline-none"
                    min="0"
                    max="59"
                  />
                  <span className="text-xs text-logoGray mt-1 block">Seconds</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-customWhite font-titillium mb-2">
                <Hash className="inline mr-2" size={16} />
                Number of Reps
              </label>
              <input
                type="number"
                placeholder="Enter reps completed"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-logoGray rounded text-customWhite font-titillium focus:border-brightYellow focus:outline-none"
                min="0"
              />
            </div>
          )}

          <div>
            <label className="block text-customWhite font-titillium mb-2">
              Notes (Optional)
            </label>
            <textarea
              placeholder="How did it feel? Any modifications used?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-logoGray rounded text-customWhite font-titillium focus:border-brightYellow focus:outline-none resize-none"
              rows="3"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-gray-600 text-customWhite rounded font-titillium hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-brightYellow text-customGray rounded font-titillium hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Save className="mr-2" size={16} />
            {isSubmitting ? 'Saving...' : 'Save Result'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AssessmentInput;