import { createContext, useContext, useState, ReactNode } from 'react';

interface MusicContextType {
  isMusicPlaying: boolean;
  setIsMusicPlaying: (playing: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  return (
    <MusicContext.Provider value={{ isMusicPlaying, setIsMusicPlaying }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
