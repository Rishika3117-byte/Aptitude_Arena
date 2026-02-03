interface ProgressBarProps {
  progress: number;
  color: string;
  height?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ 
  progress, 
  color, 
  height = 'h-3',
  showLabel = true 
}: ProgressBarProps) {
  return (
    <div className="relative">
      <div className={`w-full ${height} bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/10`}>
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out rounded-full relative overflow-hidden`}
          style={{ width: `${progress}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>
      
      {showLabel && (
        <div className="absolute right-0 -top-6 text-white/80 text-sm font-semibold">
          {progress}%
        </div>
      )}
    </div>
  );
}
