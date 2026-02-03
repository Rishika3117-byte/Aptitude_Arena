import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Lock, Star, CheckCircle } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingParticles from '../components/FloatingParticles';
import MusicToggle from '../components/MusicToggle';
import { isLevelUnlocked, getLevelStatus } from '../utils/gameProgress';

interface LevelData {
  level: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number;
}

export default function LevelMap() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [levels, setLevels] = useState<LevelData[]>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
    
    // Generate 50 levels with actual progress from localStorage
    const generateLevels = async () => {
      const generatedLevels: LevelData[] = [];
      for (let i = 0; i < 50; i++) {
        const level = i + 1;
        const unlocked = await isLevelUnlocked(gameId || 'quantitative', level);
        const status = await getLevelStatus(gameId || 'quantitative', level);
        
        generatedLevels.push({
          level,
          isUnlocked: unlocked,
          isCompleted: status.isCompleted,
          stars: status.stars,
        });
      }
      setLevels(generatedLevels);
    };
    
    generateLevels();
  }, [gameId]);

  const getGameInfo = () => {
    const gameInfo: Record<string, { name: string; color: string; gradient: string }> = {
      quantitative: {
        name: 'Quantitative Aptitude',
        color: 'from-blue-500 to-cyan-500',
        gradient: 'from-blue-900 via-cyan-900 to-slate-900',
      },
      logical: {
        name: 'Logical Reasoning',
        color: 'from-purple-500 to-pink-500',
        gradient: 'from-purple-900 via-pink-900 to-slate-900',
      },
      verbal: {
        name: 'Verbal Reasoning',
        color: 'from-green-500 to-emerald-500',
        gradient: 'from-green-900 via-emerald-900 to-slate-900',
      },
      nonverbal: {
        name: 'Non-Verbal Reasoning',
        color: 'from-orange-500 to-amber-500',
        gradient: 'from-orange-900 via-amber-900 to-slate-900',
      },
      datavis: {
        name: 'Data Visualization',
        color: 'from-indigo-500 to-blue-500',
        gradient: 'from-indigo-900 via-blue-900 to-slate-900',
      },
    };
    
    return gameInfo[gameId || 'quantitative'] || gameInfo.quantitative;
  };

  const handleLevelClick = (level: LevelData) => {
    if (level.isUnlocked) {
      navigate(`/game/${gameId}/${level.level}`);
    }
  };

  const gameInfo = getGameInfo();

  return (
    <div className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${gameInfo.gradient}`}>
      <AnimatedBackground />
      <FloatingParticles count={25} />
      <MusicToggle />

      {/* Back Button */}
      <button
        onClick={() => navigate('/games')}
        className="fixed top-6 left-6 z-50 bg-white/10 backdrop-blur-md px-4 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center gap-2 text-white font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <h1 className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gameInfo.color} mb-4 drop-shadow-2xl`}>
              {gameInfo.name}
            </h1>
            <p className="text-xl text-white/70">Choose a level to begin your challenge</p>
          </div>

          {/* Level Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {levels.map((level, index) => {
              const delay = index * 50;
              
              return (
                <div
                  key={level.level}
                  onClick={() => handleLevelClick(level)}
                  className={`relative group transition-all duration-500 ${
                    level.isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  }`}
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {/* Level Card */}
                  <div className={`relative bg-white/5 backdrop-blur-lg rounded-3xl p-6 border ${
                    level.isUnlocked 
                      ? 'border-white/20 hover:bg-white/10 hover:border-white/30 hover:scale-110 hover:-translate-y-2' 
                      : 'border-white/10'
                  } transition-all duration-500 overflow-hidden`}>
                    
                    {/* Gradient overlay for unlocked levels */}
                    {level.isUnlocked && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${gameInfo.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                    )}

                    {/* Level Number */}
                    <div className="relative text-center">
                      <div className={`text-5xl font-black mb-3 ${
                        level.isUnlocked 
                          ? `text-transparent bg-clip-text bg-gradient-to-r ${gameInfo.color}` 
                          : 'text-white/30'
                      }`}>
                        {level.level}
                      </div>

                      {/* Status Icons */}
                      <div className="flex justify-center items-center gap-1 mb-3">
                        {level.isCompleted ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            {Array.from({ length: level.stars }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </>
                        ) : level.isUnlocked ? (
                          <div className="text-xs text-white/60 font-semibold">Ready</div>
                        ) : (
                          <Lock className="w-5 h-5 text-white/30" />
                        )}
                      </div>

                      {/* Level Label */}
                      <div className={`text-xs font-semibold ${
                        level.isUnlocked ? 'text-white/80' : 'text-white/30'
                      }`}>
                        {level.isCompleted ? 'Completed' : level.isUnlocked ? 'Start' : 'Locked'}
                      </div>
                    </div>

                    {/* Unlock animation glow */}
                    {level.isUnlocked && (
                      <div className={`absolute -inset-1 bg-gradient-to-r ${gameInfo.color} rounded-3xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500 -z-10`}></div>
                    )}

                    {/* Shine effect */}
                    {level.isUnlocked && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                      </div>
                    )}
                  </div>

                  {/* Connection line to next level (visual only) */}
                  {index < levels.length - 1 && index % 5 !== 4 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-white/10"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className={`mt-12 bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-black text-white mb-2">
                  {levels.filter(l => l.isCompleted).length}/{levels.length}
                </div>
                <div className="text-white/60 text-sm">Levels Completed</div>
              </div>
              <div>
                <div className="text-4xl font-black text-yellow-400 mb-2">
                  {levels.reduce((sum, l) => sum + l.stars, 0)}
                </div>
                <div className="text-white/60 text-sm">Total Stars</div>
              </div>
              <div>
                <div className="text-4xl font-black text-cyan-400 mb-2">
                  {Math.round((levels.filter(l => l.isCompleted).length / levels.length) * 100)}%
                </div>
                <div className="text-white/60 text-sm">Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className={`absolute top-20 right-20 w-96 h-96 bg-gradient-to-r ${gameInfo.color} opacity-10 rounded-full blur-3xl animate-float`}></div>
      <div className={`absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-r ${gameInfo.color} opacity-10 rounded-full blur-3xl animate-float-delayed`}></div>
    </div>
  );
}
