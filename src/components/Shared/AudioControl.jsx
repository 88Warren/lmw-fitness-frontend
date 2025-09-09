import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SoundPicker from './SoundPicker';

const AudioControl = ({ 
  audioEnabled, 
  onToggle, 
  soundTypes,
  selectedSound,
  onSoundChange,
  onTestSound,
  className = "" 
}) => {
  const [showSoundPicker, setShowSoundPicker] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggle}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            audioEnabled 
              ? 'bg-limeGreen text-black hover:bg-green-400' 
              : 'bg-gray-600 text-logoGray hover:bg-gray-500'
          }`}
          title={audioEnabled ? 'Disable workout sounds' : 'Enable workout sounds'}
        >
          <span className="text-lg">
            {audioEnabled ? '🔊' : '🔇'}
          </span>
          <span className="text-sm font-medium">
            {audioEnabled ? 'Sound On' : 'Sound Off'}
          </span>
        </button>
        
        {soundTypes && (
          <button
            onClick={() => setShowSoundPicker(!showSoundPicker)}
            className="px-2 py-2 bg-gray-600 text-logoGray rounded-lg hover:bg-gray-500 transition-colors"
            title="Change sound type"
          >
            ⚙️
          </button>
        )}
      </div>
      
      {showSoundPicker && soundTypes && (
        <div className="absolute top-full left-0 mt-2 z-10 min-w-80">
          <SoundPicker
            soundTypes={soundTypes}
            selectedSound={selectedSound}
            onSoundChange={onSoundChange}
            onTestSound={onTestSound}
            audioEnabled={audioEnabled}
          />
        </div>
      )}
    </div>
  );
};

AudioControl.propTypes = {
  audioEnabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  soundTypes: PropTypes.object,
  selectedSound: PropTypes.string,
  onSoundChange: PropTypes.func,
  onTestSound: PropTypes.func,
  className: PropTypes.string,
};

export default AudioControl;