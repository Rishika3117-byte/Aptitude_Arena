import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sparkles } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  topics: string[];
}

interface GameCardProps {
  game: Game;
  delay?: number;
}

export default function GameCard({ game, delay = 0 }: GameCardProps) {
  const navigate = useNavigate();
  const Icon = game.icon;

  const handleClick = () => {
    navigate(`/levels/${game.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Card Container */}
      <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:-translate-y-2 overflow-hidden">
        
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
        
        {/* Floating Icon Background */}
        <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${game.iconBg} rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-500 group-hover:scale-150`}></div>

        {/* Icon */}
        <div className={`relative w-16 h-16 bg-gradient-to-br ${game.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
          {game.title}
        </h3>

        {/* Description */}
        <p className="text-white/70 mb-6 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
          {game.description}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-6">
          {game.topics.map((topic, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 font-medium border border-white/10 group-hover:bg-white/20 group-hover:border-white/20 transition-all duration-300"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Play Button */}
        <button className={`relative w-full py-3 px-6 bg-gradient-to-r ${game.iconBg} rounded-xl text-white font-semibold flex items-center justify-center gap-2 overflow-hidden group-hover:shadow-xl transition-all duration-300`}>
          <Sparkles className="w-5 h-5 group-hover:animate-spin" />
          <span>Start Game</span>
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        </div>

        {/* Glow Effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${game.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 -z-10`}></div>
      </div>
    </div>
  );
}
