import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { showToast } from '../../utils/toastUtil';
import AssessmentInput from './AssessmentInput';

const ManualAssessmentEntry = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showAssessmentInput, setShowAssessmentInput] = useState(false);

  const assessmentExercises = [
    { id: 1, name: 'Press Ups' },
    { id: 2, name: 'Squat Jumps' },
    { id: 3, name: 'Plank Hold' },
    { id: 4, name: 'Burpees' },
    { id: 5, name: 'Explosive Starjumps' },
    { id: 6, name: 'Sit Ups' },
    { id: 7, name: 'Jump Lunge' },
    { id: 8, name: 'Tricep Dips (with Chair)' },
  ];

  const advancedExercises = [
    { id: 9, name: 'Straddle Sit Ups' },
    { id: 10, name: 'Thrusters' },
  ];

  const getExercisesForProgram = (program) => {
    if (program === 'advanced-program') {
      return [
        ...assessmentExercises.slice(0, 1),
        ...advancedExercises.slice(0, 1),
        ...assessmentExercises.slice(2, 5),
        ...assessmentExercises.slice(6, 7),
        ...assessmentExercises.slice(4, 5),
        ...advancedExercises.slice(1, 2),
      ];
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

  const selectClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-customGray font-titillium text-sm focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-brightYellow transition-colors duration-200";
  const labelClass = "block text-sm font-titillium font-semibold text-customGray mb-2";

  return (
    <div className="space-y-5">
      {/* Add button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-customGray font-titillium">Add a result</p>
          <p className="text-xs text-customGray/50 font-titillium">Record a result you forgot to log during a workout</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brightYellow text-black text-sm font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200 shrink-0"
        >
          <Plus size={15} />
          Add Entry
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4"
        >
          {/* Programme select */}
          <div>
            <label className={labelClass}>Programme</label>
            <select
              value={selectedProgram}
              onChange={(e) => { setSelectedProgram(e.target.value); setSelectedDay(''); }}
              className={selectClass}
            >
              <option value="">Choose a programme...</option>
              <option value="beginner-program">30-Day Beginner Programme</option>
              <option value="advanced-program">30-Day Advanced Programme</option>
            </select>
          </div>

          {/* Day select */}
          {selectedProgram && (
            <div>
              <label className={labelClass}>Assessment Day</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className={selectClass}
              >
                <option value="">Choose a day...</option>
                <option value="1">Day 1 — Initial Assessment</option>
                <option value="30">Day 30 — Final Assessment</option>
              </select>
            </div>
          )}

          {/* Exercise list */}
          {selectedProgram && selectedDay && (
            <div>
              <label className={labelClass}>Select Exercise</label>
              <div className="space-y-2">
                {getExercisesForProgram(selectedProgram).map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleExerciseSelect(exercise)}
                    className="w-full text-left px-4 py-3 bg-gray-50 rounded-xl border border-transparent hover:border-brightYellow hover:bg-yellow-50 text-sm font-titillium text-customGray transition-all duration-200"
                  >
                    {exercise.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cancel */}
          <button
            onClick={resetForm}
            className="w-full py-2.5 bg-gray-50 text-customGray/60 text-sm font-titillium font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
          >
            Cancel
          </button>
        </motion.div>
      )}

      {/* About card */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-3">
        <p className="text-xs font-titillium font-bold text-customGray uppercase tracking-wide">About Manual Entry</p>
        <p className="text-sm text-customGray/60 font-titillium leading-relaxed">
          Use this if you've already started a programme and want to record your Day 1 results retroactively.
        </p>
        <div className="space-y-2">
          <p className="text-xs font-titillium font-semibold text-customGray">Assessment Exercises</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              <p className="text-xs font-titillium font-bold text-customGray mb-1.5">🌱 Beginner</p>
              <p className="text-xs text-customGray/60 font-titillium leading-relaxed">
                Press Ups, Squat Jumps, Plank Hold, Burpees, Explosive Starjumps, Sit Ups, Jump Lunge, Tricep Dips
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              <p className="text-xs font-titillium font-bold text-customGray mb-1.5">⚡ Advanced</p>
              <p className="text-xs text-customGray/60 font-titillium leading-relaxed">
                Press Ups, Straddle Sit Ups, Plank Hold, Squat Jumps, Burpees, Jump Lunge, Explosive Starjumps, Thrusters
              </p>
            </div>
          </div>
          <p className="text-xs text-customGray/50 font-titillium">
            Each exercise is 1 minute (Plank Hold is max time), with 2 minutes rest between exercises.
          </p>
        </div>
      </div>

      {/* Assessment input modal */}
      {selectedExercise && (
        <AssessmentInput
          exercise={selectedExercise}
          programName={selectedProgram}
          dayNumber={parseInt(selectedDay)}
          isOpen={showAssessmentInput}
          onClose={() => { setShowAssessmentInput(false); setSelectedExercise(null); }}
          onSave={handleSaveAssessment}
        />
      )}
    </div>
  );
};

export default ManualAssessmentEntry;
