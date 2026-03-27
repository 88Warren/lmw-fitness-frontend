import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Target } from 'lucide-react';
import assessmentApi from '../../utils/assessmentApi';
import DynamicHeading from '../Shared/DynamicHeading';

const AssessmentProgress = ({ 
  programName, 
  dayNumber, 
  assessmentExercises,
  isVisible = false 
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
    if (result.success) {
      setRecordedAssessments(result.data);
    }
    setLoading(false);
  };

  const isExerciseRecorded = (exerciseId) => {
    return recordedAssessments.some(assessment => assessment.exerciseId === exerciseId);
  };

  const getRecordedCount = () => {
    return assessmentExercises.filter(exercise => isExerciseRecorded(exercise.id)).length;
  };

  const getTotalCount = () => {
    return assessmentExercises.length;
  };

  if (!isVisible || assessmentExercises.length === 0) return null;

  const recordedCount = getRecordedCount();
  const totalCount = getTotalCount();
  const isDay1 = dayNumber === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-customGray rounded-lg p-4 border-2 mb-4 ${
        isDay1 ? 'border-red-500' : 'border-brightYellow'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Target className={`mr-2 ${isDay1 ? 'text-red-400' : 'text-brightYellow'}`} size={20} />
          <DynamicHeading
            text={`${isDay1 ? 'Day 1' : `Day ${dayNumber}`} Assessment Progress`}
            className="text-lg font-higherJump text-customWhite tracking-wider"
          />
        </div>
        <div className={`text-sm font-titillium px-2 py-1 rounded ${
          recordedCount === totalCount 
            ? 'bg-green-900/30 text-green-400 border border-green-500' 
            : isDay1 
              ? 'bg-red-900/30 text-red-400 border border-red-500'
              : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500'
        }`}>
          {recordedCount}/{totalCount}
        </div>
      </div>

      {isDay1 && recordedCount < totalCount && (
        <div className="mb-3 p-2 bg-red-900/20 rounded border border-red-500/50">
          <p className="text-red-300 text-xs">
            ⚠️ Record all exercises - you'll need these results for Day 30 comparison!
          </p>
        </div>
      )}

      <div className="space-y-2">
        {loading ? (
          <p className="text-logoGray text-sm">Loading assessment progress...</p>
        ) : (
          assessmentExercises.map((exercise) => {
            const isRecorded = isExerciseRecorded(exercise.id);
            return (
              <div key={exercise.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {isRecorded ? (
                    <CheckCircle className="text-green-400 mr-2" size={16} />
                  ) : (
                    <Circle className="text-logoGray mr-2" size={16} />
                  )}
                  <span className={`text-sm font-titillium ${
                    isRecorded ? 'text-customWhite' : 'text-logoGray'
                  }`}>
                    {exercise.name}
                  </span>
                </div>
                {isRecorded && (
                  <span className="text-xs text-green-400">✓ Recorded</span>
                )}
              </div>
            );
          })
        )}
      </div>

      {recordedCount === totalCount && (
        <div className="mt-3 p-2 bg-green-900/30 rounded border border-green-500">
          <p className="text-green-400 text-sm text-center">
            🎉 All assessments recorded! Great job!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AssessmentProgress;