import { useEffect } from 'react';
import { useMusic } from '../contexts/MusicContext';

export default function BackgroundMusic() {
  const { isMusicPlaying } = useMusic();

  useEffect(() => {
    // Create a simple ambient music tone using Web Audio API
    if (typeof window === 'undefined') return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.15; // Low volume for background
    masterGain.connect(audioContext.destination);

    let oscillators: OscillatorNode[] = [];

    const playAmbientMusic = () => {
      // Create a soothing ambient chord progression
      const notes = [
        [261.63, 329.63, 392.00], // C major
        [293.66, 369.99, 440.00], // D minor
        [329.63, 392.00, 493.88], // E minor
        [349.23, 440.00, 523.25], // F major
      ];

      let noteIndex = 0;
      
      const playChord = () => {
        // Stop previous oscillators
        oscillators.forEach(osc => {
          try {
            osc.stop();
          } catch (e) {
            // Ignore if already stopped
          }
        });
        oscillators = [];

        if (!isMusicPlaying) return;

        const chord = notes[noteIndex % notes.length];
        
        chord.forEach((freq) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.type = 'sine';
          osc.frequency.value = freq;
          
          gain.gain.value = 0;
          gain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.5);
          gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 3.5);
          
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.start(audioContext.currentTime);
          osc.stop(audioContext.currentTime + 4);
          
          oscillators.push(osc);
        });
        
        noteIndex++;
        setTimeout(playChord, 4000);
      };

      if (isMusicPlaying) {
        playChord();
      }
    };

    playAmbientMusic();

    return () => {
      oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Ignore if already stopped
        }
      });
      audioContext.close();
    };
  }, [isMusicPlaying]);

  return null;
}
