import { useEffect, useState } from 'react';
import { ArrowLeft, Calculator, Brain, MessageSquare, Box, BarChart3, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import GameCard from '../components/GameCard';
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingParticles from '../components/FloatingParticles';
import MusicToggle from '../components/MusicToggle';

export default function GameSelection() {
  const navigate = useNavigate();
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowCards(true), 300);
  }, []);

  const games = [
    {
      id: 'quantitative',
      title: 'Quantitative Aptitude',
      description: 'Master numbers, percentages, ratios & more',
      icon: Calculator,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      iconBg: 'from-blue-600 to-cyan-600',
      topics: ['Percentages', 'Ratios', 'Time & Work', 'Profit & Loss'],
    },
    {
      id: 'logical',
      title: 'Logical Reasoning',
      description: 'Sharpen your logical thinking & pattern recognition',
      icon: Brain,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      iconBg: 'from-purple-600 to-pink-600',
      topics: ['Series', 'Seating', 'Statements', 'Puzzles'],
    },
    {
      id: 'verbal',
      title: 'Verbal Reasoning',
      description: 'Enhance comprehension & analytical skills',
      icon: MessageSquare,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      iconBg: 'from-green-600 to-emerald-600',
      topics: ['Blood Relations', 'Direction', 'Calendar', 'Time'],
    },
    {
      id: 'nonverbal',
      title: 'Non-Verbal Reasoning',
      description: 'Visualize patterns, shapes & spatial thinking',
      icon: Box,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      iconBg: 'from-orange-600 to-amber-600',
      topics: ['Mirror Images', 'Patterns', 'Cubes', 'Dice'],
    },
    {
      id: 'datavis',
      title: 'Data Visualization',
      description: 'Analyze charts, graphs & interpret data',
      icon: BarChart3,
      gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
      iconBg: 'from-indigo-600 to-blue-600',
      topics: ['Bar Graphs', 'Pie Charts', 'Histograms', 'Polygons'],
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <AnimatedBackground />
      <FloatingParticles count={25} />
      <MusicToggle />

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 bg-white/10 backdrop-blur-md px-4 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center gap-2 text-white font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Dashboard Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-md px-4 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center gap-2 text-white font-medium"
      >
        <User className="w-5 h-5" />
        Dashboard
      </button>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-20 max-w-7xl mx-auto">
        
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4 animate-fade-in">
            Choose Your Challenge
          </h1>
          <p className="text-xl text-white/70 font-light animate-fade-in">
            Select a game category and start your journey to mastery
          </p>
        </div>

        {/* Game Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {games.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              delay={index * 150}
            />
          ))}
        </div>

        {/* Bottom Stats */}
        <div className={`mt-20 flex flex-wrap justify-center gap-8 transition-all duration-1000 delay-500 ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">1000+</div>
            <div className="text-white/60 font-medium">Questions</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">50+</div>
            <div className="text-white/60 font-medium">Levels</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">5</div>
            <div className="text-white/60 font-medium">Categories</div>
          </div>
        </div>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
    </div>
  );
}
