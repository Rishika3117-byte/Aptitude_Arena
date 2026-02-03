import { Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router';
import ProgressBar from './ProgressBar';

interface Game {
  id: string;
  name: string;
  progress: number;
  completed: number;
  total: number;
  color: string;
  score: number;
}

interface GameProgressCardProps {
  game: Game;
  delay?: number;
}

export default function GameProgressCard({ game, delay = 0 }: GameProgressCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => navigate(`/game/${game.id}`)}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold text-white group-hover:translate-x-1 transition-transform duration-300">
            {game.name}
          </h4>
          <div className={`flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${game.color} rounded-full`}>
            <Star className="w-4 h-4 text-white fill-white" />
            <span className="text-white font-semibold text-sm">{game.score}</span>
          </div>
        </div>

        {/* Progress Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-white/70 mb-2">
            <span>Levels Completed</span>
            <span className="font-semibold">{game.completed} / {game.total}</span>
          </div>
          <ProgressBar progress={game.progress} color={game.color} />
        </div>

        {/* Action Button */}
        <button className={`w-full py-3 px-4 bg-gradient-to-r ${game.color} rounded-xl text-white font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg transition-all duration-300 relative overflow-hidden`}>
          <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          <span>Continue Playing</span>
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      </div>
    </div>
  );
}
