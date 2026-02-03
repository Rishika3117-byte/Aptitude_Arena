import { Question } from './questionGenerators';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Pattern Completion
function generatePatternQuestion(): Question {
  const patterns = [
    { sequence: '■ □ ■ □ ■ ?', answer: '□', wrongs: ['■', '▲', '●'] },
    { sequence: '● ● ■ ● ● ■ ● ● ?', answer: '■', wrongs: ['●', '□', '▲'] },
    { sequence: '▲ ▲ ● ▲ ▲ ● ▲ ▲ ?', answer: '●', wrongs: ['▲', '■', '□'] },
  ];
  
  const selected = patterns[randomInt(0, patterns.length - 1)];
  const options = shuffle([selected.answer, ...selected.wrongs]);
  
  return {
    id: `pattern-${Date.now()}-${Math.random()}`,
    question: `Complete the pattern: ${selected.sequence}`,
    options,
    correctAnswer: options.indexOf(selected.answer),
    explanation: `The pattern repeats and the next symbol is ${selected.answer}.`,
    topic: 'Pattern Completion',
    hint: `Look for a repeating sequence or pattern in the symbols. Count how many symbols there are before the pattern repeats. What comes next in the cycle?`,
  };
}

// Mirror Images
function generateMirrorQuestion(): Question {
  const words = [
    { word: 'BOOK', mirror: 'ʞOOꓭ', wrongs: ['KOOB', 'BOOX', 'BOKO'] },
    { word: 'CAT', mirror: 'TⱯƆ', wrongs: ['TAC', 'ACT', 'CTA'] },
    { word: 'SUN', mirror: 'NUꙄ', wrongs: ['NUS', 'USN', 'NSU'] },
  ];
  
  const selected = words[randomInt(0, words.length - 1)];
  const options = shuffle([selected.mirror, ...selected.wrongs]);
  
  return {
    id: `mirror-${Date.now()}-${Math.random()}`,
    question: `What is the mirror image of: ${selected.word}`,
    options,
    correctAnswer: options.indexOf(selected.mirror),
    explanation: `In a mirror, letters are horizontally flipped.`,
    topic: 'Mirror Images',
    hint: `Imagine holding the word up to a mirror. Each letter would be flipped horizontally (left becomes right). Some letters look the same when mirrored (like A, H, O) while others look different.`,
  };
}

// Figure Counting
function generateCountingQuestion(): Question {
  const shapes = [
    { question: 'How many triangles in a 2x2 grid divided diagonally?', answer: '8', wrongs: ['4', '6', '10'] },
    { question: 'How many rectangles in a 2x2 grid?', answer: '9', wrongs: ['4', '8', '12'] },
    { question: 'How many squares in a 3x3 grid?', answer: '14', wrongs: ['9', '12', '16'] },
  ];
  
  const selected = shapes[randomInt(0, shapes.length - 1)];
  const options = shuffle([selected.answer, ...selected.wrongs]);
  
  return {
    id: `counting-${Date.now()}-${Math.random()}`,
    question: selected.question,
    options,
    correctAnswer: options.indexOf(selected.answer),
    explanation: `By systematic counting, the answer is ${selected.answer}.`,
    topic: 'Figure Counting',
    hint: `Count systematically. First count all small figures, then medium ones, then large ones. Don't forget figures that overlap or are inside other figures. Add them all up.`,
  };
}

// Paper Folding
function generateFoldingQuestion(): Question {
  const folds = [
    { 
      question: 'A square paper is folded in half and a corner is cut. How many holes when unfolded?',
      answer: '2',
      wrongs: ['1', '4', '8']
    },
    { 
      question: 'A paper folded twice and punched once. How many holes when unfolded?',
      answer: '4',
      wrongs: ['2', '3', '8']
    },
  ];
  
  const selected = folds[randomInt(0, folds.length - 1)];
  const options = shuffle([selected.answer, ...selected.wrongs]);
  
  return {
    id: `folding-${Date.now()}-${Math.random()}`,
    question: selected.question,
    options,
    correctAnswer: options.indexOf(selected.answer),
    explanation: `When unfolded, there will be ${selected.answer} holes due to the folding pattern.`,
    topic: 'Paper Folding',
    hint: `When paper is folded and a hole is punched, it creates multiple holes when unfolded. Each fold doubles the number of holes. Think about how many layers the paper has after folding.`,
  };
}

// Embedded Figures
function generateEmbeddedQuestion(): Question {
  const figures = [
    { 
      question: 'Which simple figure is embedded in the complex pattern?',
      answer: 'Triangle',
      wrongs: ['Square', 'Circle', 'Pentagon']
    },
    { 
      question: 'Identify the hidden shape in the given figure:',
      answer: 'Rectangle',
      wrongs: ['Triangle', 'Hexagon', 'Oval']
    },
  ];
  
  const selected = figures[randomInt(0, figures.length - 1)];
  const options = shuffle([selected.answer, ...selected.wrongs]);
  
  return {
    id: `embedded-${Date.now()}-${Math.random()}`,
    question: selected.question,
    options,
    correctAnswer: options.indexOf(selected.answer),
    explanation: `The ${selected.answer} is embedded in the complex figure.`,
    topic: 'Embedded Figures',
    hint: `Look for the simple shape hidden within the complex figure. Trace the outline with your eyes, ignoring extra lines and decorations. The basic shape is embedded somewhere in the pattern.`,
  };
}

export function generateNonverbalQuestion(_level: number = 1): Question {
  const generators = [
    generatePatternQuestion,
    generateMirrorQuestion,
    generateCountingQuestion,
    generateFoldingQuestion,
    generateEmbeddedQuestion,
  ];
  
  const randomGenerator = generators[randomInt(0, generators.length - 1)];
  return randomGenerator();
}

export function generateNonverbalQuestionSet(count: number, level: number = 1): Question[] {
  const questions: Question[] = [];
  const usedQuestions = new Set<string>();
  
  while (questions.length < count) {
    const question = generateNonverbalQuestion(level);
    if (!usedQuestions.has(question.question)) {
      questions.push(question);
      usedQuestions.add(question.question);
    }
  }
  
  return questions;
}
