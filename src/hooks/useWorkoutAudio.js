import { useState, useEffect, useRef } from 'react';

const useWorkoutAudio = () => {
  const [audioEnabled, setAudioEnabled] = useState(() => {
    const saved = localStorage.getItem('workoutAudioEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    if (audioEnabled && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = 0.3; 
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }
  }, [audioEnabled]);

  useEffect(() => {
    localStorage.setItem('workoutAudioEnabled', JSON.stringify(audioEnabled));
  }, [audioEnabled]);

  const playBeep = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator.connect(envelope);
      envelope.connect(gainNodeRef.current);
      
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      oscillator.type = 'square';
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.2, audioContextRef.current.currentTime + 0.01);
      envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.1);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    } catch (error) {
      console.warn('Error playing beep:', error);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
  };

  return {
    audioEnabled,
    toggleAudio,
    playBeep
  };
};

export default useWorkoutAudio;