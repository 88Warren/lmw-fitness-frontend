import React from 'react';
import PropTypes from 'prop-types';

const SoundPicker = ({ 
  soundTypes, 
  selectedSound, 
  onSoundChange, 
  onTestSound, 
  audioEnabled,
  className = "" 
}) => {
  return (
    <div className={`bg-gray-600 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-bold text-customWhite mb-3">Workout Sound</h3>
      
      {!audioEnabled && (
        <p className="text-logoGray text-sm mb-3">
          Enable audio to test sounds
        </p>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.entries(soundTypes).map(([key, sound]) => (
          <div key={key} className="flex flex-col">
            <button
              onClick={() => onSoundChange(key)}
              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSound === key
                  ? 'bg-limeGreen text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {sound.name}
            </button>
            {audioEnabled && (
              <button
                onClick={() => onTestSound(key)}
                className="mt-1 px-2 py-1 text-xs bg-brightYellow text-black rounded hover:bg-yellow-400 transition-colors"
              >
                Test
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-logoGray">
        <p><strong>Whistle:</strong> Sharp, high-pitched referee whistle</p>
        <p><strong>Beep:</strong> Simple electronic beep</p>
        <p><strong>Chime:</strong> Pleasant musical chord</p>
        <p><strong>Buzz:</strong> Low-frequency buzzer</p>
        <p><strong>Ding:</strong> Bell-like tone</p>
        <p><strong>Air Horn:</strong> Loud, attention-grabbing horn</p>
      </div>
    </div>
  );
};

SoundPicker.propTypes = {
  soundTypes: PropTypes.object.isRequired,
  selectedSound: PropTypes.string.isRequired,
  onSoundChange: PropTypes.func.isRequired,
  onTestSound: PropTypes.func.isRequired,
  audioEnabled: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default SoundPicker;