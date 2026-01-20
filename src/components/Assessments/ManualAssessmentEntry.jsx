import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { showToast } from '../../utils/toastUtil';
import AssessmentInput from './AssessmentInput';
import DynamicHeading from '../Shared/DynamicHeading';

const ManualAssessmentEntry = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showAssessmentInput, setShowAssessmentInput] = useState(false);

  // Assessment exercises for both programs (Day 1 and Day 30)
  const assessmentExercises = [
    { id: 1, name: 'Press Ups' },
    { id: 2, name: 'Squat Jumps' },
    { id: 3, name: 'Plank Hold' },
    { id: 4, name: 'Burpees' },
    { id: 5, name: 'Explosive Starjumps' },
    { id: 6, name: 'Sit Ups' },
    { id: 7, name: 'Jump Lunge' },
    { id: 8, name: 'Tricep Dips (with Chair)' }
  ];

  // Additional exercises for advanced program
  const advancedExercises = [
    { id: 9, name: 'Straddle Sit Ups' },
    { id: 10, name: 'Thrusters' }
  ];

  const getExercisesForProgram = (program) => {
    if (program === 'advanced-program') {
      return [...assessmentExercises.slice(0, 1), // Press Ups
              ...advancedExercises.slice(0, 1), // Straddle Sit Ups
              ...assessmentExercises.slice(2, 5), // Plank Hold, Squat Jumps, Burpees
              ...assessmentExercises.slice(6, 7), // Jump Lunge
              ...assessmentExercises.slice(4, 5), // Explosive Starjumps
              ...advancedExercises.slice(1, 2)]; // Thrusters
    }
    return assessmentExercises;
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setShowAssessmentInput(true);
  };

  const handleSaveAssessment = () => {
    setShowAssessmentInput(false);
    setSelectedExercise(null);
    showToast('success', 'Assessment saved! You can view it in your assessment history.');
  };

  const resetForm = () => {
    setSelectedProgram('');
    setSelectedDay('');
    setSelectedExercise(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <DynamicHeading
          text="Manual Assessment Entry"
          className="text-lg font-higherJump text-customWhite tracking-wider"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-brightYellow text-customGray rounded font-titillium hover:bg-yellow-400 transition-colors"
        >
          <Plus size={16} />
          <span>Add Assessment</span>
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-800 rounded-lg p-4 border border-logoGray"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-customWhite font-titillium mb-2">
                Select Program
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => {
                  setSelectedProgram(e.target.value);
                  setSelectedDay(''); // Reset day when program changes
                }}
                className="w-full px-3 py-2 bg-gray-700 border border-logoGray rounded text-customWhite font-titillium focus:border-brightYellow focus:outline-none"
              >
                <option value="">Choose a program...</option>
                <option value="beginner-program">30-Day Beginner Programme</option>
                <option value="advanced-program">30-Day Advanced Programme</option>
              </select>
            </div>

            {selectedProgram && (
              <div>
                <label className="block text-customWhite font-titillium mb-2">
                  Select Assessment Day
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-logoGray rounded text-customWhite font-titillium focus:border-brightYellow focus:outline-none"
                >
                  <option value="">Choose a day...</option>
                  <option value="1">Day 1 - Initial Assessment</option>
                  <option value="30">Day 30 - Final Assessment</option>
                </select>
              </div>
            )}

            {selectedProgram && selectedDay && (
              <div>
                <label className="block text-customWhite font-titillium mb-2">
                  Select Exercise
                </label>
                <div className="grid gap-2">
                  {getExercisesForProgram(selectedProgram).map((exercise) => (
                    <button
                      key={exercise.id}
                      onClick={() => handleExerciseSelect(exercise)}
                      className="text-left px-3 py-2 bg-gray-700 border border-logoGray rounded text-customWhite font-titillium hover:border-brightYellow hover:bg-gray-600 transition-colors"
                    >
                      {exercise.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2 bg-gray-600 text-customWhite rounded font-titillium hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="bg-gray-800 rounded-lg p-4 border border-logoGray">
        <h4 className="text-customWhite font-titillium mb-2">About Manual Entry</h4>
        <div className="text-sm text-logoGray font-titillium space-y-2">
          <p>
            Use this feature if you&apos;ve already started a program and want to record your Day 1 results retroactively.
          </p>
          <p>
            <strong className="text-customWhite">Assessment Exercises:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Beginner Program:</strong> Press Ups, Squat Jumps, Plank Hold, Burpees, Explosive Starjumps, Sit Ups, Jump Lunge, Tricep Dips</li>
            <li><strong>Advanced Program:</strong> Press Ups, Straddle Sit Ups, Plank Hold, Squat Jumps, Burpees, Jump Lunge, Explosive Starjumps, Thrusters</li>
          </ul>
          <p>
            Each exercise is performed for 1 minute (except Plank Hold which is max time), with 2 minutes rest between exercises.
          </p>
        </div>
      </div>

      {/* Assessment Input Modal */}
      {selectedExercise && (
        <AssessmentInput
          exercise={selectedExercise}
          programName={selectedProgram}
          dayNumber={parseInt(selectedDay)}
          isOpen={showAssessmentInput}
          onClose={() => {
            setShowAssessmentInput(false);
            setSelectedExercise(null);
          }}
          onSave={handleSaveAssessment}
        />
      )}
    </div>
  );
};

export default ManualAssessmentEntry;