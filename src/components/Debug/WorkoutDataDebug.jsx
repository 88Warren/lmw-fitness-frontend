import React, { useState } from 'react';
import PropTypes from 'prop-types';

const WorkoutDataDebug = ({ workoutData }) => {
  const [showDebug, setShowDebug] = useState(false);

  if (!workoutData) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700"
      >
        Debug Data
      </button>
      
      {showDebug && (
        <div className="absolute bottom-12 right-0 bg-black text-white p-4 rounded-lg max-w-2xl max-h-96 overflow-auto text-xs">
          <h3 className="text-lg font-bold mb-2">Workout Data Debug</h3>
          <div className="space-y-2">
            <p><strong>Title:</strong> {workoutData.title}</p>
            <p><strong>Description:</strong> {workoutData.description}</p>
            <p><strong>Total Blocks:</strong> {workoutData.workoutBlocks?.length || 0}</p>
            
            <div className="mt-4">
              <h4 className="font-bold">Blocks:</h4>
              {workoutData.workoutBlocks?.map((block, index) => (
                <div key={index} className="ml-2 mt-2 p-2 bg-gray-800 rounded">
                  <p><strong>Block {index}:</strong> {block.blockType}</p>
                  <p><strong>Notes:</strong> {block.blockNotes || 'None'}</p>
                  <p><strong>Exercises:</strong> {block.exercises?.length || 0}</p>
                  <p><strong>Rounds:</strong> {block.blockRounds || 1}</p>
                  {block.exercises?.length > 0 && (
                    <div className="ml-2 mt-1">
                      <p><strong>Exercise Names:</strong></p>
                      {block.exercises.map((ex, i) => (
                        <p key={i} className="ml-2">- {ex.exercise?.name || 'Unknown'}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

WorkoutDataDebug.propTypes = {
  workoutData: PropTypes.object,
};

export default WorkoutDataDebug;