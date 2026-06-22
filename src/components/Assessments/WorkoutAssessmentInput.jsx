import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Save, TrendingUp } from 'lucide-react';
import { showToast } from '../../utils/toastUtil';
import assessmentApi from '../../utils/assessmentApi';

const WorkoutAssessmentInput = ({
  exercise,
  programName,
  dayNumber,
  isVisible = false,
  onSave,
  isFullscreen = false,
}) => {
  const [reps, setReps] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingAssessment, setHasExistingAssessment] = useState(false);
  const [day1Assessment, setDay1Assessment] = useState(null);
  const [loadingDay1, setLoadingDay1] = useState(false);

  const isTimeBased =
    exercise?.name?.toLowerCase().includes('plank hold') ||
    exercise?.name?.toLowerCase().includes('hold');
  const isDay30 = dayNumber === 30;

  useEffect(() => {
    if (isVisible && exercise && programName && dayNumber) {
      loadExistingAssessment();
      if (isDay30) loadDay1Assessment();
    }
  }, [isVisible, exercise, programName, dayNumber, isDay30]);

  const loadExistingAssessment = async () => {
    try {
      const result = await assessmentApi.getProgramAssessments(programName, dayNumber);
      if (result.success && Array.isArray(result.data)) {
        const existing = result.data.find(a => a.exerciseId === exercise.id);
        if (existing) {
          setHasExistingAssessment(true);
          if (existing.reps) setReps(existing.reps.toString());
          if (existing.timeSeconds) {
            setMinutes(Math.floor(existing.timeSeconds / 60).toString());
            setSeconds((existing.timeSeconds % 60).toString());
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
    if (result.success) setDay1Assessment(result.data);
    else console.log('No Day 1 assessment found for this exercise');
    setLoadingDay1(false);
  };

  const formatDay1Performance = () => {
    if (!day1Assessment) return null;
    if (day1Assessment.reps) return `${day1Assessment.reps} reps`;
    if (day1Assessment.timeSeconds) {
      const m = Math.floor(day1Assessment.timeSeconds / 60);
      const s = day1Assessment.timeSeconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
    }
    return null;
  };

  const getCurrentPerformance = () => {
    if (isTimeBased) {
      const total = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
      if (total > 0) {
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
      }
    } else {
      const r = parseInt(reps);
      if (r > 0) return `${r} reps`;
    }
    return null;
  };

  const getImprovementIndicator = () => {
    if (!day1Assessment || !getCurrentPerformance()) return null;
    let improvement = 0;
    if (day1Assessment.reps && reps) improvement = parseInt(reps) - day1Assessment.reps;
    else if (day1Assessment.timeSeconds && minutes && seconds) {
      improvement = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0) - day1Assessment.timeSeconds;
    }
    const unit = isTimeBased ? 'seconds' : 'reps';
    if (improvement > 0) return (
      <div className="flex items-center gap-1 text-limeGreen text-xs font-titillium">
        <TrendingUp size={11} /><span>+{improvement} {unit}!</span>
      </div>
    );
    if (improvement < 0) return (
      <p className="text-orange-400 text-xs font-titillium">{Math.abs(improvement)} {unit} below Day 1</p>
    );
    return <p className="text-brightYellow text-xs font-titillium">Same as Day 1</p>;
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    let assessmentData = { programName, dayNumber, exerciseId: exercise.id, exerciseName: exercise.name, notes: '' };
    if (isTimeBased) {
      const total = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
      if (total <= 0) { showToast('error', 'Please enter a valid time'); setIsSubmitting(false); return; }
      assessmentData.timeSeconds = total;
    } else {
      const r = parseInt(reps);
      if (!r || r <= 0) { showToast('error', 'Please enter a valid number of reps'); setIsSubmitting(false); return; }
      assessmentData.reps = r;
    }
    console.log('Sending assessment data:', assessmentData);
    const result = await assessmentApi.saveAssessment(assessmentData);
    if (result.success) {
      showToast('success', hasExistingAssessment ? 'Assessment updated!' : 'Assessment saved!');
      setHasExistingAssessment(true);
      onSave && onSave(result.data.assessment);
    } else {
      showToast('error', result.error);
    }
    setIsSubmitting(false);
  };

  if (!isVisible || !exercise) return null;

  // Compact styles for fullscreen mode, normal for regular
  const compact = isFullscreen;
  const inputClass = `w-full rounded-xl border border-gray-200 bg-white text-customGray font-titillium focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-brightYellow transition-colors duration-200 text-center no-spinners ${
    compact ? 'px-2 py-1.5 text-sm' : 'px-3 py-2.5 text-base'
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className={`bg-white rounded-2xl border-2 border-brightYellow shadow-sm mx-auto ${
        compact ? 'p-3 mb-2 max-w-xs' : 'p-4 mb-3 max-w-sm'
      }`}
    >
      {/* Exercise name */}
      <div className={`text-center ${compact ? 'mb-2' : 'mb-3'}`}>
        <p className={`font-bold text-customGray font-titillium ${compact ? 'text-sm' : 'text-base'}`}>
          {exercise.name}
        </p>

        {/* Day 1 comparison */}
        {isDay30 && (
          <div className={`mt-2 bg-yellow-50 rounded-xl border border-brightYellow/30 ${compact ? 'px-2 py-1.5' : 'px-3 py-2'}`}>
            {loadingDay1 ? (
              <p className="text-xs text-customGray/40 font-titillium">Loading...</p>
            ) : day1Assessment ? (
              <div>
                <p className={`font-bold text-brightYellow font-titillium ${compact ? 'text-xs' : 'text-sm'}`}>
                  Day 1: {formatDay1Performance()}
                </p>
                {getImprovementIndicator()}
              </div>
            ) : (
              <p className="text-xs text-customGray/40 font-titillium">No Day 1 data</p>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className={`space-y-2 ${compact ? '' : 'space-y-3'}`}>
        {isTimeBased ? (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input type="number" placeholder="0" value={minutes} onChange={e => setMinutes(e.target.value)} className={inputClass} min="0" max="59" />
              <p className="text-xs text-customGray/40 font-titillium text-center mt-0.5">Min</p>
            </div>
            <div>
              <input type="number" placeholder="0" value={seconds} onChange={e => setSeconds(e.target.value)} className={inputClass} min="0" max="59" />
              <p className="text-xs text-customGray/40 font-titillium text-center mt-0.5">Sec</p>
            </div>
          </div>
        ) : (
          <input
            type="number"
            placeholder={isDay30 ? "Today's reps" : "Enter reps"}
            value={reps}
            onChange={e => setReps(e.target.value)}
            className={inputClass}
            min="0"
          />
        )}

        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className={`w-full bg-brightYellow text-black font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
            compact ? 'py-1.5 text-xs' : 'py-2.5 text-sm'
          }`}
        >
          <Save size={compact ? 12 : 14} />
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>

        {hasExistingAssessment && (
          <p className="text-xs text-limeGreen font-titillium text-center font-semibold">✓ Recorded</p>
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
