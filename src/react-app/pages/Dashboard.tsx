import { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Target, TrendingUp, Award, Calendar, Flame } from 'lucide-react';
import { useNavigate } from 'react-router';
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingParticles from '../components/FloatingParticles';
import AnimatedCounter from '../components/AnimatedCounter';
import StreakFlame from '../components/StreakFlame';
import GameProgressCard from '../components/GameProgressCard';
import MusicToggle from '../components/MusicToggle';
import { getUserStats, getGameProgressForDashboard, UserStats } from '../utils/gameProgress';

interface GameProgressItem {
  id: string;
  name: string;
  progress: number;
  completed: number;
  total: number;
  color: string;
  score: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [gameProgress, setGameProgress] = useState<GameProgressItem[]>([]);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
    
    // Load data asynchronously
    const loadData = async () => {
      const stats = await getUserStats();
      const progress = await getGameProgressForDashboard();
      setUserStats(stats);
      setGameProgress(progress);
    };
    loadData();
  }, []);

  if (!userStats) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  // Get actual user data from localStorage
  const userData = {
    name: 'Player',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Player',
    totalScore: userStats.totalScore,
    rank: '#-',
    accuracy: userStats.accuracy,
    gamesPlayed: userStats.gamesPlayed,
    currentStreak: userStats.currentStreak,
    bestStreak: userStats.bestStreak,
  };
  
  // Calculate total achievements (1 per completed level)
  const totalAchievements = gameProgress.reduce((sum, game) => sum + game.completed, 0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <AnimatedBackground />
      <FloatingParticles count={20} />
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
      <div className="relative z-10 px-4 py-20 max-w-7xl mx-auto">
        
        {/* Profile Section */}
        <div className={`mb-12 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 group-hover:border-white/40 transition-all duration-300 group-hover:scale-110">
                  <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-bold text-white mb-2">{userData.name}</h2>
                <p className="text-white/60 text-lg mb-4">Global Rank: <span className="text-cyan-400 font-semibold">{userData.rank}</span></p>
                
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <Trophy className="w-6 h-6 text-yellow-400 mb-2 mx-auto md:mx-0" />
                    <div className="text-2xl font-bold text-white"><AnimatedCounter value={userData.totalScore} duration={2000} /></div>
                    <div className="text-sm text-white/60">Total Score</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <Target className="w-6 h-6 text-green-400 mb-2 mx-auto md:mx-0" />
                    <div className="text-2xl font-bold text-white"><AnimatedCounter value={userData.accuracy} duration={2000} />%</div>
                    <div className="text-sm text-white/60">Accuracy</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <TrendingUp className="w-6 h-6 text-purple-400 mb-2 mx-auto md:mx-0" />
                    <div className="text-2xl font-bold text-white"><AnimatedCounter value={userData.gamesPlayed} duration={2000} /></div>
                    <div className="text-sm text-white/60">Games Played</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <Award className="w-6 h-6 text-pink-400 mb-2 mx-auto md:mx-0" />
                    <div className="text-2xl font-bold text-white"><AnimatedCounter value={totalAchievements} duration={2000} /></div>
                    <div className="text-sm text-white/60">Achievements</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Streak Section */}
        <div className={`mb-12 transition-all duration-1000 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 opacity-50"></div>
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Current Streak */}
              <div className="flex items-center gap-6">
                <StreakFlame count={userData.currentStreak} />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-2xl font-bold text-white">Current Streak</h3>
                  </div>
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    <AnimatedCounter value={userData.currentStreak} duration={1500} /> Days
                  </p>
                  <p className="text-white/60 mt-2">Keep it going! 🎯</p>
                </div>
              </div>

              {/* Best Streak */}
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-lg font-semibold text-white">Best Streak</h4>
                </div>
                <p className="text-4xl font-bold text-yellow-400">
                  <AnimatedCounter value={userData.bestStreak} duration={1500} /> Days
                </p>
                <p className="text-white/60 text-sm mt-1">Your personal record</p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Progress Section */}
        <div className={`transition-all duration-1000 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            Game Progress
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {gameProgress.map((game, index) => (
              <GameProgressCard key={game.id} game={game} delay={index * 100} />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float-delayed"></div>
    </div>
  );
}
