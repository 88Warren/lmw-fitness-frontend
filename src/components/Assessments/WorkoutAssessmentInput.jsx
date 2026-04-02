import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Save, Clock, Hash, Target, TrendingUp } from 'lucide-react';
import { showToast } from '../../utils/toastUtil';
import assessmentApi from '../../utils/assessmentApi';
import DynamicHeading from '../Shared/DynamicHeading';

const WorkoutAssessmentInput = ({ 
  exercise, 
  programName, 
  dayNumber, 
  isVisible = false,
  onSave,
  isFullscreen = false // New prop to handle fullscreen layout
}) => {
  const [reps, setReps] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingAssessment, setHasExistingAssessment] = useState(false);
  const [day1Assessment, setDay1Assessment] = useState(null);
  const [loadingDay1, setLoadingDay1] = useState(false);

  // Determine if this is a time-based exercise (like Plank Hold)
  const isTimeBased = exercise?.name?.toLowerCase().includes('plank hold') || 
                      exercise?.name?.toLowerCase().includes('hold');

  // Check if this is Day 30 to show Day 1 comparison
  const isDay30 = dayNumber === 30;

  // Load existing assessment and Day 1 data when component becomes visible
  useEffect(() => {
    if (isVisible && exercise && programName && dayNumber) {
      loadExistingAssessment();
      if (isDay30) {
        loadDay1Assessment();
      }
    }
  }, [isVisible, exercise, programName, dayNumber, isDay30]);

  const loadExistingAssessment = async () => {
    try {
      const result = await assessmentApi.getProgramAssessments(programName, dayNumber);
      if (result.success && result.data && Array.isArray(result.data)) {
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
    } catch (error) {
      console.error('Error loading existing assessment:', error);
    }
  };

  const loadDay1Assessment = async () => {
    setLoadingDay1(true);
    const result = await assessmentApi.getDay1Assessment(programName, exercise.id);
    if (result.success) {
      setDay1Assessment(result.data);
    } else {
      // Don't show error for missing Day 1 assessment, just log it
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
        <div className="flex items-center text-green-400 text-xs">
          <TrendingUp size={12} className="mr-1" />
          <span>+{improvement} {isTimeBased ? 'seconds' : 'reps'} improvement!</span>
        </div>
      );
    } else if (improvement < 0) {
      return (
        <div className="text-orange-400 text-xs">
          <span>{Math.abs(improvement)} {isTimeBased ? 'seconds' : 'reps'} below Day 1</span>
        </div>
      );
    } else if (improvement === 0) {
      return (
        <div className="text-brightYellow text-xs">
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
      className={`bg-customGray rounded-lg border-2 border-brightYellow mx-auto ${
        isFullscreen 
          ? 'p-2 sm:p-3 mb-2 max-w-xs' // Compact for fullscreen
          : 'p-3 sm:p-4 mb-2 sm:mb-4 max-w-sm' // Regular size for normal mode
      }`}
    >
      {/* Compact header */}
      <div className="text-center mb-2">
        <h3 className={`font-titillium text-customWhite font-semibold ${
          isFullscreen ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
        }`}>
          Record: {exercise.name}
        </h3>
        
        {/* Day 1 Performance Display for Day 30 - More compact */}
        {isDay30 && day1Assessment && (
          <div className={`mt-2 bg-gray-800 rounded border border-logoGray ${
            isFullscreen ? 'p-1.5' : 'p-2'
          }`}>
            <p className={`text-brightYellow font-titillium font-bold ${
              isFullscreen ? 'text-xs sm:text-sm' : 'text-sm'
            }`}>
              Day 1: {formatDay1Performance()}
            </p>
            <p className={`text-logoGray ${
              isFullscreen ? 'text-xs' : 'text-xs'
            }`}>
              {new Date(day1Assessment.recordedDate).toLocaleDateString('en-GB')}
            </p>
          </div>
        )}
      </div>

      {/* Simplified input section */}
      <div className={`space-y-2 ${isFullscreen ? '' : 'space-y-3'}`}>
        {isTimeBased ? (
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className={`w-full bg-gray-700 border border-logoGray rounded text-customWhite font-titillium focus:border-brightYellow focus:outline-none text-center ${
                  isFullscreen ? 'px-1 py-1.5 text-sm' : 'px-2 py-2'
                }`}
                min="0"
                max="59"
              />
              <span className={`text-logoGray mt-1 block text-center ${
                isFullscreen ? 'text-xs' : 'text-xs'
              }`}>Min</span>
            </div>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Sec"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                className={`w-full bg-gray-700 border border-logoGray rounded text-customWhite font-titillium focus:border-brightYellow focus:outline-none text-center ${
                  isFullscreen ? 'px-1 py-1.5 text-sm' : 'px-2 py-2'
                }`}
                min="0"
                max="59"
              />
              <span className={`text-logoGray mt-1 block text-center ${
                isFullscreen ? 'text-xs' : 'text-xs'
              }`}>Sec</span>
            </div>
          </div>
        ) : (
          <div>
            <input
              type="number"
              placeholder={isDay30 ? "Record today's reps" : "Enter reps"}
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className={`w-full bg-gray-700 border border-logoGray rounded text-customWhite font-titillium focus:border-brightYellow focus:outline-none text-center ${
                isFullscreen ? 'px-2 py-1.5 text-base' : 'px-3 py-2 text-lg'
              }`}
              min="0"
            />
          </div>
        )}

        {/* Single save button */}
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className={`w-full bg-brightYellow text-customGray rounded font-titillium hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
            isFullscreen ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'
          }`}
        >
          <Save className={`mr-2 ${isFullscreen ? 'w-3 h-3' : 'w-4 h-4'}`} />
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>

        {hasExistingAssessment && (
          <p className={`text-brightYellow font-titillium text-center ${
            isFullscreen ? 'text-xs' : 'text-xs'
          }`}>
            ✓ Recorded
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
  isFullscreen: PropTypes.bool,
};

WorkoutAssessmentInput.defaultProps = {
  isVisible: false,
  onSave: null,
  isFullscreen: false,
};

export default WorkoutAssessmentInput;