import { useState, useEffect, useRef } from 'react';

const useWorkoutAudio = () => {
  const [audioEnabled, setAudioEnabled] = useState(() => {
    // Get audio preference from localStorage, default to true
    const saved = localStorage.getItem('workoutAudioEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (audioEnabled && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = 0.3; // Set volume to 30%
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }
  }, [audioEnabled]);

  // Save audio preference to localStorage
  useEffect(() => {
    localStorage.setItem('workoutAudioEnabled', JSON.stringify(audioEnabled));
  }, [audioEnabled]);

  // Sound definitions - you can customize these!
  const soundTypes = {
    whistle: {
      name: 'Whistle',
      play: (audioContext, gainNode) => {
        const oscillator = audioContext.createOscillator();
        const envelope = audioContext.createGain();
        
        oscillator.connect(envelope);
        envelope.connect(gainNode);
        
        // High frequency whistle
        oscillator.frequency.setValueAtTime(2000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(3000, audioContext.currentTime + 0.1);
        
        envelope.gain.setValueAtTime(0, audioContext.currentTime);
        envelope.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        envelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
      }
    },
    beep: {
      name: 'Beep',
      play: (audioContext, gainNode) => {
        const oscillator = audioContext.createOscillator();
        const envelope = audioContext.createGain();
        
        oscillator.connect(envelope);
        envelope.connect(gainNode);
        
        // Simple beep
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'square';
        
        envelope.gain.setValueAtTime(0, audioContext.currentTime);
        envelope.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
        envelope.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }
    },
    chime: {
      name: 'Chime',
      play: (audioContext, gainNode) => {
        // Create multiple oscillators for a chord
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        
        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const envelope = audioContext.createGain();
          
          oscillator.connect(envelope);
          envelope.connect(gainNode);
          
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = 'sine';
          
          envelope.gain.setValueAtTime(0, audioContext.currentTime);
          envelope.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
          envelope.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
          
          oscillator.start(audioContext.currentTime + index * 0.05);
          oscillator.stop(audioContext.currentTime + 0.8);
        });
      }
    },
    buzz: {
      name: 'Buzz',
      play: (audioContext, gainNode) => {
        const oscillator = audioContext.createOscillator();
        const envelope = audioContext.createGain();
        
        oscillator.connect(envelope);
        envelope.connect(gainNode);
        
        // Low frequency buzz
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.type = 'sawtooth';
        
        envelope.gain.setValueAtTime(0, audioContext.currentTime);
        envelope.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        envelope.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    },
    ding: {
      name: 'Ding',
      play: (audioContext, gainNode) => {
        const oscillator = audioContext.createOscillator();
        const envelope = audioContext.createGain();
        
        oscillator.connect(envelope);
        envelope.connect(gainNode);
        
        // Bell-like sound
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
        oscillator.type = 'sine';
        
        envelope.gain.setValueAtTime(0, audioContext.currentTime);
        envelope.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.01);
        envelope.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    },
    airhorn: {
      name: 'Air Horn',
      play: (audioContext, gainNode) => {
        const oscillator = audioContext.createOscillator();
        const envelope = audioContext.createGain();
        
        oscillator.connect(envelope);
        envelope.connect(gainNode);
        
        // Aggressive air horn sound
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(250, audioContext.currentTime + 0.3);
        oscillator.type = 'sawtooth';
        
        envelope.gain.setValueAtTime(0, audioContext.currentTime);
        envelope.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.02);
        envelope.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.25);
        envelope.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    }
  };

  const [selectedSound, setSelectedSound] = useState(() => {
    const saved = localStorage.getItem('workoutSoundType');
    return saved || 'whistle';
  });

  // Save sound preference
  useEffect(() => {
    localStorage.setItem('workoutSoundType', selectedSound);
  }, [selectedSound]);

  const playSound = (soundType = selectedSound) => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      // Resume audio context if it's suspended
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const sound = soundTypes[soundType];
      if (sound) {
        sound.play(audioContextRef.current, gainNodeRef.current);
      }
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  };

  const playWhistle = () => playSound();

  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
  };

  return {
    audioEnabled,
    toggleAudio,
    playWhistle,
    playSound,
    soundTypes,
    selectedSound,
    setSelectedSound
  };
};

export default useWorkoutAudio;