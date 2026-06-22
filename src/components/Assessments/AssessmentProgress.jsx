import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Target } from 'lucide-react';
import assessmentApi from '../../utils/assessmentApi';

const AssessmentProgress = ({
  programName,
  dayNumber,
  assessmentExercises,
  isVisible = false,
}) => {
  const [recordedAssessments, setRecordedAssessments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && programName && dayNumber && assessmentExercises.length > 0) {
      loadRecordedAssessments();
    }
  }, [isVisible, programName, dayNumber, assessmentExercises]);

  const loadRecordedAssessments = async () => {
    setLoading(true);
    const result = await assessmentApi.getProgramAssessments(programName, dayNumber);
    if (result.success) setRecordedAssessments(result.data);
    setLoading(false);
  };

  const isExerciseRecorded = (exerciseId) =>
    recordedAssessments.some(a => a.exerciseId === exerciseId);

  const recordedCount = assessmentExercises.filter(e => isExerciseRecorded(e.id)).length;
  const totalCount = assessmentExercises.length;
  const isDay1 = dayNumber === 1;
  const allDone = recordedCount === totalCount;

  if (!isVisible || assessmentExercises.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className={`rounded-2xl border-2 p-4 mb-4 ${
        allDone
          ? 'bg-green-50 border-limeGreen'
          : isDay1
          ? 'bg-red-50 border-red-300'
          : 'bg-yellow-50 border-brightYellow'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target
            size={16}
            className={allDone ? 'text-limeGreen' : isDay1 ? 'text-red-400' : 'text-brightYellow'}
          />
          <p className="text-sm font-bold text-customGray font-titillium">
            {isDay1 ? 'Day 1' : `Day ${dayNumber}`} Assessment Progress
          </p>
        </div>
        <span className={`text-xs font-titillium font-bold px-2.5 py-1 rounded-full ${
          allDone
            ? 'bg-limeGreen/20 text-limeGreen'
            : isDay1
            ? 'bg-red-100 text-red-500'
            : 'bg-brightYellow/20 text-customGray'
        }`}>
          {recordedCount}/{totalCount}
        </span>
      </div>

      {/* Day 1 warning */}
      {isDay1 && !allDone && (
        <div className="mb-3 px-3 py-2 bg-red-100 rounded-xl border border-red-200">
          <p className="text-red-500 text-xs font-titillium">
            ⚠️ Record all exercises — you'll need these for your Day 30 comparison!
          </p>
        </div>
      )}

      {/* Exercise list */}
      <div className="space-y-2">
        {loading ? (
          <p className="text-xs text-customGray/50 font-titillium">Loading progress...</p>
        ) : (
          assessmentExercises.map((exercise) => {
            const recorded = isExerciseRecorded(exercise.id);
            return (
              <div key={exercise.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {recorded ? (
                    <CheckCircle size={15} className="text-limeGreen shrink-0" />
                  ) : (
                    <Circle size={15} className="text-customGray/25 shrink-0" />
                  )}
                  <span className={`text-sm font-titillium ${recorded ? 'text-customGray' : 'text-customGray/50'}`}>
                    {exercise.name}
                  </span>
                </div>
                {recorded && (
                  <span className="text-xs text-limeGreen font-titillium font-semibold">✓ Recorded</span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* All done banner */}
      {allDone && (
        <div className="mt-3 px-3 py-2 bg-limeGreen/20 rounded-xl border border-limeGreen/40 text-center">
          <p className="text-limeGreen text-xs font-titillium font-semibold">
            🎉 All assessments recorded — great job!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AssessmentProgress;
