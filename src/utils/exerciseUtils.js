export const getToggleButtonText = (exercise) => {
  if (!exercise?.exercise?.modification) {
    return { standardText: 'Standard', modifiedText: 'Modified' };
  }

  const mainExerciseName = exercise.exercise.name || '';
  const modificationName = exercise.exercise.modification.name || '';

  const mainIsModified = mainExerciseName.toLowerCase().includes('(on knees)') || 
                        mainExerciseName.toLowerCase().includes('(modified)') ||
                        mainExerciseName.toLowerCase().includes('(floor)');

  const modificationIsModified = modificationName.toLowerCase().includes('(on knees)') || 
                                modificationName.toLowerCase().includes('(modified)') ||
                                modificationName.toLowerCase().includes('(floor)');

  if (mainIsModified && !modificationIsModified) {
    return {
      standardText: 'Standard', 
      modifiedText: 'Modified'  
    };
  } else if (!mainIsModified && modificationIsModified) {
    return {
      standardText: 'Standard',
      modifiedText: 'Modified' 
    };
  } else {
    return {
      standardText: 'Standard',
      modifiedText: 'Modified'
    };
  }
};

export const isShowingModifiedVersion = (exercise, showModified) => {
  if (!exercise?.exercise?.modification) {
    return false;
  }

  const mainExerciseName = exercise.exercise.name || '';
  const mainIsModified = mainExerciseName.toLowerCase().includes('(on knees)') || 
                        mainExerciseName.toLowerCase().includes('(modified)') ||
                        mainExerciseName.toLowerCase().includes('(floor)');

  return mainIsModified ? !showModified : showModified;
};