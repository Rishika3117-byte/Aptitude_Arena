import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import GameSelection from "@/react-app/pages/GameSelection";
import Dashboard from "@/react-app/pages/Dashboard";
import GamePlay from "@/react-app/pages/GamePlay";
import LevelMap from "@/react-app/pages/LevelMap";
import { MusicProvider } from "@/react-app/contexts/MusicContext";
import BackgroundMusic from "@/react-app/components/BackgroundMusic";

export default function App() {
  return (
    <MusicProvider>
      <Router>
        <BackgroundMusic />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GameSelection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/levels/:gameId" element={<LevelMap />} />
          <Route path="/game/:gameId/:level?" element={<GamePlay />} />
        </Routes>
      </Router>
    </MusicProvider>
  );
}
