'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './styles.module.css';

interface Note {
  key: string;
  frequency: number;
  isSharp: boolean;
  label: string;
}

const NOTES: Note[] = [
  { key: 'C', frequency: 261.63, isSharp: false, label: 'C' },
  { key: 'C#', frequency: 277.18, isSharp: true, label: 'C#' },
  { key: 'D', frequency: 293.66, isSharp: false, label: 'D' },
  { key: 'D#', frequency: 311.13, isSharp: true, label: 'D#' },
  { key: 'E', frequency: 329.63, isSharp: false, label: 'E' },
  { key: 'F', frequency: 349.23, isSharp: false, label: 'F' },
  { key: 'F#', frequency: 369.99, isSharp: true, label: 'F#' },
  { key: 'G', frequency: 392.00, isSharp: false, label: 'G' },
  { key: 'G#', frequency: 415.30, isSharp: true, label: 'G#' },
  { key: 'A', frequency: 440.00, isSharp: false, label: 'A' },
  { key: 'A#', frequency: 466.16, isSharp: true, label: 'A#' },
  { key: 'B', frequency: 493.88, isSharp: false, label: 'B' },
  { key: 'C2', frequency: 523.25, isSharp: false, label: 'C' },
  { key: 'C#2', frequency: 554.37, isSharp: true, label: 'C#' },
  { key: 'D2', frequency: 587.33, isSharp: false, label: 'D' },
  { key: 'D#2', frequency: 622.25, isSharp: true, label: 'D#' },
  { key: 'E2', frequency: 659.25, isSharp: false, label: 'E' },
  { key: 'F2', frequency: 698.46, isSharp: false, label: 'F' },
  { key: 'F#2', frequency: 739.99, isSharp: true, label: 'F#' },
  { key: 'G2', frequency: 783.99, isSharp: false, label: 'G' },
  { key: 'G#2', frequency: 830.61, isSharp: true, label: 'G#' },
  { key: 'A2', frequency: 880.00, isSharp: false, label: 'A' },
  { key: 'A#2', frequency: 932.33, isSharp: true, label: 'A#' },
  { key: 'B2', frequency: 987.77, isSharp: false, label: 'B' },
  { key: 'C3', frequency: 1046.50, isSharp: false, label: 'C' },
];

// Keyboard mapping for piano keys
const KEYBOARD_MAPPING: { [key: string]: string } = {
  'a': 'C',
  'w': 'C#',
  's': 'D',
  'e': 'D#',
  'd': 'E',
  'f': 'F',
  't': 'F#',
  'g': 'G',
  'y': 'G#',
  'h': 'A',
  'u': 'A#',
  'j': 'B',
  'k': 'C2',
  'l': 'C#2',
  'z': 'D2',
  'x': 'D#2',
  'c': 'E2',
  'v': 'F2',
  'b': 'F#2',
  'n': 'G2',
  'm': 'G#2',
  ',': 'A2',
  '.': 'A#2',
  '/': 'B2',
  ';': 'C3',
};

// Für Elise melody data (simplified version)
const FUR_ELISE_MELODY = [
  // Main theme
  { note: 'E', duration: 400, octave: 4 },
  { note: 'D#', duration: 400, octave: 4 },
  { note: 'E', duration: 400, octave: 4 },
  { note: 'D#', duration: 400, octave: 4 },
  { note: 'E', duration: 400, octave: 4 },
  { note: 'B', duration: 400, octave: 3 },
  { note: 'D', duration: 400, octave: 4 },
  { note: 'C', duration: 400, octave: 4 },
  { note: 'A', duration: 800, octave: 3 },
  
  // Second part
  { note: 'C', duration: 400, octave: 3 },
  { note: 'E', duration: 400, octave: 3 },
  { note: 'A', duration: 400, octave: 3 },
  { note: 'B', duration: 800, octave: 3 },
  
  { note: 'E', duration: 400, octave: 3 },
  { note: 'G#', duration: 400, octave: 3 },
  { note: 'B', duration: 400, octave: 3 },
  { note: 'C2', duration: 800, octave: 4 },
  
  // Return to theme
  { note: 'E', duration: 400, octave: 4 },
  { note: 'D#', duration: 400, octave: 4 },
  { note: 'E', duration: 400, octave: 4 },
  { note: 'D#', duration: 400, octave: 4 },
  { note: 'E', duration: 400, octave: 4 },
  { note: 'B', duration: 400, octave: 3 },
  { note: 'D', duration: 400, octave: 4 },
  { note: 'C', duration: 400, octave: 4 },
  { note: 'A', duration: 800, octave: 3 },
];

export default function DigitalPiano() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [octave, setOctave] = useState(4);
  const [waveform, setWaveform] = useState<'sine' | 'square' | 'sawtooth' | 'triangle'>('sine');
  const [volume, setVolume] = useState(0.5);
  const [sustain, setSustain] = useState(0.5);
  const [reverb, setReverb] = useState(0.3);
  const [filterCutoff, setFilterCutoff] = useState(2000);
  const [filterResonance, setFilterResonance] = useState(0);
  const [attack, setAttack] = useState(0.01);
  const [decay, setDecay] = useState(0.1);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [pianoPosition, setPianoPosition] = useState({ x: 0, y: 0 });
  const [waveformPosition, setWaveformPosition] = useState({ x: 0, y: 0 });
  const [isDraggingPiano, setIsDraggingPiano] = useState(false);
  const [isDraggingWaveform, setIsDraggingWaveform] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const autoplayRef = useRef<NodeJS.Timeout[]>([]);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const reverbGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create analyser node for waveform visualization
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    
    // Create filter node
    filterRef.current = audioContextRef.current.createBiquadFilter();
    filterRef.current.type = 'lowpass';
    filterRef.current.frequency.setValueAtTime(filterCutoff, audioContextRef.current.currentTime);
    filterRef.current.Q.setValueAtTime(filterResonance, audioContextRef.current.currentTime);
    
    // Create reverb (simple impulse response)
    reverbRef.current = audioContextRef.current.createConvolver();
    reverbGainRef.current = audioContextRef.current.createGain();
    createReverbImpulse();
    
    // Connect audio chain: analyser -> filter -> reverb -> reverbGain -> destination
    analyserRef.current.connect(filterRef.current);
    filterRef.current.connect(reverbRef.current);
    reverbRef.current.connect(reverbGainRef.current);
    reverbGainRef.current.connect(audioContextRef.current.destination);
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Clear autoplay timeouts
      autoplayRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Create reverb impulse response
  const createReverbImpulse = () => {
    if (!audioContextRef.current || !reverbRef.current) return;
    
    const sampleRate = audioContextRef.current.sampleRate;
    const length = sampleRate * 2; // 2 seconds
    const impulse = audioContextRef.current.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    
    reverbRef.current.buffer = impulse;
  };

  // Update filter settings
  useEffect(() => {
    if (filterRef.current && audioContextRef.current) {
      filterRef.current.frequency.setValueAtTime(filterCutoff, audioContextRef.current.currentTime);
      filterRef.current.Q.setValueAtTime(filterResonance, audioContextRef.current.currentTime);
    }
  }, [filterCutoff, filterResonance]);

  // Update reverb mix
  useEffect(() => {
    if (reverbGainRef.current) {
      reverbGainRef.current.gain.setValueAtTime(reverb, audioContextRef.current?.currentTime || 0);
    }
  }, [reverb]);

  // Waveform visualization
  const updateWaveform = useCallback(() => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Convert to normalized values (0-1)
      const normalizedData = Array.from(dataArray).map(value => value / 255);
      setWaveformData(normalizedData);
      
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    }
  }, []);

  useEffect(() => {
    if (analyserRef.current) {
      updateWaveform();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateWaveform]);

  // Drag event handlers
  const handleMouseDown = (event: React.MouseEvent, type: 'piano' | 'waveform') => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    
    if (type === 'piano') {
      setIsDraggingPiano(true);
    } else {
      setIsDraggingWaveform(true);
    }
  };

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isDraggingPiano) {
      setPianoPosition({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y
      });
    } else if (isDraggingWaveform) {
      setWaveformPosition({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y
      });
    }
  }, [isDraggingPiano, isDraggingWaveform, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingPiano(false);
    setIsDraggingWaveform(false);
  }, []);

  // Autoplay Für Elise
  const playFurElise = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    let currentTime = 0;
    
    FUR_ELISE_MELODY.forEach((melodyNote, index) => {
      const timeout = setTimeout(() => {
        const note = NOTES.find(n => n.key === melodyNote.note);
        if (note) {
          // Temporarily change octave for this note
          const originalOctave = octave;
          setOctave(melodyNote.octave);
          
          // Play the note
          playNote(note);
          
          // Reset octave after a short delay
          setTimeout(() => {
            setOctave(originalOctave);
          }, 100);
        }
      }, currentTime);
      
      autoplayRef.current.push(timeout);
      currentTime += melodyNote.duration;
    });
    
    // Stop autoplay after the last note
    const stopTimeout = setTimeout(() => {
      setIsPlaying(false);
      // Clear all active keys
      setActiveKeys(new Set());
    }, currentTime);
    
    autoplayRef.current.push(stopTimeout);
  };

  const stopAutoplay = () => {
    // Clear all timeouts
    autoplayRef.current.forEach(timeout => clearTimeout(timeout));
    autoplayRef.current = [];
    
    // Stop all active notes
    setActiveKeys(new Set());
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isDraggingPiano || isDraggingWaveform) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingPiano, isDraggingWaveform, handleMouseMove, handleMouseUp]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const noteKey = KEYBOARD_MAPPING[key];
      
      if (noteKey && !event.repeat) {
        const note = NOTES.find(n => n.key === noteKey);
        if (note && !activeKeys.has(note.key)) {
          playNote(note);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const noteKey = KEYBOARD_MAPPING[key];
      
      if (noteKey) {
        const note = NOTES.find(n => n.key === noteKey);
        if (note) {
          stopNote(note);
        }
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeKeys]); // Include activeKeys in dependency array

  const playNote = (note: Note) => {
    if (!audioContextRef.current) return;

    const frequency = note.frequency * Math.pow(2, octave - 4);
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    
    // Apply envelope: Attack -> Decay -> Sustain -> Release
    const now = audioContextRef.current.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attack);
    gainNode.gain.linearRampToValueAtTime(volume * 0.7, now + attack + decay);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + decay + sustain);
    
    oscillator.connect(gainNode);
    gainNode.connect(analyserRef.current!);
    
    oscillator.start();
    oscillator.stop(now + attack + decay + sustain);
    
    oscillatorsRef.current.set(note.key, oscillator);
    gainNodesRef.current.set(note.key, gainNode);
    
    setActiveKeys(prev => new Set([...prev, note.key]));
  };

  const stopNote = (note: Note) => {
    const oscillator = oscillatorsRef.current.get(note.key);
    const gainNode = gainNodesRef.current.get(note.key);
    
    if (gainNode) {
      gainNode.gain.cancelScheduledValues(audioContextRef.current!.currentTime);
      gainNode.gain.setValueAtTime(gainNode.gain.value, audioContextRef.current!.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current!.currentTime + 0.1);
    }
    
    if (oscillator) {
      setTimeout(() => {
        oscillator.stop();
      }, 100);
    }
    
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(note.key);
      return newSet;
    });
  };

  const handleKeyDown = (note: Note) => {
    if (!activeKeys.has(note.key)) {
      playNote(note);
    }
  };

  const handleKeyUp = (note: Note) => {
    stopNote(note);
  };

  const handlePianoKeyDown = (note: Note) => {
    handleKeyDown(note);
  };

  const handlePianoKeyUp = (note: Note) => {
    handleKeyUp(note);
  };

  const handlePianoKeyLeave = (note: Note) => {
    if (activeKeys.has(note.key)) {
      handleKeyUp(note);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Waveform:</label>
            <select 
              value={waveform} 
              onChange={(e) => setWaveform(e.target.value as any)}
              className={styles.select}
            >
              <option value="sine">Sine</option>
              <option value="square">Square</option>
              <option value="sawtooth">Sawtooth</option>
              <option value="triangle">Triangle</option>
            </select>
          </div>
          
          <div className={styles.controlGroup}>
            <label className={styles.label}>Octave:</label>
            <select 
              value={octave} 
              onChange={(e) => setOctave(Number(e.target.value))}
              className={styles.select}
            >
              {[2, 3, 4, 5, 6].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.controlGroup}>
            <label className={styles.label}>Volume:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
          
          <div className={styles.controlGroup}>
            <label className={styles.label}>Sustain:</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={sustain}
              onChange={(e) => setSustain(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
          
          <div className={styles.controlGroup}>
            <button
              onClick={isPlaying ? stopAutoplay : playFurElise}
              className={styles.autoplayButton}
              disabled={isPlaying}
            >
              {isPlaying ? 'Stop Für Elise' : 'Play Für Elise'}
            </button>
          </div>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Attack:</label>
            <input
              type="range"
              min="0.001"
              max="0.5"
              step="0.001"
              value={attack}
              onChange={(e) => setAttack(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
          
          <div className={styles.controlGroup}>
            <label className={styles.label}>Decay:</label>
            <input
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={decay}
              onChange={(e) => setDecay(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
          
          <div className={styles.controlGroup}>
            <label className={styles.label}>Reverb:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={reverb}
              onChange={(e) => setReverb(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
          
          <div className={styles.controlGroup}>
            <label className={styles.label}>Filter Cutoff:</label>
            <input
              type="range"
              min="200"
              max="8000"
              step="50"
              value={filterCutoff}
              onChange={(e) => setFilterCutoff(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
          
          <div className={styles.controlGroup}>
            <label className={styles.label}>Filter Resonance:</label>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={filterResonance}
              onChange={(e) => setFilterResonance(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>
      </div>

      <div 
        className={styles.pianoContainer}
        style={{
          position: 'absolute',
          left: pianoPosition.x,
          top: pianoPosition.y,
          cursor: isDraggingPiano ? 'grabbing' : 'grab'
        }}
      >
        <div className={styles.piano}>
          <div 
            className={styles.windowHeader}
            onMouseDown={(e) => handleMouseDown(e, 'piano')}
          >
            <div className={styles.windowControls}>
              <div className={styles.controlButton}></div>
              <div className={styles.controlButton}></div>
              <div className={styles.controlButton}></div>
            </div>
            <div className={styles.windowTitle}>Mac Piano</div>
          </div>
          <div className={styles.pianoKeys}>
            {NOTES.map((note, index) => (
              <div
                key={note.key}
                className={`${styles.key} ${note.isSharp ? styles.sharp : styles.white} ${
                  activeKeys.has(note.key) ? styles.active : ''
                }`}
                onMouseDown={() => handlePianoKeyDown(note)}
                onMouseUp={() => handlePianoKeyUp(note)}
                onMouseLeave={() => handlePianoKeyLeave(note)}
                style={{ zIndex: note.isSharp ? 2 : 1 }}
              >
                <span className={styles.noteLabel}>{note.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div 
        className={styles.visualizationContainer}
        style={{
          position: 'absolute',
          left: waveformPosition.x,
          top: waveformPosition.y,
          cursor: isDraggingWaveform ? 'grabbing' : 'grab'
        }}
      >
        <div className={styles.macWindow}>
          <div 
            className={styles.windowHeader}
            onMouseDown={(e) => handleMouseDown(e, 'waveform')}
          >
            <div className={styles.windowControls}>
              <div className={styles.controlButton}></div>
              <div className={styles.controlButton}></div>
              <div className={styles.controlButton}></div>
            </div>
            <div className={styles.windowTitle}>Waveform</div>
          </div>
          <div className={styles.windowContent}>
            <div className={styles.waveformContainer}>
              {waveformData.length > 0 ? (
                <svg className={styles.waveform} viewBox="0 0 400 100" preserveAspectRatio="none">
                  {waveformData.map((value, index) => {
                    const x = (index / waveformData.length) * 400;
                    const height = value * 80;
                    return (
                      <rect
                        key={index}
                        x={x}
                        y={50 - height / 2}
                        width={400 / waveformData.length}
                        height={height}
                        fill="#00ff00"
                        opacity={1}
                      />
                    );
                  })}
                </svg>
              ) : (
                <div className={styles.noAudio}>No audio detected</div>
              )}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
