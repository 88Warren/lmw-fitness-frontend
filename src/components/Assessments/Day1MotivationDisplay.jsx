import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import assessmentApi from '../../utils/assessmentApi';

const Day1MotivationDisplay = ({ 
  exercise, 
  programName, 
  dayNumber,
  isVisible = false 
}) => {
  const [day1Assessment, setDay1Assessment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Only show for Day 30 assessment exercises
  const shouldShow = isVisible && dayNumber === 30 && exercise?.id;

  useEffect(() => {
    if (shouldShow) {
      loadDay1Assessment();
    }
  }, [shouldShow, exercise?.id, programName]);

  const loadDay1Assessment = async () => {
    setLoading(true);
    const result = await assessmentApi.getDay1Assessment(programName, exercise.id);
    if (result.success) {
      setDay1Assessment(result.data);
    } else {
      setDay1Assessment(null);
    }
    setLoading(false);
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

  if (!shouldShow) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-brightYellow/20 rounded-lg p-3 border border-brightYellow/50 mb-3"
    >
      <div className="text-center">
        {loading ? (
          <div className="text-logoGray text-sm font-titillium">Loading...</div>
        ) : day1Assessment ? (
          <div className="text-brightYellow font-titillium text-lg font-bold">
            Day 1: {formatDay1Performance()}
          </div>
        ) : (
          <div className="text-orange-400 text-sm font-titillium">Day 1: No data</div>
        )}
      </div>
      
      {day1Assessment ? (
        <div className="mt-1 text-center">
          <p className="text-logoGray text-xs font-titillium">
            Push yourself to beat your Day 1 performance!
          </p>
        </div>
      ) : (
        <div className="mt-1 text-center">
          <p className="text-orange-300 text-xs font-titillium">
            Add Day 1 assessment in your profile to see comparison
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Day1MotivationDisplay;