import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Clock, Hash, Target, TrendingUp } from 'lucide-react';
import { showToast } from '../../utils/toastUtil';
import assessmentApi from '../../utils/assessmentApi';

const AssessmentInput = ({
  exercise,
  programName,
  dayNumber,
  isOpen,
  onClose,
  onSave,
  existingAssessment = null,
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

  const isTimeBased =
    exercise?.name?.toLowerCase().includes('plank hold') ||
    exercise?.name?.toLowerCase().includes('hold');
  const isDay30 = dayNumber === 30;

  useEffect(() => {
    if (isOpen && isDay30 && exercise && programName) loadDay1Assessment();
  }, [isOpen, isDay30, exercise, programName]);

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
      const mins = Math.floor(day1Assessment.timeSeconds / 60);
      const secs = day1Assessment.timeSeconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      <div className="flex items-center gap-1 text-limeGreen text-xs font-titillium mt-1">
        <TrendingUp size={12} /><span>+{improvement} {unit} improvement!</span>
      </div>
    );
    if (improvement < 0) return (
      <p className="text-orange-400 text-xs font-titillium mt-1">{Math.abs(improvement)} {unit} below Day 1</p>
    );
    return <p className="text-brightYellow text-xs font-titillium mt-1">Same as Day 1 — try to beat it!</p>;
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    let assessmentData = { programName, dayNumber, exerciseId: exercise.id, exerciseName: exercise.name, notes: notes.trim() };
    if (isTimeBased) {
      const total = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
      if (total <= 0) { showToast('error', 'Please enter a valid time'); setIsSubmitting(false); return; }
      assessmentData.timeSeconds = total;
    } else {
      const r = parseInt(reps);
      if (!r || r <= 0) { showToast('error', 'Please enter a valid number of reps'); setIsSubmitting(false); return; }
      assessmentData.reps = r;
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
    setReps(''); setMinutes(''); setSeconds(''); setNotes(''); setDay1Assessment(null);
    onClose();
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-customGray font-titillium text-sm focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-brightYellow transition-colors duration-200 no-spinners";
  const labelClass = "flex items-center gap-2 text-sm font-titillium font-semibold text-customGray mb-2";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-customGray font-titillium">Record Result</h2>
            <p className="text-xs text-customGray/50 font-titillium mt-0.5">
              Day {dayNumber} — {programName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>
          <button onClick={handleClose} className="p-2 text-customGray/30 hover:text-customGray rounded-lg hover:bg-gray-50 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Exercise name */}
          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-xs text-customGray/50 font-titillium mb-0.5">Exercise</p>
            <p className="text-sm font-bold text-customGray font-titillium">{exercise?.name}</p>
          </div>

          {/* Day 1 comparison (Day 30 only) */}
          {isDay30 && (
            <div className="bg-yellow-50 rounded-xl px-4 py-3 border border-brightYellow/30">
              <div className="flex items-center gap-2 mb-2">
                <Target size={14} className="text-brightYellow shrink-0" />
                <p className="text-xs font-titillium font-bold text-customGray">Day 1 to Beat</p>
              </div>
              {loadingDay1 ? (
                <p className="text-xs text-customGray/40 font-titillium">Loading...</p>
              ) : day1Assessment ? (
                <div>
                  <p className="text-lg font-bold text-brightYellow font-titillium">{formatDay1Performance()}</p>
                  <p className="text-xs text-customGray/40 font-titillium">
                    {new Date(day1Assessment.recordedDate).toLocaleDateString('en-GB')}
                  </p>
                  {getImprovementIndicator()}
                </div>
              ) : (
                <p className="text-xs text-customGray/40 font-titillium">No Day 1 data found</p>
              )}
            </div>
          )}

          {/* Input */}
          {isTimeBased ? (
            <div>
              <label className={labelClass}><Clock size={14} /> Time Held</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input type="number" placeholder="0" value={minutes} onChange={e => setMinutes(e.target.value)} className={inputClass} min="0" max="59" />
                  <p className="text-xs text-customGray/40 font-titillium mt-1 text-center">Minutes</p>
                </div>
                <div>
                  <input type="number" placeholder="0" value={seconds} onChange={e => setSeconds(e.target.value)} className={inputClass} min="0" max="59" />
                  <p className="text-xs text-customGray/40 font-titillium mt-1 text-center">Seconds</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className={labelClass}><Hash size={14} /> Number of Reps</label>
              <input type="number" placeholder="Enter reps completed" value={reps} onChange={e => setReps(e.target.value)} className={inputClass} min="0" />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-titillium font-semibold text-customGray mb-2">Notes <span className="text-customGray/40 font-normal">(optional)</span></label>
            <textarea
              placeholder="How did it feel? Any modifications used?"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-customGray font-titillium text-sm focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-brightYellow transition-colors duration-200 resize-none"
              rows="3"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={handleClose} className="flex-1 py-3 bg-gray-50 text-customGray/60 text-sm font-titillium font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-100">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-brightYellow text-black text-sm font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={15} />
              {isSubmitting ? 'Saving...' : 'Save Result'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AssessmentInput;
