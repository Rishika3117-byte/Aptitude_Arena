import { useEffect, useState } from 'react';

interface StreakFlameProps {
  count: number;
}

export default function StreakFlame({ }: StreakFlameProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    // Generate flame particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 40 - 20, // Random horizontal offset
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Flame particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full bg-gradient-to-t from-blue-500 via-cyan-400 to-white opacity-80"
            style={{
              transform: `translateX(${particle.x}px)`,
              animation: `flame-rise 2s ease-in infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main flame */}
      <div className="relative z-10">
        <svg
          viewBox="0 0 100 140"
          className="w-24 h-32 drop-shadow-2xl animate-flame-flicker"
          style={{ filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.8))' }}
        >
          {/* Outer flame - blue */}
          <path
            d="M50 10 C30 30, 20 50, 20 70 C20 95, 30 110, 50 120 C70 110, 80 95, 80 70 C80 50, 70 30, 50 10 Z"
            fill="url(#blueGradient)"
            className="animate-pulse"
          />
          
          {/* Middle flame - cyan */}
          <path
            d="M50 20 C35 35, 30 50, 30 65 C30 85, 38 98, 50 105 C62 98, 70 85, 70 65 C70 50, 65 35, 50 20 Z"
            fill="url(#cyanGradient)"
            className="animate-pulse"
            style={{ animationDelay: '0.3s' }}
          />
          
          {/* Inner flame - white/light blue */}
          <path
            d="M50 30 C40 42, 38 52, 38 62 C38 75, 42 85, 50 90 C58 85, 62 75, 62 62 C62 52, 60 42, 50 30 Z"
            fill="url(#whiteGradient)"
            className="animate-pulse"
            style={{ animationDelay: '0.6s' }}
          />
          
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.7" />
            </linearGradient>
            
            <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0891B2" stopOpacity="0.8" />
            </linearGradient>
            
            <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/40 via-cyan-400/30 to-transparent rounded-full blur-2xl animate-pulse"></div>

      <style>{`
        @keyframes flame-rise {
          0% {
            transform: translateX(var(--x)) translateY(0) scale(1);
            opacity: 0.8;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(var(--x)) translateY(-120px) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes flame-flicker {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          25% {
            transform: scale(1.05) translateY(-2px);
          }
          50% {
            transform: scale(0.98) translateY(1px);
          }
          75% {
            transform: scale(1.02) translateY(-1px);
          }
        }

        .animate-flame-flicker {
          animation: flame-flicker 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
