import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Clock, Hash, Target, TrendingUp } from 'lucide-react';
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
  const [day1Assessment, setDay1Assessment] = useState(null);
  const [loadingDay1, setLoadingDay1] = useState(false);

  // Determine if this is a time-based exercise (like Plank Hold)
  const isTimeBased = exercise?.name?.toLowerCase().includes('plank hold') || 
                      exercise?.name?.toLowerCase().includes('hold');

  // Check if this is Day 30 to show Day 1 comparison
  const isDay30 = dayNumber === 30;

  // Load Day 1 assessment when modal opens for Day 30
  useEffect(() => {
    if (isOpen && isDay30 && exercise && programName) {
      loadDay1Assessment();
    }
  }, [isOpen, isDay30, exercise, programName]);

  const loadDay1Assessment = async () => {
    setLoadingDay1(true);
    const result = await assessmentApi.getDay1Assessment(programName, exercise.id);
    if (result.success) {
      setDay1Assessment(result.data);
    } else {
      console.log('No Day 1 assessment found for this exercise');
    }
    setLoadingDay1(false);
  };

  const formatDay1Performance = () => {
    if (!day1Assessment) return null;
    
    if (day1Assessment.reps) {
      return `${day1Assessment.reps} reps`;
    }
    
    if (day1Assessment.timeSeconds) {
      const mins = Math.floor(day1Assessment.timeSeconds / 60);
      const secs = day1Assessment.timeSeconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    return null;
  };

  const getCurrentPerformance = () => {
    if (isTimeBased) {
      const totalSeconds = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
      if (totalSeconds > 0) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      }
    } else {
      const repsValue = parseInt(reps);
      if (repsValue > 0) {
        return `${repsValue} reps`;
      }
    }
    return null;
  };

  const getImprovementIndicator = () => {
    if (!day1Assessment) return null;
    
    const current = getCurrentPerformance();
    if (!current) return null;
    
    let improvement = 0;
    
    if (day1Assessment.reps && reps) {
      improvement = parseInt(reps) - day1Assessment.reps;
    } else if (day1Assessment.timeSeconds && minutes && seconds) {
      const currentSeconds = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
      improvement = currentSeconds - day1Assessment.timeSeconds;
    }
    
    if (improvement > 0) {
      return (
        <div className="flex items-center text-green-400 text-sm mt-2">
          <TrendingUp size={14} className="mr-1" />
          <span>+{improvement} {isTimeBased ? 'seconds' : 'reps'} improvement!</span>
        </div>
      );
    } else if (improvement < 0) {
      return (
        <div className="text-orange-400 text-sm mt-2">
          <span>{Math.abs(improvement)} {isTimeBased ? 'seconds' : 'reps'} below Day 1</span>
        </div>
      );
    } else if (improvement === 0) {
      return (
        <div className="text-brightYellow text-sm mt-2">
          <span>Same as Day 1 - try to beat it!</span>
        </div>
      );
    }
    
    return null;
  };

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
    setDay1Assessment(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-customGray rounded-lg p-6 w-full max-w-md border-2 border-brightYellow max-h-[90vh] overflow-y-auto"
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

        {/* Day 1 Performance Display for Day 30 */}
        {isDay30 && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-logoGray">
            <div className="flex items-center mb-2">
              <Target className="text-brightYellow mr-2" size={16} />
              <span className="text-customWhite font-titillium text-sm font-semibold">
                Day 1 Performance to Beat
              </span>
            </div>
            {loadingDay1 ? (
              <p className="text-logoGray text-xs">Loading Day 1 data...</p>
            ) : day1Assessment ? (
              <div className="space-y-1">
                <p className="text-brightYellow font-titillium text-lg font-bold">
                  {formatDay1Performance()}
                </p>
                <p className="text-logoGray text-xs">
                  Recorded on {new Date(day1Assessment.recordedDate).toLocaleDateString('en-GB')}
                </p>
                {getCurrentPerformance() && getImprovementIndicator()}
              </div>
            ) : (
              <p className="text-logoGray text-xs">
                No Day 1 assessment found for this exercise
              </p>
            )}
          </div>
        )}

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