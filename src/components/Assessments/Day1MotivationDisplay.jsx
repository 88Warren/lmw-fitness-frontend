import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import assessmentApi from '../../utils/assessmentApi';

const Day1MotivationDisplay = ({
  exercise,
  programName,
  dayNumber,
  isVisible = false,
}) => {
  const [day1Assessment, setDay1Assessment] = useState(null);
  const [loading, setLoading] = useState(false);

  const shouldShow = isVisible && dayNumber === 30 && exercise?.id;

  useEffect(() => {
    if (shouldShow) loadDay1Assessment();
  }, [shouldShow, exercise?.id, programName]);

  const loadDay1Assessment = async () => {
    setLoading(true);
    const result = await assessmentApi.getDay1Assessment(programName, exercise.id);
    setDay1Assessment(result.success ? result.data : null);
    setLoading(false);
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

  if (!shouldShow) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-yellow-50 rounded-xl px-4 py-3 border border-brightYellow/40 mb-3"
    >
      {loading ? (
        <p className="text-xs text-customGray/40 font-titillium text-center">Loading Day 1 data...</p>
      ) : day1Assessment ? (
        <div className="text-center">
          <p className="text-xs text-customGray/50 font-titillium mb-0.5">Day 1 to beat</p>
          <p className="text-lg font-bold text-brightYellow font-titillium">{formatDay1Performance()}</p>
          <p className="text-xs text-customGray/40 font-titillium mt-1">
            Push yourself to beat your Day 1 performance!
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xs text-customGray/50 font-titillium">Day 1: No data recorded</p>
          <p className="text-xs text-customGray/40 font-titillium mt-0.5">
            Add Day 1 results in your profile to see a comparison
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Day1MotivationDisplay;
