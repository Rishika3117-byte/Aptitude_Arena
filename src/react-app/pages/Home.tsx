import { useEffect, useState } from 'react';
import { Brain, Trophy, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingParticles from '../components/FloatingParticles';
import StatCard from '../components/StatCard';
import MusicToggle from '../components/MusicToggle';

export default function HomePage() {
  const navigate = useNavigate();
  const [showTitle, setShowTitle] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowTitle(true), 300);
    setTimeout(() => setShowContent(true), 800);
  }, []);

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Players', color: 'from-blue-500 to-cyan-500' },
    { icon: Brain, value: '50+', label: 'Unique Levels', color: 'from-purple-500 to-pink-500' },
    { icon: Trophy, value: '100+', label: 'Achievements', color: 'from-yellow-500 to-orange-500' },
    { icon: Zap, value: '95%', label: 'Success Rate', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AnimatedBackground />
      <FloatingParticles count={30} />
      <MusicToggle />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        
        {/* Animated Title */}
        <div className={`text-center mb-8 transition-all duration-1000 ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="relative inline-block">
            <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-4 animate-pulse-glow drop-shadow-2xl">
              APTITUDE ARENA
            </h1>
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-lg blur-2xl opacity-30 animate-pulse"></div>
          </div>
          <p className="text-xl md:text-2xl text-white/80 font-light mt-4 animate-fade-in">
            Master Your Mind, Level Up Your Skills
          </p>
        </div>

        {/* Start Button */}
        <div className={`mb-16 transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <button
            onClick={() => navigate('/games')}
            className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white text-2xl font-bold overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 animate-bounce-subtle"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Zap className="w-8 h-8 animate-pulse" />
              Start Playing
              <Zap className="w-8 h-8 animate-pulse" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
              <div className="absolute inset-0 bg-white/20 animate-ripple rounded-2xl"></div>
            </div>
          </button>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl w-full transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              color={stat.color}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Feature Pills */}
        <div className={`mt-16 flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {['Daily Challenges', 'Streak Rewards', 'Global Leaderboard', 'Unlimited Practice'].map((feature, index) => (
            <div
              key={index}
              className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer animate-float"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-500/20 rounded-full blur-3xl animate-float"></div>
    </div>
  );
}
