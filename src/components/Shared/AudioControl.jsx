import React, { useState } from "react";
import PropTypes from "prop-types";
import "./AudioControl.css";

const AudioControl = ({ audioEnabled, onToggle, volume, onVolumeChange, startSound, onStartSoundChange, className = "", playStartSound, playBeep }) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const soundOptions = [
    { value: 'whistle', label: '🎵 Whistle', description: 'Classic whistle sound' },
    { value: 'gong', label: '🔔 Gong', description: 'Deep resonant gong' },
    { value: 'bell', label: '🔔 Bell', description: 'Clear bell chime' },
    { value: 'airhorn', label: '📯 Airhorn', description: 'Loud sports airhorn' },
    { value: 'chime', label: '🎼 Chime', description: 'Pleasant musical chime' },
    { value: 'boxingbell', label: '🥊 Boxing Bell', description: 'Sharp boxing gym bell' },
    { value: 'startinggun', label: '🔫 Starting Gun', description: 'Track & field starter' },
    { value: 'buzzer', label: '🚨 Buzzer', description: 'Game show buzzer' },
    { value: 'siren', label: '🚨 Siren', description: 'Rising and falling siren' },
    { value: 'dingdong', label: '🔔 Ding Dong', description: 'Doorbell chime' },
    { value: 'trumpet', label: '🎺 Trumpet', description: 'Fanfare trumpet blast' },
    { value: 'laserzap', label: '⚡ Laser Zap', description: 'Sci-fi laser sound' }
  ];

  const getVolumeIcon = () => {
    if (!audioEnabled) return "🔇";
    if (volume === 0) return "🔇";
    if (volume < 0.3) return "🔈";
    if (volume < 0.7) return "🔉";
    return "🔊";
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
    >
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          audioEnabled
            ? "bg-limeGreen text-black hover:bg-green-400"
            : "bg-gray-600 text-logoGray hover:bg-gray-500"
        }`}
        title={
          audioEnabled ? "Disable workout sounds" : "Enable workout sounds"
        }
      >
        <span className="text-lg">{getVolumeIcon()}</span>
      </button>
      
      {/* Audio Controls - appears on hover with improved UX */}
      {showVolumeSlider && audioEnabled && (
        <>
          {/* Invisible bridge to prevent slider from disappearing */}
          <div className="absolute top-full left-0 w-full h-2 z-40"></div>
          <div 
            className="absolute top-full left-0 mt-2 bg-customGray border border-brightYellow rounded-lg p-3 shadow-lg z-50 min-w-[250px] animate-fade-in"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
          <div className="space-y-3">
            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <span className="text-customWhite text-sm font-medium">Volume</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer volume-slider"
                  style={{
                    background: `linear-gradient(to right, #FFFF00 0%, #FFFF00 ${volume * 100}%, #4B5563 ${volume * 100}%, #4B5563 100%)`
                  }}
                />
              </div>
              <span className="text-customWhite text-sm min-w-[35px]">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Start Sound Selector */}
            <div className="border-t border-gray-600 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-customWhite text-sm font-medium">Start Sound</span>
                <button
                  onClick={() => playStartSound && playStartSound()}
                  className="text-xs bg-brightYellow text-black px-2 py-1 rounded hover:bg-yellow-400 transition-colors"
                  title="Preview start sound"
                >
                  Preview
                </button>
              </div>
              <select
                value={startSound}
                onChange={(e) => onStartSoundChange && onStartSoundChange(e.target.value)}
                className="w-full bg-gray-700 text-customWhite text-sm rounded px-2 py-1 border border-gray-600 focus:border-brightYellow focus:outline-none"
              >
                {soundOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                {soundOptions.find(opt => opt.value === startSound)?.description}
              </p>
            </div>

            {/* Countdown Beep Preview */}
            <div className="border-t border-gray-600 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-customWhite text-sm font-medium">Countdown Beep</span>
                <button
                  onClick={() => playBeep && playBeep()}
                  className="text-xs bg-brightYellow text-black px-2 py-1 rounded hover:bg-yellow-400 transition-colors"
                  title="Preview countdown beep"
                >
                  Preview
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Plays every second for the last 5 seconds of exercise and rest periods
              </p>
            </div>
          </div>
            {/* Small arrow pointing up */}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-customGray border-l border-t border-brightYellow transform rotate-45"></div>
          </div>
        </>
      )}

    </div>
  );
};

AudioControl.propTypes = {
  audioEnabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
  startSound: PropTypes.string.isRequired,
  onStartSoundChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  playStartSound: PropTypes.func,
  playBeep: PropTypes.func,
};

export default AudioControl;
