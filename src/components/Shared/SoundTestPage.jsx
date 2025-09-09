import React from 'react';
import useWorkoutAudio from '../../hooks/useWorkoutAudio';
import SoundPicker from './SoundPicker';
import DynamicHeading from './DynamicHeading';

const SoundTestPage = () => {
  const { 
    audioEnabled, 
    toggleAudio, 
    playSound,
    soundTypes,
    selectedSound,
    setSelectedSound 
  } = useWorkoutAudio();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-customGray/30 to-white">
      <div className="bg-customGray p-6 rounded-lg text-center max-w-4xl w-full border-brightYellow border-2">
        <DynamicHeading
          text="Workout Sound Test"
          className="font-higherJump mb-6 text-xl md:text-3xl font-bold text-customWhite text-center leading-loose tracking-widest"
        />
        
        <div className="mb-6">
          <button
            onClick={toggleAudio}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              audioEnabled 
                ? 'bg-limeGreen text-black hover:bg-green-400' 
                : 'bg-gray-600 text-logoGray hover:bg-gray-500'
            }`}
          >
            {audioEnabled ? '🔊 Audio Enabled' : '🔇 Audio Disabled'}
          </button>
        </div>

        <SoundPicker
          soundTypes={soundTypes}
          selectedSound={selectedSound}
          onSoundChange={setSelectedSound}
          onTestSound={playSound}
          audioEnabled={audioEnabled}
          className="mb-6"
        />

        <div className="bg-gray-600 rounded-lg p-4">
          <h3 className="text-lg font-bold text-customWhite mb-3">How to Customize Sounds</h3>
          <div className="text-left text-logoGray text-sm space-y-2">
            <p><strong>To add new sounds:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Open <code className="bg-gray-700 px-1 rounded">frontend/src/hooks/useWorkoutAudio.js</code></li>
              <li>Add a new entry to the <code className="bg-gray-700 px-1 rounded">soundTypes</code> object</li>
              <li>Use the Web Audio API to create your sound in the <code className="bg-gray-700 px-1 rounded">play</code> function</li>
            </ol>
            
            <p className="mt-4"><strong>Sound Parameters you can adjust:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code className="bg-gray-700 px-1 rounded">frequency</code> - Higher = more high-pitched</li>
              <li><code className="bg-gray-700 px-1 rounded">type</code> - 'sine', 'square', 'sawtooth', 'triangle'</li>
              <li><code className="bg-gray-700 px-1 rounded">gain</code> - Volume level (0.0 to 1.0)</li>
              <li><code className="bg-gray-700 px-1 rounded">duration</code> - How long the sound plays</li>
              <li><code className="bg-gray-700 px-1 rounded">envelope</code> - Attack, decay, sustain, release</li>
            </ul>

            <p className="mt-4"><strong>Example frequencies:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Low bass: 60-250 Hz</li>
              <li>Mid-range: 250-2000 Hz</li>
              <li>High treble: 2000-8000 Hz</li>
              <li>Very high: 8000+ Hz</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-logoGray text-sm">
            Selected sound: <span className="text-limeGreen font-bold">{soundTypes[selectedSound]?.name}</span>
          </p>
          <p className="text-logoGray text-xs mt-2">
            This sound will play during the last 3 seconds of work and rest periods in your workouts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoundTestPage;