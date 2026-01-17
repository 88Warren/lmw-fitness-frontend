import { useState, useEffect, useRef } from 'react';

const useWorkoutAudio = () => {
  const [audioEnabled, setAudioEnabled] = useState(() => {
    const saved = localStorage.getItem('workoutAudioEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('workoutAudioVolume');
    // Convert old volume scale to new scale (old 2.0 = new 1.0)
    const savedVolume = saved !== null ? parseFloat(saved) : 1.0;
    return savedVolume > 2 ? savedVolume / 2 : savedVolume; // Handle migration from old scale
  });

  const [startSound, setStartSound] = useState(() => {
    const saved = localStorage.getItem('workoutStartSound');
    return saved || 'whistle';
  });

  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    if (audioEnabled && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = volume; 
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }
  }, [audioEnabled, volume]);

  // Update gain node volume when volume changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('workoutAudioEnabled', JSON.stringify(audioEnabled));
  }, [audioEnabled]);

  useEffect(() => {
    localStorage.setItem('workoutAudioVolume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('workoutStartSound', startSound);
  }, [startSound]);

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
      
      oscillator.frequency.setValueAtTime(1000, audioContextRef.current.currentTime); // Higher frequency for more prominence
      oscillator.type = 'triangle'; // Triangle wave is less harsh than square but more prominent than sine
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.5, audioContextRef.current.currentTime + 0.01); // Increased from 0.2 to 0.5
      envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.15); // Slightly longer beep
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.15); // Match the envelope duration
    } catch (error) {
      console.warn('Error playing beep:', error);
    }
  };

  const playGong = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create a gong-like sound with multiple harmonics
      const fundamental = audioContextRef.current.createOscillator();
      const harmonic1 = audioContextRef.current.createOscillator();
      const harmonic2 = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      fundamental.connect(envelope);
      harmonic1.connect(envelope);
      harmonic2.connect(envelope);
      envelope.connect(gainNodeRef.current);
      
      // Fundamental frequency (low gong tone)
      fundamental.frequency.setValueAtTime(200, audioContextRef.current.currentTime);
      fundamental.frequency.exponentialRampToValueAtTime(150, audioContextRef.current.currentTime + 1.5);
      fundamental.type = 'sine';
      
      // Harmonics for richness
      harmonic1.frequency.setValueAtTime(400, audioContextRef.current.currentTime);
      harmonic1.frequency.exponentialRampToValueAtTime(300, audioContextRef.current.currentTime + 1.5);
      harmonic1.type = 'sine';
      
      harmonic2.frequency.setValueAtTime(600, audioContextRef.current.currentTime);
      harmonic2.frequency.exponentialRampToValueAtTime(450, audioContextRef.current.currentTime + 1.5);
      harmonic2.type = 'triangle';
      
      // Gong-like envelope (quick attack, long decay)
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.6, audioContextRef.current.currentTime + 0.02);
      envelope.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 1.5);
      
      fundamental.start(audioContextRef.current.currentTime);
      fundamental.stop(audioContextRef.current.currentTime + 1.5);
      harmonic1.start(audioContextRef.current.currentTime);
      harmonic1.stop(audioContextRef.current.currentTime + 1.5);
      harmonic2.start(audioContextRef.current.currentTime);
      harmonic2.stop(audioContextRef.current.currentTime + 1.5);
    } catch (error) {
      console.warn('Error playing gong:', error);
    }
  };

  const playAirhorn = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create an airhorn-like sound
      const oscillator = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator.connect(envelope);
      envelope.connect(gainNodeRef.current);
      
      // Airhorn frequency sweep
      oscillator.frequency.setValueAtTime(300, audioContextRef.current.currentTime);
      oscillator.frequency.linearRampToValueAtTime(250, audioContextRef.current.currentTime + 0.8);
      oscillator.type = 'sawtooth';
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.5, audioContextRef.current.currentTime + 0.05);
      envelope.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.7);
      envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.8);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.8);
    } catch (error) {
      console.warn('Error playing airhorn:', error);
    }
  };

  const playBell = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create a bell-like sound with multiple harmonics
      const fundamental = audioContextRef.current.createOscillator();
      const harmonic1 = audioContextRef.current.createOscillator();
      const harmonic2 = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      fundamental.connect(envelope);
      harmonic1.connect(envelope);
      harmonic2.connect(envelope);
      envelope.connect(gainNodeRef.current);
      
      // Bell harmonics
      fundamental.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      fundamental.type = 'sine';
      
      harmonic1.frequency.setValueAtTime(1200, audioContextRef.current.currentTime);
      harmonic1.type = 'sine';
      
      harmonic2.frequency.setValueAtTime(1600, audioContextRef.current.currentTime);
      harmonic2.type = 'triangle';
      
      // Bell envelope (sharp attack, medium decay)
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.5, audioContextRef.current.currentTime + 0.01);
      envelope.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 1.0);
      
      fundamental.start(audioContextRef.current.currentTime);
      fundamental.stop(audioContextRef.current.currentTime + 1.0);
      harmonic1.start(audioContextRef.current.currentTime);
      harmonic1.stop(audioContextRef.current.currentTime + 1.0);
      harmonic2.start(audioContextRef.current.currentTime);
      harmonic2.stop(audioContextRef.current.currentTime + 1.0);
    } catch (error) {
      console.warn('Error playing bell:', error);
    }
  };

  const playWhistle = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create a whistle sound with two tones
      const oscillator1 = audioContextRef.current.createOscillator();
      const oscillator2 = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator1.connect(envelope);
      oscillator2.connect(envelope);
      envelope.connect(gainNodeRef.current);
      
      // First tone - higher pitch
      oscillator1.frequency.setValueAtTime(1500, audioContextRef.current.currentTime);
      oscillator1.frequency.linearRampToValueAtTime(1800, audioContextRef.current.currentTime + 0.2);
      oscillator1.type = 'sine';
      
      // Second tone - creates harmony
      oscillator2.frequency.setValueAtTime(1200, audioContextRef.current.currentTime);
      oscillator2.frequency.linearRampToValueAtTime(1400, audioContextRef.current.currentTime + 0.2);
      oscillator2.type = 'sine';
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.05);
      envelope.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.15);
      envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.4);
      
      oscillator1.start(audioContextRef.current.currentTime);
      oscillator1.stop(audioContextRef.current.currentTime + 0.4);
      oscillator2.start(audioContextRef.current.currentTime);
      oscillator2.stop(audioContextRef.current.currentTime + 0.4);
    } catch (error) {
      console.warn('Error playing whistle:', error);
    }
  };

  const playChime = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create a pleasant chime sound
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major chord)
      const oscillators = [];
      const envelope = audioContextRef.current.createGain();
      
      envelope.connect(gainNodeRef.current);
      
      notes.forEach((freq, index) => {
        const osc = audioContextRef.current.createOscillator();
        osc.connect(envelope);
        osc.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
        osc.type = 'sine';
        
        osc.start(audioContextRef.current.currentTime + index * 0.1);
        osc.stop(audioContextRef.current.currentTime + 0.8 + index * 0.1);
        oscillators.push(osc);
      });
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.05);
      envelope.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 1.0);
    } catch (error) {
      console.warn('Error playing chime:', error);
    }
  };

  const playBoxingBell = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create a boxing bell sound - sharp, metallic
      const oscillator = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator.connect(envelope);
      envelope.connect(gainNodeRef.current);
      
      oscillator.frequency.setValueAtTime(1200, audioContextRef.current.currentTime);
      oscillator.type = 'triangle';
      
      // Sharp attack, quick decay like a boxing bell
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.7, audioContextRef.current.currentTime + 0.01);
      envelope.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.3);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.3);
    } catch (error) {
      console.warn('Error playing boxing bell:', error);
    }
  };

  const playStartingGun = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create a starting gun sound - sharp crack
      const oscillator = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator.connect(envelope);
      envelope.connect(gainNodeRef.current);
      
      // High frequency noise-like sound
      oscillator.frequency.setValueAtTime(2000, audioContextRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContextRef.current.currentTime + 0.1);
      oscillator.type = 'sawtooth';
      
      // Very sharp attack, quick decay
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.8, audioContextRef.current.currentTime + 0.005);
      envelope.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.15);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.15);
    } catch (error) {
      console.warn('Error playing starting gun:', error);
    }
  };

  const playBuzzer = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create a game show buzzer sound
      const oscillator = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator.connect(envelope);
      envelope.connect(gainNodeRef.current);
      
      oscillator.frequency.setValueAtTime(150, audioContextRef.current.currentTime);
      oscillator.type = 'square';
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.02);
      envelope.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.4);
      envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.5);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.5);
    } catch (error) {
      console.warn('Error playing buzzer:', error);
    }
  };

  const playSiren = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create a siren sound - rising and falling
      const oscillator = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator.connect(envelope);
      envelope.connect(gainNodeRef.current);
      
      // Siren frequency sweep
      oscillator.frequency.setValueAtTime(400, audioContextRef.current.currentTime);
      oscillator.frequency.linearRampToValueAtTime(800, audioContextRef.current.currentTime + 0.3);
      oscillator.frequency.linearRampToValueAtTime(400, audioContextRef.current.currentTime + 0.6);
      oscillator.type = 'triangle';
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.05);
      envelope.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.55);
      envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.6);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.6);
    } catch (error) {
      console.warn('Error playing siren:', error);
    }
  };

  const playDingDong = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create a ding-dong doorbell sound
      const oscillator1 = audioContextRef.current.createOscillator();
      const oscillator2 = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator1.connect(envelope);
      oscillator2.connect(envelope);
      envelope.connect(gainNodeRef.current);
      
      // First "ding" - higher pitch
      oscillator1.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      oscillator1.type = 'sine';
      
      // Second "dong" - lower pitch, delayed
      oscillator2.frequency.setValueAtTime(600, audioContextRef.current.currentTime + 0.3);
      oscillator2.type = 'sine';
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.02);
      envelope.gain.exponentialRampToValueAtTime(0.1, audioContextRef.current.currentTime + 0.25);
      envelope.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.32);
      envelope.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.8);
      
      oscillator1.start(audioContextRef.current.currentTime);
      oscillator1.stop(audioContextRef.current.currentTime + 0.3);
      oscillator2.start(audioContextRef.current.currentTime + 0.3);
      oscillator2.stop(audioContextRef.current.currentTime + 0.8);
    } catch (error) {
      console.warn('Error playing ding dong:', error);
    }
  };

  const playTrumpet = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create a trumpet fanfare sound
      const oscillator1 = audioContextRef.current.createOscillator();
      const oscillator2 = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator1.connect(envelope);
      oscillator2.connect(envelope);
      envelope.connect(gainNodeRef.current);
      
      // Trumpet-like harmonics
      oscillator1.frequency.setValueAtTime(440, audioContextRef.current.currentTime); // A4
      oscillator1.frequency.linearRampToValueAtTime(523, audioContextRef.current.currentTime + 0.2); // C5
      oscillator1.type = 'sawtooth';
      
      oscillator2.frequency.setValueAtTime(880, audioContextRef.current.currentTime); // A5
      oscillator2.frequency.linearRampToValueAtTime(1047, audioContextRef.current.currentTime + 0.2); // C6
      oscillator2.type = 'triangle';
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.05);
      envelope.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.15);
      envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.6);
      
      oscillator1.start(audioContextRef.current.currentTime);
      oscillator1.stop(audioContextRef.current.currentTime + 0.6);
      oscillator2.start(audioContextRef.current.currentTime);
      oscillator2.stop(audioContextRef.current.currentTime + 0.6);
    } catch (error) {
      console.warn('Error playing trumpet:', error);
    }
  };

  const playLaserZap = () => {
    if (!audioEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Create a sci-fi laser zap sound
      const oscillator = audioContextRef.current.createOscillator();
      const envelope = audioContextRef.current.createGain();
      
      oscillator.connect(envelope);
      envelope.connect(gainNodeRef.current);
      
      // Laser frequency sweep - high to low
      oscillator.frequency.setValueAtTime(1500, audioContextRef.current.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContextRef.current.currentTime + 0.3);
      oscillator.type = 'square';
      
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      envelope.gain.linearRampToValueAtTime(0.5, audioContextRef.current.currentTime + 0.01);
      envelope.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.3);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.3);
    } catch (error) {
      console.warn('Error playing laser zap:', error);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
  };

  const setVolumeLevel = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume)); // Back to 0-1 range, but with the new louder baseline
    setVolume(clampedVolume);
  };

  const setStartSoundType = (soundType) => {
    setStartSound(soundType);
  };

  const playStartSound = () => {
    if (!audioEnabled) return;
    
    switch (startSound) {
      case 'gong':
        playGong();
        break;
      case 'airhorn':
        playAirhorn();
        break;
      case 'bell':
        playBell();
        break;
      case 'chime':
        playChime();
        break;
      case 'boxingbell':
        playBoxingBell();
        break;
      case 'startinggun':
        playStartingGun();
        break;
      case 'buzzer':
        playBuzzer();
        break;
      case 'siren':
        playSiren();
        break;
      case 'dingdong':
        playDingDong();
        break;
      case 'trumpet':
        playTrumpet();
        break;
      case 'laserzap':
        playLaserZap();
        break;
      case 'whistle':
      default:
        playWhistle();
        break;
    }
  };

  return {
    audioEnabled,
    volume,
    startSound,
    toggleAudio,
    setVolumeLevel,
    setStartSoundType,
    playBeep,
    playStartSound,
    // Individual sound functions for testing
    playWhistle,
    playGong,
    playAirhorn,
    playBell,
    playChime,
    playBoxingBell,
    playStartingGun,
    playBuzzer,
    playSiren,
    playDingDong,
    playTrumpet,
    playLaserZap
  };
};

export default useWorkoutAudio;