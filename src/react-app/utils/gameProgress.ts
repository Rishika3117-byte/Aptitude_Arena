// Game progress tracking utility
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

export interface GameProgress {
  gameId: string;
  levelsCompleted: number[];
  totalScore: number;
  totalGamesPlayed: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface UserStats {
  totalScore: number;
  gamesPlayed: number;
  currentStreak: number;
  lastPlayedDate: string;
  bestStreak: number;
  accuracy: number;
}

const STORAGE_KEY_PROGRESS = 'aptitude_arena_progress';
const STORAGE_KEY_STATS = 'aptitude_arena_stats';

// Firebase user ID
let userId: string | null = null;

// Initialize Firebase auth
signInAnonymously(auth).catch((error) => {
  console.error('Anonymous auth failed:', error);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
  }
});

// Helper to get Firestore doc refs
const getProgressDoc = () => userId ? doc(db, 'users', userId, 'data', 'progress') : null;
const getStatsDoc = () => userId ? doc(db, 'users', userId, 'data', 'stats') : null;

// Get all game progress
export async function getAllGameProgress(): Promise<Record<string, GameProgress>> {
  if (typeof window === 'undefined') return {};
  
  const progressDoc = getProgressDoc();
  if (progressDoc) {
    try {
      const docSnap = await getDoc(progressDoc);
      if (docSnap.exists()) {
        return docSnap.data() as Record<string, GameProgress>;
      }
    } catch (error) {
      console.error('Error fetching progress from Firebase:', error);
    }
  }
  
  // Fallback to localStorage
  const stored = localStorage.getItem(STORAGE_KEY_PROGRESS);
  if (!stored) {
    return initializeProgress();
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return initializeProgress();
  }
}

// Initialize default progress for all games
function initializeProgress(): Record<string, GameProgress> {
  const gameIds = ['quantitative', 'logical', 'verbal', 'nonverbal', 'datavis'];
  const progress: Record<string, GameProgress> = {};
  
  gameIds.forEach(gameId => {
    progress[gameId] = {
      gameId,
      levelsCompleted: [],
      totalScore: 0,
      totalGamesPlayed: 0,
      correctAnswers: 0,
      totalQuestions: 0,
    };
  });
  
  return progress;
}

// Save game progress
export async function saveGameProgress(progress: Record<string, GameProgress>): Promise<void> {
  if (typeof window === 'undefined') return;
  
  // Save to localStorage as backup
  localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  
  // Save to Firebase
  const progressDoc = getProgressDoc();
  if (progressDoc) {
    try {
      await setDoc(progressDoc, progress);
    } catch (error) {
      console.error('Error saving progress to Firebase:', error);
    }
  }
}

// Update progress after completing a level
export async function updateLevelProgress(
  gameId: string,
  level: number,
  score: number,
  correctAnswers: number,
  totalQuestions: number
): Promise<void> {
  const allProgress = await getAllGameProgress();
  
  if (!allProgress[gameId]) {
    allProgress[gameId] = {
      gameId,
      levelsCompleted: [],
      totalScore: 0,
      totalGamesPlayed: 0,
      correctAnswers: 0,
      totalQuestions: 0,
    };
  }
  
  const gameProgress = allProgress[gameId];
  
  // Add level to completed if not already there
  if (!gameProgress.levelsCompleted.includes(level)) {
    gameProgress.levelsCompleted.push(level);
  }
  
  gameProgress.totalScore += score;
  gameProgress.totalGamesPlayed += 1;
  gameProgress.correctAnswers += correctAnswers;
  gameProgress.totalQuestions += totalQuestions;
  
  await saveGameProgress(allProgress);
  await updateUserStats(score);
}

// Get user stats
export async function getUserStats(): Promise<UserStats> {
  if (typeof window === 'undefined') {
    return {
      totalScore: 0,
      gamesPlayed: 0,
      currentStreak: 0,
      lastPlayedDate: '',
      bestStreak: 0,
      accuracy: 0,
    };
  }
  
  const statsDoc = getStatsDoc();
  if (statsDoc) {
    try {
      const docSnap = await getDoc(statsDoc);
      if (docSnap.exists()) {
        return docSnap.data() as UserStats;
      }
    } catch (error) {
      console.error('Error fetching stats from Firebase:', error);
    }
  }
  
  // Fallback to localStorage
  const stored = localStorage.getItem(STORAGE_KEY_STATS);
  if (!stored) {
    return {
      totalScore: 0,
      gamesPlayed: 0,
      currentStreak: 0,
      lastPlayedDate: '',
      bestStreak: 0,
      accuracy: 0,
    };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return {
      totalScore: 0,
      gamesPlayed: 0,
      currentStreak: 0,
      lastPlayedDate: '',
      bestStreak: 0,
      accuracy: 0,
    };
  }
}

// Save user stats
export async function saveUserStats(stats: UserStats): Promise<void> {
  if (typeof window === 'undefined') return;
  
  // Save to localStorage as backup
  localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  
  // Save to Firebase
  const statsDoc = getStatsDoc();
  if (statsDoc) {
    try {
      await setDoc(statsDoc, stats);
    } catch (error) {
      console.error('Error saving stats to Firebase:', error);
    }
  }
}

// Update user stats after a game
async function updateUserStats(score: number): Promise<void> {
  const stats = await getUserStats();
  
  stats.totalScore += score;
  stats.gamesPlayed += 1;
  
  // Update accuracy
  const allProgress = await getAllGameProgress();
  let totalCorrect = 0;
  let totalQ = 0;
  
  Object.values(allProgress).forEach(progress => {
    totalCorrect += progress.correctAnswers;
    totalQ += progress.totalQuestions;
  });
  
  stats.accuracy = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;
  
  // Update streak
  const today = new Date().toDateString();
  const lastPlayed = stats.lastPlayedDate;
  
  if (lastPlayed === today) {
    // Already played today, streak unchanged
  } else if (lastPlayed === '') {
    // First time playing
    stats.currentStreak = 1;
    stats.bestStreak = 1;
  } else {
    const lastDate = new Date(lastPlayed);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day
      stats.currentStreak += 1;
      if (stats.currentStreak > stats.bestStreak) {
        stats.bestStreak = stats.currentStreak;
      }
    } else if (diffDays > 1) {
      // Streak broken
      stats.currentStreak = 1;
    }
  }
  
  stats.lastPlayedDate = today;
  await saveUserStats(stats);
}

// Get game progress for dashboard
export async function getGameProgressForDashboard() {
  const allProgress = await getAllGameProgress();
  
  const gameNames: Record<string, string> = {
    quantitative: 'Quantitative Aptitude',
    logical: 'Logical Reasoning',
    verbal: 'Verbal Reasoning',
    nonverbal: 'Non-Verbal Reasoning',
    datavis: 'Data Visualization',
  };
  
  const gameColors: Record<string, string> = {
    quantitative: 'from-blue-500 to-cyan-500',
    logical: 'from-purple-500 to-pink-500',
    verbal: 'from-green-500 to-emerald-500',
    nonverbal: 'from-orange-500 to-amber-500',
    datavis: 'from-indigo-500 to-blue-500',
  };
  
  const totalLevels = 20; // Each game has 20 levels
  
  return Object.entries(allProgress).map(([gameId, progress]) => ({
    id: gameId,
    name: gameNames[gameId] || gameId,
    progress: Math.round((progress.levelsCompleted.length / totalLevels) * 100),
    completed: progress.levelsCompleted.length,
    total: totalLevels,
    color: gameColors[gameId] || 'from-gray-500 to-gray-600',
    score: progress.totalScore,
  }));
}

// Check if level is unlocked
export async function isLevelUnlocked(gameId: string, level: number): Promise<boolean> {
  if (level <= 3) return true; // First 3 levels always unlocked
  
  const allProgress = await getAllGameProgress();
  const gameProgress = allProgress[gameId];
  
  if (!gameProgress) return false;
  
  // Level is unlocked if previous level is completed
  return gameProgress.levelsCompleted.includes(level - 1);
}

// Get level completion status
export async function getLevelStatus(gameId: string, level: number): Promise<{ isCompleted: boolean; stars: number }> {
  const allProgress = await getAllGameProgress();
  const gameProgress = allProgress[gameId];
  
  if (!gameProgress) return { isCompleted: false, stars: 0 };
  
  const isCompleted = gameProgress.levelsCompleted.includes(level);
  // For now, all completed levels get 3 stars (can be enhanced later)
  const stars = isCompleted ? 3 : 0;
  
  return { isCompleted, stars };
}
