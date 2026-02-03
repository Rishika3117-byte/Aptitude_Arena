import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Clock, Award, CheckCircle2, XCircle, Sparkles, Lightbulb, Timer, TimerOff } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { generateQuestionSet, Question } from '../utils/questionGenerators';
import { generateLogicalQuestionSet } from '../utils/logicalQuestionGenerator';
import { generateVerbalQuestionSet } from '../utils/verbalQuestionGenerator';
import { generateNonverbalQuestionSet } from '../utils/nonverbalQuestionGenerator';
import { generateDatavisQuestionSet } from '../utils/datavisQuestionGenerator';
import DataVisChart from '../components/DataVisChart';

interface DataVisQuestion extends Question {
  chartType?: 'bar' | 'pie' | 'line';
  chartData?: any[];
  chartTitle?: string;
  xKey?: string;
  yKey?: string;
}
import Confetti from '../components/Confetti';
import MusicToggle from '../components/MusicToggle';
import { updateLevelProgress } from '../utils/gameProgress';

export default function GamePlay() {
  const { gameId, level } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [showHint, setShowHint] = useState(false);

  const levelNum = parseInt(level || '1');
  const questionCount = 5;

  // Generate questions on mount
  useEffect(() => {
    let newQuestions: Question[] = [];
    
    switch (gameId) {
      case 'quantitative':
        newQuestions = generateQuestionSet(questionCount, levelNum);
        break;
      case 'logical':
        newQuestions = generateLogicalQuestionSet(questionCount, levelNum);
        break;
      case 'verbal':
        newQuestions = generateVerbalQuestionSet(questionCount, levelNum);
        break;
      case 'nonverbal':
        newQuestions = generateNonverbalQuestionSet(questionCount, levelNum);
        break;
      case 'datavis':
        newQuestions = generateDatavisQuestionSet(questionCount, levelNum);
        break;
      default:
        newQuestions = generateQuestionSet(questionCount, levelNum);
    }
    
    setQuestions(newQuestions);
  }, [gameId, levelNum]);

  // Timer
  useEffect(() => {
    if (!timerEnabled || gameOver || showExplanation || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver, showExplanation, timerEnabled]);

  const handleTimeout = () => {
    setShowExplanation(true);
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null || showExplanation) return;

    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      const timeBonus = timerEnabled ? timeLeft * 10 : 100;
      setScore(score + timeBonus);
      setCorrectAnswers(correctAnswers + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    setShowExplanation(true);

    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowHint(false);
      setTimeLeft(30);
    } else {
      // Save progress when game ends
      await updateLevelProgress(
        gameId || 'quantitative',
        levelNum,
        score,
        correctAnswers,
        questions.length
      );
      setGameOver(true);
    }
  };

  const restartGame = () => {
    let newQuestions: Question[] = [];
    
    switch (gameId) {
      case 'quantitative':
        newQuestions = generateQuestionSet(questionCount, levelNum);
        break;
      case 'logical':
        newQuestions = generateLogicalQuestionSet(questionCount, levelNum);
        break;
      case 'verbal':
        newQuestions = generateVerbalQuestionSet(questionCount, levelNum);
        break;
      case 'nonverbal':
        newQuestions = generateNonverbalQuestionSet(questionCount, levelNum);
        break;
      case 'datavis':
        newQuestions = generateDatavisQuestionSet(questionCount, levelNum);
        break;
      default:
        newQuestions = generateQuestionSet(questionCount, levelNum);
    }
    
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setCorrectAnswers(0);
    setShowHint(false);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading questions...</div>
      </div>
    );
  }

  if (gameOver) {
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AnimatedBackground />
        {accuracy >= 60 && <Confetti />}
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 max-w-2xl w-full text-center">
            <Award className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
            
            <h2 className="text-5xl font-black text-white mb-4">Level Complete!</h2>
            <p className="text-xl text-white/70 mb-8">Level {levelNum}</p>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-4xl font-bold text-cyan-400 mb-2">{score}</div>
                <div className="text-white/60">Total Score</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-4xl font-bold text-green-400 mb-2">{correctAnswers}/{questions.length}</div>
                <div className="text-white/60">Correct</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-4xl font-bold text-purple-400 mb-2">{accuracy}%</div>
                <div className="text-white/60">Accuracy</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              {accuracy >= 60 && levelNum < 50 && (
                <button
                  onClick={() => navigate(`/game/${gameId}/${levelNum + 1}`)}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/50"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Next Level
                </button>
              )}
              <button
                onClick={restartGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Play Again
              </button>
              <button
                onClick={() => navigate(`/levels/${gameId}`)}
                className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Level Map
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <AnimatedBackground />
      {showConfetti && <Confetti />}
      <MusicToggle />

      {/* Header */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/levels/${gameId}`)}
            className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-white font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit
          </button>

          <div className="flex items-center gap-3">
            {/* Timer Toggle */}
            <button
              onClick={() => setTimerEnabled(!timerEnabled)}
              className={`flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full border transition-all duration-300 ${
                timerEnabled 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                  : 'bg-white/10 border-white/20 text-white/60'
              }`}
              title={timerEnabled ? 'Timer ON' : 'Timer OFF'}
            >
              {timerEnabled ? (
                <Timer className="w-5 h-5" />
              ) : (
                <TimerOff className="w-5 h-5" />
              )}
            </button>

            {/* Timer Display */}
            {timerEnabled && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
            )}
            
            {/* Score */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-bold text-white">{score}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mt-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/60 text-sm mt-2 text-center">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
      </div>

      {/* Question Card */}
      <div className="relative z-10 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 animate-fade-in">
            
            {/* Topic Badge and Hint Button */}
            <div className="flex items-center justify-between mb-6">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-semibold text-sm">
                {currentQuestion.topic}
              </div>
              
              {/* Hint Button */}
              <button
                onClick={() => setShowHint(!showHint)}
                disabled={showExplanation}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  showHint 
                    ? 'bg-yellow-500/30 border-2 border-yellow-400 text-yellow-300' 
                    : 'bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                } ${showExplanation ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                <Lightbulb className={`w-5 h-5 ${showHint ? 'animate-pulse' : ''}`} />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            </div>

            {/* Hint Panel */}
            {showHint && !showExplanation && (
              <div className="mb-6 p-6 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl animate-slide-up">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-yellow-400 mb-2">💡 Hint</h4>
                    <p className="text-white/90 leading-relaxed whitespace-pre-line">{currentQuestion.hint}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Question */}
            <h3 className="text-3xl font-bold text-white mb-8 leading-relaxed">
              {currentQuestion.question}
            </h3>

            {/* Data Visualization Chart */}
            {gameId === 'datavis' && (currentQuestion as DataVisQuestion).chartType && (
              <div className="mb-8">
                <DataVisChart
                  type={(currentQuestion as DataVisQuestion).chartType!}
                  data={(currentQuestion as DataVisQuestion).chartData || []}
                  title={(currentQuestion as DataVisQuestion).chartTitle}
                  xKey={(currentQuestion as DataVisQuestion).xKey}
                  yKey={(currentQuestion as DataVisQuestion).yKey}
                />
              </div>
            )}

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showResult = showExplanation;

                let className = "w-full p-6 rounded-2xl text-left text-lg font-semibold transition-all duration-300 border-2 ";
                
                if (!showResult) {
                  className += "bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 hover:scale-102 text-white cursor-pointer";
                } else if (isCorrect) {
                  className += "bg-green-500/20 border-green-500 text-white cursor-not-allowed";
                } else if (isSelected && !isCorrect) {
                  className += "bg-red-500/20 border-red-500 text-white cursor-not-allowed";
                } else {
                  className += "bg-white/5 border-white/10 text-white/50 cursor-not-allowed";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation || selectedAnswer !== null}
                    className={className}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-400" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl animate-slide-up">
                <h4 className="text-lg font-bold text-blue-400 mb-2">Explanation</h4>
                <p className="text-white/80 leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
