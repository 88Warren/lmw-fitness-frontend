import { useState, useEffect } from 'react';

const useWorkoutAssessment = (workoutDay, programName) => {
  const [isAssessmentDay, setIsAssessmentDay] = useState(false);
  const [assessmentExercises, setAssessmentExercises] = useState([]);

  useEffect(() => {
    if (!workoutDay || !programName) return;

    // Check if this is an assessment day (Day 1 or Day 30)
    const isAssessment = (workoutDay.dayNumber === 1 || workoutDay.dayNumber === 30) &&
                        workoutDay.workoutBlocks?.some(block => 
                          block.blockType?.toLowerCase().includes('fitness assessment') ||
                          block.blockType?.toLowerCase().includes('assessment')
                        );

    setIsAssessmentDay(isAssessment);

    if (isAssessment) {
      // Extract exercises from assessment blocks
      const exercises = [];
      workoutDay.workoutBlocks?.forEach(block => {
        if (block.blockType?.toLowerCase().includes('fitness assessment') ||
            block.blockType?.toLowerCase().includes('assessment')) {
          block.exercises?.forEach(workoutExercise => {
            if (workoutExercise.exercise) {
              exercises.push({
                id: workoutExercise.exercise.id,
                name: workoutExercise.exercise.name,
                order: workoutExercise.order,
                workoutExerciseId: workoutExercise.id
              });
            }
          });
        }
      });
      
      // Sort by order
      exercises.sort((a, b) => a.order - b.order);
      setAssessmentExercises(exercises);
    } else {
      setAssessmentExercises([]);
    }
  }, [workoutDay, programName]);

  const getExerciseByOrder = (order) => {
    return assessmentExercises.find(ex => ex.order === order);
  };

  const getExerciseById = (exerciseId) => {
    return assessmentExercises.find(ex => ex.id === exerciseId);
  };

  return {
    isAssessmentDay,
    assessmentExercises,
    getExerciseByOrder,
    getExerciseById
  };
};

export default useWorkoutAssessment;