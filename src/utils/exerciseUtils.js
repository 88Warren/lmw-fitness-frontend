/**
 * Determines the correct toggle button text based on exercise names
 * @param {Object} exercise - The exercise object
 * @param {boolean} isModified - Whether showing the modified version
 * @returns {Object} - Object with standardText and modifiedText
 */
export const getToggleButtonText = (exercise) => {
  if (!exercise?.exercise?.modification) {
    return { standardText: 'Standard', modifiedText: 'Modified' };
  }

  const mainExerciseName = exercise.exercise.name || '';
  const modificationName = exercise.exercise.modification.name || '';



  // Check if the main exercise is the modified version (contains modification indicators)
  const mainIsModified = mainExerciseName.toLowerCase().includes('(on knees)') || 
                        mainExerciseName.toLowerCase().includes('(modified)') ||
                        mainExerciseName.toLowerCase().includes('(floor)');

  // Check if the modification is the modified version
  const modificationIsModified = modificationName.toLowerCase().includes('(on knees)') || 
                                modificationName.toLowerCase().includes('(modified)') ||
                                modificationName.toLowerCase().includes('(floor)');

  // The button labels should indicate what version will be shown when clicked
  // Standard button (showModified = false) shows the main exercise
  // Modified button (showModified = true) shows the modification
  
  if (mainIsModified && !modificationIsModified) {
    // Main exercise is modified, modification is standard
    // So "Standard" button shows modification, "Modified" button shows main
    return {
      standardText: 'Standard',   // Will show modification (standard version)
      modifiedText: 'Modified'    // Will show main exercise (modified version)
    };
  } else if (!mainIsModified && modificationIsModified) {
    // Main exercise is standard, modification is modified
    // So "Standard" button shows main, "Modified" button shows modification
    return {
      standardText: 'Standard',   // Will show main exercise (standard version)
      modifiedText: 'Modified'    // Will show modification (modified version)
    };
  } else {
    // Fallback to generic terms
    return {
      standardText: 'Standard',
      modifiedText: 'Modified'
    };
  }
};

/**
 * Determines if the current exercise being shown is the modified version
 * @param {Object} exercise - The exercise object
 * @param {boolean} showModified - Current toggle state
 * @returns {boolean} - True if currently showing modified version
 */
export const isShowingModifiedVersion = (exercise, showModified) => {
  if (!exercise?.exercise?.modification) {
    return false;
  }

  const mainExerciseName = exercise.exercise.name || '';
  const mainIsModified = mainExerciseName.toLowerCase().includes('(on knees)') || 
                        mainExerciseName.toLowerCase().includes('(modified)') ||
                        mainExerciseName.toLowerCase().includes('(floor)');

  // If main exercise is modified and we're not showing modified toggle, we're showing modified
  // If main exercise is standard and we are showing modified toggle, we're showing modified
  return mainIsModified ? !showModified : showModified;
};