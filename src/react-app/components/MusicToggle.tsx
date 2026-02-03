import { Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';

export default function MusicToggle() {
  const { isMusicPlaying, setIsMusicPlaying } = useMusic();

  return (
    <button
      onClick={() => setIsMusicPlaying(!isMusicPlaying)}
      className="fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
    >
      {isMusicPlaying ? (
        <Volume2 className="w-5 h-5 text-white" />
      ) : (
        <VolumeX className="w-5 h-5 text-white" />
      )}
    </button>
  );
}
